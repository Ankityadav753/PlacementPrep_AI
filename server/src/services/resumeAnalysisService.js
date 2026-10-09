/**
 * Resume Analysis Service
 * Modular, deterministic rule-based ATS evaluation engine.
 * Evaluates extracted resume text against role keywords, section structures,
 * action verbs, quantifiable achievements, formatting, and industry best practices.
 */

// Role-specific keyword dictionaries for campus placement & entry-level roles
const ROLE_KEYWORDS = {
  'Frontend Developer': [
    'react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'redux', 'next.js',
    'responsive design', 'rest api', 'dom', 'vite', 'webpack', 'ui/ux', 'jest',
    'state management', 'web performance', 'git', 'accessibility', 'browser compatibility'
  ],
  'Backend Developer': [
    'node.js', 'express', 'python', 'java', 'spring boot', 'rest api', 'postgresql',
    'mongodb', 'mysql', 'redis', 'docker', 'microservices', 'jwt', 'authentication',
    'system design', 'caching', 'sql', 'nosql', 'git', 'ci/cd', 'orm'
  ],
  'Full Stack Developer': [
    'react', 'node.js', 'express', 'javascript', 'typescript', 'mongodb', 'postgresql',
    'rest api', 'html', 'css', 'tailwind', 'docker', 'next.js', 'redux', 'git',
    'cloud deployment', 'ci/cd', 'sql', 'system design', 'responsive design'
  ],
  'Software Developer': [
    'data structures', 'algorithms', 'object-oriented programming', 'oop', 'java', 'python',
    'c++', 'git', 'unit testing', 'sql', 'problem solving', 'clean code', 'agile',
    'design patterns', 'ci/cd', 'linux', 'rest api', 'debugging'
  ],
  'Java Developer': [
    'java', 'spring boot', 'spring mvc', 'hibernate', 'jpa', 'maven', 'gradle',
    'microservices', 'rest api', 'mysql', 'postgresql', 'junit', 'oop', 'multithreading',
    'docker', 'kafka', 'git', 'jvm', 'design patterns'
  ],
  'Python Developer': [
    'python', 'django', 'fastapi', 'flask', 'pandas', 'numpy', 'rest api', 'postgresql',
    'docker', 'git', 'pytest', 'oop', 'asyncio', 'celery', 'redis', 'sql',
    'data structures', 'algorithms'
  ],
  'Data Analyst': [
    'sql', 'python', 'excel', 'power bi', 'tableau', 'pandas', 'numpy', 'data visualization',
    'data cleaning', 'etl', 'statistics', 'business intelligence', 'dashboards', 'reporting',
    'eda', 'relational databases', 'data analytics', 'data analysis'
  ],
  'General / Any Role': [
    'data structures', 'algorithms', 'git', 'problem solving', 'software engineering',
    'oop', 'rest api', 'sql', 'agile', 'unit testing', 'debugging', 'collaboration',
    'database', 'web development', 'system design'
  ],
};

// Skill categorization taxonomies
const TECHNICAL_SKILL_POOL = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'go', 'rust', 'php', 'ruby',
  'html', 'html5', 'css', 'css3', 'react', 'react.js', 'angular', 'vue', 'vue.js', 'next.js', 'nuxt.js',
  'node.js', 'nodejs', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring boot', 'spring',
  'mongodb', 'postgresql', 'postgres', 'mysql', 'redis', 'sqlite', 'oracle', 'cassandra',
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'linux', 'rest api', 'restful',
  'graphql', 'tailwind', 'tailwind css', 'bootstrap', 'redux', 'pandas', 'numpy', 'tensorflow',
  'pytorch', 'scikit-learn', 'data structures', 'algorithms', 'oop', 'machine learning', 'sql', 'nosql'
];

const TOOLS_POOL = [
  'git', 'github', 'gitlab', 'bitbucket', 'vs code', 'vscode', 'postman', 'jira', 'confluence',
  'docker', 'vite', 'webpack', 'npm', 'yarn', 'pnpm', 'maven', 'gradle', 'jenkins', 'power bi',
  'tableau', 'excel', 'figma', 'canva', 'bash', 'terminal', 'insomnia', 'eclipse', 'intellij'
];

const SOFT_SKILLS_POOL = [
  'communication', 'leadership', 'problem solving', 'teamwork', 'critical thinking',
  'time management', 'adaptability', 'collaboration', 'analytical skills', 'work ethic',
  'mentorship', 'agile', 'scrum', 'creativity', 'conflict resolution', 'presentation'
];

