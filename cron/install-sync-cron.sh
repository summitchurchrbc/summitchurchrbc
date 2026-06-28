#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DEPLOY_DIR/.." && pwd)"
SCHEDULE_FILE="$DEPLOY_DIR/sync-schedule.json"
SYNC_SCRIPT="$DEPLOY_DIR/sync-and-deploy.sh"
MARKER="# summitchurch-youtube-sync"
LOG_FILE="${YOUTUBE_SYNC_LOG:-$DEPLOY_DIR/logs/youtube-sync.log}"

if [[ ! -f "$SCHEDULE_FILE" ]]; then
  echo "Missing schedule file: $SCHEDULE_FILE" >&2
  exit 1
fi

chmod +x "$SYNC_SCRIPT"

TRIGGER="$(node -e "const s=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')); console.log(s.trigger ?? 'schedule')" "$SCHEDULE_FILE")"
if [[ "$TRIGGER" == "on-live-end" ]]; then
  echo "Archive sync uses on-live-end trigger in the web container — no host crontab needed."
  exit 0
fi

SCHEDULE_JSON="$(node -e '
const fs = require("fs");
const schedule = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};
const day = String(schedule.day ?? "sunday").toLowerCase();
const time = String(schedule.time ?? "14:00");
const match = time.match(/^(\d{1,2}):(\d{2})$/);
if (!(day in days)) {
  console.error(`Invalid day "${schedule.day}" in sync-schedule.json`);
  process.exit(1);
}
if (!match) {
  console.error(`Invalid time "${schedule.time}" — use HH:MM (24-hour clock)`);
  process.exit(1);
}
const hour = Number(match[1]);
const minute = Number(match[2]);
if (hour > 23 || minute > 59) {
  console.error(`Invalid time "${schedule.time}"`);
  process.exit(1);
}
process.stdout.write(
  JSON.stringify({
    enabled: schedule.enabled !== false,
    timezone: schedule.timezone ?? "America/Chicago",
    cron: `${minute} ${hour} * * ${days[day]}`,
    day,
    time,
  }),
);
' "$SCHEDULE_FILE")"
ENABLED="$(node -e "console.log(JSON.parse(process.argv[1]).enabled)" "$SCHEDULE_JSON")"
TIMEZONE="$(node -e "console.log(JSON.parse(process.argv[1]).timezone)" "$SCHEDULE_JSON")"
CRON_EXPR="$(node -e "console.log(JSON.parse(process.argv[1]).cron)" "$SCHEDULE_JSON")"
DAY="$(node -e "console.log(JSON.parse(process.argv[1]).day)" "$SCHEDULE_JSON")"
TIME="$(node -e "console.log(JSON.parse(process.argv[1]).time)" "$SCHEDULE_JSON")"

CURRENT_CRON="$(crontab -l 2>/dev/null || true)"
FILTERED_CRON="$(printf '%s\n' "$CURRENT_CRON" | grep -v "$MARKER" | sed '/^[[:space:]]*$/d' || true)"

if [[ "$ENABLED" != "true" ]]; then
  if [[ -n "$FILTERED_CRON" ]]; then
    printf '%s\n' "$FILTERED_CRON" | crontab -
  else
    crontab -r 2>/dev/null || true
  fi
  echo "YouTube sync cron disabled (enabled=false in sync-schedule.json)."
  exit 0
fi

NEW_LINE="$CRON_EXPR $SYNC_SCRIPT >> $LOG_FILE 2>&1 $MARKER"
{
  if [[ -n "$FILTERED_CRON" ]]; then
    printf '%s\n' "$FILTERED_CRON"
  fi
  printf 'CRON_TZ=%s\n' "$TIMEZONE"
  printf '%s\n' "$NEW_LINE"
} | crontab -

echo "Installed YouTube sync cron:"
echo "  Schedule: ${DAY} at ${TIME} (${TIMEZONE})"
echo "  Cron: ${CRON_EXPR}"
echo "  Script: ${SYNC_SCRIPT}"
echo "  Log: ${LOG_FILE}"
echo ""
echo "To change the time later, edit cron/sync-schedule.json and run:"
echo "  bash cron/install-sync-cron.sh"