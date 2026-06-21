/**
 * Sync Sunday Service / Sunday School streams from YouTube channel RSS.
 * Usage: npm run sync:youtube (cron/sync-archive.ts)
 */
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const CHANNEL_ID = "UChVlFzfrZeipjVGyaa99JAg";
const CHANNEL_HANDLE = "@summitchurch8578";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CONTENT = path.join(__dirname, "..", "content");

function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "SummitChurchSync/1.0" } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetch(res.headers.location).then(resolve).catch(reject);
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function slugify(title: string, videoId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || videoId;
}

function categorize(title: string): "sunday-service" | "sunday-school" | "other" {
  const lower = title.toLowerCase();
  if (lower.includes("sunday school") || lower.includes("sunday-school")) {
    return "sunday-school";
  }
  if (lower.includes("sunday service") || lower.includes("worship")) {
    return "sunday-service";
  }
  return "other";
}

interface ParsedVideo {
  id: string;
  title: string;
  slug: string;
  date: string;
  publishedAt: string;
  youtubeId: string;
  youtubeUrl: string;
  category: "sunday-service" | "sunday-school" | "other";
}

function parseRss(xml: string): ParsedVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const videos: ParsedVideo[] = [];
  for (const entry of entries) {
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1];
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!videoId || !title || !published) continue;
    const decodedTitle = decodeXml(title);
    const category = categorize(decodedTitle);
    const date = published.slice(0, 10);
    videos.push({
      id: videoId,
      title: decodedTitle,
      slug: slugify(decodedTitle, videoId),
      date,
      publishedAt: published,
      youtubeId: videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      category,
    });
  }
  return videos;
}

async function main() {
  console.log("Fetching YouTube RSS...");
  const xml = await fetch(RSS_URL);
  const videos = parseRss(xml);
  const services = videos.filter((v) => v.category === "sunday-service");
  const sundaySchool = videos.filter((v) => v.category === "sunday-school");
  console.log(` ${videos.length} total videos`);
  console.log(` ${services.length} Sunday Service`);
  console.log(` ${sundaySchool.length} Sunday School`);

  const sermons = videos.map((video, index) => ({
    id: index + 1,
    title: video.title,
    slug: video.slug,
    date: video.date,
    publishedAt: video.publishedAt,
    youtubeId: video.youtubeId,
    youtubeUrl: video.youtubeUrl,
    category: video.category,
  }));

  // Write to content folder (build-time)
  fs.writeFileSync(
    path.join(CONTENT, "services.json"),
    JSON.stringify({ sermons }, null, 2) + "\n"
  );

  fs.writeFileSync(
    path.join(CONTENT, "youtube.json"),
    JSON.stringify(
      {
        channelId: CHANNEL_ID,
        channelHandle: CHANNEL_HANDLE,
        channelUrl: `https://www.youtube.com/${CHANNEL_HANDLE}`,
        liveUrl: `https://www.youtube.com/${CHANNEL_HANDLE}/live`,
        streamsUrl: `https://www.youtube.com/${CHANNEL_HANDLE}/streams`,
      },
      null,
      2
    ) + "\n"
  );

  // Also write to public folder for dynamic updates
  const publicDir = "/usr/share/nginx/html";
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(
      path.join(publicDir, "services.json"),
      JSON.stringify({ sermons }, null, 2) + "\n"
    );
  }

  console.log("Wrote content/services.json and content/youtube.json + public copies");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
