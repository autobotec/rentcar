# Deploy a Producción — esanibalrentcar.com

Servidor: Linux Almaviva · Proxmox · CyberPanel · Nginx  
Proyecto: monorepo Next.js (web puerto 3003) + NestJS (api puerto 4106) gestionado con PM2

---

## Diagnóstico de problemas comunes

| Síntoma | Causa raíz |
|---|---|
| No aparecen vehículos ni ubicaciones | El deploy no corría migraciones ni seed |
| No se pueden crear vehículos desde el admin | Las URLs de la API apuntan a `localhost` en producción |
| Errores CORS | El backend solo tenía `localhost:3003` como origen permitido |
| Imágenes de vehículos rotas | Las URLs en la DB apuntan a `http://localhost:3000/uploads/...` |

---

## Aclaraciones importantes antes de empezar

### ¿Por qué el puerto 3003?

En Nginx el proxy para `www.esanibalrentcar.com` apunta a `http://127.0.0.1:3003` — eso es correcto.  
Next.js arranca en ese puerto y Nginx lo expone públicamente por el 443 (HTTPS). No hay nada que cambiar ahí.

### ¿Se pueden subir las fotos a GitHub?

**Sí, en este proyecto es lo correcto.** Las imágenes viven en `apps/web/public/uploads/` y el código de upload (`app/api/upload/route.ts`) las guarda ahí mismo. Cuando Next.js sirve archivos desde `public/`, los expone directamente en `https://www.esanibalrentcar.com/uploads/...` sin pasar por ninguna API externa.

Esto significa que:
- Las fotos **sí deben subirse a GitHub** para que estén disponibles en producción tras el `git clone` o `git pull`.
- Las URLs en la base de datos deben usar el dominio del **frontend** (`www.esanibalrentcar.com`), no el de la API.
- No se necesita copiar carpetas por `scp` ni configurar nada extra — solo hacer el push correctamente.

---

## PASO 1 — Subir las imágenes y cambios a GitHub (desde tu Mac)

Las imágenes actuales están en `apps/web/public/uploads/` pero el `.gitignore` las excluye con un comentario. Primero verifica que no estén ignoradas:

```bash
cd /Users/juang/Documents/rentacar
cat .gitignore | grep uploads
```

Si aparece una línea activa como `uploads/` o `**/public/uploads/` (sin `#` al inicio), elimínala o coméntala. Si solo aparece comentada con `#`, está bien — las imágenes sí se trackean.

Ahora añade todo al commit:

```bash
cd /Users/juang/Documents/rentacar
git add apps/web/public/uploads/
git add scripts/seed.js deploy.sh DEPLOY-PRODUCCION.md
git commit -m "feat: imagenes de vehiculos + seed real + deploy corregido"
git push origin main
```

Verifica en GitHub que la carpeta `apps/web/public/uploads/` aparece con los archivos dentro.

---

## PASO 2 — Corregir las URLs de imágenes en el seed

Las URLs actuales en la base de datos apuntan a `http://localhost:3000/uploads/...`.  
En producción deben apuntar a `https://www.esanibalrentcar.com/uploads/...` porque es Next.js quien sirve esos archivos.

El `seed.js` ya fue actualizado con las URLs correctas para que al correr en producción queden bien desde el primer momento. No se necesita ningún `UPDATE` manual en la DB.

---

## PASO 3 — Configurar el servidor (conectado por SSH)

### 3.1 — Clonar el proyecto (solo la primera vez)

```bash
mkdir -p /var/www/rentacar
cd /var/www/rentacar
git clone https://github.com/TU-USUARIO/TU-REPO.git .
```

Si el repo es privado:

```bash
git clone git@github.com:TU-USUARIO/TU-REPO.git .
```

### 3.2 — Crear el `.env` raíz de producción

> ⚠️ Este archivo **no se sube a GitHub** (está en `.gitignore`). Hay que crearlo manualmente en el servidor la primera vez.

