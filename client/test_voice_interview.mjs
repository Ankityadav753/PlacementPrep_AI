import assert from 'node:assert';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  VoiceRecognitionController,
} from './src/utils/speechRecognition.js';

console.log('=== RUNNING FRONTEND VOICE INTERVIEW TESTS ===\n');

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

// 1. Browser API Feature Detection
test('Feature detection handles node / non-window environment safely', () => {
  assert.strictEqual(typeof isSpeechRecognitionSupported(), 'boolean');
  assert.strictEqual(typeof isSpeechSynthesisSupported(), 'boolean');
  assert.strictEqual(isSpeechRecognitionSupported(), false); // in pure node
  assert.strictEqual(isSpeechSynthesisSupported(), false);
});

// 2. Mock Speech Recognition Controller for unit testing
class MockWebSpeechRecognition {
  constructor() {
    this.continuous = false;
    this.interimResults = false;
    this.lang = '';
    this.onstart = null;
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) throw new Error('Already started');
    this.isRunning = true;
    if (this.onstart) this.onstart();
  }

  stop() {
    this.isRunning = false;
    if (this.onend) this.onend();
  }

  abort() {
    this.isRunning = false;
    if (this.onend) this.onend();
  }

  // Simulator helper to emit speech recognition event
  emitResult(results, resultIndex = 0) {
    if (this.onresult) {
      this.onresult({
        resultIndex,
        results: results.map((item) => [{ transcript: item.transcript }].concat(item.isFinal ? [{ isFinal: true }] : [])).map((arr, i) => {
          const res = [arr[0]];
          res.isFinal = results[i].isFinal;
          return res;
        }),
      });
    }
  }

  emitError(errorType) {
    if (this.onerror) {
      this.onerror({ error: errorType });
    }
  }
}

// 3. Test VoiceRecognitionController in simulated browser environment
test('VoiceRecognitionController initializes and handles live transcripts', () => {
  const globalRef = globalThis;
  const originalWindow = globalRef.window;

  const mockRecognitionInstance = new MockWebSpeechRecognition();
  globalRef.window = {
    SpeechRecognition: function () {
      return mockRecognitionInstance;
    },
    speechSynthesis: {
      speak: () => {},
      cancel: () => {},
      getVoices: () => [],
    },
    SpeechSynthesisUtterance: function (t) {
      this.text = t;
    },
  };

  try {
    let latestTranscript = '';
    let currentState = 'idle';
    let reportedError = null;

    const controller = new VoiceRecognitionController({
      onTranscriptUpdate: ({ fullText }) => {
        latestTranscript = fullText;
      },
      onStateChange: (state) => {
        currentState = state;
      },
      onError: (err) => {
        reportedError = err;
      },
    });

    // Start listening
    controller.start();
    assert.strictEqual(currentState, 'listening');
    assert.strictEqual(controller.isListening, true);

    // Candidate speaks interim sentence
    mockRecognitionInstance.emitResult([{ transcript: 'React uses a virtual DOM', isFinal: false }]);
    assert.strictEqual(latestTranscript, 'React uses a virtual DOM');

    // Candidate finalizes first sentence
    mockRecognitionInstance.emitResult([{ transcript: 'React uses a virtual DOM to optimize rendering.', isFinal: true }]);
    assert.strictEqual(latestTranscript, 'React uses a virtual DOM to optimize rendering.');

    // Candidate speaks follow-up sentence
    mockRecognitionInstance.emitResult([{ transcript: 'State is mutable while props are immutable.', isFinal: true }], 1);
    assert.strictEqual(
      latestTranscript,
      'React uses a virtual DOM to optimize rendering. State is mutable while props are immutable.'
    );

    // Stop listening
    controller.stop();
    assert.strictEqual(currentState, 'idle');
    assert.strictEqual(controller.isListening, false);

    // Manual set transcript works
    controller.setTranscript('Edited answer for technical accuracy.');
    assert.strictEqual(latestTranscript, 'Edited answer for technical accuracy.');

    // Clear transcript works
    controller.clear();
    assert.strictEqual(latestTranscript, '');

    // Error handling
    mockRecognitionInstance.emitError('not-allowed');
    assert.ok(reportedError);
    assert.strictEqual(reportedError.type, 'not-allowed');
    assert.ok(reportedError.message.includes('denied'));
  } finally {
    globalRef.window = originalWindow;
  }
});