// Strong action verbs that recruiters and ATS look for
const STRONG_ACTION_VERBS = [
  'spearheaded', 'engineered', 'developed', 'implemented', 'architected', 'optimized',
  'deployed', 'automated', 'designed', 'built', 'scaled', 'orchestrated', 'resolved',
  'delivered', 'initiated', 'refactored', 'constructed', 'accelerated', 'streamlined',
  'integrated', 'led', 'managed', 'created', 'formulated', 'enhanced', 'executed'
];

// Weak / passive verbs
const WEAK_VERBS = [
  'worked on', 'helped with', 'assisted', 'responsible for', 'participated in',
  'did', 'handled', 'was involved in', 'duties included'
];

// Resume clichés to avoid
const RESUME_CLICHES = [
  'hard worker', 'team player', 'out-of-the-box thinker', 'go-getter',
  'detail-oriented person', 'results-driven person', 'self-motivated individual'
];

// Unnecessary items that waste space or invite bias
const UNNECESSARY_PATTERNS = [
  { regex: /references\s+available\s+upon\s+request/i, label: "'References available upon request' (standard recruiter expectation; wastes valuable space)" },
  { regex: /\b(marital\s*status|married|unmarried|single)\b/i, label: 'Marital status (irrelevant for modern ATS and professional recruitment)' },
  { regex: /\b(date\s*of\s*birth|dob\s*[:\-])/i, label: 'Date of birth / Age (not required for tech roles and can invite bias)' },
  { regex: /\b(gender|religion|caste|nationality)\b/i, label: 'Demographic indicators (gender/religion/caste/nationality are unnecessary)' },
  { regex: /\b(passport\s*number|father'?s?\s*name|mother'?s?\s*name)\b/i, label: 'Guardian names / passport numbers (not needed on a technical resume)' },
  { regex: /\b(hobbies|interests)\s*[:\-]\s*.*?(watching|games|sleeping|cricket|music)/i, label: 'Unrelated hobbies (e.g., listening to music, watching movies, gaming)' },
];

/**
 * Main analysis function
 * @param {string} text - Extracted raw resume text
 * @param {string} targetRole - Target career role selected by user
 * @returns {object} Full ATS analysis result
 */
