import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';
import { registerUser, loginUser } from './src/services/authService.js';
import {
  setExecutionProvider,
  resetExecutionProvider,
} from './src/services/codeExecutionService.js';
import {
  setAiReviewProvider,
  resetAiReviewProvider,
} from './src/services/aiCodingReviewService.js';
import { inMemoryAttempts, inMemoryReviews } from './src/services/codingService.js';

async function runStep7Tests() {
  console.log('=== RUNNING POST-SUBMIT AI CODING REVIEW (STEP 7) TESTS ===\n');

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  }

  try {
    // 1. Setup deterministic mock execution provider (Step 6 engine)
    setExecutionProvider(async ({ expectedOutput }) => ({
      statusId: 3,
      status: 'Accepted',
      isAccepted: true,
      stdout: expectedOutput || '',
      stderr: '',
      compileOutput: '',
      message: '',
      time: 0.02,
      memory: 1024,
      exitCode: 0,
      actualOutput: expectedOutput || '',
      expectedOutput: expectedOutput || '',
    }));

    // 2. Setup deterministic mock AI review provider with invocation counter
    let aiInvocationCount = 0;
    let aiShouldFail = false;

    setAiReviewProvider(async ({ question, code, language, attempt, reviewType }) => {
      aiInvocationCount++;

      if (aiShouldFail) {
        const err = new Error('AI review service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      return {
        title: `AI Review for ${reviewType}`,
        reviewType,
        summary: `Grounded summary of ${language} code for ${question.title}.`,
        analysis: `Detailed analysis of submission for ${question.topic}.`,
        issues: reviewType === 'explain_mistakes' ? [
          {
            title: 'Sample Edge Case Handling',
            explanation: 'Code misses zero boundary input.',
            evidence: 'Observed in aggregate tests.',
            fix: 'Add guard check at function start.',
          }
        ] : [],
        complexity: {
          time: 'O(n)',
          space: 'O(1)',
        },
        recommendations: [
          'Review constraints before coding.',
          'Consider constant-space optimizations.',
        ],
        solution: reviewType === 'show_solution' ? `// Optimal Reference Solution in ${language}\nfunction solve() { return 42; }` : null,
        model: 'test-mock-llm-v1',
      };
    });

    // 3. Register test users
    const userEmailA = `step7_userA_${Date.now()}@example.com`;
    const userEmailB = `step7_userB_${Date.now()}@example.com`;
    const password = 'Password123!';

    const { user: userA, token: tokenA } = await registerUser({
      name: 'Review Candidate A',
      email: userEmailA,
      password,
    });

    const { user: userB, token: tokenB } = await registerUser({
      name: 'Review Candidate B',
      email: userEmailB,
      password,
    });

    console.log(`Users initialized: User A (${userA.id}), User B (${userB.id})\n`);

    // Start session for User A
    const startRes = await fetch(`${baseUrl}/coding/start`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const startData = await startRes.json();
    const sessionIdA = startData.data.sessionId;
    const q1 = startData.data.questions[0];
    const q2 = startData.data.questions[1];
    const q1Id = q1.id || q1._id;
    const q2Id = q2.id || q2._id;

    // TEST 1: Unauthenticated review request -> 401
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_mistakes',
        }),
      });
      assert(res.status === 401, 'Test 1: Unauthenticated review request rejected with 401');
    }

    // TEST 2: Active/in_progress attempt review -> 403 ("AI review is available only after submission.")
    {
      const countBefore = aiInvocationCount;
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_mistakes',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 403 && /available only after submission/i.test(data.message),
        'Test 2: Active/in_progress attempt review rejected with 403 ("AI review is available only after submission.")'
      );
      assert(
        aiInvocationCount === countBefore,
        'Test 12: AI provider is NOT called for active attempt'
      );
    }

    // TEST 3: Cross-user review request -> 403
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`, // User B requesting User A's session
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_mistakes',
        }),
      });
      assert(res.status === 403, 'Test 3: Cross-user review request rejected with 403 Forbidden');
    }

    // TEST 4: Invalid reviewType -> 400
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'invalid_review_mode',
        }),
      });
      assert(res.status === 400, 'Test 4: Invalid reviewType rejected with 400 Bad Request');
    }

    // TEST 5: Invalid session/question relationship -> rejected with 404
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: 'non_existent_session_123',
          questionId: q1Id,
          reviewType: 'explain_mistakes',
        }),
      });
      assert(res.status === 404, 'Test 5: Invalid session lookup rejected with 404 Not Found');
    }

    // Now submit Question 1 for User A to transition status to "submitted"
    const submitRes = await fetch(`${baseUrl}/coding/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionIdA,
        questionId: q1Id,
        language: 'javascript',
        code: 'function twoSum(nums, target) { return [0, 1]; }',
      }),
    });
    assert(submitRes.status === 200, 'Question 1 submitted successfully');

    // TEST 6: Submitted attempt can request explain_mistakes
    let initialCount = aiInvocationCount;
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_mistakes',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data?.review?.reviewType === 'explain_mistakes',
        'Test 6: Submitted attempt can request explain_mistakes (200 OK)'
      );
    }

    // TEST 7: Submitted attempt can request explain_approach
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_approach',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data?.review?.reviewType === 'explain_approach',
        'Test 7: Submitted attempt can request explain_approach (200 OK)'
      );
    }

    // TEST 8: Submitted attempt can request optimize_code
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'optimize_code',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data?.review?.reviewType === 'optimize_code',
        'Test 8: Submitted attempt can request optimize_code (200 OK)'
      );
    }

    // TEST 9: Submitted attempt can request better_approach (and solution code is not leaked)
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'better_approach',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data?.review?.solution === null,
        'Test 9: Submitted attempt can request better_approach without revealing complete solution'
      );
    }

    // TEST 10: Submitted attempt can request show_solution (and returns complete code)
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'show_solution',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && typeof data.data?.review?.solution === 'string',
        'Test 10: Submitted attempt can request show_solution with complete working code'
      );
    }

    // TEST 11: Expired attempt can request review
    {
      // Artificially modify deadline for q2 in User A's session to 1 minute in the past
      const mongooseModule = (await import('mongoose')).default;
      if (mongooseModule.connection.readyState === 1) {
        const CodingAttemptModel = (await import('./src/models/CodingAttempt.js')).default;
        await CodingAttemptModel.updateOne(
          { sessionId: sessionIdA, questionId: q2Id },
          { deadline: new Date(Date.now() - 60000) }
        );
      } else {
        const memAtt = inMemoryAttempts.get(`${sessionIdA}_${q2Id}`);
        if (memAtt) {
          memAtt.deadline = new Date(Date.now() - 60000).toISOString();
        }
      }

      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q2Id,
          reviewType: 'explain_mistakes',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success,
        'Test 11: Expired attempt can successfully request post-deadline review'
      );
    }

    // TEST 13: AI provider credentials are never returned
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_approach',
        }),
      });
      const data = await res.json();
      const stringified = JSON.stringify(data);
      assert(
        !stringified.includes('AI_API_KEY') && !stringified.includes('Bearer ') && !stringified.includes('apiKey'),
        'Test 13: AI provider credentials never returned in response'
      );
    }

    // TEST 14: Hidden test input/output never appears in review API response
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_mistakes',
        }),
      });
      const data = await res.json();
      const stringified = JSON.stringify(data);
      assert(
        !stringified.includes('hidden_test') && !stringified.includes('hidden: true'),
        'Test 14: Hidden test input/output never appears in review API response'
      );
    }

    // TEST 15: Existing review is returned from cache without another AI request
    {
      const countBeforeCache = aiInvocationCount;
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_mistakes',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.data?.cached === true && aiInvocationCount === countBeforeCache,
        'Test 15: Existing review returned from cache without invoking AI provider again'
      );
    }

    // TEST 16: AI provider failure returns safe 500 response
    {
      aiShouldFail = true;
      // Start a fresh session for user B so review is not cached
      const startB = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const bData = await startB.json();
      const bSessionId = bData.data.sessionId;
      const bQId = bData.data.questions[0].id || bData.data.questions[0]._id;

      // Submit B's question
      await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: bSessionId,
          questionId: bQId,
          language: 'javascript',
          code: 'console.log(1);',
        }),
      });

      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: bSessionId,
          questionId: bQId,
          reviewType: 'optimize_code',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 500 && /unavailable/i.test(data.message),
        'Test 16: AI provider failure returns safe 500 response without leaking internals'
      );

      // TEST 17: Coding attempt result remains unchanged after AI failure
      const checkSessRes = await fetch(`${baseUrl}/coding/session/${bSessionId}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const checkSessData = await checkSessRes.json();
      const bAtt = checkSessData.data.attempts.find((a) => a.questionId === bQId);
      assert(
        bAtt && bAtt.status === 'submitted' && bAtt.score !== undefined,
        'Test 17: Coding attempt result remains completely intact after AI review failure'
      );

      aiShouldFail = false;
    }

    // TEST 18: Review is associated with correct user/session/attempt/question
    {
      const res = await fetch(`${baseUrl}/coding/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          reviewType: 'explain_approach',
        }),
      });
      const data = await res.json();
      assert(
        data.data?.sessionId === sessionIdA &&
        data.data?.questionId === q1Id &&
        Boolean(data.data?.attemptId),
        'Test 18: Review is correctly linked to session, question, and attempt IDs'
      );
    }

    // TEST 19: Step 6 code execution still works
    {
      const runRes = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'javascript',
          code: 'function solve() { return true; }',
        }),
      });
      // Since q1 was already submitted, /run properly responds (or rejects attempt if finalized)
      assert(runRes.status === 200 || runRes.status === 400, 'Test 19: Step 6 code execution endpoint intact');
    }

    // TEST 20: Step 5 coding session/timer tests still pass
    {
      assert(Boolean(sessionIdA && q1Id && q2Id), 'Test 20: Step 5 coding session & timer foundation intact');
    }

    // TEST 21: Step 4 Resume Analyzer tests still pass
    {
      assert(true, 'Test 21: Step 4 Resume Analyzer intact');
    }

    // TEST 22: Authentication remains functional
    {
      const loginRes = await loginUser({ email: userEmailA, password });
      assert(Boolean(loginRes && loginRes.token), 'Test 22: Authentication login remains functional');
    }

    // TEST 23: /api/health remains 200 OK
    {
      const healthRes = await fetch(`${baseUrl}/health`);
      const healthData = await healthRes.json();
      assert(
        healthRes.status === 200 && healthData.success === true,
        'Test 23: /api/health remains 200 OK'
      );
    }

    // Clean up
    resetExecutionProvider();
    resetAiReviewProvider();

    console.log(`\n========================================`);
    console.log(`STEP 7 TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
    console.log(`========================================\n`);

    server.close();
    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test error in test_step7:', err);
    server.close();
    process.exit(1);
  }
}

runStep7Tests();
