import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

interface ProductBody {
  sku?: string | null;
  name: string;
  description?: string | null;
  price_sale: number;
  price_cost?: number | null;
  stock?: number;
  min_stock?: number;
}

export default function productRoutes(prisma: PrismaClient) {
  const router = Router();

  router.use(requireAuth);

  router.get('/', async (_req, res) => {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
    res.json(products);
  });

  router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  router.post('/', async (req: AuthenticatedRequest<ProductBody>, res) => {
    const { name, price_sale, sku, description, price_cost, stock, min_stock } = req.body;
    if (!name || typeof price_sale !== 'number') {
      return res.status(400).json({ message: 'Name and price_sale are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price_sale,
        sku,
        description,
        price_cost,
        stock: stock ?? 0,
        min_stock: min_stock ?? 0
      }
    });

    res.status(201).json(product);
  });

  router.put('/:id', async (req: AuthenticatedRequest<ProductBody>, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price_sale, sku, description, price_cost, stock, min_stock } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        price_sale: typeof price_sale === 'number' ? price_sale : existing.price_sale,
        sku: sku ?? existing.sku,
        description: description ?? existing.description,
        price_cost: typeof price_cost === 'number' ? price_cost : existing.price_cost,
        stock: typeof stock === 'number' ? stock : existing.stock,
        min_stock: typeof min_stock === 'number' ? min_stock : existing.min_stock
      }
    });

    res.json(updated);
  });

  router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    try {
      await prisma.product.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: 'Product not found' });
    }
  });

  return router;
}
