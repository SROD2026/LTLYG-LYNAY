// src/utils/logExport.js

import JSZip from "jszip";
import { loadReflectionLog } from "./logStore.js";

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function buildReflectionCsv(entries) {
   const header = [
  "id",
  "ts",
  "type",
  "emotion",
  "title",
  "side",
  "need",
  "needs_met",
  "reframe",
  "request",
  "cause",
  "replacement",
  "violationKey",
  "accountableViolationKey",
  "observation",
  "theology_key",
  "gratitude_prompt",
  "gratitude_text",
  "context_notes",
  "written_prayer"
];

  const lines = [header.join(",")];

  for (const e of entries) {
    lines.push(
      header
        .map((k) => csvEscape(e[k] ?? ""))
        .join(",")    );
  }

  return lines.join("\n");
}

export function downloadCsv(entries) {
  const csv = buildReflectionCsv(entries);

  const blob = new Blob([csv], { type: "text/csv" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "reflections.csv";
  a.click();
}

export async function exportZip(entries) {
  const zip = new JSZip();

  const csv = buildReflectionCsv(entries);

  zip.file("reflections.csv", csv);

  entries.forEach((e, i) => {
    if (e.pngDataUrl) {
      const base64 = e.pngDataUrl.split(",")[1];
      zip.file(`reflection_${i}.png`, base64, { base64: true });
    }
  });

  const blob = await zip.generateAsync({ type: "blob" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "reflections.zip";
  a.click();
}