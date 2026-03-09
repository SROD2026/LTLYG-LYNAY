// src/utils/color.js

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

// 15×15 assumed: coords -7..7
function intensity(x, y) {
  const ax = Math.abs(Number(x || 0));
  const ay = Math.abs(Number(y || 0));
  const r = Math.max(ax, ay); // 0..7
  return clamp01(r / 7);
}

// Stronger ramp near the edges (feel free to swap for t*t if you want less punch)
function ease(t) {
  return t * t * t; // cubic
}

// Convert HSL -> HEX
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (v) => Math.round(255 * v).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

// Quadrant hues (locked)
function quadrantHue(x, y) {
  const xx = Number(x || 0);
  const yy = Number(y || 0);

  // top-right: yellow
  if (xx >= 0 && yy >= 0) return 48;

  // top-left: red
  if (xx < 0 && yy >= 0) return 8;

  // bottom-right: purple
  if (xx >= 0 && yy < 0) return 275;

  // bottom-left: blue
  return 210;
}

/**
 * Keeps each quadrant's base hue fixed.
 * Center cells are lighter/less saturated.
 * Corners are darker/more saturated.
 */
export function cellColor(x, y) {
  const hue = quadrantHue(x, y);

  const t0 = intensity(x, y); // 0 center -> 1 edge
  const t = ease(t0);

  // Tune these ranges to taste:
  // Center: pastel-ish, Edge: bold/dark
const sat = 42 + (88 - 42) * t;   // more color in center
const light = 70 + (30 - 70) * t; // slightly darker center

  return hslToHex(hue, sat, light);
}