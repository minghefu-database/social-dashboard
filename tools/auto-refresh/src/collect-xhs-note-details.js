import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { paths } from "./config.js";
import { sanitize, sanitizeHeaders, sanitizePostData, sanitizeUrl } from "./sanitize.js";

const targetNotes = [
  { id: "6a250d08000000001702e8fa", title: "不要迷信了! 寺庙的秘密被可视化了" },
  { id: "6a2a334f000000002202499b", title: "让你家拥有一个S型身材的家居布局" },
  { id: "6a2fde79000000000f01cd05", title: "容易提升成绩的位置，打造好的学习环境" },
  { id: "6a3371b90000000011006ff1", title: "现代家中男尊女卑的实际理解, 很实用!" },
  { id: "6a389304000000000f0330ca", title: "家居布局干货｜可能影响女性的格局" },
  { id: "6a3df959000000000f028808", title: "酒店选房避雷指南, 国歌护体，睡稳心安。" },
  { id: "6a4261e900000000110157d4", title: "家中手办正在悄悄改变你的认知！🚨" },
  { id: "6a479baa0000000011010c1a", title: "第1集｜找到家里最\"旺\"你的位置" },
];

await main();

async function main() {
  const outputDir = path.join(paths.latestRawDir, "xhs-note-details");
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  const context = await chromium.launchPersistentContext(paths.authDir, {
    headless: false,
    viewport: { width: 1440, height: 960 },
    locale: "zh-CN",
    timezoneId: "Asia/Shanghai",
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    notes: [],
  };

  try {
    const page = await context.newPage();
    let currentNote = null;
    let sequence = 0;

    page.on("response", async (response) => {
      if (!currentNote) return;
      await captureNoteResponse({ response, outputDir, note: currentNote, sequence: ++sequence, summary });
    });

    for (const note of targetNotes) {
      currentNote = { ...note, files: [] };
      sequence = 0;
      const detailUrl = `https://creator.xiaohongshu.com/statistics/note-detail?noteId=${encodeURIComponent(note.id)}`;
      console.log(`[小红书] 打开单篇详情：${note.title}`);
      await page.goto(detailUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForTimeout(9000);

      await clickIfVisible(page, "观看趋势");
      await page.waitForTimeout(1500);
      await clickIfVisible(page, "观看来源");
      await page.waitForTimeout(1500);
      await clickIfVisible(page, "观众画像");
      await page.waitForTimeout(2500);
      await clickIfVisible(page, "核心数据");
      await page.waitForTimeout(1000);

      summary.notes.push(currentNote);
    }
  } finally {
    await context.close();
  }

  const summaryFile = path.join(paths.outputDir, "xhs-note-details-summary.json");
  await fs.mkdir(paths.outputDir, { recursive: true });
  await fs.writeFile(summaryFile, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(`小红书单篇详情摘要已写入：${summaryFile}`);
}

async function captureNoteResponse({ response, outputDir, note, sequence, summary }) {
  const url = response.url();
  if (!url.includes("creator.xiaohongshu.com/api/galaxy/creator/datacenter/note/")) return;
  if (!isCurrentNoteRequest(url, note.id)) return;

  const headers = response.headers();
  const contentType = headers["content-type"] || "";
  if (!contentType.includes("json")) return;

  let body;
  try {
    body = await response.json();
  } catch {
    return;
  }

  const record = {
    capturedAt: new Date().toISOString(),
    platform: "xhs",
    platformLabel: "小红书",
    noteId: note.id,
    noteTitle: note.title,
    status: response.status(),
    url: sanitizeUrl(url),
    urlNoQuery: stripUrlSearch(url),
    method: response.request().method(),
    requestHeaders: sanitizeHeaders(response.request().headers()),
    requestPostData: sanitizePostData(response.request().postData()),
    responseHeaders: sanitizeHeaders(headers),
    tags: ["xhs-note-detail"],
    body: sanitize(body),
  };

  const endpoint = endpointName(url);
  const filename = `${String(targetNotes.findIndex((item) => item.id === note.id) + 1).padStart(2, "0")}-${slugify(note.title)}-${String(sequence).padStart(2, "0")}-${endpoint}.json`;
  const outputFile = path.join(outputDir, filename);
  await fs.writeFile(outputFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  note.files.push(path.relative(paths.repoRoot, outputFile));
  console.log(`  ${response.status()} ${endpoint}`);
}

async function clickIfVisible(page, text) {
  const locator = page.getByText(text, { exact: true }).first();
  if (await locator.count() === 0) return false;
  try {
    await locator.click({ timeout: 3000 });
    return true;
  } catch {
    return false;
  }
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

function isCurrentNoteRequest(rawUrl, noteId) {
  try {
    const parsed = new URL(rawUrl);
    return parsed.searchParams.get("note_id") === noteId;
  } catch {
    return false;
  }
}

function endpointName(rawUrl) {
  const parsed = new URL(rawUrl);
  const pathPart = parsed.pathname.split("/").slice(-2).join("-");
  const queryPart = parsed.searchParams.has("note_id") ? "by-note" : "data";
  return slugify(`${pathPart}-${queryPart}`);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "data";
}
