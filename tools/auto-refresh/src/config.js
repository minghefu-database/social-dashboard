import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const srcDir = path.dirname(currentFile);
const toolDir = path.resolve(srcDir, "..");
const repoRoot = path.resolve(toolDir, "../..");

export const paths = {
  repoRoot,
  authDir: path.join(repoRoot, "tools", ".auth", "browser-profile"),
  outputDir: path.join(repoRoot, "tools", "output"),
  latestRawDir: path.join(repoRoot, "tools", "output", "latest-raw"),
  summaryFile: path.join(repoRoot, "tools", "output", "summary.json"),
};

export const platforms = {
  xhs: {
    label: "小红书",
    startUrl: "https://creator.xiaohongshu.com/",
    hosts: ["creator.xiaohongshu.com", "edith.xiaohongshu.com"],
    usefulPathHints: [
      "api",
      "note",
      "data",
      "analysis",
      "analytics",
      "dashboard",
      "creator",
      "insight",
      "profile",
    ],
  },
  dy: {
    label: "抖音",
    startUrl: "https://creator.douyin.com/",
    hosts: ["creator.douyin.com", "creator.douyin.com.cn"],
    usefulPathHints: [
      "api",
      "aweme",
      "video",
      "data",
      "analysis",
      "analytics",
      "creator",
      "dashboard",
      "fans",
      "profile",
    ],
  },
};

export const sensitiveKeyPatterns = [
  /authorization/i,
  /cookie/i,
  /csrf/i,
  /session/i,
  /token/i,
  /ticket/i,
  /secret/i,
  /password/i,
  /passwd/i,
  /credential/i,
  /access[_-]?key/i,
  /refresh[_-]?key/i,
  /x-secsdk/i,
  /ms[_-]?token/i,
];

export const defaultCollectMs = 120000;
