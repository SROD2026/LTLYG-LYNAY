// src/components/EmotionModal.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import Panel from "../ui/Panel.jsx";
import Select from "../ui/Select.jsx";
import Chips from "../ui/Chips.jsx";
import InteroSceneFigure from "../intero/InteroSceneFigure.jsx";
import BehavioralViolationBlock from "./BehavioralViolationBlock.jsx";
import ChristAlignmentBlock from "./ChristAlignmentBlock.jsx";
import {
  csvEscape,
  dataUrlToUint8Array,
  downloadBlob,
  captureElementPng,
} from "../../utils/exportHelpers.js";

import { cellColor } from "../../utils/color.js";
import { uniqStrings } from "../../utils/data.js";
import { buildRequestFlow } from "../../utils/flowEngine.js";
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

function clearLog() {
  localStorage.removeItem(LOG_KEY);
}

// -------------------------
// Helpers
// -------------------------
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
  Throat: [
    "Lump",
    "Tightness",
    "Difficulty speaking",
    "Dryness",
    "Choking sensations",
    "Strained voice",
  ],
  Arms_and_Hands: [
    "Tingling",
    "Restlessness",
    "Clenching",
    "Shaking",
    "Coldness",
    "Urge to move",
    "Numbness",
  ],
  Legs_and_Feet: [
    "Restless",
    "Weak / collapsing",
    "Frozen / stuck",
    "Urge to flee",
    "Grounded heaviness",
    "Instability",
  ],
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

