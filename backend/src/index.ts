import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import salesRoutes from './routes/sales';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes(prisma));
app.use('/products', productRoutes(prisma));
app.use('/sales', salesRoutes(prisma));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});