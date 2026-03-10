import { useEffect, useMemo, useState } from "react";
import Panel from "../ui/Panel.jsx";
import Select from "../ui/Select.jsx";
import { guessViolationKeyFromText } from "../../utils/data.js";

const THEOLOGY_ALIASES = {
  corrupt_harmful_speech: "respectful_language",
  harmful_speech: "respectful_language",
  disrespectful_speech: "respectful_speech",
  interruption: "respectful_listening",
  interrupting: "respectful_listening",
  exaggeration: "truthful_communication",
  overgeneralizing: "truthful_communication",

  falsehood: "no_lying_or_omission",
  lying: "no_lying_or_omission",
  omission: "no_lying_or_omission",
  lying_by_omission: "no_lying_or_omission",
  omission_of_truth: "no_lying_or_omission",
  concealed_truth: "no_lying_or_omission",
  half_truth: "no_lying_or_omission",
  half_truths: "no_lying_or_omission",

  breaking_promises: "promise_integrity",
  broken_promises: "promise_integrity",
  integrity: "promise_integrity",

  withholding_presence: "pauses_equal_abandonment",
  abandonment: "pauses_equal_abandonment",
  stonewalling: "pauses_equal_abandonment",

  abrupt_withdrawal: "transition_protocol",
  no_transition: "transition_protocol",
  transition: "transition_protocol",

  unfinished_repair: "close_the_loop",
  open_loop: "close_the_loop",
  close_loop: "close_the_loop",

  blameshifting: "no_blameshifting",
  blame_shifting: "no_blameshifting",
  no_blame_shifting: "no_blameshifting",

  defensiveness: "no_defensiveness",
  no_defense: "no_defensiveness",

  neglect: "emotional_presence",
  emotional_neglect: "emotional_presence",
  presence: "emotional_presence",

  no_manipulation: "no_manipulation",
  manipulation: "no_manipulation",
  coercion: "no_manipulation",

  lying_or_omission: "no_lying_or_omission",
concealment: "no_lying_or_omission",

  respect_boundaries: "respect_boundaries",
  boundaries: "respect_boundaries",
};

