import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';
import { registerUser, loginUser } from './src/services/authService.js';
import {
  setExecutionProvider,
  resetExecutionProvider,
} from './src/services/codeExecutionService.js';
import {
  setAiInterviewProvider,
  resetAiInterviewProvider,
} from './src/services/aiInterviewService.js';
import {
  setAiReviewProvider,
  resetAiReviewProvider,
} from './src/services/aiCodingReviewService.js';

// Helper to build a valid raw PDF buffer
function createSimplePdf(lines) {
  const contentStream = [
    'BT',
    '/F1 12 Tf',
    '50 750 Td',
    '15 TL',
    ...lines.map((l) => `(${l.replace(/([()\\])/g, '\\$1')}) '`),
    'ET',
  ].join('\n');

  const streamLength = Buffer.byteLength(contentStream);

  const objects = [
    '1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj',
    '2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj',
    '3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <</F1 4 0 R>>>> /Contents 5 0 R>>\nendobj',
    '4 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj',
    `5 0 obj\n<</Length ${streamLength}>>\nstream\n${contentStream}\nendstream\nendobj`,
  ];

  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  let offset = 9;
  const bodyParts = [];

  for (const obj of objects) {
    const padded = String(offset).padStart(10, '0');
    xref += `${padded} 00000 n \n`;
    const chunk = Buffer.from(obj + '\n');
    bodyParts.push(chunk);
    offset += chunk.length;
  }

  const startxref = offset;
  const trailer = `trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n${startxref}\n%%EOF\n`;

  return Buffer.concat([
    Buffer.from('%PDF-1.4\n'),
    ...bodyParts,
    Buffer.from(xref),
    Buffer.from(trailer),
  ]);
}

