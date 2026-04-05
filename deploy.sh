#!/usr/bin/env bash
set -e

cd /var/www/rentacar

echo "==> Actualizando código"
git fetch origin
git reset --hard origin/main

echo "==> Instalando dependencias"
npm install

echo "==> Generando Prisma Client"
npx prisma generate --schema=packages/db/prisma/schema.prisma

echo "==> Aplicando migraciones de base de datos"
npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma

echo "==> Corriendo seed (idempotente)"
node scripts/seed.js

echo "==> Build"
npm run build

echo "==> Reiniciando procesos"
pm2 restart rentacar-api --update-env
pm2 restart rentacar-web --update-env

echo "==> Deploy OK"
