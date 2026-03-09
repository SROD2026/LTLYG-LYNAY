// src/components/EmotionModal.jsx
// COPY/PASTE ENTIRE FILE

import { useEffect, useMemo, useRef, useState } from "react";
import Panel from "../ui/Panel.jsx";
import Select from "../ui/Select.jsx";
import Chips from "../ui/Chips.jsx";
import InteroStickFigure from "../interoception/InteroStickFigure.jsx";
import AccountabilityBlock from "./AccountabilityBlock.jsx";
import {
  csvEscape,
  dataUrlToUint8Array,
  downloadBlob,
  captureElementPng,
} from "../../utils/exportHelpers.js";

import { cellColor } from "../../utils/color.js";
import { uniqStrings } from "../../utils/data.js";
import { appendReflectionEntry, loadReflectionLog } from "../../utils/logStore.js";

import JSZip from "jszip";

// -------------------------
// Local log (private on-device)
// -------------------------
const LOG_KEY = "emotion_log_v1";

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveLog(next) {
  localStorage.setItem(LOG_KEY, JSON.stringify(next));
}
function clearLog() {
  localStorage.removeItem(LOG_KEY);
}

// -------------------------
// Helpers (export)
// Converts a “trigger label” into a more neutral observation phrase.
function neutralizeTrigger(trigger) {
  const t = String(trigger || "").trim();
  if (!t) return "";

  const lower = t.toLowerCase();

  const map = [
    ["gaslit", "there was confusion or disagreement about what happened or what was said"],
    ["emotionally neglected", "I experienced a lack of emotional engagement or responsiveness"],
    ["unheard", "I didn’t experience being heard or reflected back"],
    ["dismissed", "my concern did not feel acknowledged"],
    ["invalidated", "my feelings did not feel acknowledged"],
    ["stonewalled", "the conversation stopped or became unavailable"],
    ["manipulated", "I felt pressure or influence I didn’t understand"],
    ["controlled", "I felt restricted in choices or options"],
    ["blamed", "responsibility was placed on me in a way I didn’t understand"],
    ["criticized", "feedback came across as global rather than specific"],
    ["shamed", "I felt judged or diminished"],
    ["mocked", "I felt ridiculed or not taken seriously"],
    ["lied to", "information I relied on did not feel truthful or consistent"],
    ["betrayed", "an expectation of loyalty or trust felt broken"],
    ["ignored", "I did not receive a response when I expected one"],
    ["rejected", "I experienced distance or disengagement when I wanted closeness"],
  ];

  for (const [key, repl] of map) {
    if (lower.includes(key)) return repl;
  }

  if (lower.startsWith("being ")) return `I experienced ${t.slice(6).trim()}`;
  if (lower.startsWith("feeling ")) return `I experienced ${t.slice(8).trim()}`;

  return `I experienced ${t}`;
}

// ---- Interoception Map ----
const BODY_MAP = {
  Chest: [
    "Tightness",
    "Stabbing pain",
    "Pressure",
    "Warmth spreading from my center",
    "Cold, hollow overwhelming sensation",
    "Fluttering",
    "Racing heartbeat",
    "Painful tension",
    "Shallow breathing",
    "Heavy weight",
    "Crushing sensation",
    "Buzzing or vibrating",
    "Radiating lightness",
    "Expanding / opening up",
  ],
  Abdomen: [
    "Nausea",
    "Butterflies",
    "Knotted up",
    "Cramping",
    "Sinking feeling",
    "Heat",
    "Coldness",
    "Empty or hollow feeling",
    "Clenching",
    "Sudden dropping sensation",
    "Intense discomfort",
    "Gnawing pain",
    "Stabbing pain",
  ],
  Head: [
    "Stabbing pressure",
    "Dull tension",
    "Throbbing headache",
    "Foggy thinking",
    "Racing thoughts",
    "Lightheaded",
    "Sharp focus",
    "Confusion",
    "Dizziness",
    "Heat / flushing / warmth",
    "Coldness",
    "Tightness",
  ],
  Throat: ["Lump", "Tightness", "Difficulty speaking", "Dryness", "Choking sensations", "Strained voice"],
  Arms_and_Hands: ["Tingling", "Restlessness", "Clenching", "Shaking", "Coldness", "Urge to move", "Numbness"],
  Legs_and_Feet: ["Restless", "Weak / collapsing", "Frozen / stuck", "Urge to flee", "Grounded heaviness", "Instability"],
  Whole_Body: [
    "Adrenaline surge",
    "Shutdown / collapse",
    "Numbness",
    "Overstimulation",
    "Hypersensitivity to sound/light",
    "Muscle tension everywhere",
    "Sudden fatigue",
    "Energy spike",
    "Body buzzing",
    "Emotional wave passing through",
  ],
};