```bash
cat > /var/www/rentacar/.env << 'EOF'
API_PORT=4106
DATABASE_URL="file:/var/www/rentacar/packages/db/prisma/prod.db"
API_BASE_URL="https://api.esanibalrentcar.com/api"
NEXT_PUBLIC_API_BASE_URL="https://api.esanibalrentcar.com/api"
ADMIN_PASSWORD=TU_PASSWORD_SEGURA_AQUI
WEB_ORIGINS=https://www.esanibalrentcar.com,https://esanibalrentcar.com
EOF
```

> `DATABASE_URL` usa **ruta absoluta** y nombre `prod.db` para que el archivo no se pierda con cada `git reset --hard` durante los deploys.

### 3.3 — Crear el `.env` del frontend

```bash
cat > /var/www/rentacar/apps/web/.env << 'EOF'
# API_BASE_URL sin PUBLIC: llamada interna server-side de Next.js → correcto en localhost
API_BASE_URL=http://localhost:4106/api

# API_BASE_URL pública: lo que ve el navegador del cliente
NEXT_PUBLIC_API_BASE_URL=https://api.esanibalrentcar.com/api

ADMIN_PASSWORD=TU_PASSWORD_SEGURA_AQUI

PAYPAL_CLIENT_ID=Aa3Mf5N5vbC12nlMgkhbpvlW9-aSBjab00Ai6mLZ2s8kGZC0h86QQXKmFLfHZg5hKRAdQcu2aLvWO5P6
PAYPAL_CLIENT_SECRET=EK6ypRh_BZCpuDqlehHWWBo7dIBPd7ctLl9X_tRsDzVyyWih_o-XqA4R4fRoPRaHQBSuEJOXRCcMgmP6
NEXT_PUBLIC_PAYPAL_CLIENT_ID=Aa3Mf5N5vbC12nlMgkhbpvlW9-aSBjab00Ai6mLZ2s8kGZC0h86QQXKmFLfHZg5hKRAdQcu2aLvWO5P6

WHATSAPP_PHONE=18498515436
NEXT_PUBLIC_WHATSAPP_PHONE=18498515436
EOF
```

---

## PASO 4 — Correr el deploy por primera vez

```bash
cd /var/www/rentacar
chmod +x deploy.sh
bash deploy.sh
```

El `deploy.sh` hace en orden:
1. `git reset --hard origin/main` — actualiza el código e imágenes
2. `npm install` — instala dependencias
3. `prisma generate` — genera el cliente de Prisma
4. `prisma migrate deploy` — aplica migraciones a la DB
5. `node scripts/seed.js` — carga los 11 vehículos y 2 ubicaciones (idempotente)
6. `npm run build` — build de producción
7. `pm2 restart` — reinicia los procesos con las variables de entorno actualizadas

### Verificar que el seed funcionó

```bash
sqlite3 /var/www/rentacar/packages/db/prisma/prod.db \
  "SELECT brand, model, year, basePricePerDay FROM Vehicle ORDER BY brand;"
```

Deberías ver los 11 vehículos. También verifica que las imágenes están:

```bash
ls /var/www/rentacar/apps/web/public/uploads/
```

---

## PASO 5 — Levantar PM2 (solo la primera vez)

```bash
cd /var/www/rentacar

# Eliminar procesos viejos si existían con configuración incorrecta
pm2 delete rentacar-api rentacar-web 2>/dev/null || true

# Levantar API (puerto 4106) y Web (puerto 3003)
pm2 start "npm --workspace api run start" --name rentacar-api
pm2 start "npm --workspace web run start -- -p 3003" --name rentacar-web

# Guardar configuración y activar arranque automático al reiniciar el servidor
pm2 save
pm2 startup
```

Verificar que ambos procesos están corriendo:

```bash
pm2 status
curl -I http://127.0.0.1:3003
curl -I http://127.0.0.1:4106/api
```

---

## PASO 6 — Configurar Nginx (reverse proxy)

