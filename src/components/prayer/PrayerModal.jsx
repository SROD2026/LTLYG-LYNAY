// src/components/prayer/PrayerModal.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import Panel from "../ui/Panel.jsx";
import Select from "../ui/Select.jsx";
import Chips from "../ui/Chips.jsx";
import InteroStickFigure from "../interoception/InteroStickFigure.jsx";
import {
  appendReflectionEntry,
  loadReflectionLog,
} from "../../utils/logStore.js";

const BODY_MAP = {
  Chest: [
    "Tightness",
    "Pressure",
    "Warmth",
    "Fluttering",
    "Racing heartbeat",
    "Heavy weight",
    "Expanding / opening up",
  ],
  Abdomen: [
    "Butterflies",
    "Knotted up",
    "Sinking feeling",
    "Heat",
    "Empty or hollow feeling",
    "Clenching",
    "Settled",
  ],
  Head: [
    "Stabbing pressure",
    "Foggy thinking",
    "Racing thoughts",
    "Lightheaded",
    "Sharp focus",
    "Confusion",
    "Clear headed",
  ],
  Throat: ["Lump", "Tightness", "Difficulty speaking", "Dryness", "Open", "Relaxed"],
  Arms_and_Hands: ["Tingling", "Restlessness", "Clenching", "Shaking", "Warm", "Steady"],
  Legs_and_Feet: ["Restless", "Weak / collapsing", "Frozen / stuck", "Grounded heaviness", "Stable", "Anchored"],
  Whole_Body: [
    "Adrenaline surge",
    "Shutdown / collapse",
    "Numbness",
    "Overstimulation",
    "Energy spike",
    "Calm throughout",
    "Rested",
  ],
};

function blankIntero() {
  return { region: "", sensation: "" };
}

function isCompleteIntero(x) {
  return !!(x && x.region && x.sensation);
}

function interoSentences(interoArr) {
  return (interoArr || [])
    .filter(isCompleteIntero)
    .map((x) => `I feel ${x.sensation} in my ${String(x.region).replaceAll("_", " ")}.`);
}

function toneForCore(core) {
  switch (String(core || "").toLowerCase()) {
    case "fear":
      return { bar: "#c93c3c", glow: "rgba(201,60,60,0.34)" };
    case "anger":
      return { bar: "#dd5d36", glow: "rgba(221,93,54,0.34)" };
    case "sadness":
      return { bar: "#4877d1", glow: "rgba(72,119,209,0.30)" };
    case "surprise":
      return { bar: "#7a62cf", glow: "rgba(122,98,207,0.30)" };
    case "anticipation":
      return { bar: "#d7a52c", glow: "rgba(215,165,44,0.30)" };
    case "joy":
      return { bar: "#e0bf39", glow: "rgba(224,191,57,0.30)" };
    case "trust":
      return { bar: "#3da86b", glow: "rgba(61,168,107,0.30)" };
    default:
      return { bar: "#7b8796", glow: "rgba(123,135,150,0.28)" };
  }
}

