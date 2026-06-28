#!/bin/sh

mkdir -p /var/live-status
LIVE_STATUS_FILE=/var/live-status/live-status.json

if [ ! -f "$LIVE_STATUS_FILE" ]; then
  cp /usr/share/nginx/html/live-status.json "$LIVE_STATUS_FILE"
fi

# Serve dynamic status through the static site root
ln -sf "$LIVE_STATUS_FILE" /usr/share/nginx/html/live-status.json

# Restart live checker if it exits (e.g. hung scrape before timeout fix)
(
  while true; do
    LIVE_STATUS_OUTPUT="$LIVE_STATUS_FILE" npx tsx cron/live-check-loop.ts || true
    echo "Live checker exited — restarting in 5s..."
    sleep 5
  done
) &

sed -i "s/listen 80/listen ${PORT:-80}/" /etc/nginx/http.d/default.conf
exec nginx -g 'daemon off;'