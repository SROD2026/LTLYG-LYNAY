// src/components/prayer/PrayerModal.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import Panel from "../ui/Panel.jsx";
import Select from "../ui/Select.jsx";
import Chips from "../ui/Chips.jsx";
import InteroStickFigure from "../interoception/InteroStickFigure.jsx";
import { captureElementPng } from "../../utils/exportHelpers.js";
import {
  appendReflectionEntry,
  loadReflectionLog,
} from "../../utils/logStore.js";
import ScriptureRotator from "../ui/ScriptureRotator.jsx";



const NEGATIVE_BODY_MAP = {
  Chest: [
    "Tightness",
    "Stabbing pain",
    "Pressure",
    "Warmth",
    "Fluttering",
    "Racing heartbeat",
    "Heavy weight",
    "Crushing sensation",
    "Painful tension",
    "Shallow breathing",
    "Buzzing or vibrating",
    "Cold, hollow overwhelming sensation",
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
    "Gentle mental energy",
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
    "Calm expression",
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
    "Restful",
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
    "Soft heaviness in a good way",
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
    "Quiet strength",
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
    "More settled",
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
    "Quiet joy",
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

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function rotateFromIndex(arr, startIndex) {
  const list = safeArray(arr);
  if (!list.length) return [];
  const start = ((startIndex % list.length) + list.length) % list.length;
  return [...list.slice(start), ...list.slice(0, start)];
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

function randomIndex(max) {
  return Math.floor(Math.random() * max);
}

export default function PrayerModal({ open, onClose, cell, meta = {} }) {
  const emotion = useMemo(() => String(cell?.emotion || "").trim(), [cell]);
  const nextStepRef = useRef(null);
  const entry = useMemo(() => meta?.[emotion] || null, [meta, emotion]);
  const interoBodyMap = useMemo(() => {
  const x = Number(cell?.x || 0);
  return x < 0 ? NEGATIVE_BODY_MAP : POSITIVE_BODY_MAP;
}, [cell]);
  
  const [prayerPromptIndex, setPrayerPromptIndex] = useState(0);
  const [scriptureStartIndex, setScriptureStartIndex] = useState(0);
  const prayerPromptOptions = useMemo(() => {
  const prompts = safeArray(entry?.prayer_prompts).filter(Boolean);
  if (prompts.length) return prompts;

  return entry?.prayer_prompt ? [entry.prayer_prompt] : [];
}, [entry]);

const activePrayerPrompt =
  prayerPromptOptions[prayerPromptIndex] ||
  entry?.prayer_prompt ||
  "";

const rotatedScriptures = useMemo(() => {
  return rotateFromIndex(entry?.scriptures || [], scriptureStartIndex);
}, [entry, scriptureStartIndex]);
  const tone = useMemo(() => toneForCore(entry?.core_emotion), [entry]);

  const [intero, setIntero] = useState([blankIntero(), blankIntero(), blankIntero()]);
  const [activeInteroTab, setActiveInteroTab] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [redirectIndex, setRedirectIndex] = useState(0);
const [spacerHeight, setSpacerHeight] = useState(0);

  const [writtenPrayer, setWrittenPrayer] = useState("");
const [saveStatus, setSaveStatus] = useState("");
const [showLog, setShowLog] = useState(false);
const [logCount, setLogCount] = useState(0);
const modalCardRef = useRef(null);


      useEffect(() => {
    if (!open) return;
    setLogCount(loadReflectionLog().length);



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
}, [open, writtenPrayer, intero, redirectIndex]);

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
  setPrayerPromptIndex(0);
  setScriptureStartIndex(0);
  }, [emotion]);

  useEffect(() => {
  if (!open || !emotion) return;

  const id = setTimeout(() => {
    nextStepRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 120);

  return () => clearTimeout(id);
}, [open, emotion]);

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
  if (editingIndex !== null) return;

  if (activeInteroTab === 0 && isCompleteIntero(intero[0])) setActiveInteroTab(1);
  if (activeInteroTab === 1 && isCompleteIntero(intero[1])) setActiveInteroTab(2);
}, [intero, activeInteroTab, editingIndex]);

useEffect(() => {
  setIntero([blankIntero(), blankIntero(), blankIntero()]);
  setActiveInteroTab(0);
  setEditingIndex(null);
}, [emotion, cell?.x]);

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

  const active = useMemo(() => intero[activeInteroTab] || blankIntero(), [intero, activeInteroTab]);
 const regionOptions = useMemo(
  () =>
    Object.keys(interoBodyMap).map((r) => ({
      value: r,
      label: r.replaceAll("_", " "),
    })),
  [interoBodyMap]
);

const sensationOptions = useMemo(
  () =>
    !active.region
      ? []
      : (interoBodyMap[active.region] || []).map((s) => ({
          value: s,
          label: s,
        })),
  [active.region, interoBodyMap]
);

  const interoLines = useMemo(() => interoSentences(intero), [intero]);

 const traitLabel = entry?.philippians_trait?.label || "TRUE";

  const redirectOptions = useMemo(() => {
  const starters = {
    TRUE: [
      `Lord, show me the truth while I feel ${emotion}, and direct me back to faithfulness, even now.`,
      `Lord, even while I feel ${emotion}, anchor me in what is true and keep me from distortion.`,
      `Lord, when I feel ${emotion}, bring me back to reality, honesty, and steady trust in you.`,
      `Lord, even while I feel ${emotion}, correct my thoughts and keep me close to what is true.`,
      `Lord, meet me in this feeling of ${emotion} and keep me from believing what is false.`,
      `Lord, even while I feel ${emotion}, steady me in truth and guard me from exaggeration or fear.`,
      `Lord, teach me to face this feeling of ${emotion} honestly and in the light of your truth.`,
      `Lord, even while I feel ${emotion}, help me remember what is real, faithful, and trustworthy.`,
      `Lord, pull me out of confusion while I feel ${emotion}, and root me again in what is true.`,
      `Lord, even while I feel ${emotion}, make me truthful in thought, speech, and response.`,
      `Lord, as I feel ${emotion}, keep me from distortion and lead me into honesty and peace.`,
      `Lord, help me not to rehearse falsehood while I feel ${emotion}, but to return to truth.`,
      `Lord, even while I feel ${emotion}, let truth become stronger than fear, impulse, or assumption.`,
      `Lord, show me what is true in this moment while I feel ${emotion}, and help me walk in it.`,
      `Lord, even while I feel ${emotion}, bring clarity where I am tempted toward confusion or misreading.`,
      `Lord, make me faithful to what is true while I feel ${emotion}, even if it is difficult.`,
      `Lord, even while I feel ${emotion}, keep my mind anchored in reality and my heart anchored in you.`,
      `Lord, lead me out of inward distortion while I feel ${emotion}, and back into truth and trust.`,
      `Lord, even while I feel ${emotion}, make me honest before you, honest with myself, and honest with others.`,
      `Lord, teach me to think truthfully while I feel ${emotion}, and to remain steady in your presence.`,
    ],

    Just: [
      `Lord, help me respond to the feeling that I am ${emotion} in a just and rightly ordered way. Grant me patience and wisdom.`,
      `Lord, even while I feel ${emotion}, keep my response fair, restrained, and aligned with what is right.`,
      `Lord, when I feel ${emotion}, teach me to act with justice, patience, and wisdom instead of impulse.`,
      `Lord, help me carry this feeling of ${emotion} without becoming reactive, harsh, or unfair.`,
      `Lord, even while I feel ${emotion}, guide me to what is right rather than what is merely immediate.`,
      `Lord, make my response to feeling ${emotion} to be measured, fair, and honest before you.`,
      `Lord, even while I feel ${emotion}, keep me from self-justification and lead me toward what is just.`,
      `Lord, help me respond to this feeling of ${emotion} with wisdom, restraint, and right order.`,
      `Lord, even while I feel ${emotion}, teach me to seek justice without abandoning gentleness or truth.`,
      `Lord, as I feel ${emotion}, keep me from impulsive action and lead me into what is right.`,
      `Lord, even while I feel ${emotion}, make my response patient, sober, and aligned with righteousness.`,
      `Lord, let this feeling of ${emotion} not rule me; instead, guide me into justice and wisdom.`,
      `Lord, even while I feel ${emotion}, train me to act in ways that are fair, truthful, and ordered.`,
      `Lord, help me not to misuse this feeling of ${emotion}, but to respond in a way that is just.`,
      `Lord, even while I feel ${emotion}, keep me from partiality, exaggeration, and reactive judgment.`,
      `Lord, lead my response to feeling ${emotion} into patience, integrity, and right proportion.`,
      `Lord, even while I feel ${emotion}, let me honor what is right rather than what is easiest.`,
      `Lord, make me careful and just in how I respond while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, guard me from unfairness and teach me to walk in wisdom.`,
      `Lord, help me carry this feeling of ${emotion} in a rightly ordered, patient, and just way.`,
    ],

    Honorable: [
      `Lord, let this feeling that I am ${emotion} allow me to lead with dignity, restraint, and integrity.`,
      `Lord, even while I feel ${emotion}, keep me honorable in conduct, speech, and posture.`,
      `Lord, let me carry this feeling of ${emotion} with dignity instead of impulsiveness or disorder.`,
      `Lord, even while I feel ${emotion}, help me remain upright, respectful, and self-controlled.`,
      `Lord, make my response to feeling ${emotion} honorable, steady, and worthy of trust.`,
      `Lord, even while I feel ${emotion}, guard my dignity and help me honor the dignity of others.`,
      `Lord, teach me to walk with restraint and integrity while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, keep me from pettiness and lead me into honorable conduct.`,
      `Lord, let this feeling of ${emotion} be carried with maturity, steadiness, and self-respect.`,
      `Lord, even while I feel ${emotion}, help me remain composed, clean in speech, and upright in motive.`,
      `Lord, make me honorable in how I carry this feeling of ${emotion}, even in difficulty.`,
      `Lord, even while I feel ${emotion}, form in me restraint, reverence, and integrity.`,
      `Lord, guard me from acting beneath what is honorable while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, help me lead with dignity rather than reaction.`,
      `Lord, make my response to feeling ${emotion} worthy of trust, sobriety, and integrity.`,
      `Lord, even while I feel ${emotion}, keep my posture honorable and my speech disciplined.`,
      `Lord, teach me to bear this feeling of ${emotion} with seriousness, dignity, and grace.`,
      `Lord, even while I feel ${emotion}, let my conduct remain honorable before you and others.`,
      `Lord, preserve my integrity while I feel ${emotion}, and keep my response clean and restrained.`,
      `Lord, even while I feel ${emotion}, help me choose what is dignified, respectful, and honorable.`,
    ],

    Lovely: [
      `Lord, let this ${emotion} feeling move me towards kindness, gentleness, and gratitude.`,
      `Lord, while I feel ${emotion}, soften my response with kindness, gentleness, and peace.`,
      `Lord, let this feeling of ${emotion} be redirected toward tenderness, beauty, and grace.`,
      `Lord, even while I feel ${emotion}, keep me from hardness and move me toward gentleness.`,
      `Lord, teach me to carry this feeling of ${emotion} in a way that protects love.`,
      `Lord, even while I feel ${emotion}, make my response tender rather than sharp or closed off.`,
      `Lord, let this feeling of ${emotion} move me toward compassion, patience, and beauty.`,
      `Lord, even while I feel ${emotion}, redirect me away from bitterness and toward love.`,
      `Lord, soften this feeling of ${emotion} so that kindness can remain present in me.`,
      `Lord, even while I feel ${emotion}, let gentleness shape my speech and gratitude steady my heart.`,
      `Lord, help me respond to feeling ${emotion} with warmth, grace, and a gentle spirit.`,
      `Lord, even while I feel ${emotion}, keep my heart open to kindness and my mind open to gratitude.`,
      `Lord, let this feeling of ${emotion} be transformed into gentleness rather than defensiveness.`,
      `Lord, even while I feel ${emotion}, move me toward what is tender, patient, and life-giving.`,
      `Lord, teach me to remain softhearted while I feel ${emotion}, without abandoning truth.`,
      `Lord, even while I feel ${emotion}, help me answer with gentleness and receive grace.`,
      `Lord, let this ${emotion} feeling lead me into compassion, humility, and gratitude.`,
      `Lord, even while I feel ${emotion}, make me attentive to beauty, mercy, and peace.`,
      `Lord, redirect my feeling of ${emotion} toward love, gentleness, and thankfulness.`,
      `Lord, even while I feel ${emotion}, let kindness and gratitude grow stronger than harshness or fear.`,
    ],

    Excellent: [
`Lord, direct this ${emotion} feeling to motivate me toward faithful action, order, and stewardship.`,
      `Lord, even while I feel ${emotion}, direct me toward what is faithful, disciplined, and excellent.`,
      `Lord, let this feeling of ${emotion} move me into wise action, order, and responsibility.`,
      `Lord, even while I feel ${emotion}, teach me to channel it into diligence and faithful stewardship.`,
      `Lord, make my response to feeling ${emotion} purposeful, disciplined, and constructive.`,
      `Lord, even while I feel ${emotion}, keep me from passivity and disorder, and move me toward faithfulness.`,
      `Lord, direct this feeling of ${emotion} toward what builds, repairs, and serves well.`,
      `Lord, even while I feel ${emotion}, help me choose what is excellent over what is careless or reactive.`,
      `Lord, train me to carry this feeling of ${emotion} into faithful action and wise order.`,
      `Lord, even while I feel ${emotion}, strengthen me for stewardship, diligence, and perseverance.`,
      `Lord, let this feeling of ${emotion} produce steadiness, responsibility, and care.`,
      `Lord, even while I feel ${emotion}, help me act in ways that are disciplined, useful, and faithful.`,
      `Lord, direct my feeling of ${emotion} into what is ordered, fruitful, and excellent.`,
      `Lord, even while I feel ${emotion}, help me resist chaos and move toward wise stewardship.`,
      `Lord, make my response to feeling ${emotion} constructive, faithful, and well-ordered.`,
      `Lord, even while I feel ${emotion}, guide me into excellence rather than withdrawal or impulsiveness.`,
      `Lord, let this feeling of ${emotion} become fuel for what is faithful, careful, and good.`,
      `Lord, even while I feel ${emotion}, lead me toward ordered action and humble responsibility.`,
      `Lord, help me turn this feeling of ${emotion} into diligence, steadiness, and stewardship.`,
      `Lord, even while I feel ${emotion}, direct me into faithful action that honors you.`,
    ],

    Commendable: [
      `Lord, teach me to notice grace, growth, and what is already good.`,
      `Lord, even while I feel ${emotion}, help me notice grace, growth, and what is still good.`,
      `Lord, teach me not to lose sight of mercy while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, direct my attention toward what is gracious and worthy.`,
      `Lord, help me see evidences of grace even while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, keep me from fixation on what is dark and help me notice what is good.`,
      `Lord, let me perceive growth, mercy, and goodness while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, teach me to remember grace and not only pain.`,
      `Lord, direct my attention toward what is praiseworthy and life-giving while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, help me notice what is honorable, gracious, and already growing.`,
      `Lord, keep me from totalizing this feeling of ${emotion}, and teach me to see grace clearly.`,
      `Lord, even while I feel ${emotion}, let me remain aware of goodness, mercy, and small evidences of hope.`,
      `Lord, train me to see what is commendable even while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, keep me attentive to grace, movement, and what is still good.`,
      `Lord, help me notice traces of mercy and growth while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, keep my mind from narrowing only to what is painful.`,
      `Lord, let this feeling of ${emotion} not blind me to goodness, grace, and faithful growth.`,
      `Lord, even while I feel ${emotion}, help me remember what is still worthy, good, and hopeful.`,
      `Lord, teach me to see what is commendable with clear eyes, even while I feel ${emotion}.`,
      `Lord, even while I feel ${emotion}, draw my attention toward grace, goodness, and hopeful signs of growth.`,
    ],

    "Worthy of Praise": [
      `Lord, turn this feeling that I am ${emotion} into worship, gratitude, and hope in you.`,
      `Lord, even while I feel ${emotion}, redirect me toward worship, gratitude, and hope.`,
      `Lord, let this feeling of ${emotion} become an offering of trust and praise to you.`,
      `Lord, even while I feel ${emotion}, keep my heart turned toward worship rather than despair.`,
      `Lord, teach me to bring this feeling of ${emotion} into gratitude, hope, and reverence.`,
      `Lord, even while I feel ${emotion}, make room in me for worship and trust.`,
      `Lord, turn this feeling of ${emotion} into prayer, praise, and deeper dependence on you.`,
      `Lord, even while I feel ${emotion}, lift my eyes toward gratitude and hope in your presence.`,
      `Lord, help me not to be ruled by this feeling of ${emotion}, but to offer it back to you in worship.`,
      `Lord, even while I feel ${emotion}, train my heart toward praise instead of despair or self-absorption.`,
      `Lord, let this feeling of ${emotion} become a pathway into hope, reverence, and gratitude.`,
      `Lord, even while I feel ${emotion}, draw me toward worship that is honest, reverent, and hopeful.`,
      `Lord, help me carry this feeling of ${emotion} into praise and deeper trust in you.`,
      `Lord, even while I feel ${emotion}, teach me to remember your goodness and respond with worship.`,
      `Lord, turn this feeling of ${emotion} into reverent dependence, gratitude, and hope.`,
      `Lord, even while I feel ${emotion}, make worship stronger than despair and gratitude stronger than fear.`,
      `Lord, direct this feeling of ${emotion} toward hope-filled praise and trust in your care.`,
      `Lord, even while I feel ${emotion}, keep my heart open to reverence, worship, and thanksgiving.`,
      `Lord, teach me to let this feeling of ${emotion} become prayerful praise rather than inward collapse.`,
      `Lord, even while I feel ${emotion}, anchor me in worship, gratitude, and hope in you.`,
    ],

    Pure: [
      `Lord, purify my inner response so that it is simple, honest, and clean.`,
      `Lord, even while I feel ${emotion}, make my inward response simple, honest, and pure.`,
      `Lord, purify this feeling of ${emotion} so that it is free from distortion, bitterness, and mixture.`,
      `Lord, even while I feel ${emotion}, cleanse my motives and make my response clean before you.`,
      `Lord, help me carry this feeling of ${emotion} with honesty, simplicity, and purity.`,
      `Lord, even while I feel ${emotion}, remove what is false, manipulative, or mixed in me.`,
      `Lord, purify my response to feeling ${emotion} so that it is straightforward and clean.`,
      `Lord, even while I feel ${emotion}, make my motives honest and my inward posture clear.`,
      `Lord, let this feeling of ${emotion} be stripped of bitterness, exaggeration, and hidden corruption.`,
      `Lord, even while I feel ${emotion}, keep my response free from manipulation and inward impurity.`,
      `Lord, purify this feeling of ${emotion} so that I can bring it to you cleanly and honestly.`,
      `Lord, even while I feel ${emotion}, let my thoughts, motives, and speech remain simple and true.`,
      `Lord, help me not to complicate this feeling of ${emotion} with hidden motives or self-deception.`,
      `Lord, even while I feel ${emotion}, cleanse what is tangled in me and make my inward response clear.`,
      `Lord, make my response to feeling ${emotion} honest, uncorrupted, and clean before you.`,
      `Lord, even while I feel ${emotion}, remove mixture and give me simplicity of heart.`,
      `Lord, purify my inward response to feeling ${emotion} so that it is transparent and sincere.`,
      `Lord, even while I feel ${emotion}, let my motives be clean and my response straightforward.`,
      `Lord, help me bring this feeling of ${emotion} to you without disguise, mixture, or manipulation.`,
      `Lord, even while I feel ${emotion}, make my inward life simple, honest, and pure before you.`,
    ],
  };

  const options = starters[traitLabel];
  if (Array.isArray(options) && options.length) return options;

  return [`Lord, help me think on what is ${traitLabel.toLowerCase()} while I feel ${emotion}.`];
}, [traitLabel, emotion]);

useEffect(() => {
  if (!redirectOptions.length) return;
  setRedirectIndex(randomIndex(redirectOptions.length));
}, [traitLabel, emotion, redirectOptions]);


function showNextRedirect() {
  if (!redirectOptions.length) return;

  setRedirectIndex((prev) => {
    let next = prev;

    while (next === prev && redirectOptions.length > 1) {
      next = randomIndex(redirectOptions.length);
    }

    return next;
  });
}

function showNextPrayerPrompt() {
  if (prayerPromptOptions.length <= 1) return;
  setPrayerPromptIndex((prev) => (prev + 1) % prayerPromptOptions.length);
}

function showNextScriptureSet() {
  const total = safeArray(entry?.scriptures).length;
  if (total <= 1) return;
  setScriptureStartIndex((prev) => (prev + 1) % total);
}

const reframeLine = redirectOptions[redirectIndex] || "";


 async function handleSavePrayer() {
  try {
    const pngDataUrl = await captureElementPng("#prayerStickCapture");

    const payload = {
      ts: new Date().toISOString(),
      type: "prayer",
      title: emotion,
      emotion,
      core_emotion: entry.core_emotion || "",
      definition: entry.definition || "",
prayer_prompt: activePrayerPrompt || entry?.prayer_prompt || "",
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
      pngDataUrl,
    };

    appendReflectionEntry(payload);
    const nextCount = loadReflectionLog().length;
    setLogCount(nextCount);
    setSaveStatus("Emotional state saved!");
    setTimeout(() => setSaveStatus(""), 2000);
  } catch (err) {
    setSaveStatus(`Save failed: ${String(err?.message || err)}`);
  }
}

  if (!open || !entry) return null;

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
justifySelf: "center",
    position: "relative",
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
    overflow: "visible",
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: "auto",
  }}
