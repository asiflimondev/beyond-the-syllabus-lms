import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import admissionRoutes from './routes/admission.routes.js';
import programRoutes from './routes/program.routes.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import { seedAdmin } from './utils/seedAdmin.js';

const app: Express = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Sets various HTTP headers for security
app.use(helmet());

// Rate limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// Compression - Compress responses for better performance
app.use(compression());

// CORS - Allow frontend to access API
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
  })
);

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// Parse JSON bodies (limit to 10mb for large payloads)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================
// API ROUTES
// ============================================

// Authentication routes (public & protected)
app.use('/api/auth', authRoutes);

// Admission routes (public & protected)
app.use('/api/admission', admissionRoutes);

// Program CRUD routes (authenticated users can view, admin can manage)
app.use('/api/programs', programRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Not Found handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Database connection established');

    // Seed admin user (only if no admin exists)
    await seedAdmin();

    // Start the server
    app.listen(PORT, () => {
      console.log('\n=================================');
      console.log('🚀 Beyond the Syllabus LMS - Backend');
      console.log('=================================');
      console.log(`📡 Server running on port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log('=================================');
      console.log('📌 Available Routes:');
      console.log(`   🔐 /api/auth     - Authentication`);
      console.log(`   🎓 /api/admission - Student Admission`);
      console.log(`   📚 /api/programs - Program Management`);
      console.log('=================================\n');
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('❌ Unhandled Promise Rejection:', error.message);
  console.error('Stack trace:', error.stack);
  // Don't exit - let the error handler deal with it
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack trace:', error.stack);
  // Don't exit - let the error handler deal with it
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM signal. Closing server...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT signal. Closing server...');
  process.exit(0);
});

startServer();

export default app;