/**
 * Check whether the Summit Church YouTube channel is live.
 * Writes public/live-status.json for the static site to poll.
 *
 * Usage: npm run check:youtube-live  (cron/live-check.ts)
 * Env:   LIVE_STATUS_OUTPUT (optional path)
 */
import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import {
  describeSchedule,
  isWithinCheckWindow,
  loadSchedule,
  validateSchedule,
} from "./live-check-schedule";

const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const DEFAULT_OUTPUT = "/usr/share/nginx/html/live-status.json";
const FETCH_TIMEOUT_MS = 15_000;

export interface LiveStatus {
  isLive: boolean;
  videoId?: string;
  title?: string;
  checkedAt: string;
  scheduledCheck?: boolean;
}

function getOutputPath(): string {
  return process.env.LIVE_STATUS_OUTPUT ?? DEFAULT_OUTPUT;
}

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      { headers: { "User-Agent": "SummitChurchLiveCheck/1.0" }, timeout: FETCH_TIMEOUT_MS },
      (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          fetchText(next).then(resolve).catch(reject);
          return;
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );

    request.on("timeout", () => {
      request.destroy();
      reject(new Error(`Request timed out after ${FETCH_TIMEOUT_MS}ms: ${url}`));
    });
    request.on("error", reject);
  });
}

function readLiveUrl(): string {
  const youtube = JSON.parse(fs.readFileSync(path.join(CONTENT, "youtube.json"), "utf8")) as {
    liveUrl: string;
  };
  return youtube.liveUrl;
}

function parseLiveFromHtml(html: string): LiveStatus {
  const isLive =
    /"isLive"\s*:\s*true/.test(html) ||
    /"isLiveNow"\s*:\s*true/.test(html) ||
    /"style"\s*:\s*"BADGE_STYLE_TYPE_LIVE_NOW"/.test(html);

  if (!isLive) {
    return { isLive: false, checkedAt: new Date().toISOString(), scheduledCheck: true };
  }

  const videoId =
    html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/)?.[1] ??
    html.match(/watch\?v=([a-zA-Z0-9_-]{11})/)?.[1];

  const title =
    html.match(/"title":\{"(?:simpleText|runs)":"([^"]{1,200})"/)?.[1] ??
    html.match(/"text":"([^"]{1,200})"\}\],"accessibility"/)?.[1];

  return {
    isLive: true,
    videoId,
    title,
    checkedAt: new Date().toISOString(),
    scheduledCheck: true,
  };
}

async function checkViaScrape(liveUrl: string): Promise<LiveStatus> {
  const html = await fetchText(liveUrl);
  return parseLiveFromHtml(html);
}

export function writeLiveStatus(status: LiveStatus) {
  const output = getOutputPath();
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(status, null, 2) + "\n");
}

export async function writeOfflineStatus(
  extra: Partial<Pick<LiveStatus, "scheduledCheck">> = {}
) {
  const status: LiveStatus = {
    isLive: false,
    checkedAt: new Date().toISOString(),
    ...extra,
  };
  writeLiveStatus(status);
  console.log("Wrote not-live status.");
  console.log(`Wrote ${getOutputPath()}`);
  return status;
}

export async function runLiveCheck(): Promise<LiveStatus> {
  const liveUrl = readLiveUrl();

  console.log("Checking live status via channel /live page scrape.");
  const status = await checkViaScrape(liveUrl);

  writeLiveStatus(status);

  console.log(
    status.isLive
      ? `LIVE: ${status.title ?? status.videoId ?? "stream active"}`
      : "Not live."
  );
  console.log(`Wrote ${getOutputPath()}`);

  return status;
}

async function main() {
  const schedule = loadSchedule();
  validateSchedule(schedule);
  const { active, window } = isWithinCheckWindow(schedule);

  if (!active) {
    console.log(`Outside check schedule (${describeSchedule(schedule)}).`);
    await writeOfflineStatus({ scheduledCheck: false });
    return;
  }

  const label = window?.label ?? "scheduled window";
  console.log(`Within check window: ${label}`);
  await runLiveCheck();
}

const isDirectRun = process.argv[1]?.includes("live-check");

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
