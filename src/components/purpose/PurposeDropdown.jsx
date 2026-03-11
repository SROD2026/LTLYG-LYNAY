// src/components/purpose/PurposeDropdown.jsx
// modular-ready version: prefers items passed from useAppData, falls back to fetch only if needed

import { useEffect, useMemo, useState } from "react";
import ScriptureRotator from "../ui/ScriptureRotator.jsx";

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function hexToRgb(hex) {
  const h = String(hex).replace("#", "").trim();
  const full =
    h.length === 3
      ? h.split("").map((c) => c + c).join("")
      : h.padEnd(6, "0").slice(0, 6);

  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToCss({ r, g, b }, alpha = 1) {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

function mixHex(c1, c2, t) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return {
    r: mix(a.r, b.r, t),
    g: mix(a.g, b.g, t),
    b: mix(a.b, b.b, t),
  };
}

function getPurposeTone(i, total) {
  const count = Math.max(1, Number(total || 1));
  const t = count <= 1 ? 0 : clamp01(i / (count - 1));

  // pastel anchors across the whole sequence
  const anchors = [
    { stop: 0.00, top: "#d9e2f8", bottom: "#ede5fb", ink: "#24324a", body: "#42506a", scriptureTop: "#6d7bb6", scriptureBottom: "#8a78bf" },
    { stop: 0.18, top: "#dfeadb", bottom: "#eef1df", ink: "#233b2a", body: "#465848", scriptureTop: "#6a9b72", scriptureBottom: "#9ba465" },
    { stop: 0.36, top: "#f0dfda", bottom: "#f6ece1", ink: "#4a2d2b", body: "#654c49", scriptureTop: "#a46763", scriptureBottom: "#c48f68" },
    { stop: 0.54, top: "#f2ead0", bottom: "#efe3c8", ink: "#4a4025", body: "#675c3f", scriptureTop: "#ac9350", scriptureBottom: "#ceb166" },
    { stop: 0.72, top: "#dde0f4", bottom: "#ebe2f8", ink: "#2d3158", body: "#4c5070", scriptureTop: "#6670b9", scriptureBottom: "#8c79c6" },
    { stop: 1.00, top: "#e7e8ee", bottom: "#f2f3f7", ink: "#2d3440", body: "#4d5660", scriptureTop: "#7b819e", scriptureBottom: "#9aa0b7" },
  ];

  function sample(key) {
    let left = anchors[0];
    let right = anchors[anchors.length - 1];

    for (let k = 0; k < anchors.length - 1; k++) {
      const a = anchors[k];
      const b = anchors[k + 1];
      if (t >= a.stop && t <= b.stop) {
        left = a;
        right = b;
        break;
      }
    }

    const localT =
      left.stop === right.stop ? 0 : (t - left.stop) / (right.stop - left.stop);

    return mixHex(left[key], right[key], localT);
  }

  const top = sample("top");
  const bottom = sample("bottom");
  const ink = sample("ink");
  const body = sample("body");
  const scriptureTop = sample("scriptureTop");
  const scriptureBottom = sample("scriptureBottom");

  return {
    cardBg: `linear-gradient(180deg, ${rgbToCss(top, 0.68)}, ${rgbToCss(bottom, 0.56)})`,
    cardBorder: rgbToCss(ink, 0.14),
    cardOpenBorder: rgbToCss(ink, 0.24),
    headerText: rgbToCss(ink, 0.98),
    bodyText: rgbToCss(body, 0.96),
    labelText: rgbToCss(ink, 0.92),
    scriptureBg: `linear-gradient(180deg, ${rgbToCss(scriptureTop, 0.82)}, ${rgbToCss(scriptureBottom, 0.80)})`,
    scriptureBorder: rgbToCss(scriptureTop, 0.22),
  };
}

export default function PurposeDropdown({ items: itemsProp = [] }) {
  const [items, setItems] = useState(() => safeArray(itemsProp));
  const [openMap, setOpenMap] = useState({});
  const [status, setStatus] = useState({
    loading: !Array.isArray(itemsProp) || itemsProp.length === 0,
    error: "",
  });

  useEffect(() => {
    if (Array.isArray(itemsProp) && itemsProp.length > 0) {
      setItems(itemsProp);
      setOpenMap({});
      setStatus({ loading: false, error: "" });
      return;
    }

    let alive = true;

    async function loadFallback() {
      try {
        setStatus({ loading: true, error: "" });
        const res = await fetch("/data/content/purposeDropdown.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!alive) return;

        const list = safeArray(json);
        setItems(list);
        setOpenMap({});
        setStatus({ loading: false, error: "" });
      } catch {
        if (!alive) return;
        setStatus({
          loading: false,
          error: "Could not load purposeDropdown.json. Check /public/data/content and filename casing.",
        });
      }
    }

    loadFallback();
    return () => {
      alive = false;
    };
  }, [itemsProp]);

  const allOpen = useMemo(() => {
    if (!items.length) return false;
    return items.every((_, i) => !!openMap[i]);
  }, [items, openMap]);

  function toggle(i) {
    setOpenMap((m) => ({ ...m, [i]: !m[i] }));
  }

  function openAll() {
    const next = {};
    items.forEach((_, i) => {
      next[i] = true;
    });
    setOpenMap(next);
  }

  function closeAll() {
    setOpenMap({});
  }

  if (status.loading) {
    return (
      <div className="purposeDD">
        <div className="smallMuted">Loading purpose framework…</div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="purposeDD">
        <div className="smallMuted" style={{ color: "rgba(180,70,70,0.92)" }}>
          {status.error}
        </div>
      </div>
    );
  }

  return (
    <div className="purposeDD">
      <div style={{ display: "grid", gap: 10 }}>
        <div
          className="purposeDD__heading"
          style={{
            fontSize: 30,
            fontFamily: "sans-serif",
            fontWeight: 800,
            color: "#1d2530",
            lineHeight: 1.12,
          }}
        >
          Core Spiritual and Mental Framework
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn purposeDD__miniBtn" onClick={allOpen ? closeAll : openAll}>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>

      <div className="purposeDD__list">
        {items.map((item, i) => {
const isOpen = !!openMap[i];
const title = String(item?.title || `Section ${i + 1}`);
const sections = safeArray(item?.sections);
const scriptures = safeArray(item?.scriptures);
const tone = getPurposeTone(i, items.length);
          return (
            <div
              key={i}
              className={`purposeDD__card ${isOpen ? "isOpen" : ""}`}
              style={{
  borderRadius: 18,
  border: isOpen
    ? `1px solid ${tone.cardOpenBorder}`
    : `1px solid ${tone.cardBorder}`,
  background: tone.cardBg,
  boxShadow: isOpen
    ? "0 10px 22px rgba(88, 98, 160, 0.08)"
    : "0 4px 10px rgba(88, 98, 160, 0.03)",
}}

            >
              <button
                className="purposeDD__header"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: tone.headerText,
                  cursor: "pointer",
                  padding: "14px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div
                  className="purposeDD__title"
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    lineHeight: 1.28,
                    color: tone.headerText,
                  }}
                >
                  {title}
                </div>

                <div
                  className={`purposeDD__chev ${isOpen ? "isOpen" : ""}`}
                  style={{
                    opacity: 0.7,
                    fontSize: 18,
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 160ms ease, opacity 160ms ease",
                    color: tone.bodyText,
                  }}
                >
                  ›
                </div>
              </button>

              <div
                className="purposeDD__body"
                style={{
                  display: isOpen ? "block" : "none",
                  padding: "0 14px 14px",
                }}
              >
                {sections.map((sec, sIdx) => (
                  <div key={sIdx} className="purposeDD__section" style={{ marginTop: 12 }}>
                    <div
                      className="purposeDD__label"
                      style={{
                        fontWeight: 800,
                        marginBottom: 8,
                        color: tone.labelText,
                        fontSize: 14,
                      }}
                    >
                      {String(sec?.label || "Notes")}
                    </div>

                    <ul
                      className="purposeDD__bullets"
                      style={{
                        margin: 0,
                        paddingLeft: 18,
                        color: tone.bodyText,
                        lineHeight: 1.55,
                        fontSize: 14,
                      }}
                    >
                      {safeArray(sec?.bullets).map((b, bIdx) => (
                        <li key={bIdx} style={{ margin: "6px 0" }}>
                          {String(b)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {scriptures.length > 0 && (
                  <div
                    className="purposeDD__scriptureBox"
                    style={{
  marginTop: 14,
  borderRadius: 14,
  border: `1px solid ${tone.scriptureBorder}`,
  background: tone.scriptureBg,
  padding: 12,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
}}
                  >
                    <div
                      className="purposeDD__label"
                      style={{
                        marginBottom: 10,
                        fontWeight: 800,
color: "rgba(255,255,255,0.96)",
                        fontSize: 15,
                      }}
                    >
                      Scriptures
                    </div>

                   <ScriptureRotator
  scriptures={scriptures}
  perPage={2}
  title=""
  buttonLabel="Show more"
  containerStyle={{ gap: 12 }}
  cardStyle={{
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
  }}
/>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}