function TheologyDropdownList({ keys, theologyLookup }) {
  const [openKey, setOpenKey] = useState(null);

function toggle(k) {
  setOpenKey((prev) => (prev === k ? null : k));
}

  if (!Array.isArray(keys) || keys.length === 0) return null;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 900, fontSize: 13 }}>Theology (sin as sin)</div>

      {keys.map((tk) => {
        const norm = String(tk || "").trim().toLowerCase().replace(/\s+/g, "_");
        const resolvedKey = THEOLOGY_ALIASES[norm] || norm;

        const t = theologyLookup?.[resolvedKey];
const isOpen = openKey === tk;
        const headerLabel = t?.sin_label ? t.sin_label : resolvedKey.replaceAll("_", " ");

        return (
          <div
            key={tk}
            style={{
border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              overflow: "hidden",
              background: "rgba(0,0,0,0.12)",
            }}
          >
            <button
              type="button"
              onClick={() => toggle(tk)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.92)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ fontWeight: 800 }}>{headerLabel}</div>
              <div style={{ opacity: 0.8 }}>{isOpen ? "▾" : "▸"}</div>
            </button>

            {isOpen && (
              <div style={{ padding: "0 12px 12px 12px", display: "grid", gap: 10 }}>
                {!t ? (
                  <div style={{ fontSize: 13, color: "rgba(255,170,170,0.92)", lineHeight: 1.45 }}>
                    Missing theology key: <b>{tk}</b>{" "}
                    {resolvedKey !== tk ? (
                      <>
                        (mapped to <b>{resolvedKey}</b>)
                      </>
                    ) : null}
                  </div>
                ) : (
                  <>
                    {t?.core_principle ? (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", lineHeight: 1.45 }}>
                        <b>Core:</b> {t.core_principle}
                      </div>
                    ) : null}

                    {t?.love_reframe ? (
                      <div style={{ display: "grid", gap: 6 }}>
                        {t.love_reframe.identity ? (
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", lineHeight: 1.45 }}>
                            <b>Identity:</b> {t.love_reframe.identity}
                          </div>
                        ) : null}

                        {t.love_reframe.motive_shift ? (
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", lineHeight: 1.45 }}>
                            <b>Love reframe:</b> {t.love_reframe.motive_shift}
                          </div>
                        ) : null}

                        {Array.isArray(t.love_reframe.replacement_focus) && t.love_reframe.replacement_focus.length ? (
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", lineHeight: 1.45 }}>
                            <b>Replace with:</b>
                            <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                              {t.love_reframe.replacement_focus.map((x, i) => (
                                <li key={i}>{x}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {Array.isArray(t?.self_application_prayer) && t.self_application_prayer.length ? (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", lineHeight: 1.45 }}>
                        <b>Prayer (self-application):</b>
                        <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                          {t.self_application_prayer.map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {Array.isArray(t?.scriptures) && t.scriptures.length ? (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", lineHeight: 1.45 }}>
                        <b>Scripture:</b>
                        <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                          {t.scriptures.map((s, i) => (
                            <li key={i}>
                              <b>{s.ref}</b>: {s.principle}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>(No scriptures found.)</div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AccountabilityBlock({
  master,
  selectedKey,
  onChangeKey,
  selectedObs,
  onChangeObs,
  title = "Accountability",
  autoGuessText = "",
  mode = "accountable",
  copyBlock = null,
}) {
  const violationsMap = master?.violations || {};
  const protocolsMap = master?.protocols || {};
  const promisesLookup = master?.promises || {};
  const theologyLookup = master?.theology || {};

  const hasAnyViolations = useMemo(() => Object.keys(violationsMap || {}).length > 0, [violationsMap]);

  // Auto-guess only when requested (violent mode usage)
  useEffect(() => {
    if (mode !== "violent") return;
    if (!autoGuessText) return;
    if (selectedKey) return;
    const guess = guessViolationKeyFromText(autoGuessText, violationsMap);
    if (guess) onChangeKey?.(guess);
  }, [mode, autoGuessText, violationsMap, selectedKey, onChangeKey]);

  const violationOptions = useMemo(() => {
    return Object.keys(violationsMap || {})
      .sort()
      .map((k) => ({ value: k, label: k.replaceAll("_", " ") }));
  }, [violationsMap]);

  const selectedViolation = useMemo(() => {
    const k = String(selectedKey || "").trim();
    if (!k) return null;
    return violationsMap?.[k] || null;
  }, [selectedKey, violationsMap]);

  const obsOptions = useMemo(() => {
    const arr = Array.isArray(selectedViolation?.observation_templates) ? selectedViolation.observation_templates : [];
    return [{ value: "", label: "Select observation…" }, ...arr.map((t, i) => ({ value: `${i}::${t}`, label: t }))];
  }, [selectedViolation]);

  const obsText = useMemo(() => {
    const v = String(selectedObs || "");
    if (!v) return "";
    const parts = v.split("::");
    return parts.length >= 2 ? parts.slice(1).join("::") : v;
  }, [selectedObs]);

  const protocolKeys = useMemo(() => {
    const keys = selectedViolation?.protocol_links;
    return Array.isArray(keys) ? keys.map(String).map((s) => s.trim()).filter(Boolean) : [];
  }, [selectedViolation]);

  const activeProtocolKey = protocolKeys[0] || "";
  const activeProtocol = useMemo(() => {
    return activeProtocolKey && protocolsMap[activeProtocolKey] ? protocolsMap[activeProtocolKey] : null;
  }, [activeProtocolKey, protocolsMap]);

  const promiseKeys = useMemo(() => {
    const keys = selectedViolation?.promise_links;
    return Array.isArray(keys) ? keys.map(String).map((s) => s.trim()).filter(Boolean) : [];
  }, [selectedViolation]);

const theologyKeys = useMemo(() => {
  const keys = selectedViolation?.theology_links;
  const cleaned = Array.isArray(keys)
    ? keys.map(String).map((s) => s.trim()).filter(Boolean)
    : [];

  // limit theology sections to 2
  return cleaned.slice(0, 2);
}, [selectedViolation]);


  return (
    <Panel style={{ display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900, marginTop: 6 }}>{title}</div>


<div style={{ fontSize: 13, color: "rgba(255,255,255,0.74)", lineHeight: 1.45 }}>
  Select the behavioral violation to surface repair steps, value alignment, and theology links.
</div>

      {hasAnyViolations ? (
        <>
          <Select
            value={selectedKey}
            onChange={onChangeKey}
            placeholder="Select violation…"
            options={violationOptions}
          />

          {selectedViolation?.observation_templates?.length ? (
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 13, opacity: 0.9 }}>Observation template (optional)</div>
              <Select
                value={selectedObs}
                onChange={onChangeObs}
                placeholder="Select observation…"
                options={obsOptions}
              />
            </div>
          ) : null}
        </>
      ) : (
        <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
          (No violations loaded — check master.violations)
        </div>
      )}

      {selectedKey ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 12,
            padding: 12,
            background: "rgba(0,0,0,0.20)",
            display: "grid",
            gap: 10,
          }}
        >
          {activeProtocol ? (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.45 }}>
              {activeProtocol.purpose || activeProtocol.intent || ""}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>(No protocol linked for this violation.)</div>
          )}

          {promiseKeys.length ? (
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontWeight: 900, fontSize: 20 }}>Imitator of Christ Value Alignment</div>

              {promiseKeys.map((pk) => {
                const p = promisesLookup?.[pk];
                return (
                  <div key={pk} style={{ border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: 10 }}>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>{p?.title ? p.title : pk}</div>

                    {Array.isArray(p?.repair_steps) && p.repair_steps.length ? (
                      <ul
                        style={{
                          margin: "0 0 0 18px",
                          padding: 0,
                          color: "rgba(255,255,255,0.86)",
                          fontSize: 13,
                          lineHeight: 1.45,
                        }}
                      >
                        {p.repair_steps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>(No repair steps found.)</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

{theologyKeys.length > 0 ? (
  <TheologyDropdownList keys={theologyKeys} theologyLookup={theologyLookup} />
) : null}

          {copyBlock ? (
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 900, fontSize: 13 }}>Accountability request (copy/paste)</div>

              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.90)", lineHeight: 1.45 }}>
                {copyBlock.obsText
                  ? `When ${copyBlock.obsText}, I feel ${copyBlock.feeling || "____"} because I need ${copyBlock.need || "____"}.`
                  : copyBlock.fallbackSentence || "(Complete steps above first.)"}
              </div>

              {copyBlock.requestText ? (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.90)", lineHeight: 1.45 }}>
                  {copyBlock.requestText}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13 }}>
          (Optional: select a behavioral violation to generate promise + repair steps.)
        </div>
      )}

      {/* keep obsText derivation “alive” so it can be used by parent if desired */}
      <span style={{ display: "none" }}>{obsText}</span>
    </Panel>
  );
}