const blankIntero = () => ({ region: "", sensation: "" });

function isCompleteIntero(x) {
  return !!(x && x.region && x.sensation);
}

function interoSentences(interoArr) {
  return (interoArr || [])
    .filter(isCompleteIntero)
    .map((x) => `I feel ${x.sensation} in my ${String(x.region).replaceAll("_", " ")}.`);
}


function emotionDefinition(emotion, meta) {
  const key = String(emotion || "").trim();
  const lower = key.toLowerCase();

  const entry = meta?.[key] || meta?.[lower] || null;
  if (entry?.definition) return String(entry.definition);

  const fallback = {
    "incensed": "Very angry because something feels unfair, violating, or morally wrong.",
    "consumed by injustice": "Overtaken by anger and moral pain because something feels deeply unfair.",
    "livid": "Intensely angry and activated, often with a strong need for respect or protection.",
    "outraged": "Strongly upset because something feels wrong, unjust, or unacceptable.",
    "enraged": "At a peak level of anger, often linked to danger, disrespect, or violation.",
    "repulsed": "Strongly pushed away by something that feels unsafe, violating, or deeply wrong.",
    "appalled": "Shocked and morally disturbed by something that feels unacceptable.",
    "boiling frustration": "Intense frustration from feeling blocked, prevented, or repeatedly hindered.",
    "seething": "Quiet but intense anger held inside, often after repeated hurt or unfairness.",
    "fuming": "Hot, active anger that builds when respect or consideration feels missing.",
    "resentful": "Anger mixed with hurt from unfairness, imbalance, or repeated unmet needs.",
    "frustrated": "Upset because something important feels blocked, slowed, or not working.",
    "agitated": "Activated and internally stirred up, often needing stillness, space, or clarity.",
    "tense": "Tight, activated, and braced, often needing safety, rest, or predictability.",
    "anxious": "Uneasy and concerned, often needing reassurance, clarity, or safety.",
    "overwhelmed": "Flooded by too much at once, often needing simplicity, time, or support.",
    "sad": "Emotionally heavy or hurting, often needing comfort, connection, or support.",
    "lonely": "Feeling emotionally alone, often needing closeness, warmth, or belonging.",
    "ashamed": "Painfully exposed or diminished, often needing dignity, gentleness, and acceptance.",
    "guilty": "Aware that something needs repair, often needing integrity, forgiveness, and growth.",
    "confused": "Lacking enough clarity or orientation to understand what is happening.",
    "uncertain": "Not sure what is true, next, or safe, often needing guidance or reassurance."
  };

  return fallback[lower] || "A signal about what matters to you and what need may be affected.";
}

