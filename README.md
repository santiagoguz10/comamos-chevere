# Comamos Chévere 🍔🍕

App web (responsive) para restaurante "Comamos Chévere" con dos módulos:
- **Cliente**: registro/login, menú con toppings, carrito, dirección de entrega, tipo de entrega, envío de pedido, seguimiento/confirmación.
- **Administrador**: visualización de pedidos entrantes con productos y toppings, aprobación/notificación al cliente y control de estados.

Stack: Next.js 14 + Prisma + PostgreSQL, desplegado con Docker. Colores: negro, amarillo y rojo.

## Requisitos
- Docker Desktop (macOS): https://www.docker.com/products/docker-desktop/

## Probar en local (Mac)
```bash
cd comamos-chevere
docker compose up --build
```
Abrir: http://localhost:3000

### Usuarios demo
- Admin: `admin@comamoschevere.local` / `admin123`
- Cliente: `cliente@comamoschevere.local` / `cliente123`

También puedes registrar nuevos clientes desde la app.

## Variables de entorno
- `DATABASE_URL` (ej. `file:/data/comamos.db` en Docker; `file:./prisma/dev.db` en dev)
- `SESSION_SECRET` (cambiar en producción)
- `NODE_ENV` (`production` en Docker)

## Subir / desplegar
Esta app incluye `Dockerfile`, por lo que puedes desplegarla en cualquier plataforma que soporte Docker:
- Render: New Web Service → Docker. Configura env vars y un disco persistente para `/data`.
- Fly.io: `fly launch` (detecta el Dockerfile), configura volumen para `/data`.
- Railway: Deploy from repo (Dockerfile), agrega volumen para `/data`.

### Nota sobre datos
SQLite guarda la base en `/data/comamos.db`. Para no perder datos en redeploy, monta un volumen persistente en `/data`.
Para mayor escala en producción, cambia el `provider` de Prisma a `postgresql` y apunta `DATABASE_URL` a una base gestionada (Postgres).

## Estructura
- `app/` páginas y API routes (Next.js App Router)
- `components/` UI (carrito)
- `lib/` Prisma y autenticación
- `prisma/` schema y seed
- `Dockerfile`, `docker-compose.yml`

## Funcionalidades incluidas
- Login/registro por roles (cliente/admin)
- Menú con hamburguesas, pizzas, choriperros
- Toppings por producto con precio extra
- Carrito con cantidades y total
- Checkout: domicilio o recogida en tienda, dirección
- API para crear pedidos y consultarlos
- Panel admin: pedidos entrantes, detalle productos/toppings, aprobar/notificar y avanzar estados
- Polling para que el cliente vea la confirmación
- Seed inicial con datos demo
```