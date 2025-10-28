# TAT — Tienda de Motos y Accesorios

Aplicación completa de punto de venta y gestión de un local de motos y accesorios. Incluye backend (API Express + Prisma)
y aplicación móvil (Expo/React Native) lista para autenticación, listado de productos y registro de ventas.

## Estructura
- `backend/`: API Node.js + TypeScript + Prisma + PostgreSQL.
- `mobile/`: App Expo + React Native + TypeScript.

## Puesta en marcha rápida
1. Clonar el repo y ejecutar `npm install` tanto en `backend/` como en `mobile/`.
2. Configurar una base de datos PostgreSQL y variables de entorno (`backend/.env`).
3. Ejecutar migraciones y seed en el backend (`npm run prisma:migrate && npm run prisma:seed`).
4. Iniciar la API (`npm run dev`).
5. Configurar la variable `EXPO_PUBLIC_API_URL` en `mobile/.env` apuntando a la API.
6. Lanzar la app móvil con `npm run start` y probar con las credenciales `demo@tat.com` / `demo123`.

Consulta los READMEs específicos de cada paquete para más detalles.
