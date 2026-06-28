import { runSyncArchive } from "./sync-archive";
import { isArchiveSyncEnabled, loadSyncSchedule } from "./sync-archive-schedule";
import type { LiveStatus } from "./live-check";

let followUpTimer: ReturnType<typeof setTimeout> | null = null;

export async function syncArchiveOnLiveEnd(previous: LiveStatus | null, current: LiveStatus) {
  const schedule = loadSyncSchedule();

  if (!isArchiveSyncEnabled(schedule) || schedule.trigger !== "on-live-end") {
    return;
  }

  if (!previous?.isLive || current.isLive) {
    return;
  }

  const label = previous.title ?? previous.videoId ?? "stream";
  console.log(`Live stream ended (${label}) — syncing YouTube archive...`);

  try {
    await runSyncArchive();
  } catch (error) {
    console.error("Archive sync failed after live end:", error);
  }

  if (followUpTimer) {
    clearTimeout(followUpTimer);
  }

  const delayMinutes = schedule.followUpDelayMinutes ?? 10;
  followUpTimer = setTimeout(() => {
    console.log(`Follow-up archive sync ${delayMinutes} minutes after live end...`);
    runSyncArchive().catch((error) => {
      console.error("Follow-up archive sync failed:", error);
    });
  }, delayMinutes * 60_000);
}