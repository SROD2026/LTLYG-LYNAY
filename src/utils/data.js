// src/utils/data.js
// COPY/PASTE ENTIRE FILE

// -------------------------
// Robust JSON fetch
// -------------------------
export async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  const text = await res.text();

  // If JSON files aren't in /public, Vite may return index.html
  if (text.trim().startsWith("<!doctype") || text.trim().startsWith("<html")) {
    throw new Error(
      `Fetch ${path} returned HTML (not JSON). Put the file in /public and verify the name/path.`
    );
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Fetch ${path} did not return valid JSON: ${e?.message || e}`);
  }
}

// -------------------------
// Normalizers
// -------------------------
function normalizeMeta(meta) {
  if (!meta || typeof meta !== "object") return {};

  const out = {};
  for (const [emotion, entry] of Object.entries(meta)) {
    const needsRaw = entry?.needs;

    let needs = [];
    if (Array.isArray(needsRaw)) needs = needsRaw.map(String).map((s) => s.trim()).filter(Boolean);
    else if (typeof needsRaw === "string" && needsRaw.trim()) {
      needs = needsRaw
        .split(/[,;|\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    out[emotion] = {
      needs,
      nvc_template:
        typeof entry?.nvc_template === "string" && entry.nvc_template.trim()
          ? entry.nvc_template.trim()
          : `When I observe ____, I feel ${emotion} because I need ____.`,
    };
  }
  return out;
}

function normalizeGridLike(data) {
  // Support:
  // 1) [ ...cells ]
  // 2) { grid: [ ...cells ] }
  // 3) { cells: [ ...cells ] }
  // 4) { nnmGrid: [ ...cells ] }
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.grid)) return data.grid;
    if (Array.isArray(data.cells)) return data.cells;
    if (Array.isArray(data.nnmGrid)) return data.nnmGrid;
  }
  return [];
}

// -------------------------
// Loaders (files must be in /public)
// -------------------------

// NNM grid (array)
export async function loadNNMGrid() {
  const data = await loadJSON("/NNM.json");
  return normalizeGridLike(data);
}

// Violent grid (array) — your file is VIOLENT1.json now
export async function loadViolentGrid() {
  const data = await loadJSON("/VIOLENT1.json");
  return normalizeGridLike(data);
}

// VIOLENT2.json (object index)
export async function loadViolent2() {
  // expected: object
  const data = await loadJSON("/VIOLENT2.json");
  return data && typeof data === "object" ? data : {};
}

// emotion meta (object)
export async function loadEmotionMeta() {
  const meta = await loadJSON("/emotion_meta.json");
  return normalizeMeta(meta);
}

// needs supplement (object)
export async function loadNeedsSupplement() {
  const data = await loadJSON("/NEEDS_SUPPLEMENT.json");
  return data && typeof data === "object" ? data : { global: [] };
}

// MASTER_PROTOCOLS.json (single source of truth)
export async function loadMasterProtocols() {
  const data = await loadJSON("/MASTER_PROTOCOLS.json");
  return data && typeof data === "object" ? data : {};
}

/**
 * Back-compat loaders:
 * Keep older code working while you refactor components/pages.
 * They now pull from MASTER_PROTOCOLS.json instead of separate files.
 */

export async function loadPromises() {
  const master = await loadMasterProtocols();
  return master?.promises && typeof master.promises === "object" ? master.promises : {};
}

export async function loadTheologyMap() {
  const master = await loadMasterProtocols();
  return master?.theology && typeof master.theology === "object" ? master.theology : {};
}

export async function loadViolentMap() {
  const master = await loadMasterProtocols();
  return master?.violent_map && typeof master.violent_map === "object" ? master.violent_map : {};
}

export async function loadAccountabilityProtocols() {
  // Keep FULL shape expected by EmotionModal:
  // { protocols, violations, promises, theology, violent_map, meta, violent2 }
  const master = await loadMasterProtocols();
  return master && typeof master === "object" ? master : {};
}

// -------------------------
// Helpers
// -------------------------
export function buildViolentCauseIndex(violent2) {
  // Returns: { [emotionWordLower]: { category, causes[] } }
  const idx = {};
  if (!violent2 || typeof violent2 !== "object") return idx;

  for (const [category, block] of Object.entries(violent2)) {
    const emotions = Array.isArray(block?.emotions) ? block.emotions : [];
    const causes = Array.isArray(block?.likely_causes) ? block.likely_causes : [];
    for (const e of emotions) {
      const key = String(e || "").trim().toLowerCase();
      if (!key) continue;
      idx[key] = { category, causes };
    }
  }
  return idx;
}

export function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function getReplacementEmotions({ violentCell, nnmGrid, count = 5 }) {
  // Picks “nonviolent” options from NNM.json:
  // - prioritize same quadrant (sign of x/y)
  // - nearest by Manhattan distance
  if (!violentCell || !Array.isArray(nnmGrid) || nnmGrid.length === 0) return [];

  const vx = Number(violentCell.x);
  const vy = Number(violentCell.y);
  if (!Number.isFinite(vx) || !Number.isFinite(vy)) return [];

  const sameQuadrant = (c) => {
    const x = Number(c.x),
      y = Number(c.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    // treat 0 as not expected; your grids should not use 0.
    return Math.sign(x) === Math.sign(vx) && Math.sign(y) === Math.sign(vy);
  };

  const ranked = nnmGrid
    .filter((c) => c && typeof c === "object" && typeof c.emotion === "string")
    .map((c) => ({
      emotion: c.emotion,
      x: Number(c.x),
      y: Number(c.y),
      q: sameQuadrant(c),
    }))
    .filter((c) => Number.isFinite(c.x) && Number.isFinite(c.y))
    .map((c) => ({
      ...c,
      d: manhattan({ x: vx, y: vy }, c),
    }))
    .sort((a, b) => {
      // same quadrant first, then closest
      if (a.q !== b.q) return a.q ? -1 : 1;
      return a.d - b.d;
    });

  const out = [];
  const seen = new Set();
  for (const item of ranked) {
    const k = item.emotion.trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item.emotion);
    if (out.length >= count) break;
  }
  return out;
}

export function uniqStrings(arr) {
  const out = [];
  const seen = new Set();
  for (const x of arr || []) {
    const s = String(x || "").trim();
    if (!s) continue;
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

export function guessViolationKeyFromText(text, violentMap) {
  // Very simple matcher: if the user-selected cause/phrase contains tokens from a VIOLENT_MAP key.
  const t = String(text || "").toLowerCase();
  if (!t) return "";

  const keys = Object.keys(violentMap || {});
  if (keys.length === 0) return "";

  let best = "";
  let bestScore = 0;

  for (const key of keys) {
    const tokens = key.split(/[_\-\s]+/).filter(Boolean);
    let score = 0;
    for (const tok of tokens) {
      if (tok.length <= 2) continue;
      if (t.includes(tok.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }

  return bestScore >= 1 ? best : "";
}