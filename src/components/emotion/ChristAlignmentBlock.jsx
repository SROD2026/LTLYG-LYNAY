import { useMemo, useState } from "react";
import Panel from "../ui/Panel.jsx";
import ScriptureRotator from "../ui/ScriptureRotator.jsx";

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
      <div style={{ fontWeight: 900, fontSize: 13 }}>Theology links</div>

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

                        {Array.isArray(t.love_reframe.replacement_focus) &&
                        t.love_reframe.replacement_focus.length ? (
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
                      <ScriptureRotator
                        scriptures={t.scriptures}
                        perPage={2}
                        title="Scripture"
                        buttonLabel="Show more"
                        emptyText="(No scriptures found.)"
                        containerStyle={{ marginTop: 4 }}
                      />
                    ) : (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>
                        (No scriptures found.)
                      </div>
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

export default function ChristAlignmentBlock({
  master,
  selectedKey,
  title = "Imitator of Christ value alignment",
}) {
  const violationsMap = master?.violations || {};
  const protocolsMap = master?.protocols || {};
  const promisesLookup = master?.promises || {};
  const theologyLookup = master?.theology || {};

  const selectedViolation = useMemo(() => {
    const k = String(selectedKey || "").trim();
    if (!k) return null;
    return violationsMap?.[k] || null;
  }, [selectedKey, violationsMap]);

  const protocolKeys = useMemo(() => {
    const keys = selectedViolation?.protocol_links;
    return Array.isArray(keys)
      ? keys.map(String).map((s) => s.trim()).filter(Boolean)
      : [];
  }, [selectedViolation]);

  const activeProtocolKey = protocolKeys[0] || "";
  const activeProtocol = useMemo(() => {
    return activeProtocolKey && protocolsMap[activeProtocolKey]
      ? protocolsMap[activeProtocolKey]
      : null;
  }, [activeProtocolKey, protocolsMap]);

  const promiseKeys = useMemo(() => {
    const keys = selectedViolation?.promise_links;
    return Array.isArray(keys)
      ? keys.map(String).map((s) => s.trim()).filter(Boolean)
      : [];
  }, [selectedViolation]);

  const theologyKeys = useMemo(() => {
    const keys = selectedViolation?.theology_links;
    const cleaned = Array.isArray(keys)
      ? keys.map(String).map((s) => s.trim()).filter(Boolean)
      : [];
    return cleaned.slice(0, 2);
  }, [selectedViolation]);

  return (
    <Panel style={{ display: "grid", gap: 10 }}>

      {!selectedKey ? (
        <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13 }}>
          Select a behavioral violation above to generate value alignment, theology links, and Christian repair framing.
        </div>
      ) : (
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
          

          {promiseKeys.length ? (
            <div style={{ display: "grid", gap: 8 }}>

{activeProtocol ? (
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", lineHeight: 1.45 }}>
              {activeProtocol.purpose || activeProtocol.intent || ""}
            </div>
          ) : (
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.70)" }}>
              (No protocol linked for this violation.)
            </div>
          )}

              {promiseKeys.map((pk) => {
                const p = promisesLookup?.[pk];
                return (
                  <div
                    key={pk}
                    style={{
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 10,
                      padding: 10,
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>
                      {p?.title ? p.title : pk}
                    </div>

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
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>
                        (No repair steps found.)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

          {theologyKeys.length > 0 ? (
            <TheologyDropdownList keys={theologyKeys} theologyLookup={theologyLookup} />
          ) : null}
        </div>
      )}
    </Panel>
  );
}