function SingleResponseCard({
  text,
  buttonLabel = "Next",
  onNext,
  showButton = true,
}) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 12,
          padding: 10,
          background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.92)",
          fontSize: 14,
          lineHeight: 1.45,
        }}
      >
        {text}
      </div>

      {showButton ? (
        <div>
          <button className="btn" type="button" onClick={onNext}>
            {buttonLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function EmotionModal({
  open,
  onClose,
  cell,
  meta,
  master,
  mode = "blameless",
  causeIndex = {},
  replacementOptions = [],
  needsSupplement = { global: [] },
}) {
  const overlayHex = useMemo(() => {
    if (!cell) return null;
    if (mode !== "violent") return cellColor(cell.x, cell.y);

    const { x = 0, y = 0 } = cell || {};
    const quadrant =
      x >= 0 && y >= 0 ? "Q1" : x < 0 && y >= 0 ? "Q2" : x < 0 && y < 0 ? "Q3" : "Q4";

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
  const nextStepRef = useRef(null);
  const modalCardRef = useRef(null);
  const interoCaptureRef = useRef(null);

  const entryForSelectedWord = useMemo(() => {
    return meta?.[emotion] || meta?.[lower] || null;
  }, [meta, emotion, lower]);

  const needsForSelectedWord = Array.isArray(entryForSelectedWord?.needs)
    ? entryForSelectedWord.needs
    : [];

  const [selectedCause, setSelectedCause] = useState("");
  const [selectedReplacement, setSelectedReplacement] = useState("");
  const [selectedNeed, setSelectedNeed] = useState("");

  const [selectedViolationKey, setSelectedViolationKey] = useState("");
  const [selectedViolentObs, setSelectedViolentObs] = useState("");

  const [selectedAccountableKey, setSelectedAccountableKey] = useState("");
  const [selectedAccountableObs, setSelectedAccountableObs] = useState("");

  const [requestIndex, setRequestIndex] = useState(0);
  const [agreementIndex, setAgreementIndex] = useState(0);
  const [repairStepIndex, setRepairStepIndex] = useState(0);

  const [intero, setIntero] = useState([blankIntero(), blankIntero(), blankIntero()]);
  const [activeInteroTab, setActiveInteroTab] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  const [logCount, setLogCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const [showLog, setShowLog] = useState(false);

  const [spacerHeight, setSpacerHeight] = useState(0);
  const [contextNotes, setContextNotes] = useState("");

  const replacementEntry = useMemo(() => {
    const r = String(selectedReplacement || "").trim();
    if (!r) return null;
    return meta?.[r] || meta?.[r.toLowerCase()] || null;
  }, [meta, selectedReplacement]);

  const definitionTitle =
    mode === "violent" && selectedReplacement ? selectedReplacement : emotion;

  const definitionText =
    mode === "violent"
      ? entryForSelectedWord?.definition || replacementEntry?.definition || ""
      : entryForSelectedWord?.definition || "";

  const requestFlow = useMemo(() => buildRequestFlow(selectedNeed), [selectedNeed]);
  const suggestedRequests = requestFlow.requests || [];
  const suggestedAgreements = requestFlow.agreements || [];
  const suggestedRepairSteps = requestFlow.repairSteps || [];

  useEffect(() => {
    if (!open) return;
    setLogCount(loadReflectionLog().length);
  }, [open]);

  useEffect(() => {
    setRequestIndex(0);
  }, [suggestedRequests]);

  useEffect(() => {
    setAgreementIndex(0);
  }, [suggestedAgreements]);

  useEffect(() => {
    setRepairStepIndex(0);
  }, [suggestedRepairSteps]);

  useEffect(() => {
    if (!open || !cell) return;

    const id = setTimeout(() => {
      nextStepRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => clearTimeout(id);
  }, [open, cell]);

  useEffect(() => {
    if (!open) return;

    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    function measure() {
      if (!modalCardRef.current) return;
      const rect = modalCardRef.current.getBoundingClientRect();
      setSpacerHeight(rect.height + 64);
    }

    measure();
    const id = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, [
    open,
    showLog,
    selectedCause,
    selectedReplacement,
    selectedNeed,
    selectedViolationKey,
    selectedAccountableKey,
    intero,
  ]);

  useEffect(() => {
    setSelectedViolentObs("");
  }, [selectedViolationKey]);

  useEffect(() => {
    setSelectedAccountableObs("");
  }, [selectedAccountableKey]);

  const violentInfo = causeIndex?.[lower] || null;
  const causes = Array.isArray(violentInfo?.causes) ? violentInfo.causes : [];

  const replacementNeeds = useMemo(() => {
    const r = String(selectedReplacement || "").trim();
    if (!r) return [];
    const e = meta?.[r] || meta?.[r.toLowerCase()] || null;
    return Array.isArray(e?.needs) ? e.needs : [];
  }, [selectedReplacement, meta]);

  const needsList = mode === "violent" ? replacementNeeds : needsForSelectedWord;
  

const [showAllNeeds, setShowAllNeeds] = useState(false);
const [customNeed, setCustomNeed] = useState("");

const baseTopNeeds = useMemo(() => {
  const primary = Array.isArray(needsList) ? needsList.map(String) : [];
  return uniqStrings(primary).slice(0, 5);
}, [needsList]);

const globalNeeds = useMemo(() => {
  const global = Array.isArray(needsSupplement?.global)
    ? needsSupplement.global.map(String)
    : [];
  return uniqStrings(global);
}, [needsSupplement]);

const topNeeds = useMemo(() => {
  if (!customNeed) return baseTopNeeds;

  const rest = baseTopNeeds.filter((n) => String(n) !== String(customNeed));
  return [customNeed, ...rest].slice(0, 5);
}, [baseTopNeeds, customNeed]);

const visibleNeeds = useMemo(() => {
  return showAllNeeds ? globalNeeds : topNeeds;
}, [showAllNeeds, globalNeeds, topNeeds]);

useEffect(() => {
  setSelectedCause("");
  setSelectedReplacement("");
  setSelectedNeed("");
  setShowAllNeeds(false);
setCustomNeed("");

  setSelectedViolationKey("");
  setSelectedViolentObs("");

  setSelectedAccountableKey("");
  setSelectedAccountableObs("");

  setIntero([blankIntero(), blankIntero(), blankIntero()]);
  setActiveInteroTab(0);
  setEditingIndex(null);

  setContextNotes("");
  setSaveStatus("");
  setRequestIndex(0);
  setAgreementIndex(0);
  setRepairStepIndex(0);
}, [emotion]);

useEffect(() => {
  const available = showAllNeeds ? globalNeeds : topNeeds;
  if (!available.length) return;

  const normalized = available.map((n) => String(n));
  if (!selectedNeed || !normalized.includes(selectedNeed)) {
    setSelectedNeed(String(available[0]));
  }
}, [topNeeds, globalNeeds, showAllNeeds, selectedNeed]);

  const visibleInteroTabs = useMemo(() => {
    let v = 1;
    if (isCompleteIntero(intero[0])) v = 2;
    if (isCompleteIntero(intero[0]) && isCompleteIntero(intero[1])) v = 3;
    return v;
  }, [intero]);

  useEffect(() => {
    if (editingIndex !== null) return;
    if (activeInteroTab === 0 && isCompleteIntero(intero[0])) setActiveInteroTab(1);
    if (activeInteroTab === 1 && isCompleteIntero(intero[1])) setActiveInteroTab(2);
  }, [intero, activeInteroTab, editingIndex]);

  function setInteroRegion(idx, region) {
    setIntero((prev) => {
      const next = prev.slice();
      const prior = next[idx] || blankIntero();

      next[idx] = {
        region,
        sensation: prior.region === region ? prior.sensation : "",
      };

      return next;
    });
  }

function handleNeedPick(need) {
  setSelectedNeed(need);

  if (showAllNeeds) {
    setCustomNeed(need);
    setShowAllNeeds(false);
  }
}

  function setInteroSensation(idx, sensation) {
    setIntero((prev) => {
      const next = prev.slice();
      next[idx] = { ...next[idx], sensation };
      return next;
    });

    if (editingIndex === idx) {
      setEditingIndex(null);
    }
  }

  function editInteroSlot(idx) {
    setActiveInteroTab(idx);
    setEditingIndex(idx);
  }

  function clearInteroSlot(idx) {
    setIntero((prev) => {
      const next = prev.slice();
      next[idx] = blankIntero();
      return next;
    });

    setEditingIndex((prev) => (prev === idx ? null : prev));
    setActiveInteroTab(idx);
  }

  const interoLines = useMemo(() => interoSentences(intero), [intero]);
  const hasIntero = interoLines.length > 0;

  const requestText = useMemo(() => {
    const need = selectedNeed || "____";
    return `Would you be willing to ____ so I can have more ${need}?`;
  }, [selectedNeed]);

  const violentObservationText = useMemo(() => {
  const v = String(selectedViolentObs || "");
  if (!v) return "";
  const parts = v.split("::");
  return parts.length >= 2 ? parts.slice(1).join("::") : v;
}, [selectedViolentObs]);

const violentReframeSentence = useMemo(() => {
  if (mode !== "violent") return "";
  if (!violentObservationText || !selectedReplacement) return "";
  const feeling = selectedReplacement;
  const needSlot = selectedNeed || "____";
  return `When ${violentObservationText}, I feel ${feeling} because I need ${needSlot}.`;
}, [mode, violentObservationText, selectedReplacement, selectedNeed]);


  const nonviolentReframeSentence = useMemo(() => {
    const needSlot = selectedNeed || "____";
    return `When I observe ____, I feel ${emotion} because I need ${needSlot}.`;
  }, [emotion, selectedNeed]);

  const accountableObsText = useMemo(() => {
    const v = String(selectedAccountableObs || "");
    if (!v) return "";
    const parts = v.split("::");
    return parts.length >= 2 ? parts.slice(1).join("::") : v;
  }, [selectedAccountableObs]);

async function handleSaveEntry() {
  try {
    setSaveStatus("Saving…");

    let pngDataUrl = "";
    try {
      pngDataUrl = await captureElementPng(interoCaptureRef.current);
    } catch (err) {
      console.warn("PNG capture failed:", err);
    }

    appendReflectionEntry({
      type: mode === "violent" ? "violent" : "nonviolent",
      emotion,
      title: "",
      side: "",
      need: selectedNeed || "",
      needs_met: "",
      x: cell?.x || 0,
      y: cell?.y || 0,
      reframe:
        mode === "violent"
          ? violentReframeSentence || ""
          : accountableObsText
            ? `When ${accountableObsText}, I feel ${emotion} because I need ${selectedNeed || "____"}.`
            : nonviolentReframeSentence || "",
      request: requestText || "",
      context_notes: contextNotes.trim(),
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
    setSaveStatus("Emotional State Saved ✓");
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
        "context_notes",
        "image_file",
      ].join(",");

      const lines = entries.map((e, idx) => {
        const imageFile = makeImageName(e, idx);

        const body = (Array.isArray(e?.intero) ? e.intero : [])
          .map(
            (x) =>
              `${String(x?.region || "").replaceAll("_", " ")}: ${String(x?.sensation || "")}`,
          )
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
          csvEscape(e?.context_notes || ""),
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

  const logEntries = useMemo(
    () => (showLog ? loadReflectionLog() : []),
    [showLog, logCount],
  );

  const active = useMemo(
    () => intero[activeInteroTab] || blankIntero(),
    [intero, activeInteroTab],
  );

  const regionOptions = useMemo(
    () => Object.keys(BODY_MAP).map((r) => ({ value: r, label: r.replaceAll("_", " ") })),
    [],
  );

  const sensationOptions = useMemo(() => {
    if (!active.region) return [];
    return (BODY_MAP[active.region] || []).map((s) => ({ value: s, label: s }));
  }, [active.region]);

  const causeOptions = useMemo(
    () => (causes || []).map((c) => ({ value: c, label: c })),
    [causes],
  );

  const replacementSelectOptions = useMemo(
    () => (replacementOptions || []).map((r) => ({ value: r, label: r })),
    [replacementOptions],
  );

  if (!open) return null;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          margin: "24px auto 40px",
          height: spacerHeight,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />

      <div
        className="modalBackdrop"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          overflowY: "auto",
          display: "grid",
          background: "rgba(10,12,20,0.52)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
      >
        <div
          ref={modalCardRef}
          className="modalCard"
          style={{
            justifySelf: "center",
            position: "relative",
            borderRadius: 18,
            border: `2px solid ${overlayHex || "rgba(255,255,255,0.12)"}`,
            background: "rgba(16,22,30,0.96)",
            color: "rgba(255,255,255,0.94)",
            boxShadow: overlayHex
              ? `0 20px 60px rgba(0,0,0,0.55), 0 0 0 2px ${overlayHex}44`
              : "0 20px 60px rgba(0,0,0,0.55)",
            overflow: "visible",
            top: 0,
            left: 0,
            right: 0,
            pointerEvents: "auto",
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

          <div ref={nextStepRef}>
            <div
              className="modalHeader"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 16,
                alignItems: "start",
              }}
            >
              <div style={{ display: "grid", gap: 8, minWidth: 0, maxWidth: 620 }}>
                <div
                  className="modalTitle"
                  style={{
                    fontSize: "clamp(28px, 7vw, 32px)",
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: 0.2,
                    color: "rgba(255,255,255,0.98)",
                  }}
                >
                  {definitionTitle}
                </div>

                {definitionText ? (
                  <div
                    className="modalSubtitle"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.45,
                      color: "rgba(255,255,255,0.82)",
                      maxWidth: 560,
                      marginTop: 4,
                    }}
                  >
                    {definitionText}
                  </div>
                ) : null}
              </div>

<div
  className="modalHeaderActions"
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    minWidth: 0,
  }}
>
  <button
    className="btn"
    onClick={handleSaveEntry}
    style={{
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.06)",
      color: "rgba(255,255,255,0.92)",
      padding: "10px 14px",
      fontSize: 14,
      cursor: "pointer",
      minWidth: 132,
    }}
  >
    Save entry
  </button>

  <button
    onClick={onClose}
    style={{
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.06)",
      color: "rgba(255,255,255,0.92)",
      padding: "10px 14px",
      fontSize: 14,
      cursor: "pointer",
      minWidth: 132,
    }}
  >
    Close
  </button>
</div>
</div>

            <div
              style={{
                padding: "0 18px 18px",
                display: "grid",
                gap: 14,
                overflow: "visible",
              }}
            >
              


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
                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {Array.from({ length: visibleInteroTabs }).map((_, idx) => {
                        const slot = intero[idx];
                        const complete = isCompleteIntero(slot);
                        const activeTab = activeInteroTab === idx;
                        const editing = editingIndex === idx;

                        return (
                          <button
                            key={idx}
                            className="btn"
                            onClick={() => editInteroSlot(idx)}
                            style={{
                              padding: "8px 12px",
                              fontSize: 13,
                              borderRadius: 999,
                              background: activeTab
                                ? "rgba(255,255,255,0.24)"
                                : complete
                                  ? "rgba(255,255,255,0.14)"
                                  : "rgba(255,255,255,0.08)",
                              border: editing
                                ? "1px solid rgba(255,255,255,0.34)"
                                : "1px solid rgba(255,255,255,0.12)",
                            }}
                          >
                            {editing ? `Editing ${idx + 1}` : `Sensation ${idx + 1}`}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: "grid", gap: 8 }}>
                      {editingIndex !== null ? (
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.76)",
                          }}
                        >
                          Editing sensation {editingIndex + 1}
                        </div>
                      ) : null}

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

                      {active.region && active.sensation ? (
                        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
                          I feel <b>{active.sensation}</b> in my{" "}
                          <b>{active.region.replaceAll("_", " ")}</b>.
                        </div>
                      ) : null}
                    </div>

                    {interoLines.length ? (
                      <div style={{ display: "grid", gap: 8 }}>
                        <div style={{ fontWeight: 900, fontSize: 13 }}>Named body experience</div>

                        <div style={{ display: "grid", gap: 8 }}>
                          {intero.map((item, idx) => {
                            if (!isCompleteIntero(item)) return null;

                            return (
                              <div
                                key={`${item.region}-${item.sensation}-${idx}`}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr auto auto",
                                  gap: 8,
                                  alignItems: "center",
                                  padding: "8px 10px",
                                  borderRadius: 12,
                                  border: "1px solid rgba(255,255,255,0.10)",
                                  background: "rgba(255,255,255,0.05)",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 13,
                                    lineHeight: 1.45,
                                    color: "rgba(255,255,255,0.92)",
                                  }}
                                >
                                  <strong>{idx + 1}.</strong>{" "}
                                  {item.region.replaceAll("_", " ")} — {item.sensation}
                                </div>

                                <button
                                  className="btn"
                                  onClick={() => editInteroSlot(idx)}
                                  style={{ padding: "6px 10px", fontSize: 12, borderRadius: 10 }}
                                >
                                  Edit
                                </button>

                                <button
                                  className="btn"
                                  onClick={() => clearInteroSlot(idx)}
                                  style={{ padding: "6px 10px", fontSize: 12, borderRadius: 10 }}
                                >
                                  Clear
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}>
                      Body sensations are not proof of meaning. They are signals that help identify
                      needs.
                    </div>
                  </div>

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
                    <div ref={interoCaptureRef}>

<InteroSceneFigure
  intero={intero || []}
  emotion={cell?.emotion || ""}
  mode={mode === "violent" ? "violent" : "nvc"}
  x={cell?.x || 0}
  y={cell?.y || 0}
  width={320}
  height={320}
/>
</div>
</div>
                </div>
              </Panel>

              {mode === "violent" && (
                <>
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      margin: "4px 2px 2px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.68)",
                      }}
                    >
                      Nonviolent Communication Reframe
                    </div>
                    <div
                      aria-hidden="true"
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.22), rgba(255,255,255,0.03))",
                      }}
                    />
                  </div>

                             <Panel style={{ display: "grid", gap: 12 }}>
  <BehavioralViolationBlock
    master={master}
    selectedKey={selectedViolationKey}
    onChangeKey={setSelectedViolationKey}
    selectedObs={selectedViolentObs}
    onChangeObs={setSelectedViolentObs}
    title="2) Behavioral violation"
    mode="violent"
    autoGuessText={selectedCause}
  />
</Panel>

                  <Panel style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontWeight: 900 }}>
                      3) Say it without blame (choose a nonviolent emotion)
                    </div>

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

                  <Panel style={{ display: "grid", gap: 10 }}>
                    <div style={{ fontWeight: 900 }}>4) Choose the need</div>

                  {visibleNeeds.length ? (
  <div style={{ display: "grid", gap: 10 }}>
<Chips items={visibleNeeds} value={selectedNeed} onChange={handleNeedPick} />
    {!showAllNeeds ? (
      <div>
        <button
          className="btn"
          type="button"
          onClick={() => setShowAllNeeds(true)}
        >
          Other
        </button>
      </div>
    ) : (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          className="btn"
          type="button"
          onClick={() => setShowAllNeeds(false)}
        >
          Back to top needs
        </button>
      </div>
    )}
  </div>
) : (
  <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
    (No needs found.)
  </div>
)}

                    <div style={{ fontWeight: 900 }}>5) Nonviolent communication summary</div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.90)",
                        fontSize: 14,
                        lineHeight: 1.45,
                      }}
                    >
                      {violentReframeSentence ||
  "Select an observation and replacement emotion first."}
                    </div>

                    {hasIntero ? (
                      <div
                        style={{
                          color: "rgba(255,255,255,0.80)",
                          fontSize: 13,
                          lineHeight: 1.45,
                        }}
                      >
                        {interoLines.join(" ")}
                      </div>
                    ) : null}

 
                    <div style={{ display: "grid", gap: 12 }}>
                      <div style={{ fontWeight: 900 }}>6) Suggested requests</div>

                      {suggestedRequests.length ? (
                        <SingleResponseCard
                          text={suggestedRequests[requestIndex % suggestedRequests.length]}
                          buttonLabel="Another request"
                          showButton={suggestedRequests.length > 1}
                          onNext={() =>
                            setRequestIndex((i) => (i + 1) % suggestedRequests.length)
                          }
                        />
                      ) : (
                        <div
                          style={{
                            border: "1px solid rgba(255,255,255,0.10)",
                            borderRadius: 12,
                            padding: 10,
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.92)",
                            fontSize: 14,
                            lineHeight: 1.45,
                          }}
                        >
                          {requestText}
                        </div>
                      )}

                      {suggestedAgreements.length ? (
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={{ fontWeight: 900 }}>7) Possible agreements</div>

                          <SingleResponseCard
                            text={suggestedAgreements[agreementIndex % suggestedAgreements.length]}
                            buttonLabel="Another agreement"
                            showButton={suggestedAgreements.length > 1}
                            onNext={() =>
                              setAgreementIndex(
                                (i) => (i + 1) % suggestedAgreements.length,
                              )
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </Panel>

                  <Panel style={{ display: "grid", gap: 12 }}>
                    <div style={{ fontWeight: 900 }}>Context and details</div>

                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.55,
                        color: "rgba(255,255,255,0.86)",
                      }}
                    >
                      Add any concrete details, sequence of events, or clarifying context you want
                      saved with this entry.
                    </div>

                    <textarea
                      value={contextNotes}
                      onChange={(e) => setContextNotes(e.target.value)}
                      placeholder="What happened before, during, or after this moment?"
                      style={{
                        width: "100%",
                        minHeight: 140,
                        resize: "vertical",
                        borderRadius: 14,
                        padding: "14px 16px",
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.96)",
                        fontSize: 14,
                        lineHeight: 1.55,
                        outline: "none",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                        marginTop: 4,
                      }}
                    >
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>
                        {saveStatus || ""}
                      </div>

                      <button className="btn" onClick={handleSaveEntry}>
                        Save entry
                      </button>
                    </div>
                  </Panel>

                  <div
                    style={{
                      marginTop: 18,
                      paddingTop: 18,
                      borderTop: "1px solid rgba(255,255,255,0.10)",
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        opacity: 0.72,
                      }}
                    >
                      Repair responsibility for the harm (Christian accountability and repair)
                    </div>

                    <div
                      aria-hidden="true"
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.26), rgba(255,255,255,0.04))",
                      }}
                    />
                  </div>

  <ChristAlignmentBlock
    master={master}
    selectedKey={selectedViolationKey}
    title="8) Imitator of Christ value alignment"
  />

