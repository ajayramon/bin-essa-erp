# VPS deployment with Docker and Neon

This stack runs the Next.js frontend and NestJS API in Docker. PostgreSQL is hosted by Neon; no database container, PgBouncer container, Redis container, or Fly.io service is required.

## Requirements

- Ubuntu VPS with Docker Engine and the Docker Compose plugin
- A domain with an `A` record pointing to the VPS public IP
- TCP ports 80 and 443 open, plus UDP 443 for HTTP/3
- A Neon PostgreSQL project

## Neon connection strings

In the Neon dashboard, copy both connection strings:

- `DATABASE_URL`: pooled connection hostname, used by the running API
- `DIRECT_DATABASE_URL`: direct connection hostname, used by Prisma migrations

Keep `sslmode=require` in both URLs. Do not commit either value.

## First deployment

```bash
git clone https://github.com/ajayramon/bin-essa-erp.git
cd bin-essa-erp
cp .env.production.example .env
nano .env
docker compose build
docker compose up -d
docker compose ps
docker compose logs --tail=100 backend
```

The backend container runs `prisma migrate deploy` before starting NestJS. Caddy obtains the TLS certificate after DNS resolves and routes `/api/*` to NestJS while all other paths go to Next.js.

## Updates

```bash
git pull --ff-only origin main
docker compose build
docker compose up -d --remove-orphans
docker image prune -f
```

## Verification

```bash
curl https://YOUR_DOMAIN/health
curl -i https://YOUR_DOMAIN/api/inventory-categories
```

The category request should return `401 Unauthorized` without a token. That confirms routing and backend availability; authenticated application requests will return the category data.

## Vercel transition

The Docker stack can replace Vercel entirely. During a staged transition, keep the Vercel frontend and set its `BACKEND_API_URL` environment variable to `https://YOUR_DOMAIN`, then redeploy. Remove the variable after DNS is moved to the VPS-hosted full stack.