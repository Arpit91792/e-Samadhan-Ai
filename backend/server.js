// ── Load env FIRST ────────────────────────────────────────────────────────────
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import connectDB from './config/db.js';
import { verifyEmailConnection } from './utils/sendEmail.js';
import errorHandler from './middleware/errorHandler.js';

// ── Routes ────────────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import officerRoutes from './routes/officerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// ── Register all Mongoose models ──────────────────────────────────────────────
import './models/User.js';
import './models/Complaint.js';
import './models/Department.js';
import './models/Notification.js';
import './models/OTP.js';
import './models/AuditLog.js';
import './models/Feedback.js';
import './models/Verification.js';

// ── Init ──────────────────────────────────────────────────────────────────────
connectDB();
verifyEmailConnection();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Ensure upload dirs exist ──────────────────────────────────────────────────
['uploads/profiles', 'uploads/complaints', 'uploads/govt-ids'].forEach(dir => {
      const full = path.join(__dirname, dir);
      if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests. Please try again later.' },
});

const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 30,
      message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/send-otp', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Static files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
      res.status(200).json({
            success: true,
            message: '✅ e-Samadhan AI API is running',
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            endpoints: {
                  auth: '/api/auth',
                  complaints: '/api/complaints',
                  admin: '/api/admin',
                  officer: '/api/officer',
                  notifications: '/api/notifications',
            },
      });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
      res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 5000;
const server = app.listen(PORT, () => {
      console.log('\n┌─────────────────────────────────────────────────┐');
      console.log(`│  🚀 e-Samadhan AI Server v2.0                    │`);
      console.log(`│  📡 http://localhost:${PORT}/api                    │`);
      console.log(`│  ❤️  http://localhost:${PORT}/api/health             │`);
      console.log(`│  🌍 Mode: ${(process.env.NODE_ENV || 'development').padEnd(38)}│`);
      console.log('└─────────────────────────────────────────────────┘\n');
});

process.on('unhandledRejection', (err) => {
      console.error(`\n❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
});