<Panel style={{ display: "grid", gap: 12 }}>
  {suggestedRepairSteps.length ? (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 900 }}>9) Stepwise repair</div>

      <Select
        value={String(repairStepIndex)}
        onChange={(value) => setRepairStepIndex(Number(value))}
        placeholder="Choose a repair step"
        options={suggestedRepairSteps.map((step, idx) => ({
          value: String(idx),
          label: `Step ${idx + 1}`,
        }))}
      />

      <SingleResponseCard
        text={suggestedRepairSteps[repairStepIndex] || suggestedRepairSteps[0]}
        buttonLabel="Next step"
        showButton={suggestedRepairSteps.length > 1}
        onNext={() =>
          setRepairStepIndex((i) => (i + 1) % suggestedRepairSteps.length)
        }
      />
    </div>
  ) : (
    <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
      (No repair steps generated for this need yet.)
    </div>
  )}
</Panel>
                  
                </>
              )}

              {mode !== "violent" && (
                <>
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      margin: "4px 2px 2px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.68)",
                      }}
                    >
                      Nonviolent Communication Reframe
                    </div>
                    <div
                      aria-hidden="true"
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.22), rgba(255,255,255,0.03))",
                      }}
                    />
                  </div>

          <Panel style={{ display: "grid", gap: 12 }}>
  <BehavioralViolationBlock
    master={master}
    selectedKey={selectedAccountableKey}
    onChangeKey={setSelectedAccountableKey}
    selectedObs={selectedAccountableObs}
    onChangeObs={setSelectedAccountableObs}
    title="2) Behavioral violation"
    mode="accountable"
  />
