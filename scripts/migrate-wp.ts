/**
 * One-time migration script: scrapes content from summitchurchrbc.com WordPress site.
 * Usage: npm run migrate
 */
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const BASE = "https://www.summitchurchrbc.com";
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const CONTENT = path.join(ROOT, "content");

function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0 SummitChurchMigrate/1.0" }, rejectUnauthorized: false },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : `${BASE}${res.headers.location}`;
          fetch(next).then(resolve).catch(reject);
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.setTimeout(30000, () => req.destroy(new Error(`Timeout: ${url}`)));
  });
}

async function downloadFile(url: string, dest: string): Promise<void> {
  const dir = path.dirname(dest);
  fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(dest)) return;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { rejectUnauthorized: false }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
          downloadFile(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

function normalizeImageUrl(url: string): string {
  return url.replace(/^http:/, "https:").split("?")[0];
}

function imageFilename(url: string): string {
  return path.basename(normalizeImageUrl(url));
}

interface WpVideo {
  id: number;
  slug: string;
  title: { rendered: string };
  link: string;
}

function extractFacebookUrl(html: string): string | null {
  const fbWatch = html.match(/src="(https:\/\/fb\.watch\/[^"]+)"/);
  if (fbWatch) return fbWatch[1];

  const pluginMatch = html.match(/href=(https%3A%2F%2Fwww\.facebook\.com[^"&]+)/);
  if (pluginMatch) {
    return decodeURIComponent(pluginMatch[1]);
  }

  const directMatch = html.match(/src="(https:\/\/www\.facebook\.com\/[^"]+)"/);
  if (directMatch) {
    const hrefMatch = directMatch[1].match(/href=([^&]+)/);
    if (hrefMatch) return decodeURIComponent(hrefMatch[1]);
  }

  const videoMatch = html.match(/facebook\.com\/watch\/\?v=(\d+)/);
  if (videoMatch) return `https://www.facebook.com/watch/?v=${videoMatch[1]}`;

  const pageVideoMatch = html.match(/facebook\.com\/[^/]+\/videos\/(\d+)/);
  if (pageVideoMatch) return `https://www.facebook.com/watch/?v=${pageVideoMatch[1]}`;

  return null;
}

async function fetchAllVideos(): Promise<WpVideo[]> {
  const videos: WpVideo[] = [];
  let page = 1;

  while (page <= 10) {
    const json = await fetch(
      `${BASE}/wp-json/wp/v2/aiovg_videos?per_page=100&page=${page}&status=publish`
    );
    const batch = JSON.parse(json) as WpVideo[];
    if (!Array.isArray(batch) || !batch.length) break;
    videos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }

  return videos;
}

async function scrapeSermons(): Promise<void> {
  console.log("Fetching sermons via WordPress API...");
  const videos = await fetchAllVideos();
  console.log(`Found ${videos.length} sermon entries`);

  const sermons: Array<{ id: number; title: string; slug: string; date: string; facebookUrl: string }> = [];

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    process.stdout.write(`\r  Sermon ${i + 1}/${videos.length}: ${video.slug}          `);

    try {
      const embedHtml = await fetch(`${BASE}/player-embed/id/${video.id}/`);
      const facebookUrl = extractFacebookUrl(embedHtml);
      if (!facebookUrl) continue;

      sermons.push({
        id: video.id,
        title: video.title.rendered.replace(/&#038;/g, "&").trim(),
        slug: video.slug,
        date: video.slug,
        facebookUrl,
      });
    } catch (err) {
      console.warn(`\n  Skipped ${video.slug}: ${err}`);
    }

    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`\nScraped ${sermons.length} sermons with Facebook URLs`);
  fs.writeFileSync(path.join(CONTENT, "services.json"), JSON.stringify({ sermons }, null, 2));
}

async function scrapeGallery(): Promise<void> {
  console.log("Scraping gallery...");
  const html = await fetch(`${BASE}/picture-gallery/`);

  // Only images from uploads that appear in gallery img/src tags
  const urls = [
    ...new Set(
      [...html.matchAll(/(?:src|href)="(https?:\/\/www\.summitchurchrbc\.com\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi)].map(
        (m) => normalizeImageUrl(m[1])
      )
    ),
  ].filter((url) => !url.includes("Logo") && !url.includes("logo"));

  console.log(`Found ${urls.length} gallery images`);
  const images: Array<{ src: string; alt: string }> = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = imageFilename(url);
    const localPath = `/images/gallery/${filename}`;
    const dest = path.join(PUBLIC, "images", "gallery", filename);

    process.stdout.write(`\r  Image ${i + 1}/${urls.length}          `);
    try {
      await downloadFile(url, dest);
      images.push({ src: localPath, alt: `Summit Church photo ${i + 1}` });
    } catch {
      images.push({ src: url, alt: `Summit Church photo ${i + 1}` });
    }
  }

  console.log(`\nSaved ${images.length} gallery entries`);
  fs.writeFileSync(path.join(CONTENT, "gallery.json"), JSON.stringify({ images }, null, 2));
}

async function downloadAssets(): Promise<void> {
  console.log("Downloading brand assets...");
  const assets = [
    { url: `${BASE}/wp-content/uploads/2023/12/Summit-Church-Logo-Black-copy-2-300x238.webp`, dest: "images/logo.webp" },
    { url: `${BASE}/wp-content/uploads/2015/06/Summit-Church-Cover-Photo.webp`, dest: "images/hero/summit-church-cover.webp" },
    { url: `${BASE}/wp-content/uploads/2022/10/fall2022-scaled.jpg`, dest: "images/bg-fall.jpg" },
    { url: `${BASE}/wp-content/uploads/2015/09/scrbc-300x244.jpg`, dest: "images/quotes-bg.jpg" },
    { url: `${BASE}/wp-content/uploads/2020/01/cropped-favicon-32x32-1-32x32.png`, dest: "favicon.ico" },
    { url: `${BASE}/wp-content/uploads/2023/09/IMG-7644.jpg`, dest: "images/team/todd-lorie-walker.jpg" },
    { url: `${BASE}/wp-content/uploads/2023/09/IMG-0137.jpg`, dest: "images/team/joseph-macall-hooper.jpg" },
    { url: `${BASE}/wp-content/uploads/2023/09/IMG-7647.jpg`, dest: "images/team/kyle-valerie-roberts.jpg" },
  ];

  for (const asset of assets) {
    const dest = path.join(PUBLIC, asset.dest);
    try {
      await downloadFile(asset.url, dest);
      console.log(`  ✓ ${asset.dest}`);
    } catch (err) {
      console.warn(`  ✗ ${asset.dest}: ${err}`);
    }
  }
}

async function main(): Promise<void> {
  console.log("Summit Church WordPress Migration\n");
  fs.mkdirSync(path.join(PUBLIC, "images", "gallery"), { recursive: true });
  fs.mkdirSync(path.join(PUBLIC, "images", "hero"), { recursive: true });
  fs.mkdirSync(path.join(PUBLIC, "images", "team"), { recursive: true });

  await downloadAssets();
  await scrapeSermons();
  await scrapeGallery();

  console.log("\nMigration complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});