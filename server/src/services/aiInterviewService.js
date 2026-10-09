import dotenv from 'dotenv';
dotenv.config();

export const SUPPORTED_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Developer',
  'Java Developer',
  'Python Developer',
  'Data Analyst',
];

export const CATEGORIES = ['technical', 'project', 'hr', 'behavioral'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const INTERVIEW_QUESTION_LIMIT = 10;

// Global hook for injecting custom AI provider in automated tests
let customAiInterviewProvider = null;

export const setAiInterviewProvider = (providerFn) => {
  customAiInterviewProvider = providerFn;
};

export const resetAiInterviewProvider = () => {
  customAiInterviewProvider = null;
};

/**
 * Question bank for grounded, deterministic offline & fallback generation.
 * Organised by role, category, and difficulty level.
 */
const QUESTION_BANK = {
  'Frontend Developer': {
    technical: {
      Easy: [
        {
          questionId: 'fe_tech_e1',
          text: 'Explain the difference between let, const, and var in JavaScript, and what hoisting means.',
        },
        {
          questionId: 'fe_tech_e2',
          text: 'What is the Virtual DOM in React, and how does it optimize rendering performance compared to the real DOM?',
        },
        {
          questionId: 'fe_tech_e3',
          text: 'Explain the CSS box model and the difference between content-box and border-box sizing.',
        },
        {
          questionId: 'fe_tech_e4',
          text: 'What is the difference between localStorage, sessionStorage, and cookies in web browsers?',
        },
      ],
      Medium: [
        {
          questionId: 'fe_tech_m1',
          text: 'Explain how JavaScript closures work with a practical example of where you would use one in UI development.',
        },
        {
          questionId: 'fe_tech_m2',
          text: 'In React, how do useState and useEffect interact, and how do you prevent unwanted infinite re-renders?',
        },
        {
          questionId: 'fe_tech_m3',
          text: 'What is the difference between event bubbling and event capturing in JavaScript, and how does event delegation leverage this?',
        },
        {
          questionId: 'fe_tech_m4',
          text: 'Explain how CSS Flexbox differs from CSS Grid, and in what layout scenarios you would choose one over the other.',
        },
      ],
      Hard: [
        {
          questionId: 'fe_tech_h1',
          text: 'How does the JavaScript Event Loop handle synchronous code, microtasks (Promises), and macrotasks (setTimeout)? Walk through execution order.',
        },
        {
          questionId: 'fe_tech_h2',
          text: 'How would you analyze and optimize Core Web Vitals (such as LCP, CLS, and INP) for a slow-loading client-side single page application?',
        },
        {
          questionId: 'fe_tech_h3',
          text: 'Explain Client-Side Rendering (CSR) versus Server-Side Rendering (SSR). What happens during the hydration process and what issues can arise?',
        },
      ],
    },
    project: {
      Easy: [
        {
          questionId: 'fe_proj_e1',
          text: 'Describe a frontend project you built. What technologies did you choose and why?',
        },
        {
          questionId: 'fe_proj_e2',
          text: 'How did you handle component styling in your project (e.g., plain CSS, CSS modules, Tailwind, or Styled Components)?',
        },
      ],
      Medium: [
        {
          questionId: 'fe_proj_m1',
          text: 'In your frontend project, how did you manage application state (e.g., props, context, or external state stores) as the UI grew?',
        },
        {
          questionId: 'fe_proj_m2',
          text: 'Describe a tricky responsive layout bug or cross-browser compatibility issue you faced in your project and how you resolved it.',
        },
      ],
      Hard: [
        {
          questionId: 'fe_proj_h1',
          text: 'What architectural trade-offs did you make in your frontend project regarding bundle size, lazy loading, and code splitting?',
        },
      ],
    },
    behavioral: {
      Easy: [
        {
          questionId: 'fe_beh_e1',
          text: 'How do you approach a situation where UI design requirements from a peer or lead seem ambiguous?',
        },
      ],
      Medium: [
        {
          questionId: 'fe_beh_m1',
          text: 'Describe a time when you and a teammate had conflicting opinions on UI implementation. How did you reach an agreement?',
        },
      ],
      Hard: [
        {
          questionId: 'fe_beh_h1',
          text: 'How do you prioritize fixing critical production UI glitches versus completing planned feature deliverables on a deadline?',
        },
      ],
    },
    hr: {
      Easy: [
        {
          questionId: 'fe_hr_e1',
          text: 'What motivated you to specialize in Frontend development, and how do you stay updated with rapidly evolving web ecosystems?',
        },
      ],
      Medium: [
        {
          questionId: 'fe_hr_m1',
          text: 'As a fresher, what steps do you take when you encounter a technical blocker that you cannot solve after 30 minutes of searching?',
        },
      ],
      Hard: [
        {
          questionId: 'fe_hr_h1',
          text: 'Where do you see yourself contributing most in a fast-paced frontend engineering team within your first six months?',
        },
      ],
    },
  },
  'Backend Developer': {
    technical: {
      Easy: [
        {
          questionId: 'be_tech_e1',
          text: 'Explain the fundamental differences between SQL (relational) and NoSQL (document/key-value) databases, and when you would select each.',
        },
        {
          questionId: 'be_tech_e2',
          text: 'What are standard HTTP status codes (200, 201, 400, 401, 403, 404, 500) and what does each indicate to the client?',
        },
        {
          questionId: 'be_tech_e3',
          text: 'What is REST, and what are the primary HTTP methods (GET, POST, PUT, PATCH, DELETE) used to represent operations?',
        },
      ],
      Medium: [
        {
          questionId: 'be_tech_m1',
          text: 'What is database indexing? How does adding an index improve read performance, and what impact does it have on write operations?',
        },
        {
          questionId: 'be_tech_m2',
          text: 'Explain how middleware functions operate in a backend framework (like Express), and how you manage centralized error handling.',
        },
        {
          questionId: 'be_tech_m3',
          text: 'How does stateless JWT-based authentication work, and how does it compare to server-side session management?',
        },
      ],
      Hard: [
        {
          questionId: 'be_tech_h1',
          text: 'How do you handle race conditions or concurrency when multiple requests attempt to update the same database record simultaneously?',
        },
        {
          questionId: 'be_tech_h2',
          text: 'Explain connection pooling in database clients, and how you would design rate limiting to protect an API from traffic spikes or abuse.',
        },
        {
          questionId: 'be_tech_h3',
          text: 'What is the difference between horizontal and vertical database scaling, and what challenges arise with database sharding and read replicas?',
        },
      ],
    },
    project: {
      Easy: [
        {
          questionId: 'be_proj_e1',
          text: 'Describe the backend architecture of a project you built. What database and server framework did you choose?',
        },
      ],
      Medium: [
        {
          questionId: 'be_proj_m1',
          text: 'How did you structure your API data validation and prevent malicious payloads or SQL/NoSQL injection in your backend project?',
        },
        {
          questionId: 'be_proj_m2',
          text: 'Have you ever identified and resolved a performance bottleneck or slow query in your backend project? What was the cause?',
        },
      ],
      Hard: [
        {
          questionId: 'be_proj_h1',
          text: 'Describe how you designed data models and relationships in your backend project. What trade-offs did you encounter between normalization and query efficiency?',
        },
      ],
    },
    behavioral: {
      Easy: [
        {
          questionId: 'be_beh_e1',
          text: 'How do you ensure clear documentation and communication with frontend developers when defining API contracts?',
        },
      ],
      Medium: [
        {
          questionId: 'be_beh_m1',
          text: 'Describe a scenario where an unexpected backend server crash occurred. What was your step-by-step troubleshooting methodology?',
        },
      ],
      Hard: [
        {
          questionId: 'be_beh_h1',
          text: 'How do you handle a situation where business stakeholders request a backend feature with an aggressive timeline that risks data integrity?',
        },
      ],
    },
    hr: {
      Easy: [
        {
          questionId: 'be_hr_e1',
          text: 'Why are you passionate about backend engineering over other areas of software development?',
        },
      ],
      Medium: [
        {
          questionId: 'be_hr_m1',
          text: 'How do you balance learning new backend frameworks versus mastering foundational system design and database concepts?',
        },
      ],
      Hard: [
        {
          questionId: 'be_hr_h1',
          text: 'How do you maintain high quality and security standards in your backend code when collaborating in a team?',
        },
      ],
    },
  },
  'Full Stack Developer': {
    technical: {
      Easy: [
        {
          questionId: 'fs_tech_e1',
          text: 'Walk through the complete lifecycle of a web request from the moment a user enters a URL to when the webpage renders completely.',
        },
        {
          questionId: 'fs_tech_e2',
          text: 'What is CORS (Cross-Origin Resource Sharing), why do browsers enforce it, and how does a backend configure it properly?',
        },
        {
          questionId: 'fs_tech_e3',
          text: 'What is the role of an API client (like Axios or Fetch) and how do asynchronous promises facilitate client-server communication?',
        },
      ],
      Medium: [
        {
          questionId: 'fs_tech_m1',
          text: 'How do you design data validation so that errors are caught smoothly on the client UI while remaining strictly enforced on the server?',
        },
        {
          questionId: 'fs_tech_m2',
          text: 'Explain how you protect a full stack web application against common security vulnerabilities like XSS and CSRF.',
        },
        {
          questionId: 'fs_tech_m3',
          text: 'How do you manage authentication tokens across the full stack (storing in browser, attaching to outgoing requests, and validating on server)?',
        },
      ],
      Hard: [
        {
          questionId: 'fs_tech_h1',
          text: 'How would you architect a real-time full stack feature (such as live updates or notifications) using WebSockets versus Server-Sent Events?',
        },
        {
          questionId: 'fs_tech_h2',
          text: 'How do you decide whether a specific computational task or business validation rule belongs on the client or on the server?',
        },
      ],
    },
    project: {
      Easy: [
        {
          questionId: 'fs_proj_e1',
          text: 'Walk me through a full stack application you built. What was the stack and what problem did it solve?',
        },
      ],
      Medium: [
        {
          questionId: 'fs_proj_m1',
          text: 'In your full stack project, describe how you synchronized client UI state with database state after performing create or update mutations.',
        },
        {
          questionId: 'fs_proj_m2',
          text: 'What challenges did you face when integrating your frontend components with your backend REST endpoints?',
        },
      ],
      Hard: [
        {
          questionId: 'fs_proj_h1',
          text: 'Describe your deployment and configuration strategy for your full stack project: environment variables, CORS headers, and database connections.',
        },
      ],
    },
    behavioral: {
      Easy: [
        {
          questionId: 'fs_beh_e1',
          text: 'As a full stack developer, how do you divide your time between client-side user experience polish and backend stability?',
        },
      ],
      Medium: [
        {
          questionId: 'fs_beh_m1',
          text: 'Tell me about a time when a change in a backend API response broke a frontend view. How did you collaborate to prevent recurrence?',
        },
      ],
      Hard: [
        {
          questionId: 'fs_beh_h1',
          text: 'How do you maintain code readability and consistent naming conventions when switching contexts between frontend and backend codebases?',
        },
      ],
    },
    hr: {
      Easy: [
        {
          questionId: 'fs_hr_e1',
          text: 'What do you enjoy most about working across both layers of the technology stack?',
        },
      ],
      Medium: [
        {
          questionId: 'fs_hr_m1',
          text: 'When joining a new engineering team as a fresher, how do you quickly familiarize yourself with a large full-stack codebase?',
        },
      ],
      Hard: [
        {
          questionId: 'fs_hr_h1',
          text: 'How do you ensure you build scalable habits without prematurely over-engineering small project features?',
        },
      ],
    },
  },
  'Software Developer': {
    technical: {
      Easy: [
        {
          questionId: 'sd_tech_e1',
          text: 'Explain the four pillars of Object-Oriented Programming (Encapsulation, Abstraction, Inheritance, Polymorphism) with concise practical examples.',
        },
        {
          questionId: 'sd_tech_e2',
          text: 'What is the difference between a Stack and a Queue data structure, and what is an example of an application for each?',
        },
        {
          questionId: 'sd_tech_e3',
          text: 'What does Big-O notation represent, and what is the difference in efficiency between O(1), O(n), and O(n^2)?',
        },
      ],
      Medium: [
        {
          questionId: 'sd_tech_m1',
          text: 'Explain the difference between Breadth-First Search (BFS) and Depth-First Search (DFS) in graph or tree traversal.',
        },
        {
          questionId: 'sd_tech_m2',
          text: 'How does a Hash Table work internally, and how does it handle hash collisions?',
        },
        {
          questionId: 'sd_tech_m3',
          text: 'Explain the concept of recursion. What are base cases and call stack overflow risks, and how does iteration compare?',
        },
      ],
      Hard: [
        {
          questionId: 'sd_tech_h1',
          text: 'Explain the SOLID principles in software design, and give an example of why violating the Single Responsibility Principle creates issues.',
        },
        {
          questionId: 'sd_tech_h2',
          text: 'What is a deadlock in multithreaded systems? What are the Coffman conditions required for a deadlock to occur, and how can they be prevented?',
        },
      ],
    },
    project: {
      Easy: [
        {
          questionId: 'sd_proj_e1',
          text: 'Describe an academic or personal software engineering project you developed. What was the core functionality?',
        },
      ],
      Medium: [
        {
          questionId: 'sd_proj_m1',
          text: 'In your software project, describe a situation where you had to choose between two different data structures or algorithms. What guided your decision?',
        },
        {
          questionId: 'sd_proj_m2',
          text: 'What was the most difficult bug you encountered during the development of your software project, and what tools or techniques did you use to debug it?',
        },
      ],
      Hard: [
        {
          questionId: 'sd_proj_h1',
          text: 'How did you approach modularity and unit testing in your project to ensure components could be tested independently?',
        },
      ],
    },
    behavioral: {
      Easy: [
        {
          questionId: 'sd_beh_e1',
          text: 'How do you handle receiving critical feedback on your code during peer review?',
        },
      ],
      Medium: [
        {
          questionId: 'sd_beh_m1',
          text: 'Describe a situation where project requirements changed midway through implementation. How did you adapt your plan?',
        },
      ],
      Hard: [
        {
          questionId: 'sd_beh_h1',
          text: 'Tell me about a time you had to deliver software under a strict deadline. What trade-offs did you manage?',
        },
      ],
    },
    hr: {
      Easy: [
        {
          questionId: 'sd_hr_e1',
          text: 'What inspired you to pursue a career as a Software Developer?',
        },
      ],
      Medium: [
        {
          questionId: 'sd_hr_m1',
          text: 'How do you stay motivated when working on complex debugging or refactoring tasks that take several days?',
        },
      ],
      Hard: [
        {
          questionId: 'sd_hr_h1',
          text: 'Where do you hope to see your technical abilities grow during your first year in an industry software team?',
        },
      ],
    },
  },
  'Java Developer': {
    technical: {
      Easy: [
        {
          questionId: 'java_tech_e1',
          text: 'What is the difference between JDK, JRE, and JVM in Java, and how does bytecode achieve platform independence?',
        },
        {
          questionId: 'java_tech_e2',
          text: 'Explain the difference between the == operator and the .equals() method when comparing objects in Java.',
        },
        {
          questionId: 'java_tech_e3',
          text: 'In the Java Collections Framework, what are the primary differences between ArrayList and LinkedList in terms of internal structure and performance?',
        },
      ],
      Medium: [
        {
          questionId: 'java_tech_m1',
          text: 'Explain the difference between Checked and Unchecked Exceptions in Java, and when you should handle versus propagate them.',
        },
        {
          questionId: 'java_tech_m2',
          text: 'How does HashMap work internally in Java? Explain hashing, bucket index calculation, and how Java 8 handles collision treeification.',
        },
        {
          questionId: 'java_tech_m3',
          text: 'What are Java 8 Streams and Lambda expressions? Explain the difference between intermediate and terminal operations.',
        },
      ],
      Hard: [
        {
          questionId: 'java_tech_h1',
          text: 'How does Java Garbage Collection work? Explain generational heap spaces (Young, Tenured/Old) and the difference between Minor and Major GC.',
        },
        {
          questionId: 'java_tech_h2',
          text: 'Explain thread safety in Java: what does the volatile keyword guarantee versus synchronized blocks or ReentrantLock?',
        },
      ],
    },
    project: {
      Easy: [
        {
          questionId: 'java_proj_e1',
          text: 'Describe a Java or Spring Boot project you developed. What was its purpose and core architecture?',
        },
      ],
      Medium: [
        {
          questionId: 'java_proj_m1',
          text: 'In your Java project, how did you structure your application layers (Controllers, Services, Repositories/DAOs) and manage dependency injection?',
        },
        {
          questionId: 'java_proj_m2',
          text: 'How did you handle database transactions and data persistence (e.g. JDBC, Hibernate, Spring Data JPA) in your Java project?',
        },
      ],
      Hard: [
        {
          questionId: 'java_proj_h1',
          text: 'Describe how you managed connection pooling (e.g. HikariCP) and thread management in your Java backend application.',
        },
      ],
    },
    behavioral: {
      Easy: [
        {
          questionId: 'java_beh_e1',
          text: 'How do you approach debugging a complicated stack trace or NullPointerException in a multi-layered Java project?',
        },
      ],
      Medium: [
        {
          questionId: 'java_beh_m1',
          text: 'Tell me about a time you collaborated with peers on a team Java project and helped resolve a blocking technical hurdle.',
        },
      ],
      Hard: [
        {
          questionId: 'java_beh_h1',
          text: 'How do you ensure you write clean, idiomatic Java code conforming to standard conventions like naming, immutability, and effective error handling?',
        },
      ],
    },
    hr: {
      Easy: [
        {
          questionId: 'java_hr_e1',
          text: 'What drew your interest towards the Java ecosystem and enterprise backend engineering?',
        },
      ],
      Medium: [
        {
          questionId: 'java_hr_m1',
          text: 'How do you keep up with modern Java developments (e.g. records, virtual threads in modern Java versions)?',
        },
      ],
      Hard: [
        {
          questionId: 'java_hr_h1',
          text: 'What are your goals for learning modern enterprise frameworks like Spring Boot during your first placement role?',
        },
      ],
    },
  },
  'Python Developer': {
    technical: {
      Easy: [
        {
          questionId: 'py_tech_e1',
          text: 'What are Python list comprehensions, and what advantages do they provide over traditional for-loops in readability and performance?',
        },
        {
          questionId: 'py_tech_e2',
          text: 'Explain the difference between mutable and immutable data types in Python with concrete examples.',
        },
        {
          questionId: 'py_tech_e3',
          text: 'What are Python dictionaries and sets, and why do key lookups perform in average O(1) time complexity?',
        },
      ],
      Medium: [
        {
          questionId: 'py_tech_m1',
          text: 'What are Python decorators? Explain how they function under the hood with a practical example (e.g. logging or timing).',
        },
        {
          questionId: 'py_tech_m2',
          text: 'Explain generators and the yield keyword in Python. How do they enable memory-efficient processing of large sequences?',
        },
        {
          questionId: 'py_tech_m3',
          text: 'What is the difference between *args and **kwargs in Python function definitions, and when would you use them?',
        },
      ],
      Hard: [
        {
          questionId: 'py_tech_h1',
          text: 'Explain the Global Interpreter Lock (GIL) in CPython. How does it affect multithreading for CPU-bound tasks versus I/O-bound tasks?',
        },
        {
          questionId: 'py_tech_h2',
          text: 'How does memory management and reference counting work in Python, and how does the cyclic garbage collector detect circular references?',
        },
      ],
    },
    project: {
      Easy: [
        {
          questionId: 'py_proj_e1',
          text: 'Describe a project you built using Python (e.g. Flask, Django, FastAPI, or automation scripting). What did it achieve?',
        },
      ],
      Medium: [
        {
          questionId: 'py_proj_m1',
          text: 'In your Python project, how did you manage dependency management and virtual environments (e.g. venv, requirements.txt, poetry)?',
        },
        {
          questionId: 'py_proj_m2',
          text: 'Describe a performance optimization or code refactor you carried out in your Python project.',
        },
      ],
      Hard: [
        {
          questionId: 'py_proj_h1',
          text: 'How did you handle error handling, asynchronous programming (async/await), or database integration in your Python project?',
        },
      ],
    },
    behavioral: {
      Easy: [
        {
          questionId: 'py_beh_e1',
          text: 'How do you balance rapid prototyping in Python with writing maintainable, PEP 8-compliant code?',
        },
      ],
      Medium: [
        {
          questionId: 'py_beh_m1',
          text: 'Tell me about a time you encountered a third-party Python library with outdated documentation. How did you resolve the blocker?',
        },
      ],
      Hard: [
        {
          questionId: 'py_beh_h1',
          text: 'How do you approach communicating technical Python implementation details to cross-functional peers who do not code in Python?',
        },
      ],
    },
    hr: {
      Easy: [
        {
          questionId: 'py_hr_e1',
          text: 'What made you choose Python as your primary language for software development?',
        },
      ],
      Medium: [
        {
          questionId: 'py_hr_m1',
          text: 'How do you approach transitioning from scripting and coursework into building production-grade Python web services or systems?',
        },
      ],
      Hard: [
        {
          questionId: 'py_hr_h1',
          text: 'What areas of Python (e.g. async frameworks, backend microservices, or data tooling) are you most eager to explore professionally?',
        },
      ],
    },
  },
  'Data Analyst': {
    technical: {
      Easy: [
        {
          questionId: 'da_tech_e1',
          text: 'What is the difference between the WHERE clause and the HAVING clause in SQL? Give an example of when HAVING is mandatory.',
        },
        {
          questionId: 'da_tech_e2',
          text: 'Explain the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with visual or practical examples.',
        },
        {
          questionId: 'da_tech_e3',
          text: 'What are the three primary measures of central tendency (mean, median, mode), and in what data distribution would you prefer the median over the mean?',
        },
      ],
      Medium: [
        {
          questionId: 'da_tech_m1',
          text: 'Explain SQL Window functions like ROW_NUMBER(), RANK(), and DENSE_RANK(). What distinguishes them when handling duplicate values?',
        },
        {
          questionId: 'da_tech_m2',
          text: 'In Python (Pandas) or SQL, how do you identify, analyze, and handle missing values or extreme outliers in a real-world dataset?',
        },
        {
          questionId: 'da_tech_m3',
          text: 'Explain the difference between correlation and causation. What is a confounding variable and how can it mislead analysis?',
        },
      ],
      Hard: [
        {
          questionId: 'da_tech_h1',
          text: 'Walk through the methodology of Exploratory Data Analysis (EDA) on a raw, messy dataset containing millions of transactions.',
        },
        {
          questionId: 'da_tech_h2',
          text: 'How would you formulate KPI metrics and prevent seasonality bias when analyzing year-over-year growth for a business?',
        },
      ],
    },
    project: {
      Easy: [
        {
          questionId: 'da_proj_e1',
          text: 'Describe a data analysis project you worked on. What was the hypothesis or business question you investigated?',
        },
      ],
      Medium: [
        {
          questionId: 'da_proj_m1',
          text: 'In your data analysis project, how did you clean the raw data and ensure that cleaning steps did not introduce selection bias?',
        },
        {
          questionId: 'da_proj_m2',
          text: 'What data visualization tools or libraries (e.g., Tableau, Power BI, Matplotlib, Seaborn) did you use, and why were they appropriate for communicating your insights?',
        },
      ],
      Hard: [
        {
          questionId: 'da_proj_h1',
          text: 'How did you translate your analytical findings into actionable recommendations for non-technical stakeholders in your project?',
        },
      ],
    },
    behavioral: {
      Easy: [
        {
          questionId: 'da_beh_e1',
          text: 'Describe a situation where a dataset was missing key information required by a stakeholder. How did you handle expectations?',
        },
      ],
      Medium: [
        {
          questionId: 'da_beh_m1',
          text: 'Tell me about a time when your data analysis revealed a counterintuitive result that contradicted someone’s initial assumption. How did you present it?',
        },
      ],
      Hard: [
        {
          questionId: 'da_beh_h1',
          text: 'How do you ensure statistical rigor and resist pressure to find data points that merely confirm a preconceived narrative?',
        },
      ],
    },
    hr: {
      Easy: [
        {
          questionId: 'da_hr_e1',
          text: 'What sparked your curiosity to analyze data and uncover patterns to guide decision making?',
        },
      ],
      Medium: [
        {
          questionId: 'da_hr_m1',
          text: 'How do you keep your SQL, Python, and business intelligence skills sharp as data tools evolve?',
        },
      ],
      Hard: [
        {
          questionId: 'da_hr_h1',
          text: 'What type of business questions or industry domains are you most interested in exploring as a Data Analyst fresher?',
        },
      ],
    },
  },
};

/**
 * System prompt ensuring strictly grounded fresher interview conduct.
 */
const buildInterviewSystemPrompt = () => {
  return `You are an expert technical interviewer conducting a mock interview for a college fresher.
CRITICAL OPERATIONAL RULES:
1. Conduct the interview strictly for the specified role.
2. Evaluate ONLY the candidate's actual supplied answers.
3. NEVER invent candidate achievements, technologies, projects, or experience not mentioned in the answer.
4. If an answer lacks evidence or depth, state that fact constructively.
5. NEVER make psychological diagnoses, mental health claims, anxiety assertions, or personality profile judgements.
6. Confidence indicators MUST be framed STRICTLY as observable communication patterns (e.g. structure, clarity, conciseness, hesitation markers, and consistency).
7. Keep tone supportive, professional, and educational for a college fresher.
8. Output MUST be valid, parseable JSON matching the requested schema. Never include markdown code fences or conversational preamble.`;
};

/**
 * Helper to get starting difficulty based on role.
 */
export const getStartingDifficulty = (role) => {
  if (role === 'Backend Developer' || role === 'Software Developer' || role === 'Full Stack Developer') {
    return 'Medium';
  }
  return 'Easy';
};

/**
 * Helper to adapt difficulty based on answer evaluation.
 */
export const adaptDifficulty = (currentDifficulty, evaluation) => {
  const score = evaluation?.score ?? 50;
  const clarity = evaluation?.conceptClarity ?? 50;

  if (score >= 75 && clarity >= 70) {
    if (currentDifficulty === 'Easy') return 'Medium';
    if (currentDifficulty === 'Medium') return 'Hard';
    return 'Hard';
  }

  if (score < 45) {
    if (currentDifficulty === 'Hard') return 'Medium';
    if (currentDifficulty === 'Medium') return 'Easy';
    return 'Easy';
  }

  return currentDifficulty;
};

/**
 * Helper to decide category progression across 10-question sequence.
 */
export const getCategoryForQuestionNumber = (qNumber) => {
  if (qNumber <= 3) return 'technical';
  if (qNumber <= 6) return qNumber % 2 === 0 ? 'project' : 'technical';
  if (qNumber <= 8) return 'project';
  if (qNumber === 9) return 'behavioral';
  return 'hr';
};

/**
 * Deterministic question picker from local question bank.
 */
const pickGroundedQuestion = (role, category, difficulty, usedQuestionIds = new Set()) => {
  const roleBank = QUESTION_BANK[role] || QUESTION_BANK['Software Developer'];
  const catBank = roleBank[category] || roleBank.technical;
  const diffQuestions = catBank[difficulty] || catBank.Medium || catBank.Easy || [];

  for (const q of diffQuestions) {
    if (!usedQuestionIds.has(q.questionId)) {
      return {
        questionId: q.questionId,
        text: q.text,
        category,
        difficulty,
      };
    }
  }

  // If all in difficulty used, check other difficulties in same category
  for (const diff of DIFFICULTIES) {
    const list = catBank[diff] || [];
    for (const q of list) {
      if (!usedQuestionIds.has(q.questionId)) {
        return {
          questionId: q.questionId,
          text: q.text,
          category,
          difficulty: diff,
        };
      }
    }
  }

  // Fallback unique question
  const fallbackId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    questionId: fallbackId,
    text: `For a fresher ${role}, how would you approach solving a challenging ${category} task step-by-step?`,
    category,
    difficulty,
  };
};

