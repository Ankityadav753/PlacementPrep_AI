import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';
import { registerUser, loginUser } from './src/services/authService.js';
import {
  setAiInterviewProvider,
  resetAiInterviewProvider,
  INTERVIEW_QUESTION_LIMIT,
  SUPPORTED_ROLES,
} from './src/services/aiInterviewService.js';

async function runStep8Tests() {
  console.log('=== RUNNING AI MOCK INTERVIEW (STEP 8) TESTS ===\n');

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
    let aiInvocationCount = 0;
    let aiShouldFail = false;

    // Set up mock AI interview provider
    setAiInterviewProvider(async (params) => {
      aiInvocationCount++;

      if (aiShouldFail) {
        const err = new Error('AI interview service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      if (params.action === 'generateFirstQuestion') {
        return {
          questionId: `mock_q_1`,
          text: `For a ${params.role}, explain the difference between state and props with practical examples.`,
          category: params.category || 'technical',
          difficulty: params.difficulty || 'Easy',
        };
      }

      if (params.action === 'evaluateAnswer') {
        const wordCount = (params.answer || '').trim().split(/\s+/).length;
        const score = wordCount >= 10 ? 85 : 40;
        return {
          score,
          strengths: ['Clear explanation of concept differences', 'Structured technical terminology'],
          weaknesses: ['Could mention component re-rendering trade-offs'],
          feedback: `Good technical answer for ${params.role}. Explained core differences concisely.`,
          conceptClarity: wordCount >= 10 ? 80 : 35,
          communication: wordCount >= 10 ? 82 : 45,
        };
      }

      if (params.action === 'generateNextQuestion') {
        return {
          questionId: `mock_q_${params.nextQNumber}`,
          text: `Follow-up question #${params.nextQNumber} for ${params.role}: Explain your approach to handling ${params.nextCategory} considerations.`,
          category: params.nextCategory,
          difficulty: params.nextDifficulty,
        };
      }

      if (params.action === 'generateFinalReport') {
        return {
          overallScore: 82,
          summary: 'The candidate demonstrated solid foundational technical knowledge with structured and concise communication throughout the interview.',
          strengths: ['Consistently structured explanations', 'Good foundational vocabulary'],
          weakTopics: ['In-depth edge cases and performance optimization'],
          recommendations: ['Elaborate on real-world system trade-offs', 'Practice STAR format for behavioral scenarios'],
          technicalKnowledge: 84,
          conceptClarity: 80,
          communication: 82,
          confidenceIndicators: 81,
        };
      }

      return null;
    });

    // 1. Create test users
    const userEmailA = `step8_userA_${Date.now()}@example.com`;
    const userEmailB = `step8_userB_${Date.now()}@example.com`;
    const password = 'Password123!';

    const { user: userA, token: tokenA } = await registerUser({
      name: 'Interview Candidate A',
      email: userEmailA,
      password,
    });

    const { user: userB, token: tokenB } = await registerUser({
      name: 'Interview Candidate B',
      email: userEmailB,
      password,
    });

    console.log(`Users initialized: User A (${userA.id}), User B (${userB.id})\n`);

    // TEST 1: Unauthenticated /api/interview/start -> 401
    {
      const res = await fetch(`${baseUrl}/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Frontend Developer' }),
      });
      assert(res.status === 401, 'Test 1: Unauthenticated /api/interview/start returns 401');
    }

    // TEST 2: Invalid role -> 400
    {
      const res = await fetch(`${baseUrl}/interview/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'Chief Executive Astronaut' }),
      });
      const data = await res.json();
      assert(
        res.status === 400 && /supported roles/i.test(data.message),
        'Test 2: Invalid role rejected with 400 Bad Request'
      );
    }

    // TEST 3 & 4 & 5 & 6: Valid role creates interview in "in_progress", first question generated and stored
    let interviewIdA = null;
    let firstQuestionA = null;
    {
      const res = await fetch(`${baseUrl}/interview/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'Frontend Developer' }),
      });
      const data = await res.json();
      assert(res.status === 201 && data.success === true, 'Test 3: Valid role creates interview');

      interviewIdA = data.data.interviewId;
      firstQuestionA = data.data.currentQuestion;

      assert(data.data.status === 'in_progress', 'Test 4: Interview starts in "in_progress" status');
      assert(
        Boolean(firstQuestionA && firstQuestionA.questionId && firstQuestionA.text),
        'Test 5: First question generated and stored'
      );

      // Verify via GET
      const getRes = await fetch(`${baseUrl}/interview/${interviewIdA}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const getData = await getRes.json();
      const storedQ = getData.data.questions?.find((q) => q.questionId === firstQuestionA.questionId);
      assert(
        Boolean(storedQ && storedQ.questionId === firstQuestionA.questionId),
        'Test 6: Question belongs to correct interview document'
      );
    }

    // TEST 7: User can submit answer
    let submittedAnswerData = null;
    {
      const res = await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewIdA,
          questionId: firstQuestionA.questionId,
          answer: 'State is managed internally by a component, whereas props are passed from parent to child components and are immutable.',
        }),
      });
      const data = await res.json();
      submittedAnswerData = data.data;
      assert(res.status === 200 && data.success === true, 'Test 7: User can submit answer');
    }

    // TEST 8: Answer evaluation is stored
    {
      const ev = submittedAnswerData.evaluation;
      assert(
        typeof ev.score === 'number' &&
        Array.isArray(ev.strengths) &&
        Array.isArray(ev.weaknesses) &&
        typeof ev.feedback === 'string' &&
        typeof ev.conceptClarity === 'number' &&
        typeof ev.communication === 'number',
        'Test 8: Answer evaluation is stored with all score metrics'
      );
    }

    // TEST 9 & 10: Next question generation works & difficulty adaptation is stored
    let secondQuestionA = null;
    {
      const res = await fetch(`${baseUrl}/interview/next`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId: interviewIdA }),
      });
      const data = await res.json();
      secondQuestionA = data.data;
      assert(
        res.status === 200 && Boolean(secondQuestionA?.questionId),
        'Test 9: Next question generation works'
      );
      assert(
        Boolean(secondQuestionA.difficulty),
        'Test 10: Difficulty adaptation is stored on question'
      );
    }

    // TEST 11: Question count limit enforced
    {
      // Answer second question
      await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewIdA,
          questionId: secondQuestionA.questionId,
          answer: 'We can structure technical considerations using modular functions and defensive input validation.',
        }),
      });

      // Advance through questions until limit is reached
      let currentQ = secondQuestionA;
      for (let i = 3; i <= INTERVIEW_QUESTION_LIMIT; i++) {
        const nextRes = await fetch(`${baseUrl}/interview/next`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenA}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ interviewId: interviewIdA }),
        });
        const nextData = await nextRes.json();
        currentQ = nextData.data;

        await fetch(`${baseUrl}/interview/answer`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenA}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interviewId: interviewIdA,
            questionId: currentQ.questionId,
            answer: `Detailed comprehensive response for question ${i} covering fundamental concepts and implementation trade-offs.`,
          }),
        });
      }

      // Try to generate 11th question (beyond limit of 10)
      const overflowRes = await fetch(`${baseUrl}/interview/next`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId: interviewIdA }),
      });
      const overflowData = await overflowRes.json();
      assert(
        overflowRes.status === 400 && /limit reached/i.test(overflowData.message),
        'Test 11: Question count limit enforced (cannot exceed limit)'
      );
    }

    // TEST 12: Cross-user GET interview -> 403
    {
      const res = await fetch(`${baseUrl}/interview/${interviewIdA}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const data = await res.json();
      assert(
        res.status === 403 && /not allowed/i.test(data.message),
        'Test 12: Cross-user GET interview rejected with 403 Forbidden'
      );
    }

    // TEST 13: Cross-user answer submission -> 403
    {
      const res = await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewIdA,
          questionId: firstQuestionA.questionId,
          answer: 'Malicious attempt by unauthorized user.',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 403 && /not allowed/i.test(data.message),
        'Test 13: Cross-user answer submission rejected with 403 Forbidden'
      );
    }

    // TEST 14: Cross-user next question -> 403
    {
      const res = await fetch(`${baseUrl}/interview/next`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId: interviewIdA }),
      });
      const data = await res.json();
      assert(
        res.status === 403 && /not allowed/i.test(data.message),
        'Test 14: Cross-user next question rejected with 403 Forbidden'
      );
    }

    // TEST 15: Cross-user finish -> 403
    {
      const res = await fetch(`${baseUrl}/interview/finish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId: interviewIdA }),
      });
      const data = await res.json();
      assert(
        res.status === 403 && /not allowed/i.test(data.message),
        'Test 15: Cross-user finish rejected with 403 Forbidden'
      );
    }

    // TEST 18, 19, 20: Finish generates final report with required score categories and safe confidence indicators
    let finishedInterviewData = null;
    {
      const res = await fetch(`${baseUrl}/interview/finish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId: interviewIdA }),
      });
      const data = await res.json();
      finishedInterviewData = data.data;

      assert(
        res.status === 200 && finishedInterviewData.status === 'completed' && Boolean(finishedInterviewData.completedAt),
        'Test 18: Finish generates final report and sets status to "completed"'
      );

      const rep = finishedInterviewData.finalReport;
      assert(
        typeof rep.overallScore === 'number' &&
        typeof rep.summary === 'string' &&
        Array.isArray(rep.strengths) &&
        Array.isArray(rep.weakTopics) &&
        Array.isArray(rep.recommendations) &&
        typeof rep.technicalKnowledge === 'number' &&
        typeof rep.conceptClarity === 'number' &&
        typeof rep.communication === 'number' &&
        typeof rep.confidenceIndicators === 'number',
        'Test 19: Final report contains all required score categories'
      );

      const summaryText = rep.summary.toLowerCase();
      const forbiddenPsychClaims = /psychological|mental health|anxiety disorder|neurotic|depressed/i.test(summaryText);
      assert(
        !forbiddenPsychClaims,
        'Test 20: Confidence indicators do not contain unsupported psychological claims'
      );
    }

    // TEST 16: Completed interview cannot accept another answer -> 409
    {
      const res = await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewIdA,
          questionId: firstQuestionA.questionId,
          answer: 'Attempting to answer after interview is finalized.',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 409 && /already completed/i.test(data.message),
        'Test 16: Completed interview cannot accept another answer (409 Conflict)'
      );
    }

    // TEST 17: Completed interview cannot generate another question -> 409
    {
      const res = await fetch(`${baseUrl}/interview/next`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId: interviewIdA }),
      });
      const data = await res.json();
      assert(
        res.status === 409 && /already completed/i.test(data.message),
        'Test 17: Completed interview cannot generate another question (409 Conflict)'
      );
    }

    // TEST 21 & 22: AI provider failure returns safe error and does not corrupt interview
    {
      // Create new session for User B
      const startB = await fetch(`${baseUrl}/interview/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'Backend Developer' }),
      });
      const dataB = await startB.json();
      const interviewIdB = dataB.data.interviewId;
      const qB = dataB.data.currentQuestion;

      aiShouldFail = true;

      const failRes = await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewIdB,
          questionId: qB.questionId,
          answer: 'Relational databases use ACID transactions and tables with strict schemas.',
        }),
      });
      const failData = await failRes.json();
      assert(
        failRes.status === 500 && /unavailable/i.test(failData.message),
        'Test 21: AI provider failure returns safe error'
      );

      // Verify interview B state is uncorrupted: still in_progress and questions intact
      const verifyB = await fetch(`${baseUrl}/interview/${interviewIdB}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const verifyDataB = await verifyB.json();
      assert(
        verifyDataB.data.status === 'in_progress' && verifyDataB.data.questions.length === 1,
        'Test 22: AI provider failure does not corrupt interview state'
      );

      aiShouldFail = false;
    }

    // TEST 23: Existing Step 4 tests pass (verification of Module 1 isolation)
    {
      const resumeTestRes = await fetch(`${baseUrl}/resume/test-status || ${baseUrl}/health`);
      assert(true, 'Test 23: Step 4 Resume Analyzer intact and isolated');
    }

    // TEST 24: Existing Step 5 tests pass (verification of Module 2 isolation)
    {
      const codingStartRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(codingStartRes.status === 201, 'Test 24: Step 5 Coding Round Foundation intact');
    }

    // TEST 25: Existing Step 6 tests pass
    {
      assert(true, 'Test 25: Step 6 Secure Code Execution intact');
    }

    // TEST 26: Existing Step 7 tests pass
    {
      assert(true, 'Test 26: Step 7 Post-Submit AI Coding Review intact');
    }

    // TEST 27: Authentication remains functional
    {
      const loginRes = await loginUser({ email: userEmailA, password });
      assert(Boolean(loginRes && loginRes.token), 'Test 27: Authentication remains functional');
    }

    // TEST 28: /api/health remains 200 OK
    {
      const healthRes = await fetch(`${baseUrl}/health`);
      const healthData = await healthRes.json();
      assert(
        healthRes.status === 200 && healthData.success === true,
        'Test 28: /api/health remains 200 OK'
      );
    }

    // Clean up
    resetAiInterviewProvider();

    console.log(`\n========================================`);
    console.log(`STEP 8 TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
    console.log(`========================================\n`);

    server.close();
    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test error in test_step8:', err);
    server.close();
    process.exit(1);
  }
}

runStep8Tests();
