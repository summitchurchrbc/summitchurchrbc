import type { LiveStatus } from "@/lib/types";

/** Live badge hidden if status file hasn't been refreshed within this window. */
export const LIVE_STATUS_STALE_MS = 3 * 60 * 1000;

export function normalizeLiveStatus(status: LiveStatus): LiveStatus {
  if (!status.isLive) return status;

  const checkedAt = new Date(status.checkedAt).getTime();
  if (Number.isNaN(checkedAt) || Date.now() - checkedAt > LIVE_STATUS_STALE_MS) {
    return { ...status, isLive: false };
  }

  return status;
}

export function isLiveNow(status: LiveStatus | null | undefined): boolean {
  if (!status) return false;
  return normalizeLiveStatus(status).isLive;
}