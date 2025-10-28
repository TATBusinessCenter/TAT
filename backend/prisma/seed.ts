import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(process.env.SEED_USER_PASSWORD || 'demo123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@tat.com' },
    update: {},
    create: {
      email: 'demo@tat.com',
      name: 'Vendedor Demo',
      password,
      role: 'seller'
    }
  });

  const products = [
    {
      sku: 'MOTO-ALPHA-150',
      name: 'Moto Alpha 150',
      description: 'Motor 150cc ideal para ciudad',
      price_sale: 120000,
      price_cost: 95000,
      stock: 4,
      min_stock: 1
    },
    {
      sku: 'CASCO-INTEGRAL',
      name: 'Casco Integral',
      description: 'Casco integral con certificación DOT',
      price_sale: 6500,
      price_cost: 4200,
      stock: 15,
      min_stock: 5
    },
    {
      sku: 'GUANTES-CUERO',
      name: 'Guantes de Cuero',
      description: 'Guantes reforzados para conducción diaria',
      price_sale: 3800,
      price_cost: 2100,
      stock: 20,
      min_stock: 6
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku! },
      update: product,
      create: product
    });
  }

  console.log(`Seed executed. User: ${user.email} / demo123`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
