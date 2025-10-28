import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default function (prisma: PrismaClient) {
  const router = Router();

  // Create a sale (from POS or sync)
  router.post('/', async (req, res) => {
    const { userId, total, items, externalId } = req.body;
    const sale = await prisma.sale.create({
      data: {
        userId,
        total,
        externalId,
        items: {
          create: items.map((it: any) => ({
            productId: it.productId,
            qty: it.qty,
            unitPrice: it.unitPrice
          }))
        }
      },
      include: { items: true }
    });

    // Update stock for each item
    for (const it of items) {
      await prisma.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.qty } }
      });
    }

    res.json(sale);
  });

  // Bulk sync endpoint: accept array of local sales
  router.post('/sync', async (req, res) => {
    const { sales } = req.body;
    const created: any[] = [];
    for (const s of sales) {
      const sale = await prisma.sale.create({
        data: {
          externalId: s.externalId,
          userId: s.userId,
          total: s.total,
          items: {
            create: s.items.map((it: any) => ({
              productId: it.productId,
              qty: it.qty,
              unitPrice: it.unitPrice
            }))
          }
        }
      });
      // update stock
      for (const it of s.items) {
        await prisma.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.qty } }
        });
      }
      created.push(sale);
    }
    res.json({ created });
  });

  return router;
}