#!/bin/sh
set -e

mkdir -p /var/live-status

if [ ! -f /var/live-status/live-status.json ]; then
  cp /usr/share/nginx/html/live-status.json /var/live-status/live-status.json
fi

# Background YouTube live checker (scrapes channel /live page)
LIVE_STATUS_OUTPUT=/var/live-status/live-status.json npx tsx cron/live-check-loop.ts &

sed -i "s/listen 80/listen ${PORT:-80}/" /etc/nginx/http.d/default.conf
exec nginx -g 'daemon off;'