#!/usr/bin/env node

/**
 * scripts/addCheckinNeeds.js
 *
 * Fills or normalizes needs_met in public/data/meta/checkinMeta.json.
 *
 * Behavior:
 * - preserves existing non-empty needs_met
 * - normalizes them if present
 * - infers defaults if missing/empty
 * - writes JSON back prettified
 *
 * Usage:
 *   node scripts/addCheckinNeeds.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET = path.join(__dirname, "..", "public", "data", "meta", "checkinMeta.json");

function uniqStrings(arr) {
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

function hasAny(text, words) {
  const t = String(text || "").toLowerCase();
  return words.some((w) => t.includes(String(w).toLowerCase()));
}

function inferNeeds(key, entry) {
  const title = String(entry?.title || key || "");
  const side = entry?.side === "external" ? "external" : "internal";
  const text = `${key} ${title}`.toLowerCase();

  // ---------- external gratitude / appreciation ----------
  if (side === "external") {
    if (hasAny(text, ["safe with you", "protection"])) {
      return ["Safety", "Protection", "Trust", "Reliability", "Care", "Support"];
    }

    if (hasAny(text, ["listening", "understanding", "empathy", "seen", "valued", "attention", "presence"])) {
      return ["Being Heard", "Being Seen", "Understanding", "Connection", "Care", "Respect"];
    }

    if (hasAny(text, ["love", "warmth", "tenderness", "devotion", "loyalty", "intimacy", "affection", "pursuit"])) {
      return ["Love", "Connection", "Closeness / Intimacy", "Belonging", "Care", "Warmth"];
    }

    if (hasAny(text, ["forgiveness", "repair attempt", "humility", "truthfulness", "integrity", "accountability"])) {
      return ["Repair", "Trust", "Integrity", "Truthfulness", "Safety", "Reassurance"];
    }

    if (hasAny(text, ["leadership", "strength", "reliability", "follow through", "commitment", "service"])) {
      return ["Reliability", "Support", "Trust", "Stability", "Protection", "Care"];
    }

    if (hasAny(text, ["gift", "generosity", "hospitality", "help", "welcome", "small kindness", "kindness"])) {
      return ["Care", "Support", "Generosity", "Connection", "Belonging", "Comfort"];
    }

    if (hasAny(text, ["wisdom", "mentorship", "teaching", "feedback", "reminder", "problem solving"])) {
      return ["Guidance", "Learning", "Growth", "Support", "Understanding", "Clarity"];
    }

    if (hasAny(text, ["encouragement", "patience", "reassurance", "peacemaking"])) {
      return ["Encouragement", "Hope", "Reassurance", "Safety", "Care", "Peace"];
    }

    return ["Care", "Support", "Connection", "Belonging", "Appreciation", "Trust"];
  }

  // ---------- internal energized ----------
  if (
    hasAny(text, [
      "motivated",
      "bright",
      "hopeful",
      "encouraged",
      "uplifted",
      "joyful",
      "glad",
      "empowered",
      "alive",
      "energized",
      "inspired",
      "creative",
      "playful",
      "expanded",
      "free",
      "capable",
      "confident",
    ])
  ) {
    return ["Hope", "Energy", "Purpose", "Meaning / Purpose", "Progress", "Agency", "Encouragement", "Growth"];
  }

  // ---------- internal gratitude / warmth ----------
  if (
    hasAny(text, [
      "grateful",
      "deeply grateful",
      "thankful",
      "grateful inwardly",
      "thankful inwardly",
      "admiring",
      "moved",
      "touched",
      "warmed",
      "appreciative",
      "relieved by care",
      "strengthened by love",
      "soft inside",
      "tender inside",
    ])
  ) {
    return ["Appreciation", "Care", "Support", "Warmth", "Connection", "Love", "Relief", "Belonging"];
  }

  // ---------- internal calm / settled ----------
  if (
    hasAny(text, [
      "calm",
      "grounded",
      "secure",
      "stable",
      "safe",
      "anchored",
      "steady",
      "at peace",
      "rested",
      "peaceful",
      "settled inside",
      "serene",
      "deeply safe",
      "tranquil",
      "deeply rested",
      "still",
      "regulated",
      "unclenched",
      "at ease",
      "comfortable",
    ])
  ) {
    return ["Safety", "Peace", "Rest / Sleep", "Stability", "Predictability", "Ease", "Recovery", "Comfort"];
  }

  // ---------- internal coherent / clear ----------
  if (
    hasAny(text, [
      "focused",
      "engaged",
      "open",
      "clear",
      "clear minded",
      "mindful",
      "balanced",
      "present",
      "okay",
      "unburdened",
    ])
  ) {
    return ["Clarity", "Understanding", "Presence", "Order", "Simplicity", "Ease", "Space", "Relief"];
  }

  // ---------- internal relationally fulfilled ----------
  if (
    hasAny(text, [
      "cherished",
      "known",
      "accepted",
      "included",
      "connected",
      "cared for",
      "close",
      "respected",
      "honored",
      "seen",
      "held",
      "bonded",
      "heard",
      "supported",
      "valued",
      "content",
      "whole",
      "nourished",
      "fulfilled",
    ])
  ) {
    return ["Connection", "Belonging", "Being Seen", "Being Heard", "Respect", "Care", "Support", "Closeness / Intimacy"];
  }

  // ---------- spiritual / conscience / restoration ----------
  if (hasAny(text, ["at peace with god", "light in conscience", "restored inside"])) {
    return ["Peace", "Integrity", "Forgiveness", "Meaning / Purpose", "Relief", "Recovery"];
  }

  // ---------- generic internal fallback by definition ----------
  const def = String(entry?.definition || "").toLowerCase();

  if (hasAny(def, ["energized positive state", "hope, vitality, or forward movement"])) {
    return ["Hope", "Energy", "Purpose", "Progress", "Agency", "Meaning / Purpose"];
  }

  if (hasAny(def, ["settled, regulated state"])) {
    return ["Safety", "Peace", "Rest / Sleep", "Stability", "Ease", "Recovery"];
  }

  if (hasAny(def, ["relationally nourished state"])) {
    return ["Connection", "Belonging", "Care", "Support", "Being Seen", "Being Heard"];
  }

  if (hasAny(def, ["internally coherent state"])) {
    return ["Clarity", "Presence", "Understanding", "Order", "Simplicity", "Ease"];
  }

  if (hasAny(def, ["gratitude state"])) {
    return ["Appreciation", "Care", "Support", "Warmth", "Connection", "Belonging"];
  }

  return ["Support", "Care", "Peace", "Connection", "Clarity", "Belonging"];
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error(`File not found: ${TARGET}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(TARGET, "utf8");
  const json = JSON.parse(raw);

  let preserved = 0;
  let filled = 0;
  let normalized = 0;

  for (const [key, entry] of Object.entries(json)) {
    if (!entry || typeof entry !== "object") continue;

    const existing = Array.isArray(entry.needs_met) ? entry.needs_met : [];
    const normalizedExisting = uniqStrings(existing);

    if (normalizedExisting.length > 0) {
      entry.needs_met = normalizedExisting;
      preserved += 1;
      if (existing.length !== normalizedExisting.length) normalized += 1;
      continue;
    }

    entry.needs_met = uniqStrings(inferNeeds(key, entry)).slice(0, 8);
    filled += 1;
  }

  fs.writeFileSync(TARGET, JSON.stringify(json, null, 2) + "\n", "utf8");

  console.log(`Updated ${TARGET}`);
  console.log(`Preserved existing needs_met: ${preserved}`);
  console.log(`Filled missing needs_met: ${filled}`);
  console.log(`Normalized existing arrays: ${normalized}`);
}

main();