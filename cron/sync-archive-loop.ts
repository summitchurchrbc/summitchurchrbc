/**
 * Background loop for syncing archived YouTube streams into services.json.
 */
import { runSyncArchive } from "./sync-archive";
import {
  describeSyncSchedule,
  isWithinSyncWindow,
  loadSyncSchedule,
  validateSyncSchedule,
} from "./sync-archive-schedule";

const ACTIVE_INTERVAL_MS = 15 * 60_000;
const IDLE_INTERVAL_MS = 5 * 60_000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const schedule = loadSyncSchedule();
  validateSyncSchedule(schedule);
  const outputPath = process.env.SERVICES_OUTPUT ?? "/var/live-status/services.json";

  console.log(`Archive sync schedule: ${describeSyncSchedule(schedule)}`);
  console.log(`Active polling: every ${ACTIVE_INTERVAL_MS / 1000}s`);
  console.log(`Outside schedule: every ${IDLE_INTERVAL_MS / 1000}s`);
  console.log(`Writing services to ${outputPath}`);

  while (true) {
    try {
      if (isWithinSyncWindow(schedule)) {
        console.log("Within archive sync window — fetching YouTube RSS...");
        await runSyncArchive();
        await sleep(ACTIVE_INTERVAL_MS);
      } else {
        console.log("Outside archive sync schedule — skipping.");
        await sleep(IDLE_INTERVAL_MS);
      }
    } catch (error) {
      console.error(error);
      await sleep(ACTIVE_INTERVAL_MS);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});