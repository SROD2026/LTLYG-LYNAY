// src/utils/pageThemes.js

import { cellColor } from "./color.js";

export function getGridPageBackground(selected) {
  const nonviolentBase = `
    linear-gradient(
      180deg,
      #8aa4ea 0%,
      #b9c7f0 48%,
      #d8d4f2 74%,
      #ebe0d2 100%
    )
  `;

  if (!selected) {
    return {
      "--page-bg": "#b9c7f0",
      "--page-bg-gradient": `
        radial-gradient(circle at 20% 22%, rgba(138,164,234,0.30) 0%, transparent 28%),
        radial-gradient(circle at 78% 18%, rgba(185,199,240,0.28) 0%, transparent 30%),
        radial-gradient(circle at 76% 76%, rgba(216,212,242,0.24) 0%, transparent 28%),
        radial-gradient(circle at 24% 84%, rgba(235,224,210,0.20) 0%, transparent 24%),
        ${nonviolentBase}
      `,
      backgroundSize: "170% 170%, 180% 180%, 180% 180%, 170% 170%, 100% 100%",
      backgroundPosition: "0% 0%, 100% 0%, 100% 100%, 0% 100%, 0 0",
    };
  }

  const tint = cellColor(selected.x, selected.y);

  return {
    "--page-bg": "#b9c7f0",
    "--page-bg-gradient": `
      radial-gradient(circle at 20% 22%, rgba(138,164,234,0.24) 0%, transparent 24%),
      radial-gradient(circle at 78% 18%, rgba(185,199,240,0.22) 0%, transparent 26%),
      radial-gradient(circle at 76% 76%, rgba(216,212,242,0.18) 0%, transparent 24%),
      radial-gradient(circle at 24% 84%, rgba(235,224,210,0.16) 0%, transparent 20%),
      radial-gradient(circle at 50% 52%, ${tint}33 0%, transparent 34%),
      radial-gradient(circle at 50% 48%, rgba(255,255,255,0.18) 0%, transparent 28%),
      ${nonviolentBase}
    `,
    backgroundSize: "170% 170%, 180% 180%, 180% 180%, 170% 170%, 160% 160%, 150% 150%, 100% 100%",
    backgroundPosition: "0% 0%, 100% 0%, 100% 100%, 0% 100%, 50% 50%, 50% 50%, 0 0",
  };
}

export function getViolentPageBackground(selected) {
  const emberSunsetBase = `
    linear-gradient(
      to top,
      #17070b 0%,
      #261018 14%,
      #3c1620 30%,
      #5a1f24 46%,
      #7b2a23 62%,
      #9e4625 78%,
      #c86d34 90%,
      #f0a35a 100%
    )
  `;

  if (!selected) {
    return {
      "--page-bg": "#17070b",
      "--page-bg-gradient": `
        radial-gradient(circle at 50% 80%, rgba(255, 149, 64, 0.28) 0%, transparent 22%),
        radial-gradient(circle at 24% 28%, rgba(149, 36, 66, 0.26) 0%, transparent 28%),
        radial-gradient(circle at 78% 24%, rgba(108, 42, 149, 0.24) 0%, transparent 30%),
        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 42%),
        ${emberSunsetBase}
      `,
      backgroundSize: "170% 170%, 180% 180%, 180% 180%, 150% 150%, 100% 100%",
      backgroundPosition: "0% 0%, 0% 0%, 100% 0%, 50% 50%, 0 0",
    };
  }

  const { x = 0, y = 0 } = selected || {};
  const quadrant = x >= 0 && y >= 0 ? "Q1" : x < 0 && y >= 0 ? "Q2" : x < 0 && y < 0 ? "Q3" : "Q4";

  const QUADRANT_COLORS = {
    Q1: "#f2a13f",
    Q2: "#d63b1f",
    Q3: "#5a2a86",
    Q4: "#3f1d5c",
  };

  const tint = QUADRANT_COLORS[quadrant] || "#8b1e2d";

  return {
    "--page-bg": tint,
    "--page-bg-gradient": `
      radial-gradient(circle at 50% 80%, rgba(255, 149, 64, 0.24) 0%, transparent 20%),
      radial-gradient(circle at 24% 28%, rgba(149, 36, 66, 0.18) 0%, transparent 24%),
      radial-gradient(circle at 78% 24%, rgba(108, 42, 149, 0.18) 0%, transparent 26%),
      radial-gradient(circle at 50% 52%, ${tint} 0%, transparent 38%),
      radial-gradient(circle at 50% 48%, rgba(255,255,255,0.08) 0%, transparent 28%),
      ${emberSunsetBase}
    `,
    backgroundSize: "170% 170%, 180% 180%, 180% 180%, 160% 160%, 150% 150%, 100% 100%",
    backgroundPosition: "0% 0%, 0% 0%, 100% 0%, 50% 50%, 50% 50%, 0 0",
  };
}

export function getLogPageBackground() {
  const twilightBase = `
    linear-gradient(
      to top,
      #edf3ff 0%,
      #e4eeff 14%,
      #dfe6ff 30%,
      #e5dbff 48%,
      #dccdf7 66%,
      #cdbdf0 82%,
      #b9b5ec 100%
    )
  `;

  return {
    "--page-bg": "#e9efff",
    "--page-bg-gradient": `
      radial-gradient(circle at 22% 24%, rgba(157, 180, 255, 0.24) 0%, transparent 28%),
      radial-gradient(circle at 76% 22%, rgba(190, 157, 255, 0.20) 0%, transparent 30%),
      radial-gradient(circle at 50% 78%, rgba(214, 225, 255, 0.30) 0%, transparent 24%),
      radial-gradient(circle at 50% 48%, rgba(255,255,255,0.18) 0%, transparent 42%),
      ${twilightBase}
    `,
    backgroundSize: "170% 170%, 180% 180%, 160% 160%, 150% 150%, 100% 100%",
    backgroundPosition: "0% 0%, 100% 0%, 50% 100%, 50% 50%, 0 0",
  };
}

