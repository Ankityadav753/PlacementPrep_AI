import dotenv from 'dotenv';
dotenv.config();

// Standard Judge0 CE language IDs
export const JUDGE0_LANGUAGE_MAP = {
  cpp: parseInt(process.env.JUDGE0_LANG_CPP || '54', 10), // C++ (GCC 9.2.0)
  java: parseInt(process.env.JUDGE0_LANG_JAVA || '62', 10), // Java (OpenJDK 13.0.1)
  python: parseInt(process.env.JUDGE0_LANG_PYTHON || '71', 10), // Python (3.8.1)
  javascript: parseInt(process.env.JUDGE0_LANG_JAVASCRIPT || '63', 10), // JavaScript (Node.js 12.14.0)
};

// Maximum source code character limit (64 KB)
export const MAX_CODE_LENGTH = 64 * 1024;

// Default execution resource limits
export const DEFAULT_EXECUTION_LIMITS = {
  cpu_time_limit: 2.5, // 2.5 seconds CPU limit
  wall_time_limit: 5.0, // 5.0 seconds wall clock limit
  memory_limit: 128000, // 128 MB (in KB)
};

// Global hook for injecting a custom execution provider (for deterministic tests)
let customExecutionProvider = null;

export const setExecutionProvider = (providerFn) => {
  customExecutionProvider = providerFn;
};

export const resetExecutionProvider = () => {
  customExecutionProvider = null;
};

/**
 * Normalize text output by trimming whitespace and normalizing newlines.
 */
export const normalizeOutput = (val) => {
  if (val === null || val === undefined) return '';
  return val
    .toString()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
};

/**
 * Build request headers for Judge0 API calls without exposing credentials.
 */
const buildJudge0Headers = (baseUrl) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const apiKey = process.env.JUDGE0_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    if (baseUrl.includes('rapidapi.com')) {
      headers['X-RapidAPI-Key'] = apiKey.trim();
      try {
        const urlObj = new URL(baseUrl);
        headers['X-RapidAPI-Host'] = urlObj.hostname;
      } catch {
        // Fallback hostname
        headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
      }
    } else {
      headers['X-Auth-Token'] = apiKey.trim();
    }
  }

  return headers;
};

/**
 * Execute a single source code submission with stdin through Judge0.
 */
