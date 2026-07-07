import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { chromium } from "playwright";
import { defaultCollectMs, paths, platforms } from "./config.js";
import { sanitize, sanitizeHeaders, sanitizePostData, sanitizeUrl } from "./sanitize.js";

const args = parseArgs(process.argv.slice(2));
const selectedPlatforms = resolvePlatforms(args.platform);
const collectMs = Number(args.duration || defaultCollectMs);
const loginOnly = Boolean(args.loginOnly);
const noPrompt = Boolean(args.noPrompt);
const keepRaw = Boolean(args.keepRaw);

await main();

async function main() {
  await fs.mkdir(paths.authDir, { recursive: true });
  await fs.mkdir(paths.latestRawDir, { recursive: true });

  if (!keepRaw) {
    await resetLatestRawDir();
  }

  const browserContext = await chromium.launchPersistentContext(paths.authDir, {
    headless: false,
    viewport: { width: 1440, height: 960 },
    locale: "zh-CN",
    timezoneId: "Asia/Shanghai",
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    mode: loginOnly ? "login-only" : "collect",
    durationMs: collectMs,
    platforms: {},
  };

  try {
    for (const platformKey of selectedPlatforms) {
      const platform = platforms[platformKey];
      const page = await browserContext.newPage();
      const captureState = {
        records: [],
        pending: new Set(),
        nextIndex: 0,
      };
      summary.platforms[platformKey] = {
        label: platform.label,
        startUrl: platform.startUrl,
        captured: 0,
        skipped: 0,
        files: [],
        tags: {},
        warnings: [],
      };

      page.on("response", async (response) => {
        const task = captureResponse({ platformKey, platform, response, captureState, summary });
        captureState.pending.add(task);
        task.finally(() => captureState.pending.delete(task));
      });

      console.log(`\n[${platform.label}] 打开 ${platform.startUrl}`);
      await page.goto(platform.startUrl, { waitUntil: "domcontentloaded", timeout: 90000 });

      if (!noPrompt) {
        await waitForUser(
          `[${platform.label}] 如果需要登录，请在浏览器完成登录。登录并打开你想采集的数据页面后，回到这里按回车继续。`
        );
      }

      if (loginOnly) {
        console.log(`[${platform.label}] 已保存本机登录态。`);
        continue;
      }

      console.log(`[${platform.label}] 开始监听 ${Math.round(collectMs / 1000)} 秒。你可以在浏览器里点开账号概览、作品列表、单篇作品分析、观众画像等页面。`);
      await page.waitForTimeout(collectMs);
      await Promise.allSettled([...captureState.pending]);
      console.log(`[${platform.label}] 监听结束，捕获 ${captureState.records.length} 条数据。`);
      await page.close();
    }

    await fs.mkdir(paths.outputDir, { recursive: true });
    await fs.writeFile(paths.summaryFile, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
    console.log(`\n采集摘要已写入：${paths.summaryFile}`);
    console.log("当前版本不会修改 data.js，也不会推送 GitHub。");
  } finally {
    await browserContext.close();
  }
}

async function captureResponse({ platformKey, platform, response, captureState, summary }) {
  const url = response.url();
  if (!isRelevantUrl(platform, url)) {
    summary.platforms[platformKey].skipped += 1;
    return;
  }

  const headers = response.headers();
  const contentType = headers["content-type"] || "";
  if (!contentType.includes("json")) {
    summary.platforms[platformKey].skipped += 1;
    return;
  }

  let body;
  try {
    body = await response.json();
  } catch {
    summary.platforms[platformKey].skipped += 1;
    return;
  }

  const cleanBody = sanitize(body);
  const tags = inferTags(url, cleanBody);
  const record = {
    capturedAt: new Date().toISOString(),
    platform: platformKey,
    platformLabel: platform.label,
    status: response.status(),
    url: sanitizeUrl(url),
    urlNoQuery: stripUrlSearch(url),
    method: response.request().method(),
    requestHeaders: sanitizeHeaders(response.request().headers()),
    requestPostData: sanitizePostData(response.request().postData()),
    responseHeaders: sanitizeHeaders(headers),
    tags,
    body: cleanBody,
  };

  const index = ++captureState.nextIndex;
  const urlHash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 8);
  const filename = `${String(index).padStart(3, "0")}-${slugify(tags[0] || "data")}-${urlHash}-${Date.now()}.json`;
  const platformDir = path.join(paths.latestRawDir, platformKey);
  const outputFile = path.join(platformDir, filename);

  await fs.mkdir(platformDir, { recursive: true });
  await fs.writeFile(outputFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");

  captureState.records.push(record);
  summary.platforms[platformKey].captured += 1;
  summary.platforms[platformKey].files.push(path.relative(paths.repoRoot, outputFile));
  for (const tag of tags) {
    summary.platforms[platformKey].tags[tag] = (summary.platforms[platformKey].tags[tag] || 0) + 1;
  }

  console.log(`[${platform.label}] ${response.status()} ${tags.join(",") || "json"} ${stripUrlSearch(url)}`);
}

function isRelevantUrl(platform, rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  const hostname = parsed.hostname;
  if (!platform.hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
    return false;
  }

  const lowerPath = parsed.pathname.toLowerCase();
  return platform.usefulPathHints.some((hint) => lowerPath.includes(hint));
}

function inferTags(url, body) {
  const text = `${url} ${JSON.stringify(Object.keys(flattenKeys(body)).slice(0, 200))}`.toLowerCase();
  const tags = [];

  if (/overview|summary|core|dashboard|profile|account|home|主页|概览/.test(text)) tags.push("overview");
  if (/trend|curve|chart|hour|date|day|timeline|趋势|时段/.test(text)) tags.push("trend");
  if (/note|aweme|video|item|publish|作品|笔记|视频/.test(text)) tags.push("work");
  if (/fans|follower|follow|audience|portrait|gender|age|city|interest|粉丝|观众|画像|年龄|城市|兴趣/.test(text)) tags.push("audience");
  if (/source|traffic|flow|refer|入口|来源|流量/.test(text)) tags.push("traffic");
  if (/comment|like|collect|share|interaction|点赞|评论|收藏|分享/.test(text)) tags.push("engagement");

  return tags.length ? [...new Set(tags)] : ["unknown"];
}

function flattenKeys(value, result = {}) {
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 20)) flattenKeys(item, result);
    return result;
  }

  if (!value || typeof value !== "object") {
    return result;
  }

  for (const [key, child] of Object.entries(value)) {
    result[key] = true;
    flattenKeys(child, result);
  }
  return result;
}

async function resetLatestRawDir() {
  await fs.rm(paths.latestRawDir, { recursive: true, force: true });
  await fs.mkdir(paths.latestRawDir, { recursive: true });
}

async function waitForUser(message) {
  const rl = readline.createInterface({ input, output });
  try {
    await rl.question(`${message}\n`);
  } finally {
    rl.close();
  }
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (const arg of rawArgs) {
    if (arg.startsWith("--platform=")) parsed.platform = arg.slice("--platform=".length);
    if (arg.startsWith("--duration=")) parsed.duration = Number(arg.slice("--duration=".length)) * 1000;
    if (arg === "--login-only") parsed.loginOnly = true;
    if (arg === "--no-prompt") parsed.noPrompt = true;
    if (arg === "--keep-raw") parsed.keepRaw = true;
  }
  return parsed;
}

function resolvePlatforms(platform) {
  if (!platform || platform === "all") return Object.keys(platforms);
  const keys = platform.split(",").map((item) => item.trim()).filter(Boolean);
  for (const key of keys) {
    if (!platforms[key]) {
      throw new Error(`未知平台：${key}。可选值：${Object.keys(platforms).join(", ")}`);
    }
  }
  return keys;
}

function stripUrlSearch(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "data";
}
