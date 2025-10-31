# BOA Search Engine — Runbook

This document explains how to build, run, and operate the BOA Search Engine stack with Docker. It covers environment setup, first‑run data initialization, service URLs, AI configuration (Ollama or Gemini), and troubleshooting.

## Stack Overview
- Backend: Laravel API (`php-fpm 8.2`) exposed internally on `backend:9000`.
- Database: MySQL 8, initialized from SQL files (`create-database.sql`, `create-tables.sql`, `seeders.sql`).
- Frontend Admin: React (Vite), served by Nginx.
- Frontend Public: React (Vite), served by Nginx.
- AI: Ollama service (HTTP API on `11434`) with auto model pull; optional Gemini.
- Web Gateway: Nginx reverse proxy routing:
  - `/api/*` → Laravel via FastCGI (`backend:9000`).
  - `/admin` → Admin UI.
  - `/` → Public UI.

## Prerequisites
- Docker and Docker Compose v2 installed and available in your shell.
  - On Windows, enable WSL2 integration in Docker Desktop.
  - On Linux, ensure your user can run `docker` (group membership may be required).
- Optional (GPU for Ollama): Install `nvidia-container-toolkit` and configure Docker to use NVIDIA runtime.

## Quick Start
1. Create a root `.env` file (at repository root):
   - Copy `.env.example` to `.env` and update values.
   - Important: Set `DB_DATABASE=boa_searchengine_clean` to match the seeded database name from `create-database.sql`.
   - Provide DB user and password (choose any, e.g., `boa_user` / `boa_password`).
   - Choose AI source:
     - `AI_SOURCE=ollama` (default for Docker) with `AI_URL=http://ollama:11434/api/chat` and desired `AI_MODEL`.
     - Or `AI_SOURCE=gemini` with `GEMINI_API_KEY` and `GEMINI_MODEL`.

   Example `.env`:
   ```env
   DB_DATABASE=boa_searchengine_clean
   DB_USERNAME=boa_user
   DB_PASSWORD=boa_password

   # AI configuration
   AI_SOURCE=ollama
   AI_MAX_DOCUMENTS=2
   AI_URL=http://ollama:11434/api/chat
   AI_MODEL=gpt-oss:20b-cloud
   AI_TIMEOUT=90

   # Gemini (only if AI_SOURCE=gemini)
   GEMINI_MODEL=gemini-2.5-flash-lite
   GEMINI_API_KEY=

   # Laravel app key (optional here; can be generated in-container)
   APP_KEY=
   ```

2. Build and start the stack:
   ```bash
   docker compose up --build -d
   ```

3. Access services:
   - Web gateway: `http://localhost`
     - Public UI: `http://localhost/`
     - Admin UI: `http://localhost/admin`
     - API:
       - Login: `POST http://localhost/api/login`
       - Logout: `POST http://localhost/api/logout`
       - API v1: `http://localhost/api/v1/...`
   - Ollama API (direct): `http://localhost:11434`

## First‑Run Data & Credentials
- The MySQL container runs the SQL init scripts on first creation of the data volume:
  - Creates database `boa_searchengine_clean`.
  - Creates all required tables.
  - Seeds users and basic metadata.
- Admin account (seeded):
  - Email: `admin@mail.com`
  - Password: `password`
- Additional user for notifications:
  - Email: `notifications@restricted.com`
  - Password: `passwordrestricted`

Note: Set `DB_DATABASE=boa_searchengine_clean` in your root `.env` so the backend connects to the seeded DB.

## Backend (Laravel) Operations
- Generate `APP_KEY` (recommended on first boot):
  ```bash
  docker compose exec backend php artisan key:generate
  ```
  The key is set within the container’s environment. For persistent configuration across runs, you can also set `APP_KEY` in the root `.env`.

- Optional cache warmups (not required):
  ```bash
  docker compose exec backend php artisan config:cache
  docker compose exec backend php artisan route:cache
  ```

