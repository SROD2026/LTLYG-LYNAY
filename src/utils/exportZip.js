import JSZip from "jszip";

const LOG_KEY = "emotion_log_v1";

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

function dataUrlToUint8Array(dataUrl) {
  const base64 = (dataUrl || "").split(",")[1] || "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildCsv(entries) {
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

  const lines = entries.map((e, idx) => {
    const imageFile = `entry-${String(idx + 1).padStart(4, "0")}.png`;
    const body = (e.intero || [])
      .map((x) => `${String(x.region).replaceAll("_", " ")}: ${x.sensation}`)
      .join(" | ");

    return [
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
].join(",");
});

  return [header, ...lines].join("\n");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportEmotionZip() {
  const entries = loadLog();
  const zip = new JSZip();

  // CSV
  zip.file("entries.csv", buildCsv(entries));

  // Images
  const imgFolder = zip.folder("images");
  entries.forEach((e, idx) => {
    const name = `entry-${String(idx + 1).padStart(4, "0")}.png`;
    if (e.pngDataUrl) {
      imgFolder.file(name, dataUrlToUint8Array(e.pngDataUrl));
    }
  });

  const yyyyMmDd = new Date().toISOString().slice(0, 10);
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `emotion-log-${yyyyMmDd}.zip`);
}