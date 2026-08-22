import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || 'dayflow-super-secret-key';

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

const registerSchema = z.object({
  employeeId: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['EMPLOYEE', 'ADMIN']).default('EMPLOYEE'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authMiddleware = async (req: any, res: any, next: any) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const token = authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dayflow-backend' });
});

app.post('/api/auth/register', async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Invalid registration payload', issues: result.error.flatten() });
  }

  const { employeeId, name, email, password, role } = result.data;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { employeeId }] },
  });

  if (existingUser) {
    return res.status(409).json({ message: 'User with this email or employee ID already exists' });
  }

  if (role === 'ADMIN') {
    return res.status(403).json({ message: 'Public signup for admins is not allowed' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const finalRole = 'EMPLOYEE';
  const user = await prisma.user.create({
    data: {
      employeeId,
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      department: 'Engineering',
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
});

app.post('/api/auth/login', async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Invalid login payload', issues: result.error.flatten() });
  }

  const { email, password } = result.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: {
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
});

app.get('/api/auth/me', authMiddleware, async (req: any, res) => {
  res.json({ user: { ...req.user, password: undefined } });
});

app.get('/api/dashboard', authMiddleware, async (req: any, res) => {
  const attendance = await prisma.attendance.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  res.json({
    greeting: 'Welcome back',
    user: { id: req.user.id, name: req.user.name, role: req.user.role },
    attendance,
    summary: {
      todayHours: 8.5,
      attendanceStatus: 'PRESENT',
      leaveBalance: 12,
    },
  });
});

app.post('/api/attendance/checkin', authMiddleware, async (req: any, res) => {
  const now = new Date();
  const existing = await prisma.attendance.findFirst({
    where: { userId: req.user.id, checkIn: { not: null }, checkOut: null },
    orderBy: { createdAt: 'desc' },
  });

  if (existing) {
    return res.status(409).json({ message: 'User is already checked in' });
  }

  const record = await prisma.attendance.create({
    data: {
      userId: req.user.id,
      checkIn: now,
      status: 'PRESENT',
      location: req.body.location || 'office',
    },
  });

  res.status(201).json({ message: 'Checked in successfully', record });
});

app.post('/api/attendance/checkout', authMiddleware, async (req: any, res) => {
  const active = await prisma.attendance.findFirst({
    where: { userId: req.user.id, checkOut: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!active) {
    return res.status(400).json({ message: 'No active check-in found' });
  }

  const checkedOut = await prisma.attendance.update({
    where: { id: active.id },
    data: {
      checkOut: new Date(),
      status: 'PRESENT',
      workedMinutes: Math.max(1, Math.round((Date.now() - active.checkIn!.getTime()) / 60000)),
      breakMinutes: req.body.breakMinutes || 0,
    },
  });

  res.json({ message: 'Checked out successfully', record: checkedOut });
});

app.listen(PORT, () => {
  console.log(`DayFlow backend running on http://localhost:${PORT}`);
});
