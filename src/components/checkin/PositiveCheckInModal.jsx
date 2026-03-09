// src/components/checkin/PositiveCheckInModal.jsx
// COPY/PASTE ENTIRE FILE

import { useEffect, useMemo, useRef, useState } from "react";
import Panel from "../ui/Panel.jsx";
import Select from "../ui/Select.jsx";
import Chips from "../ui/Chips.jsx";
import InteroStickFigure from "../interoception/InteroStickFigure.jsx";
import GratitudeFlowBlock from "./GratitudeFlowBlock.jsx";
import {
  csvEscape,
  dataUrlToUint8Array,
  downloadBlob,
  captureElementPng,
} from "../../utils/exportHelpers.js";
import { checkinColor } from "../../utils/checkinColor.js";
import { uniqStrings } from "../../utils/data.js";
import {
  appendReflectionEntry,
  loadReflectionLog,
  clearReflectionLog,
} from "../../utils/logStore.js";

import JSZip from "jszip";


// -------------------------
// Misc
// -------------------------
function toTitle(s) {
  return String(s || "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

// Positive interoception defaults (safe, neutral)
const POSITIVE_BODY_MAP = {
  Head: [
    "Clear",
    "Quiet mind",
    "Light",
    "Focused",
    "Mentally open",
    "Mentally settled",
    "Clear headed",
    "Bright",
    "Alert in a calm way",
    "Ease in my thoughts",
    "Mental spaciousness",
    "Stillness in my mind",
    "Soft focus",
    "Calm attention",
    "Clarity",
    "Relief in my mind",
    "Less mental pressure",
    "Organized thoughts",
    "Steady thoughts",
    "Gentle mental energy"
  ],

  Throat: [
    "Open",
    "Unclenched",
    "Easy voice",
    "Loose",
    "Soft",
    "Relaxed",
    "Clear voice",
    "Freedom to speak",
    "Steady voice",
    "Warmth",
    "Ease speaking",
    "Less tightness",
    "Less pressure",
    "Gentle openness",
    "Smooth breathing through my throat",
    "Release",
    "More vocal ease",
    "Calm expression"
  ],

  Chest: [
    "Open",
    "Warm",
    "Steady",
    "Light",
    "Easy breathing",
    "Full breath",
    "Soft expansion",
    "Relaxed",
    "Unclenched",
    "Calm",
    "Ease",
    "Quiet strength",
    "Gentle energy",
    "Warm fullness",
    "Steady heartbeat",
    "Looseness",
    "Relief",
    "Comfort",
    "Openness spreading",
    "Soft flutter",
    "Emotional warmth",
    "Protected",
    "Restful"
  ],

  Abdomen: [
    "Settled",
    "Soft",
    "Quiet",
    "Comfortable",
    "Warm",
    "Loose",
    "Unclenched",
    "Stable",
    "Grounded",
    "At ease",
    "Full but calm",
    "Relaxed",
    "Less knotted",
    "Less tension",
    "Steady",
    "Supported",
    "Safe",
    "Calm fullness",
    "Deep ease",
    "Soft heaviness in a good way"
  ],

  Arms_and_Hands: [
    "Relaxed",
    "Warm",
    "Steady",
    "Loose",
    "Light",
    "Open",
    "Soft",
    "Still",
    "Gentle energy",
    "Less restless",
    "Calm movement",
    "Ease",
    "Supported",
    "Release",
    "Comfortable",
    "Flexible",
    "Unclenched",
    "Quiet strength"
  ],

  Legs_and_Feet: [
    "Grounded",
    "Stable",
    "Planted",
    "Supported",
    "Steady",
    "Strong",
    "Relaxed",
    "Light but rooted",
    "Balanced",
    "Safe",
    "Calm readiness",
    "Ease",
    "Anchored",
    "Connected to the ground",
    "Secure",
    "Firm in a good way",
    "Less wobbly",
    "More settled"
  ],

  Whole_Body: [
    "Ease",
    "Regulated",
    "Rested",
    "Calm energy",
    "Lightness",
    "Peace",
    "Warmth throughout",
    "Softness throughout",
    "Steadiness",
    "Integrated",
    "Whole",
    "Balanced",
    "Restoration",
    "Calm aliveness",
    "Relief throughout",
    "Deep exhale feeling",
    "Gentle vitality",
    "Settled all over",
    "Safe in my body",
    "Nourished",
    "Restored",
    "Quiet joy"
  ],
};

// Theology presets (check-in scoped, not master)
const GRATITUDE_THEOLOGY_PRESETS = [
  {
    key: "thankfulness_in_all_circumstances",
    title: "Thankfulness (God’s will)",
    verses: [
      "1 Thessalonians 5:18 — Give thanks in all circumstances; for this is God’s will for you in Christ Jesus.",
      "Psalm 107:1 — Give thanks to the Lord, for he is good; his love endures forever.",
      "1 Chronicles 16:34 — Give thanks to the Lord, for he is good; his love endures forever.",
      "Psalm 100:4-5 — Enter his gates with thanksgiving and his courts with praise.",
      "Colossians 3:17 — Whatever you do… do it all in the name of the Lord Jesus, giving thanks to God the Father through him.",
      "Psalm 136:1 — Give thanks to the Lord, for he is good; his love endures forever.",
      "James 1:17 — Every good and perfect gift is from above.",
      "Ephesians 5:20 — Always giving thanks to God the Father for everything."
    ],
  },

  {
    key: "focus_on_what_is_good",
    title: "Focus (truth / beauty / goodness)",
    verses: [
      "Philippians 4:8 — Whatever is true… noble… right… pure… lovely… admirable… think about such things.",
      "Proverbs 17:22 — A cheerful heart is good medicine.",
      "Psalm 28:7 — My heart leaps for joy and with my song I praise him.",
      "Psalm 92:1-2 — It is good to praise the Lord and make music to your name.",
      "Ecclesiastes 3:12-13 — That each may eat and drink and find satisfaction… this is the gift of God.",
      "Psalm 145:7 — They celebrate your abundant goodness.",
      "Isaiah 12:4 — Give praise to the Lord, proclaim his name."
    ],
  },

  {
    key: "fruit_of_the_spirit",
    title: "Love / Joy / Peace (Fruit of the Spirit)",
    verses: [
      "Galatians 5:22-23 — The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.",
      "Romans 14:17 — The kingdom of God is righteousness, peace and joy in the Holy Spirit.",
      "John 15:11 — I have told you this so that my joy may be in you and that your joy may be complete.",
      "Psalm 16:11 — In your presence there is fullness of joy.",
      "Nehemiah 8:10 — The joy of the Lord is your strength."
    ],
  },

  {
    key: "replacing_anxiety_with_gratitude",
    title: "Replacing anxiety (gratitude → peace)",
    verses: [
      "Philippians 4:6-7 — Do not be anxious about anything… but with thanksgiving present your requests to God.",
      "Colossians 3:15 — Let the peace of Christ rule in your hearts… and be thankful.",
      "Matthew 6:34 — Do not worry about tomorrow.",
      "1 Peter 5:7 — Cast all your anxiety on him because he cares for you.",
      "Isaiah 26:3 — You will keep in perfect peace those whose minds are steadfast."
    ],
  },

  {
    key: "gratitude_as_worship",
    title: "Gratitude as worship / sacrifice",
    verses: [
      "Jonah 2:9 — With shouts of grateful praise I will sacrifice to you.",
      "Hebrews 12:28 — Since we are receiving a kingdom that cannot be shaken, let us be thankful and worship God acceptably.",
      "Psalm 50:23 — Those who sacrifice thank offerings honor me.",
      "Psalm 95:2 — Let us come before him with thanksgiving.",
      "Hebrews 13:15 — Let us continually offer to God a sacrifice of praise."
    ],
  },

  {
    key: "recognizing_gods_provision",
    title: "Recognizing God’s provision",
    verses: [
      "Matthew 6:26 — Your heavenly Father feeds them. Are you not much more valuable?",
      "Psalm 23:1 — The Lord is my shepherd; I lack nothing.",
      "Psalm 34:10 — Those who seek the Lord lack no good thing.",
      "James 1:17 — Every good and perfect gift is from above.",
      "Deuteronomy 8:10 — When you have eaten and are satisfied, praise the Lord your God."
    ],
  },

  {
    key: "gratitude_for_people",
    title: "Gratitude for people and relationships",
    verses: [
      "Romans 1:8 — I thank my God through Jesus Christ for all of you.",
      "Philippians 1:3 — I thank my God every time I remember you.",
      "1 Thessalonians 1:2 — We always thank God for all of you.",
      "3 John 1:4 — I have no greater joy than to hear that my children are walking in the truth.",
      "Proverbs 17:17 — A friend loves at all times."
    ],
  },

  {
    key: "joy_in_salvation",
    title: "Joy in salvation",
    verses: [
      "Psalm 51:12 — Restore to me the joy of your salvation.",
      "Luke 10:20 — Rejoice that your names are written in heaven.",
      "Isaiah 61:10 — I delight greatly in the Lord.",
      "Romans 5:11 — We also boast in God through our Lord Jesus Christ.",
      "1 Peter 1:8 — You believe in him and are filled with an inexpressible and glorious joy."
    ],
  },

  {
    key: "contentment",
    title: "Contentment and sufficiency",
    verses: [
      "Philippians 4:11-12 — I have learned to be content whatever the circumstances.",
      "1 Timothy 6:6 — Godliness with contentment is great gain.",
      "Hebrews 13:5 — Be content with what you have.",
      "Psalm 16:6 — The boundary lines have fallen for me in pleasant places.",
      "Ecclesiastes 5:19 — When God gives someone wealth and possessions… this is a gift of God."
    ],
  },

  {
    key: "praise_for_creation",
    title: "Praise for creation",
    verses: [
      "Psalm 19:1 — The heavens declare the glory of God.",
      "Psalm 104:24 — How many are your works, Lord!",
      "Genesis 1:31 — God saw all that he had made, and it was very good.",
      "Psalm 148:5 — Let them praise the name of the Lord.",
      "Romans 1:20 — God’s invisible qualities have been clearly seen in what has been made."
    ],
  }
];

const blankIntero = () => ({ region: "", sensation: "" });

function isCompleteIntero(x) {
  return !!(x && x.region && x.sensation);
}

function interoSentences(interoArr) {
  return (interoArr || [])
    .filter(isCompleteIntero)
    .map((x) => `I feel ${x.sensation} in my ${String(x.region).replaceAll("_", " ")}.`);
}

export default function PositiveCheckInModal({
  open,
  onClose,
  cell,
  checkinMeta,
  needsSupplement = { global: [] },
}) {
  // -------------------------
  // Resolve selected item
  // -------------------------
  const emotionKey = useMemo(() => String(cell?.emotion || "").trim(), [cell]);

  const entry = useMemo(() => {
    const m = checkinMeta && typeof checkinMeta === "object" ? checkinMeta : {};
    return m?.[emotionKey] || m?.[emotionKey?.toLowerCase?.()] || null;
  }, [checkinMeta, emotionKey]);

  const title = entry?.title ? entry.title : emotionKey;
  const definition = entry?.definition || "";

  const overlayHex = useMemo(() => {
    if (!cell) return null;
    return checkinColor(cell.x, cell.y);
  }, [cell]);

  // -------------------------
  // State
  // -------------------------
    const modalBodyRef = useRef(null);
  const [selectedNeedMet, setSelectedNeedMet] = useState("");

  const [gratitudeText, setGratitudeText] = useState("");
  const [selectedGratPrompt, setSelectedGratPrompt] = useState("");

  const [selectedObservation, setSelectedObservation] = useState("");
  const [selectedTheologyKey, setSelectedTheologyKey] = useState("");

  const [intero, setIntero] = useState([blankIntero(), blankIntero(), blankIntero()]);
  const [activeInteroTab, setActiveInteroTab] = useState(0);

  const [logCount, setLogCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const [showLog, setShowLog] = useState(false);

  // -------------------------
  // Effects
    useEffect(() => {
    if (!open) return;
    setLogCount(loadReflectionLog().length);

    requestAnimationFrame(() => {
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTop = 0;
      }
    });
  }, [open]);


  useEffect(() => {
    setSelectedNeedMet("");
    setGratitudeText("");
    setSelectedGratPrompt("");
    setSelectedObservation("");
    setSelectedTheologyKey("");

    setIntero([blankIntero(), blankIntero(), blankIntero()]);
    setActiveInteroTab(0);

    setSaveStatus("");
    setShowLog(false);
  }, [emotionKey]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // -------------------------
  // Derived: needs + side + reframe
  // -------------------------
  const allNeedsMet = useMemo(() => {
    const primary = Array.isArray(entry?.needs_met) ? entry.needs_met.map(String) : [];
    const global = Array.isArray(needsSupplement?.global) ? needsSupplement.global.map(String) : [];

    const primaryLimited = uniqStrings(primary).slice(0, 8);
    const filler = uniqStrings(global).filter((g) => !primaryLimited.includes(g));

    return [...primaryLimited, ...filler].slice(0, 10);
  }, [entry, needsSupplement]);

  useEffect(() => {
    if (!allNeedsMet.length) return;
    if (!selectedNeedMet || !allNeedsMet.includes(selectedNeedMet)) {
      setSelectedNeedMet(allNeedsMet[0]);
    }
  }, [allNeedsMet, selectedNeedMet]);

  const side = entry?.side === "external" ? "external" : "internal";
const reframe = useMemo(() => {
  const needSlot = selectedNeedMet || "____";

  const t = String(title || "").trim();
  const lower = t.toLowerCase();

  // If the emotion label begins with "for ..."
  if (lower.startsWith("for ")) {
    return `I am grateful ${t} because my need for ${needSlot} was met.`;
  }

  // normal internal emotion
  return `I feel ${t} because my need for ${needSlot} was met.`;
}, [selectedNeedMet, title]);
  // -------------------------
  // Intero tabs and options
  // -------------------------
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

  const regionOptions = useMemo(
    () => Object.keys(POSITIVE_BODY_MAP).map((r) => ({ value: r, label: r.replaceAll("_", " ") })),
    []
  );

  const active = useMemo(() => intero[activeInteroTab] || blankIntero(), [intero, activeInteroTab]);

  const sensationOptions = useMemo(() => {
    if (!active.region) return [];
    return (POSITIVE_BODY_MAP[active.region] || []).map((s) => ({ value: s, label: s }));
  }, [active.region]);

  // -------------------------
  // Gratitude prompts / observations / theology
  // -------------------------
  const gratPrompts = useMemo(() => {
    const arr = Array.isArray(entry?.gratitude_prompts) ? entry.gratitude_prompts : [];
    return arr.map(String).filter(Boolean);
  }, [entry]);

  const observationGroups = useMemo(() => {
    return entry?.observation_options || entry?.observations || [];
  }, [entry]);

  const theologyOptions = useMemo(() => GRATITUDE_THEOLOGY_PRESETS, []);

  // -------------------------
  // Summary text (auto)
  // -------------------------
  const gratitudeSummaryText = useMemo(() => {
    if (side !== "external") return "";

    const obs = selectedObservation || "____";
    const need = selectedNeedMet || "____";
    const promptLine = selectedGratPrompt ? `Prompt: ${selectedGratPrompt}\n` : "";

    const selectedTheo = theologyOptions.find((t) => t.key === selectedTheologyKey);
    const theoTitle = selectedTheo?.title || "";
    const theoVerses = selectedTheo?.verses?.length
      ? selectedTheo.verses.map((v) => `- ${v}`).join("\n")
      : "";
    const theoBlock = selectedTheologyKey
      ? `Theology: ${theoTitle || selectedTheologyKey}\n${theoVerses}\n`
      : "";

    const bodyLine = hasIntero ? `Body: ${interoLines.join(" ")}\n` : "";
    const grat = gratitudeText || "____";

    return `Observation: ${obs}\n${promptLine}Needs met: ${need}\n${theoBlock}${bodyLine}Gratitude: ${grat}`;
  }, [
    side,
    selectedObservation,
    selectedNeedMet,
    selectedGratPrompt,
    selectedTheologyKey,
    gratitudeText,
    hasIntero,
    interoLines,
    theologyOptions,
  ]);

  // -------------------------
  // Save / Export / Clear
  // -------------------------
  async function handleSaveEntry() {
  try {
    setSaveStatus("Saving…");
    const pngDataUrl = await captureElementPng("#checkinStickCapture");

    appendReflectionEntry({
      type: "gratitude",

      emotion: emotionKey,
      title,
      side,

      need: "",
      needs_met: selectedNeedMet || "",

      reframe: reframe || "",
      request: "",

      cause: "",
      replacement: "",

      violationKey: "",
      accountableViolationKey: "",

      observation: selectedObservation || "",
      theology_key: selectedTheologyKey || "",

      gratitude_prompt: selectedGratPrompt || "",
      gratitude_text: gratitudeText || "",

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

      const entries = loadReflectionLog();
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
        "emotion",
        "title",
        "side",
        "needs_met",
        "body_sensations",
        "reframe",
        "observation",
        "theology_key",
        "gratitude_prompt",
        "gratitude_text",
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
          csvEscape(e?.emotion || ""),
          csvEscape(e?.title || ""),
          csvEscape(e?.side || ""),
          csvEscape(e?.needs_met || ""),
          csvEscape(body),
          csvEscape(e?.reframe || ""),
          csvEscape(e?.observation || ""),
          csvEscape(e?.theology_key || ""),
          csvEscape(e?.gratitude_prompt || ""),
          csvEscape(e?.gratitude_text || ""),
          csvEscape(imageFile),
        ].join(",");
      });

      const csv = [header, ...lines].join("\n");

      const zip = new JSZip();
      zip.file("checkin_entries.csv", csv);

      const imgFolder = zip.folder("images");
      entries.forEach((e, idx) => {
        if (!e?.pngDataUrl) return;
        const name = makeImageName(e, idx);
        imgFolder.file(name, dataUrlToUint8Array(e.pngDataUrl));
      });

      const yyyyMmDd = new Date().toISOString().slice(0, 10);
      const blob = await zip.generateAsync({ type: "blob" });
downloadBlob(blob, `reflection-log-${yyyyMmDd}.zip`);

      setSaveStatus("Exported ✓");
      setTimeout(() => setSaveStatus(""), 900);
    } catch (e) {
      setSaveStatus("Export failed");
      console.error(e);
    }
  }

function handleClearLog() {
  clearReflectionLog();
  setLogCount(0);
  setShowLog(false);
  setSaveStatus("Cleared ✓");
  setTimeout(() => setSaveStatus(""), 900);
}

const logEntries = useMemo(
  () => (showLog ? loadReflectionLog() : []),
  [showLog, logCount]
);

  if (!open) return null;

  return (
     <div
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
    border: `2px solid ${overlayHex || "rgba(255,255,255,0.12)"}`,
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
              {title}
            </div>

            {definition ? (
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: "rgba(255,255,255,0.82)",
                  maxWidth: 560,
                  marginTop: 4,
                }}
              >
                {definition}
              </div>
            ) : null}

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
              Saved check-ins on this device: <b>{logCount}</b> {saveStatus ? `• ${saveStatus}` : ""}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button className="btn" onClick={() => setShowLog((v) => !v)}>
              {showLog ? "Hide log" : "View log"}
            </button>

            <button className="btn" onClick={handleSaveEntry}>
              Save entry
            </button>

            <button className="btn" onClick={handleExportZip}>
              Export ZIP
            </button>

            <button
              className="btn"
              onClick={handleClearLog}
              style={{ background: "rgba(255,120,120,0.12)" }}
            >
              Clear log (device)
            </button>

            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          ref={modalBodyRef}
          style={{
            padding: 16,
            display: "grid",
            gap: 14,
            minHeight: 0,
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
                    {showLog && (
            <Panel style={{ display: "grid", gap: 10 }}>
              <div style={{ fontWeight: 900 }}>Log (this device)</div>

              {logEntries.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13 }}>
                  (No saved entries yet.)
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {logEntries.slice(0, 12).map((e) => {
                    const when = new Date(e.ts).toLocaleString();
                    const body = (e.intero || [])
                      .map((x) => `${String(x.region).replaceAll("_", " ")}: ${x.sensation}`)
                      .join(" | ");

                    return (
                      <div
                        key={e.id}
                        style={{
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: 12,
                          padding: 10,
                          background: "rgba(0,0,0,0.18)",
                          display: "grid",
                          gap: 6,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div style={{ fontWeight: 800 }}>
                            {e.title || e.emotion}{" "}
                            <span style={{ opacity: 0.75, fontWeight: 600, fontSize: 12 }}>
                              {e.side === "external" ? "external" : "internal"}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.75 }}>{when}</div>
                        </div>

                        <div style={{ fontSize: 13, opacity: 0.9 }}>{e.reframe || ""}</div>

                        {e.observation ? (
                          <div style={{ fontSize: 12, opacity: 0.85 }}>
                            Observation: {e.observation}
                          </div>
                        ) : null}
                        {e.theology_key ? (
                          <div style={{ fontSize: 12, opacity: 0.85 }}>
                            Theology: {e.theology_key}
                          </div>
                        ) : null}
                        {body ? <div style={{ fontSize: 12, opacity: 0.8 }}>{body}</div> : null}
                        {e.gratitude_text ? (
                          <div style={{ fontSize: 12, opacity: 0.85 }}>
                            Gratitude: {e.gratitude_text}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>
          )}

          <Panel style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 900 }}>1) I feel this in my body by…</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
                alignItems: "start",
              }}
            >
              <div style={{ display: "grid", gap: 10 }}>
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
                      I feel <b>{active.sensation}</b> in my{" "}
                      <b>{active.region.replaceAll("_", " ")}</b>.
                    </div>
                  )}
                </div>

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
                  These sensations are descriptive signals, not proof of meaning.
                </div>
              </div>

              <div
                id="checkinStickCapture"
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

          <Panel style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 900 }}>2) Need that was met / value that was supported</div>

            {allNeedsMet.length ? (
              <Chips items={allNeedsMet} value={selectedNeedMet} onChange={setSelectedNeedMet} />
            ) : (
              <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
                (No needs_met listed for this item yet.)
              </div>
            )}

            <div style={{ color: "rgba(255,255,255,0.90)", fontSize: 14, lineHeight: 1.45 }}>
              {reframe}
            </div>

            {hasIntero ? (
              <div style={{ color: "rgba(255,255,255,0.80)", fontSize: 13, lineHeight: 1.45 }}>
                {interoLines.join(" ")}
              </div>
            ) : null}
          </Panel>

          <GratitudeFlowBlock
            observationGroups={observationGroups}
            selectedObservation={selectedObservation}
            onChangeObservation={setSelectedObservation}
            gratitudePrompts={gratPrompts}
            selectedPrompt={selectedGratPrompt}
            onChangePrompt={setSelectedGratPrompt}
            gratitudeText={gratitudeText}
            onChangeText={setGratitudeText}
            theologyOptions={theologyOptions}
            selectedTheologyKey={selectedTheologyKey}
            onChangeTheologyKey={setSelectedTheologyKey}
            copyText={gratitudeSummaryText}
          />
        </div>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 5,
            padding: "10px 16px",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(16,22,30,0.96)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button className="btn" onClick={handleSaveEntry}>
            Save entry
          </button>
        </div>
      </div>
    </div>
  );
}