</Panel>

                  <Panel style={{ display: "grid", gap: 12 }}>
<div style={{ fontWeight: 900 }}>3) Choose the need</div>


{visibleNeeds.length ? (
  <div style={{ display: "grid", gap: 10 }}>
<Chips items={visibleNeeds} value={selectedNeed} onChange={handleNeedPick} />

    {!showAllNeeds ? (
      <div>
        <button
          className="btn"
          type="button"
          onClick={() => setShowAllNeeds(true)}
        >
          Other
        </button>
      </div>
    ) : (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          className="btn"
          type="button"
          onClick={() => setShowAllNeeds(false)}
        >
          Back to top needs
        </button>
      </div>
    )}
  </div>
) : (
  <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
    (No needs listed for this word yet.)
  </div>
)}
                    <div style={{ fontWeight: 900 }}>4) Nonviolent communication summary</div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.90)",
                        fontSize: 14,
                        lineHeight: 1.45,
                      }}
                    >
                      {accountableObsText
                        ? `When ${accountableObsText}, I feel ${emotion} because I need ${selectedNeed || "____"}.`
                        : nonviolentReframeSentence}
                    </div>

                    {hasIntero ? (
                      <div
                        style={{
                          color: "rgba(255, 255, 255, 0.95)",
                          fontSize: 14,
                          lineHeight: 1.45,
                        }}
                      >
                        {interoLines.join(" ")}
                      </div>
                    ) : null}

                    <div style={{ display: "grid", gap: 12 }}>
                      <div style={{ fontWeight: 900, marginTop: 8 }}>
                        5) Suggested requests
                      </div>

                      {suggestedRequests.length ? (
                        <SingleResponseCard
                          text={suggestedRequests[requestIndex % suggestedRequests.length]}
                          buttonLabel="Another request"
                          showButton={suggestedRequests.length > 1}
                          onNext={() =>
                            setRequestIndex((i) => (i + 1) % suggestedRequests.length)
                          }
                        />
                      ) : (
                        <div
                          style={{
                            border: "1px solid rgba(255,255,255,0.10)",
                            borderRadius: 12,
                            padding: 10,
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.92)",
                            fontSize: 14,
                            lineHeight: 1.45,
                          }}
                        >
                          {requestText}
                        </div>
                      )}

                      {suggestedAgreements.length ? (
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={{ fontWeight: 900 }}>6) Possible agreements</div>

                          <SingleResponseCard
                            text={suggestedAgreements[agreementIndex % suggestedAgreements.length]}
                            buttonLabel="Another agreement"
                            showButton={suggestedAgreements.length > 1}
                            onNext={() =>
                              setAgreementIndex(
                                (i) => (i + 1) % suggestedAgreements.length,
                              )
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </Panel>

                  <Panel style={{ display: "grid", gap: 12 }}>
                    <div style={{ fontWeight: 900 }}>Context and details</div>

                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.55,
                        color: "rgba(255,255,255,0.86)",
                      }}
                    >
                      Add any concrete details, sequence of events, or clarifying context you want
                      saved with this entry.
                    </div>

                    <textarea
                      value={contextNotes}
                      onChange={(e) => setContextNotes(e.target.value)}
                      placeholder="What happened before, during, or after this moment?"
                      style={{
                        width: "100%",
                        minHeight: 140,
                        resize: "vertical",
                        borderRadius: 14,
                        padding: "14px 16px",
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.96)",
                        fontSize: 14,
                        lineHeight: 1.55,
                        outline: "none",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                        marginTop: 4,
                      }}
                    >
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>
                        {saveStatus || ""}
                      </div>

                      <button className="btn" onClick={handleSaveEntry}>
                        Save entry
                      </button>
                    </div>
                  </Panel>

                  <div
                    style={{
                      display: "grid",
                      gap: 10,
                      margin: "8px 2px 4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.68)",
                      }}
                    >
                      Repair responsibility for the harm (Christian accountability and repair)
                    </div>
                    <div
                      aria-hidden="true"
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.26), rgba(255,255,255,0.04))",
                      }}
                    />
                  </div>

        

  <ChristAlignmentBlock
    master={master}
    selectedKey={selectedAccountableKey}
    title="7) Imitator of Christ value alignment"
  />

<Panel style={{ display: "grid", gap: 12 }}>
  {suggestedRepairSteps.length ? (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 900 }}>8) Stepwise repair</div>

      <Select
        value={String(repairStepIndex)}
        onChange={(value) => setRepairStepIndex(Number(value))}
        placeholder="Choose a repair step"
        options={suggestedRepairSteps.map((step, idx) => ({
          value: String(idx),
          label: `Step ${idx + 1}`,
        }))}
      />

      <SingleResponseCard
        text={suggestedRepairSteps[repairStepIndex] || suggestedRepairSteps[0]}
        buttonLabel="Next step"
        showButton={suggestedRepairSteps.length > 1}
        onNext={() =>
          setRepairStepIndex((i) => (i + 1) % suggestedRepairSteps.length)
        }
      />
    </div>
  ) : (
    <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
      (No repair steps generated for this need yet.)
    </div>
  )}
</Panel>
                </>
              )}
            </div>

            <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.60)",
                  lineHeight: 1.45,
                }}
              >
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}