export default function EmotionModal({
  open,
  onClose,
  cell,
  meta,
  master, // required for AccountabilityBlock
  mode = "blameless",
  causeIndex = {},
  replacementOptions = [],
  needsSupplement = { global: [] },
}) {
  // -------------------------
  // UI coloring
  // -------------------------
  const overlayHex = useMemo(() => {
    if (!cell) return null;
    if (mode !== "violent") return cellColor(cell.x, cell.y);

    const { x = 0, y = 0 } = cell || {};
    const quadrant = x >= 0 && y >= 0 ? "Q1" : x < 0 && y >= 0 ? "Q2" : x < 0 && y < 0 ? "Q3" : "Q4";

    const QUADRANT_COLORS = {
      Q1: "#f6ef2e",
      Q2: "#fc261b",
      Q3: "#0559cf",
      Q4: "#4c1d95",
    };

    return QUADRANT_COLORS[quadrant] || "#111827";
  }, [cell, mode]);

  const emotion = useMemo(() => {
  if (!cell) return "";
  return String(cell.emotion || cell.word || "").trim();
}, [cell]);

const lower = String(emotion || "").toLowerCase();

const entryForSelectedWord = useMemo(() => {
  return meta?.[emotion] || meta?.[lower] || null;
}, [meta, emotion, lower]);

    
    const needsForSelectedWord = Array.isArray(entryForSelectedWord?.needs) ? entryForSelectedWord.needs : [];

  const [selectedCause, setSelectedCause] = useState("");
  const [selectedReplacement, setSelectedReplacement] = useState("");
  const [selectedNeed, setSelectedNeed] = useState("");

    const modalScrollRef = useRef(null);

  // Violent: violation key + observation pick
  const [selectedViolationKey, setSelectedViolationKey] = useState("");
  const [selectedViolentObs, setSelectedViolentObs] = useState("");

  // Accountable: violation key + observation pick
  const [selectedAccountableKey, setSelectedAccountableKey] = useState("");
  const [selectedAccountableObs, setSelectedAccountableObs] = useState("");

  // Interoception
  const [intero, setIntero] = useState([blankIntero(), blankIntero(), blankIntero()]);
  const [activeInteroTab, setActiveInteroTab] = useState(0);

  // Local log
  const [logCount, setLogCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const [showLog, setShowLog] = useState(false);

  const replacementEntry = useMemo(() => {
  const r = String(selectedReplacement || "").trim();
  if (!r) return null;
  return meta?.[r] || meta?.[r.toLowerCase()] || null;
}, [meta, selectedReplacement]);

const definitionTitle = mode === "violent" && selectedReplacement
  ? selectedReplacement
  : emotion;

const emotionDefinition =
  mode === "violent"
    ? (entryForSelectedWord?.definition || replacementEntry?.definition || "")
    : (entryForSelectedWord?.definition || "");

useEffect(() => {
  if (!open) return;
  setLogCount(loadLog().length);

  requestAnimationFrame(() => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  });
}, [open]);


  // Reset when emotion changes
  useEffect(() => {
    setSelectedCause("");
    setSelectedReplacement("");
    setSelectedNeed("");

    setSelectedViolationKey("");
    setSelectedViolentObs("");

    setSelectedAccountableKey("");
    setSelectedAccountableObs("");

    setIntero([blankIntero(), blankIntero(), blankIntero()]);
    setActiveInteroTab(0);

    setSaveStatus("");
    setShowLog(false);
  }, [emotion]);

  // When changing violation, clear observation pick
  useEffect(() => {
    setSelectedViolentObs("");
  }, [selectedViolationKey]);

  useEffect(() => {
    setSelectedAccountableObs("");
  }, [selectedAccountableKey]);

  // Escape closes modal
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Triggers (violent)
  const violentInfo = causeIndex?.[lower] || null;
  const causes = Array.isArray(violentInfo?.causes) ? violentInfo.causes : [];

  // Needs come from replacement emotion in violent mode
  const replacementNeeds = useMemo(() => {
    const r = String(selectedReplacement || "").trim();
    if (!r) return [];
    const e = meta?.[r] || meta?.[r.toLowerCase()] || null;
    return Array.isArray(e?.needs) ? e.needs : [];
  }, [selectedReplacement, meta]);

  const needsList = mode === "violent" ? replacementNeeds : needsForSelectedWord;

const allNeeds = useMemo(() => {
  const global = Array.isArray(needsSupplement?.global) ? needsSupplement.global : [];

  const primary = Array.isArray(needsList) ? needsList.map(String) : [];
  const merged = uniqStrings([...primary, ...global]);

  // Keep the emotion-specific needs first, then fill with supplemental needs.
  return merged.slice(0, 10);
}, [needsList, needsSupplement]);
  // Auto-set selectedNeed
  useEffect(() => {
    if (!allNeeds || allNeeds.length === 0) return;
    const normalized = allNeeds.map((n) => String(n));
    if (!selectedNeed || !normalized.includes(selectedNeed)) {
      setSelectedNeed(String(allNeeds[0]));
    }
  }, [allNeeds, selectedNeed]);

  // Intero tab visibility + auto-advance
  const visibleInteroTabs = useMemo(() => {
    let v = 1;
    if (isCompleteIntero(intero[0])) v = 2;
    if (isCompleteIntero(intero[0]) && isCompleteIntero(intero[1])) v = 3;
    return v;
  }, [intero]);

  useEffect(() => {
    if (activeInteroTab === 0 && isCompleteIntero(intero[0])) setActiveInteroTab(1);
    if (activeInteroTab === 1 && isCompleteIntero(intero[1])) setActiveInteroTab(2);
  }, [intero, activeInteroTab]);

  function setInteroRegion(idx, region) {
    setIntero((prev) => {
      const next = prev.slice();
      next[idx] = { region, sensation: "" };
      return next;
    });
  }

  function setInteroSensation(idx, sensation) {
    setIntero((prev) => {
      const next = prev.slice();
      next[idx] = { ...next[idx], sensation };
      return next;
    });
  }

  const interoLines = useMemo(() => interoSentences(intero), [intero]);
  const hasIntero = interoLines.length > 0;

  // -------------------------
  // Reframe + request
  // -------------------------
  const requestText = useMemo(() => {
    const need = selectedNeed || "____";
    return `Would you be willing to ____ so I can have more ${need}?`;
  }, [selectedNeed]);

  const violentReframeSentence = useMemo(() => {
    if (mode !== "violent") return "";
    if (!selectedCause || !selectedReplacement) return "";
    const obs = neutralizeTrigger(selectedCause);
    const feeling = selectedReplacement;
    const needSlot = selectedNeed ? selectedNeed : "____";
    return `When ${obs}, I feel ${feeling} because I need ${needSlot}.`;
  }, [mode, selectedCause, selectedReplacement, selectedNeed]);

  const nonviolentReframeSentence = useMemo(() => {
    const needSlot = selectedNeed ? selectedNeed : "____";
    return `When I observe ____, I feel ${emotion} because I need ${needSlot}.`;
  }, [emotion, selectedNeed]);

  // ---- Observation dropdown string parsing ----
  const violentObsText = useMemo(() => {
    const v = String(selectedViolentObs || "");
    if (!v) return "";
    const parts = v.split("::");
    return parts.length >= 2 ? parts.slice(1).join("::") : v;
  }, [selectedViolentObs]);

  const accountableObsText = useMemo(() => {
    const v = String(selectedAccountableObs || "");
    if (!v) return "";
    const parts = v.split("::");
    return parts.length >= 2 ? parts.slice(1).join("::") : v;
  }, [selectedAccountableObs]);
async function handleSaveEntry() {
  try {
    setSaveStatus("Saving…");
    const pngDataUrl = await captureElementPng("#stickCapture");

    appendReflectionEntry({
      type: mode === "violent" ? "violent" : "nonviolent",

      emotion,
      title: "",
      side: "",

      need: selectedNeed || "",
      needs_met: "",

      reframe:
        mode === "violent"
          ? (violentReframeSentence || "")
          : (accountableObsText
              ? `When ${accountableObsText}, I feel ${emotion} because I need ${selectedNeed || "____"}.`
              : nonviolentReframeSentence || ""),

      request: requestText || "",

      cause: mode === "violent" ? selectedCause || "" : "",
      replacement: mode === "violent" ? selectedReplacement || "" : "",

      violationKey: mode === "violent" ? selectedViolationKey || "" : "",
      accountableViolationKey: mode !== "violent" ? selectedAccountableKey || "" : "",

      observation: mode !== "violent" ? accountableObsText || "" : "",
      theology_key: "",

      gratitude_prompt: "",
      gratitude_text: "",

      intero: intero.filter((x) => x?.region && x?.sensation),
      pngDataUrl,
    });

    setLogCount(loadReflectionLog().length);
    setSaveStatus("Saved ✓");
    setTimeout(() => setSaveStatus(""), 900);
  } catch (e) {
    setSaveStatus("Save failed");
    console.error(e);
  }
}
  async function handleExportZip() {
    try {
      setSaveStatus("Exporting…");

      const entries = loadLog();
      if (!Array.isArray(entries) || entries.length === 0) {
        setSaveStatus("Nothing to export");
        setTimeout(() => setSaveStatus(""), 900);
        return;
      }

      const makeImageName = (e, idx) => {
        const id = String(e?.id || "").trim();
        if (id) return `entry-${id}.png`;
        return `entry-${String(idx + 1).padStart(4, "0")}.png`;
      };

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
        "image_file",
      ].join(",");

      const lines = entries.map((e, idx) => {
        const imageFile = makeImageName(e, idx);

        const body = (Array.isArray(e?.intero) ? e.intero : [])
          .map((x) => `${String(x?.region || "").replaceAll("_", " ")}: ${String(x?.sensation || "")}`)
          .filter((s) => s.trim() && !s.startsWith(":"))
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
          csvEscape(imageFile),
        ].join(",");
      });

      const csv = [header, ...lines].join("\n");

      const zip = new JSZip();
      zip.file("entries.csv", csv);

      const imgFolder = zip.folder("images");
      entries.forEach((e, idx) => {
        if (!e?.pngDataUrl) return;
        const name = makeImageName(e, idx);
        imgFolder.file(name, dataUrlToUint8Array(e.pngDataUrl));
      });

      const yyyyMmDd = new Date().toISOString().slice(0, 10);
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `emotion-log-${yyyyMmDd}.zip`);

      setSaveStatus("Exported ✓");
      setTimeout(() => setSaveStatus(""), 900);
    } catch (e) {
      setSaveStatus("Export failed");
      console.error(e);
    }
  }

  function handleClearLog() {
    clearLog();
    setLogCount(0);
    setShowLog(false);
    setSaveStatus("Cleared ✓");
    setTimeout(() => setSaveStatus(""), 900);
  }

  const logEntries = useMemo(() => (showLog ? loadLog() : []), [showLog, logCount]);

  // active intero tab item
  const active = useMemo(() => intero[activeInteroTab] || blankIntero(), [intero, activeInteroTab]);

  // ---- Select options ----
  const regionOptions = useMemo(
    () => Object.keys(BODY_MAP).map((r) => ({ value: r, label: r.replaceAll("_", " ") })),
    [],
  );

  const sensationOptions = useMemo(() => {
    if (!active.region) return [];
    return (BODY_MAP[active.region] || []).map((s) => ({ value: s, label: s }));
  }, [active.region]);

  const causeOptions = useMemo(() => (causes || []).map((c) => ({ value: c, label: c })), [causes]);

  const replacementSelectOptions = useMemo(
    () => (replacementOptions || []).map((r) => ({ value: r, label: r })),
    [replacementOptions],
  );

  // Don't render until open (after hooks)
  if (!open) return null;

  return (
           <div
             ref={modalScrollRef}

      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
background: "transparent",
backdropFilter: "none",
overflowY: "auto",
        padding: 16,
        zIndex: 9999,
      }}
    >
          <div
  style={{
    width: "min(920px, 100%)",
    margin: "40px auto",
    borderRadius: 18,
    border: `1px solid ${overlayHex || "rgba(255,255,255,0.12)"}`,
    background: "rgba(16,22,30,0.96)",
    color: "rgba(255,255,255,0.94)",
    boxShadow: overlayHex
      ? `0 20px 60px rgba(0,0,0,0.55), 0 0 0 2px ${overlayHex}44`
      : "0 20px 60px rgba(0,0,0,0.55)",
    overflow: "hidden",
    position: "relative",
  }}
