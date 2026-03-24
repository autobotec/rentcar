# Rentacar RD — Estado del proyecto vs prompt inicial

Resumen de lo **implementado** y lo que **falta** respecto al prompt inicial (plataforma Rent a Car para República Dominicana: búsqueda, reservas, pagos online, admin, SEO, etc.).

---

## Lo que ya está implementado

### Arquitectura y base
- **Monorepo**: `apps/web` (Next.js), `apps/api` (NestJS), `packages/db` (Prisma).
- **Base de datos**: SQLite con Prisma; modelos: User, Location, Vehicle, VehicleImage, Season, Price, Extra, Reservation, ReservationExtra, Payment, Review, SeoPage.
- **API**: prefijo `/api`, CORS para frontend, puerto configurable.

### Motor de búsqueda (parcial)
- Filtro por **ubicación** (locationCode: PUJ, SDQ).
- Listado de vehículos con imagen, precio/día, ubicación.
- **Falta**: filtros por fechas, tipo de vehículo, precio, transmisión, capacidad, combustible, AC; disponibilidad en tiempo real por fechas; impuestos/seguro en resultados.

### Reservas
- **Cotización**: `POST /api/reservations/quote` (vehicleId, fechas) → total.
- **Crear reserva**: `POST /api/reservations` (vehículo, fechas, nombre, email); genera número único y comprueba disponibilidad.
- **Consultar**: `GET /api/reservations/:id`.
- **Check-in / Check-out**: `POST .../checkin` y `.../checkout` (actualizan estado y vehículo).
- **Flujo en web**: Home → búsqueda por código → detalle vehículo → checkout (fechas + datos) → crear reserva (sin pago real).
- **Falta**: paso de extras, confirmación por email/WhatsApp, contrato digital, cancelación y “finalizada” en UI, página “Mis reservas”.

### Pagos (solo simulado)
- **Iniciar pago**: `POST /api/reservations/:id/start-payment` (crea registro Payment, provider test/stripe/paypal/azul).
- **Confirmar pago**: `POST /api/reservations/payments/:paymentId/confirm` (marca pagado y reserva confirmada).
- **Falta**: integración real con Stripe, PayPal, Azul; flujo depósito/saldo; pago en sitio; checkout con redirección a pasarela.

### Panel administrativo
- **Dashboard**: `/admin` con enlace a Vehículos.
- **Vehículos**: lista, crear, editar; CRUD completo en API.
- **Fotos**: subida en formulario (nuevo y edición); mínimo 5, máximo 10; JPG/PNG/JPEG/WEBP/SVG, máx. 4 MB; guardado en `public/uploads` y asociación a vehículo.
- **Características y precios**: todos los campos (marca, modelo, año, transmisión, combustible, capacidad, motor, tracción, precio/día, moneda, estado, etc.) en el mismo formulario.
- **Falta**: gestión de reservas, clientes, pagos, temporadas/precios, sucursales (locations CRUD), calendario de disponibilidad, reportes financieros, promociones, gestión SEO; **sin autenticación** (cualquiera puede entrar a `/admin`).

### Flota y datos
- Modelo Vehicle con: brand, model, year, transmission, fuelType, capacity, doors, airConditioning, luggage, engine, driveType, basePricePerDay, status, description, imágenes.
- Estados: available, reserved, maintenance.
- **Falta**: campo “seguro/insurance” en modelo si se quiere mostrar por vehículo.

### UI/UX pública
- Home: hero, buscador (ubicación), ventajas, flota destacada.
- Búsqueda: `/search?locationCode=...` con cards de vehículos.
- Detalle vehículo: `/vehicle/[id]` con especificaciones, precio, FAQ, formulario “Agenda ahora” (fechas → checkout).
- Checkout: cotización, datos cliente, crear reserva; mensaje de éxito con número de reserva.
- Estilo: Tailwind, diseño tipo booking, responsive.
- **Falta**: selector de fechas real (date picker), comparador de precios, reseñas de clientes, badges de ofertas, idiomas (EN/FR).

### Backend adicional
- **Locations**: `GET /api/locations` para listar ubicaciones activas (admin y futuros filtros).
- **Seed**: ubicaciones PUJ/SDQ y 2 vehículos con imágenes de ejemplo (Pexels).

---

## Lo que falta implementar (según prompt inicial)

### 1. Búsqueda y disponibilidad
- [ ] Filtros por **fechas** (recogida/devolución) y **disponibilidad en tiempo real** (excluir vehículos reservados en ese rango).
- [ ] Filtros por tipo de vehículo, rango de precio, transmisión, capacidad, combustible, AC.
- [ ] Date picker en home y en búsqueda.
- [ ] Mostrar en resultados: total estimado, impuestos, seguro (aunque sea fijo o estimado).

