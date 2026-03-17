const NEGATIVE_POSES = [
  "stand_hunch",
  "crouch",
  "head_in_hands",
  "sit_slump",
  "sit_reflective",
  "kneel_bowed",
];

const POSITIVE_POSES = [
  "stand_open",
  "hands_open",
  "seated_reflective",
  "prayer_open",
];

const NEGATIVE_PRAYER_POSES = [
  "kneel_bowed",
  "one_knee_prayer",
  "sit_reflective",
];

const POSITIVE_PRAYER_POSES = [
  "kneel_prayer",
  "prayer_open",
  "hands_open",
];
const GRATITUDE_POSE_FAMILIES = {
  grateful: ["stand_open", "hands_open", "seated_reflective"],
  thankful: ["stand_open", "hands_open"],
  peaceful: ["seated_reflective", "stand_open"],
  supported: ["seated_reflective", "stand_open"],
  encouraged: ["hands_open", "stand_open"],
  joyful: ["hands_open", "prayer_open", "stand_open"],
};

const NVC_NEGATIVE_BY_QUADRANT = {
  topLeft: ["stand_hunch", "crouch", "head_in_hands"],
  topRight: ["stand_hunch", "head_in_hands"],
  bottomLeft: ["sit_slump", "sit_reflective", "head_in_hands"],
  bottomRight: ["sit_reflective", "sit_slump"],
};

const VIOLENT_NEGATIVE_BY_QUADRANT = {
  topLeft: ["stand_hunch", "crouch", "head_in_hands"],
  topRight: ["stand_hunch", "head_in_hands"],
  bottomLeft: ["sit_slump", "sit_reflective", "head_in_hands"],
  bottomRight: ["sit_reflective", "sit_slump"],
};

const PRAYER_NEGATIVE_BY_QUADRANT = {
  topLeft: ["kneel_bowed", "one_knee_prayer", "head_in_hands"],
  bottomLeft: ["sit_reflective", "kneel_bowed", "sit_slump"],
};

const PRAYER_POSITIVE_BY_QUADRANT = {
  topRight: ["prayer_open", "hands_open", "kneel_prayer"],
  bottomRight: ["seated_reflective", "stand_open", "kneel_prayer"],
};
function quadrantKey(x, y) {
  if (x < 0 && y > 0) return "topLeft";
  if (x > 0 && y > 0) return "topRight";
  if (x < 0 && y < 0) return "bottomLeft";
  return "bottomRight";
}

function hashIndex(str, len) {
  const s = String(str || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return len ? h % len : 0;
}

export function getPosePool({ emotion = "", mode = "nvc", x = 0, y = 0 }) {
  const q = quadrantKey(x, y);
  const key = String(emotion || "").trim().toLowerCase();

  if (mode === "checkin") {
    return GRATITUDE_POSE_FAMILIES[key] || POSITIVE_POSES;
  }

  if (mode === "prayer") {
    if (x < 0) return PRAYER_NEGATIVE_BY_QUADRANT[q] || NEGATIVE_PRAYER_POSES;
    return PRAYER_POSITIVE_BY_QUADRANT[q] || POSITIVE_PRAYER_POSES;
  }

  if (mode === "violent") {
    return VIOLENT_NEGATIVE_BY_QUADRANT[q] || NEGATIVE_POSES;
  }

  return NVC_NEGATIVE_BY_QUADRANT[q] || NEGATIVE_POSES;
}

export function getPoseForEmotion(args) {
  const pool = getPosePool(args);
  return pool[hashIndex(`${args.mode}:${args.emotion}:${args.x}:${args.y}`, pool.length)];
}