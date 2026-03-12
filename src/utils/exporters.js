import JSZip from "jszip";

export function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function buildCSV(entries) {
  const header = [
  "timestamp",
  "mode",
  "emotion",
  "need",
  "body_sensations",
  "violent_trigger",
  "violent_replacement",
  "violation_key",
  "accountable_violation_key",
  "request",
  "context_notes",
  "image_file",
].join(",");

  const rows = entries.map(e =>
    [
       csvEscape(e?.ts || ""),
  csvEscape(e?.mode || ""),
  csvEscape(e?.emotion || ""),
  csvEscape(e?.need || ""),
  csvEscape(body),
  csvEscape(e?.cause || ""),
  csvEscape(e?.replacement || ""),
  csvEscape(e?.violationKey || ""),
  csvEscape(e?.accountableViolationKey || ""),
  csvEscape(e?.request || ""),
  csvEscape(e?.context_notes || ""),
  csvEscape(imageFile),
    ].join(",")
  );

  return [header, ...rows].join("\n");
}

export async function exportZip(entries) {
  const zip = new JSZip();
  zip.file("entries.csv", buildCSV(entries));
  return zip.generateAsync({ type: "blob" });
}