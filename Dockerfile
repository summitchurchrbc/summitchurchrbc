FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache nginx

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY cron/live-check.ts cron/live-check-loop.ts cron/live-check-schedule.ts cron/
COPY cron/sync-archive.ts cron/sync-archive-loop.ts cron/sync-archive-schedule.ts cron/
COPY cron/sync-schedule.json cron/
COPY content/youtube.json content/live-check-schedule.json content/

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY --from=builder /app/out /usr/share/nginx/html

ENV LIVE_STATUS_OUTPUT=/var/live-status/live-status.json
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]