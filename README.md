Ez egy Next.js projekt, ami a [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) segítségével lett létrehozva.
Ez maga a weboldal Vercelen: https://budapest-vinyl-admin.vercel.app/
### Ha lokálisan szeretnéd futtatni
## Kezdés
Telepítsd a Csomagokat:
Nyisd meg a projekt főkönyvtárában a terminált, majd futtasd le az alábbi parancsokat a csomagok telepítéséhez:
```bash
npm i
```

Állítsd össze a .env fájlt, pontos adatokat a dolgoza	Admin oldal és bolt összecsatolása fejezetében találod
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL=''
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
STRIPE_API_KEY=
FRONTEND_STORE_URL=http://localhost:3001
STRIPE_WEBHOOK_SECRET=
```

Összekapcsolás PlanetScale-lel és Prisma push
```bash
npx prisma generate
npx prisma db push
```
Futtatás:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

A fenti lépések után a Next.js alkalmazásod elérhető lesz a böngészőben a következő címen: https://localhost:3000/.

