import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import apiRoutes from './src/routes/index.js';
import notFound from './src/middleware/notFound.js';
import errorHandler from './src/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const clientUrls = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((u) => u.trim().replace(/\/+$/, ''));

const allowedOrigins = [
  ...clientUrls,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// Middleware configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, uptime monitors)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV === 'production') {
        const err = new Error(`Origin ${origin} not allowed by CORS policy.`);
        err.statusCode = 403;
        return callback(err, false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root info route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PlacementPrep_AI API Server',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

// Attempt database connection and start server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(` PlacementPrep_AI Server running on port ${PORT}`);
    console.log(` Health endpoint: http://localhost:${PORT}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
  });
});

export default app;
