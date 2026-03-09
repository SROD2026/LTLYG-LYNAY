import { uniqStrings, guessViolationKeyFromText } from "./data.js";

export function normalizeTheologyMap(theologyMap) {
  if (!theologyMap || typeof theologyMap !== "object") return {};
  if (theologyMap.theology && typeof theologyMap.theology === "object") return theologyMap.theology;
  return theologyMap;
}

export function normalizeProtocols(accountabilityProtocols) {
  if (!accountabilityProtocols || typeof accountabilityProtocols !== "object") return {};
  if (accountabilityProtocols.protocols && typeof accountabilityProtocols.protocols === "object") {
    return accountabilityProtocols.protocols;
  }
  return accountabilityProtocols;
}

export function buildNeeds({
  mode,
  meta,
  emotion,
  selectedReplacement,
  needsSupplement,
}) {
  const lower = String(emotion || "").toLowerCase();
  const entryForSelectedWord = meta?.[emotion] || meta?.[lower] || null;
  const needsForSelectedWord = Array.isArray(entryForSelectedWord?.needs) ? entryForSelectedWord.needs : [];

  const replacementNeeds = (() => {
    if (mode !== "violent") return [];
    const r = String(selectedReplacement || "").trim();
    if (!r) return [];
    const e = meta?.[r] || meta?.[r.toLowerCase()] || null;
    return Array.isArray(e?.needs) ? e.needs : [];
  })();

  const needsList = mode === "violent" ? replacementNeeds : needsForSelectedWord;
  const global = Array.isArray(needsSupplement?.global) ? needsSupplement.global : [];
  return uniqStrings([...(needsList || []), ...global]);
}

export function buildViolationVM({
  mode,
  violentMap,
  selectedCause,
  selectedViolationKey,
  promises,
  theologyMap,
  accountabilityProtocols,
}) {
  if (mode !== "violent") return null;

  const vm = { selectedViolationKey: selectedViolationKey || "" };

  // auto guess
  if (!vm.selectedViolationKey) {
    const guess = guessViolationKeyFromText(selectedCause, violentMap);
    if (guess) vm.selectedViolationKey = guess;
  }

  const violation = vm.selectedViolationKey ? violentMap?.[vm.selectedViolationKey] : null;
  const protocolsMap = normalizeProtocols(accountabilityProtocols);
  const theologyLookup = normalizeTheologyMap(theologyMap);

  const protocolKeys = Array.isArray(violation?.protocol_links) ? violation.protocol_links.map(String).map(s => s.trim()).filter(Boolean) : [];
  const activeProtocolKey = protocolKeys[0] || "";
  const activeProtocol = activeProtocolKey ? (protocolsMap?.[activeProtocolKey] || null) : null;

  const promiseKeys = Array.isArray(violation?.promise_links) ? violation.promise_links : [];
  const theologyKeys = Array.isArray(violation?.theology_links) ? violation.theology_links : [];

  return {
    ...vm,
    violation,
    activeProtocol,
    promiseCards: promiseKeys.map((pk) => ({
      key: pk,
      title: promises?.[pk]?.title || pk,
      steps: Array.isArray(promises?.[pk]?.repair_steps) ? promises[pk].repair_steps : [],
    })),
    theologyCards: theologyKeys.map((tk) => ({
      key: tk,
      label: theologyLookup?.[tk]?.sin_label || tk.replaceAll("_", " "),
      data: theologyLookup?.[tk] || null,
    })),
  };
}

export function buildReframeSentences({
  mode,
  emotion,
  selectedCause,
  selectedReplacement,
  selectedNeed,
  neutralizeTrigger,
}) {
  const needSlot = selectedNeed ? selectedNeed : "____";

  const nonviolent = `When I observe ____, I feel ${emotion} because I need ${needSlot}.`;

  let violent = "";
  if (mode === "violent" && selectedCause && selectedReplacement) {
    const obs = neutralizeTrigger(selectedCause);
    violent = `When ${obs}, I feel ${selectedReplacement} because I need ${needSlot}.`;
  }
  return { nonviolent, violent };
}

export function buildRequestText(selectedNeed) {
  const need = selectedNeed || "____";
  return `Would you be willing to ____ so I can have more ${need}?`;
}