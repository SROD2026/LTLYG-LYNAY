// src/components/checkin/PositiveCheckInModal.jsx
// COPY/PASTE ENTIRE FILE

import { useEffect, useMemo, useRef, useState } from "react";
import Panel from "../ui/Panel.jsx";
import Select from "../ui/Select.jsx";
import Chips from "../ui/Chips.jsx";
import InteroSceneFigure from "../intero/InteroSceneFigure.jsx";
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
const nextStepRef = useRef(null);
  const overlayHex = useMemo(() => {
    if (!cell) return null;
    return checkinColor(cell.x, cell.y);
  }, [cell]);

  // -------------------------
  // State
  // -------------------------
    const modalBodyRef = useRef(null);
  const [selectedNeedMet, setSelectedNeedMet] = useState("");
  const [showAllNeeds, setShowAllNeeds] = useState(false);
const modalCardRef = useRef(null);
const interoCaptureRef = useRef(null);
const [spacerHeight, setSpacerHeight] = useState(0);
const [contextNotes, setContextNotes] = useState("");


  const [gratitudeText, setGratitudeText] = useState("");
  const [selectedGratPrompt, setSelectedGratPrompt] = useState("");

  const [selectedObservation, setSelectedObservation] = useState("");
  const [selectedTheologyKey, setSelectedTheologyKey] = useState("");

  const [intero, setIntero] = useState([blankIntero(), blankIntero(), blankIntero()]);
  const [activeInteroTab, setActiveInteroTab] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);


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
}, [open, showLog, intero, gratitudeText, selectedObservation, selectedTheologyKey, selectedNeedMet]);
  
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
  }, [open]);

  useEffect(() => {
  if (!open) return;

  function handleKey(e) {
    if (e.key === "Escape") {
      onClose?.();
    }
  }

  window.addEventListener("keydown", handleKey);

  return () => {
    window.removeEventListener("keydown", handleKey);
  };
}, [open, onClose]);

  useEffect(() => {
    setSelectedNeedMet("");
    setShowAllNeeds(false);
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
  if (!open || !cell) return;

  const id = setTimeout(() => {
    nextStepRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 120);

  return () => clearTimeout(id);
}, [open, cell]);

  // -------------------------
  // Derived: needs + side + reframe
  // -------------------------

const emotionNeeds = useMemo(() => {
  return uniqStrings(
    (
      Array.isArray(entry?.needs) ? entry.needs :
      Array.isArray(entry?.needs_met) ? entry.needs_met :
      []
    ).map(String)
  );
}, [entry]);

const baseTopNeeds = useMemo(() => {
  return emotionNeeds.slice(0, 5);
}, [emotionNeeds]);

const globalNeeds = useMemo(() => {
  return uniqStrings(
    Array.isArray(needsSupplement?.global)
      ? needsSupplement.global.map(String)
      : []
  );
}, [needsSupplement]);

const extraNeeds = useMemo(() => {
  return globalNeeds.filter((need) => !baseTopNeeds.includes(need));
}, [globalNeeds, baseTopNeeds]);

const displayNeeds = useMemo(() => {
  if (!selectedNeedMet || baseTopNeeds.includes(selectedNeedMet)) {
    return baseTopNeeds;
  }

  const rest = baseTopNeeds.slice(1);
  return uniqStrings([selectedNeedMet, ...rest]).slice(0, 5);
}, [baseTopNeeds, selectedNeedMet]);

function handleNeedPick(need) {
  setSelectedNeedMet(need);

  if (!baseTopNeeds.includes(need)) {
    setShowAllNeeds(false);
  }
}

useEffect(() => {
  const validNeeds = [...baseTopNeeds, ...extraNeeds];
  if (!validNeeds.length) return;

  if (!selectedNeedMet || !validNeeds.includes(selectedNeedMet)) {
    setSelectedNeedMet(baseTopNeeds[0] || validNeeds[0] || "");
  }
}, [baseTopNeeds, extraNeeds, selectedNeedMet]);


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

return `${
  side === "external" ? "Observation" : "Context"
}: ${obs}\n${promptLine}Needs met: ${need}\n${theoBlock}${bodyLine}${
  side === "external" ? "Gratitude" : "Reflection"
}: ${grat}`;  }, [
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
  // -------------------------async function handleSaveEntry() {
  async function handleSaveEntry() {
    try {
      setSaveStatus("Saving…");

    let pngDataUrl = "";
    try {
      pngDataUrl = await captureElementPng(interoCaptureRef.current);
    } catch (err) {
      console.warn("Gratitude PNG capture failed:", err);
    }

    appendReflectionEntry({
      type: "gratitude",

      emotion: emotionKey,
      title,
      side,

      need: "",
      needs_met: selectedNeedMet || "",

      reframe: reframe || "",
      request: "",
      context_notes: contextNotes.trim(),

      cause: "",
      replacement: "",

      violationKey: "",
      accountableViolationKey: "",

      observation: selectedObservation || "",
      theology_key: selectedTheologyKey || "",

      gratitude_prompt: selectedGratPrompt || "",
      gratitude_text: gratitudeText || "",

      x: cell?.x || 0,
      y: cell?.y || 0,

      intero: intero.filter((x) => x?.region && x?.sensation),
      pngDataUrl,
    });

    setLogCount(loadReflectionLog().length);
    setSaveStatus("Emotional State Saved ✓");
    setTimeout(() => setSaveStatus(""), 2000);
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
  <>
    <div
      aria-hidden="true"
      style={{
width: "100%",
        margin: "24px auto 40px",
        height: spacerHeight,
        visibility: "hidden",
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
    margin: 0,
    justifySelf: "center",
    position: "relative",
    width: "min(1040px, calc(100vw - 24px))",
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
          <div ref={nextStepRef}>

        {/* Header */}
       <div
  className="modalHeader"
  style={{
    padding: 18,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 16,
    alignItems: "start",
  }}
>
          <div style={{ display: "grid", gap: 8, minWidth: 0, maxWidth: 560 }}>
            <div className="modalTitle"
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
              <div  className="modalSubtitle"
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

  <button className="btn" onClick={handleSaveEntry} style={{ minWidth: 110, flex: "0 1 auto"  }}>
    Save entry
  </button>

  <button className="btn" onClick={onClose} style={{ minWidth: 110, flex: "0 1 auto"  }}>
    Close
  </button>
</div>
        </div>

        {/* Body */}
        <div
          ref={modalBodyRef}
          style={{
            padding: "0 18px 18px",
            display: "grid",
            gap: 14,
            overflow: "visible",
          }}
        >

         </div>


          <Panel style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 900 }}>1) I feel this emotion in my body as...</div>

           <div
  className="mobileStack"
  style={{
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 280px",
    gap: 16,
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

                  {active.region && active.sensation && (
                    <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
                      I feel <b>{active.sensation}</b> in my{" "}
                      <b>{active.region.replaceAll("_", " ")}</b>.
                    </div>
                  )}
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
              <strong>{idx + 1}.</strong> {item.region.replaceAll("_", " ")} — {item.sensation}
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
    width: "100%",
    minWidth: 0,
  }}
>
  <div ref={interoCaptureRef}>
<InteroSceneFigure
  intero={intero}
  emotion={emotionKey}
  mode="checkin"
  x={cell?.x || 0}
  y={cell?.y || 0}
  width={340}
  height={340}
/>
</div>
              </div>
            </div>
          </Panel>


<Panel style={{ display: "grid", gap: 10 }}>
  <div style={{ fontWeight: 900 }}>2) Choose the need that was met
  </div>

{baseTopNeeds.length ? (
  <div style={{ display: "grid", gap: 10 }}>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      <Chips
        items={displayNeeds}
        value={selectedNeedMet}
        onChange={handleNeedPick}
      />

      {!showAllNeeds && extraNeeds.length > 0 ? (
        <button
          className="btn"
          type="button"
          onClick={() => setShowAllNeeds(true)}
        >
          Other
        </button>
      ) : null}
    </div>
      {showAllNeeds && extraNeeds.length > 0 ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.70)",
              fontWeight: 700,
            }}
          >
            Other needs
          </div>

          <Chips
            items={extraNeeds}
            value={selectedNeedMet}
            onChange={handleNeedPick}
          />

          <div>
            <button
              className="btn"
              type="button"
              onClick={() => setShowAllNeeds(false)}
            >
              Collapse
            </button>
          </div>
        </div>
      ) : null}
    </div>
  ) : (
    <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
      (No needs found.)
    </div>
  )}

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




          <Panel style={{ display: "grid", gap: 12 }}>
  <div style={{ fontWeight: 900, fontSize: 18 }}>7) Context of this gratitude entry (optional)</div>

  <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.86)" }}>
    Add any situational details you want to remember.
  </div>

  <textarea
    value={contextNotes}
    onChange={(e) => setContextNotes(e.target.value)}
    placeholder="What was happening in the moment that made this feel meaningful?"
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
</Panel>
        </div>

<div
  style={{
    padding: "10px 16px",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(16,22,30,0.96)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  }}
>
  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>
    {saveStatus || ""}
  </div>

  <button className="btn" onClick={handleSaveEntry}>
    Save entry
  </button>
</div>
      </div>
    </div>
    </>
  );
}