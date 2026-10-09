import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';
import { registerUser, loginUser } from './src/services/authService.js';
import { saveCodingCode } from './src/services/codingService.js';
import { setExecutionProvider } from './src/services/codeExecutionService.js';

// Setup mock execution provider for Step 5 regression tests
setExecutionProvider(async ({ stdin, expectedOutput }) => ({
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

async function runStep5Tests() {
  console.log('=== RUNNING CODING ROUND (STEP 5) TESTS ===\n');

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
    // Setup Test Users
    const userEmailA = `alpha_coder_${Date.now()}@example.com`;
    const userPass = 'Password123!';
    const { user: userA, token: tokenA } = await registerUser({
      name: 'Alpha Coder',
      email: userEmailA,
      password: userPass,
    });

    const userEmailB = `beta_coder_${Date.now()}@example.com`;
    const { user: userB, token: tokenB } = await registerUser({
      name: 'Beta Coder',
      email: userEmailB,
      password: userPass,
    });

    console.log(`Test users initialized: User A (${userA.id}), User B (${userB.id})\n`);

    // TEST 1: Unauthenticated /api/coding/start -> 401
    {
      const res = await fetch(`${baseUrl}/coding/start`);
      assert(res.status === 401, 'Test 1: Unauthenticated /api/coding/start returns 401');
    }

    // TEST 2, 3, 4, 5, 6, 12: Authenticated user can start a session
    let sessionId = null;
    let questions = [];
    let attempts = [];
    {
      const res = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();

      assert(res.status === 201 && data.success && data.data, 'Test 2: Authenticated user can start a coding session (201)');

      sessionId = data.data?.sessionId;
      questions = data.data?.questions || [];
      attempts = data.data?.attempts || [];

      // Test 3: Exactly 2 attempts created
      assert(attempts.length === 2 && questions.length === 2, 'Test 3: Exactly 2 attempts and 2 questions are returned');

      // Test 4: The two question IDs are valid and distinct
      const q1Id = questions[0]?.id || questions[0]?._id;
      const q2Id = questions[1]?.id || questions[1]?._id;
      assert(Boolean(q1Id && q2Id && q1Id !== q2Id), 'Test 4: The two question IDs are valid, distinct, non-empty');

      // Test 5: Each question has its own deadline
      const d1 = new Date(attempts[0]?.deadline);
      const d2 = new Date(attempts[1]?.deadline);
      assert(
        !isNaN(d1.getTime()) && !isNaN(d2.getTime()),
        'Test 5: Each question attempt has its own valid deadline'
      );

      // Test 6: Deadline is approximately 30 minutes from its own startedAt
      const s1 = new Date(attempts[0]?.startedAt);
      const diffMs1 = d1.getTime() - s1.getTime();
      const expected30MinMs = 30 * 60 * 1000;
      // Allow minor leeway (+/- 5000 ms)
      const isApprox30Mins = Math.abs(diffMs1 - expected30MinMs) < 5000;
      assert(isApprox30Mins, `Test 6: Deadline is ~30 mins from startedAt (diff: ${diffMs1 / 60000} mins)`);

      // Test 12: Hidden test cases are NOT exposed
      let hiddenExposed = false;
      for (const q of questions) {
        if (Array.isArray(q.testCases)) {
          for (const tc of q.testCases) {
            if (tc.hidden === true) hiddenExposed = true;
          }
        }
      }
      assert(!hiddenExposed, 'Test 12: Hidden test cases are NOT exposed in question payload');
    }

    // TEST 7: Session retrieval works for owner -> 200
    {
      const res = await fetch(`${baseUrl}/coding/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data?.sessionId === sessionId,
        'Test 7: Owner can retrieve active session details (200 OK)'
      );
    }

    // TEST 8: Cross-user session retrieval -> 403 Forbidden
    {
      const res = await fetch(`${baseUrl}/coding/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(res.status === 403, 'Test 8: Cross-user session retrieval rejected with 403 Forbidden');
    }

    // TEST 9: Save code works for owner -> 200
    const q1Id = questions[0]?.id || questions[0]?._id;
    {
      const res = await fetch(`${baseUrl}/coding/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          questionId: q1Id,
          language: 'python',
          code: 'def solution():\n    return 42',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data?.code?.includes('42'),
        'Test 9: Save code works for owner (200 OK with persisted code)'
      );
    }

    // TEST 10: Submitted attempt changes status correctly -> 200
    {
      const res = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          questionId: q1Id,
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data?.status === 'submitted',
        'Test 10: Question submission transitions attempt status to "submitted"'
      );
    }

    // TEST 11: Expired attempt cannot be normally submitted
    {
      const expSessionRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const expData = await expSessionRes.json();
      const expSessionId = expData.data.sessionId;
      const expQId = expData.data.questions[0].id || expData.data.questions[0]._id;

      // Artificially modify stored attempt deadline to 1 minute in the past
      const { inMemoryAttempts } = await import('./src/services/codingService.js');
      const mongooseModule = (await import('mongoose')).default;
      if (mongooseModule.connection.readyState === 1) {
        const CodingAttemptModel = (await import('./src/models/CodingAttempt.js')).default;
        await CodingAttemptModel.updateOne(
          { sessionId: expSessionId, questionId: expQId },
          { deadline: new Date(Date.now() - 60000) }
        );
      } else {
        const memAtt = inMemoryAttempts.get(`${expSessionId}_${expQId}`);
        if (memAtt) {
          memAtt.deadline = new Date(Date.now() - 60000).toISOString();
        }
      }

      // Submitting an expired attempt must fail with 400
      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: expSessionId,
          questionId: expQId,
        }),
      });

      const submitData = await submitRes.json();
      const isExpiredRejected =
        submitRes.status === 400 &&
        submitData.success === false &&
        /expired/i.test(submitData.message || '');

      assert(
        isExpiredRejected,
        'Test 11: Expired attempt cannot be normally submitted (rejected with 400 and expired message)'
      );
    }

    // TEST 13: Invalid question/session access is rejected
    {
      const res = await fetch(`${baseUrl}/coding/session/invalid_session_id_999`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(res.status === 404, 'Test 13: Invalid sessionId lookup returns 404 Not Found');
    }

    // TEST 14: Existing /api/health still works
    {
      const res = await fetch(`${baseUrl}/health`);
      const data = await res.json();
      assert(res.status === 200 && data.success === true, 'Test 14: Existing /api/health endpoint intact (200 OK)');
    }

    // TEST 15: Existing Resume Analyzer route still loads
    {
      const res = await fetch(`${baseUrl}/resume`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      // GET /api/resume without ID returns 404 or method not allowed, but endpoint exists
      // Check GET /api/resume/non_existent_id returns 404 not 500
      const resById = await fetch(`${baseUrl}/resume/res_sample_dummy_999`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(
        resById.status === 404,
        'Test 15: Existing Resume Analyzer API routes still active and responsive'
      );
    }

    // TEST 16: Existing auth flow is not broken
    {
      const loginRes = await loginUser({
        email: userEmailA,
        password: userPass,
      });
      assert(
        loginRes && loginRes.user && loginRes.token,
        'Test 16: Existing authentication login flow remains fully operational'
      );
    }

    console.log(`\n========================================`);
    console.log(`STEP 5 TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
    console.log(`========================================\n`);

    server.close();
    if (failCount > 0) process.exit(1);
    process.exit(0);
  } catch (err) {
    console.error('STEP 5 TEST SUITE FAILED:', err);
    server.close();
    process.exit(1);
  }
}

runStep5Tests();
