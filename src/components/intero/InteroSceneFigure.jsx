import { useMemo, useState, useEffect } from "react";
import {
  INTERO_SCENE_LIBRARY,
  getSceneIdsForEmotion,
} from "../../data/interoScenePresets.js";
import InteroLandscapeScene from "./InteroLandscapeScene.jsx";
import {
  getLandscapeSceneType,
  paletteForScene,
} from "../../data/interoLandscapeConfig.js";

function getQuadrantFromXY(x = 0, y = 0) {
  if (x >= 0 && y < 0) return "q1";
  if (x < 0 && y < 0) return "q2";
  if (x < 0 && y >= 0) return "q3";
  return "q4";
}

function normalizeEmotionKey(emotion) {
  return String(emotion || "")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeRegion(region) {
  return String(region || "").trim();
}

function effectFromSensation(s) {
  const t = String(s || "").toLowerCase();

  if (/(tight|pressure|heavy|crush|clench)/.test(t)) return "pulse";
  if (/(shake|trem|restless|adrenaline|surge)/.test(t)) return "shake";
  if (/(warm|heat|flush)/.test(t)) return "heat";
  if (/(cold|hollow|numb)/.test(t)) return "cool";
  if (/(buzz|vibrat|tingl)/.test(t)) return "spark";
  if (/(fog|confus)/.test(t)) return "fog";
  if (/(dizz|lighthead)/.test(t)) return "spin";

  return "pulse";
}

function buildActiveMap(intero) {
  const out = {};
  for (const item of intero || []) {
    if (!item?.region || !item?.sensation) continue;
    const region = normalizeRegion(item.region);
    const eff = effectFromSensation(item.sensation);
    out[region] = out[region] || [];
    out[region].push(eff);

    if (region === "Whole_Body" && !out[region].includes("pulse")) {
      out[region].push("pulse");
    }
  }
  return out;
}

function regionClass(active, region) {
  const effects = active?.[region] || [];
  if (effects.length === 0) return "";
  return ["overlay", ...effects.map((e) => `eff-${e}`)].join(" ");
}

function isActive(active, region) {
  return (active?.[region] || []).length > 0;
}

function hasAny(key, patterns) {
  return patterns.some((p) => key.includes(p));
}

const POSITIVE_TOKENS = [
  "hope",
  "expect",
  "ready",
  "engaged",
  "purpose",
  "focus",
  "recept",
  "prepare",
  "organ",
  "clear",
  "capable",
  "effective",
  "energ",
  "willing",
  "eager",
  "enthusias",
  "excit",
  "motiv",
  "buoyant",
  "warm",
  "encour",
  "inspir",
  "uplift",
  "alive",
  "radiant",
  "elated",
  "open",
  "interest",
  "expand",
  "poised",
  "momentum",
  "curious",
  "responsive",
  "heartened",
  "animated",
  "bright",
  "awakening",
  "attentive",
  "inclined",
  "openhearted",
  "receive",
  "soothed",
  "comfort",
  "reliev",
  "quiet",
  "restful",
  "mellow",
  "peace",
  "composed",
  "serene",
  "soft",
  "ease",
  "glad",
  "content",
  "satisfied",
  "fulfilled",
  "okay",
  "enough",
  "calm",
  "settled",
  "grateful",
  "thankful",
  "safe",
  "secure",
  "cherished",
  "accepted",
  "included",
  "connected",
  "grounded",
  "cared_for",
  "supported",
  "valued",
  "gentle",
  "present",
  "balanced",
  "peaceful",
  "at_ease",
  "tranquil",
  "whole",
  "nourished",
  "restored",
  "lighthearted",
  "awe",
  "wonder",
  "aligned",
  "authentic",
  "centered",
  "receptive",
  "comforted",
  "reassured",
  "settled_by_this",
  "supported_by_this",
  "for_your_",
  "for_the_",
];

const ANXIETY_TOKENS = [
  "panic",
  "terrif",
  "overwhelm",
  "alarm",
  "anx",
  "fear",
  "worr",
  "appreh",
  "uneas",
  "reactiv",
  "edge",
  "vigil",
  "guard",
  "watch",
  "tense",
  "brace",
  "frustr",
  "blocked",
  "irrit",
  "strain",
  "keyed",
  "disturb",
  "ruffl",
  "pressur",
  "compress",
  "unsettl",
  "disorient",
  "shaken",
  "mentally_busy",
  "cognitively_loaded",
  "scatter",
  "overstim",
  "frazz",
  "overload",
  "jolt",
  "activate",
  "stirred_up",
  "bother",
  "restless",
  "wary",
  "concern",
  "brittle",
  "sensitive",
  "alert",
  "tentative",
  "unsure",
  "monitor",
  "startl",
  "shock",
  "rattl",
  "caught_off_guard",
  "flood",
  "on_edge",
  "urgent",
  "tight",
  "low_grade_tension",
  "steady_pressure",
  "weighted",
  "overresponsible",
  "tasked",
  "pulled",
  "ready_but_tense",
  "compressed",
  "burdened",
  "loaded",
  "rigid",
  "held_tight",
  "restricted",
  "self_monitored",
  "uncertain",
  "bewilder",
  "perplex",
  "puzzled",
  "jumpy",
  "frozen",
  "bracing_for_impact",
  "anticipating",
];

const SADNESS_TOKENS = [
  "sad",
  "down",
  "discour",
  "heavy_hearted",
  "quiet_sadness",
  "lonely",
  "wistful",
  "tender",
  "subdued",
  "reflect",
  "dim",
  "vulnerable",
  "delicate",
  "spent",
  "blue",
  "downcast",
  "weary",
  "heavy",
  "sorrow",
  "flat",
  "somber",
  "disappointed",
  "low_spirited",
  "isolat",
  "disconnect",
  "cut_off",
  "alone",
  "unseen",
  "homesick",
  "heartbroken",
  "grief",
  "devast",
  "crushed",
  "despondent",
  "aching",
  "weep",
  "withdraw",
  "shut_down",
  "collapsed_inward",
  "gone_inward",
  "distant",
  "small",
  "disheartened",
  "saddened",
  "heartbroken_by_you",
  "drained",
  "misunderstood",
  "unsafe_with_you",
  "aching_because_of_you",
  "discouraged_by_you",
  "deflated",
  "low_because_of_you",
  "bummed",
  "hurt",
  "hurt_by_you",
  "forgotten",
  "ignored",
  "overlooked",
  "excluded",
  "shut_out",
  "pushed_away",
  "abandoned",
  "discarded",
  "left_behind",
  "cast_aside",
  "replaced",
  "let_down",
];

const SHAME_TOKENS = [
  "asham",
  "embarr",
  "expos",
  "cring",
  "regret",
  "remorse",
  "self_conscious",
  "flushed",
  "avoid_eye_contact",
  "self_doubt",
  "sheepish",
  "awkward",
  "hesitant",
  "humiliat",
  "shamed",
  "worthless",
  "mortified",
  "belittled",
  "mocked",
  "laughed_at",
  "ridiculed",
  "demeaned",
  "defective",
  "treated_like_a_problem",
  "painted_as_crazy",
  "labeled",
  "boxed_in",
  "condemn",
  "rejected_as_i_am",
  "unacceptable",
  "inadequate",
  "inferior",
  "guilted",
  "cornered",
  "coerc",
  "obligated",
  "disgusted_with_myself",
  "feeling_dirty",
  "feeling_broken",
  "failure",
  "emasculated",
  "second_rate",
  "not_good_enough",
  "hating_myself",
  "regretting_being_me",
  "ashamed_about_me",
];

const DEFENSIVE_TOKENS = [
  "demonized",
  "villainized",
  "enemy",
  "targeted",
  "attacked",
  "disrespect",
  "wronged",
  "gaslit",
  "manipulat",
  "controlled",
  "used",
  "betrayed",
  "played",
  "sabotaged",
  "set_up_to_fail",
  "undermined",
  "provoked",
  "pushed_around",
  "bullied",
  "steamrolled",
  "criticiz",
  "judged",
  "blamed",
  "accused",
  "misrepresent",
  "twisted",
  "annoyed_at_you",
  "frustrated_with_you",
  "fed_up",
  "bristling",
  "shut_down",
  "invalidated",
  "stonewalled",
  "talked_down",
  "dismissed",
  "painted_unfairly",
  "cornered",
  "coerced",
  "pressured_by_you",
  "made_responsible",
];

const ISOLATION_TOKENS = [
  "dismissed",
  "ignored_on_purpose",
  "stonewalled",
  "invalidated",
  "blown_off",
  "unheard",
  "unseen",
  "unvalued",
  "unsupported",
  "unconsidered",
  "not_respected",
  "forgotten",
  "excluded",
  "shut_out",
  "pushed_away",
  "isolated_by_you",
  "unwanted",
  "unimportant",
  "not_a_priority",
  "unloved",
  "unchosen",
  "taken_for_granted",
  "alone_because_of_you",
  "carrying_it_alone",
  "not_cared_for",
  "unprotected",
  "lonely_around_you",
];

function inferEmotionFamily(emotion, mode) {
  const key = normalizeEmotionKey(emotion);

  if (hasAny(key, SHAME_TOKENS)) return "shame";
  if (hasAny(key, ISOLATION_TOKENS)) return "isolation";
  if (hasAny(key, DEFENSIVE_TOKENS)) return "defensive";
  if (hasAny(key, SADNESS_TOKENS)) return "sadness";
  if (hasAny(key, ANXIETY_TOKENS)) return "anxiety";
  if (hasAny(key, POSITIVE_TOKENS)) return "grounded";

  if (mode === "violent") return "defensive";
  if (mode === "prayer") return "sadness";
  if (mode === "checkin") return "grounded";
  return "grounded";
}

function isPrayerPositive(emotion) {
  return inferEmotionFamily(emotion, "prayer") === "grounded";
}

const POSE_POOLS = {
  positive: [
    "grounded_open",
    "joy_one_arm_up",
    "joy_arms_up",
    "joy_dance_right",
    "joy_skip",
    "prayer_open",
  ],

  negative: [
    "braced",
    "defensive",
    "grief_bent",
    "collapsed",
    "seated_reflective",
    "sad_lean_wall",
    "sad_seated_hug",
    "sad_floor_folded",
    "shame_folded",
    "isolated",
  ],

  prayerPositive: [
    "prayer_open",
    "prayer_kneel_open",
    "prayer_kneel_reach",
    "grounded_open",
    "joy_one_arm_up",
    "joy_arms_up",
  ],

  prayerNegative: [
    "prayer_bowed",
    "prayer_seated_bowed",
    "kneel_collapse",
    "prayer_face_down",
    "grief_bent",
    "collapsed",
     "seated_reflective",
    "sad_lean_wall",
    "sad_seated_hug",
  ],
};

function pickFromPool(pool, poseIndex, x, y, emotion) {
  const key = normalizeEmotionKey(emotion);
  const seed = Math.abs((x || 0) * 31 + (y || 0) * 17 + key.length * 13);
  return pool[(seed + poseIndex) % pool.length];
}

function resolvePoseForEmotion({
  emotion = "",
  mode = "",
  poseIndex = 0,
  x = 0,
  y = 0,
}) {
  let pool = [];

  if (mode === "prayer") {
    pool = isPrayerPositive(emotion)
      ? POSE_POOLS.prayerPositive
      : POSE_POOLS.prayerNegative;
  } else if (mode === "checkin") {
    pool = POSE_POOLS.positive;
  } else {
    pool = POSE_POOLS.negative;
  }

  return pickFromPool(pool, poseIndex, x, y, emotion);
}

function midpoint(a, b) {
  if (!a && !b) return { x: 160, y: 160 };
  if (!a) return { x: b.x, y: b.y };
  if (!b) return { x: a.x, y: a.y };

  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function avgPoints(points) {
  const valid = (points || []).filter(Boolean);
  if (!valid.length) return { x: 160, y: 160 };

  return {
    x: valid.reduce((sum, p) => sum + p.x, 0) / valid.length,
    y: valid.reduce((sum, p) => sum + p.y, 0) / valid.length,
  };
}

function getShadow(shadow) {
  if (shadow === null) return null;

  return {
    cx: shadow?.cx ?? 160,
    cy: shadow?.cy ?? 286,
    rx: shadow?.rx ?? 56,
    ry: shadow?.ry ?? 9,
  };
}

function regionGeometryFromPose(def) {
  const j = def?.joints;
  if (!j) return null;

  const hasPaired =
    j.leftShoulder &&
    j.rightShoulder &&
    j.leftElbow &&
    j.rightElbow &&
    j.leftHand &&
    j.rightHand &&
    j.leftHip &&
    j.rightHip &&
    j.leftKnee &&
    j.rightKnee &&
    j.leftAnkle &&
    j.rightAnkle &&
    j.leftFoot &&
    j.rightFoot &&
    j.pelvis;

  if (hasPaired) {
    const leftArmMid = avgPoints([j.leftElbow, j.leftHand]);
    const rightArmMid = avgPoints([j.rightElbow, j.rightHand]);
    const leftLegMid = avgPoints([j.leftKnee, j.leftAnkle, j.leftFoot]);
    const rightLegMid = avgPoints([j.rightKnee, j.rightAnkle, j.rightFoot]);
    const throatMid = midpoint(j.leftShoulder, j.rightShoulder);

    const wholeBodyPath = `
      M ${j.head.cx - 10} ${j.head.cy - 8}
      Q ${j.leftShoulder.x - 10} ${j.leftShoulder.y}, ${j.leftHip.x - 10} ${j.leftHip.y}
      Q ${j.leftKnee.x - 10} ${j.leftKnee.y}, ${j.leftFoot.x} ${j.leftFoot.y + 8}
      L ${j.rightFoot.x} ${j.rightFoot.y + 8}
      Q ${j.rightKnee.x + 10} ${j.rightKnee.y}, ${j.rightHip.x + 10} ${j.rightHip.y}
      Q ${j.rightShoulder.x + 10} ${j.rightShoulder.y}, ${j.head.cx + 10} ${j.head.cy - 8}
      Z
    `;

    return {
      head: {
        cx: j.head.cx,
        cy: j.head.cy,
        r: j.head.r + 4,
      },
      throat: {
        x: throatMid.x - 8,
        y: j.neck.y - 7,
        w: 16,
        h: 14,
        rx: 5,
      },
      chest: {
        cx: j.chest.x,
        cy: j.chest.y,
        rx: 22,
        ry: 16,
      },
      abdomen: {
        cx: j.abdomen.x,
        cy: j.abdomen.y,
        rx: 22,
        ry: 16,
      },
      arms: [
        { cx: leftArmMid.x, cy: leftArmMid.y, r: 12 },
        { cx: rightArmMid.x, cy: rightArmMid.y, r: 12 },
      ],
      legs: [
        { cx: leftLegMid.x, cy: leftLegMid.y, r: 12 },
        { cx: rightLegMid.x, cy: rightLegMid.y, r: 12 },
      ],
      wholeBodyPath,
    };
  }

  const shoulder = j.shoulder || j.chest || j.neck;
  const hip = j.hip || j.abdomen || j.chest;
  const elbow = j.elbow || shoulder;
  const hand = j.hand || elbow;
  const knee = j.knee || hip;
  const ankle = j.ankle || knee;
  const foot = j.foot || ankle;

  const chestMid = avgPoints([j.neck, j.chest, shoulder]);
  const abdomenMid = avgPoints([j.chest, j.abdomen, hip]);
  const armMid = avgPoints([elbow, hand]);
  const legMid = avgPoints([knee, ankle, foot]);

  const wholeBodyPath = `
    M ${j.head.cx - 10} ${j.head.cy - 8}
    Q ${shoulder.x - 16} ${shoulder.y - 6}, ${j.chest.x - 14} ${j.chest.y + 4}
    Q ${j.abdomen.x - 16} ${j.abdomen.y + 6}, ${hip.x - 8} ${hip.y + 8}
    Q ${knee.x - 8} ${knee.y + 6}, ${foot.x} ${foot.y + 8}
    L ${foot.x + 18} ${foot.y + 8}
    Q ${knee.x + 10} ${knee.y - 2}, ${hip.x + 10} ${hip.y}
    Q ${j.abdomen.x + 16} ${j.abdomen.y - 2}, ${j.chest.x + 14} ${j.chest.y - 2}
    Q ${shoulder.x + 12} ${shoulder.y - 8}, ${j.head.cx + 10} ${j.head.cy - 8}
    Z
  `;

  return {
    head: {
      cx: j.head.cx,
      cy: j.head.cy,
      r: j.head.r + 4,
    },
    throat: {
      x: j.neck.x - 8,
      y: j.neck.y - 7,
      w: 16,
      h: 14,
      rx: 5,
    },
    chest: {
      cx: chestMid.x,
      cy: chestMid.y,
      rx: 20,
      ry: 15,
    },
    abdomen: {
      cx: abdomenMid.x,
      cy: abdomenMid.y,
      rx: 20,
      ry: 15,
    },
    arms: [{ cx: armMid.x, cy: armMid.y, r: 12 }],
    legs: [{ cx: legMid.x, cy: legMid.y, r: 12 }],
    wholeBodyPath,
  };
}

const POSES = {
  grounded_open: {
    transform: "translate(0, 20)",
    joints: {
      head: { cx: 160, cy: 76, r: 18 },
      neck: { x: 160, y: 100 },
      chest: { x: 160, y: 138 },
      abdomen: { x: 160, y: 172 },
      pelvis: { x: 160, y: 184 },
      leftShoulder: { x: 146, y: 118 },
      rightShoulder: { x: 174, y: 118 },
      leftElbow: { x: 138, y: 140 },
      rightElbow: { x: 182, y: 140 },
      leftHand: { x: 132, y: 154 },
      rightHand: { x: 188, y: 154 },
      leftHip: { x: 150, y: 184 },
      rightHip: { x: 170, y: 184 },
      leftKnee: { x: 152, y: 218 },
      rightKnee: { x: 168, y: 218 },
      leftAnkle: { x: 146, y: 252 },
      rightAnkle: { x: 174, y: 252 },
      leftFoot: { x: 140, y: 252 },
      rightFoot: { x: 180, y: 252 },
      shadow: null,
    },
  },

  braced: {
    transform: "translate(0, 20)",
    joints: {
      head: { cx: 160, cy: 98, r: 18 },
      neck: { x: 160, y: 122 },
      chest: { x: 160, y: 146 },
      abdomen: { x: 160, y: 160 },
      pelvis: { x: 160, y: 174 },
      leftShoulder: { x: 148, y: 128 },
      rightShoulder: { x: 172, y: 128 },
      leftElbow: { x: 132, y: 138 },
      rightElbow: { x: 188, y: 138 },
      leftHand: { x: 122, y: 132 },
      rightHand: { x: 198, y: 132 },
      leftHip: { x: 148, y: 184 },
      rightHip: { x: 172, y: 184 },
      leftKnee: { x: 138, y: 214 },
      rightKnee: { x: 182, y: 214 },
      leftAnkle: { x: 136, y: 252 },
      rightAnkle: { x: 184, y: 252 },
      leftFoot: { x: 130, y: 252 },
      rightFoot: { x: 190, y: 252 },
      shadow: null,
    },
  },

  collapsed: {
    transform: "translate(0, 65)",
    joints: {
      head: { cx: 170, cy: 138, r: 18 },
      neck: { x: 160, y: 160 },
      chest: { x: 150, y: 156 },
      abdomen: { x: 148, y: 188 },
      pelvis: { x: 148, y: 204 },
      leftShoulder: { x: 138, y: 160 },
      rightShoulder: { x: 162, y: 165 },
      leftElbow: { x: 122, y: 186 },
      rightElbow: { x: 172, y: 185 },
      leftHand: { x: 114, y: 210 },
      rightHand: { x: 178, y: 200 },
      leftHip: { x: 138, y: 204 },
      rightHip: { x: 158, y: 204 },
      leftKnee: { x: 142, y: 224 },
      rightKnee: { x: 175, y: 224 },
      leftAnkle: { x: 120, y: 232 },
      rightAnkle: { x: 176, y: 240 },
      leftFoot: { x: 124, y: 238 },
      rightFoot: { x: 184, y: 240 },
      shadow: null,
    },
  },

  shame_folded: {
    transform: "translate(0, 20)",
    joints: {
      head: { cx: 160, cy: 102, r: 18 },
      neck: { x: 160, y: 114 },
      chest: { x: 160, y: 140 },
      abdomen: { x: 160, y: 172 },
      pelvis: { x: 160, y: 182 },
      leftShoulder: { x: 146, y: 122 },
      rightShoulder: { x: 174, y: 122 },
      leftElbow: { x: 148, y: 148 },
      rightElbow: { x: 172, y: 148 },
      leftHand: { x: 152, y: 92 },
      rightHand: { x: 168, y: 92 },
      leftHip: { x: 150, y: 182 },
      rightHip: { x: 170, y: 182 },
      leftKnee: { x: 150, y: 216 },
      rightKnee: { x: 170, y: 216 },
      leftAnkle: { x: 146, y: 252 },
      rightAnkle: { x: 174, y: 252 },
      leftFoot: { x: 140, y: 252 },
      rightFoot: { x: 180, y: 252 },
      shadow: null,
    },
  },

  defensive: {
    transform: "translate(0, 20)",
    joints: {
      head: { cx: 158, cy: 86, r: 18 },
      neck: { x: 158, y: 110 },
      chest: { x: 158, y: 138 },
      abdomen: { x: 158, y: 172 },
      pelvis: { x: 158, y: 184 },
      leftShoulder: { x: 144, y: 120 },
      rightShoulder: { x: 172, y: 120 },
      leftElbow: { x: 126, y: 132 },
      rightElbow: { x: 188, y: 132 },
      leftHand: { x: 148, y: 150 },
      rightHand: { x: 168, y: 150 },
      leftHip: { x: 148, y: 184 },
      rightHip: { x: 168, y: 184 },
      leftKnee: { x: 142, y: 220 },
      rightKnee: { x: 176, y: 220 },
      leftAnkle: { x: 144, y: 252 },
      rightAnkle: { x: 172, y: 252 },
      leftFoot: { x: 138, y: 252 },
      rightFoot: { x: 178, y: 252 },
      shadow: null,
    },
  },

  isolated: {
    transform: "translate(0, 20)",
    joints: {
      head: { cx: 170, cy: 102, r: 18 },
      neck: { x: 156, y: 126 },
      chest: { x: 150, y: 140 },
      abdomen: { x: 148, y: 174 },
      pelvis: { x: 148, y: 194 },
      leftShoulder: { x: 138, y: 124 },
      rightShoulder: { x: 162, y: 124 },
      leftElbow: { x: 126, y: 146 },
      rightElbow: { x: 168, y: 146 },
      leftHand: { x: 120, y: 162 },
      rightHand: { x: 178, y: 162 },
      leftHip: { x: 138, y: 194 },
      rightHip: { x: 158, y: 194 },
      leftKnee: { x: 138, y: 224 },
      rightKnee: { x: 156, y: 224 },
      leftAnkle: { x: 120, y: 252 },
      rightAnkle: { x: 162, y: 252 },
      leftFoot: { x: 112, y: 252 },
      rightFoot: { x: 170, y: 252 },
      shadow: null,
    },
  },

  seated_reflective: {
    joints: {
      head: { cx: 158, cy: 184, r: 18 },
      neck: { x: 158, y: 195 },
      chest: { x: 158, y: 212 },
      abdomen: { x: 160, y: 264 },
      pelvis: { x: 158, y: 270 },
      leftShoulder: { x: 140, y: 206 },
      rightShoulder: { x: 175, y: 206 },
      leftElbow: { x: 120, y: 240 },
      rightElbow: { x: 204, y: 242 },
      leftHand: { x: 120, y: 260 },
      rightHand: { x: 210, y: 260 },
      leftHip: { x: 148, y: 270 },
      rightHip: { x: 168, y: 270 },
      leftKnee: { x: 142, y: 236 },
      rightKnee: { x: 176, y: 234 },
      leftAnkle: { x: 122, y: 278 },
      rightAnkle: { x: 188, y: 278 },
      leftFoot: { x: 114, y: 282 },
      rightFoot: { x: 194, y: 282 },
      shadow: { cx: 160, cy: 286, rx: 62, ry: 11 },
    },
  },

  prayer_bowed: {
    transform: "translate(0 30)",
    joints: {
      head: { cx: 220, cy: 186, r: 18 },
      neck: { x: 190, y: 200 },
      shoulder: { x: 192, y: 176 },
      chest: { x: 190, y: 172 },
      abdomen: { x: 164, y: 184 },
      hip: { x: 138, y: 200 },
      elbow: { x: 192, y: 190 },
      hand: { x: 192, y: 240 },
      knee: { x: 146, y: 244 },
      ankle: { x: 106, y: 228 },
      foot: { x: 100, y: 238 },
      shadow: null,
    },
  },

  prayer_open: {
    transform: "translate(0 20)",
    renderOrder: [
    "leftFoot",
    "rightFoot",
    "leftLowerLeg",
    "rightLowerLeg",
    "leftThigh",
    "rightThigh",

    "pelvis",
    "abdomen",

    "chest",
    "neck",

    "leftUpperArm",
    "leftForearm",
    "rightUpperArm",
    "rightForearm",

    "shoulders",
    "head"
  ],

    joints: {
      head: { cx: 160, cy: 136, r: 18 },
      neck: { x: 160, y: 148 },
      chest: { x: 160, y: 158 },
      abdomen: { x: 160, y: 190 },
      pelvis: { x: 160, y: 222 },
      leftShoulder: { x: 146, y: 162 },
      rightShoulder: { x: 174, y: 162 },
      leftElbow: { x: 126, y: 172 },
      rightElbow: { x: 194, y: 172 },
      leftHand: { x: 104, y: 150 },
      rightHand: { x: 216, y: 150 },
      leftHip: { x: 155, y: 222 },
      rightHip: { x: 165, y: 222 },
      leftKnee: { x: 146, y: 276 },
      rightKnee: { x: 174, y: 276 },
      leftAnkle: { x: 140, y: 244 },
      rightAnkle: { x: 180, y: 244 },
      leftFoot: { x: 132, y: 250 },
      rightFoot: { x: 188, y: 250 },
      shadow: null,
    },
  },

  sad_seated_hug: {
    transform: "translate(0 40)",
    joints: {
      head: { cx: 160, cy: 136, r: 18 },
      neck: { x: 160, y: 148 },
      chest: { x: 160, y: 158 },
      abdomen: { x: 160, y: 190 },
      pelvis: { x: 160, y: 222 },
      leftShoulder: { x: 146, y: 162 },
      rightShoulder: { x: 174, y: 162 },
      leftElbow: { x: 142, y: 168 },
      rightElbow: { x: 178, y: 168 },
      leftHand: { x: 170, y: 188 },
      rightHand: { x: 150, y: 188 },
      leftHip: { x: 150, y: 222 },
      rightHip: { x: 170, y: 222 },
      leftKnee: { x: 146, y: 196 },
      rightKnee: { x: 174, y: 196 },
      leftAnkle: { x: 140, y: 228 },
      rightAnkle: { x: 180, y: 228 },
      leftFoot: { x: 132, y: 232 },
      rightFoot: { x: 188, y: 232 },
      shadow: null,
    },
  },

sad_floor_folded: {
  transform: "translate(-15 80)",
  joints: {
    head: { cx: 188, cy: 112, r: 18 },

    neck: { x: 176, y: 128 },
    chest: { x: 172, y: 152 },
    abdomen: { x: 168, y: 176 },

    leftShoulder: { x: 158, y: 138 },
    rightShoulder: { x: 186, y: 138 },

    leftElbow: { x: 146, y: 168 },
    rightElbow: { x: 202, y: 168 },

    leftHand: { x: 126, y: 180 },
    rightHand: { x: 220, y: 174 },

    pelvis: { x: 170, y: 188 },

    leftHip: { x: 160, y: 188 },
    rightHip: { x: 184, y: 188 },

    leftKnee: { x: 172, y: 206 },
    rightKnee: { x: 208, y: 210 },

    leftAnkle: { x: 204, y: 222 },
    rightAnkle: { x: 236, y: 226 },

    leftFoot: { x: 209, y: 224 },
    rightFoot: { x: 262, y: 230 },

    shadow: { cx: 188, cy: 296, rx: 72, ry: 10 },
  },
},

  sad_lean_wall: {
    transform: "translate(0 20)",
    joints: {
      head: { cx: 172, cy: 120, r: 18 },
      neck: { x: 160, y: 142 },
      chest: { x: 150, y: 148 },
      abdomen: { x: 150, y: 180 },
      pelvis: { x: 150, y: 194 },
      leftShoulder: { x: 140, y: 142 },
      rightShoulder: { x: 160, y: 142 },
      leftElbow: { x: 134, y: 170 },
      rightElbow: { x: 166, y: 158 },
      leftHand: { x: 170, y: 178 },
      rightHand: { x: 154, y: 166 },
      leftHip: { x: 142, y: 194 },
      rightHip: { x: 158, y: 194 },
      leftKnee: { x: 134, y: 224 },
      rightKnee: { x: 166, y: 220 },
      leftAnkle: { x: 128, y: 252 },
      rightAnkle: { x: 170, y: 252 },
      leftFoot: { x: 135, y: 256 },
      rightFoot: { x: 180, y: 256 },
      shadow: null,
    },
  },

  grief_bent: {
    transform: "translate(0 30)",
    joints: {
      head: { cx: 220, cy: 186, r: 18 },
      neck: { x: 195, y: 180 },
      shoulder: { x: 196, y: 176 },
      chest: { x: 190, y: 182 },
      abdomen: { x: 150, y: 190 },
      hip: { x: 138, y: 200 },
      elbow: { x: 192, y: 220 },
      hand: { x: 192, y: 240 },
      knee: { x: 146, y: 244 },
      ankle: { x: 106, y: 238 },
      foot: { x: 100, y: 248 },
      shadow: null,
    },
  },

  kneel_collapse: {
    transform: "translate(40 80)",
    joints: {
      head: { cx: 142, cy: 116, r: 18 },
      neck: { x: 130, y: 135 },
      shoulder: { x: 114, y: 140 },
      chest: { x: 122, y: 140 },
      abdomen: { x: 110, y: 166 },
      hip: { x: 110, y: 168 },
      elbow: { x: 142, y: 168 },
      hand: { x: 162, y: 146 },
      knee: { x: 122, y: 205 },
      ankle: { x: 82, y: 200 },
      foot: { x: 79, y: 210 },
      shadow: null,
    },
  },

  joy_arms_up: {
    transform: "translate(0 20)",
    joints: {
      head: { cx: 160, cy: 74, r: 18 },
      neck: { x: 160, y: 98 },
      chest: { x: 160, y: 136 },
      abdomen: { x: 160, y: 172 },
      pelvis: { x: 160, y: 182 },
      leftShoulder: { x: 146, y: 118 },
      rightShoulder: { x: 174, y: 118 },
      leftElbow: { x: 128, y: 90 },
      rightElbow: { x: 192, y: 90 },
      leftHand: { x: 134, y: 66 },
      rightHand: { x: 186, y: 66 },
      leftHip: { x: 150, y: 182 },
      rightHip: { x: 170, y: 182 },
      leftKnee: { x: 142, y: 218 },
      rightKnee: { x: 178, y: 218 },
      leftAnkle: { x: 146, y: 252 },
      rightAnkle: { x: 174, y: 252 },
      leftFoot: { x: 140, y: 252 },
      rightFoot: { x: 180, y: 252 },
      shadow: null,
    },
  },

  joy_one_arm_up: {
    transform: "translate(0 20)",
    joints: {
      head: { cx: 160, cy: 76, r: 18 },
      neck: { x: 160, y: 100 },
      chest: { x: 160, y: 138 },
      abdomen: { x: 160, y: 174 },
      pelvis: { x: 160, y: 184 },
      leftShoulder: { x: 146, y: 120 },
      rightShoulder: { x: 174, y: 120 },
      leftElbow: { x: 132, y: 92 },
      rightElbow: { x: 182, y: 138 },
      leftHand: { x: 130, y: 70 },
      rightHand: { x: 188, y: 150 },
      leftHip: { x: 150, y: 184 },
      rightHip: { x: 170, y: 184 },
      leftKnee: { x: 142, y: 220 },
      rightKnee: { x: 178, y: 220 },
      leftAnkle: { x: 146, y: 252 },
      rightAnkle: { x: 174, y: 252 },
      leftFoot: { x: 140, y: 252 },
      rightFoot: { x: 180, y: 252 },
      shadow: null,
    },
  },

  joy_dance_right: {
    transform: "translate(0 20)",
    joints: {
      head: { cx: 160, cy: 80, r: 18 },
      neck: { x: 160, y: 104 },
      chest: { x: 160, y: 138 },
      abdomen: { x: 162, y: 170 },
      pelvis: { x: 164, y: 184 },
      leftShoulder: { x: 146, y: 120 },
      rightShoulder: { x: 176, y: 122 },
      leftElbow: { x: 134, y: 146 },
      rightElbow: { x: 188, y: 108 },
      leftHand: { x: 124, y: 168 },
      rightHand: { x: 202, y: 92 },
      leftHip: { x: 152, y: 186 },
      rightHip: { x: 176, y: 186 },
      leftKnee: { x: 150, y: 220 },
      rightKnee: { x: 182, y: 220 },
      leftAnkle: { x: 144, y: 252 },
      rightAnkle: { x: 190, y: 248 },
      leftFoot: { x: 138, y: 252 },
      rightFoot: { x: 198, y: 245 },
      shadow: null,
    },
  },

  joy_skip: {
renderOrder: [
    "rightFoot",
    "leftLowerLeg",
    "leftFoot",
    "rightLowerLeg",
    "leftThigh",
    "rightThigh",

    "pelvis",
    "abdomen",

    "chest",
    "neck",

    "rightUpperArm",
    "rightForearm",

    "leftUpperArm",    "shoulders",

    "leftForearm",
    "head"
  ],
      joints: {
      head: { cx: 160, cy: 78, r: 18 },
      neck: { x: 160, y: 102 },
      chest: { x: 160, y: 138 },
      abdomen: { x: 160, y: 172 },
      pelvis: { x: 160, y: 182 },
      leftShoulder: { x: 146, y: 122 },
      rightShoulder: { x: 174, y: 122 },
      leftElbow: { x: 128, y: 98 },
      rightElbow: { x: 182, y: 142 },
      leftHand: { x: 130, y: 82 },
      rightHand: { x: 200, y: 154 },
      leftHip: { x: 150, y: 182 },
      rightHip: { x: 170, y: 182 },
      leftKnee: { x: 142, y: 214 },
      rightKnee: { x: 182, y: 222 },
      leftAnkle: { x: 146, y: 246 },
      rightAnkle: { x: 190, y: 198 },
      leftFoot: { x: 140, y: 252 },
      rightFoot: { x: 198, y: 188 },
      shadow: null,
    },
  },

  prayer_kneel_open: {
    transform: "translate(0 30)",
    joints: {
      head: { cx: 130, cy: 128, r: 18 },
      neck: { x: 144, y: 155 },
      shoulder: { x: 150, y: 148 },
      chest: { x: 150, y: 166 },
      abdomen: { x: 160, y: 198 },
      hip: { x: 160, y: 206 },
      elbow: { x: 135, y: 182 },
      hand: { x: 120, y: 162 },
      knee: { x: 140, y: 244 },
      ankle: { x: 180, y: 248 },
      foot: { x: 180, y: 258 },
      shadow: null,
    },
  },

  prayer_kneel_reach: {
    transform: "translate(0 30)",
    joints: {
      head: { cx: 130, cy: 138, r: 18 },
      neck: { x: 144, y: 155 },
      shoulder: { x: 150, y: 148 },
      chest: { x: 150, y: 166 },
      abdomen: { x: 160, y: 198 },
      hip: { x: 160, y: 206 },
      elbow: { x: 115, y: 172 },
      hand: { x: 90, y: 152 },
      knee: { x: 140, y: 244 },
      ankle: { x: 180, y: 248 },
      foot: { x: 180, y: 258 },
      shadow: null,
    },
  },

  prayer_seated_bowed: {
    transform: "translate(-20 30)",
    joints: {
      head: { cx: 190, cy: 162, r: 18 },
      neck: { x: 180, y: 170 },
      shoulder: { x: 192, y: 280 },
      chest: { x: 162, y: 192 },
      abdomen: { x: 160, y: 222 },
      hip: { x: 170, y: 240 },
      elbow: { x: 200, y: 190 },
      hand: { x: 220, y: 196 },
      knee: { x: 200, y: 200 },
      ankle: { x: 220, y: 240 },
      foot: { x: 224, y: 240 },
      shadow: null,
    },
  },

  prayer_face_down: {
    joints: {
      head: { cx: 190, cy: 255, r: 18 },
      neck: { x: 165, y: 250 },
      shoulder: { x: 154, y: 250 },
      chest: { x: 154, y: 252 },
      abdomen: { x: 140, y: 250 },
      hip: { x: 116, y: 256 },
      elbow: { x: 170, y: 275 },
      hand: { x: 190, y: 275 },
      knee: { x: 94, y: 275 },
      ankle: { x: 70, y: 270 },
      foot: { x: 60, y: 274 },
      shadow: null,
    },
  },
};

function FigureOverlays({ active, pose }) {
  const def = POSES[pose] || POSES.grounded_open;
  const a = regionGeometryFromPose(def);

  if (!a) return null;

  return (
    <g>
      {isActive(active, "Head") && (
        <circle
          className={regionClass(active, "Head")}
          cx={a.head.cx}
          cy={a.head.cy}
          r={a.head.r}
        />
      )}

      {isActive(active, "Throat") && (
        <rect
          className={regionClass(active, "Throat")}
          x={a.throat.x}
          y={a.throat.y}
          width={a.throat.w}
          height={a.throat.h}
          rx={a.throat.rx}
        />
      )}

      {isActive(active, "Chest") && (
        <ellipse
          className={regionClass(active, "Chest")}
          cx={a.chest.cx}
          cy={a.chest.cy}
          rx={a.chest.rx}
          ry={a.chest.ry}
        />
      )}

      {isActive(active, "Abdomen") && (
        <ellipse
          className={regionClass(active, "Abdomen")}
          cx={a.abdomen.cx}
          cy={a.abdomen.cy}
          rx={a.abdomen.rx}
          ry={a.abdomen.ry}
        />
      )}

      {isActive(active, "Arms_and_Hands") &&
        a.arms.map((arm, idx) => (
          <circle
            key={`arm-${idx}`}
            className={regionClass(active, "Arms_and_Hands")}
            cx={arm.cx}
            cy={arm.cy}
            r={arm.r}
          />
        ))}

      {isActive(active, "Legs_and_Feet") &&
        a.legs.map((leg, idx) => (
          <circle
            key={`leg-${idx}`}
            className={regionClass(active, "Legs_and_Feet")}
            cx={leg.cx}
            cy={leg.cy}
            r={leg.r}
          />
        ))}

      {isActive(active, "Whole_Body") && (
        <path
          className={`${regionClass(active, "Whole_Body")} wholeBody`}
          d={a.wholeBodyPath}
        />
      )}
    </g>
  );
}

function FigurePose({ pose }) {
  const def = POSES[pose] || POSES.grounded_open;
  const j = def.joints;
  const shadow = getShadow(j?.shadow);

  if (!j) return null;

  const OUTLINE = "#8e96a3be";
  const OUTLINE_WIDTH = 20;
  const BODY = "#eef3f6";
  const BODY_WIDTH = 18;

  function StrokePath({ d }) {
    return (
      <>
        <path
          d={d}
          fill="none"
          stroke={OUTLINE}
          strokeWidth={OUTLINE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.72"
        />
        <path
          d={d}
          fill="none"
          stroke={BODY}
          strokeWidth={BODY_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    );
  }

  function HeadShape({ cx, cy, r }) {
    return (
      <>
        <circle cx={cx} cy={cy} r={r + 3} fill={OUTLINE} opacity="0.72" />
        <circle cx={cx} cy={cy} r={r} fill={BODY} />
      </>
    );
  }

  const hasPaired =
    j.leftShoulder &&
    j.rightShoulder &&
    j.leftElbow &&
    j.rightElbow &&
    j.leftHand &&
    j.rightHand &&
    j.leftHip &&
    j.rightHip &&
    j.leftKnee &&
    j.rightKnee &&
    j.leftAnkle &&
    j.rightAnkle &&
    j.leftFoot &&
    j.rightFoot &&
    j.pelvis;

  if (hasPaired) {
    const neck = `M ${j.neck.x} ${j.neck.y} L ${j.chest.x} ${j.chest.y}`;
    const chest = `M ${j.chest.x} ${j.chest.y} L ${j.abdomen.x} ${j.abdomen.y}`;
    const abdomen = `M ${j.abdomen.x} ${j.abdomen.y} L ${j.pelvis.x} ${j.pelvis.y}`;

    const shoulders = `M ${j.leftShoulder.x} ${j.leftShoulder.y} L ${j.rightShoulder.x} ${j.rightShoulder.y}`;
    const pelvis = `M ${j.leftHip.x} ${j.leftHip.y} L ${j.rightHip.x} ${j.rightHip.y}`;

    const leftUpperArm = `M ${j.leftShoulder.x} ${j.leftShoulder.y} L ${j.leftElbow.x} ${j.leftElbow.y}`;
    const leftForearm = `M ${j.leftElbow.x} ${j.leftElbow.y} L ${j.leftHand.x} ${j.leftHand.y}`;
    const rightUpperArm = `M ${j.rightShoulder.x} ${j.rightShoulder.y} L ${j.rightElbow.x} ${j.rightElbow.y}`;
    const rightForearm = `M ${j.rightElbow.x} ${j.rightElbow.y} L ${j.rightHand.x} ${j.rightHand.y}`;

    const leftThigh = `M ${j.leftHip.x} ${j.leftHip.y} L ${j.leftKnee.x} ${j.leftKnee.y}`;
    const leftLowerLeg = `M ${j.leftKnee.x} ${j.leftKnee.y} L ${j.leftAnkle.x} ${j.leftAnkle.y}`;
    const leftFoot = `M ${j.leftAnkle.x} ${j.leftAnkle.y} L ${j.leftFoot.x} ${j.leftFoot.y}`;

    const rightThigh = `M ${j.rightHip.x} ${j.rightHip.y} L ${j.rightKnee.x} ${j.rightKnee.y}`;
    const rightLowerLeg = `M ${j.rightKnee.x} ${j.rightKnee.y} L ${j.rightAnkle.x} ${j.rightAnkle.y}`;
    const rightFoot = `M ${j.rightAnkle.x} ${j.rightAnkle.y} L ${j.rightFoot.x} ${j.rightFoot.y}`;

    return (
      <g>
        {shadow && (
          <ellipse
            cx={shadow.cx}
            cy={shadow.cy}
            rx={shadow.rx}
            ry={shadow.ry}
            fill="rgba(0,0,0,0.18)"
          />
        )}

        {(() => {
          const partMap = {
            leftFoot,
            rightFoot,
            leftLowerLeg,
            rightLowerLeg,
            leftThigh,
            rightThigh,
            pelvis,
            abdomen,
            chest,
            neck,
            leftUpperArm,
            rightUpperArm,
            leftForearm,
            rightForearm,
            shoulders,
          };

          const order =
            def.renderOrder || [
              "abdomen",
              "chest",
              "neck",
              "leftUpperArm",
              "rightUpperArm",
              "shoulders",
              "leftThigh",
              "rightThigh",
              "pelvis",
              "head",
              "leftForearm",
              "rightForearm",
              "leftLowerLeg",
              "rightLowerLeg",
             "leftFoot",
              "rightFoot",             
    ];

  return order.map((part) => {
    if (part === "head") {
      return <HeadShape key="head" cx={j.head.cx} cy={j.head.cy} r={j.head.r} />;
    }

    const d = partMap[part];
    return d ? <StrokePath key={part} d={d} /> : null;
  });
})()}      </g>
    );
  }

  const neck = `M ${j.neck.x} ${j.neck.y} L ${j.chest.x} ${j.chest.y}`;
  const chest = `M ${j.chest.x} ${j.chest.y} L ${j.abdomen.x} ${j.abdomen.y}`;
  const abdomen = `M ${j.abdomen.x} ${j.abdomen.y} L ${j.hip.x} ${j.hip.y}`;
  const armUpper = `M ${j.chest.x} ${j.chest.y} L ${j.elbow.x} ${j.elbow.y}`;
  const armLower = `M ${j.elbow.x} ${j.elbow.y} L ${j.hand.x} ${j.hand.y}`;
  const thigh = `M ${j.hip.x} ${j.hip.y} L ${j.knee.x} ${j.knee.y}`;
  const lowerLeg = `M ${j.knee.x} ${j.knee.y} L ${j.ankle.x} ${j.ankle.y}`;
  const foot = `M ${j.ankle.x} ${j.ankle.y} L ${j.foot.x} ${j.foot.y}`;

  return (
    <g>
      {shadow && (
        <ellipse
          cx={shadow.cx}
          cy={shadow.cy}
          rx={shadow.rx}
          ry={shadow.ry}
          fill="rgba(0,0,0,0.18)"
        />
      )}

      <StrokePath d={foot} />
      <StrokePath d={lowerLeg} />
      <StrokePath d={thigh} />
      <StrokePath d={abdomen} />
      <StrokePath d={chest} />
      <StrokePath d={neck} />
      <StrokePath d={armUpper} />
      <StrokePath d={armLower} />

<HeadShape cx={j.head.cx} cy={j.head.cy} r={j.head.r} />    </g>
  );
}

export default function InteroSceneFigure({
  intero = [],
  emotion = "",
  mode = "nvc",
  x = 0,
  y = 0,
  width = 320,
  height = 320,
  showControls = true,
}) {
  const active = useMemo(() => buildActiveMap(intero), [intero]);
  const sceneIds = useMemo(() => getSceneIdsForEmotion(emotion, mode), [emotion, mode]);
  const [sceneIndex, setSceneIndex] = useState(0);
const [poseIndex, setPoseIndex] = useState(0);

useEffect(() => {
  setSceneIndex(0);
  setPoseIndex(0);
}, [emotion, mode]);


  const safeSceneIds = sceneIds.length ? sceneIds : ["peaceful_garden_1"];
  const sceneId = safeSceneIds[sceneIndex % safeSceneIds.length];
  const scene =
    INTERO_SCENE_LIBRARY[sceneId] || INTERO_SCENE_LIBRARY.peaceful_garden_1;

  const gridType =
    mode === "violent"
      ? "violent"
      : mode === "checkin"
        ? "gratitude"
        : mode === "prayer"
          ? "prayer"
          : "nvc";


const palette = paletteForScene({
  mode,
  x,
  y,
});

const sceneVariation = sceneIndex;
const landscapeSceneType = getLandscapeSceneType(
  gridType,
  x,
  y,
  sceneVariation
);

  const pose = resolvePoseForEmotion({ emotion, mode, poseIndex, x, y });
  const figureLabel = `${String(
    emotion || scene?.label || "emotion"
  )} interoception figure`;

  return (
    <div style={{ display: "grid", gap: 10, placeItems: "center" }}>
      <svg
        id="intero-figure"
        width={width}
        height={height}
        viewBox="0 0 320 320"
        aria-label={figureLabel}
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          borderRadius: 22,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.10), 0 10px 26px rgba(0,0,0,0.16)",
        }}
      >
        <defs>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          .overlay {
            fill: rgba(255, 180, 110, 0.40);
            stroke: rgba(255, 235, 180, 0.78);
            stroke-width: 2;
            filter: url(#softGlow);
          }
          .eff-pulse { animation: none; }
          .eff-shake { fill: rgba(255, 140, 140, 0.40); }
          .eff-heat { fill: rgba(255, 120, 80, 0.42); }
          .eff-cool { fill: rgba(120, 190, 255, 0.34); }
          .eff-spark { fill: rgba(255, 235, 120, 0.44); }
          .eff-fog { fill: rgba(210, 210, 230, 0.34); }
          .eff-spin { fill: rgba(200, 170, 255, 0.36); }
          .wholeBody { opacity: 0.48; }
        `}</style>

        <InteroLandscapeScene sceneType={landscapeSceneType} palette={palette} />

        <g transform={(POSES[pose] && POSES[pose].transform) || ""}>
          <FigurePose pose={pose} />
          <FigureOverlays active={active} pose={pose} />
        </g>

        <text
          x="12"
          y="20"
          fontSize="12"
          fill="rgba(255,255,255,0.72)"
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {pose}
        </text>
      </svg>

      {showControls ? (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {safeSceneIds.length > 1 ? (
            <button
              type="button"
              className="btn"
              onClick={() => setSceneIndex((v) => (v + 1) % safeSceneIds.length)}
              style={{ fontSize: "0.84rem", padding: "6px 10px" }}
            >
              Show another scene
            </button>
          ) : null}

          <button
            type="button"
            className="btn"
            onClick={() => setPoseIndex((v) => v + 1)}
            style={{ fontSize: "0.84rem", padding: "6px 10px" }}
          >
            Show another pose
          </button>
        </div>
      ) : null}    </div>
  );
}