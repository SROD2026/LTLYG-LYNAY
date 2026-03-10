// src/utils/logStore.js

const LOG_KEY = "reflection_log_v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function loadReflectionLog() {
  const raw = localStorage.getItem(LOG_KEY);
  const parsed = safeParse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed;
}

export function saveReflectionLog(entries) {
  localStorage.setItem(LOG_KEY, JSON.stringify(entries));
}

export function appendReflectionEntry(entry) {
  const entries = loadReflectionLog();

  const normalized = {
    id: entry.id || crypto.randomUUID(),
    ts: entry.ts || new Date().toISOString(),

    type: entry.type || "",

    emotion: entry.emotion || "",
    title: entry.title || "",
    side: entry.side || "",

    need: entry.need || "",
    needs_met: entry.needs_met || "",

    reframe: entry.reframe || "",
    request: entry.request || "",

    cause: entry.cause || "",
    replacement: entry.replacement || "",

    violationKey: entry.violationKey || "",
    accountableViolationKey: entry.accountableViolationKey || "",

    observation: entry.observation || "",
    theology_key: entry.theology_key || "",

    gratitude_prompt: entry.gratitude_prompt || "",
    gratitude_text: entry.gratitude_text || "",

    written_prayer: entry.written_prayer || "",

    scriptures: Array.isArray(entry.scriptures) ? entry.scriptures : [],
    philippians_trait: entry.philippians_trait || "",
    philippians_needs: Array.isArray(entry.philippians_needs)
      ? entry.philippians_needs
      : [],
    philippians_shifts: Array.isArray(entry.philippians_shifts)
      ? entry.philippians_shifts
      : [],

    intero: Array.isArray(entry.intero) ? entry.intero : [],
    pngDataUrl: entry.pngDataUrl || "",
  };

  entries.unshift(normalized);
  saveReflectionLog(entries);

  return normalized;
}

export function clearReflectionLog() {
  localStorage.removeItem(LOG_KEY);
}