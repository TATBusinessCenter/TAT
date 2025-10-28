# TAT Mobile App (Scaffold)

Aplicación móvil Expo + React Native (TypeScript) para el local de venta de motos y accesorios.

Requisitos:
- Node.js (>=18)
- npm o yarn
- Expo CLI (opcional: npm i -g expo-cli)

Instalación y ejecución:
1. git checkout -b feature/mobile-app
2. cd mobile
3. npm install
4. cp .env.example .env
5. npm run start
6. Abrir Expo Go en tu dispositivo o usar un emulador

Estructura:
- mobile/
  - App.tsx
  - src/
    - navigation/
    - screens/
    - services/

Variables de entorno (.env):
- API_URL=https://api.example.com

Nota: Esto es un scaffold inicial con pantallas y llamadas a una API mock. Próximo paso: implementar sincronización SQLite/local y endpoints reales.