>

         <div aria-hidden="true" style={{ height: 4, width: "100%", background: tone.bar }} />
<div ref={nextStepRef}>

<div
  className="modalHeader"
  style={{
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 16,
    alignItems: "start",
    background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  }}
>
<div style={{ display: "grid", gap: 8, maxWidth: 620 }}>
  <div className="modalTitle" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.05, color: tone.bar }}>
    {emotion}
  </div>

  <div className="modalSubtitle" 
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

<div className="modalHeaderActions" 
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    minWidth: 0,
  }}
>
  <button className="btn" onClick={() => setShowLog((v) => !v)} style={{ minWidth: 132 }}>
    {showLog ? "Hide log" : "View log"}
  </button>

  <button className="btn" onClick={handleSavePrayer} style={{ minWidth: 132 }}>
    Save prayer
  </button>

  <button className="btn" onClick={onClose} style={{ minWidth: 132 }}>
    Close
  </button>
</div>        </div>

        <div style={{
  padding: "0 18px 18px",
  display: "grid",
  gap: 14,
  overflow: "visible",
}}>

  {showLog ? (
    <Panel
      title="Saved prayer reflections"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
          {logCount} saved reflections on this device
        </div>
      </div>
    </Panel>
  ) : null}

  <Panel
    title="1) Prayer"
  style={{
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.94)"
  }}
