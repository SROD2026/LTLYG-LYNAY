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
  ].join(",");

  const rows = entries.map(e =>
    [
      csvEscape(e.ts),
      csvEscape(e.mode),
      csvEscape(e.emotion),
      csvEscape(e.need)
    ].join(",")
  );

  return [header, ...rows].join("\n");
}

export async function exportZip(entries) {
  const zip = new JSZip();
  zip.file("entries.csv", buildCSV(entries));
  return zip.generateAsync({ type: "blob" });
}