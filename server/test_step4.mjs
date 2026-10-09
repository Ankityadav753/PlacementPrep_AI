import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';
import { generateToken } from './src/utils/jwt.js';
import { registerUser } from './src/services/authService.js';
import mongoose from 'mongoose';

// Build a valid raw PDF buffer containing given text lines
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

async function runTests() {
  console.log('=== RUNNING RESUME ANALYZER (STEP 4) BACKEND TESTS ===\n');

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/resume`;

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
    // Setup Test Users (in-memory or DB)
    const { user: userA, token: tokenA } = await registerUser({
      name: 'Candidate Alpha',
      email: `alpha_${Date.now()}@example.com`,
      password: 'Password123!',
    });

    const { user: userB, token: tokenB } = await registerUser({
      name: 'Candidate Beta',
      email: `beta_${Date.now()}@example.com`,
      password: 'Password123!',
    });

    console.log(`Test users created: User A (${userA.id}), User B (${userB.id})\n`);

    // TEST 1: Unauthenticated upload -> 401
    {
      const formData = new FormData();
      const fakePdf = new Blob([createSimplePdf(['Test resume'])], { type: 'application/pdf' });
      formData.append('file', fakePdf, 'resume.pdf');

      const res = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });
      assert(res.status === 401, 'Test 1: Unauthenticated upload returns 401 Unauthorized');
    }

    // TEST 2: Valid User Authentication
    {
      const res = await fetch(`http://127.0.0.1:${port}/api/auth/me`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success && data.data?.user?.email === userA.email,
        'Test 2: Valid user authentication recognized by JWT middleware'
      );
    }

    // TEST 3: Non-PDF upload -> 400
    {
      const formData = new FormData();
      const textBlob = new Blob(['Not a PDF file content'], { type: 'text/plain' });
      formData.append('file', textBlob, 'resume.txt');

      const res = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: formData,
      });
      const data = await res.json();
      assert(
        res.status === 400 && data.success === false && /pdf/i.test(data.message),
        'Test 3: Non-PDF upload rejected with 400 Bad Request'
      );
    }

    // TEST 4: File > 5 MB -> 400
    {
      const largeBuffer = Buffer.alloc(5.2 * 1024 * 1024);
      const largeBlob = new Blob([largeBuffer], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', largeBlob, 'large_resume.pdf');

      const res = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: formData,
      });
      const data = await res.json();
      assert(
        res.status === 400 && data.success === false && /5 MB|limit|size/i.test(data.message),
        'Test 4: File exceeding 5 MB rejected with 400'
      );
    }

    // TEST 5 & 6: Valid PDF upload -> success (201) & Actual PDF text extraction
    const sampleResumeLines = [
      'John Doe - Software Engineer Candidate',
      'Email: john.doe@example.com Phone: +1-555-0199',
      'LinkedIn: linkedin.com/in/johndoe GitHub: github.com/johndoe',
      'Technical Skills: React, Node.js, JavaScript, Python, SQL, Express, MongoDB, Git, Docker',
      'Education: Bachelor of Technology B.Tech Computer Science 2024',
      'Projects: Full Stack E-Commerce Platform engineered using React, Node.js, and Redis caching',
      'Architected REST APIs, improving query response latency by 35%',
      'Experience: Software Engineering Intern at TechCorp. Spearheaded modular feature development',
      'Certifications: AWS Certified Cloud Practitioner',
    ];
    const validPdfBuffer = createSimplePdf(sampleResumeLines);

    let createdResumeId = null;
    {
      const formData = new FormData();
      const pdfBlob = new Blob([validPdfBuffer], { type: 'application/pdf' });
      formData.append('file', pdfBlob, 'John_Doe_Resume.pdf');
      formData.append('targetRole', 'Frontend Developer');

      const res = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: formData,
      });
      const data = await res.json();

      assert(res.status === 201 && data.success === true, 'Test 5: Valid PDF upload succeeds with 201 Created');
      createdResumeId = data.data?.id || data.data?._id;

      const extracted = data.data?.extractedText || '';
      assert(
        extracted.includes('John Doe') &&
        extracted.includes('React') &&
        extracted.includes('john.doe@example.com'),
        'Test 6: Actual plain text successfully extracted from PDF'
      );
    }

    // TEST 7: Resume analysis -> success (200)
    let analysisResult = null;
    {
      const res = await fetch(`${baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenA}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: createdResumeId,
          targetRole: 'Frontend Developer',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success === true && data.data?.analysis,
        'Test 7: Resume analysis succeeds with 200 OK'
      );
      analysisResult = data.data?.analysis;
    }

    // TEST 8: ATS score generated from actual text
    {
      const score = analysisResult?.atsScore;
      assert(
        typeof score === 'number' && score >= 0 && score <= 100,
        `Test 8: ATS score generated as integer in [0, 100] (Calculated score: ${score})`
      );
    }

    // TEST 9: Analysis uses actual PDF content
    {
      const techSkills = analysisResult?.skillAnalysis?.categorized?.technical || [];
      const hasReact = techSkills.some((s) => /react/i.test(s));
      const strengths = analysisResult?.strengths || [];
      const hasEducation = analysisResult?.educationAnalysis?.found === true;

      assert(
        hasReact && hasEducation && strengths.length > 0,
        'Test 9: Analysis report strictly reflects extracted resume details (React found, Education found)'
      );
    }

    // TEST 10: Owner can retrieve own resume -> 200
    {
      const res = await fetch(`${baseUrl}/${createdResumeId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success === true && (data.data?.id === createdResumeId || data.data?._id === createdResumeId),
        'Test 10: Resume owner (User A) successfully retrieves own resume'
      );
    }

    // TEST 11: Non-owner cannot retrieve another user resume -> 403
    {
      const res = await fetch(`${baseUrl}/${createdResumeId}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      const data = await res.json();
      assert(
        res.status === 403 && data.success === false,
        'Test 11: User B receiving 403 Forbidden when attempting to retrieve User A resume'
      );
    }

    // TEST 12: Non-owner cannot analyze another user resume -> 403
    {
      const res = await fetch(`${baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenB}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: createdResumeId,
          targetRole: 'Backend Developer',
        }),
      });
      const data = await res.json();
      assert(
        res.status === 403 && data.success === false,
        'Test 12: User B receiving 403 Forbidden when attempting to analyze User A resume'
      );
    }

    // TEST 13: Malformed PDF handled safely without crashing -> 400
    {
      const corruptBuffer = Buffer.from('%PDF-1.4\nGARBAGE_BYTES_CORRUPTED_PDF_HEADER_AND_BODY');
      const corruptBlob = new Blob([corruptBuffer], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', corruptBlob, 'corrupt.pdf');

      const res = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: formData,
      });
      const data = await res.json();
      assert(
        res.status === 400 && data.success === false && /readable text|pdf/i.test(data.message),
        'Test 13: Corrupted / malformed PDF handled safely without crashing (400 returned)'
      );
    }

    // TEST 14: Empty PDF handled safely -> 400
    {
      const emptyBuffer = Buffer.from('');
      const emptyBlob = new Blob([emptyBuffer], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', emptyBlob, 'empty.pdf');

      const res = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: formData,
      });
      const data = await res.json();
      assert(
        res.status === 400 && data.success === false,
        'Test 14: Empty PDF handled safely without crashing (400 returned)'
      );
    }

    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
    console.log(`========================================\n`);

    server.close();
    if (failCount > 0) process.exit(1);
    process.exit(0);
  } catch (err) {
    console.error('TEST SUITE CRASHED:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
