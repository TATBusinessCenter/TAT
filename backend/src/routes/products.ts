import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

export default function (prisma: PrismaClient) {
  const router = Router();

  router.get('/', async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  });

  // Optional: CRUD endpoints for admin
  router.post('/', async (req, res) => {
    const data = req.body;
    const p = await prisma.product.create({ data });
    res.json(p);
  });

  return router;
}