#!/bin/sh

mkdir -p /var/live-status
LIVE_STATUS_FILE=/var/live-status/live-status.json
SERVICES_FILE=/var/live-status/services.json

if [ ! -f "$LIVE_STATUS_FILE" ]; then
  cp /usr/share/nginx/html/live-status.json "$LIVE_STATUS_FILE"
fi

if [ ! -f "$SERVICES_FILE" ]; then
  cp /usr/share/nginx/html/services.json "$SERVICES_FILE"
fi

# Serve dynamic files through the static site root
ln -sf "$LIVE_STATUS_FILE" /usr/share/nginx/html/live-status.json
ln -sf "$SERVICES_FILE" /usr/share/nginx/html/services.json

# Refresh archived services on startup
SERVICES_OUTPUT="$SERVICES_FILE" npx tsx cron/sync-archive.ts || true

# Live checker also syncs the archive when a stream ends
(
  while true; do
    LIVE_STATUS_OUTPUT="$LIVE_STATUS_FILE" SERVICES_OUTPUT="$SERVICES_FILE" npx tsx cron/live-check-loop.ts || true
    echo "Live checker exited — restarting in 5s..."
    sleep 5
  done
) &

sed -i "s/listen 80/listen ${PORT:-80}/" /etc/nginx/http.d/default.conf
exec nginx -g 'daemon off;'