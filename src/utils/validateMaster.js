// src/utils/validateMaster.js

function isObj(x) {
  return x && typeof x === "object" && !Array.isArray(x);
}

function isStrArray(x) {
  return Array.isArray(x) && x.every((v) => typeof v === "string");
}

function push(out, level, msg, extra) {
  out.push({ level, msg, ...(extra ? { extra } : {}) });
}

export function validateMaster(master) {
  const issues = [];

  if (!isObj(master)) {
    push(issues, "error", "MASTER_PROTOCOLS is not an object");
    return { ok: false, issues };
  }

  // --- required-ish top-level keys (your app depends on these)
  const mustObj = ["emotion_meta", "needs_supplement", "violations", "protocols", "promises", "theology"];
  for (const k of mustObj) {
    if (!isObj(master[k])) push(issues, "error", `master.${k} must be an object`);
  }

  const mustArr = ["nnmGrid", "violentGrid"];
  for (const k of mustArr) {
    if (!Array.isArray(master[k])) push(issues, "error", `master.${k} must be an array`);
  }

  // --- violations shape + link integrity
  const violations = master.violations || {};
  const protocols = master.protocols || {};
  const promises = master.promises || {};
  const theology = master.theology || {};

  for (const [vk, v] of Object.entries(violations)) {
    if (!isObj(v)) {
      push(issues, "error", `violations.${vk} must be an object`);
      continue;
    }

    if (typeof v.category !== "string") push(issues, "warn", `violations.${vk}.category should be a string`);

    const listFields = ["behaviors", "observation_templates", "promise_links", "protocol_links", "theology_links"];
    for (const f of listFields) {
      if (v[f] != null && !isStrArray(v[f])) {
        push(issues, "warn", `violations.${vk}.${f} should be an array of strings`);
      }
    }

    for (const pk of v.protocol_links || []) {
      if (!protocols[pk]) push(issues, "warn", `violations.${vk} references missing protocol: ${pk}`);
    }
    for (const prk of v.promise_links || []) {
      if (!promises[prk]) push(issues, "warn", `violations.${vk} references missing promise: ${prk}`);
    }
    for (const tk of v.theology_links || []) {
      if (!theology[tk]) push(issues, "warn", `violations.${vk} references missing theology: ${tk}`);
    }
  }

  // --- optional: enforce meta.schema
  if (!isObj(master.meta) || typeof master.meta.schema !== "string") {
    push(issues, "warn", "master.meta.schema is missing (recommended)");
  }

  const ok = !issues.some((x) => x.level === "error");
  return { ok, issues };
}

export function printValidation(result) {
  const { ok, issues } = result || {};
  if (!issues || issues.length === 0) {
    console.log("✅ MASTER_PROTOCOLS validation: no issues");
    return;
  }

  const errs = issues.filter((x) => x.level === "error");
  const warns = issues.filter((x) => x.level === "warn");

  if (errs.length) console.group("❌ MASTER_PROTOCOLS validation errors");
  errs.forEach((e) => console.error(e.msg, e.extra || ""));
  if (errs.length) console.groupEnd();

  if (warns.length) console.group("⚠️ MASTER_PROTOCOLS validation warnings");
  warns.forEach((w) => console.warn(w.msg, w.extra || ""));
  if (warns.length) console.groupEnd();

  console.log(`MASTER_PROTOCOLS validation ok=${ok} (errors=${errs.length}, warnings=${warns.length})`);
}