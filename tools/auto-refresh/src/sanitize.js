import { sensitiveKeyPatterns } from "./config.js";

const MAX_STRING_LENGTH = 20000;

export function sanitize(value) {
  return sanitizeValue(value, []);
}

function sanitizeValue(value, path) {
  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeValue(item, path.concat(String(index))));
  }

  if (value && typeof value === "object") {
    const clean = {};
    for (const [key, child] of Object.entries(value)) {
      if (isSensitiveKey(key)) {
        clean[key] = "[REDACTED]";
        continue;
      }
      clean[key] = sanitizeValue(child, path.concat(key));
    }
    return clean;
  }

  if (typeof value === "string") {
    if (looksSensitiveString(value)) {
      return "[REDACTED]";
    }
    if (value.length > MAX_STRING_LENGTH) {
      return `${value.slice(0, MAX_STRING_LENGTH)}...[TRUNCATED ${value.length - MAX_STRING_LENGTH} chars]`;
    }
  }

  return value;
}

export function sanitizeHeaders(headers) {
  const clean = {};
  for (const [key, value] of Object.entries(headers || {})) {
    clean[key] = isSensitiveKey(key) ? "[REDACTED]" : value;
  }
  return clean;
}

export function sanitizeUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  for (const [key, value] of parsed.searchParams.entries()) {
    if (isSensitiveKey(key) || looksSensitiveString(value)) {
      parsed.searchParams.set(key, "[REDACTED]");
    }
  }

  parsed.hash = "";
  return parsed.toString();
}

export function sanitizePostData(value) {
  if (!value) return null;
  try {
    return sanitize(JSON.parse(value));
  } catch {
    return looksSensitiveString(value) ? "[REDACTED]" : value.slice(0, 20000);
  }
}

export function isSensitiveKey(key) {
  return sensitiveKeyPatterns.some((pattern) => pattern.test(key));
}

function looksSensitiveString(value) {
  if (value.length < 24) return false;
  if (/^(Bearer|Basic)\s+/i.test(value)) return true;
  if (/passport|sessionid|sid_guard|uid_tt|csrf|token/i.test(value)) return true;
  if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)) return true;
  return false;
}
