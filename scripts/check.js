// scripts/fixYourYourInCheckinMeta.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET = path.join(
  __dirname,
  "..",
  "public",
  "data",
  "meta",
  "checkinMeta.json"
);

function fixString(s) {
  return String(s)
    .replace(/\byour\s+your\b/gi, "your")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function walk(value, stats) {
  if (typeof value === "string") {
    const next = fixString(value);
    if (next !== value) stats.changed += 1;
    return next;
  }

  if (Array.isArray(value)) {
    return value.map((item) => walk(item, stats));
  }

  if (value && typeof value === "object") {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = walk(val, stats);
    }
    return out;
  }

  return value;
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error(`Missing file: ${TARGET}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(TARGET, "utf8");
  const json = JSON.parse(raw);

  const stats = { changed: 0 };
  const updated = walk(json, stats);

  fs.writeFileSync(TARGET, JSON.stringify(updated, null, 2) + "\n", "utf8");

  console.log(`Updated: ${TARGET}`);
  console.log(`Strings changed: ${stats.changed}`);
}

main();