export default function PrayerModal({ open, onClose, cell, meta = {} }) {
  const modalScrollRef = useRef(null);
  const emotion = useMemo(() => String(cell?.emotion || "").trim(), [cell]);
  const entry = useMemo(() => meta?.[emotion] || null, [meta, emotion]);
  const tone = useMemo(() => toneForCore(entry?.core_emotion), [entry]);

  const [intero, setIntero] = useState([blankIntero(), blankIntero(), blankIntero()]);
  const [activeInteroTab, setActiveInteroTab] = useState(0);
  const [writtenPrayer, setWrittenPrayer] = useState("");
const [saveStatus, setSaveStatus] = useState("");
const [logCount, setLogCount] = useState(0);

  useEffect(() => {
  if (!open) return;
  setLogCount(loadReflectionLog().length);
  requestAnimationFrame(() => {
    if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
  });
}, [open]);

useEffect(() => {
  if (!open) return;
  setLogCount(loadReflectionLog().length);
  requestAnimationFrame(() => {
    if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
  });
}, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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

  const active = useMemo(() => intero[activeInteroTab] || blankIntero(), [intero, activeInteroTab]);
  const regionOptions = useMemo(
    () => Object.keys(BODY_MAP).map((r) => ({ value: r, label: r.replaceAll("_", " ") })),
    []
  );
  const sensationOptions = useMemo(
    () => (!active.region ? [] : (BODY_MAP[active.region] || []).map((s) => ({ value: s, label: s }))),
    [active.region]
  );
  const interoLines = useMemo(() => interoSentences(intero), [intero]);

  const traitLabel = entry?.philippians_trait?.label || "TRUE";
  const reframeLine = useMemo(() => {
    const starters = {
      TRUE: `Lord, help me dwell on what is true while I feel ${emotion}.`,
      Just: `Lord, help me respond to ${emotion} in a just and rightly ordered way.`,
      Honorable: `Lord, let ${emotion} be carried with dignity, restraint, and integrity.`,
      Lovely: `Lord, let ${emotion} be softened by kindness, gentleness, and gratitude.`,
      Excellent: `Lord, direct ${emotion} toward faithful action, order, and stewardship.`,
      Commendable: `Lord, teach me to notice grace, growth, and what is already good.`,
      "Worthy of Praise": `Lord, turn ${emotion} into worship, gratitude, and hope in you.`,
      Pure: `Lord, purify my inner response so that it is simple, honest, and clean.`,
    };
    return starters[traitLabel] || `Lord, help me think on what is ${traitLabel.toLowerCase()} while I feel ${emotion}.`;
  }, [traitLabel, emotion]);

function handleSavePrayer() {
  try {
    const payload = {
      ts: new Date().toISOString(),
      type: "prayer",
      title: emotion,
      emotion,
      core_emotion: entry.core_emotion || "",
      definition: entry.definition || "",
      prayer_prompt: entry.prayer_prompt || "",
      reframe: reframeLine || "",
      written_prayer: writtenPrayer.trim(),
      intero: intero.filter((x) => x.region && x.sensation),
      scriptures: Array.isArray(entry.scriptures) ? entry.scriptures : [],
      philippians_trait: entry?.philippians_trait?.label || "",
      philippians_needs: Array.isArray(entry.philippians_needs)
        ? entry.philippians_needs
        : [],
      philippians_shifts: Array.isArray(entry.philippians_shifts)
        ? entry.philippians_shifts
        : [],
    };

    appendReflectionEntry(payload);
    const nextCount = loadReflectionLog().length;
    setLogCount(nextCount);
    setSaveStatus("Prayer saved.");
  } catch (err) {
    setSaveStatus(`Save failed: ${String(err?.message || err)}`);
  }
}

  if (!open || !entry) return null;

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
    margin: "32px auto",
    borderRadius: 18,
    border: `1px solid ${tone.bar}`,
    background: `
      linear-gradient(
        180deg,
        rgba(20,28,38,0.97) 0%,
        rgba(18,24,32,0.96) 100%
      )
    `,
    color: "rgba(255,255,255,0.94)",
    boxShadow: `0 20px 60px rgba(0,0,0,0.50), 0 0 0 1px ${tone.glow}`,
    overflow: "hidden",
    position: "relative",
  }}
>
         <div aria-hidden="true" style={{ height: 4, width: "100%", background: tone.bar }} />

<div
  style={{
    padding: 18,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  }}
>
<div style={{ display: "grid", gap: 8, maxWidth: 620 }}>
  <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.05, color: tone.bar }}>
    {emotion}
  </div>

  <div
    style={{
      fontSize: 14,
      lineHeight: 1.45,
      color: "rgba(255,255,255,0.82)",
    }}
  >
    {entry.definition}
  </div>

  <div
    style={{
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: 0.5,
      color: "rgba(255,255,255,0.62)",
      textTransform: "uppercase",
    }}
  >
    {entry.core_emotion} prayer flow
  </div>
          </div>

          <button className="btn" onClick={onClose} style={{ whiteSpace: "nowrap" }}>Close</button>
        </div>

        <div style={{ padding: "0 18px 18px", display: "grid", gap: 14 }}>
          
          
<Panel
  title="1) Prayer"
  style={{
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.94)"
  }}