/**
 * Deterministic answer evaluator.
 */
const evaluateAnswerGrounded = (role, question, answer) => {
  const cleanAnswer = (answer || '').trim();
  const wordCount = cleanAnswer.split(/\s+/).filter(Boolean).length;

  let baseScore = 60;
  const strengths = [];
  const weaknesses = [];

  if (wordCount >= 30) {
    baseScore += 15;
    strengths.push('Provided a detailed and structured explanation with adequate depth.');
  } else if (wordCount >= 15) {
    baseScore += 5;
    strengths.push('Addressed the core concept directly.');
  } else {
    baseScore -= 20;
    weaknesses.push('Response is brief; consider elaborating with concrete technical examples or trade-offs.');
  }

  const technicalKeywords = [
    'because', 'for example', 'performance', 'data', 'function',
    'component', 'database', 'request', 'state', 'index',
    'memory', 'complexity', 'trade-off', 'structure', 'algorithm',
    'object', 'class', 'api', 'server', 'client',
  ];

  const matchedKeywords = technicalKeywords.filter((k) => cleanAnswer.toLowerCase().includes(k));
  if (matchedKeywords.length >= 3) {
    baseScore += 15;
    strengths.push('Demonstrated appropriate domain vocabulary and contextual understanding.');
  } else if (matchedKeywords.length === 0 && wordCount < 20) {
    baseScore -= 10;
    weaknesses.push('Could include more specific technical terminology relevant to ' + role + '.');
  }

  const score = Math.max(10, Math.min(95, baseScore));
  const conceptClarity = Math.max(15, Math.min(95, wordCount >= 25 ? baseScore + 5 : baseScore - 5));
  const communication = Math.max(20, Math.min(95, wordCount >= 20 ? baseScore : baseScore - 10));

  let feedback = '';
  if (score >= 75) {
    feedback = `Strong answer for a fresher ${role}. You articulated the key concepts clearly and supported your response with relevant points.`;
  } else if (score >= 50) {
    feedback = `Good foundational response. To elevate this in an actual interview, provide a concrete real-world example and elaborate on edge cases or trade-offs.`;
  } else {
    feedback = `Your answer touches upon the topic, but lacks detailed explanation. Elaborate step-by-step and explain the underlying mechanics.`;
  }

  return {
    score,
    strengths: strengths.length ? strengths : ['Gave a direct response to the interview question.'],
    weaknesses: weaknesses.length ? weaknesses : ['Could discuss alternative approaches or edge cases.'],
    feedback,
    conceptClarity,
    communication,
  };
};

