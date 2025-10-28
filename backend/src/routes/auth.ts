import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const TOKEN_EXPIRES_IN = '7d';

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody extends LoginBody {
  name?: string;
}

export default function authRoutes(prisma: PrismaClient) {
  const router = Router();

  router.post('/register', async (req: AuthenticatedRequest<RegisterBody>, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  });

  router.post('/login', async (req: AuthenticatedRequest<LoginBody>, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  });

  router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  });

  return router;
}