En CyberPanel usa la interfaz gráfica para agregar las reglas de proxy en cada dominio, o edita la configuración de Nginx directamente.

### Para `www.esanibalrentcar.com` → Next.js (puerto 3003)

```nginx
location / {
    proxy_pass http://127.0.0.1:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### Para `api.esanibalrentcar.com` → NestJS (puerto 4106)

```nginx
location / {
    proxy_pass http://127.0.0.1:4106;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Después de modificar Nginx, recarga la configuración:

```bash
nginx -t && nginx -s reload
```

Emite SSL (Let's Encrypt) en CyberPanel para ambos dominios si aún no lo has hecho.

---

## PASO 7 — Verificaciones finales

```bash
# Estado de los procesos
pm2 status

# Logs en vivo (Ctrl+C para salir)
pm2 logs rentacar-api --lines 50
pm2 logs rentacar-web --lines 50

# Verificar que responden por HTTPS
curl -I https://www.esanibalrentcar.com
curl https://api.esanibalrentcar.com/api/vehicles | head -c 500
```

La última línea debe devolver un JSON con los 11 vehículos.  
Abre también `https://www.esanibalrentcar.com/uploads/1773705705461-sscebl15c39.png` en el navegador — debe mostrarse la imagen del BMW X5.

---

## Deploys futuros (flujo normal)

Desde ahora, cada vez que hagas cambios — incluyendo nuevas fotos subidas desde el panel admin — el flujo es:

```bash
# En tu Mac
git add .
git commit -m "descripción del cambio"
git push origin main

# En el servidor
bash /var/www/rentacar/deploy.sh
```

> ⚠️ **Importante con las fotos nuevas:** Cuando subas una foto nueva desde el panel admin en **local**, esa imagen se guarda en `apps/web/public/uploads/` en tu Mac. Para que llegue a producción debes hacer `git add` de ese archivo y subirlo. Si la subes directamente desde el admin en producción, ya vive en el servidor y no necesitas hacer nada.

El script es idempotente: el seed no duplica datos, las migraciones solo aplican las nuevas.

---

## Automatizar con GitHub Actions (opcional)

Cada push a `main` dispara el deploy automáticamente sin tener que conectarse por SSH.

### Crear secretos en GitHub

Ve a tu repo → Settings → Secrets and variables → Actions y agrega:

| Secret | Valor |
|---|---|
| `DEPLOY_HOST` | IP pública del servidor |
| `DEPLOY_USER` | `root` o tu usuario SSH |
| `DEPLOY_PORT` | `22` |
| `DEPLOY_SSH_KEY` | Clave privada SSH (ver abajo) |

### Generar la clave SSH en el servidor

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f /root/.ssh/github_actions_deploy -N ""
cat /root/.ssh/github_actions_deploy.pub >> /root/.ssh/authorized_keys
cat /root/.ssh/github_actions_deploy  # <- copia este contenido como DEPLOY_SSH_KEY en GitHub
```

### Archivo `.github/workflows/deploy.yml`

```yaml
name: Deploy producción

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
            bash /var/www/rentacar/deploy.sh
```

---

## Notas importantes

- Los archivos `.env` **nunca se suben a GitHub** — deben crearse manualmente en el servidor la primera vez.
- La DB `prod.db` vive en ruta absoluta `/var/www/rentacar/packages/db/prisma/prod.db` para sobrevivir los `git reset --hard` de cada deploy.
- Las imágenes **sí se suben a GitHub** en `apps/web/public/uploads/` — es la forma correcta con este stack.
- Si necesitas replicar la DB de producción en local: `scp root@IP:/var/www/rentacar/packages/db/prisma/prod.db /Users/juang/Documents/rentacar/packages/db/prisma/dev.db`
- Backup rápido de la DB en el servidor: `cp /var/www/rentacar/packages/db/prisma/prod.db /var/www/rentacar/packages/db/prisma/prod.db.bak.$(date +%Y%m%d)`