/**
 * Generate initial interview question.
 */
export const generateInterviewQuestion = async ({ role, difficulty, category, interviewHistory = [] }) => {
  if (!SUPPORTED_ROLES.includes(role)) {
    const err = new Error(`Unsupported role: "${role}". Supported: ${SUPPORTED_ROLES.join(', ')}.`);
    err.statusCode = 400;
    throw err;
  }

  const selectedDifficulty = difficulty || getStartingDifficulty(role);
  const selectedCategory = category || 'technical';

  // 1. Check custom test mock provider
  if (typeof customAiInterviewProvider === 'function') {
    return await customAiInterviewProvider({
      action: 'generateFirstQuestion',
      role,
      difficulty: selectedDifficulty,
      category: selectedCategory,
      interviewHistory,
    });
  }

  // 2. Check external AI provider if configured
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (apiKey && apiKey.trim().length > 0) {
    const endpoint = baseUrl
      ? `${baseUrl.replace(/\/+$/, '')}/chat/completions`
      : 'https://api.openai.com/v1/chat/completions';

    const prompt = `Generate the FIRST mock interview question for a college fresher applying for "${role}".
Difficulty: ${selectedDifficulty}
Category: ${selectedCategory}
SCHEMA:
{
  "questionId": "unique_id_string",
  "text": "The full question text",
  "category": "${selectedCategory}",
  "difficulty": "${selectedDifficulty}"
}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: buildInterviewSystemPrompt() },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const err = new Error('AI interview service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        const err = new Error('AI interview service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      const parsed = JSON.parse(content);
      return {
        questionId: parsed.questionId || `q_${Date.now()}`,
        text: parsed.text,
        category: selectedCategory,
        difficulty: selectedDifficulty,
      };
    } catch (apiErr) {
      if (apiErr.statusCode === 500) throw apiErr;
      const safeErr = new Error('AI interview service is temporarily unavailable.');
      safeErr.statusCode = 500;
      throw safeErr;
    }
  }

  // 3. Grounded fallback generator
  const usedIds = new Set(interviewHistory.map((q) => q.questionId));
  return pickGroundedQuestion(role, selectedCategory, selectedDifficulty, usedIds);
};

/**
 * Evaluate submitted answer.
 */
export const evaluateInterviewAnswer = async ({
  role,
  question,
  answer,
  difficulty,
  category,
  interviewHistory = [],
}) => {
  if (typeof customAiInterviewProvider === 'function') {
    return await customAiInterviewProvider({
      action: 'evaluateAnswer',
      role,
      question,
      answer,
      difficulty,
      category,
      interviewHistory,
    });
  }

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (apiKey && apiKey.trim().length > 0) {
    const endpoint = baseUrl
      ? `${baseUrl.replace(/\/+$/, '')}/chat/completions`
      : 'https://api.openai.com/v1/chat/completions';

    const prompt = `Evaluate the candidate's answer for the following question.
ROLE: ${role}
CATEGORY: ${category || question.category || 'technical'}
DIFFICULTY: ${difficulty || question.difficulty || 'Medium'}
QUESTION:
${question.text || question}

CANDIDATE ANSWER:
"""${answer}"""

EVALUATION RULES:
- Evaluate only the provided answer.
- Score between 0 and 100 based on technical depth, clarity, and correctness.
- conceptClarity: 0 to 100.
- communication: 0 to 100 (structure and conciseness).
- Constructive feedback suitable for a fresher.
- Do NOT reveal the full ideal answer as a tutorial.

SCHEMA:
{
  "score": number,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "feedback": "string",
  "conceptClarity": number,
  "communication": number
}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: buildInterviewSystemPrompt() },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const err = new Error('AI interview service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        const err = new Error('AI interview service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      const parsed = JSON.parse(content);
      return {
        score: typeof parsed.score === 'number' ? parsed.score : 65,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Clear attempt.'],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Needs more depth.'],
        feedback: parsed.feedback || 'Good effort.',
        conceptClarity: typeof parsed.conceptClarity === 'number' ? parsed.conceptClarity : 65,
        communication: typeof parsed.communication === 'number' ? parsed.communication : 65,
      };
    } catch (apiErr) {
      if (apiErr.statusCode === 500) throw apiErr;
      const safeErr = new Error('AI interview service is temporarily unavailable.');
      safeErr.statusCode = 500;
      throw safeErr;
    }
  }

  return evaluateAnswerGrounded(role, question, answer);
};

