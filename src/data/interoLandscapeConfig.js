// src/data/interoLandscapeConfig.js

export const LANDSCAPE_PALETTES = {
  yellow: {
    skyTop: "#f2df7a",
    skyBottom: "#e4ce67",
    sunMoon: "#fff6cf",
    far: "#cdb960",
    mid: "#af9a46",
    near: "#8d7a33",
    ground: "#6c5d27",
    detail: "#4d431d",
    accent: "#fff0a2",
  },

  orange: {
    skyTop: "#f2b067",
    skyBottom: "#e38a45",
    sunMoon: "#fff1d7",
    far: "#cf7b33",
    mid: "#b96728",
    near: "#97511f",
    ground: "#733d18",
    detail: "#552b10",
    accent: "#ffd29f",
  },

  pink: {
    skyTop: "#e7a4c3",
    skyBottom: "#d97aa8",
    sunMoon: "#fff0f6",
    far: "#c56b95",
    mid: "#aa557f",
    near: "#8d4469",
    ground: "#6f3453",
    detail: "#51253c",
    accent: "#ffd5e6",
  },

  purple: {
    skyTop: "#7b6ccf",
    skyBottom: "#c9c2f2",
    sunMoon: "#f2ecff",
    far: "#8c7ed1",
    mid: "#6c5fb6",
    near: "#55479a",
    ground: "#3e3475",
    detail: "#2b2454",
    accent: "#f0eaff",
  },

  blue: {
    skyTop: "#90a9d6",
    skyBottom: "#738fc3",
    sunMoon: "#f2f4e8",
    far: "#647ca8",
    mid: "#4f6690",
    near: "#405579",
    ground: "#334663",
    detail: "#24364f",
    accent: "#d9e3ff",
  },

  red: {
    skyTop: "#d88484",
    skyBottom: "#c76868",
    sunMoon: "#ffe6cb",
    far: "#aa5757",
    mid: "#8f4444",
    near: "#763636",
    ground: "#612a2a",
    detail: "#4b1f1f",
    accent: "#ffd0b4",
  },

  green: {
    skyTop: "#a8cfa8",
    skyBottom: "#94be94",
    sunMoon: "#f7f4dd",
    far: "#6f946f",
    mid: "#5d815d",
    near: "#4f6d4f",
    ground: "#41593f",
    detail: "#2e432d",
    accent: "#dcefcf",
  },
};

const MODE_QUADRANT_PALETTES = {
  nvc: {
    topLeft: "red",
    topRight: "yellow",
    bottomLeft: "blue",
    bottomRight: "purple",
  },
  violent: {
    topLeft: "red",
    topRight: "yellow",
    bottomLeft: "blue",
    bottomRight: "purple",
  },
  gratitude: {
    topLeft: "orange",
    topRight: "yellow",
    bottomLeft: "purple",
    bottomRight: "blue",
  },
  prayer: {
    topLeft: "pink",
    topRight: "yellow",
    bottomLeft: "blue",
    bottomRight: "green",
  },
};

export const SCENE_TYPES = [
  "mountain",
  "forest",
  "waterfall",
  "desert",
  "park",
  "cliff",
  "city",
  "river",
  "canyon",
  "lake",
  "nightHill",
  "roomDetailed",
];

function getQuadrantKey(x = 0, y = 0) {
  if (x < 0 && y > 0) return "topLeft";
  if (x > 0 && y > 0) return "topRight";
  if (x < 0 && y < 0) return "bottomLeft";
  return "bottomRight";
}

export function paletteForScene({ mode = "nvc", x = 0, y = 0 }) {
  const q = getQuadrantKey(x, y);
  const modeKey = mode === "checkin" ? "gratitude" : mode;
  const paletteKey = MODE_QUADRANT_PALETTES[modeKey]?.[q] || "blue";
  return LANDSCAPE_PALETTES[paletteKey];
}

export function getLandscapeSceneType(gridType, x = 0, y = 0, variation = 0) {
  const q = getQuadrantKey(x, y);

  const sceneMap = {
    nvc: {
      topLeft: ["forest", "waterfall", "nightHill", "road"],
      topRight: ["mountain", "river", "park", "road"],
      bottomLeft: ["canyon", "cliff", "city", "alley"],
      bottomRight: ["lake", "park", "forest", "roomDetailed"],
    },

    violent: {
      topLeft: ["cliff", "city", "canyon", "alley"],
      topRight: ["city", "cliff", "desert", "road"],
      bottomLeft: ["nightHill", "desert", "river", "alley"],
      bottomRight: ["room", "river", "nightHill", "roomDetailed"],
    },

    gratitude: {
      topLeft: ["canyon", "park", "forest", "beach"],
      topRight: ["mountain", "park", "lake", "beach"],
      bottomLeft: ["nightHill", "forest", "river", "roomDetailed"],
      bottomRight: ["lake", "river", "forest", "beach"],
    },

    prayer: {
      topLeft: ["nightHill", "forest", "room", "alley"],
      topRight: ["mountain", "waterfall", "park", "beach"],
      bottomLeft: ["river", "room", "forest", "roomDetailed"],
      bottomRight: ["lake", "park", "forest", "beach"],
    },
  };

  const modeKey = gridType === "checkin" ? "gratitude" : gridType;
  const group = sceneMap[modeKey]?.[q] || sceneMap.nvc.topRight;
  const index = ((variation % group.length) + group.length) % group.length;
  return group[index];
}