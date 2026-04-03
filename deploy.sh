#!/usr/bin/env bash
set -e

cd /var/www/rentacar

echo "==> Actualizando código"
git fetch origin
git reset --hard origin/main

echo "==> Instalando dependencias"
npm install

echo "==> Generando Prisma Client"
npx prisma generate

echo "==> Build"
npm run build

echo "==> Reiniciando procesos"
pm2 restart rentacar-api
pm2 restart rentacar-web

echo "==> Deploy OK"
