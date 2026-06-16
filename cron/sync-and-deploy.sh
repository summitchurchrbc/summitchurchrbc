#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$DEPLOY_DIR/logs"
LOG_TAG="summitchurch-youtube-sync"

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date -Iseconds)] [$LOG_TAG] $*"
}

log "Starting YouTube sync and deploy from $ROOT"

cd "$ROOT"

log "Syncing sermons from YouTube RSS..."
npm run sync:youtube

log "Building static site..."
npm run build

log "Rebuilding and restarting web container..."
cd "$ROOT"
docker compose up -d --build web

log "Finished successfully."