>
  
   <div style={{ display: "grid", gap: 16 }}>
    <div style={{ display: "grid", gap: 8 }}>
  <strong>A. Turn the emotion into prayer</strong>

  <p style={{ margin: "6px 0 0", lineHeight: 1.55 }}>
    {activePrayerPrompt}
  </p>

  {prayerPromptOptions.length > 1 ? (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <button
        type="button"
        className="btn"
        onClick={showNextPrayerPrompt}
        style={{ padding: "8px 12px", fontSize: 12, borderRadius: 10 }}
      >
        Show another prayer prompt
      </button>

      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
        {prayerPromptIndex + 1} of {prayerPromptOptions.length}
      </div>
    </div>
  ) : null}
</div>

    <div>
      <strong>B. Recognize the need</strong>
      <p style={{ margin: "6px 0 0", lineHeight: 1.55 }}>
        This emotion may point toward needs such as{" "}
        {(entry.philippians_needs || []).join(", ") || "clarity, help, and steadiness"}.
      </p>
    </div>

    <div style={{ display: "grid", gap: 8 }}>
  <strong>C. Renew the mind</strong>

  <p style={{ margin: "6px 0 0", lineHeight: 1.55 }}>
    {reframeLine}
  </p>

  {redirectOptions.length > 1 ? (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <button
        type="button"
        className="btn"
        onClick={showNextRedirect}
        style={{ padding: "8px 12px", fontSize: 12, borderRadius: 10 }}
      >
        Show another redirect
      </button>

      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
        {redirectIndex + 1} of {redirectOptions.length}
      </div>
    </div>
  ) : null}