/**
 * Generate adaptive next question based on interview progress.
 */
export const generateNextQuestion = async ({
  role,
  previousQuestion,
  previousAnswer,
  previousEvaluation,
  currentDifficulty,
  interviewHistory = [],
}) => {
  const nextQNumber = interviewHistory.length + 1;
  const nextCategory = getCategoryForQuestionNumber(nextQNumber);
  const nextDifficulty = adaptDifficulty(currentDifficulty, previousEvaluation);

  if (typeof customAiInterviewProvider === 'function') {
    return await customAiInterviewProvider({
      action: 'generateNextQuestion',
      role,
      previousQuestion,
      previousAnswer,
      previousEvaluation,
      currentDifficulty,
      nextDifficulty,
      nextCategory,
      nextQNumber,
      interviewHistory,
    });
  }

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (apiKey && apiKey.trim().length > 0) {
    const endpoint = baseUrl
      ? `${baseUrl.replace(/\/+$/, '')}/chat/completions`
      : 'https://api.openai.com/v1/chat/completions';

    const historySummary = interviewHistory
      .map((item, idx) => `Q${idx + 1} (${item.category}, ${item.difficulty}): ${item.text}`)
      .join('\n');

    const prompt = `Generate NEXT mock interview question for fresher role: "${role}".
INTERVIEW HISTORY:
${historySummary || 'None'}

PREVIOUS QUESTION:
${previousQuestion?.text || previousQuestion || 'None'}

PREVIOUS ANSWER:
${previousAnswer || 'None'}

PREVIOUS SCORE: ${previousEvaluation?.score ?? 50}/100
TARGET CATEGORY: ${nextCategory}
TARGET ADAPTIVE DIFFICULTY: ${nextDifficulty}

RULES:
- Must NOT repeat previous questions.
- Maintain continuity or build upon weak concepts if score was low.
- If score was high, explore advanced or architectural aspects.

SCHEMA:
{
  "questionId": "unique_id_string",
  "text": "The full question text",
  "category": "${nextCategory}",
  "difficulty": "${nextDifficulty}"
}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: buildInterviewSystemPrompt() },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const err = new Error('AI interview service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        const err = new Error('AI interview service is temporarily unavailable.');
        err.statusCode = 500;
        throw err;
      }

      const parsed = JSON.parse(content);
      return {
        questionId: parsed.questionId || `q_${Date.now()}`,
        text: parsed.text,
        category: nextCategory,
        difficulty: nextDifficulty,
      };
    } catch (apiErr) {
      if (apiErr.statusCode === 500) throw apiErr;
      const safeErr = new Error('AI interview service is temporarily unavailable.');
      safeErr.statusCode = 500;
      throw safeErr;
    }
  }

  const usedIds = new Set(interviewHistory.map((q) => q.questionId));
  return pickGroundedQuestion(role, nextCategory, nextDifficulty, usedIds);
};

/**
 * Generate comprehensive final report from answers and evaluations.
 */
export const generateFinalReport = async ({ role, questions = [], answers = [], interviewHistory = [] }) => {
  if (typeof customAiInterviewProvider === 'function') {
    return await customAiInterviewProvider({
      action: 'generateFinalReport',
      role,
      questions,
      answers,
      interviewHistory,
    });
  }

  // Compute aggregate scores from submitted evaluations
  let totalTechScore = 0;
  let techCount = 0;
  let totalClarity = 0;
  let totalComm = 0;
  const allStrengths = [];
  const allWeaknesses = [];
  const weakTopics = [];

  for (const item of answers) {
    const ev = item.evaluation || {};
    const score = ev.score ?? 50;
    const clarity = ev.conceptClarity ?? score;
    const comm = ev.communication ?? score;

    if (item.category === 'technical' || item.category === 'project') {
      totalTechScore += score;
      techCount++;
    }

    totalClarity += clarity;
    totalComm += comm;

    if (Array.isArray(ev.strengths)) allStrengths.push(...ev.strengths);
    if (Array.isArray(ev.weaknesses)) allWeaknesses.push(...ev.weaknesses);

    if (score < 60) {
      const q = questions.find((x) => x.questionId === item.questionId);
      if (q) weakTopics.push(`${item.category.toUpperCase()}: ${q.text.substring(0, 60)}...`);
    }
  }

  const n = Math.max(1, answers.length);
  const technicalKnowledge = Math.round(techCount > 0 ? totalTechScore / techCount : 60);
  const conceptClarity = Math.round(totalClarity / n);
  const communication = Math.round(totalComm / n);

  // Observable confidence indicators: based strictly on communication structure and coherence
  const confidenceIndicators = Math.round((communication * 0.6) + (conceptClarity * 0.4));

  const overallScore = Math.round(
    technicalKnowledge * 0.4 +
    conceptClarity * 0.25 +
    communication * 0.25 +
    confidenceIndicators * 0.1
  );

  const dedupeStrengths = [...new Set(allStrengths)].slice(0, 4);
  const dedupeWeaknesses = [...new Set(allWeaknesses)].slice(0, 4);

  const fallbackStrengths = dedupeStrengths.length
    ? dedupeStrengths
    : [
        'Maintained structured and coherent responses across technical questions.',
        'Demonstrated foundational awareness of core ' + role + ' principles.',
      ];

  const fallbackWeakTopics = weakTopics.length
    ? weakTopics.slice(0, 3)
    : ['In-depth edge cases and performance trade-offs for ' + role];

  const recommendations = [
    'Deepen conceptual explanations with concrete code illustrations or real-world examples.',
    'Practice vocalizing trade-offs between alternative designs during technical answers.',
    'Structure responses using the STAR method for project and behavioral scenarios.',
  ];

  const summary = `The candidate completed a ${role} mock interview comprising ${answers.length} answered questions. Overall technical knowledge was demonstrated at ${technicalKnowledge}%, concept clarity at ${conceptClarity}%, and structured communication at ${communication}%. Observable communication indicators showed organized answers with clear flow. Continued focus on trade-off analysis and project challenges will enhance placement readiness.`;

  return {
    overallScore,
    summary,
    strengths: fallbackStrengths,
    weakTopics: fallbackWeakTopics,
    recommendations,
    technicalKnowledge,
    conceptClarity,
    communication,
    confidenceIndicators,
  };
};

export default {
  SUPPORTED_ROLES,
  CATEGORIES,
  DIFFICULTIES,
  INTERVIEW_QUESTION_LIMIT,
  setAiInterviewProvider,
  resetAiInterviewProvider,
  getStartingDifficulty,
  adaptDifficulty,
  getCategoryForQuestionNumber,
  generateInterviewQuestion,
  evaluateInterviewAnswer,
  generateNextQuestion,
  generateFinalReport,
};
