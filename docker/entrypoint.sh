#!/bin/sh

mkdir -p /var/live-status

if [ ! -f /var/live-status/live-status.json ]; then
  cp /usr/share/nginx/html/live-status.json /var/live-status/live-status.json
fi

# Restart live checker if it exits (e.g. hung scrape before timeout fix)
(
  while true; do
    LIVE_STATUS_OUTPUT=/var/live-status/live-status.json npx tsx cron/live-check-loop.ts || true
    echo "Live checker exited — restarting in 5s..."
    sleep 5
  done
) &

sed -i "s/listen 80/listen ${PORT:-80}/" /etc/nginx/http.d/default.conf
exec nginx -g 'daemon off;'