import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

interface SaleItemInput {
  productId: number;
  qty: number;
  unitPrice?: number;
}

interface CreateSaleBody {
  items: SaleItemInput[];
  externalId?: string;
  total?: number;
}

interface SyncPayload {
  sales: (CreateSaleBody & { userId?: number })[];
}

export default function salesRoutes(prisma: PrismaClient) {
  const router = Router();

  router.use(requireAuth);

  router.get('/', async (_req, res) => {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(sales);
  });

  router.post('/', async (req: AuthenticatedRequest<CreateSaleBody>, res) => {
    const { items, externalId, total } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Sale items are required' });
    }

    try {
      const created = await createSale(prisma, {
        userId: req.user.sub,
        items,
        externalId,
        total
      });

      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Could not register sale' });
    }
  });

  router.post('/sync', async (req: AuthenticatedRequest<SyncPayload>, res) => {
    const { sales } = req.body;
    if (!Array.isArray(sales) || sales.length === 0) {
      return res.status(400).json({ message: 'Sales payload is required' });
    }

    const created = [] as any[];

    for (const payload of sales) {
      try {
        const sale = await createSale(prisma, {
          ...payload,
          userId: payload.userId ?? req.user?.sub ?? 0
        });
        created.push(sale);
      } catch (error) {
        // skip invalid sale but continue processing others
      }
    }

    res.json({ created });
  });

  return router;
}

async function createSale(
  prisma: PrismaClient,
  payload: CreateSaleBody & { userId: number }
) {
  const { items, externalId, total, userId } = payload;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Sale items are required');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const productIds = items.map((item) => {
    if (!item.productId || item.qty <= 0) {
      throw new Error('Each sale item must have a valid product and quantity');
    }
    return item.productId;
  });
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== items.length) {
    throw new Error('Some products were not found');
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.qty) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
  }

  const saleTotal = items.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const price = typeof item.unitPrice === 'number' ? item.unitPrice : product.price_sale;
    return acc + price * item.qty;
  }, 0);

  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({
      data: {
        externalId,
        userId,
        total: typeof total === 'number' ? total : saleTotal,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            unitPrice:
              typeof item.unitPrice === 'number'
                ? item.unitPrice
                : products.find((p) => p.id === item.productId)!.price_sale
          }))
        }
      },
      include: { items: true }
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } }
      });
    }

    return sale;
  });
}
