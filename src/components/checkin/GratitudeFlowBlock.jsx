// src/components/GratitudeFlowBlock.jsx
// COPY/PASTE ENTIRE FILE

import { useMemo } from "react";
import Panel from "../ui/Panel.jsx";
import Select from "../ui/Select.jsx";
import ScriptureRotator from "../ui/ScriptureRotator.jsx";

function toTitle(s) {
  return String(s || "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

export default function GratitudeFlowBlock({
  observationGroups = [], // [{ label, options: [] }] OR string[]
  selectedObservation = "",
  onChangeObservation,

  gratitudePrompts = [],
  selectedPrompt = "",
  onChangePrompt,

  gratitudeText = "",
  onChangeText,

  theologyOptions = [], // [{ key, title, verses[] } | { key, title, body }]
  selectedTheologyKey = "",
  onChangeTheologyKey,

  copyText = "",
}) {
  const normalizedObsGroups = useMemo(() => {
    if (!Array.isArray(observationGroups) || observationGroups.length === 0) return [];

    if (
      typeof observationGroups[0] === "object" &&
      observationGroups[0] &&
      Array.isArray(observationGroups[0].options)
    ) {
      return observationGroups.map((g) => ({
        label: g.label || "Observation",
        options: (g.options || []).map((x) => String(x)).filter(Boolean),
      }));
    }

    if (typeof observationGroups[0] === "string") {
      return [
        {
          label: "Observation",
          options: observationGroups.map((x) => String(x)).filter(Boolean),
        },
      ];
    }

    return [];
  }, [observationGroups]);

  const obsOptions = useMemo(() => {
    const flat = [{ value: "", label: "Select an observation…" }];
    normalizedObsGroups.forEach((g) => {
      (g.options || []).forEach((opt) => flat.push({ value: opt, label: opt }));
    });
    return flat;
  }, [normalizedObsGroups]);

  const promptOptions = useMemo(
    () => [{ value: "", label: "Choose a prompt…" }, ...(gratitudePrompts || []).map((p) => ({ value: p, label: p }))],
    [gratitudePrompts]
  );

  const theologySelectOptions = useMemo(() => {
    const arr = Array.isArray(theologyOptions) ? theologyOptions : [];
    return [
      { value: "", label: "Choose a gratitude theology header…" },
      ...arr.map((t) => ({
        value: t.key,
        label: t.title || toTitle(t.key),
      })),
    ];
  }, [theologyOptions]);

  const selectedTheology = useMemo(() => {
    const arr = Array.isArray(theologyOptions) ? theologyOptions : [];
    return arr.find((t) => t.key === selectedTheologyKey) || null;
  }, [theologyOptions, selectedTheologyKey]);

  const theologyText = useMemo(() => {
    if (!selectedTheology) return "";
    if (selectedTheology.body) return String(selectedTheology.body);

    if (Array.isArray(selectedTheology.verses) && selectedTheology.verses.length) {
      return selectedTheology.verses.map((v) => `• ${v}`).join("\n");
    }
    return "";
  }, [selectedTheology]);

  return (
    <Panel style={{ display: "grid", gap: 12 }}>
      <div className="sectionTitle">3) Gratitude (external)</div>

      {/* A) Observation */}
      <div className="gratitudeSection">
        <div className="gratitudeStepTitle">A) Name the observation you’re grateful for</div>

        {obsOptions.length ? (
          <Select
            value={selectedObservation}
            onChange={onChangeObservation}
            placeholder="Select an observation…"
            options={obsOptions}
          />
        ) : (
          <div style={{ fontSize: 13, opacity: 0.75 }}>
            (No observation options yet. Add them to CHECKIN_META.json for this gratitude item.)
          </div>
        )}
      </div>

      {/* B) Prompt + gratitude text */}
      <div className="gratitudeSection">
        <div className="gratitudeStepTitle">B) Gratitude statement</div>

        {gratitudePrompts?.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            <Select
              value={selectedPrompt}
              onChange={onChangePrompt}
              placeholder="Select a prompt (optional)…"
              options={promptOptions}
            />
          </div>
        ) : null}

        <textarea
          value={gratitudeText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Write a concrete gratitude statement…"
          style={{
            width: "100%",
            minHeight: 110,
            resize: "vertical",
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.92)",
            outline: "none",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        />
      </div>

      {/* C) Theology */}
      <div className="gratitudeSection">
        <div className="gratitudeStepTitle">C) Theology of gratitude</div>

        <Select
          value={selectedTheologyKey}
          onChange={onChangeTheologyKey}
          placeholder="Choose a gratitude theology header…"
          options={theologySelectOptions}
        />

        {selectedTheology ? (
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900 }}>{selectedTheology.title || toTitle(selectedTheology.key)}</div>

           {Array.isArray(selectedTheology?.verses) && selectedTheology.verses.length ? (
  <ScriptureRotator
    scriptures={selectedTheology.verses}
    perPage={2}
    title="Scripture"
    buttonLabel="Show more"
    emptyText="(No scriptures available.)"
  />
) : theologyText ? (
  <div
    style={{
      margin: 0,
      whiteSpace: "pre-wrap",
      fontSize: 13,
      opacity: 0.92,
      lineHeight: 1.5,
      padding: 10,
      borderRadius: 12,
      background: "rgba(0,0,0,0.12)",
    }}
  >
    {theologyText}
  </div>
) : (
  <div style={{ fontSize: 13, opacity: 0.75 }}>(No verses/body for this theology entry yet.)</div>
)}

          </div>
        ) : (
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>(Choose a header to show the associated verses.)</div>
        )}
      </div>

      {/* D) Summary */}
      <div className="gratitudeSection">
        <div className="gratitudeStepTitle">D) Summary (auto)</div>

        <textarea
          readOnly
          value={copyText || ""}
          style={{
            width: "100%",
            minHeight: 120,
            resize: "vertical",
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(0,0,0,0.22)",
            color: "rgba(255,255,255,0.92)",
            outline: "none",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        />

        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>(This summary auto-populates from your selections above.)</div>
      </div>
    </Panel>
  );
}