export function getPurposePageBackground() {
  return {
    "--page-bg": "#eef6f0",
    "--page-bg-gradient": `
      radial-gradient(circle at 18% 24%, rgba(208, 228, 214, 0.34) 0%, transparent 30%),
      radial-gradient(circle at 80% 20%, rgba(222, 234, 227, 0.30) 0%, transparent 34%),
      radial-gradient(circle at 78% 82%, rgba(231, 238, 243, 0.20) 0%, transparent 26%),
      radial-gradient(circle at 18% 84%, rgba(214, 231, 220, 0.24) 0%, transparent 28%),
      linear-gradient(
        180deg,
        #e2eeff 0%,
        #edf5f0 20%,
        #e8f1eb 42%,
        #edf5f0 72%,
        #abd0bd 100%
      )
    `,
    backgroundSize: "170% 170%, 200% 200%, 170% 170%, 200% 200%, 100% 100%",
    backgroundPosition: "0% 0%, 100% 0%, 100% 100%, 0% 100%, 0 0",
  };
}

  export function getCommunicationPageBackground() {
  return {
    "--page-bg": "#7b6bd1",
    "--page-bg-gradient": `
      radial-gradient(circle at 22% 18%, rgba(91,95,199,0.30) 0%, transparent 28%),
      radial-gradient(circle at 78% 16%, rgba(123,107,209,0.28) 0%, transparent 30%),
      radial-gradient(circle at 74% 82%, rgba(156,139,228,0.26) 0%, transparent 28%),
      radial-gradient(circle at 26% 86%, rgba(199,196,244,0.22) 0%, transparent 24%),
      linear-gradient(
        180deg,
        #5b5fc7 0%,
        #7b6bd1 40%,
        #9c8be4 72%,
        #c7c4f4 100%
      )
    `,
    backgroundSize: "170% 170%, 180% 180%, 180% 180%, 170% 170%, 100% 100%",
    backgroundPosition: "0% 0%, 100% 0%, 100% 100%, 0% 100%, 0 0",
  };
}
export function getNeedsPageBackground() {
  return {
    "--page-bg": "#4ea8a9",
    "--page-bg-gradient": `
      radial-gradient(circle at 20% 18%, rgba(74,176,182,0.26) 0%, transparent 28%),
      radial-gradient(circle at 80% 22%, rgba(70,136,166,0.24) 0%, transparent 30%),
      radial-gradient(circle at 18% 84%, rgba(143,219,201,0.20) 0%, transparent 26%),
      radial-gradient(circle at 78% 82%, rgba(223,241,215,0.18) 0%, transparent 24%),
      linear-gradient(180deg, #2f7b8b 0%, #4ea8a9 42%, #8fd1c6 76%, #dff1d7 100%)
    `,
    backgroundSize: "170% 170%, 180% 180%, 170% 170%, 170% 170%, 100% 100%",
    backgroundPosition: "0% 0%, 100% 0%, 0% 100%, 100% 100%, 0 0",
  };
}

export function getPrayerPageBackground(selected) {
  const base = `
    linear-gradient(
      90deg,
      #641d2e 0%,
      #b83d44 18%,
      #324c8a 38%,
      #c3a43b 62%,
      #5aaf5c 82%,
      #d7ecb6 100%
    )
  `;

  if (!selected) {
    return {
      "--page-bg": "#2a3f74",
      "--page-bg-gradient": `
        radial-gradient(circle at 16% 18%, rgba(176,62,72,0.30) 0%, transparent 24%),
        radial-gradient(circle at 30% 80%, rgba(73,115,214,0.24) 0%, transparent 24%),
        radial-gradient(circle at 70% 20%, rgba(222,193,74,0.24) 0%, transparent 24%),
        radial-gradient(circle at 82% 78%, rgba(98,190,108,0.24) 0%, transparent 24%),
        ${base}
      `,
      backgroundSize: "170% 170%, 170% 170%, 170% 170%, 170% 170%, 100% 100%",
      backgroundPosition: "0% 0%, 0% 100%, 100% 0%, 100% 100%, 0 0",
    };
  }

  const { x = 0, y = 0 } = selected || {};
  const tint = x < 0 && y >= 0 ? "rgba(201,60,60,0.24)"
    : x < 0 && y < 0 ? "rgba(65,112,212,0.24)"
    : x >= 0 && y >= 0 ? "rgba(220,190,68,0.24)"
    : "rgba(72,176,100,0.24)";

  return {
    "--page-bg": "#2a3f74",
    "--page-bg-gradient": `
      radial-gradient(circle at 50% 50%, ${tint} 0%, transparent 30%),
      radial-gradient(circle at 16% 18%, rgba(176,62,72,0.22) 0%, transparent 22%),
      radial-gradient(circle at 30% 80%, rgba(73,115,214,0.18) 0%, transparent 22%),
      radial-gradient(circle at 70% 20%, rgba(222,193,74,0.18) 0%, transparent 22%),
      radial-gradient(circle at 82% 78%, rgba(98,190,108,0.18) 0%, transparent 22%),
      ${base}
    `,
    backgroundSize: "150% 150%, 170% 170%, 170% 170%, 170% 170%, 170% 170%, 100% 100%",
    backgroundPosition: "50% 50%, 0% 0%, 0% 100%, 100% 0%, 100% 100%, 0 0",
  };
}
