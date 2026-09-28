#!/usr/bin/env node
/**
 * Render scripts/social-card.html to docs/social-card-v2.png at 1200×630.
 *
 *   node scripts/render-social-card.mjs
 *
 * Uses the system Chrome or Chromium (google-chrome, google-chrome-stable,
 * chromium, or chromium-browser). Override with CHROME=/path/to/chrome.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML = join(ROOT, "scripts", "social-card.html");
const OUT = join(ROOT, "docs", "social-card-v2.png");

const candidates = [
  process.env.CHROME,
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
].filter(Boolean);

function findChrome() {
  for (const bin of candidates) {
    const probe = spawnSync("bash", ["-lc", `command -v ${bin}`], { encoding: "utf8" });
    if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim();
  }
  return null;
}

const chrome = findChrome();
if (!chrome) {
  console.error("Chrome or Chromium not found. Set CHROME to the binary path.");
  process.exit(1);
}
if (!existsSync(HTML)) {
  console.error(`Missing template: ${HTML}`);
  process.exit(1);
}

const userData = mkdtempSync(join(tmpdir(), "social-card-chrome-"));
const child = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  "--disable-background-networking",
  "--disable-sync",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  "--default-background-color=00000000",
  `--user-data-dir=${userData}`,
  `--screenshot=${OUT}`,
  `file://${HTML}`,
], { stdio: "inherit" });

const started = Date.now();
let stable = 0;
let lastSize = -1;
while (Date.now() - started < 20000) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (!existsSync(OUT)) continue;
  const size = statSync(OUT).size;
  if (size > 1000 && size === lastSize) {
    stable += 1;
    if (stable >= 3) break;
  } else {
    stable = 0;
    lastSize = size;
  }
}
child.kill("SIGKILL");
await new Promise((resolve) => child.once("close", resolve));
if (!existsSync(OUT)) {
  console.error("Chrome did not write the screenshot.");
  process.exit(1);
}

const png = readFileSync(OUT);
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width !== 1200 || height !== 630) {
  console.error(`expected 1200x630, got ${width}x${height}`);
  process.exit(1);
}

const clip = spawnSync("python3", ["-c", `
from PIL import Image
im = Image.open(${JSON.stringify(OUT)}).convert("RGB")
w, h = im.size
edge = []
for y in range(h):
    for x in list(range(0, 8)) + list(range(w - 8, w)):
        r, g, b = im.getpixel((x, y))
        if 0.2126 * r + 0.7152 * g + 0.0722 * b > 150:
            edge.append((x, y))
for x in range(w):
    for y in list(range(0, 8)) + list(range(h - 8, h)):
        r, g, b = im.getpixel((x, y))
        if 0.2126 * r + 0.7152 * g + 0.0722 * b > 150:
            edge.append((x, y))
if edge:
    raise SystemExit(f"bright pixels in the outer 8px ({len(edge)}), text may be clipped")
print("social-card-v2.png 1200x630, no edge clipping")
`], { encoding: "utf8" });

if (clip.status !== 0) {
  const err = `${clip.stderr || ""}${clip.stdout || ""}`;
  if (err.includes("No module named")) {
    console.log(`social-card-v2.png ${width}x${height}; edge check skipped (install Pillow to enable it)`);
  } else {
    process.stderr.write(err);
    process.exit(clip.status ?? 1);
  }
} else {
  process.stdout.write(clip.stdout || "");
}
