# AeOn4.AI — Secure, AI-Enabled Spaces and Production

Marketing site for AeOn4.AI, pitching three AI-native copilots — **Security**, **Building Management (BMS)**, and **Production IoT** — for OT security, building management, and production environments across the GCC and Africa.

The app is a two-tier system: a [Next.js](https://nextjs.org) frontend and a [NestJS](https://nestjs.com) backend, backed by SQLite via [Prisma](https://www.prisma.io).

**Author:** Job Mathenge
**Website:** [aeon4.ai](https://aeon4.ai)

---

## Architecture

```
AEON4_Webpage/
  frontend/   Next.js 16 (App Router) — the public site
  backend/    NestJS — content API + lead capture
  docker-compose.yml   orchestrates both containers for `docker compose up`
  aeon4-website.html   original single-file static prototype (kept for reference)
```

Two independent apps, each with its own `package.json`/lockfile — no monorepo tooling. The root `package.json` only exists to run both together in dev via `concurrently`.

### Backend (`backend/`)

NestJS + Prisma + SQLite. Serves two things:

1. **Content API** — the marketing copy (stats, copilot cards, Q&A pairs, simulated live ticker events) as cached REST endpoints, so copy can be edited (via `npx prisma studio` or a future admin UI) without redeploying the frontend.
2. **Lead capture** — the "Request a pilot" contact form: validated, rate-limited, honeypot-protected, persisted to SQLite, with an email notification on submission.

| Method | Path                    | Notes |
|---|---|---|
| GET | `/api/content/stats` | 4 stat tiles, cached 1h |
| GET | `/api/content/copilots` | The 3 copilot records (card + hero copy), cached 1h |
| GET | `/api/content/qa` | All Q&A pairs grouped by topic, cached 1h |
| GET | `/api/content/qa/:topic` | Single-topic Q&A (`security`/`bms`/`iot`), cached 1h |
| GET | `/api/content/ticker` | Simulated live event pool, cached 5m |
| POST | `/api/leads` | Create a pilot-request lead (rate-limited 5/min) |
| GET | `/api/leads` | List leads — requires `x-api-key` header |

Caching is in-memory (`@nestjs/cache-manager`, no Redis), with `Cache-Control` headers set for any CDN in front. Rate limiting via `@nestjs/throttler`.

### Frontend (`frontend/`)

Next.js App Router. Fetches content from the backend server-side (`fetch` with `next.revalidate`/`tags`) and renders it through componentized pieces that faithfully reproduce the original static page's animations: the radial hub with scene crossfades, the live event ticker, the typewriter "ask the copilot" terminal, card hover-sheen, scroll reveals, and the compact-on-scroll nav.

The contact form posts to a same-origin Next.js route handler (`app/api/leads/route.ts`) which proxies to the backend — the real backend URL is never exposed to the browser.

Fonts are self-hosted via `next/font/google`, the two Unsplash photos use `next/image`, and the heavy inline hero SVGs were extracted to `public/scenes/*.svg`.

---

## Getting started

**Prerequisites:** Node.js 20+, npm.

```bash
# 1. install dependencies for both apps
npm run install:all

# 2. configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. set up the database
cd backend
npx prisma migrate dev --name init
npx prisma db seed
cd ..

# 4. run both apps
npm run dev
```

- Frontend: [http://localhost:3100](http://localhost:3100)
- Backend: [http://localhost:4000](http://localhost:4000)

Run them separately if you prefer:

```bash
npm run start:dev --prefix backend   # NestJS, :4000
npm run dev --prefix frontend        # Next.js, :3100
```

### Running with Docker

No local Node.js install needed — just Docker.

```bash
docker compose up -d --build
```

This builds both images and starts them on the same ports as above (`:3100` frontend, `:4000` backend). The backend container automatically runs `prisma migrate deploy` on boot, and seeds the content tables on first boot only (checked against a persistent named volume, `backend_data`, mounted at `/data` — so re-seeding never clobbers edits made later via `prisma studio`).

Useful commands:

```bash
docker compose logs -f              # tail both services' logs
docker compose down                 # stop and remove containers (keeps the data volume)
docker compose down -v               # also wipe the database volume
```

Override any backend env var (SMTP creds, `ADMIN_API_KEY`, `CORS_ORIGIN`, etc.) by exporting it before `docker compose up` or adding it to a `.env` file at the repo root — `docker-compose.yml` reads from the shell/`.env` for all the optional values.

#### Pulling the published images

Both images are published on Docker Hub, so any machine with Docker can run the app without cloning the source or building anything:

- [`jobmathenge/aeon4_webpage-backend`](https://hub.docker.com/r/jobmathenge/aeon4_webpage-backend)
- [`jobmathenge/aeon4_webpage-frontend`](https://hub.docker.com/r/jobmathenge/aeon4_webpage-frontend)

```bash
docker compose pull   # fetch the published images instead of building locally
docker compose up -d
```

`docker-compose.yml` declares both `image:` (the Docker Hub tag) and `build:` (the local Dockerfile) — `docker compose up --build` always rebuilds and retags locally as `jobmathenge/aeon4_webpage-*:latest`, ready to `docker push` again after a change.

### Environment variables

**`backend/.env`**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite file path (default `file:./dev.db`) |
| `PORT` | Backend port (default `4000`) |
| `CORS_ORIGIN` | Allowed origin for the frontend |
| `SMTP_*` | Real mail transport for lead notifications. If `SMTP_HOST` is omitted, the backend auto-provisions a disposable [Ethereal](https://ethereal.email) test inbox instead — emails still actually send (over real SMTP), and a preview link is logged per message, but nothing reaches a real mailbox. Set all four (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) to send to a real address. |
| `LEADS_NOTIFY_TO` | Address that receives new-lead notifications (default `info@aeon4.ai`) |
| `ADMIN_API_KEY` | Key required to call `GET /api/leads` |

#### Sending real emails

For Gmail/Google Workspace: enable 2-Step Verification on the sending account, generate an [App Password](https://myaccount.google.com/apppasswords), then set:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-address@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="AeOn4.AI <your-address@gmail.com>"
```

Gmail requires `SMTP_FROM` to match the authenticated account (or a verified "Send As" alias), or it will reject/rewrite the message. For production, a transactional provider (Resend, SendGrid, Postmark, Mailgun, SES) is more reliable than Gmail SMTP and avoids per-account sending limits.

**`frontend/.env.local`**

| Variable | Purpose |
|---|---|
| `API_URL` | Backend base URL, read server-side only |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |

### Inspecting/editing data

```bash
cd backend
npx prisma studio   # browse/edit stats, copilots, Q&A, ticker events, and leads
```

---

## Useful scripts

| Location | Script | Does |
|---|---|---|
| root | `npm run dev` | Runs backend + frontend together |
| root | `npm run install:all` | Installs deps for both apps |
| `backend/` | `npm run start:dev` | NestJS in watch mode |
| `backend/` | `npm run build` | Compiles NestJS to `dist/` |
| `backend/` | `npx prisma migrate dev` | Applies schema migrations |
| `backend/` | `npx prisma db seed` | (Re-)seeds content tables |
| `frontend/` | `npm run dev` | Next.js dev server |
| `frontend/` | `npm run build` | Production build |
| `frontend/` | `npm run lint` | ESLint |

## Deployment notes

- SQLite is a single file (`backend/prisma/dev.db`) — no external database service required, but consider Postgres if this ever needs multiple backend instances.
- The in-memory cache is per-process; if you scale the backend horizontally, cached responses won't be shared across instances (fine for a low-traffic marketing site; move to a shared store like Redis if that changes).
- Set real `SMTP_*` credentials in production so lead notifications actually send.