>
  
   <div style={{ display: "grid", gap: 16 }}>
    <div>
      <strong>A. Name the emotion</strong>
      <p style={{ margin: "6px 0 0", lineHeight: 1.55 }}>
        {entry.prayer_prompt}
      </p>
    </div>

    <div>
      <strong>B. Recognize the need</strong>
      <p style={{ margin: "6px 0 0", lineHeight: 1.55 }}>
        This emotion may point toward needs such as{" "}
        {(entry.philippians_needs || []).join(", ") || "clarity, help, and steadiness"}.
      </p>
    </div>

    <div>
      <strong>C. Renew the mind</strong>
      <p style={{ margin: "6px 0 0", lineHeight: 1.55 }}>
        {reframeLine}
      </p>
    </div>
  </div>
</Panel>

          <Panel title="2) God's communication method to us" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div style={{ display: "grid", gap: 10 }}>
              {(entry.scriptures || []).map((s) => (
<div
  key={s.ref}
  style={{
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 12,
    padding: 12,
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.94)"
  }}
>
                    <div style={{ fontWeight: 900, marginBottom: 6 }}>{s.ref}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.92)" }}>{s.principle}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="3) Interoception" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, alignItems: "start" }}>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.84)" }}>
                  Notice where this emotion shows up in your body. Naming body sensations can make prayer more concrete instead of vague.
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Array.from({ length: visibleInteroTabs }).map((_, idx) => (
                    <button
                      key={idx}
                      className="btn"
                      onClick={() => setActiveInteroTab(idx)}
                      style={{
                        padding: "8px 12px",
                        fontSize: 13,
                        borderRadius: 999,
                        background: activeInteroTab === idx ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.08)",
                      }}
                    >
                      Sensation {idx + 1}
                    </button>
                  ))}
                </div>

                <Select
                  value={active.region}
                  onChange={(v) => setInteroRegion(activeInteroTab, v)}
                  placeholder="Select a body region…"
                  options={regionOptions}
                />

                <Select
                  value={active.sensation}
                  onChange={(v) => setInteroSensation(activeInteroTab, v)}
                  placeholder="Select a sensation…"
                  options={sensationOptions}
                />

                {interoLines.length ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontWeight: 900, fontSize: 13 }}>Named body experience</div>
                    <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.92)" }}>{interoLines.join(" ")}</div>
                  </div>
                ) : null}
              </div>

              <div id="prayerStickCapture" style={{ display: "grid", gap: 10, justifyItems: "center" }}>
                <InteroStickFigure intero={intero.filter((x) => x.region && x.sensation)} />
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.66)", textAlign: "center", maxWidth: 240 }}>
                  This section is for noticing, not dramatizing. Bring the body to God as honestly as you bring the emotion.
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="4) Philippians 4:8 reframe" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.92)" }}>{reframeLine}</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                <div style={{ border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.05)" }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Think on what is {traitLabel}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.84)" }}>
                    This is not denial. It is a redirection of attention toward what helps reality, love, truth, and peace come back into view.
                  </div>
                </div>

                <div style={{ border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.05)" }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Needs linked to this trait</div>
                  <Chips items={entry.philippians_needs || []} value="" onChange={() => {}} />
                </div>
              </div>

              <div style={{ border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.05)" }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>Possible shifts in attention</div>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.92)" }}>
                  {(entry.philippians_shifts || []).map((shift) => (
                    <li key={shift}>{shift}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>

<Panel title="5) Write your prayer" style={{ background: "rgba(255,255,255,0.04)" }}>
  <div style={{ display: "grid", gap: 12 }}>
    <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.86)" }}>
      Put the prayer into your own words. This can combine the emotion, the need, the Scripture, and what you are asking God for now.
    </div>

    <textarea
      value={writtenPrayer}
      onChange={(e) => setWrittenPrayer(e.target.value)}
      placeholder="God, I feel... Please help me..."
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

    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <button className="btn" onClick={handleSavePrayer}>
        Save prayer
      </button>

      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>
        {logCount} saved reflections
      </div>

      {saveStatus ? (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
          {saveStatus}
        </div>
      ) : null}
    </div>
  </div>
</Panel>

        </div>
      </div>
    </div>
  );
}
