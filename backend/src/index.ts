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
import adminReceiptRoutes from './routes/admin/receipt.routes.js';
import adminMockTestRoutes from './routes/admin/mockTest.routes.js'; // NEW
import officeMockTestRoutes from './routes/office/mockTest.routes.js'; // NEW
import reportRoutes from './routes/report.routes.js';
import publicRoutes from './routes/public.routes.js';

import { errorHandler, notFound } from './middlewares/error.middleware.js';
import { seedAdmin } from './utils/seedAdmin.js';

const app: Express = express();

// ============================================
// BODY PARSER - CRITICAL!
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet());

// ============================================
// CORS CONFIGURATION
// ============================================
const allowedOrigins = [
  'http://localhost:5173',
  'https://beyondthesyllabus.vercel.app',
  'https://www.beyondthesyllabus.org',
  'https://beyondthesyllabus.org',
  'https://beyond-the-syllabus-lms-qwox.onrender.com'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ============================================
// RATE LIMITING
// ============================================
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: 'Too many requests, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api', limiter as any);

// ============================================
// COMPRESSION
// ============================================
app.use(compression() as any);

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

app.use('/api/admin/receipts', adminReceiptRoutes);
console.log('✅ Admin Receipt routes mounted at /api/admin/receipts');

// NEW: Admin Mock Test routes
app.use('/api/admin', adminMockTestRoutes);
console.log('✅ Admin Mock Test routes mounted at /api/admin');

// NEW: Office Mock Test routes
app.use('/api/office', officeMockTestRoutes);
console.log('✅ Office Mock Test routes mounted at /api/office');

app.use('/api/reports', reportRoutes); // NEW
console.log('✅ Report routes mounted at /api/reports');

app.use('/api/public', publicRoutes);
console.log('✅ Public routes mounted at /api/public');

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
      console.log(`   🔐 /api/auth              - Authentication`);
      console.log(`   🎓 /api/admission         - Student Admission`);
      console.log(`   📚 /api/programs          - Program Management`);
      console.log(`   👨‍🏫 /api/teacher          - Teacher Dashboard`);
      console.log(`   🧑‍🎓 /api/student          - Student Dashboard`);
      console.log(`   👑 /api/admin/teachers    - Admin Teacher Management`);
      console.log(`   👑 /api/admin/students    - Admin Student Management`);
      console.log(`   📄 /api/admin/receipts    - Admin Receipt Management`);
      console.log(`   📝 /api/admin/mock-tests  - Admin Mock Test Management`); // NEW
      console.log(`   📝 /api/office/mock-tests - Office Mock Test Management`); // NEW
      console.log(`   🌐 /api/public            - Public Routes`);
      console.log('=================================\n');
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;