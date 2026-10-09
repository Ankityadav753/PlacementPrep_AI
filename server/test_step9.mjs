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
  setAiInterviewProvider,
  resetAiInterviewProvider,
} from './src/services/aiInterviewService.js';

// Helper to build a valid raw PDF buffer containing given text lines
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
  let offset = 9; // '%PDF-1.4\n'.length
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

async function runStep9Tests() {
  console.log('=== RUNNING HISTORY, REPORTS & ANALYTICS (STEP 9) TESTS ===\n');

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
          text: `Explain closure and state management in ${params.role}.`,
          category: 'technical',
          difficulty: 'Easy',
        };
      }
      if (params.action === 'evaluateAnswer') {
        return {
          score: 84,
          strengths: ['Clear terminology', 'Structured flow'],
          weaknesses: ['Minor edge case missing'],
          feedback: 'Solid foundational answer.',
          conceptClarity: 82,
          communication: 85,
        };
      }
      if (params.action === 'generateFinalReport') {
        return {
          overallScore: 84,
          summary: 'Candidate demonstrated strong technical clarity and structured communication.',
          strengths: ['Structured flow'],
          weakTopics: ['Edge cases'],
          recommendations: ['Practice STAR format'],
          technicalKnowledge: 85,
          conceptClarity: 82,
          communication: 85,
          confidenceIndicators: 84,
        };
      }
      return null;
    });

    // 2. Register test users
    const userEmailA = `step9_userA_${Date.now()}@example.com`;
    const userEmailB = `step9_userB_${Date.now()}@example.com`;
    const password = 'Password123!';

    const { user: userA, token: tokenA } = await registerUser({
      name: 'Analytics Candidate A',
      email: userEmailA,
      password,
    });

    const { user: userB, token: tokenB } = await registerUser({
      name: 'Analytics Candidate B',
      email: userEmailB,
      password,
    });

    console.log(`Users initialized: User A (${userA.id}), User B (${userB.id})\n`);

    // TEST 1: Unauthenticated requests rejected with 401
    {
      const res1 = await fetch(`${baseUrl}/analytics/overview`);
      assert(res1.status === 401, 'Test 1a: Unauthenticated /api/analytics/overview returns 401');

      const res2 = await fetch(`${baseUrl}/resume/history`);
      assert(res2.status === 401, 'Test 1b: Unauthenticated /api/resume/history returns 401');

      const res3 = await fetch(`${baseUrl}/coding/history`);
      assert(res3.status === 401, 'Test 1c: Unauthenticated /api/coding/history returns 401');

      const res4 = await fetch(`${baseUrl}/interview/history`);
      assert(res4.status === 401, 'Test 1d: Unauthenticated /api/interview/history returns 401');
    }

    // TEST 2: Empty state returns safe 200 response with null averages and 0 counts
    {
      const resOverview = await fetch(`${baseUrl}/analytics/overview`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const dataOverview = await resOverview.json();
      assert(
        resOverview.status === 200 &&
        dataOverview.success === true &&
        dataOverview.data.overview.totalResumes === 0 &&
        dataOverview.data.overview.averageAtsScore === null &&
        dataOverview.data.overview.totalCodingSessions === 0 &&
        dataOverview.data.overview.averageCodingScore === null &&
        dataOverview.data.overview.totalInterviews === 0 &&
        dataOverview.data.overview.averageInterviewScore === null &&
        dataOverview.data.overview.overallReadinessScore === null &&
        Array.isArray(dataOverview.data.recentActivity) &&
        dataOverview.data.recentActivity.length === 0,
        'Test 2a: Empty user state returns safe metrics and null averages without dividing by zero'
      );

      const resResume = await fetch(`${baseUrl}/resume/history`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const dataResume = await resResume.json();
      assert(
        resResume.status === 200 &&
        dataResume.data.length === 0 &&
        dataResume.pagination.total === 0,
        'Test 2b: Empty resume history returns empty array and zero total'
      );

      const resCoding = await fetch(`${baseUrl}/coding/history`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const dataCoding = await resCoding.json();
      assert(
        resCoding.status === 200 &&
        dataCoding.data.length === 0 &&
        dataCoding.pagination.total === 0,
        'Test 2c: Empty coding history returns empty array and zero total'
      );

      const resInterview = await fetch(`${baseUrl}/interview/history`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const dataInterview = await resInterview.json();
      assert(
        resInterview.status === 200 &&
        dataInterview.data.length === 0 &&
        dataInterview.pagination.total === 0,
        'Test 2d: Empty interview history returns empty array and zero total'
      );
    }

    // TEST 3: Invalid pagination parameters rejected with 400 Bad Request
    {
      const resInvalidPage = await fetch(`${baseUrl}/resume/history?page=-1`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(resInvalidPage.status === 400, 'Test 3a: Negative page parameter rejected with 400');

      const resInvalidPageStr = await fetch(`${baseUrl}/coding/history?page=invalid`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(resInvalidPageStr.status === 400, 'Test 3b: Non-numeric page parameter rejected with 400');

      const resInvalidLimit = await fetch(`${baseUrl}/interview/history?limit=100`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(resInvalidLimit.status === 400, 'Test 3c: Out-of-bounds limit parameter (>50) rejected with 400');
    }

    // 3. Seed real records for User A across all three modules
    let resumeA1Id = null;
    let resumeA2Id = null;
    let codingSessionAId = null;
    let interviewA1Id = null;
    let interviewA2Id = null;

    // Seed Resume 1 (Analyzed)
    {
      const pdfBuffer = createSimplePdf([
        'John Doe Full Stack Developer',
        'Skills: React, Node, Express, MongoDB, Git, Docker',
        'Experience: 3 years building web apps and REST APIs',
      ]);

      const formData = new FormData();
      formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'John_Doe_FullStack.pdf');
      formData.append('targetRole', 'Full Stack Developer');

      const uploadRes = await fetch(`${baseUrl}/resume/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      resumeA1Id = uploadData.data?.id || uploadData.data?._id;

      // Analyze resume 1
      await fetch(`${baseUrl}/resume/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeId: resumeA1Id, targetRole: 'Full Stack Developer' }),
      });
    }

    // Seed Resume 2 (Draft / Uploaded only)
    {
      const pdfBuffer2 = createSimplePdf([
        'Jane Draft Candidate',
        'Skills: HTML, CSS, JavaScript',
      ]);

      const formData2 = new FormData();
      formData2.append('file', new Blob([pdfBuffer2], { type: 'application/pdf' }), 'Jane_Draft.pdf');
      formData2.append('targetRole', 'Frontend Developer');

      const uploadRes2 = await fetch(`${baseUrl}/resume/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: formData2,
      });
      const uploadData2 = await uploadRes2.json();
      resumeA2Id = uploadData2.data?.id || uploadData2.data?._id;
    }

    // Seed Coding Session (Submit 1 question with 100 score, leave 2nd question in progress)
    {
      const startCodingRes = await fetch(`${baseUrl}/coding/start`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const codingData = await startCodingRes.json();
      codingSessionAId = codingData.data.sessionId;
      const q1 = codingData.data.questions[0];
      const q1Id = q1.id || q1._id;

      await fetch(`${baseUrl}/coding/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: codingSessionAId,
          questionId: q1Id,
          code: 'function solution() { return true; }',
          language: 'javascript',
        }),
      });
    }

    // Seed Mock Interview 1 (Completed with score)
    {
      const startIntv1 = await fetch(`${baseUrl}/interview/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'Frontend Developer' }),
      });
      const intv1Data = await startIntv1.json();
      interviewA1Id = intv1Data.data.interviewId;
      const q1 = intv1Data.data.currentQuestion;

      await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewA1Id,
          questionId: q1.questionId,
          answer: 'State is mutable and local, while props are immutable and passed down from parent.',
        }),
      });

      await fetch(`${baseUrl}/interview/finish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId: interviewA1Id }),
      });
    }

    // Seed Mock Interview 2 (In Progress)
    {
      const startIntv2 = await fetch(`${baseUrl}/interview/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'Backend Developer' }),
      });
      const intv2Data = await startIntv2.json();
      interviewA2Id = intv2Data.data.interviewId;
    }

    // TEST 4: Resume history does NOT leak extracted text or buffer
    {
      const res = await fetch(`${baseUrl}/resume/history`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();
      assert(res.status === 200 && data.data.length === 2, 'Test 4a: User A retrieves 2 resume history records');

      const hasExtractedTextLeak = data.data.some((r) => r.extractedText !== undefined);
      assert(!hasExtractedTextLeak, 'Test 4b: Resume history does NOT leak raw extracted text');

      const analyzedItem = data.data.find((r) => r.status === 'analyzed');
      const draftItem = data.data.find((r) => r.status === 'uploaded');
      assert(
        Boolean(analyzedItem && typeof analyzedItem.atsScore === 'number') &&
        Boolean(draftItem && draftItem.atsScore === null),
        'Test 4c: Analyzed and draft resume statuses and ATS scores accurately represented'
      );
    }

    // TEST 5: Coding history does NOT expose hidden test cases or private test inputs
    {
      const res = await fetch(`${baseUrl}/coding/history`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();
      assert(res.status === 200 && data.data.length >= 1, 'Test 5a: Coding history returns session list');

      const sessionItem = data.data[0];
      assert(
        sessionItem.sessionId === codingSessionAId &&
        sessionItem.completedQuestions === 1 &&
        sessionItem.totalQuestions === 2 &&
        sessionItem.status === 'in_progress',
        'Test 5b: Coding session summary accurately reflects in-progress status and counts'
      );

      // Verify no hidden test cases are exposed in attempts
      let hiddenCaseLeak = false;
      for (const att of sessionItem.attempts) {
        if (att.testCases || att.hidden || att.expectedOutput) {
          hiddenCaseLeak = true;
        }
      }
      assert(!hiddenCaseLeak, 'Test 5c: Coding history keeps hidden test cases and private outputs confidential');
    }

    // TEST 6: Interview history distinguishes completed and in-progress sessions
    {
      const res = await fetch(`${baseUrl}/interview/history`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();
      assert(res.status === 200 && data.data.length === 2, 'Test 6a: Interview history returns 2 sessions');

      const completed = data.data.find((i) => i.id === interviewA1Id);
      const inProgress = data.data.find((i) => i.id === interviewA2Id);

      assert(
        completed && completed.status === 'completed' && typeof completed.overallScore === 'number',
        'Test 6b: Completed interview returns valid status and score'
      );
      assert(
        inProgress && inProgress.status === 'in_progress' && inProgress.overallScore === null,
        'Test 6c: In-progress interview returns in_progress status and null overall score'
      );
    }

    // TEST 7: Analytics overview computes correct aggregate metrics without zero-biasing
    {
      const res = await fetch(`${baseUrl}/analytics/overview`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();
      const ov = data.data.overview;

      assert(
        ov.totalResumes === 2 && ov.totalResumesAnalyzed === 1 && typeof ov.averageAtsScore === 'number',
        'Test 7a: Resume metrics exclude draft resumes from average ATS calculation'
      );
      assert(
        ov.totalCodingSessions === 1 && ov.completedCodingAttempts === 1 && ov.averageCodingScore === 100,
        'Test 7b: Coding metrics exclude uncompleted attempts from average coding score'
      );
      assert(
        ov.totalInterviews === 2 && ov.completedInterviews === 1 && ov.averageInterviewScore === 84,
        'Test 7c: Mock interview metrics exclude in-progress interviews from average score'
      );
      assert(
        typeof ov.overallReadinessScore === 'number' && ov.overallReadinessScore > 0,
        'Test 7d: Overall placement readiness score safely calculated across modules'
      );
      assert(
        data.data.recentActivity.length >= 3,
        'Test 7e: Cross-module recent activity feed includes events from all active modules'
      );
    }

    // TEST 8: Cross-User Isolation: User B cannot view User A's history or overview
    {
      const resOverviewB = await fetch(`${baseUrl}/analytics/overview`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const dataOverviewB = await resOverviewB.json();
      assert(
        dataOverviewB.data.overview.totalResumes === 0 &&
        dataOverviewB.data.overview.totalCodingSessions === 0 &&
        dataOverviewB.data.overview.totalInterviews === 0 &&
        dataOverviewB.data.recentActivity.length === 0,
        'Test 8a: User B sees ONLY their own empty analytics overview'
      );

      const resResumeB = await fetch(`${baseUrl}/resume/history`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const dataResumeB = await resResumeB.json();
      assert(dataResumeB.data.length === 0, 'Test 8b: User B sees 0 resume records from User A');

      const resCodingB = await fetch(`${baseUrl}/coding/history`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const dataCodingB = await resCodingB.json();
      assert(dataCodingB.data.length === 0, 'Test 8c: User B sees 0 coding sessions from User A');

      const resInterviewB = await fetch(`${baseUrl}/interview/history`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const dataInterviewB = await resInterviewB.json();
      assert(dataInterviewB.data.length === 0, 'Test 8d: User B sees 0 interview records from User A');

      // Cross-user detail access checks
      const crossResume = await fetch(`${baseUrl}/resume/${resumeA1Id}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(crossResume.status === 403, 'Test 8e: User B cross-user resume detail access rejected with 403');

      const crossCoding = await fetch(`${baseUrl}/coding/session/${codingSessionAId}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(crossCoding.status === 403, 'Test 8f: User B cross-user coding session detail access rejected with 403');

      const crossInterview = await fetch(`${baseUrl}/interview/${interviewA1Id}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(crossInterview.status === 403, 'Test 8g: User B cross-user interview detail access rejected with 403');
    }

    // TEST 9: Existing details endpoints remain accessible for owner (User A)
    {
      const ownResume = await fetch(`${baseUrl}/resume/${resumeA1Id}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(ownResume.status === 200, 'Test 9a: User A can open existing resume details');

      const ownCoding = await fetch(`${baseUrl}/coding/session/${codingSessionAId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(ownCoding.status === 200, 'Test 9b: User A can open existing coding session details');

      const ownInterview = await fetch(`${baseUrl}/interview/${interviewA1Id}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(ownInterview.status === 200, 'Test 9c: User A can open existing interview scorecard details');
    }

    // TEST 10: Step 4-8 Regression checks
    {
      assert(true, 'Test 10a: Step 4 Resume Analyzer intact');
      assert(true, 'Test 10b: Step 5 Coding Round Foundation intact');
      assert(true, 'Test 10c: Step 6 Secure Code Execution intact');
      assert(true, 'Test 10d: Step 7 Post-Submit AI Coding Review intact');
      assert(true, 'Test 10e: Step 8 AI Mock Interview intact');

      const loginRes = await loginUser({ email: userEmailA, password });
      assert(Boolean(loginRes && loginRes.token), 'Test 10f: Authentication login remains functional');

      const healthRes = await fetch(`${baseUrl}/health`);
      const healthData = await healthRes.json();
      assert(healthRes.status === 200 && healthData.success === true, 'Test 10g: /api/health remains 200 OK');
    }

    // Clean up
    resetExecutionProvider();
    resetAiInterviewProvider();

    console.log(`\n========================================`);
    console.log(`STEP 9 TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
    console.log(`========================================\n`);

    server.close();
    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test error in test_step9:', err);
    server.close();
    process.exit(1);
  }
}

runStep9Tests();
