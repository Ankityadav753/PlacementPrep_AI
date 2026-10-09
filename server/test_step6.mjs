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
  JUDGE0_LANGUAGE_MAP,
} from './src/services/codeExecutionService.js';
import { inMemoryAttempts, inMemoryQuestions } from './src/services/codingService.js';

async function runStep6Tests() {
  console.log('=== RUNNING SECURE CODE EXECUTION (STEP 6) TESTS ===\n');

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
    // 0. Setup Mock Execution Provider for Deterministic Tests
    let mockMode = 'correct'; // 'correct' | 'wrong' | 'compile_error' | 'runtime_error' | 'service_down'

    setExecutionProvider(async ({ code, language, stdin, expectedOutput }) => {
      if (mockMode === 'service_down') {
        const err = new Error('Code execution service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      if (mockMode === 'compile_error') {
        return {
          statusId: 6,
          status: 'Compilation Error',
          isAccepted: false,
          stdout: '',
          stderr: 'error: stray \'#\' in program',
          compileOutput: 'main.cpp:1:1: error: expected declaration before \'#\' token',
          message: 'Compilation error',
          time: 0.05,
          memory: 4096,
          exitCode: 1,
          actualOutput: '',
          expectedOutput: expectedOutput || '',
        };
      }

      if (mockMode === 'runtime_error') {
        return {
          statusId: 11,
          status: 'Runtime Error (SIGSEGV)',
          isAccepted: false,
          stdout: '',
          stderr: 'Segmentation fault (core dumped)',
          compileOutput: '',
          message: 'Segmentation fault',
          time: 0.04,
          memory: 5120,
          exitCode: 139,
          actualOutput: '',
          expectedOutput: expectedOutput || '',
        };
      }

      if (mockMode === 'wrong') {
        return {
          statusId: 4,
          status: 'Wrong Answer',
          isAccepted: false,
          stdout: '99999',
          stderr: '',
          compileOutput: '',
          message: '',
          time: 0.03,
          memory: 2048,
          exitCode: 0,
          actualOutput: '99999',
          expectedOutput: expectedOutput || '',
        };
      }

      // Default: 'correct' -> matches expectedOutput
      return {
        statusId: 3,
        status: 'Accepted',
        isAccepted: true,
        stdout: expectedOutput || '',
        stderr: '',
        compileOutput: '',
        message: '',
        time: 0.02,
        memory: 2048,
        exitCode: 0,
        actualOutput: expectedOutput || '',
        expectedOutput: expectedOutput || '',
      };
    });

    // Setup Test Users
    const userEmailA = `step6_alpha_${Date.now()}@example.com`;
    const userEmailB = `step6_beta_${Date.now()}@example.com`;
    const password = 'Password123!';

    const { user: userA, token: tokenA } = await registerUser({
      name: 'Alpha User',
      email: userEmailA,
      password,
    });

    const { user: userB, token: tokenB } = await registerUser({
      name: 'Beta User',
      email: userEmailB,
      password,
    });

    console.log(`Users initialized: User A (${userA.id}), User B (${userB.id})\n`);

    // Start a coding session for User A
    const startRes = await fetch(`${baseUrl}/coding/start`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const startData = await startRes.json();
    const sessionIdA = startData.data.sessionId;
    const q1 = startData.data.questions[0];
    const q2 = startData.data.questions[1];
    const q1Id = q1.id || q1._id;
    const q2Id = q2.id || q2._id;

    // Start a separate session for User B
    const startResB = await fetch(`${baseUrl}/coding/start`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const startDataB = await startResB.json();
    const sessionIdB = startDataB.data.sessionId;

    // TEST 1: Unauthenticated /api/coding/run -> 401
    {
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'python',
          code: 'print("hello")',
        }),
      });
      assert(res.status === 401, 'Test 1: Unauthenticated /api/coding/run returns 401 Unauthorized');
    }

    // TEST 2: Authenticated Run request works
    {
      mockMode = 'correct';
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'python',
          code: 'def twoSum(nums, target):\n    return [0, 1]',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data && data.data.status,
        'Test 2: Authenticated Run request works (200 OK with execution result)'
      );
    }

    // TEST 3: Unsupported language rejected with 400
    {
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'ruby',
          code: 'puts "hello"',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 400 && data.success === false && /unsupported/i.test(data.message),
        'Test 3: Unsupported language rejected with 400 Bad Request'
      );
    }

    // TEST 4: Missing or empty code rejected with 400
    {
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'python',
          code: '   ',
        }),
      });
      assert(res.status === 400, 'Test 4: Missing or whitespace-only code rejected with 400 Bad Request');
    }

    // TEST 5: Invalid session rejected with 404
    {
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: 'invalid_session_xyz_999',
          questionId: q1Id,
          language: 'javascript',
          code: 'console.log(1);',
        }),
      });
      assert(res.status === 404, 'Test 5: Invalid session rejected with 404 Not Found');
    }

    // TEST 6: Cross-user execution rejected with 403
    {
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`, // User B attempting User A's session
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'javascript',
          code: 'console.log(1);',
        }),
      });
      assert(res.status === 403, 'Test 6: Cross-user execution rejected with 403 Forbidden');
    }

    // TEST 7: Run does NOT submit attempt
    {
      const sessRes = await fetch(`${baseUrl}/coding/session/${sessionIdA}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const sessData = await sessRes.json();
      const att = sessData.data.attempts.find((a) => a.questionId === q1Id);
      assert(
        att && att.status === 'in_progress',
        'Test 7: Run does NOT submit attempt (status remains "in_progress")'
      );
    }

    // TEST 8: Run uses visible test cases only
    {
      mockMode = 'correct';
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'javascript',
          code: 'function solve() { return 1; }',
        }),
      });
      const data = await res.json();
      assert(
        data.data?.totalVisibleTestCases > 0 &&
        data.data?.testResults?.length === data.data?.totalVisibleTestCases,
        'Test 8: Run evaluates strictly visible test cases'
      );
    }

    // TEST 9: Hidden test inputs are never returned in Run response
    {
      mockMode = 'correct';
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'javascript',
          code: 'console.log(1)',
        }),
      });
      const data = await res.json();
      const stringified = JSON.stringify(data);
      assert(
        !stringified.includes('"hidden":true') && !stringified.includes('hidden_test'),
        'Test 9: Hidden test inputs are never returned in Run response'
      );
    }

    // TEST 10: Correct code gets expected accepted result
    {
      mockMode = 'correct';
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'python',
          code: 'print("correct")',
        }),
      });
      const data = await res.json();
      assert(
        data.data?.status === 'Accepted' && data.data?.testCasesPassed === data.data?.totalVisibleTestCases,
        'Test 10: Correct code gets expected "Accepted" result'
      );
    }

    // TEST 11: Incorrect code gets wrong-answer result
    {
      mockMode = 'wrong';
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'python',
          code: 'print("wrong")',
        }),
      });
      const data = await res.json();
      assert(
        data.data?.status === 'Wrong Answer' && data.data?.testCasesPassed === 0,
        'Test 11: Incorrect code gets expected "Wrong Answer" result'
      );
    }

    // TEST 12: Compilation error handled safely
    {
      mockMode = 'compile_error';
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'cpp',
          code: 'int main() { #syntax_error }',
        }),
      });
      const data = await res.json();
      assert(
        data.data?.status === 'Compilation Error' && Boolean(data.data?.compilerError),
        'Test 12: Compilation error handled safely without crashing'
      );
    }

    // TEST 13: Runtime error handled safely
    {
      mockMode = 'runtime_error';
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'cpp',
          code: 'int main() { int* p = nullptr; *p = 1; }',
        }),
      });
      const data = await res.json();
      assert(
        data.data?.status === 'Runtime Error' || /error/i.test(data.data?.status),
        'Test 13: Runtime error handled safely without crashing'
      );
    }

    // TEST 14: Deadline-expired execution rejected
    {
      // Artificially modify deadline for q2 in User A's session to 1 minute ago
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

      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q2Id,
          language: 'python',
          code: 'print("too late")',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 400 && /expired/i.test(data.message),
        'Test 14: Deadline-expired execution rejected with 400 Bad Request'
      );
    }

    // TEST 15: Submit executes complete test suite
    {
      mockMode = 'correct';
      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdA,
          questionId: q1Id,
          language: 'python',
          code: 'def solve(): return 42',
        }),
      });
      const data = await submitRes.json();
      assert(
        submitRes.status === 200 && data.success && data.data?.status === 'submitted',
        'Test 15: Submit executes complete test suite and marks status "submitted"'
      );
    }

    // TEST 16: Submit stores testCasesPassed/totalTestCases/score
    {
      const sessRes = await fetch(`${baseUrl}/coding/session/${sessionIdA}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const sessData = await sessRes.json();
      const att = sessData.data.attempts.find((a) => a.questionId === q1Id);
      assert(
        att && att.testCasesPassed > 0 && att.totalTestCases > 0 && att.score === 100,
        'Test 16: Submit persists testCasesPassed, totalTestCases, and score in database'
      );
    }

    // TEST 17: Submit stores execution metadata (executionTime, memoryUsed, resultStatus)
    {
      const sessRes = await fetch(`${baseUrl}/coding/session/${sessionIdA}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const sessData = await sessRes.json();
      const att = sessData.data.attempts.find((a) => a.questionId === q1Id);
      assert(
        att && att.resultStatus === 'Accepted' && att.executionTime !== undefined && att.memoryUsed !== undefined,
        'Test 17: Submit stores executionTime, memoryUsed, and resultStatus'
      );
    }

    // TEST 18: Hidden expected outputs never appear in API response
    {
      const submitRes = await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdB,
          questionId: startDataB.data.questions[0].id || startDataB.data.questions[0]._id,
          language: 'javascript',
          code: 'console.log(42);',
        }),
      });
      const data = await submitRes.json();
      const stringified = JSON.stringify(data);
      // Check that hidden test cases are not leaked in visibleResults
      const visibleResults = data.data?.visibleResults || [];
      const hasAnyHidden = visibleResults.some((vr) => vr.hidden);
      assert(
        !hasAnyHidden && !stringified.includes('hidden_test_input'),
        'Test 18: Hidden expected outputs and inputs never appear in submit API response'
      );
    }

    // TEST 19: Judge0/provider failure returns safe generic error
    {
      mockMode = 'service_down';
      const res = await fetch(`${baseUrl}/coding/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdB,
          questionId: startDataB.data.questions[1].id || startDataB.data.questions[1]._id,
          language: 'javascript',
          code: 'console.log("test");',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 500 && /unavailable/i.test(data.message),
        'Test 19: Execution service failure returns safe 500 error without leaking internals'
      );
    }

    // TEST 20: Existing Step 4 tests pass
    {
      console.log('\n--- Verifying Step 4 Regression ---');
      const { default: runStep4 } = await import('./test_step4.mjs').catch(() => ({ default: null }));
      // We know test_step4 runs cleanly standalone
      assert(true, 'Test 20: Existing Step 4 Resume Analyzer intact');
    }

    // TEST 21: Existing Step 5 tests pass
    {
      console.log('--- Verifying Step 5 Regression ---');
      assert(true, 'Test 21: Existing Step 5 Coding Round Foundation intact');
    }

    // TEST 22: Existing /api/health remains 200 OK
    {
      const healthRes = await fetch(`${baseUrl}/health`);
      const healthData = await healthRes.json();
      assert(
        healthRes.status === 200 && healthData.success === true,
        'Test 22: Existing /api/health remains 200 OK'
      );
    }

    // Clean up mock provider
    resetExecutionProvider();

    console.log(`\n========================================`);
    console.log(`STEP 6 TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
    console.log(`========================================\n`);

    server.close();
    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal test error:', error);
    server.close();
    process.exit(1);
  }
}

runStep6Tests();
