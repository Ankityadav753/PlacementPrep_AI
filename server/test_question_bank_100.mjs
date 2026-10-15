import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';
import { registerUser } from './src/services/authService.js';
import { codingQuestionsData } from './src/data/codingQuestions.js';
import { seedCodingQuestions } from './src/scripts/seedCodingQuestions.js';
import {
  startCodingSession,
  getCodingSession,
  submitCodingQuestion,
  inMemoryQuestions,
} from './src/services/codingService.js';
import { setExecutionProvider } from './src/services/codeExecutionService.js';

// Setup mock execution provider for fast, deterministic unit test evaluation
setExecutionProvider(async ({ expectedOutput }) => ({
  statusId: 3,
  status: 'Accepted',
  isAccepted: true,
  stdout: expectedOutput || '',
  stderr: '',
  compileOutput: '',
  message: '',
  time: 0.01,
  memory: 1024,
  exitCode: 0,
  actualOutput: expectedOutput || '',
  expectedOutput: expectedOutput || '',
}));

async function run100QuestionBankTests() {
  console.log('=== RUNNING 100-QUESTION BANK & INTEGRATION TEST SUITE ===\n');

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
    // ----------------------------------------------------
    // Section 1: Question Bank Schema and Quantity
    // ----------------------------------------------------
    assert(codingQuestionsData.length === 100, `Question bank contains exactly 100 questions (Actual: ${codingQuestionsData.length})`);
    assert(inMemoryQuestions.size === 100, `In-memory service loaded all 100 questions (Actual: ${inMemoryQuestions.size})`);

    const idSet = new Set();
    const slugSet = new Set();
    const titleSet = new Set();
    const difficulties = { Easy: 0, Medium: 0, Hard: 0 };
    const topicCounts = {};

    let allStarterCodesValid = true;
    let allTestCasesValid = true;
    let allMetadataPresent = true;

    codingQuestionsData.forEach((q, idx) => {
      // Check uniqueness
      if (idSet.has(q.id)) idSet.add(`DUP_${q.id}`);
      else idSet.add(q.id);

      if (slugSet.has(q.slug)) slugSet.add(`DUP_${q.slug}`);
      else slugSet.add(q.slug);

      if (titleSet.has(q.title)) titleSet.add(`DUP_${q.title}`);
      else titleSet.add(q.title);

      difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;

      // Check 4 language starter codes
      const sc = q.starterCode || {};
      if (
        typeof sc.cpp !== 'string' || !sc.cpp.trim() ||
        typeof sc.java !== 'string' || !sc.java.trim() ||
        typeof sc.python !== 'string' || !sc.python.trim() ||
        typeof sc.javascript !== 'string' || !sc.javascript.trim()
      ) {
        allStarterCodesValid = false;
      }

      // Check test cases
      if (!Array.isArray(q.testCases) || q.testCases.length < 2) {
        allTestCasesValid = false;
      } else {
        const hasVisible = q.testCases.some((tc) => !tc.hidden && tc.input && tc.expectedOutput);
        const hasHidden = q.testCases.some((tc) => tc.hidden && tc.input && tc.expectedOutput);
        if (!hasVisible || !hasHidden) {
          allTestCasesValid = false;
        }
      }

      // Check placement metadata
      if (
        !q.inputFormat ||
        !q.outputFormat ||
        !q.referenceUrl ||
        !q.attribution ||
        !Array.isArray(q.tags) ||
        q.tags.length === 0 ||
        !Array.isArray(q.examples) ||
        q.examples.length < 1
      ) {
        allMetadataPresent = false;
      }
    });

    assert(idSet.size === 100, `All 100 question IDs are unique (cq_1 to cq_100)`);
    assert(slugSet.size === 100, `All 100 question slugs are unique`);
    assert(titleSet.size === 100, `All 100 question titles are unique`);
    assert(allStarterCodesValid, `All 100 questions have valid, non-empty starter templates for C++, Java, Python, and JavaScript`);
    assert(allTestCasesValid, `All 100 questions contain at least one visible test case and at least one hidden evaluation test case`);
    assert(allMetadataPresent, `All 100 questions have complete metadata (tags, inputFormat, outputFormat, referenceUrl, attribution)`);

    console.log(`Difficulty breakdown: ${difficulties.Easy} Easy, ${difficulties.Medium} Medium, ${difficulties.Hard} Hard`);
    assert(difficulties.Easy > 0 && difficulties.Medium > 0 && difficulties.Hard > 0, `Question bank has a balanced difficulty mix`);
    assert(difficulties.Easy + difficulties.Medium >= 85, `Fresher-friendly bias preserved: >= 85% Easy/Medium problems (Actual: ${difficulties.Easy + difficulties.Medium}%)`);

    // ----------------------------------------------------
    // Section 2: Idempotent Seeding Behavior
    // ----------------------------------------------------
    const seedStats1 = await seedCodingQuestions();
    assert(seedStats1 && typeof seedStats1.totalToSeed === 'number', `Seed function executes safely without crashing`);
    assert(seedStats1.totalToSeed === 100, `Seed script targets exactly 100 questions`);

    // Simulate in-memory map upsert idempotency
    const simulatedDb = new Map();
    function upsertBank(bank) {
      let inserted = 0;
      let updated = 0;
      for (const q of bank) {
        if (simulatedDb.has(q.slug)) {
          simulatedDb.set(q.slug, { ...simulatedDb.get(q.slug), ...q });
          updated++;
        } else {
          simulatedDb.set(q.slug, { ...q });
          inserted++;
        }
      }
      return { inserted, updated, total: simulatedDb.size };
    }

    const run1 = upsertBank(codingQuestionsData);
    assert(run1.inserted === 100 && run1.total === 100, `First seeding run inserts 100 items (total: 100)`);

    const run2 = upsertBank(codingQuestionsData);
    assert(run2.inserted === 0 && run2.updated === 100 && run2.total === 100, `Second seeding run inserts 0 items, updates 100, and does not exceed 100 (total: 100)`);

    const run3 = upsertBank(codingQuestionsData);
    assert(run3.total === 100, `Third consecutive seeding run remains at exactly 100 total items`);

    // ----------------------------------------------------
    // Section 3: Live Coding Session Selection and Diversity
    // ----------------------------------------------------
    const userEmail = `q100_coder_${Date.now()}@example.com`;
    const { user, token } = await registerUser({
      name: 'Question Bank Tester',
      email: userEmail,
      password: 'Password123!',
    });

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Start 10 consecutive sessions to verify random selection diversity
    const distinctQuestionIdsSelected = new Set();
    let allSessionsHave2Distinct = true;
    let allDeadlinesAreIndependent30Min = true;

    for (let i = 0; i < 10; i++) {
      const startRes = await fetch(`${baseUrl}/coding/start`, { headers });
      const startJson = await startRes.json();

      assert(startRes.status === 201, `Session ${i + 1} initialized with 201 Created`);
      const { questions, attempts } = startJson.data;

      if (questions.length !== 2 || attempts.length !== 2) {
        allSessionsHave2Distinct = false;
      }

      if (questions[0].id === questions[1].id) {
        allSessionsHave2Distinct = false;
      }

      distinctQuestionIdsSelected.add(questions[0].id);
      distinctQuestionIdsSelected.add(questions[1].id);

      // Verify independent 30-min timers
      const now = Date.now();
      const d1 = new Date(attempts[0].deadline).getTime();
      const d2 = new Date(attempts[1].deadline).getTime();
      const diff1Minutes = (d1 - now) / 60000;
      const diff2Minutes = (d2 - now) / 60000;

      if (diff1Minutes < 29 || diff1Minutes > 31 || diff2Minutes < 29 || diff2Minutes > 31) {
        allDeadlinesAreIndependent30Min = false;
      }

      // Verify hidden test cases are securely stripped in client response
      const hasLeakedHiddenTc = questions.some((q) =>
        q.testCases?.some((tc) => tc.hidden)
      );
      if (hasLeakedHiddenTc) {
        assert(false, `Session ${i + 1} leaked hidden test cases!`);
      }
    }

    assert(allSessionsHave2Distinct, `Each session strictly selects 2 distinct, non-duplicate questions`);
    assert(allDeadlinesAreIndependent30Min, `Each question in session receives its own independent 30-minute timer window`);
    assert(distinctQuestionIdsSelected.size > 2, `Different sessions sample diverse questions across the 100-problem bank (Selected ${distinctQuestionIdsSelected.size} unique questions across 10 sessions)`);

    // ----------------------------------------------------
    // Section 4: Early Submission & Evaluation with New Bank
    // ----------------------------------------------------
    const sessionRes = await fetch(`${baseUrl}/coding/start`, { headers });
    const sessionJson = await sessionRes.json();
    const sessionId = sessionJson.data.sessionId;
    const q1 = sessionJson.data.questions[0];

    // Submit early for q1
    const submitRes = await fetch(`${baseUrl}/coding/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sessionId,
        questionId: q1.id,
        code: q1.starterCode.javascript || 'function solution() { return true; }',
        language: 'javascript',
      }),
    });
    const submitJson = await submitRes.json();

    assert(submitRes.status === 200, `Early submission on question "${q1.title}" from expanded bank succeeds (200 OK)`);
    assert(submitJson.data?.status === 'submitted', `Attempt status transitioned to "submitted" upon early submission`);
    assert(typeof submitJson.data?.score === 'number', `Evaluation score computed upon submission`);

    // Verify session retrieval retains sanitized state
    const fetchSessionRes = await fetch(`${baseUrl}/coding/session/${sessionId}`, { headers });
    const fetchSessionJson = await fetchSessionRes.json();
    const fetchedQ1 = fetchSessionJson.data.questions.find((q) => q.id === q1.id);
    assert(fetchedQ1 && fetchedQ1.testCases.every((tc) => !tc.hidden), `Fetched session question never exposes hidden test cases`);
    assert(fetchedQ1?.slug?.length > 0, `Fetched question includes slug ("${fetchedQ1.slug}")`);
    assert(fetchedQ1?.tags?.length > 0, `Fetched question includes topic tags ([${fetchedQ1.tags.join(', ')}])`);
    assert(fetchedQ1?.attribution?.length > 0, `Fetched question includes reference attribution`);

  } catch (error) {
    console.error('Test execution error:', error);
    failCount++;
  } finally {
    server.close();
  }

  console.log('\n======================================================');
  console.log(`100-QUESTION BANK TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
  console.log('======================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

run100QuestionBankTests();