>
  
  <div
  aria-hidden="true"
  style={{
    height: 4,
    width: "100%",
    background: overlayHex || "rgba(255,255,255,0.18)",
  }}
/>
        {/* Header */}
        <div
  style={{
    padding: 18,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
  }}
>
  <div style={{ display: "grid", gap: 8, maxWidth: 560 }}>
  <div
  style={{
    fontSize: 32,
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: 0.2,
    color: "rgba(255,255,255,0.98)",
  }}
>
  {definitionTitle}
</div>

{emotionDefinition ? (
  <div
    style={{
      fontSize: 14,
      lineHeight: 1.45,
      color: "rgba(255,255,255,0.82)",
      maxWidth: 560,
      marginTop: 4,
    }}
  >
    {emotionDefinition}
  </div>
) : null} 

    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
    </div>
  </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowLog((v) => !v)}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)",
                padding: "10px 12px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {showLog ? "Hide log" : "View log"}
            </button>

            <button
              onClick={handleSaveEntry}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.92)",
                padding: "10px 12px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Save entry
            </button>

            <button
              onClick={handleExportZip}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)",
                padding: "10px 12px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Export ZIP
            </button>

            <button
              onClick={handleClearLog}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,120,120,0.12)",
                color: "rgba(255,255,255,0.92)",
                padding: "10px 12px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Clear log (device)
            </button>

            <button
              onClick={onClose}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)",
                padding: "10px 12px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: 16,
            display: "grid",
            gap: 14,
                    }}
        >          {/* Optional log panel */}
          {showLog && (
            <Panel style={{ display: "grid", gap: 10 }}>
              <div style={{ fontWeight: 900 }}>Log (this device)</div>

              {logEntries.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13 }}>(No saved entries yet.)</div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {logEntries.slice(0, 20).map((e) => {
                    const when = new Date(e.ts).toLocaleString();
                    return (
                      <div
                        key={e.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "84px 1fr",
                          gap: 10,
                          alignItems: "center",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: 12,
                          padding: 10,
                          background: "rgba(0,0,0,0.18)",
                        }}
                      >
                        <div
                          style={{
                            width: 84,
                            height: 110,
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(0,0,0,0.25)",
                            overflow: "hidden",
                          }}
                        >
                          {e.pngDataUrl ? (
                            <img src={e.pngDataUrl} alt="entry figure" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", padding: 8 }}>no image</div>
                          )}
                        </div>

                        <div style={{ display: "grid", gap: 4 }}>
                          <div style={{ fontWeight: 800 }}>
                            {e.emotion} {e.need ? `• need: ${e.need}` : ""}
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>{when}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
                            {(e.intero || [])
                              .map((x) => `${String(x.region).replaceAll("_", " ")}: ${x.sensation}`)
                              .join(" | ")}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {logEntries.length > 20 && (
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>
                      Showing 20 most recent entries. Export ZIP for the full list.
                    </div>
                  )}
                </div>
              )}
            </Panel>
          )}

          {/* 1) Somatic awareness */}
          <Panel style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 900 }}>1) I feel this emotion in my body by…</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
                alignItems: "start",
              }}
            >
              {/* Left controls */}
              <div style={{ display: "grid", gap: 10 }}>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Array.from({ length: visibleInteroTabs }).map((_, i) => {
                    const done = isCompleteIntero(intero[i]);
                    const activeTab = i === activeInteroTab;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveInteroTab(i)}
                        style={{
                          borderRadius: 999,
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: activeTab ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
                          padding: "6px 10px",
                          fontSize: 13,
                          color: "rgba(255,255,255,0.90)",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        title={done ? "Completed" : "In progress"}
                      >
                        {i + 1}
                        <span style={{ opacity: done ? 1 : 0.55 }}>{done ? "✓" : "…"}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dropdowns */}
                <div style={{ display: "grid", gap: 8 }}>
                  <Select
                    value={active.region}
                    onChange={(v) => setInteroRegion(activeInteroTab, v)}
                    placeholder="Select body region…"
                    options={regionOptions}
                  />

                  {active.region ? (
                    <Select
                      value={active.sensation}
                      onChange={(v) => setInteroSensation(activeInteroTab, v)}
                      placeholder="Select sensation…"
                      options={sensationOptions}
                    />
                  ) : null}

                  {active.region && active.sensation && (
                    <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
                      I feel <b>{active.sensation}</b> in my <b>{active.region.replaceAll("_", " ")}</b>.
                    </div>
                  )}
                </div>

                {/* Summary */}
                {hasIntero && (
                  <div style={{ marginTop: 4, display: "grid", gap: 6 }}>
                    {interoLines.map((line, idx) => (
                      <div key={idx} style={{ color: "rgba(255,255,255,0.80)", fontSize: 13 }}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}>
                  Body sensations are not proof of meaning. They are signals that help identify needs.
                </div>
              </div>

              {/* Right stick figure (THIS is what we screenshot) */}
              <div
                id="stickCapture"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 14,
                  padding: 10,
                  background: "rgba(0,0,0,0.20)",
                  display: "grid",
                  placeItems: "center",
                  minHeight: 260,
                }}
              >
                <InteroStickFigure intero={intero} />
              </div>
            </div>
          </Panel>

          {mode === "violent" && (
  <>
    {/* 2) Trigger */}
    <Panel style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 900 }}>2) What might have triggered this accusation?</div>

      {causes.length ? (
        <Select
          value={selectedCause}
          onChange={setSelectedCause}
          placeholder="Select a trigger…"
          options={causeOptions}
        />
      ) : (
        <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
          (No trigger list found for this word in VIOLENT2.json.)
        </div>
      )}
    </Panel>

    {/* 3) Replacement emotion */}
    <Panel style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 900 }}>3) Say it without blame (choose a nonviolent emotion)</div>

      {Array.isArray(replacementOptions) && replacementOptions.length ? (
        <Select
          value={selectedReplacement}
          onChange={setSelectedReplacement}
          placeholder="Select a replacement emotion…"
          options={replacementSelectOptions}
        />
      ) : (
        <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
          (No replacement options loaded.)
        </div>
      )}
    </Panel>

    {/* 4-6 container */}
    <Panel style={{ display: "grid", gap: 10 }}>
      {/* 4) Need */}
      <div style={{ fontWeight: 900 }}>4) Choose the need</div>

      {allNeeds.length ? (
        <Chips items={allNeeds} value={selectedNeed} onChange={setSelectedNeed} />
      ) : (
        <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
          (No needs found. Check emotion_meta.json and NEEDS_SUPPLEMENT.json.)
        </div>
      )}

      {/* 5) Accountability */}
      <AccountabilityBlock
        master={master}
        selectedKey={selectedViolationKey}
        onChangeKey={setSelectedViolationKey}
        selectedObs={selectedViolentObs}
        onChangeObs={setSelectedViolentObs}
        title="5) Accountability (behavior → shared value broken → repair)"
        mode="violent"
        autoGuessText={selectedCause}
        copyBlock={null}
      />

      {/* 6) Nonviolent summary */}
      <div style={{ fontWeight: 900 }}>6) Nonviolent communication summary</div>
      <div style={{ color: "rgba(255,255,255,0.90)", fontSize: 14, lineHeight: 1.45 }}>
        {violentReframeSentence || "Select a trigger and replacement emotion first."}
      </div>

      {hasIntero && (
        <div style={{ color: "rgba(255,255,255,0.80)", fontSize: 13, lineHeight: 1.45 }}>
          {interoLines.join(" ")}
        </div>
      )}

      {/* 7) Optional request */}
      <div style={{ fontWeight: 900, marginTop: 8 }}>7) Optional request</div>
      <div style={{ color: "rgba(255,255,255,0.90)", fontSize: 14, lineHeight: 1.45 }}>
        {requestText}
      </div>
    </Panel>
  </>
)}

          {mode !== "violent" && (
  <Panel style={{ display: "grid", gap: 12 }}>
    {/* 1) Need */}
    <div style={{ fontWeight: 900 }}>1) Choose the need</div>

    {allNeeds.length ? (
      <Chips items={allNeeds} value={selectedNeed} onChange={setSelectedNeed} />
    ) : (
      <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
        (No needs listed for this word yet.)
      </div>
    )}

    {/* 2) Accountability */}
    <AccountabilityBlock
      master={master}
      selectedKey={selectedAccountableKey}
      onChangeKey={setSelectedAccountableKey}
      selectedObs={selectedAccountableObs}
      onChangeObs={setSelectedAccountableObs}
      title="2) Accountability (behavior → shared value broken → repair)"
      mode="accountable"
      copyBlock={null}
    />

    {/* 3) Nonviolent reframe */}
    <div style={{ fontWeight: 900 }}>3) Nonviolent communication summary</div>
    <div style={{ color: "rgba(255,255,255,0.90)", fontSize: 14, lineHeight: 1.45 }}>
      {accountableObsText
        ? `When ${accountableObsText}, I feel ${emotion} because I need ${selectedNeed || "____"}.`
        : nonviolentReframeSentence}
    </div>

    {hasIntero && (
      <div style={{ color: "rgba(255,255,255,0.80)", fontSize: 13, lineHeight: 1.45 }}>
        {interoLines.join(" ")}
      </div>
    )}

    {/* 4) Request */}
    <div style={{ fontWeight: 900 }}>4) Optional request</div>
    <div style={{ color: "rgba(255,255,255,0.90)", fontSize: 14, lineHeight: 1.45 }}>
      {requestText}
    </div>
  </Panel>
)}        </div>

        {/* Sticky bottom action bar */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 5,
            paddingTop: 10,
            paddingBottom: 10,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(16,22,30,0.96)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={handleSaveEntry}
            style={{
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.92)",
              padding: "10px 12px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Save entry
          </button>
        </div>

        {/* Footer note */}
        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", lineHeight: 1.45 }}>
            {mode === "violent"
              ? "Accusatory words often imply motive or define the other person. This flow converts the trigger into a neutral observation + feeling + need (and a request)."
              : "Nonviolent emotions can be translated into a need and a concrete request."}
          </div>
        </div>
      </div>
    </div>
  );
}