## Frontends (React, Vite)
- API base URLs are baked at build time by Docker:
  - Admin: `VITE_API_BASE_URL=/api/v1`, `VITE_API_BASE_LOGIN_URL=/api`.
  - Public: `VITE_API_BASE_URL=/api/v1`.
- If you change API paths, rebuild the frontend containers:
  ```bash
  docker compose build frontend-admin frontend-public
  docker compose up -d
  ```

## AI Configuration
### Ollama (default)
- Service runs on `http://localhost:11434` and is reachable from backend at `http://ollama:11434`.
- On container start, the model specified by `AI_MODEL` is pulled automatically (example: `gpt-oss:20b-cloud`).
- To change the model:
  1. Update `AI_MODEL` in root `.env`.
  2. Restart Ollama or the whole stack:
     ```bash
     docker compose up -d --no-deps --build ollama
     ```

### Gemini (optional)
- Switch to Gemini by setting `AI_SOURCE=gemini` and providing `GEMINI_API_KEY` and `GEMINI_MODEL` in the root `.env`.
- The backend reads these via `backend/config/ai.php`.

## Service Map
- `web` (Nginx gateway): listens on `80`, routes `/api/*` via FastCGI to `backend:9000`, proxies `/admin` and `/` to frontend containers.
- `backend` (php-fpm 8.2): listens on `9000` internally.
- `database` (MySQL 8): listens on `3306` and initializes DB/tables/seeders on first run.
- `frontend-admin`: Nginx serving admin UI on container port `80` (exposed as `9080`).
- `frontend-public`: Nginx serving public UI on container port `80` (exposed as `9081`).
- `ollama`: Ollama API on `11434` (host and container).

## Validation & Smoke Tests
- Check container status:
  ```bash
  docker compose ps
  docker compose logs -f web backend database ollama
  ```

- API login test (admin):
  ```bash
  curl -X POST http://localhost/api/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"admin@mail.com","password":"password"}'
  ```

- Search test (API v1):
  ```bash
  curl http://localhost/api/v1/search/hello
  ```

- Ollama health:
  ```bash
  curl http://localhost:11434/api/tags
  ```

## Operations
- Start:
  ```bash
  docker compose up --build -d
  ```
- Stop:
  ```bash
  docker compose down
  ```
- Rebuild specific services:
  ```bash
  docker compose build backend frontend-admin frontend-public ollama
  docker compose up -d
  ```
- Reset database (CAUTION: destroys data):
  ```bash
  docker compose down -v
  docker volume rm boa-search-engine_db_data || true
  docker compose up --build -d
  ```

## Troubleshooting
- 502 on `/api/*`:
  - Ensure `backend` is up: `docker compose ps`.
  - Database health: `database` has a healthcheck; confirm it’s healthy.
  - `APP_KEY` missing can cause some Laravel issues; run `php artisan key:generate`.

- Frontend calls 404/500:
  - Verify API base URLs match `/api` and `/api/v1` (baked via Vite at build time). Rebuild frontends if changed.

- Ollama model missing:
  - Check `ollama` logs. If needed, pull manually:
    ```bash
    docker compose exec ollama ollama pull <model>
    ```

- Database name mismatch:
  - The init SQL seeds `boa_searchengine_clean`. Set `DB_DATABASE` accordingly in root `.env`.

## Project Structure (key files)
- `docker-compose.yml`: Orchestrates services and wiring.
- `nginx.conf` (root): Web gateway routing for `/api`, `/admin`, and `/`.
- `backend/Dockerfile`: PHP-FPM with required extensions.
- `frontend-admin/Dockerfile`, `frontend-public/Dockerfile`: Build and serve Vite apps with SPA configs.
- `database/*`: MySQL init scripts and Dockerfile.
- `backend/config/ai.php`: AI source, model, and timeouts.

---
For changes in environment or routing, update the root `.env` and rebuild affected services. If you encounter issues not covered here, capture logs with `docker compose logs -n 200 <service>` and share them with the team.