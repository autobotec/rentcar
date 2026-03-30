# Publicar `rentacar` en Proxmox + CyberPanel (con auto deploy desde GitHub)

Esta guia deja el proyecto desplegado en produccion y configurado para actualizarse automaticamente cuando subas cambios a GitHub.

## 1) Arquitectura recomendada

- `app.tudominio.com` -> Next.js (`apps/web`) en puerto `3006`
- `api.tudominio.com` -> NestJS (`apps/api`) en puerto `4106`
- CyberPanel/OpenLiteSpeed actua como reverse proxy para ambos dominios.
- PM2 mantiene ambos procesos vivos.

## 2) Preparar VM en Proxmox

En Proxmox crea una VM Ubuntu (22.04 o 24.04) con minimo:

- 2 vCPU
- 4 GB RAM (ideal 8 GB)
- 40 GB SSD

Configura DNS para apuntar ambos registros A al IP publico de la VM:

- `app.tudominio.com`
- `api.tudominio.com`

## 3) Instalar CyberPanel y dependencias del servidor

> Ejecuta como `root` o con `sudo`.

```bash
apt update && apt upgrade -y
apt install -y curl git unzip
```

Instalar CyberPanel (si aun no lo tienes):

```bash
sh <(curl -s https://cyberpanel.net/install.sh)
```

Instalar Node.js LTS + PM2:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
node -v
npm -v
pm2 -v
```

## 4) Descargar proyecto desde GitHub

Define una carpeta de despliegue:

```bash
mkdir -p /var/www/rentacar
cd /var/www/rentacar
git clone https://github.com/TU-USUARIO/TU-REPO.git .
```

Si el repo es privado, usa SSH deploy key o token:

```bash
git clone git@github.com:TU-USUARIO/TU-REPO.git .
```

Instalar dependencias:

```bash
npm install
```

## 5) Configurar variables de entorno

Este proyecto usa variables en raiz (`.env`) y en `apps/web/.env`.

### 5.1 Archivo raiz (`/var/www/rentacar/.env`)

```env
API_PORT=4106
DATABASE_URL="file:./dev.db"
API_BASE_URL="https://api.tudominio.com/api"
NEXT_PUBLIC_API_BASE_URL="https://api.tudominio.com/api"
ADMIN_PASSWORD=CAMBIA_ESTA_PASSWORD
WEB_ORIGINS=https://app.tudominio.com,https://tudominio.com
```

### 5.2 Archivo frontend (`/var/www/rentacar/apps/web/.env`)

Incluye aqui tus llaves reales (Stripe, PayPal, etc.). Como minimo:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.tudominio.com/api
```

## 6) Build de produccion

```bash
cd /var/www/rentacar
npm run build
```

## 7) Levantar servicios con PM2

Desde la raiz del proyecto:

```bash
cd /var/www/rentacar
pm2 start "npm --workspace api run start" --name rentacar-api
pm2 start "npm --workspace web run start -- -p 3006" --name rentacar-web
pm2 save
pm2 startup
```

Verificar:

```bash
pm2 status
curl -I http://127.0.0.1:3006
curl -I http://127.0.0.1:4106/api
```

## 8) Configurar CyberPanel (reverse proxy + SSL)

En CyberPanel:

1. Crea el sitio `app.tudominio.com`.
2. Crea el sitio `api.tudominio.com`.
3. En cada sitio, emite SSL (Let's Encrypt).
4. Agrega reglas de proxy en OpenLiteSpeed:

- Para `app.tudominio.com` proxy a `http://127.0.0.1:3006`
- Para `api.tudominio.com` proxy a `http://127.0.0.1:4106`

Si deseas que el backend conserve prefijo `/api`, deja Nest como esta (ya usa `setGlobalPrefix('api')`), por ejemplo:

- `https://api.tudominio.com/api/vehicles`

## 9) Auto actualizacion desde GitHub (recomendado: GitHub Actions + SSH)

Con esta opcion, cada push a `main` despliega automaticamente.

### 9.1 Crear script de deploy en el servidor

Archivo: `/var/www/rentacar/deploy.sh`

```bash
#!/usr/bin/env bash
set -e

cd /var/www/rentacar

echo "==> Actualizando codigo"
git fetch origin
git reset --hard origin/main

echo "==> Instalando dependencias"
npm install

echo "==> Build"
npm run build

echo "==> Reiniciando procesos"
pm2 restart rentacar-api
pm2 restart rentacar-web

echo "==> Deploy OK"
```

Dar permisos:

```bash
chmod +x /var/www/rentacar/deploy.sh
```

### 9.2 Crear llave SSH para GitHub Actions

En el servidor:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f /root/.ssh/github_actions_deploy -N ""
cat /root/.ssh/github_actions_deploy.pub
```

Agrega esa clave publica en el servidor en `~/.ssh/authorized_keys` del usuario que ejecutara deploy.

Luego copia la clave privada:

```bash
cat /root/.ssh/github_actions_deploy
```

Y guardala en GitHub Repo Secrets como:

- `DEPLOY_SSH_KEY`
- `DEPLOY_HOST` (IP o dominio del servidor)
- `DEPLOY_USER` (por ejemplo `root` o usuario deploy)
- `DEPLOY_PORT` (normalmente `22`)

### 9.3 Workflow en GitHub

Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy production

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Ejecutar deploy por SSH
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          port: ${{ secrets.DEPLOY_PORT }}
          script: |
            /var/www/rentacar/deploy.sh
```

Con esto, cada push a `main` actualiza automaticamente el sitio.

## 10) Verificaciones despues de cada deploy

```bash
pm2 status
pm2 logs rentacar-web --lines 50
pm2 logs rentacar-api --lines 50
curl -I https://app.tudominio.com
curl -I https://api.tudominio.com/api
```

## 11) Recomendaciones importantes

- Cambia `ADMIN_PASSWORD` por una fuerte.
- No uses `DATABASE_URL="file:./dev.db"` para produccion critica; migra a PostgreSQL/MySQL.
- Configura backups automaticos (DB + `/var/www/rentacar`).
- Considera rama `staging` con entorno separado antes de producir.

---

Si quieres, en el siguiente paso te puedo crear tambien:

- el `deploy.sh` directamente en el repo,
- el `.github/workflows/deploy.yml`,
- y una version alternativa con webhook puro (sin Actions).
