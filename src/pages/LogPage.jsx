// src/pages/LogPage.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import { getLogPageBackground } from "../utils/pageThemes.js";
import InteroStickFigure from "../components/interoception/InteroStickFigure.jsx";

import {
  loadReflectionLog,
  clearReflectionLog,
} from "../utils/logStore.js";

import {
  downloadCsv,
  exportZip,
} from "../utils/logExport.js";

function toSentenceCase(s) {
  const str = String(s || "").trim();
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toLowerInline(s) {
  return String(s || "").trim().toLowerCase();
}

function formatTimestamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function renderBodyText(intero) {
  return (Array.isArray(intero) ? intero : [])
    .map(
      (x) =>
        `${String(x?.region || "").replaceAll("_", " ")}: ${String(
          x?.sensation || ""
        )}`
    )
    .filter(Boolean)
    .join(" • ");
}

function getTypeLabel(type) {
  if (type === "violent") return "violent";
  if (type === "gratitude") return "gratitude";
  if (type === "prayer") return "prayer";
  return "nonviolent";
}

function getTypeTheme(type) {
  if (type === "violent") {
    return {
      badgeBg: "rgba(255,120,100,0.12)",
      badgeText: "rgba(126,42,32,0.94)",
      badgeBorder: "rgba(220,92,70,0.22)",
      cardBorder: "rgba(216,104,90,0.20)",
      cardBg: "rgba(255, 236, 230, 0.82)",
      topBar:
        "linear-gradient(90deg, rgba(219,88,57,0.92), rgba(244,161,94,0.88))",
    };
  }

  if (type === "gratitude") {
    return {
      badgeBg: "rgba(110,185,110,0.12)",
      badgeText: "rgba(41,99,54,0.96)",
      badgeBorder: "rgba(92,156,96,0.22)",
      cardBorder: "rgba(104,166,112,0.20)",
      cardBg: "rgba(235, 247, 232, 0.84)",
      topBar:
        "linear-gradient(90deg, rgba(79,166,100,0.92), rgba(202,186,77,0.88))",
    };
  }

  if (type === "prayer") {
    return {
      badgeBg: "rgba(108,126,214,0.12)",
      badgeText: "rgba(54,68,146,0.96)",
      badgeBorder: "rgba(98,119,210,0.22)",
      cardBorder: "rgba(106,124,214,0.20)",
      cardBg: "rgba(236, 240, 255, 0.84)",
      topBar:
        "linear-gradient(90deg, rgba(86,104,214,0.92), rgba(120,160,255,0.88))",
    };
  }

  return {
    badgeBg: "rgba(111,132,232,0.10)",
    badgeText: "rgba(53,68,146,0.96)",
    badgeBorder: "rgba(98,119,210,0.20)",
    cardBorder: "rgba(106,124,214,0.20)",
    cardBg: "rgba(239, 243, 255, 0.84)",
    topBar:
      "linear-gradient(90deg, rgba(92,114,214,0.92), rgba(143,168,255,0.88))",
  };
}

function normalizeGratitudeTitle(title, emotion) {
  const base = String(title || emotion || "").trim();
  if (!base) return "(no emotion)";
  const lower = base.toLowerCase();
  if (lower.startsWith("for ")) {
    return base.charAt(0).toLowerCase() + base.slice(1);
  }
  return base;
}

function makeDisplayReframe(entry) {
  const type = entry?.type || "";
  const emotion = String(entry?.emotion || "").trim();
  const title = String(entry?.title || emotion || "").trim();
  const need = String(entry?.need || "").trim();
  const needsMet = String(entry?.needs_met || "").trim();
  const observation = String(entry?.observation || "").trim();
  const cause = String(entry?.cause || "").trim();
  const rawReframe = String(entry?.reframe || "").trim();

  if (type === "gratitude") {
    const target = normalizeGratitudeTitle(title, emotion);
    const lowerTarget = target.toLowerCase();

    if (lowerTarget.startsWith("for ")) {
      if (needsMet) {
        return `I felt grateful ${lowerTarget} because it met my need for ${toLowerInline(
          needsMet
        )}.`;
      }
      return `I felt grateful ${lowerTarget}.`;
    }

    if (needsMet) {
      return `I felt ${target} because my need for ${toLowerInline(
        needsMet
      )} was met.`;
    }

    return rawReframe || `I felt ${target}.`;
  }

  if (type === "prayer") {
    const prompt = String(entry?.prayer_prompt || "").trim();
    const written = String(entry?.written_prayer || "").trim();

    if (written) return written;
    if (prompt) return prompt;
    return rawReframe || `I brought ${emotion || "this emotion"} before God in prayer.`;
  }

  const source = observation || cause;
  const feeling =
    type === "violent"
      ? String(entry?.replacement || emotion || "").trim()
      : emotion;

  if (source && feeling && need) {
    return `When ${source.charAt(0).toLowerCase() + source.slice(1)}, I felt ${feeling} because I needed ${toLowerInline(
      need
    )}.`;
  }

  if (rawReframe) {
    return rawReframe
      .replace(/\bI feel\b/g, "I felt")
      .replace(/\bI need\b/g, "I needed");
  }

  return "";
}

function makeCompactSummary(entry) {
  const reframe = makeDisplayReframe(entry);
  if (!reframe) return "";

  const max = 120;
  if (reframe.length <= max) return reframe;
  return `${reframe.slice(0, max).trimEnd()}…`;
}

function FilterTabs({ value, onChange }) {
  const tabs = [
    { value: "all", label: "All" },
    { value: "nonviolent", label: "Nonviolent" },
    { value: "violent", label: "Violent" },
    { value: "gratitude", label: "Gratitude" },
    { value: "prayer", label: "Prayer" },
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {tabs.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            className="btn"
            onClick={() => onChange(tab.value)}
            style={{
              padding: "8px 12px",
              fontSize: 13,
              borderRadius: 999,
              background: active
                ? "rgba(255,255,255,0.54)"
                : "rgba(255,255,255,0.26)",
              borderColor: active
                ? "rgba(84, 92, 146, 0.28)"
                : "rgba(84, 92, 146, 0.14)",
              fontWeight: active ? 800 : 600,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function ToolbarGroup({ label, children, danger = false }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: 10,
        minWidth: danger ? 150 : 0,
        borderRadius: 14,
        border: danger
          ? "1px solid rgba(182, 92, 126, 0.24)"
          : "1px solid rgba(84, 92, 146, 0.12)",
        background: danger
          ? "rgba(255, 120, 170, 0.08)"
          : "rgba(255,255,255,0.16)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: danger
            ? "rgba(126, 42, 76, 0.92)"
            : "rgba(78, 84, 120, 0.86)",
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SummaryStat({ label, value }) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid rgba(84, 92, 146, 0.12)",
        background: "rgba(255,255,255,0.18)",
        padding: "10px 12px",
        minWidth: 120,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: 0.3,
          textTransform: "uppercase",
          color: "rgba(84, 90, 122, 0.82)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 900,
          lineHeight: 1.1,
          color: "rgba(50, 54, 88, 0.98)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ReflectionCard({ entry, expanded, onToggle }) {
  const theme = getTypeTheme(entry.type);
  const title =
    entry.type === "gratitude"
      ? normalizeGratitudeTitle(entry.title, entry.emotion)
      : String(entry.title || entry.emotion || "(no emotion)");
  const body = renderBodyText(entry.intero);
  const displayReframe = makeDisplayReframe(entry);
  const compactSummary = makeCompactSummary(entry);
  const ts = formatTimestamp(entry.ts);

  const detailRows = [
    entry.core_emotion
      ? { label: "Core emotion", value: entry.core_emotion }
      : null,
    entry.need
      ? { label: "Need", value: toLowerInline(entry.need) }
      : null,
    entry.needs_met
      ? { label: "Need met", value: toLowerInline(entry.needs_met) }
      : null,
    entry.cause
      ? { label: "Cause", value: entry.cause }
      : null,
    entry.observation
      ? { label: "Observation", value: entry.observation }
      : null,
    entry.replacement
      ? { label: "Replacement", value: entry.replacement }
      : null,
    entry.request
      ? { label: "Request", value: entry.request }
      : null,
    entry.gratitude_text
      ? { label: "Gratitude", value: entry.gratitude_text }
      : null,
    entry.theology_key
      ? { label: "Theology", value: entry.theology_key }
      : null,
    body && entry.type !== "prayer"
      ? { label: "Body", value: body }
      : null,
  ].filter(Boolean);

  return (
    <div
      style={{
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 16,
        background: theme.cardBg,
        color: "rgba(42, 44, 76, 0.94)",
        boxShadow: "0 8px 20px rgba(110, 118, 190, 0.08)",
        overflow: "hidden",
        display: "grid",
        minWidth: 0,
      }}
    >
      <div
        style={{
          height: 4,
          background: theme.topBar,
          width: "100%",
        }}
      />

      <div style={{ padding: 14, display: "grid", gap: 12, minWidth: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 10,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 18,
                  lineHeight: 1.15,
                  color: "rgba(54, 56, 92, 0.98)",
                  minWidth: 0,
                  overflowWrap: "anywhere",
                }}
              >
                {toSentenceCase(title)}
              </div>

              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.2,
                  background: theme.badgeBg,
                  color: theme.badgeText,
                  border: `1px solid ${theme.badgeBorder}`,
                  textTransform: "lowercase",
                }}
              >
                {getTypeLabel(entry.type)}
              </span>
            </div>

            <div
              style={{
                fontSize: 12,
                color: "rgba(76, 80, 114, 0.76)",
                fontWeight: 600,
              }}
            >
              {ts}
            </div>
          </div>

          <button
            className="btn"
            onClick={onToggle}
            style={{
              padding: "8px 10px",
              fontSize: 12,
              borderRadius: 12,
              whiteSpace: "nowrap",
            }}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: expanded ? "1fr" : "minmax(0, 1fr) 120px",
            gap: 12,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 10, minWidth: 0 }}>
            <div
              style={{
                fontSize: expanded ? 14 : 13,
                lineHeight: 1.48,
                color: "rgba(60, 62, 95, 0.94)",
                fontWeight: expanded ? 700 : 600,
                overflowWrap: "anywhere",
              }}
            >
              {expanded ? displayReframe || compactSummary : compactSummary}
            </div>

            {expanded && entry.type === "prayer" ? (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  marginTop: 4,
                }}
              >
                {Array.isArray(entry.scriptures) && entry.scriptures.length > 0 ? (
                  <div
                    style={{
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: `
                        linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)),
                        radial-gradient(circle at 30% 22%, rgba(255,255,255,0.12), transparent 42%),
                        rgba(108,126,214,0.18)
                      `,
                      boxShadow: "inset 0 0 6px rgba(0,0,0,0.14), 0 6px 18px rgba(0,0,0,0.12)",
                      padding: 12,
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "rgba(80, 86, 126, 0.88)",
                      }}
                    >
                      Supporting scripture
                    </div>

                    {entry.scriptures.map((s, idx) => (
                      <div
                        key={`${s?.ref || "scripture"}-${idx}`}
                        style={{
                          display: "grid",
                          gap: 4,
                          padding: 10,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.08)",
                          boxShadow: "inset 0 0 4px rgba(0,0,0,0.10)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "rgba(58, 64, 108, 0.96)",
                          }}
                        >
                          {s?.ref || ""}
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            lineHeight: 1.5,
                            color: "rgba(52, 56, 92, 0.90)",
                          }}
                        >
                          {s?.principle || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {Array.isArray(entry.intero) && entry.intero.length > 0 ? (
                  <div
                    style={{
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.34)",
                      boxShadow: "inset 0 0 6px rgba(255,255,255,0.03), 0 8px 18px rgba(0,0,0,0.10)",
                      padding: 12,
                      display: "grid",
                      gap: 10,
                      justifyItems: "center",
                    }}
                  >
                    <div
                      style={{
                        justifySelf: "stretch",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "rgba(80, 86, 126, 0.88)",
                      }}
                    >
                      Interoception
                    </div>

<InteroStickFigure intero={entry.intero} theme="log" />

                    <div
                      style={{
                        fontSize: 12,
                        lineHeight: 1.45,
                        color: "rgba(52, 56, 92, 0.84)",
                        textAlign: "center",
                      }}
                    >
                      {renderBodyText(entry.intero)}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {expanded && detailRows.length ? (
              <div style={{ display: "grid", gap: 8 }}>
                {detailRows.map((row) => (
                  <div
                    key={`${row.label}-${row.value}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px minmax(0, 1fr)",
                      gap: 10,
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "rgba(80, 86, 126, 0.88)",
                      }}
                    >
                      {row.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.46,
                        color: "rgba(52, 56, 92, 0.90)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {entry.pngDataUrl && !(expanded && entry.type === "prayer") ? (
            <button
              type="button"
              onClick={onToggle}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                justifySelf: expanded ? "center" : "stretch",
              }}
              title={expanded ? "Collapse card" : "Expand card"}
            >
              <img
                src={entry.pngDataUrl}
                alt="Interoception snapshot"
                style={{
                  width: expanded ? "100%" : 120,
                  maxWidth: expanded ? 250 : 120,
                  height: expanded ? "auto" : 96,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.10)",
                  padding: 6,
                  boxSizing: "border-box",
                }}
              />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function LogPage({ goHome }) {
  const [entries, setEntries] = useState(() => loadReflectionLog());
  const [filter, setFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const count = entries.length;

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return entries.filter((e) => String(e?.ts || "").startsWith(today)).length;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (filter === "all") return entries;
    return entries.filter((e) => (e?.type || "nonviolent") === filter);
  }, [entries, filter]);

  const filterCount = filteredEntries.length;

  useEffect(() => {
  function refreshFromStorage() {
    setEntries(loadReflectionLog());
  }

  refreshFromStorage();

  window.addEventListener("focus", refreshFromStorage);
  window.addEventListener("pageshow", refreshFromStorage);
  window.addEventListener("hashchange", refreshFromStorage);
  window.addEventListener("storage", refreshFromStorage);

  return () => {
    window.removeEventListener("focus", refreshFromStorage);
    window.removeEventListener("pageshow", refreshFromStorage);
    window.removeEventListener("hashchange", refreshFromStorage);
    window.removeEventListener("storage", refreshFromStorage);
  };
}, []);

  const pageStyle = {
    "--text": "#2b2b46",
    "--muted": "#5f6485",
    "--card": "rgba(255,255,255,0.72)",
    "--border": "rgba(84, 92, 146, 0.14)",
    "--shadow": "0 14px 36px rgba(95, 106, 170, 0.12)",
    "--btn-bg": "rgba(255,255,255,0.34)",
    "--btn-border": "rgba(84, 92, 146, 0.16)",
    "--btn-text": "rgba(40, 44, 78, 0.92)",
    ...getLogPageBackground(),
  };

  function refresh() {
    setEntries(loadReflectionLog());
  }

  function handleClear() {
    clearReflectionLog();
    setExpandedIds(new Set());
    refresh();
  }

  function toggleExpanded(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setExpandedIds(new Set(filteredEntries.map((e, idx) => e.id || `row-${idx}`)));
  }

  function collapseAll() {
    setExpandedIds(new Set());
  }

  return (
    <div className="container" style={pageStyle}>
      <style>{`
        .logCardsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          align-items: start;
        }

        @media (max-width: 1100px) {
          .logCardsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .logCardsGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 820px) {
          .logHeaderGrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div
        className="appShell"
        style={{
          animation: "logTwilightDrift 18s ease-in-out infinite",
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <div className="panel">
          <div style={{ display: "grid", gap: 12 }}>
            <div
              className="logHeaderGrid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(280px, 340px) 1fr",
                gap: 14,
                alignItems: "start",
              }}
            >
              <div style={{ display: "grid", gap: 10 }}>
                <Header
                  title="Reflection Log"
                  subtitle="Saved emotional reflections on this device"
                />

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <SummaryStat label="Total entries" value={count} />
                  <SummaryStat label="Today" value={todayCount} />
                  <SummaryStat
                    label={filter === "all" ? "Showing" : `${toSentenceCase(filter)} shown`}
                    value={filterCount}
                  />
                </div>
              </div>

              <ToolbarGroup label="Navigate">
                <TopNav
                  goHome={goHome}
                  goGrid={() => (window.location.hash = "#/grid")}
                  goViolent={() => (window.location.hash = "#/violent")}
                  goCheckin={() => (window.location.hash = "#/checkin")}
                  goPrayer={() => (window.location.hash = "#/prayer")}
                />
              </ToolbarGroup>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "grid",
                  gap: 8,
                }}
              >
                <FilterTabs value={filter} onChange={setFilter} />

                <div className="smallMuted">
                  Expand cards to view prayer text, body sensations, requests, and detail rows.
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <ToolbarGroup label="View">
                  <button className="btn" onClick={refresh}>
                    Refresh
                  </button>

                  <button className="btn" onClick={expandAll}>
                    Expand all
                  </button>

                  <button className="btn" onClick={collapseAll}>
                    Collapse all
                  </button>
                </ToolbarGroup>

                <ToolbarGroup label="Export">
                  <button className="btn" onClick={() => downloadCsv(entries)}>
                    Export CSV
                  </button>

                  <button className="btn" onClick={() => exportZip(entries)}>
                    Export ZIP
                  </button>
                </ToolbarGroup>

                <ToolbarGroup label="Danger" danger>
                  <button
                    className="btn"
                    onClick={handleClear}
                    style={{
                      borderColor: "rgba(160, 78, 120, 0.28)",
                      background: "rgba(255, 120, 170, 0.14)",
                    }}
                  >
                    Clear log
                  </button>
                </ToolbarGroup>
              </div>
            </div>
          </div>
        </div>

        <div className="panel" style={{ overflow: "hidden" }}>
          {filteredEntries.length === 0 ? (
            <div className="smallMuted">
              {entries.length === 0
                ? "No entries yet. Save an entry from any modal first."
                : "No entries match this filter."}
            </div>
          ) : (
            <div className="logCardsGrid">
              {filteredEntries.map((entry, idx) => {
                const key = entry.id || `row-${idx}`;
                return (
                  <ReflectionCard
                    key={key}
                    entry={entry}
                    expanded={expandedIds.has(key)}
                    onToggle={() => toggleExpanded(key)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}