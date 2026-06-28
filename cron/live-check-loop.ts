/**
 * Background loop for Docker live-checker service.
 * Checks YouTube only during configured schedule windows.
 */
import * as fs from "fs";
import * as path from "path";
import { runLiveCheck, writeOfflineStatus } from "./live-check";
import {
  describeSchedule,
  isWithinCheckWindow,
  loadSchedule,
  validateSchedule,
} from "./live-check-schedule";

const ACTIVE_INTERVAL_MS = 60_000;
const IDLE_INTERVAL_MS = 300_000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const schedule = loadSchedule();
  validateSchedule(schedule);
  const outputPath = process.env.LIVE_STATUS_OUTPUT ?? "/var/live-status/live-status.json";

  console.log(`Live checker schedule: ${describeSchedule(schedule)}`);
  console.log(`Active polling: every ${ACTIVE_INTERVAL_MS / 1000}s`);
  console.log(`Outside schedule: every ${IDLE_INTERVAL_MS / 1000}s (writes not live)`);
  console.log(`Writing live status to ${outputPath}`);

  if (!fs.existsSync(outputPath)) {
    console.log("Live status file missing — seeding before first check.");
    await writeOfflineStatus({ scheduledCheck: false });
  }

  while (true) {
    const { active, window } = isWithinCheckWindow(schedule);

    try {
      if (active) {
        const label = window?.label ?? "scheduled window";
        console.log(`Within check window: ${label}`);
        await runLiveCheck();
        await sleep(ACTIVE_INTERVAL_MS);
      } else {
        console.log("Outside check schedule — skipping YouTube check.");
        await writeOfflineStatus({ scheduledCheck: false });
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