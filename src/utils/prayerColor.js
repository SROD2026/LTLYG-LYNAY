// src/utils/prayerColor.js

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function distFromCenter(x, y) {
  const ax = Math.abs(Number(x || 0));
  const ay = Math.abs(Number(y || 0));
  return Math.max(ax, ay) / 7;
}

function smooth(t) {
  return Math.pow(clamp01(t), 0.82);
}

export function prayerColor(x, y) {
  const xx = Number(x || 0);
  const yy = Number(y || 0);

  const r = smooth(distFromCenter(xx, yy));

  // full-spectrum hue logic:
  // UL = red/magenta
  // LL = blue
  // LR = green
  // UR = yellow/gold
  // with stronger rainbow shift near center
  let hue;

  if (xx < 0 && yy > 0) {
    // red -> magenta/purple as it approaches center
    hue = 360 - 60 * (1 - r); // 300..360
  } else if (xx < 0 && yy < 0) {
    // blue -> violet near center
    hue = 220 + 40 * (1 - r); // 220..260
  } else if (xx > 0 && yy < 0) {
    // green -> teal near center
    hue = 138 + 32 * (1 - r); // 138..170
  } else if (xx > 0 && yy > 0) {
    // yellow -> orange near center
    hue = 46 - 18 * (1 - r); // 28..46
  } else {
    // axis / near-axis rainbow tint
    if (yy > 0) hue = 290 - xx * 18;
    else if (yy < 0) hue = 200 - xx * 10;
    else hue = 240 - xx * 22;
  }

  // stronger saturation outward, but keep center colorful too
const sat = 50 + r * 45;
  // lighter near center, deeper toward edges
const light = 78 - r * 42;

  return hsl(hue, sat, light);
}