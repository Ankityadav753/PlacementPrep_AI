# PlacementPrep_AI

> A comprehensive placement preparation platform designed specifically for college freshers to systematically prepare for campus placements and technical job evaluations.

---

## 🎯 Project Purpose

Campus placement recruitment processes typically consist of multiple distinct filtering rounds: resume shortlisting, coding assessments, and technical/HR interviews. 

**PlacementPrep_AI** provides an all-in-one preparation ecosystem structured into three completely independent, modular pillars:

1. **Resume Analyzer** — ATS compatibility checking, automated keyword optimization, and resume feedback tailored for entry-level tech roles.
2. **Coding Round** — Timed Data Structures & Algorithms (DSA) problem solving with sandboxed multi-language code execution and complexity analysis.
3. **AI Mock Interview** — Interactive technical, behavioral, and HR interview simulations with adaptive questioning and detailed performance feedback.

> **Note**: This repository contains the verified foundation and architecture. The three core feature modules will be implemented in subsequent phases.

---

## 💻 Technology Stack

### Frontend (`/client`)
- **Library/Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: JavaScript (ES Modules)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend (`/server`)
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Environment Management**: [dotenv](https://github.com/motdotla/dotenv)
- **Security & CORS**: [cors](https://github.com/expressjs/cors)

---

## 📁 Folder Structure

```text
PlacementPrep_AI/
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/              # Static assets and graphic resources
│   │   ├── components/          # Reusable UI components (Navbar, Footer, ModuleCard)
│   │   ├── context/             # Global React state context providers
│   │   ├── hooks/               # Custom hooks (e.g. useHealthCheck)
│   │   ├── layouts/             # Page layouts (MainLayout)
│   │   ├── pages/               # Application pages (HomePage, NotFoundPage)
│   │   ├── routes/              # Routing configurations (AppRoutes)
│   │   ├── services/            # API client and service endpoints (api, healthService)
│   │   ├── utils/               # Constants and helper utilities
│   │   ├── App.jsx              # Main React application entry component
│   │   ├── index.css            # Tailwind directives and global styles
│   │   └── main.jsx             # React DOM root entry
│   ├── .env.example             # Frontend environment variables template
│   ├── .env                     # Local frontend environment variables
│   ├── index.html               # Main HTML entry template
│   ├── package.json             # Frontend package metadata and dependencies
│   ├── postcss.config.js        # PostCSS configuration for Tailwind
│   ├── tailwind.config.js       # Tailwind CSS design system configuration
│   └── vite.config.js           # Vite development and build configuration
│
├── server/
│   ├── src/
│   │   ├── config/              # Database connection and environment configurations
│   │   ├── controllers/         # Request handling controllers (health, auth, etc.)
│   │   ├── middleware/          # Express middlewares (notFound, errorHandler)
│   │   ├── models/              # Mongoose data models
│   │   ├── routes/              # Modular Express route definitions
│   │   ├── services/            # Business logic services
│   │   └── utils/               # Response formatters and server utility functions
│   ├── .env.example             # Backend environment variables template
│   ├── .env                     # Local backend environment variables
│   ├── package.json             # Backend package metadata and dependencies
│   └── server.js                # Express application bootstrapping & server entry
│
├── .gitignore                   # Version control ignore rules
├── package.json                 # Optional root package runner
└── README.md                    # Project documentation
```

---

## ⚙️ Required Environment Variables

### Backend (`server/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port number for the Express API server | `5000` |
| `MONGODB_URI` | MongoDB connection connection string | `mongodb://127.0.0.1:27017/placementprep_ai` |
| `JWT_SECRET` | Secret key used for signing JWT tokens | `<your-jwt-secret>` |
| `CLIENT_URL` | Allowed origin for CORS frontend communication | `http://localhost:5173` |

A template is provided in [`server/.env.example`](server/.env.example):
```env
PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
```

> **Note on MongoDB**: The server architecture gracefully handles standalone operation. If MongoDB is not running or `MONGODB_URI` is omitted, the server will log a notice and continue serving non-database endpoints such as `/api/health`.

### Frontend (`client/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for backend API requests | `http://localhost:5000/api` |

---

## 🚀 Installation Instructions

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### 1. Install Dependencies

You can install dependencies for both client and server independently:

```bash
# Install frontend dependencies
cd client
npm install
cd ..

# Install backend dependencies
cd server
npm install
cd ..
```

*Or install both from the root workspace:*
```bash
npm run install:all
```

---

## 🖥️ How to Run

The frontend and backend are completely decoupled and can be run independently in separate terminal windows.

### Run Backend Server

In a terminal window:
```bash
cd server
npm run dev
```
- Development server starts on: `http://localhost:5000`
- Health check endpoint: `http://localhost:5000/api/health`

To run in production mode:
```bash
cd server
npm start
```

### Run Frontend Client

In a separate terminal window:
```bash
cd client
npm run dev
```
- Vite development server starts on: `http://localhost:5173`
- Open your browser at `http://localhost:5173`

To build frontend for production:
```bash
cd client
npm run build
```

---

---

## 📡 API Endpoints (All Modules Active)

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Comprehensive health probe (environment, database connectivity) | Active |
| `POST`| `/api/auth/register` | User registration with bcrypt hashing | Active |
| `POST`| `/api/auth/login` | User login and signed JWT issuance | Active |
| `GET` | `/api/auth/me` | Current authenticated user profile | Active |
| `POST`| `/api/resume/upload` | Multipart PDF resume upload and secure text extraction | Active |
| `POST`| `/api/resume/analyze` | ATS scoring, skill matching, and gap analysis | Active |
| `GET` | `/api/resume/history` | Paginated resume history (confidential text excluded) | Active |
| `GET` | `/api/coding/start` | Initialize 30-min timed coding round session | Active |
| `GET` | `/api/coding/session/:id` | Active coding session questions and timer state | Active |
| `POST`| `/api/coding/run` | Execute code on sample test cases via Judge0 sandbox | Active |
| `POST`| `/api/coding/submit` | Evaluate code on full test suite and calculate score | Active |
| `POST`| `/api/coding/review` | Post-submit AI algorithmic review and explanation | Active |
| `POST`| `/api/interview/start` | Initialize AI mock interview for technical/HR tracks | Active |
| `POST`| `/api/interview/answer` | Submit answer for AI rubric evaluation and feedback | Active |
| `POST`| `/api/interview/next` | Generate next adaptive interview question | Active |
| `POST`| `/api/interview/finish`| Conclude interview and compute multi-dimensional scorecard | Active |
| `GET` | `/api/analytics/overview`| Comprehensive cross-module placement readiness analytics | Active |

---

## 🚀 Production Deployment

Comprehensive instructions for deploying **PlacementPrep AI** to production (MongoDB Atlas, Render backend, Vercel/Netlify frontend) are documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

Quick start:
1. Review [`render.yaml`](./render.yaml) for full-stack Infrastructure-as-Code blueprint.
2. Review [`client/vercel.json`](./client/vercel.json) and [`client/public/_redirects`](./client/public/_redirects) for SPA routing.
3. Consult [`DEPLOYMENT.md`](./DEPLOYMENT.md) for required environment variables.

