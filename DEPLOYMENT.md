# Deployment

This repo ships a containerized frontend + backend stack.

## Prerequisites

- A Linux host or VM with Docker + Docker Compose
- A domain pointing to your server (optional but recommended)
- Environment variables configured (see `.env.example`)

## Quick start (production-like)

```bash
# in repo root
cp .env.example .env

# edit values
nano .env

# start services
docker compose up -d --build

# check
docker compose ps
```

## Notes

- Run behind a reverse proxy (TLS termination) for real deployments.
- Keep secrets in `.env` (not committed). Rotate keys if exposed.
