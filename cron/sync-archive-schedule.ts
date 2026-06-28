import * as fs from "fs";
import * as path from "path";

const SCHEDULE_PATH = path.join(__dirname, "sync-schedule.json");

export interface SyncSchedule {
  trigger?: "on-live-end" | "schedule";
  followUpDelayMinutes?: number;
  enabled?: boolean;
  timezone?: string;
  day?: string;
  time?: string;
  windowMinutes?: number;
}

export function loadSyncSchedule(): SyncSchedule {
  return JSON.parse(fs.readFileSync(SCHEDULE_PATH, "utf8")) as SyncSchedule;
}

export function describeSyncSchedule(schedule: SyncSchedule): string {
  if (schedule.trigger === "on-live-end") {
    const delay = schedule.followUpDelayMinutes ?? 10;
    return `on-live-end (follow-up after ${delay} minutes)`;
  }

  const window = schedule.windowMinutes ?? 90;
  return `${schedule.timezone ?? "America/Chicago"}: ${schedule.day ?? "sunday"} ${schedule.time ?? "13:30"} for ${window} minutes`;
}

export function isArchiveSyncEnabled(schedule: SyncSchedule): boolean {
  return schedule.enabled !== false;
}