</div>
  </div>
</Panel>
</div>

 <Panel
  title="2) God's communication method to us"
  style={{ background: "rgba(255,255,255,0.04)" }}
>
  <div style={{ display: "grid", gap: 10 }}>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {safeArray(entry?.scriptures).length > 1 ? (
        <>
          <button
            type="button"
            className="btn"
            onClick={showNextScriptureSet}
            style={{ padding: "8px 12px", fontSize: 12, borderRadius: 10 }}
          >
            Show another scripture set
          </button>

          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
            Start {scriptureStartIndex + 1} of {safeArray(entry?.scriptures).length}
          </div>
        </>
      ) : null}
    </div>

    <ScriptureRotator
      scriptures={rotatedScriptures}
      perPage={2}
      title="Scripture"
      buttonLabel="Show more"
    />
  </div>
</Panel>

          <Panel title="3) Interoception" style={{ background: "rgba(255,255,255,0.04)" }}>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    alignItems: "start",
  }}
>              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.84)" }}>
                  Notice where this emotion shows up in your body. Naming body sensations can make prayer more concrete instead of vague.
                </div>

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
            <div style={{ fontSize: 13, lineHeight: 1.45, color: "rgba(255,255,255,0.92)" }}>
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
  id="prayerStickCapture"
  style={{
    display: "grid",
    gap: 10,
    justifyItems: "center",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: 10,
    background: "rgba(0,0,0,0.20)",
    minHeight: 260,
    width: "100%",
    boxSizing: "border-box",
  }}
