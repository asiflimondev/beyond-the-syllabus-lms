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
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import adminTeacherRoutes from './routes/admin/teacherManagement.routes.js';
import adminStudentRoutes from './routes/admin/studentManagement.routes.js';

import { errorHandler, notFound } from './middlewares/error.middleware.js';
import { seedAdmin } from './utils/seedAdmin.js';

const app: Express = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet());

// Rate limiting - Fix: Use rateLimit() directly without app.use()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter as any);

// Compression - Fix: Cast to any to bypass type checking
app.use(compression() as any);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// MOUNT API ROUTES
// ============================================
console.log('📌 Mounting routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes mounted at /api/auth');

app.use('/api/admission', admissionRoutes);
console.log('✅ Admission routes mounted at /api/admission');

app.use('/api/programs', programRoutes);
console.log('✅ Program routes mounted at /api/programs');

app.use('/api/teacher', teacherRoutes);
console.log('✅ Teacher routes mounted at /api/teacher');

app.use('/api/student', studentRoutes);
console.log('✅ Student routes mounted at /api/student');

app.use('/api/admin/teachers', adminTeacherRoutes);
console.log('✅ Admin Teacher routes mounted at /api/admin/teachers');

app.use('/api/admin/students', adminStudentRoutes);
console.log('✅ Admin Student routes mounted at /api/admin/students');

// ============================================
// ERROR HANDLING
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('✅ Database connection established');

    await seedAdmin();
    console.log('✅ Admin seeded');

    app.listen(PORT, () => {
      console.log('\n=================================');
      console.log('🚀 Beyond the Syllabus LMS - Backend');
      console.log('=================================');
      console.log(`📡 Server running on port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log('=================================');
      console.log('📌 Available Routes:');
      console.log(`   🔐 /api/auth      - Authentication`);
      console.log(`   🎓 /api/admission - Student Admission`);
      console.log(`   📚 /api/programs  - Program Management`);
      console.log(`   👨‍🏫 /api/teacher   - Teacher Dashboard`);
      console.log(`   🧑‍🎓 /api/student   - Student Dashboard`);
      console.log(`   👑 /api/admin     - Admin Management`);
      console.log('=================================\n');
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;