### 2. Reservas
- [ ] Paso de **extras** (GPS, silla bebé, etc.) con precios y persistencia (ReservationExtra).
- [ ] **Confirmación automática**: email (y opcional WhatsApp) con número de reserva y resumen.
- [ ] **Contrato digital** (PDF o página firmable).
- [ ] Estados completos en UI: pendiente, confirmada, cancelada, finalizada; flujo de cancelación.
- [ ] Página “Mis reservas” (requiere auth o búsqueda por email + número).

### 3. Pagos online reales
- [ ] Integración **Stripe** (tarjeta, etc.).
- [ ] Integración **PayPal**.
- [ ] Integración **Azul** (pasarela local RD).
- [ ] Opciones: pago completo, depósito + saldo, “pagar en sitio”.
- [ ] Webhooks o callbacks para confirmar pago desde la pasarela.

### 4. Panel admin completo
- [ ] **Autenticación** (login) para `/admin` (JWT o sesión).
- [ ] **Reservas**: listado, filtros, detalle, cambiar estado, check-in/check-out desde admin.
- [ ] **Clientes**: listado de usuarios/clientes con historial.
- [ ] **Pagos**: listado y estados (pendiente, pagado, reembolsado).
- [ ] **Temporadas y precios**: CRUD Season/Price por ubicación o global.
- [ ] **Sucursales/ubicaciones**: CRUD de Location (no solo lectura).
- [ ] **Calendario de disponibilidad** por vehículo o por flota.
- [ ] **Reportes financieros** (ingresos por periodo, por ubicación, etc.).
- [ ] **Promociones** (descuentos por fechas o códigos); modelo y UI si se requiere.
- [ ] **Gestión SEO**: edición de SeoPage o metadatos por página/ruta.

### 5. SEO
- [ ] **Schema markup** (JSON-LD: Product, LocalBusiness, etc.) en páginas relevantes.
- [ ] **Páginas dedicadas**: por ciudad (ej. `/rent-car-punta-cana`), por tipo de vehículo, por aeropuerto.
- [ ] **Blog** o sección de contenido (guías, rutas, consejos).
- [ ] **Motor de contenido SEO**: generación o plantillas para guías, FAQs, rutas (aunque sea estático al principio).

### 6. Seguridad
- [ ] **JWT** (o sesión) para API admin y, si aplica, para “Mi cuenta”.
- [ ] **Rate limiting** en API (especialmente en login, reservas, pagos).
- [ ] Buenas prácticas: no loguear datos sensibles, HTTPS en producción, variables de entorno para secretos.

### 7. Marketing y comunicaciones
- [ ] **Emails automáticos**: confirmación de reserva, recordatorio antes del viaje, post-renta (opcional).
- [ ] **WhatsApp**: notificación de reserva confirmada (API Business o similar).
- [ ] **Upsell**: oferta de extras o seguro en checkout (ya hay modelo Extra, falta UI y lógica).

### 8. Internacionalización
- [ ] **Idiomas**: español (actual), inglés, francés opcional (next-intl o similar).
- [ ] Rutas o dominio por idioma según requisito.

### 9. Infraestructura y rendimiento (opcional según fase)
- [ ] **PostgreSQL** en producción (hoy SQLite para desarrollo).
- [ ] **Redis** para caché o sesiones si se requiere.
- [ ] **ElasticSearch** (o búsqueda avanzada) si se quiere búsqueda por texto o muchos filtros.
- [ ] **Almacenamiento**: S3 (o compatible) para fotos en producción en lugar de `public/uploads`.
- [ ] **Docker** (y opcionalmente Kubernetes) para despliegue.
- [ ] **CDN** (ej. Cloudflare) y optimización de imágenes.
- [ ] **Core Web Vitals** y objetivo de carga &lt; 2 s.

### 10. Otros
- [ ] **Reviews**: modelo existe; falta UI para que el cliente deje valoración y mostrarla en detalle de vehículo.
- [ ] **Campo “seguro”** en Vehicle o en reserva si se quiere detallar por vehículo.

---

## Resumen ejecutivo

| Área              | Estado        | Prioridad típica para MVP |
|-------------------|---------------|----------------------------|
| Búsqueda básica   | Parcial       | Alta (fechas + disponibilidad) |
| Reservas          | Completo (extras, cancelar, contrato, Mis reservas) | Solo falta email confirmación |
| Pagos             | Solo simulado | Alta (Stripe o Azul primero) |
| Admin vehículos   | Completo      | — |
| Admin resto       | No            | Alta (reservas + auth) |
| SEO               | No            | Media (schema + páginas ciudad) |
| Auth              | No            | Alta (admin y/o cliente) |
| Email/WhatsApp    | No            | Media |
| i18n              | No            | Media (EN mínimo) |

Si quieres, el siguiente paso puede ser priorizar 2–3 ítems de esta lista (por ejemplo: **auth admin**, **búsqueda por fechas y disponibilidad**, **integración Stripe**) y bajar al detalle de implementación en cada uno.
