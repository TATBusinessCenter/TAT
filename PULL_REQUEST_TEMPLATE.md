Scaffold inicial que incluye:

- mobile/: app Expo + React Native + TypeScript (pantallas MVP: Login, ProductList, POS)
- backend/: Node.js + Express + TypeScript + Prisma (endpoints: /auth/login, /products, /sales, /sales/sync)

Objetivo: proveer un punto de partida para desarrollar la app móvil con soporte offline y la API para sincronización de ventas.

Checklist:
- [ ] Revisar estructura de carpetas mobile/ y backend/
- [ ] Instalar dependencias en backend y correr migraciones (prisma)
- [ ] Instalar dependencias en mobile y probar en Expo (ajustar API_URL)
- [ ] Añadir seed de productos / usuario admin
- [ ] Crear issues para sincronización offline y soporte de impresión
