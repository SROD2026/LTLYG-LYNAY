// src/utils/checkinColor.js

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function intensity(x, y) {
  const ax = Math.abs(Number(x || 0));
  const ay = Math.abs(Number(y || 0));
  const r = Math.max(ax, ay); // 0..7
  return clamp01(r / 7);
}

// Stronger transition so most of the quadrant shows the final color
function ease(t) {
  return Math.pow(t, 0.52);
}

function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function checkinColor(x, y) {
  const xx = Number(x || 0);
  const yy = Number(y || 0);
  const t = ease(intensity(xx, yy));

  let centerHue, centerSat, centerLight;
  let targetHue, targetSat, targetLight;

// TOP LEFT: warm cream center -> orange
if (xx < 0 && yy >= 0) {
  centerHue = 42;
  centerSat = 70;
  centerLight = 84;

  targetHue = 28;
  targetSat = 90;
  targetLight = 42;
}

  // TOP RIGHT: warm cream center -> deeper gold
else if (xx >= 0 && yy >= 0) {
  centerHue = 42;
  centerSat = 70;
  centerLight = 84;

  targetHue = 46;
  targetSat = 92;
  targetLight = 38;
}

  // BOTTOM LEFT: soft pink/lavender center -> light blue
  else if (xx < 0 && yy < 0) {
    centerHue = 330;
    centerSat = 42;
    centerLight = 82;

    targetHue = 205;
    targetSat = 66;
    targetLight = 62;
  }

  // BOTTOM RIGHT: soft pink/lavender center -> green
  else {
    centerHue = 330;
    centerSat = 42;
    centerLight = 82;

    targetHue = 142;
    targetSat = 56;
    targetLight = 50;
  }

  const h = mix(centerHue, targetHue, t);
  const s = mix(centerSat, targetSat, t);
  const l = mix(centerLight, targetLight, t);

  return hsl(h, s, l);
}