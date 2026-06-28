import * as fs from "fs";
import * as path from "path";

const SCHEDULE_PATH = path.join(__dirname, "sync-schedule.json");

export interface SyncSchedule {
  timezone: string;
  day: string;
  time: string;
  windowMinutes?: number;
  enabled?: boolean;
}

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function loadSyncSchedule(): SyncSchedule {
  return JSON.parse(fs.readFileSync(SCHEDULE_PATH, "utf8")) as SyncSchedule;
}

function parseTimeToMinutes(value: string): number {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid time "${value}" — use HH:MM (e.g. "13:30")`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid time "${value}" — hour must be 0-23 and minute 0-59`);
  }

  return hours * 60 + minutes;
}

function getLocalParts(date: Date, timeZone: string) {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "long" })
    .format(date)
    .toLowerCase();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return { weekday, minutes: hour * 60 + minute };
}

export function isWithinSyncWindow(
  schedule: SyncSchedule,
  date = new Date()
): boolean {
  if (schedule.enabled === false) return false;

  const { weekday, minutes } = getLocalParts(date, schedule.timezone);
  if (weekday !== schedule.day.toLowerCase()) return false;

  const start = parseTimeToMinutes(schedule.time);
  const end = start + (schedule.windowMinutes ?? 90);

  return minutes >= start && minutes < end;
}

export function describeSyncSchedule(schedule: SyncSchedule): string {
  const window = schedule.windowMinutes ?? 90;
  return `${schedule.timezone}: ${schedule.day} ${schedule.time} for ${window} minutes`;
}

export function validateSyncSchedule(schedule: SyncSchedule) {
  if (!schedule.timezone) {
    throw new Error("sync-schedule.json requires a timezone");
  }

  if (!DAY_NAMES.includes(schedule.day.toLowerCase() as (typeof DAY_NAMES)[number])) {
    throw new Error(`Invalid day "${schedule.day}" — use lowercase day names like "sunday"`);
  }

  parseTimeToMinutes(schedule.time);
}