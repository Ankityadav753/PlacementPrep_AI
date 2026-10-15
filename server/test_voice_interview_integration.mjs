import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: new URL('./.env', import.meta.url) });

import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';
import { registerUser } from './src/services/authService.js';
import {
  setAiInterviewProvider,
  resetAiInterviewProvider,
} from './src/services/aiInterviewService.js';

async function runVoiceInterviewIntegrationTests() {
  console.log('=== RUNNING VOICE MOCK INTERVIEW BACKEND INTEGRATION TESTS ===\n');

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
    let aiCalls = 0;

    // Set up mock AI provider mimicking voice questions and spoken response evaluations
    setAiInterviewProvider(async (params) => {
      aiCalls++;
      if (params.action === 'generateFirstQuestion') {
        return {
          questionId: 'voice_q_1',
          text: `Welcome candidate. In ${params.role}, explain how the browser processes CSS layout and reflow.`,
          category: params.category || 'technical',
          difficulty: params.difficulty || 'Easy',
        };
      }
      if (params.action === 'evaluateAnswer') {
        const spokenText = params.answer || '';
        const wordCount = spokenText.trim().split(/\s+/).length;
        return {
          score: wordCount >= 10 ? 88 : 45,
          strengths: ['Accurate verbal explanation of render tree calculation', 'Mentioned repaint cost'],
          weaknesses: ['Could mention requestAnimationFrame or layout thrashing'],
          feedback: `Candidate articulated reflow triggers clearly. Word count: ${wordCount}.`,
          conceptClarity: wordCount >= 10 ? 86 : 50,
          communication: wordCount >= 10 ? 90 : 55,
        };
      }
      if (params.action === 'generateNextQuestion') {
        return {
          questionId: `voice_q_${params.nextQNumber}`,
          text: `Question ${params.nextQNumber}: How do you design an accessible modal dialog in modern web applications?`,
          category: params.nextCategory || 'technical',
          difficulty: params.nextDifficulty || 'Medium',
        };
      }
      if (params.action === 'generateFinalReport') {
        return {
          overallScore: 88,
          summary: 'The candidate showed clear verbal communication and solid comprehension of web rendering mechanics.',
          strengths: ['Fast and structured verbal explanations', 'Demonstrated understanding of browser rendering pipeline'],
          weakTopics: ['Layout thrashing optimization'],
          recommendations: ['Practice explaining low-level composite layers', 'Structure answers with STAR format'],
          technicalKnowledge: 87,
          conceptClarity: 86,
          communication: 90,
          confidenceIndicators: 89,
        };
      }
      return null;
    });

    // 1. Create candidate user
    const emailA = `voice_candidate_${Date.now()}@example.com`;
    const emailB = `voice_attacker_${Date.now()}@example.com`;
    const password = 'Password123!';

    const { user: userA, token: tokenA } = await registerUser({
      name: 'Voice Candidate',
      email: emailA,
      password,
    });

    const { user: userB, token: tokenB } = await registerUser({
      name: 'Unauthorized User',
      email: emailB,
      password,
    });

    // TEST 1: Starting voice interview returns spoken text question
    let interviewId = null;
    let firstQuestion = null;
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
      assert(res.status === 201 && data.success === true, 'Test 1a: Voice interview session started (201)');
      interviewId = data.data.interviewId;
      firstQuestion = data.data.currentQuestion;

      assert(Boolean(interviewId), 'Test 1b: Valid interview session ID assigned');
      assert(
        typeof firstQuestion.text === 'string' && firstQuestion.text.length > 10,
        'Test 1c: First question text is present for speech synthesis playback'
      );
      assert(firstQuestion.category === 'technical', 'Test 1d: Question category assigned');
    }

    // TEST 2: Reject empty or whitespace-only spoken answer
    {
      const res = await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          questionId: firstQuestion.questionId,
          answer: '   ',
        }),
      });
      assert(res.status === 400, 'Test 2: Empty/whitespace spoken answer rejected with 400');
    }

    // TEST 3: Submit valid transcribed candidate voice response
    let firstAnswerEval = null;
    {
      const spokenTranscript =
        'When the DOM or CSSOM changes, the browser recalculates styles, recalculates layout geometry (reflow), and then repaints pixels to layers.';

      const res = await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          questionId: firstQuestion.questionId,
          answer: spokenTranscript,
        }),
      });
      const data = await res.json();
      assert(res.status === 200 && data.success === true, 'Test 3a: Transcribed voice response evaluated successfully');
      firstAnswerEval = data.data.evaluation;

      assert(firstAnswerEval.score === 88, 'Test 3b: Question score calculated (88/100)');
      assert(firstAnswerEval.communication === 90, 'Test 3c: Verbal communication score computed (90/100)');
      assert(Array.isArray(firstAnswerEval.strengths), 'Test 3d: Strengths list populated');
    }

    // TEST 4: Advance to Next Question for AI text-to-speech
    let secondQuestion = null;
    {
      const res = await fetch(`${baseUrl}/interview/next`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId }),
      });
      const data = await res.json();
      assert(res.status === 200 && data.success === true, 'Test 4a: Next adaptive question generated');
      secondQuestion = data.data;

      assert(Boolean(secondQuestion.questionId), 'Test 4b: Next question has valid ID');
      assert(
        typeof secondQuestion.text === 'string' && secondQuestion.text.includes('modal dialog'),
        'Test 4c: Next question text ready for browser text-to-speech synthesis'
      );
    }

    // TEST 5: Candidate submits second spoken response
    {
      const spokenTranscript2 =
        'For an accessible modal dialog, we manage focus with focus trapping, apply role dialog and aria-modal, and close on escape key press.';

      const res = await fetch(`${baseUrl}/interview/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          questionId: secondQuestion.questionId,
          answer: spokenTranscript2,
        }),
      });
      const data = await res.json();
      assert(res.status === 200 && data.success === true, 'Test 5: Second spoken answer evaluated successfully');
    }

    // TEST 6: Conclude voice interview & verify comprehensive scorecard
    {
      const res = await fetch(`${baseUrl}/interview/finish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewId }),
      });
      const data = await res.json();
      assert(res.status === 200 && data.success === true, 'Test 6a: Interview concluded with 200 OK');
      const scorecard = data.data;

      assert(scorecard.status === 'completed', 'Test 6b: Session marked completed');
      assert(scorecard.finalReport.overallScore === 88, 'Test 6c: Final report overall score populated');
      assert(scorecard.finalReport.communication === 90, 'Test 6d: Spoken communication score preserved');
      assert(scorecard.finalReport.confidenceIndicators === 89, 'Test 6e: Verbal confidence indicator populated');
      assert(scorecard.answers.length === 2, 'Test 6f: Both spoken answers recorded in session history');
    }

    // TEST 7: Cross-User authorization protection
    {
      const crossRes = await fetch(`${baseUrl}/interview/${interviewId}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(crossRes.status === 403, 'Test 7: Cross-user interview access rejected with 403');
    }

    // TEST 8: Secrets and keys never exposed in API responses
    {
      const getRes = await fetch(`${baseUrl}/interview/${interviewId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await getRes.json();
      const stringified = JSON.stringify(data);
      assert(
        !stringified.includes('AI_API_KEY') && !stringified.includes('JWT_SECRET'),
        'Test 8: Backend secrets never leaked to client in interview payloads'
      );
    }

    // TEST 9: Analytics overview integrates completed voice interview
    {
      const res = await fetch(`${baseUrl}/analytics/overview`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();
      assert(
        data.data.overview.totalInterviews >= 1 &&
        data.data.overview.averageInterviewScore === 88,
        'Test 9: Voice interview recorded in student placement analytics overview'
      );
    }

    resetAiInterviewProvider();
    server.close();

    console.log(`\n======================================================`);
    console.log(`VOICE INTERVIEW INTEGRATION: ${passCount} Passed, ${failCount} Failed`);
    console.log(`======================================================\n`);

    if (failCount > 0) process.exit(1);
    else process.exit(0);
  } catch (err) {
    console.error('Fatal error during voice interview integration tests:', err);
    server.close();
    process.exit(1);
  }
}

runVoiceInterviewIntegrationTests();