>
<InteroStickFigure
  intero={intero.filter((x) => x.region && x.sensation)}
  theme="prayer"
/>
  <div
    style={{
      fontSize: 12,
      color: "rgba(255,255,255,0.66)",
      textAlign: "center",
      maxWidth: 240,
    }}
  >
                      This section is for noticing, not dramatizing. Bring the body to God as honestly as you bring the emotion.
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="4) Philippians 4:8 reframe" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div style={{ display: "grid", gap: 12 }}>
<div style={{ display: "grid", gap: 10 }}>
  <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.92)" }}>
    {reframeLine}
  </div>

  {redirectOptions.length > 1 ? (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <button
        type="button"
        className="btn"
        onClick={showNextRedirect}
        style={{ padding: "8px 12px", fontSize: 12, borderRadius: 10 }}
      >
        Show another redirect
      </button>

      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
        {redirectIndex + 1} of {redirectOptions.length}
      </div>
    </div>
  ) : null}
</div>

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

   <div
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  <div
    style={{
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      alignItems: "center",
      minWidth: 0,
    }}
  >
    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>
      {logCount} saved reflections
    </div>

    {saveStatus ? (
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
        {saveStatus}
      </div>
    ) : null}
  </div>

  <button className="btn" onClick={handleSavePrayer}>
    Save prayer
  </button>
</div>
  </div>
</Panel>

        </div>
      </div>
    </div>
    </>
  );
}