export const analyzeResume = (text, targetRole = 'General / Any Role') => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('No resume text provided for analysis.');
  }

  const normalizedText = text.toLowerCase();
  const rawWords = text.split(/\s+/).filter(Boolean);
  const wordCount = rawWords.length;

  // 1. Contact Information Audit
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(text);
  const hasPhone = /(?:(?:\+|00)\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,5}[\s-]?\d{3,5}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\/|linkedin/i.test(text);
  const hasGitHub = /github\.com\/|github/i.test(text);
  const hasPortfolio = /portfolio|vercel\.app|github\.io|netlify\.app|\.dev/i.test(text);

  // 2. Section Detection
  const hasSkillsSection = /skills|technical skills|technologies|proficiencies|core competencies/i.test(text);
  const hasProjectsSection = /projects|academic projects|personal projects|key projects/i.test(text);
  const hasEducationSection = /education|academic background|qualifications|bachelor|b\.tech|b\.e|bca|mca|degree/i.test(text);
  const hasExperienceSection = /experience|internship|work experience|employment|work history/i.test(text);
  const hasCertificationsSection = /certifications|certificates|courses|licenses|achievements/i.test(text);

  // 3. Target Role & Keyword Matching
  const roleKeywords = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['General / Any Role'];
  const matchedRoleKeywords = [];
  const missingRoleKeywords = [];

  roleKeywords.forEach((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    if (regex.test(text)) {
      matchedRoleKeywords.push(kw);
    } else {
      missingRoleKeywords.push(kw);
    }
  });

  // 4. Categorized Skill Extraction
  const foundTechSkills = TECHNICAL_SKILL_POOL.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i').test(text);
  });

  const foundTools = TOOLS_POOL.filter((tool) => {
    const escaped = tool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i').test(text);
  });

  const foundSoftSkills = SOFT_SKILLS_POOL.filter((soft) => {
    const escaped = soft.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i').test(text);
  });

  // 5. Action Verbs & Metrics
  const foundActionVerbs = STRONG_ACTION_VERBS.filter((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return regex.test(text);
  });

  const foundWeakVerbs = WEAK_VERBS.filter((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return regex.test(text);
  });

  // Metrics detection (percentages, multipliers, concrete quantities)
  const metricRegex = /(\b\d+%\b|\b\d+x\b|\b\d+\+?\s*(?:users|clients|stars|downloads|requests|ms|seconds|hours|queries)\b|\b(?:reduced|increased|improved|decreased|saved)\s+[^.\n]{0,30}\b\d+)/gi;
  const metricsMatches = text.match(metricRegex) || [];
  const hasMetrics = metricsMatches.length > 0;

  // 6. Project Analysis
  const projectKeywords = ['react', 'node', 'api', 'full-stack', 'system', 'database', 'app', 'web', 'machine learning', 'dashboard'];
  const projectMentions = projectKeywords.filter((pk) => normalizedText.includes(pk)).length;
  const estimatedProjects = hasProjectsSection ? Math.min(5, Math.max(1, Math.round(projectMentions / 2))) : 0;
  const projectFeedback = [];
  if (!hasProjectsSection) {
    projectFeedback.push('No dedicated Projects section detected. Add 2–3 notable technical projects with live links or GitHub repos.');
  } else {
    projectFeedback.push(`Detected Projects section with approximately ${estimatedProjects} featured technical initiative(s).`);
    if (!hasMetrics) {
      projectFeedback.push('Project descriptions lack measurable results. Include metrics such as speedup percentage, user count, or uptime.');
    } else {
      projectFeedback.push('Projects include quantifiable outcomes and technical metrics, which helps ATS ranking.');
    }
  }

  // 7. Education Analysis
  const degreeMatches = text.match(/\b(b\.?tech|b\.?e\.?|bca|mca|m\.?tech|bachelor|master|b\.?sc|m\.?sc|diploma)\b/gi) || [];
  const uniqueDegrees = [...new Set(degreeMatches.map((d) => d.toUpperCase()))];
  const educationFeedback = [];
  if (hasEducationSection) {
    educationFeedback.push('Education section is clearly present.');
    if (uniqueDegrees.length > 0) {
      educationFeedback.push(`Detected degree qualification: ${uniqueDegrees.join(', ')}.`);
    } else {
      educationFeedback.push('Specify your exact degree title, major/discipline, and college name clearly.');
    }
    const hasYear = /\b(201\d|202\d|2030)\b/.test(text);
    if (!hasYear) {
      educationFeedback.push('Include graduation year or expected graduation date.');
    }
  } else {
    educationFeedback.push('No formal Education section detected. Campus recruiters prioritize academic degrees and university information.');
  }

  // 8. Experience Analysis
  const experienceFeedback = [];
  if (hasExperienceSection) {
    experienceFeedback.push('Work experience / Internship section detected.');
    if (foundActionVerbs.length < 3) {
      experienceFeedback.push('Begin each experience bullet point with strong action verbs (e.g. Engineered, Spearheaded, Automated).');
    }
  } else {
    experienceFeedback.push('No formal Work Experience or Internship section detected. For fresher roles, highlight internships, open-source work, or college club technical roles.');
  }

  // 9. Certification Analysis
  const certKeywords = ['certified', 'certification', 'certificate', 'aws', 'coursera', 'udemy', 'hackerrank', 'leetcode', 'meta', 'google', 'oracle'];
  const detectedCertTokens = certKeywords.filter((token) => normalizedText.includes(token));
  const certificationFeedback = [];
  if (hasCertificationsSection || detectedCertTokens.length > 0) {
    certificationFeedback.push('Certifications / Courses detected. Validates continuous learning.');
  } else {
    certificationFeedback.push('Consider adding relevant industry certifications (e.g., AWS Cloud Practitioner, HackerRank Problem Solving, specialized course credentials).');
  }

  // 10. Formatting Issues
  const formattingIssues = [];
  if (wordCount < 200) {
    formattingIssues.push(`Resume text is sparse (${wordCount} words). Aim for 350–700 words for a competitive single-page resume.`);
  } else if (wordCount > 1100) {
    formattingIssues.push(`Resume text is very long (${wordCount} words). For fresher placement, keep within a concise 1–2 page ATS layout.`);
  }

  if (!hasSkillsSection) formattingIssues.push('Missing explicit "Skills" section heading.');
  if (!hasProjectsSection) formattingIssues.push('Missing explicit "Projects" section heading.');
  if (!hasEducationSection) formattingIssues.push('Missing explicit "Education" section heading.');
  if (!hasEmail) formattingIssues.push('No email address detected in contact information.');
  if (!hasPhone) formattingIssues.push('No phone number detected in contact information.');
  if (!hasLinkedIn && !hasGitHub) formattingIssues.push('Missing links to professional profiles (LinkedIn or GitHub).');

  // 11. Grammar & Wording Issues
  const grammarIssues = [];
  const firstPersonRegex = /\b(i|my|me|myself|we|our)\b/gi;
  const firstPersonMatches = text.match(firstPersonRegex) || [];
  if (firstPersonMatches.length > 0) {
    grammarIssues.push(`Found ${firstPersonMatches.length} first-person pronoun(s) ("I", "my", "we"). Modern ATS resumes should use third-person action verbs.`);
  }

  RESUME_CLICHES.forEach((cliche) => {
    if (normalizedText.includes(cliche)) {
      grammarIssues.push(`Replace buzzword "${cliche}" with concrete technical accomplishments.`);
    }
  });

  if (foundWeakVerbs.length > 0) {
    grammarIssues.push(`Weak phrasing detected: ${foundWeakVerbs.slice(0, 3).map((v) => `"${v}"`).join(', ')}. Replace with dynamic action verbs.`);
  }

  // 12. Unnecessary Information
  const unnecessaryInformation = [];
  UNNECESSARY_PATTERNS.forEach((item) => {
    if (item.regex.test(text)) {
      unnecessaryInformation.push(item.label);
    }
  });

  // 13. Bullet Point Improvement Suggestions
  const bulletPointSuggestions = [];
  const sentences = text
    .split(/[\n•\-*]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 200);

  const weakSentences = sentences.filter((s) =>
    /\b(worked on|helped with|responsible for|assisted|did|built a|made a)\b/i.test(s)
  );

  if (weakSentences.length > 0) {
    weakSentences.slice(0, 3).forEach((original) => {
      let improved = original
        .replace(/worked on/i, 'Architected and implemented')
        .replace(/helped with/i, 'Collaborated on developing')
        .replace(/responsible for/i, 'Led end-to-end execution of')
        .replace(/assisted/i, 'Engineered critical modules in')
        .replace(/did/i, 'Executed');

      if (!/\d+%|\d+/.test(improved)) {
        improved = `${improved}, improving efficiency and test coverage by 25%`;
      }

      bulletPointSuggestions.push({
        original,
        improved,
        reason: 'Replaced passive phrasing with strong action verbs and added measurable performance impact.',
      });
    });
  }

  // Fallback high-impact suggestions tailored to target role
  if (bulletPointSuggestions.length < 2) {
    if (targetRole.includes('Frontend')) {
      bulletPointSuggestions.push({
        original: 'Created responsive frontend UI using React components.',
        improved: 'Engineered responsive React web interface with Tailwind CSS, reducing initial page load time by 34% across mobile and desktop devices.',
        reason: 'Adds quantifiable performance benchmark (34% faster load) and specifies modern CSS tooling.',
      });
    } else if (targetRole.includes('Backend') || targetRole.includes('Java')) {
      bulletPointSuggestions.push({
        original: 'Developed REST APIs and handled database queries.',
        improved: 'Architected robust RESTful endpoints with Node.js/Express, optimizing PostgreSQL queries and caching with Redis to achieve sub-120ms latency.',
        reason: 'Specifies architectural pattern, caching layer, and quantifiable sub-120ms response time.',
      });
    } else if (targetRole.includes('Data')) {
      bulletPointSuggestions.push({
        original: 'Analyzed sales data and made charts in Excel.',
        improved: 'Designed interactive Power BI and SQL dashboards analyzing 50,000+ customer records, identifying $15K in quarterly cost optimization opportunities.',
        reason: 'Showcases scale (50,000+ records) and business dollar impact.',
      });
    } else {
      bulletPointSuggestions.push({
        original: 'Worked on a web project for college placement.',
        improved: 'Spearheaded full-stack application development utilizing Git version control, implementing automated CI/CD workflows and modular REST APIs.',
        reason: 'Demonstrates initiative, industry-standard version control, and modular system design.',
      });
    }
  }

  // 14. Strengths & Issues Summaries
  const strengths = [];
  const issues = [];

  if (hasEmail && hasPhone) strengths.push('Complete contact information with reachable email and phone number.');
  if (hasLinkedIn || hasGitHub) strengths.push('Included professional profile links (LinkedIn / GitHub / Portfolio).');
  if (hasSkillsSection && foundTechSkills.length >= 5) strengths.push(`Strong technical skill variety detected (${foundTechSkills.length} key technologies).`);
  if (hasProjectsSection) strengths.push('Dedicated projects section present, showcasing practical development experience.');
  if (hasEducationSection) strengths.push('Clear academic credentials and degree qualifications present.');
  if (foundActionVerbs.length >= 4) strengths.push(`Effective use of dynamic action verbs (${foundActionVerbs.slice(0, 4).join(', ')}).`);
  if (hasMetrics) strengths.push('Includes quantifiable metrics and performance-driven results.');
  if (matchedRoleKeywords.length >= 4) strengths.push(`Solid keyword alignment with target role "${targetRole}" (${matchedRoleKeywords.length} matching terms).`);

  if (!hasLinkedIn && !hasGitHub) issues.push('No GitHub or LinkedIn profile link detected. Technical recruiters expect verifiable repositories.');
  if (!hasMetrics) issues.push('Lacks quantifiable metrics. Quantify achievements with percentages, latency reductions, or scale numbers.');
  if (missingRoleKeywords.length > 3) issues.push(`Missing important target role keywords for ${targetRole}: ${missingRoleKeywords.slice(0, 4).join(', ')}.`);
  if (firstPersonMatches.length > 0) issues.push('Uses first-person pronouns ("I", "my"). Refactor to direct action verbs.');
  if (unnecessaryInformation.length > 0) issues.push('Contains redundant or outdated personal details (e.g. marital status, references statement).');
  if (foundActionVerbs.length < 3) issues.push('Bullet points rely on passive phrases. Start bullet points with strong action verbs.');

  if (strengths.length === 0) strengths.push('Extracted readable resume structure.');
  if (issues.length === 0) issues.push('Add further quantifiable performance metrics to elevate ATS standing.');

  // 15. Deterministic ATS Compatibility Score Calculation (0 - 100)
  let score = 0;

  // Contact Info (up to 15 pts)
  if (hasEmail) score += 5;
  if (hasPhone) score += 4;
  if (hasLinkedIn || hasGitHub || hasPortfolio) score += 6;

  // Section Completeness (up to 20 pts)
  if (hasSkillsSection) score += 5;
  if (hasProjectsSection) score += 6;
  if (hasEducationSection) score += 5;
  if (hasExperienceSection) score += 4;

  // Target Role Keyword Alignment (up to 25 pts)
  const roleKwMatchRatio = roleKeywords.length > 0 ? matchedRoleKeywords.length / Math.min(8, roleKeywords.length) : 0.5;
  score += Math.min(25, Math.round(roleKwMatchRatio * 25));

  // Action Verbs & Metrics (up to 25 pts)
  const actionVerbPoints = Math.min(13, foundActionVerbs.length * 3);
  const metricPoints = hasMetrics ? 12 : 2;
  score += (actionVerbPoints + metricPoints);

  // Certifications, Tools & Breadth (up to 15 pts)
  if (foundTools.length >= 2) score += 4;
  if (foundSoftSkills.length >= 2) score += 3;
  if (hasCertificationsSection || detectedCertTokens.length > 0) score += 5;
  if (wordCount >= 300 && wordCount <= 900) score += 3;

  // Deductions (up to -15 pts)
  if (firstPersonMatches.length > 0) score -= Math.min(5, firstPersonMatches.length * 2);
  if (unnecessaryInformation.length > 0) score -= Math.min(4, unnecessaryInformation.length * 2);
  if (wordCount < 200) score -= 10;
  if (wordCount > 1200) score -= 5;
  if (foundWeakVerbs.length > 0) score -= Math.min(4, foundWeakVerbs.length * 2);

  // Clamp strictly between 0 and 100
  const atsScore = Math.max(10, Math.min(100, Math.round(score)));

  return {
    atsScore,
    strengths,
    issues,
    missingKeywords: missingRoleKeywords.slice(0, 8),
    skillAnalysis: {
      found: [...new Set([...foundTechSkills, ...foundTools, ...foundSoftSkills])],
      missing: missingRoleKeywords.slice(0, 8),
      categorized: {
        technical: foundTechSkills,
        soft: foundSoftSkills,
        tools: foundTools,
      },
    },
    projectAnalysis: {
      count: estimatedProjects,
      hasMetrics,
      feedback: projectFeedback,
    },
    educationAnalysis: {
      found: hasEducationSection,
      degrees: uniqueDegrees,
      feedback: educationFeedback,
    },
    experienceAnalysis: {
      hasExperience: hasExperienceSection,
      feedback: experienceFeedback,
    },
    certificationAnalysis: {
      found: hasCertificationsSection || detectedCertTokens.length > 0,
      count: detectedCertTokens.length,
      items: detectedCertTokens,
      feedback: certificationFeedback,
    },
    formattingIssues,
    grammarIssues,
    unnecessaryInformation,
    bulletPointSuggestions,
  };
};

export default {
  analyzeResume,
};
