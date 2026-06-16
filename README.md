# Summit Church Website

Modern Next.js rebuild of [summitchurchrbc.com](https://www.summitchurchrbc.com) — statically generated, Tailwind CSS, YouTube sermon embeds, and file-based content management.

## Quick Start (local dev)

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
```

Copy environment variables before running cron jobs or Docker:

```bash
cp .env.example .env
```

## Local Docker

Runs the static site (nginx) and the YouTube live-checker sidecar:

```bash
cp .env.example .env   # add YOUTUBE_API_KEY if desired
docker compose up -d --build
```

- Site: http://localhost:8080
- Live status endpoint: http://localhost:8080/live-status.json

The `web` and `live-checker` services share a Docker volume so live status updates appear on the site without rebuilding.

## Railway Deployment

Deploy as a Railway project with three components:

| Component | Dockerfile | Purpose |
|-----------|------------|---------|
| **Web** | `Dockerfile` | Serves the static export via nginx |
| **Live-checker** | `Dockerfile.live-checker` | Polls YouTube for live streams |
| **Archive sync** | Railway Cron Job | Syncs archived videos from YouTube RSS |

### Web service

1. Connect this repo to Railway.
2. Use the root `Dockerfile` (default).
3. Mount a shared volume at `/var/live-status` (read-only).

### Live-checker service

1. Add a second service from the same repo.
2. Set `RAILWAY_DOCKERFILE_PATH=Dockerfile.live-checker`.
3. Set `YOUTUBE_API_KEY` in service variables (recommended).
4. Mount the same volume at `/var/live-status` (read-write).

### Archive sync cron

Create a Railway Cron Job that runs:

```bash
npm run sync:youtube
```

on the schedule defined in `cron/sync-schedule.json` (default: Sundays at 12:45 CT).

After sync, `content/services.json` and `content/youtube.json` are updated. Trigger a web service redeploy (git push, Railway redeploy API, or `npm run deploy:sync` on a host with Docker).

## Cron Jobs

### Live detection (`cron/live-check.ts`, `cron/live-check-loop.ts`)

| Setting | Location | Default |
|---------|----------|---------|
| Schedule windows | `content/live-check-schedule.json` | Sundays 08:00–13:00 CT |
| Poll interval (in-window) | `cron/live-check-loop.ts` | Every 60 seconds |
| Poll interval (outside window) | `cron/live-check-loop.ts` | Every 5 minutes |

Checks whether the Summit Church YouTube channel is live (API preferred, HTML scrape as fallback). Writes `live-status.json` so the site can show a live badge and embed. In Docker, the file is served from a shared volume at `/var/live-status/live-status.json`.

```bash
npm run check:youtube-live          # one-shot check
npm run check:youtube-live:loop     # continuous loop (used by Dockerfile.live-checker)
```

### Archive sync (`cron/sync-archive.ts`)

| Setting | Location | Default |
|---------|----------|---------|
| Schedule | `cron/sync-schedule.json` | Sundays at 12:45 CT |

Fetches the YouTube channel RSS feed, categorizes Sunday Service and Sunday School videos, and updates `content/services.json` and `content/youtube.json`.

```bash
npm run sync:youtube                              # sync only
npm run deploy:sync                               # sync + build + restart Docker web service
npm run cron:install-youtube-sync                 # install host crontab (local servers)
```

## Content Migration (one-time from WordPress)

```bash
npm run migrate
```

Scrapes sermons, gallery images, and brand assets from the live WordPress site into `content/` and `public/images/`.

## Content Management

| Content | File |
|---------|------|
| Site settings | `content/site.json` |
| Sermons | `content/services.json` |
| Team | `content/team.json` |
| Gallery | `content/gallery.json` |
| Hero slider | `content/hero.json` |
| YouTube channel | `content/youtube.json` |
| Live check schedule | `content/live-check-schedule.json` |

Staff can edit content at `/admin` (Decap CMS) once Git Gateway is configured on the production host.

## Before Going Live

- [ ] Replace Formspree URL in `components/ContactForm.tsx`
- [ ] Set `YOUTUBE_API_KEY` on the live-checker service
- [ ] Configure Decap CMS Git Gateway on production host
- [ ] Point DNS to Railway (or your hosting provider)
- [ ] Decommission WordPress hosting