// 4. Voice Interview State Machine & Flow Transitions
class VoiceInterviewSessionRunner {
  constructor({ role }) {
    this.role = role;
    this.status = 'idle'; // 'idle' | 'ai_speaking' | 'listening' | 'evaluating' | 'reviewed' | 'completed'
    this.currentQuestion = null;
    this.questionNumber = 0;
    this.transcript = '';
    this.evaluation = null;
    this.history = [];
  }

  startInterview(firstQ) {
    this.questionNumber = 1;
    this.currentQuestion = firstQ;
    this.status = 'ai_speaking';
  }

  aiFinishedSpeaking() {
    if (this.status === 'ai_speaking') {
      this.status = 'listening';
    }
  }

  candidateSpeaks(words) {
    if (this.status !== 'listening') return false;
    this.transcript = (this.transcript + ' ' + words).trim();
    return true;
  }

  submitAnswer(evalResult) {
    if (this.transcript.trim().length < 5) {
      throw new Error('Answer must be at least 5 characters');
    }
    this.status = 'evaluating';
    this.evaluation = evalResult;
    this.history.push({
      question: this.currentQuestion,
      answer: this.transcript,
      evaluation: evalResult,
    });
    this.status = 'reviewed';
    return this.evaluation;
  }

  nextQuestion(nextQ) {
    if (this.status !== 'reviewed') return false;
    this.questionNumber++;
    this.currentQuestion = nextQ;
    this.transcript = '';
    this.evaluation = null;
    this.status = 'ai_speaking';
    return true;
  }

  finishInterview() {
    this.status = 'completed';
  }
}

test('Voice Interview state machine properly enforces speaking -> listening -> evaluating -> advancing flow', () => {
  const session = new VoiceInterviewSessionRunner({ role: 'Full Stack Developer' });
  assert.strictEqual(session.status, 'idle');

  // 1. Start interview: AI speaks first question aloud
  session.startInterview({
    questionId: 'q_1',
    text: 'Explain the difference between client-side rendering and server-side rendering.',
  });
  assert.strictEqual(session.status, 'ai_speaking');

  // Cannot record while AI is speaking
  assert.strictEqual(session.candidateSpeaks('My answer is...'), false);

  // 2. AI finishes speaking aloud -> microphone opens for candidate
  session.aiFinishedSpeaking();
  assert.strictEqual(session.status, 'listening');

  // Candidate speaks their answer
  session.candidateSpeaks('In client side rendering the browser downloads JS and builds the DOM.');
  session.candidateSpeaks('In server side rendering HTML is pre-rendered on the server for faster initial paint.');
  assert.ok(session.transcript.includes('client side rendering'));

  // Reject empty / trivial answers
  session.transcript = 'hi';
  assert.throws(() => session.submitAnswer({ score: 50 }), /at least 5 characters/);

  // 3. Submit substantive answer for evaluation
  session.transcript = 'Server-side rendering outputs full HTML for better SEO, while client-side handles dynamic UI in the browser.';
  const evalResult = session.submitAnswer({
    score: 88,
    conceptClarity: 85,
    communication: 90,
    strengths: ['Clear distinction between SEO benefits and dynamic reactivity'],
  });
  assert.strictEqual(session.status, 'reviewed');
  assert.strictEqual(evalResult.score, 88);

  // 4. Advance to next question -> AI immediately speaks new question aloud
  session.nextQuestion({
    questionId: 'q_2',
    text: 'How do you handle JWT authentication and token expiration in a Single Page Application?',
  });
  assert.strictEqual(session.status, 'ai_speaking');
  assert.strictEqual(session.questionNumber, 2);
  assert.strictEqual(session.transcript, '');

  // 5. Complete session
  session.finishInterview();
  assert.strictEqual(session.status, 'completed');
  assert.strictEqual(session.history.length, 1);
});

// 5. Timer format utility test
const formatTimer = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

test('Timer formatting displays correct elapsed MM:SS representation', () => {
  assert.strictEqual(formatTimer(0), '00:00');
  assert.strictEqual(formatTimer(59), '00:59');
  assert.strictEqual(formatTimer(60), '01:00');
  assert.strictEqual(formatTimer(275), '04:35');
  assert.strictEqual(formatTimer(3600), '60:00');
});

console.log('\n======================================================');
console.log(`FRONTEND VOICE INTERVIEW TESTS: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================\n');

if (failCount > 0) {
  process.exit(1);
}