export const executeSingleSubmission = async ({
  code,
  language,
  stdin = '',
  expectedOutput = '',
}) => {
  // 1. Validate inputs
  if (typeof code !== 'string' || !code.trim()) {
    const error = new Error('Source code must be a non-empty string.');
    error.statusCode = 400;
    throw error;
  }

  if (code.length > MAX_CODE_LENGTH) {
    const error = new Error('Source code exceeds the maximum allowed length (64 KB).');
    error.statusCode = 400;
    throw error;
  }

  const normalizedLang = (language || '').toLowerCase().trim();
  const languageId = JUDGE0_LANGUAGE_MAP[normalizedLang];
  if (!languageId) {
    const error = new Error(`Unsupported programming language: ${language}. Supported languages: cpp, java, python, javascript.`);
    error.statusCode = 400;
    throw error;
  }

  // 2. If a mock execution provider is registered (used in test suite), invoke it directly
  if (typeof customExecutionProvider === 'function') {
    return await customExecutionProvider({
      code,
      language: normalizedLang,
      languageId,
      stdin,
      expectedOutput,
    });
  }

  // 3. Prepare Judge0 submission payload
  const rawBaseUrl = process.env.JUDGE0_BASE_URL || 'http://localhost:2358';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const headers = buildJudge0Headers(baseUrl);

  const payload = {
    source_code: code,
    language_id: languageId,
    stdin: stdin || '',
    expected_output: expectedOutput || undefined,
    cpu_time_limit: DEFAULT_EXECUTION_LIMITS.cpu_time_limit,
    wall_time_limit: DEFAULT_EXECUTION_LIMITS.wall_time_limit,
    memory_limit: DEFAULT_EXECUTION_LIMITS.memory_limit,
  };

  try {
    // Attempt wait=true request for immediate evaluation
    const submitUrl = `${baseUrl}/submissions?base64_encoded=false&wait=true`;
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Judge0 HTTP error: ${response.status} ${response.statusText}`);
      const err = new Error('Code execution service is temporarily unavailable.');
      err.statusCode = 500;
      throw err;
    }

    let resultData = await response.json();

    // If wait=true was queued or returned a pending token, poll until completed or timeout
    if (resultData.status && (resultData.status.id === 1 || resultData.status.id === 2)) {
      const token = resultData.token;
      if (token) {
        const pollUrl = `${baseUrl}/submissions/${token}?base64_encoded=false`;
        const startTime = Date.now();
        const maxPollMs = 12000; // 12 seconds max poll window

        while (Date.now() - startTime < maxPollMs) {
          await new Promise((r) => setTimeout(r, 800));
          const pollRes = await fetch(pollUrl, { headers });
          if (pollRes.ok) {
            resultData = await pollRes.json();
            if (resultData.status && resultData.status.id > 2) {
              break;
            }
          }
        }
      }
    }

    const statusId = resultData.status?.id || 0;
    const statusDesc = resultData.status?.description || 'Unknown';
    const stdout = resultData.stdout || '';
    const stderr = resultData.stderr || '';
    const compileOutput = resultData.compile_output || '';
    const message = resultData.message || '';
    const executionTime = parseFloat(resultData.time) || 0;
    const memoryUsed = parseInt(resultData.memory, 10) || 0;
    const exitCode = resultData.exit_code !== undefined ? resultData.exit_code : null;

    // Determine whether output matched expected
    const normalizedActual = normalizeOutput(stdout);
    const normalizedExpected = normalizeOutput(expectedOutput);
    const isAccepted = statusId === 3 || (statusId !== 6 && statusId !== 5 && statusId <= 4 && normalizedActual === normalizedExpected);

    return {
      statusId,
      status: statusDesc,
      isAccepted,
      stdout,
      stderr,
      compileOutput,
      message,
      time: executionTime,
      memory: memoryUsed,
      exitCode,
      actualOutput: normalizedActual,
      expectedOutput: normalizedExpected,
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error('Judge0 connection error:', error.message);
    const safeError = new Error('Code execution service is temporarily unavailable.');
    safeError.statusCode = 500;
    throw safeError;
  }
};

/**
 * Execute multiple test cases sequentially for Run or Submit.
 * For Run: testCases is visible only.
 * For Submit: testCases includes all visible and hidden cases.
 */
export const executeTestSuite = async ({
  code,
  language,
  testCases = [],
  stopOnFirstError = false,
}) => {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    return {
      resultStatus: 'No Test Cases',
      testCasesPassed: 0,
      totalTestCases: 0,
      score: 0,
      executionTime: 0,
      memoryUsed: 0,
      compilerError: '',
      runtimeError: '',
      caseResults: [],
    };
  }

  let passedCount = 0;
  let maxTime = 0;
  let maxMemory = 0;
  let compilerError = '';
  let runtimeError = '';
  let primaryStatus = 'Accepted';

  const caseResults = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execRes = await executeSingleSubmission({
      code,
      language,
      stdin: tc.input || '',
      expectedOutput: tc.expectedOutput || '',
    });

    if (execRes.time > maxTime) maxTime = execRes.time;
    if (execRes.memory > maxMemory) maxMemory = execRes.memory;

    // Check for compilation error (status ID 6)
    if (execRes.statusId === 6 || execRes.compileOutput) {
      compilerError = execRes.compileOutput || execRes.stderr || 'Compilation error encountered.';
      primaryStatus = 'Compilation Error';
      caseResults.push({
        index: i + 1,
        passed: false,
        status: 'Compilation Error',
        hidden: Boolean(tc.hidden),
        time: execRes.time,
        memory: execRes.memory,
      });
      // A compilation error breaks all subsequent test cases immediately
      break;
    }

    // Check for runtime error or timeout
    if (execRes.statusId === 5) {
      primaryStatus = 'Time Limit Exceeded';
      runtimeError = 'Time Limit Exceeded';
    } else if (execRes.statusId >= 7 && execRes.statusId <= 12) {
      primaryStatus = 'Runtime Error';
      runtimeError = execRes.stderr || execRes.message || 'Runtime error encountered.';
    }

    const passed = Boolean(execRes.isAccepted);
    if (passed) {
      passedCount++;
    } else if (primaryStatus === 'Accepted') {
      primaryStatus = execRes.status || 'Wrong Answer';
    }

    caseResults.push({
      index: i + 1,
      passed,
      status: passed ? 'Accepted' : (execRes.status || 'Wrong Answer'),
      hidden: Boolean(tc.hidden),
      time: execRes.time,
      memory: execRes.memory,
      // Only include candidate output for visible test cases
      actualOutput: tc.hidden ? undefined : execRes.actualOutput,
      input: tc.hidden ? undefined : tc.input,
      expectedOutput: tc.hidden ? undefined : tc.expectedOutput,
    });

    if (stopOnFirstError && !passed) {
      break;
    }
  }

  const total = testCases.length;
  const score = total > 0 ? Math.round((passedCount / total) * 100) : 0;

  if (passedCount === total && total > 0) {
    primaryStatus = 'Accepted';
  } else if (primaryStatus === 'Accepted' && passedCount < total) {
    primaryStatus = 'Wrong Answer';
  }

  return {
    resultStatus: primaryStatus,
    testCasesPassed: passedCount,
    totalTestCases: total,
    score,
    executionTime: maxTime,
    memoryUsed: maxMemory,
    compilerError,
    runtimeError,
    caseResults,
  };
};

export default {
  JUDGE0_LANGUAGE_MAP,
  MAX_CODE_LENGTH,
  DEFAULT_EXECUTION_LIMITS,
  setExecutionProvider,
  resetExecutionProvider,
  normalizeOutput,
  executeSingleSubmission,
  executeTestSuite,
};
