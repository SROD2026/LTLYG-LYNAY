// src/utils/masterSelectors.js

export function getGrids(master) {
  const m = master || {};
  const grids = (m.grids && typeof m.grids === "object") ? m.grids : {};

  return {
    nnmGrid: Array.isArray(grids.nnm) ? grids.nnm : Array.isArray(m.nnmGrid) ? m.nnmGrid : [],
    violentGrid: Array.isArray(grids.violent) ? grids.violent : Array.isArray(m.violentGrid) ? m.violentGrid : [],
  };
}

export function getEmotions(master) {
  const m = master || {};
  const emotions = (m.emotions && typeof m.emotions === "object") ? m.emotions : {};

  return {
    meta: (emotions.meta && typeof emotions.meta === "object") ? emotions.meta : (m.emotion_meta || {}),
    violent2: (emotions.violent2 && typeof emotions.violent2 === "object") ? emotions.violent2 : (m.violent2 || {}),
  };
}

export function getNeeds(master) {
  const m = master || {};
  const needs = (m.needs && typeof m.needs === "object") ? m.needs : {};

  return {
    supplement:
      (needs.supplement && typeof needs.supplement === "object")
        ? needs.supplement
        : (m.needs_supplement || { global: [] }),
  };
}

export function getAccountability(master) {
  const m = master || {};
  const acc = (m.accountability && typeof m.accountability === "object") ? m.accountability : {};

  const violations =
    (acc.violations && typeof acc.violations === "object")
      ? acc.violations
      : (m.violations || m.violent_map || {});

  return {
    violations,
    protocols:
      (acc.protocols && typeof acc.protocols === "object") ? acc.protocols : (m.protocols || {}),
    promises:
      (acc.promises && typeof acc.promises === "object") ? acc.promises : (m.promises || {}),
    theology:
      (acc.theology && typeof acc.theology === "object") ? acc.theology : (m.theology || {}),
  };
}