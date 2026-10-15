import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';
import { registerUser } from './src/services/authService.js';
import {
  setExecutionProvider,
  resetExecutionProvider,
} from './src/services/codeExecutionService.js';
import { inMemoryAttempts } from './src/services/codingService.js';

async function runEarlySubmissionTests() {
  console.log('=== RUNNING CODING ROUND EARLY SUBMISSION TESTS ===\n');

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
    let executionCallCount = 0;
    let shouldExecutionFail = false;

    // 1. Setup deterministic mock execution provider with call tracking
    setExecutionProvider(async ({ code, language, stdin, expectedOutput }) => {
      executionCallCount++;

      if (shouldExecutionFail) {
        const err = new Error('Code execution service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      return {
        statusId: 3,
        status: 'Accepted',
        isAccepted: true,
        stdout: expectedOutput || '',
        stderr: '',
        compileOutput: '',
        message: '',
        time: 0.03,
        memory: 1024,
        exitCode: 0,
        actualOutput: expectedOutput || '',
        expectedOutput: expectedOutput || '',
      };
    });

    // 2. Register test user
    const userEmail = `early_coder_${Date.now()}@example.com`;
    const password = 'Password123!';
    const { user, token } = await registerUser({
      name: 'Early Submitter',
      email: userEmail,
      password,
    });

    console.log(`Test user initialized: ${user.name} (${user.id})\n`);

    // TEST 1: Solution can be submitted immediately after starting question (~30 minutes remaining)
    let sessionId = null;
    let q1Id = null;
    let q2Id = null;
    let q1Attempt = null;
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      assert(startRes.status === 201 && startData.success, 'Session started successfully (201)');

      sessionId = startData.data.sessionId;
      q1Id = startData.data.questions[0].id || startData.data.questions[0]._id;
      q2Id = startData.data.questions[1].id || startData.data.questions[1]._id;
      q1Attempt = startData.data.attempts.find((a) => a.questionId === q1Id);

      const remainingSecs = Math.floor((new Date(q1Attempt.deadline).getTime() - Date.now()) / 1000);
      assert(remainingSecs > 1750, `Test 1a: Question 1 has full countdown remaining (${remainingSecs}s)`);

      const initialExecCount = executionCallCount;

      // Submit immediately with full ~30 minutes remaining
      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          questionId: q1Id,
          language: 'javascript',
          code: 'function solution() { return true; }',
        }),
      });
      const submitData = await submitRes.json();

      assert(submitRes.status === 200, 'Test 1b: Immediate early submission returns 200 OK');
      assert(submitData.data?.status === 'submitted', 'Test 1c: Attempt status transitioned to "submitted"');
      assert(submitData.data?.score === 100, 'Test 1d: Evaluation score is calculated (100 pts)');
      assert(submitData.data?.testCasesPassed > 0, 'Test 1e: Test case results recorded');
      assert(Array.isArray(submitData.data?.visibleResults), 'Test 1f: Visible test case results returned for display');
      assert(executionCallCount > initialExecCount, 'Test 1g: Code execution provider was invoked for evaluation');
    }

    // TEST 2: Solution can be submitted with 20 minutes remaining
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const sId = startData.data.sessionId;
      const targetQId = startData.data.questions[0].id || startData.data.questions[0]._id;

      // Simulate 20 minutes remaining (10 minutes elapsed)
      const memKey = `${sId}_${targetQId}`;
      const att = inMemoryAttempts.get(memKey);
      if (att) {
        att.deadline = new Date(Date.now() + 20 * 60 * 1000).toISOString();
      }

      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return 20; }',
        }),
      });
      const submitData = await submitRes.json();

      assert(submitRes.status === 200 && submitData.data?.status === 'submitted',
        'Test 2: Solution successfully submitted with 20 minutes remaining');
    }

    // TEST 3: Solution can be submitted with 10 minutes remaining
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const sId = startData.data.sessionId;
      const targetQId = startData.data.questions[0].id || startData.data.questions[0]._id;

      // Simulate 10 minutes remaining
      const memKey = `${sId}_${targetQId}`;
      const att = inMemoryAttempts.get(memKey);
      if (att) {
        att.deadline = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      }

      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return 10; }',
        }),
      });
      const submitData = await submitRes.json();

      assert(submitRes.status === 200 && submitData.data?.status === 'submitted',
        'Test 3: Solution successfully submitted with 10 minutes remaining');
    }

    // TEST 4: Solution can be submitted with 5 minutes remaining
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const sId = startData.data.sessionId;
      const targetQId = startData.data.questions[0].id || startData.data.questions[0]._id;

      // Simulate 5 minutes remaining
      const memKey = `${sId}_${targetQId}`;
      const att = inMemoryAttempts.get(memKey);
      if (att) {
        att.deadline = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      }

      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return 5; }',
        }),
      });
      const submitData = await submitRes.json();

      assert(submitRes.status === 200 && submitData.data?.status === 'submitted',
        'Test 4: Solution successfully submitted with 5 minutes remaining');
    }

    // TEST 5: Submit works without waiting for countdown to finish
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const sId = startData.data.sessionId;
      const targetQId = startData.data.questions[0].id || startData.data.questions[0]._id;
      const attemptDoc = startData.data.attempts.find((a) => a.questionId === targetQId);

      const beforeSubmit = Date.now();
      const deadlineMs = new Date(attemptDoc.deadline).getTime();
      assert(beforeSubmit < deadlineMs, 'Test 5a: Question deadline is in future (countdown not zero)');

      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return true; }',
        }),
      });

      assert(submitRes.status === 200, 'Test 5b: Submit succeeds immediately without waiting for timer zero');
    }

    // TEST 6: Double-clicking / duplicate submit does not create duplicate evaluations
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const sId = startData.data.sessionId;
      const targetQId = startData.data.questions[0].id || startData.data.questions[0]._id;

      // First submit
      await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return true; }',
        }),
      });

      const countAfterFirstSubmit = executionCallCount;

      // Second submit (e.g. rapid double-click or replay)
      const secondRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return true; }',
        }),
      });
      const secondData = await secondRes.json();

      assert(secondRes.status === 200, 'Test 6a: Duplicate submit returns 200 safely');
      assert(/already submitted/i.test(secondData.message), 'Test 6b: Message confirms attempt was already submitted');
      assert(executionCallCount === countAfterFirstSubmit, 'Test 6c: Duplicate submit did NOT trigger secondary code evaluation');
    }

    // TEST 7: Timer expiration does not interrupt an ongoing submission
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const sId = startData.data.sessionId;
      const targetQId = startData.data.questions[0].id || startData.data.questions[0]._id;

      // Set deadline 50ms in future to simulate edge boundary
      const memKey = `${sId}_${targetQId}`;
      const att = inMemoryAttempts.get(memKey);
      if (att) {
        att.deadline = new Date(Date.now() + 1500).toISOString();
      }

      // Submit immediately while valid
      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return true; }',
        }),
      });
      const submitData = await submitRes.json();

      assert(submitRes.status === 200 && submitData.data?.status === 'submitted',
        'Test 7: Submission initiated before deadline successfully finalizes as "submitted"');
    }

    // TEST 8: API failures display error and allow valid retry
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const sId = startData.data.sessionId;
      const targetQId = startData.data.questions[0].id || startData.data.questions[0]._id;

      // Induce 500 failure in execution service
      shouldExecutionFail = true;

      const failedRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return true; }',
        }),
      });
      const failedData = await failedRes.json();

      assert(failedRes.status === 500, 'Test 8a: API failure returns 500 error');
      assert(/temporarily unavailable/i.test(failedData.message), 'Test 8b: Error message clearly communicated');

      // Verify attempt is not corrupted and remains in_progress
      const sessionCheckRes = await fetch(`${baseUrl}/coding/session/${sId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionCheckData = await sessionCheckRes.json();
      const attCheck = sessionCheckData.data?.attempts?.find((a) => a.questionId === targetQId);
      assert(attCheck?.status === 'in_progress', 'Test 8c: Attempt remains in_progress and uncorrupted after failure');

      // Restore execution service and retry
      shouldExecutionFail = false;

      const retryRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function solve() { return true; }',
        }),
      });
      const retryData = await retryRes.json();

      assert(retryRes.status === 200 && retryData.data?.status === 'submitted',
        'Test 8d: Valid retry succeeds with 200 and attempt transitions to "submitted"');
    }

    // TEST 9: A new question resets the timer and submission state correctly
    {
      // Using the session from Test 1 where Q1 was submitted
      const sessionRes = await fetch(`${baseUrl}/coding/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionData = await sessionRes.json();

      const q1Att = sessionData.data.attempts.find((a) => a.questionId === q1Id);
      const q2Att = sessionData.data.attempts.find((a) => a.questionId === q2Id);

      assert(q1Att.status === 'submitted', 'Test 9a: Question 1 attempt is submitted');
      assert(q2Att.status === 'in_progress', 'Test 9b: Question 2 attempt is in_progress (clean state)');
      assert(q2Att.score === 0, 'Test 9c: Question 2 attempt score is 0');
      assert(q2Att.testCasesPassed === 0, 'Test 9d: Question 2 attempt testCasesPassed is 0');

      const d2 = new Date(q2Att.deadline);
      const s2 = new Date(q2Att.startedAt);
      const diffMs = d2.getTime() - s2.getTime();
      assert(Math.abs(diffMs - 30 * 60 * 1000) < 5000, 'Test 9e: Question 2 has its own 30-minute timer window');

      // Question 2 can be submitted independently early
      const q2SubmitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          questionId: q2Id,
          language: 'javascript',
          code: 'function solveQ2() { return 42; }',
        }),
      });
      const q2SubmitData = await q2SubmitRes.json();
      assert(q2SubmitRes.status === 200 && q2SubmitData.data?.status === 'submitted',
        'Test 9f: Question 2 submitted independently early');
    }

    // TEST 10: Timer expiration past deadline enforces expired status
    {
      const startRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const sId = startData.data.sessionId;
      const targetQId = startData.data.questions[0].id || startData.data.questions[0]._id;

      // Set deadline in past
      const memKey = `${sId}_${targetQId}`;
      const att = inMemoryAttempts.get(memKey);
      if (att) {
        att.deadline = new Date(Date.now() - 5000).toISOString();
      }

      const expiredRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sId,
          questionId: targetQId,
          language: 'javascript',
          code: 'function tooLate() { return false; }',
        }),
      });

      assert(expiredRes.status === 400, 'Test 10a: Expired deadline submit rejected with 400 Bad Request');
      const expiredData = await expiredRes.json();
      assert(/expired/i.test(expiredData.message), 'Test 10b: Error message specifies deadline expired');
    }

  } catch (err) {
    console.error('Test execution exception:', err);
    failCount++;
  } finally {
    resetExecutionProvider();
    server.close();
  }

  console.log('\n======================================================');
  console.log(`EARLY SUBMISSION TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
  console.log('======================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runEarlySubmissionTests();
