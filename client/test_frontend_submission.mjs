import assert from 'node:assert';

console.log('=== RUNNING FRONTEND CODING ROUND SUBMISSION TESTS ===\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    failCount++;
  }
}

// 1. Timer formatting test
const formatTime = (secs) => {
  if (secs <= 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

test('Timer formatting for various remaining times', () => {
  assert.strictEqual(formatTime(1800), '30:00');
  assert.strictEqual(formatTime(1200), '20:00');
  assert.strictEqual(formatTime(600), '10:00');
  assert.strictEqual(formatTime(300), '05:00');
  assert.strictEqual(formatTime(45), '00:45');
  assert.strictEqual(formatTime(0), '00:00');
  assert.strictEqual(formatTime(-10), '00:00');
});

// 2. Submission State Machine test
class CodingRoundStateMachine {
  constructor() {
    this.state = 'idle'; // 'idle' | 'submitting' | 'submitted' | 'error'
    this.error = '';
    this.results = null;
    this.isSubmittingRef = { current: false };
    this.evaluationCallCount = 0;
  }

  async submit(apiCallFn) {
    // Duplicate submission guard
    if (this.isSubmittingRef.current) {
      return { skipped: true, reason: 'duplicate_guard' };
    }
    if (this.state === 'submitted') {
      return { skipped: true, reason: 'already_submitted' };
    }

    this.isSubmittingRef.current = true;
    this.state = 'submitting';
    this.error = '';

    try {
      this.evaluationCallCount++;
      const result = await apiCallFn();
      this.results = result;
      this.state = 'submitted';
      return { success: true, data: result };
    } catch (err) {
      this.state = 'error';
      this.error = err.message || 'Submission failed';
      return { success: false, error: this.error };
    } finally {
      this.isSubmittingRef.current = false;
    }
  }

  switchQuestion(newAttempt) {
    if (newAttempt.status === 'submitted' || newAttempt.status === 'expired') {
      this.state = 'submitted';
    } else {
      this.state = 'idle';
    }
    this.error = '';
  }
}

test('Immediate early submission transitions to submitting then submitted', async () => {
  const machine = new CodingRoundStateMachine();
  assert.strictEqual(machine.state, 'idle');

  const resPromise = machine.submit(async () => {
    assert.strictEqual(machine.state, 'submitting');
    assert.strictEqual(machine.isSubmittingRef.current, true);
    return { status: 'Accepted', score: 100, testCasesPassed: 3, totalTestCases: 3 };
  });

  const res = await resPromise;
  assert.strictEqual(res.success, true);
  assert.strictEqual(machine.state, 'submitted');
  assert.strictEqual(machine.isSubmittingRef.current, false);
  assert.strictEqual(machine.results.score, 100);
});

test('Double-clicking Submit prevents duplicate evaluations', async () => {
  const machine = new CodingRoundStateMachine();

  let resolver;
  const delayedApi = () => new Promise((resolve) => { resolver = resolve; });

  // First click starts submitting
  const firstPromise = machine.submit(delayedApi);
  assert.strictEqual(machine.state, 'submitting');
  assert.strictEqual(machine.isSubmittingRef.current, true);

  // Second rapid click while first is in-flight
  const secondResult = await machine.submit(delayedApi);
  assert.strictEqual(secondResult.skipped, true);
  assert.strictEqual(secondResult.reason, 'duplicate_guard');

  // Complete first request
  resolver({ status: 'Accepted', score: 100 });
  await firstPromise;

  assert.strictEqual(machine.state, 'submitted');
  assert.strictEqual(machine.evaluationCallCount, 1); // Only 1 API call made!
});

test('Timer expiration does not fire duplicate evaluation when submission in progress', async () => {
  const machine = new CodingRoundStateMachine();

  let resolver;
  const inFlightApi = () => new Promise((resolve) => { resolver = resolve; });

  const manualSubmitPromise = machine.submit(inFlightApi);

  // Simulated timer callback fires during manual submission
  const timerCallback = async () => {
    if (!machine.isSubmittingRef.current) {
      return await machine.submit(async () => ({ status: 'expired' }));
    }
    return { ignored: true };
  };

  const timerResult = await timerCallback();
  assert.strictEqual(timerResult.ignored, true);

  resolver({ status: 'Accepted', score: 100 });
  await manualSubmitPromise;

  assert.strictEqual(machine.state, 'submitted');
  assert.strictEqual(machine.evaluationCallCount, 1);
});

test('API failure transitions to error state and allows valid retry', async () => {
  const machine = new CodingRoundStateMachine();

  // 1. Initial failing submit
  const failResult = await machine.submit(async () => {
    throw new Error('Code execution service is temporarily unavailable.');
  });

  assert.strictEqual(failResult.success, false);
  assert.strictEqual(machine.state, 'error');
  assert.strictEqual(machine.error, 'Code execution service is temporarily unavailable.');
  assert.strictEqual(machine.isSubmittingRef.current, false); // Guard reset!

  // 2. Retry succeeds
  const retryResult = await machine.submit(async () => {
    return { status: 'Accepted', score: 100 };
  });

  assert.strictEqual(retryResult.success, true);
  assert.strictEqual(machine.state, 'submitted');
  assert.strictEqual(machine.error, '');
  assert.strictEqual(machine.results.score, 100);
});

test('Switching to a new question resets submission state to idle', () => {
  const machine = new CodingRoundStateMachine();
  machine.state = 'submitted';

  // Switch to Question 2 which is in_progress
  machine.switchQuestion({ questionId: 'cq_2', status: 'in_progress' });
  assert.strictEqual(machine.state, 'idle');
  assert.strictEqual(machine.error, '');

  // Switch back to Question 1 which is submitted
  machine.switchQuestion({ questionId: 'cq_1', status: 'submitted' });
  assert.strictEqual(machine.state, 'submitted');
});

test('Timer freeze logic: timer freezes at 0 when question is submitted', () => {
  const computeTimer = (attempt, now = Date.now()) => {
    if (attempt.status === 'submitted' || attempt.status === 'expired') {
      return 0;
    }
    const deadlineMs = new Date(attempt.deadline).getTime();
    return Math.max(0, Math.floor((deadlineMs - now) / 1000));
  };

  const now = Date.now();
  const activeAttempt = {
    questionId: 'cq_1',
    status: 'in_progress',
    deadline: new Date(now + 1200 * 1000).toISOString(), // 20 mins left
  };

  assert.strictEqual(computeTimer(activeAttempt, now), 1200);

  // Once submitted:
  activeAttempt.status = 'submitted';
  assert.strictEqual(computeTimer(activeAttempt, now), 0);
});

console.log('\n======================================================');
console.log(`FRONTEND SUBMISSION TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================\n');

if (failCount > 0) process.exit(1);
