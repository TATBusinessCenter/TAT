# TAT Backend API

API REST en Node.js + Express + Prisma para gestionar usuarios, productos y ventas del local.

## Requisitos
- Node.js >= 18
- Base de datos PostgreSQL (local o en contenedor)

## Configuración
1. Copiar `.env.example` a `.env` y completar la cadena de conexión `DATABASE_URL` y `JWT_SECRET`.
2. Instalar dependencias: `npm install`.
3. Ejecutar migraciones: `npm run prisma:migrate`.
4. (Opcional) Ejecutar el seed: `npm run prisma:seed` (crea usuario demo y productos).
5. Iniciar el servidor en desarrollo: `npm run dev`.

### Variables de entorno
```
DATABASE_URL=postgresql://user:password@localhost:5432/tat
JWT_SECRET=un_secreto_seguro
SEED_USER_PASSWORD=demo123
```

## Endpoints principales
- `POST /auth/register` — Alta de usuarios.
- `POST /auth/login` — Inicio de sesión y emisión de JWT.
- `GET /auth/me` — Datos del usuario autenticado.
- `GET /products` — Listado de productos.
- `POST /products` — Alta de productos.
- `PUT /products/:id` — Actualización.
- `DELETE /products/:id` — Eliminación.
- `POST /sales` — Registrar venta individual.
- `POST /sales/sync` — Sincronización por lotes desde el POS offline.

Todos los endpoints de productos y ventas requieren cabecera `Authorization: Bearer <token>`.

## Notas
- El seed crea el usuario `demo@tat.com` con contraseña `demo123` (se puede sobrescribir con `SEED_USER_PASSWORD`).
- Las ventas actualizan automáticamente el stock de los productos involucrados.
