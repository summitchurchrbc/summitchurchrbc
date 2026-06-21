/**
 * Check whether the Summit Church YouTube channel is live.
 * Writes public/live-status.json for the static site to poll.
 *
 * Usage: npm run check:youtube-live  (cron/live-check.ts)
 * Env:   YOUTUBE_API_KEY (optional, preferred) | LIVE_STATUS_OUTPUT (optional path)
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
    https
      .get(url, { headers: { "User-Agent": "SummitChurchLiveCheck/1.0" } }, (res) => {
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
      })
      .on("error", reject);
  });
}

function readChannelId(): string {
  const youtube = JSON.parse(fs.readFileSync(path.join(CONTENT, "youtube.json"), "utf8")) as {
    channelId: string;
    liveUrl: string;
  };
  return youtube.channelId;
}

function readLiveUrl(): string {
  const youtube = JSON.parse(fs.readFileSync(path.join(CONTENT, "youtube.json"), "utf8")) as {
    liveUrl: string;
  };
  return youtube.liveUrl;
}

async function checkViaApi(channelId: string, apiKey: string): Promise<LiveStatus | null> {
  const url =
    `https://www.googleapis.com/youtube/v3/search?part=snippet` +
    `&channelId=${encodeURIComponent(channelId)}` +
    `&eventType=live&type=video&maxResults=1&key=${encodeURIComponent(apiKey)}`;

  const body = await fetchText(url);
  const data = JSON.parse(body) as {
    items?: Array<{
      id: { videoId: string };
      snippet: { title: string };
    }>;
    error?: { message: string };
  };

  if (data.error) {
    console.warn(`YouTube API error: ${data.error.message}`);
    return null;
  }

  const item = data.items?.[0];
  if (!item) {
    return { isLive: false, checkedAt: new Date().toISOString(), scheduledCheck: true };
  }

  return {
    isLive: true,
    videoId: item.id.videoId,
    title: item.snippet.title,
    checkedAt: new Date().toISOString(),
    scheduledCheck: true,
  };
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
  const channelId = readChannelId();
  const liveUrl = readLiveUrl();
  const apiKey = process.env.YOUTUBE_API_KEY;

  let status: LiveStatus;

  if (apiKey) {
    const apiResult = await checkViaApi(channelId, apiKey);
    status = apiResult ?? (await checkViaScrape(liveUrl));
  } else {
    console.log("YOUTUBE_API_KEY not set — using channel /live page scrape.");
    status = await checkViaScrape(liveUrl);
  }

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
