import * as fs from "fs";
import * as path from "path";

const SCHEDULE_PATH = path.join(__dirname, "..", "content", "live-check-schedule.json");

export interface CheckWindow {
  label?: string;
  days: string[];
  start: string;
  end: string;
}

export interface LiveCheckSchedule {
  timezone: string;
  windows: CheckWindow[];
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

export function loadSchedule(): LiveCheckSchedule {
  return JSON.parse(fs.readFileSync(SCHEDULE_PATH, "utf8")) as LiveCheckSchedule;
}

function parseTimeToMinutes(value: string): number {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid time "${value}" — use HH:MM (e.g. "08:00")`);
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

export function isWithinCheckWindow(
  schedule: LiveCheckSchedule,
  date = new Date()
): { active: boolean; window?: CheckWindow } {
  const { weekday, minutes } = getLocalParts(date, schedule.timezone);

  for (const window of schedule.windows) {
    const days = window.days.map((day) => day.toLowerCase());
    if (!days.includes(weekday)) continue;

    const start = parseTimeToMinutes(window.start);
    const end = parseTimeToMinutes(window.end);

    if (minutes >= start && minutes < end) {
      return { active: true, window };
    }
  }

  return { active: false };
}

export function describeSchedule(schedule: LiveCheckSchedule): string {
  const windows = schedule.windows
    .map((window) => {
      const days = window.days.join(", ");
      const label = window.label ? ` (${window.label})` : "";
      return `${days} ${window.start}-${window.end}${label}`;
    })
    .join("; ");

  return `${schedule.timezone}: ${windows}`;
}

export function validateSchedule(schedule: LiveCheckSchedule) {
  if (!schedule.timezone) {
    throw new Error("live-check-schedule.json requires a timezone");
  }

  if (!schedule.windows?.length) {
    throw new Error("live-check-schedule.json requires at least one window");
  }

  for (const window of schedule.windows) {
    if (!window.days?.length) {
      throw new Error("Each window requires at least one day");
    }

    for (const day of window.days) {
      if (!DAY_NAMES.includes(day.toLowerCase() as (typeof DAY_NAMES)[number])) {
        throw new Error(`Invalid day "${day}" — use lowercase day names like "sunday"`);
      }
    }

    parseTimeToMinutes(window.start);
    parseTimeToMinutes(window.end);
  }
}