const ESV_API_URL = "https://api.esv.org/v3/passage/text/";
const ESV_CACHE_KEY = "esvCacheV1";
const ESV_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getApiKey() {
  return import.meta.env.VITE_ESV_API_KEY || "";
}

function loadCache() {
  try {
    const raw = window.localStorage.getItem(ESV_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    window.localStorage.setItem(ESV_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore storage failures
  }
}

function normalizeRef(ref) {
  return String(ref || "").trim();
}

function cleanPassageText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\[\d+\]/g, "")
    .trim();
}

export function getCachedVerse(ref) {
  if (typeof window === "undefined") return null;

  const key = normalizeRef(ref);
  if (!key) return null;

  const cache = loadCache();
  const entry = cache[key];

  if (!entry) return null;

  const isExpired = Date.now() - entry.savedAt > ESV_CACHE_TTL_MS;
  if (isExpired) {
    delete cache[key];
    saveCache(cache);
    return null;
  }

  return entry.text || null;
}

export async function fetchEsvVerse(ref) {
  const key = normalizeRef(ref);
  if (!key) throw new Error("Missing Scripture reference.");

  const cached = typeof window !== "undefined" ? getCachedVerse(key) : null;
  if (cached) return cached;

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing VITE_ESV_API_KEY in your Vite environment.");
  }

  const url = new URL(ESV_API_URL);
  url.searchParams.set("q", key);
  url.searchParams.set("include-passage-references", "false");
  url.searchParams.set("include-verse-numbers", "false");
  url.searchParams.set("include-first-verse-numbers", "false");
  url.searchParams.set("include-footnotes", "false");
  url.searchParams.set("include-footnote-body", "false");
  url.searchParams.set("include-headings", "false");
  url.searchParams.set("include-short-copyright", "false");
  url.searchParams.set("include-copyright", "false");
  url.searchParams.set("indent-paragraphs", "0");
  url.searchParams.set("indent-poetry", "false");
  url.searchParams.set("indent-poetry-lines", "0");
  url.searchParams.set("indent-declares", "0");
  url.searchParams.set("line-length", "0");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`ESV request failed (${res.status}).`);
  }

  const data = await res.json();
  const passage = Array.isArray(data?.passages) ? data.passages[0] : "";
  const text = cleanPassageText(passage);

  if (!text) {
    throw new Error(`No verse text returned for "${key}".`);
  }

  if (typeof window !== "undefined") {
    const cache = loadCache();
    cache[key] = {
      text,
      savedAt: Date.now(),
    };
    saveCache(cache);
  }

  return text;
}

export function clearExpiredEsvCache() {
  if (typeof window === "undefined") return;

  const cache = loadCache();
  let changed = false;

  for (const [key, entry] of Object.entries(cache)) {
    const isExpired =
      !entry ||
      typeof entry !== "object" ||
      !entry.savedAt ||
      Date.now() - entry.savedAt > ESV_CACHE_TTL_MS;

    if (isExpired) {
      delete cache[key];
      changed = true;
    }
  }

  if (changed) saveCache(cache);
}