async function runStep11Tests() {
  console.log('=== RUNNING QA, SECURITY AUDIT & BUG FIXES (STEP 11) TESTS ===\n');

  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
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
    // 1. Setup deterministic mock execution provider
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

    // Setup mock AI interview provider
    setAiInterviewProvider(async (params) => {
      if (params.action === 'generateFirstQuestion') {
        return {
          questionId: `mock_q_1`,
          text: `Sample initial question for ${params.role}`,
          category: 'technical',
          difficulty: 'Easy',
        };
      }
      if (params.action === 'evaluateAnswer') {
        return {
          technicalKnowledge: 85,
          conceptClarity: 80,
          communication: 88,
          confidenceIndicators: 82,
          score: 84,
          feedback: 'Solid foundational answer.',
          keyStrengths: ['Clear terminology'],
          areasForImprovement: ['Mention edge cases'],
        };
      }
      if (params.action === 'generateNextQuestion') {
        return {
          questionId: `mock_q_${params.nextQuestionNumber}`,
          text: `Follow-up question ${params.nextQuestionNumber} for ${params.role}`,
          category: 'technical',
          difficulty: 'Medium',
        };
      }
      if (params.action === 'generateFinalReport') {
        return {
          overallScore: 84,
          technicalKnowledge: 85,
          conceptClarity: 80,
          communication: 88,
          confidenceIndicators: 82,
          summary: 'Candidate shows good technical readiness.',
          strengths: ['Clear fundamentals'],
          weakTopics: ['Concurrency details'],
          recommendations: ['Practice systems questions'],
        };
      }
      return {};
    });

    // Setup mock AI coding review provider
    setAiReviewProvider(async ({ reviewType }) => ({
      reviewType,
      summary: 'Mock code review summary.',
      approachExplanation: 'Clean approach using standard hash map.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      strengths: ['Correct algorithmic structure'],
      improvements: ['Consider bounds check'],
    }));

    // Register User A and User B
    const userAEmail = `audita_${Date.now()}@example.com`;
    const userBEmail = `auditb_${Date.now()}@example.com`;

    const userARes = await registerUser({
      name: 'Audit User A',
      email: userAEmail,
      password: 'password123',
    });
    const userBRes = await registerUser({
      name: 'Audit User B',
      email: userBEmail,
      password: 'password123',
    });

    const tokenA = userARes.token;
    const tokenB = userBRes.token;

    // =========================================================================
    // SECTION 1: AUTHENTICATION & TOKEN SECURITY
    // =========================================================================
    console.log('--- Section 1: Authentication & Token Security ---');

    // Test 1: Unauthenticated requests rejected with 401 across endpoints
    const unauthEndpoints = [
      ['/resume/history', 'GET'],
      ['/coding/start', 'GET'],
      ['/interview/history', 'GET'],
      ['/analytics/overview', 'GET'],
      ['/auth/me', 'GET'],
    ];
    let allUnauth401 = true;
    for (const [ep, method] of unauthEndpoints) {
      const res = await fetch(`${baseUrl}${ep}`, { method });
      if (res.status !== 401) {
        allUnauth401 = false;
        break;
      }
    }
    assert(allUnauth401, 'Test 1: Unauthenticated requests rejected with 401 across all protected routes');

    // Test 2: Malformed auth header (no Bearer prefix) rejected with 401
    const resBadPrefix = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Token ${tokenA}` },
    });
    assert(resBadPrefix.status === 401, 'Test 2: Malformed authorization format rejected with 401');

    // Test 3: Empty token rejected with 401
    const resEmptyToken = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: 'Bearer ' },
    });
    assert(resEmptyToken.status === 401, 'Test 3: Empty token rejected with 401');

    // Test 4: Tampered token signature rejected with 401
    const tamperedToken = tokenA.slice(0, -6) + 'abcdef';
    const resTampered = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${tamperedToken}` },
    });
    assert(resTampered.status === 401, 'Test 4: Tampered JWT signature rejected with 401');

    // Test 5: Token with malformed user ID safely rejected with 401 (not 500)
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_placementprep_ai_key_2025_secure';
    const fakeToken = jwt.sign({ id: 'invalid_malformed_id_9999' }, secret, { expiresIn: '1h' });
    const resFakeUser = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${fakeToken}` },
    });
    assert(resFakeUser.status === 401, 'Test 5: Token with invalid user ID safely returns 401 without throwing 500');

    // Test 6: Expired token rejected with 401
    const expiredToken = jwt.sign({ id: userARes.user.id }, secret, { expiresIn: '-1s' });
    const resExpired = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    const expData = await resExpired.json();
    assert(
      resExpired.status === 401 && /expired/i.test(expData.message),
      'Test 6: Expired JWT token safely rejected with 401 expired message'
    );

    // Test 7: User password never returned plain or hashed in register response
    assert(
      !userARes.user.password && !userARes.user.passwordHash,
      'Test 7: Password never exposed in registration API response'
    );

    // Test 8: User password never returned in login response
    const loginRes = await loginUser({ email: userAEmail, password: 'password123' });
    assert(
      !loginRes.user.password && !loginRes.user.passwordHash,
      'Test 8: Password never exposed in login API response'
    );

    // Test 9: User password never returned in /api/auth/me response
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const meData = await meRes.json();
    assert(
      meRes.status === 200 && !meData.data.user.password,
      'Test 9: Password never exposed in /api/auth/me response'
    );

    // Test 10: NoSQL injection attempt on login (object instead of string) rejected with 400
    const nosqlLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: { $ne: null },
        password: 'password123',
      }),
    });
    assert(nosqlLoginRes.status === 400, 'Test 10: NoSQL injection attempt in login body safely rejected with 400');

    // =========================================================================
    // SECTION 2: CROSS-USER AUTHORIZATION & DATA ISOLATION
    // =========================================================================
    console.log('\n--- Section 2: Cross-User Authorization & Data Isolation ---');

    // Setup: Upload a resume for User A
    const pdfBuf = createSimplePdf([
      'Jane Doe Candidate',
      'Software Engineer with React Node.js experience',
      'Education: B.Tech Computer Science',
      'Projects: PlacementPrep platform with AI assistance',
    ]);

    const boundary = '----WebKitFormBoundaryStep11Test';
    const bodyHeader = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="candidate_a_resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`
    );
    const bodyRole = Buffer.from(
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="targetRole"\r\n\r\nFrontend Developer\r\n--${boundary}--\r\n`
    );
    const multipartBody = Buffer.concat([bodyHeader, pdfBuf, bodyRole]);

    const uploadRes = await fetch(`${baseUrl}/resume/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    });
    const uploadData = await uploadRes.json();
    const resumeAId = uploadData.data?.id;

    // Test 11: Cross-user resume access: User B cannot get User A's resume by ID
    const resCrossResume = await fetch(`${baseUrl}/resume/${resumeAId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(resCrossResume.status === 403, 'Test 11: Cross-user GET /api/resume/:id rejected with 403 Forbidden');

    // Test 12: Cross-user resume analyze: User B cannot analyze User A's resumeId
    const resCrossAnalyze = await fetch(`${baseUrl}/resume/analyze`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenB}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeId: resumeAId, targetRole: 'Backend Developer' }),
    });
    assert(resCrossAnalyze.status === 403, 'Test 12: Cross-user POST /api/resume/analyze rejected with 403 Forbidden');

    // Test 13: Resume history does NOT leak raw extractedText
    const resHistA = await fetch(`${baseUrl}/resume/history`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const histData = await resHistA.json();
    const hasExtractedText = histData.data.some((item) => item.extractedText !== undefined);
    assert(!hasExtractedText, 'Test 13: Resume history excludes extractedText to protect document confidentiality');

    // Setup: Start coding session for User A
    const codingStartRes = await fetch(`${baseUrl}/coding/start`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const codingStartData = await codingStartRes.json();
    const sessionAId = codingStartData.data?.sessionId || codingStartData.data?.session?.sessionId;
    const questionAId = codingStartData.data?.questions?.[0]?.id;

    // Test 14: Cross-user coding session access: User B cannot view User A's session
    const resCrossCoding = await fetch(`${baseUrl}/coding/session/${sessionAId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(resCrossCoding.status === 403, 'Test 14: Cross-user GET /api/coding/session/:id rejected with 403 Forbidden');

    // Test 15: Cross-user coding code execution/submit: User B cannot submit code to User A's session
    const resCrossSubmit = await fetch(`${baseUrl}/coding/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenB}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionAId,
        questionId: questionAId,
        code: 'def solve(): return 1',
        language: 'python',
      }),
    });
    assert(resCrossSubmit.status === 403, 'Test 15: Cross-user POST /api/coding/submit rejected with 403 Forbidden');

    // Submit question legitimately as User A
    await fetch(`${baseUrl}/coding/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionAId,
        questionId: questionAId,
        code: 'def solve(): return 1',
        language: 'python',
      }),
    });

    // Test 16: Cross-user AI coding review: User B cannot request review for User A's attempt
    const resCrossReview = await fetch(`${baseUrl}/coding/review`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenB}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionAId,
        questionId: questionAId,
        reviewType: 'explain_approach',
      }),
    });
    assert(resCrossReview.status === 403, 'Test 16: Cross-user POST /api/coding/review rejected with 403 Forbidden');

    // Test 17: Hidden test cases never leak in question inspection
    const inspectQRes = await fetch(`${baseUrl}/coding/session/${sessionAId}`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const inspectQData = await inspectQRes.json();
    let hiddenLeaked = false;
    for (const q of inspectQData.data?.questions || []) {
      if (Array.isArray(q.testCases)) {
        if (q.testCases.some((tc) => tc.hidden)) {
          hiddenLeaked = true;
          break;
        }
      }
    }
    assert(!hiddenLeaked, 'Test 17: Hidden test inputs/outputs never appear in question retrieval');

    // Test 18: Hidden test inputs/outputs never appear in /api/coding/run results
    const runRes = await fetch(`${baseUrl}/coding/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionAId,
        questionId: questionAId,
        code: 'def solve(): return 1',
        language: 'python',
      }),
    });
    const runData = await runRes.json();
    const runCases = runData.data?.caseResults || [];
    const runLeakedHidden = runCases.some((c) => c.hidden && (c.input || c.expectedOutput));
    assert(!runLeakedHidden, 'Test 18: Sample code runner (/api/coding/run) never leaks hidden test data');

    // =========================================================================
    // SECTION 3: INPUT VALIDATION & HARDENING
    // =========================================================================
    console.log('\n--- Section 3: Input Validation & Hardening ---');

    // Test 19: Source code exceeding maximum allowed size (64 KB) rejected with 400
    const hugeCode = 'a'.repeat(65 * 1024);
    const hugeCodeRes = await fetch(`${baseUrl}/coding/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionAId,
        questionId: questionAId,
        code: hugeCode,
        language: 'python',
      }),
    });
    assert(hugeCodeRes.status === 400, 'Test 19: Source code exceeding 64 KB rejected with 400 Bad Request');

    // Test 20: Unsupported programming language rejected with 400
    const badLangRes = await fetch(`${baseUrl}/coding/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionAId,
        questionId: questionAId,
        code: 'print(1)',
        language: 'ruby_or_rust_unsupported',
      }),
    });
    assert(badLangRes.status === 400, 'Test 20: Unsupported programming language rejected with 400 Bad Request');

    // Test 21: Non-string sessionId/questionId rejected with 400
    const objIdRes = await fetch(`${baseUrl}/coding/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: { $ne: null },
        questionId: questionAId,
        code: 'print(1)',
      }),
    });
    assert(objIdRes.status === 400, 'Test 21: Non-string sessionId rejected with 400 Bad Request');

    // Setup: Start mock interview for User A
    const interviewStartRes = await fetch(`${baseUrl}/interview/start`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'Frontend Developer' }),
    });
    const interviewData = await interviewStartRes.json();
    const interviewAId = interviewData.data?.interviewId;
    const interviewQ1Id = interviewData.data?.currentQuestion?.questionId;

    // Test 22: Cross-user interview access: User B cannot access User A's interview
    const resCrossInt = await fetch(`${baseUrl}/interview/${interviewAId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(resCrossInt.status === 403, 'Test 22: Cross-user GET /api/interview/:id rejected with 403 Forbidden');

    // Test 23: Cross-user interview answer: User B cannot submit answer to User A's interview
    const resCrossAnswer = await fetch(`${baseUrl}/interview/answer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenB}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interviewId: interviewAId,
        questionId: interviewQ1Id,
        answer: 'Valid answer for question 1',
      }),
    });
    assert(resCrossAnswer.status === 403, 'Test 23: Cross-user POST /api/interview/answer rejected with 403 Forbidden');

    // Test 24: Cross-user interview progression: User B cannot request next question for User A
    const resCrossNext = await fetch(`${baseUrl}/interview/next`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenB}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interviewId: interviewAId }),
    });
    assert(resCrossNext.status === 403, 'Test 24: Cross-user POST /api/interview/next rejected with 403 Forbidden');

    // Test 25: Cross-user interview finish: User B cannot finish User A's interview
    const resCrossFinish = await fetch(`${baseUrl}/interview/finish`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenB}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interviewId: interviewAId }),
    });
    assert(resCrossFinish.status === 403, 'Test 25: Cross-user POST /api/interview/finish rejected with 403 Forbidden');

    // User A submits answer and finishes interview
    await fetch(`${baseUrl}/interview/answer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interviewId: interviewAId,
        questionId: interviewQ1Id,
        answer: 'This is my comprehensive technical answer for question 1.',
      }),
    });

    await fetch(`${baseUrl}/interview/finish`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interviewId: interviewAId }),
    });

    // Test 26: Completed interview rejects additional answers with 409 Conflict
    const resAnswerCompleted = await fetch(`${baseUrl}/interview/answer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interviewId: interviewAId,
        questionId: interviewQ1Id,
        answer: 'Another answer attempt after completion',
      }),
    });
    assert(resAnswerCompleted.status === 409, 'Test 26: Completed interview rejects additional answer with 409 Conflict');

    // Test 27: Cross-user analytics overview isolation
    const overviewBRes = await fetch(`${baseUrl}/analytics/overview`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const overviewBData = await overviewBRes.json();
    assert(
      overviewBData.data?.overview?.totalResumes === 0 &&
      overviewBData.data?.overview?.totalCodingSessions === 0 &&
      overviewBData.data?.overview?.totalInterviews === 0,
      'Test 27: User B analytics overview is completely isolated and shows 0 records from User A'
    );

    // Test 28: Pagination bounds enforced: page < 1 rejected with 400
    const badPageRes = await fetch(`${baseUrl}/analytics/history/resume?page=0`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(badPageRes.status === 400, 'Test 28: Pagination query with page < 1 rejected with 400 Bad Request');

    // Test 29: Pagination bounds enforced: limit > 50 rejected with 400
    const badLimitRes = await fetch(`${baseUrl}/analytics/history/resume?limit=100`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(badLimitRes.status === 400, 'Test 29: Pagination query with limit > 50 rejected with 400 Bad Request');

    // Test 30: Invalid/malformed ID to /api/interview/:id safely returns 404 (not 500)
    const malformedIntRes = await fetch(`${baseUrl}/interview/nonexistent_malformed_id_999`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(malformedIntRes.status === 404, 'Test 30: Malformed ID to /api/interview/:id safely returns 404 Not Found');

    // Test 31: Invalid/malformed ID to /api/resume/:id safely returns 404 (not 500)
    const malformedResRes = await fetch(`${baseUrl}/resume/nonexistent_malformed_id_999`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(malformedResRes.status === 404, 'Test 31: Malformed ID to /api/resume/:id safely returns 404 Not Found');

    // Test 32: Non-PDF or invalid file upload rejected with 400
    const textFileBoundary = '----WebKitFormBoundaryStep11TextFile';
    const txtHeader = Buffer.from(
      `--${textFileBoundary}\r\nContent-Disposition: form-data; name="file"; filename="evil_script.js"\r\nContent-Type: application/javascript\r\n\r\nconsole.log("bad");\r\n--${textFileBoundary}--\r\n`
    );
    const badUploadRes = await fetch(`${baseUrl}/resume/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Content-Type': `multipart/form-data; boundary=${textFileBoundary}`,
      },
      body: txtHeader,
    });
    assert(badUploadRes.status === 400, 'Test 32: Non-PDF document upload (.js) strictly rejected with 400 Bad Request');

    // Test 33: System health endpoint returns 200 OK
    const healthRes = await fetch(`${baseUrl}/health`);
    assert(healthRes.status === 200, 'Test 33: System health endpoint /api/health returns 200 OK');

  } catch (err) {
    console.error('Unexpected error in test execution:', err);
    failCount++;
  } finally {
    resetExecutionProvider();
    resetAiInterviewProvider();
    resetAiReviewProvider();
    server.close();
  }

  console.log('\n========================================');
  console.log(`STEP 11 TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
  console.log('========================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runStep11Tests().catch((e) => {
  console.error('Step 11 test runner fatal:', e);
  process.exit(1);
});
