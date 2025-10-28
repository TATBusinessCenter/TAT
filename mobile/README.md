# TAT Mobile App

Aplicación móvil Expo + React Native (TypeScript) para el punto de venta del local de motos y accesorios.

## Requisitos
- Node.js (>=18)
- npm o yarn
- Expo CLI (opcional: `npm i -g expo-cli`)

## Instalación y ejecución
1. `cd mobile`
2. `npm install`
3. Crear el archivo `.env` (o usar variables en `app.config.js`) con la URL de la API.
4. `npm run start`
5. Abrir Expo Go en tu dispositivo (misma red) o usar un emulador.

### Variables de entorno
Utilizamos las nuevas variables públicas de Expo: crea un archivo `.env` con el siguiente contenido y ajusta la URL según corresponda.

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:4000
```

> Nota: si usas un emulador Android local puedes emplear `http://10.0.2.2:4000`.

## Funcionalidades
- Inicio de sesión contra la API (usuario seed: `demo@tat.com` / `demo123`).
- Listado de productos con stock y precios obtenidos desde el backend.
- Carrito de ventas con sumatoria automática y actualización de cantidades.
- Registro de ventas en línea con actualización de stock.

## Estructura
- `App.tsx`: Configura Navigation + Contexto de autenticación.
- `src/navigation/`: Stack de pantallas (Login, Productos, POS).
- `src/context/`: Contexto de autenticación y helpers.
- `src/screens/`: Pantallas de la app.
- `src/services/api.ts`: cliente HTTP y helper para token.
