// src/pages/PurposePage.jsx

import { useEffect, useState } from "react";
import Header from "../components/layout/Header.jsx";
import PurposeDropdown from "../components/purpose/PurposeDropdown.jsx";

const PURPOSE_KEY = "blameless_purpose_text_v1";
const CONTENT_CANVAS_WIDTH = 1200;

const tileBase = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.18)",
  padding: 0,
  overflow: "hidden",
  position: "relative",
  minHeight: 132,
  minWidth: 132,
  textAlign: "left",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
  transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
};

function tileStyle(type) {
  if (type === "violent") {
    return {
      ...tileBase,
      color: "rgba(255,248,245,0.98)",
      border: "1px solid rgba(183, 88, 71, 0.22)",
      background: `
        linear-gradient(
          180deg,
          #c95a48 0%,
          #a24a5b 38%,
          #7a355b 68%,
          #e29a58 100%
        )
      `,
    };
  }

  if (type === "grid") {
    return {
      ...tileBase,
      color: "#21304a",
      border: "1px solid rgba(102, 120, 194, 0.18)",
      background: `
        linear-gradient(
          180deg,
          #8aa4ea 0%,
          #b9c7f0 48%,
          #ebe0d2 100%
        )
      `,
    };
  }

  if (type === "checkin") {
    return {
      ...tileBase,
      color: "#213627",
      border: "1px solid rgba(90, 145, 96, 0.18)",
      background: `
        linear-gradient(
          180deg,
          #76b67c 0%,
          #c6d88e 52%,
          #efd19e 100%
        )
      `,
    };
  }

if (type === "communication") {
  return {
    ...tileBase,
    color: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(92, 96, 172, 0.28)",
    background: `
      linear-gradient(
        180deg,
        #5b5fc7 0%,
        #7b6bd1 40%,
        #9c8be4 72%,
        #c7c4f4 100%
      )
    `,
  };
}

  if (type === "needs") {
    return {
      ...tileBase,
      color: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(61, 137, 145, 0.28)",
      background: `
        linear-gradient(
          180deg,
          #2f7b8b 0%,
          #4ea8a9 42%,
          #8fd1c6 76%,
          #dff1d7 100%
        )
      `,
    };
  }

  if (type === "prayer") {
    return {
      ...tileBase,
      color: "rgba(255,255,255,0.98)",
      border: "1px solid rgba(82, 97, 170, 0.30)",
      background: `
        linear-gradient(
          135deg,
          #8d2f43 0%,
          #395ea8 34%,
          #d8b847 68%,
          #5ca867 100%
        )
      `,
    };
  }

  if (type === "log") {
    return {
      ...tileBase,
      color: "#34395d",
      border: "1px solid rgba(126, 132, 199, 0.18)",
      background: `
        linear-gradient(
          180deg,
          #b9b5ec 0%,
          #d8d4f2 52%,
          #eef1fb 100%
        )
      `,
    };
  }

  return {
    ...tileBase,
    color: "#3c3848",
    background: `
      linear-gradient(
        180deg,
        #d9d6ec 0%,
        #dfe1f3 52%,
        #eceffd 100%
      )
    `,
  };
}

function HomeTile({ label, onClick, type }) {
  const isDark = type === "violent";
  const isPrayer = type === "prayer";

  return (
    <button className="hubTile" onClick={onClick} style={tileStyle(type)}>
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          minHeight: 132,
          alignItems: "center",
          padding: isPrayer ? "8px" : "14px 14px",
          background:
            type === "communication"
              ? "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))"
              : isDark
                ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                : "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
          backdropFilter: "blur(2px)",
        }}
      >
        {isPrayer ? (
          <>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                minHeight: 116,
                width: "100%",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 84,
                  lineHeight: 1,
                  display: "inline-block",
                }}
              >
                {label}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                right: 14,
                bottom: 12,
                fontSize: 18,
                opacity: 0.42,
                lineHeight: 1,
              }}
            >
              ›
            </div>
          </>
        ) : (
          <div
            style={{
              display: "grid",
              alignContent: "space-between",
              minHeight: 100,
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                lineHeight: 1.18,
                letterSpacing: "-0.01em",
                color: isDark ? "rgba(255,250,247,0.98)" : "inherit",
                textShadow: isDark ? "0 1px 1px rgba(0,0,0,0.12)" : "none",
              }}
            >
              {label}
            </div>

            <div
              style={{
                justifySelf: "end",
                fontSize: 18,
                opacity: isDark ? 0.7 : 0.42,
                lineHeight: 1,
              }}
            >
              ›
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

const centerCardStyle = {
  borderRadius: 18,
  border: "1px solid rgba(73, 82, 78, 0.10)",
  background: "rgba(255,255,255,0.62)",
  boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
  minHeight: 132,
  aspectRatio: "1 / 1",
  width: "100%",
  maxWidth: 150,
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  padding: 12,
};

export default function PurposePage({
  goGrid,
  goViolent,
  goCheckin,
  goNeeds,
  goPrayer,
  goLog,
  goCommunication,
  purposeDropdown = [],
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PURPOSE_KEY);
      if (saved != null) setText(saved);
    } catch {
      // ignore
    }
  }, []);

  function onChange(e) {
    const v = e.target.value;
    setText(v);
    try {
      localStorage.setItem(PURPOSE_KEY, v);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="container purposePageClean"
      style={{
        "--text": "#1f2723",
        "--muted": "#53645b",
        "--card": "rgba(255,255,255,0.70)",
        "--border": "rgba(76, 92, 84, 0.10)",
        "--shadow": "0 14px 34px rgba(76, 92, 84, 0.10)",
        "--btn-bg": "rgba(255,255,255,0.34)",
        "--btn-border": "rgba(76, 92, 84, 0.12)",
        "--btn-text": "#233028",
        "--page-bg": "#f3f5f4",
        "--page-bg-gradient": `
          radial-gradient(circle at 20% 20%, rgba(226,232,228,0.45) 0%, transparent 28%),
          radial-gradient(circle at 80% 18%, rgba(234,237,243,0.34) 0%, transparent 32%),
          radial-gradient(circle at 18% 82%, rgba(236,231,227,0.26) 0%, transparent 28%),
          linear-gradient(
            180deg,
            #f7f8f7 0%,
            #f1f4f2 48%,
            #f7f8f7 100%
          )
        `,
      }}
    >
      <div
  className="appShell"
  style={{
    width: "100%",
    maxWidth: CONTENT_CANVAS_WIDTH,
    margin: "0 auto",
  }}
>   <div className="panel">
          <Header
            title="Accountability, Christian Edification, Gratitude, and Emotional Awareness Tool"
            subtitle={
              <>
                Your emotions are important. Naming them can help you understand and communicate your needs. This tool is designed to support emotional awareness and nonviolent communication, not to diagnose intent or assign blame.
              </>
            }
          />
        </div>

        <div className="panel">
          <div style={{ display: "grid", gap: 14 }}>
            <div className="sectionTitle">Choose a path</div>

<div className="purposeHubGrid">
  <div className="hubCell hubViolent">
    <HomeTile
      label="I’m feeling harmed by someone and just want to get my feelings heard."
      onClick={goViolent}
      type="violent"
    />
  </div>

  <div className="hubCell hubNonviolent">
    <HomeTile
      label="I’m feeling harmed but I want to speak nonviolently."
      onClick={goGrid}
      type="grid"
    />
  </div>

<div className="hubCenter">
  <div className="hubCenterCard">
    <div
      style={{
        display: "grid",
        gap: 4,
        placeItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 42,
          lineHeight: 1,
          fontWeight: 700,
          color: "rgba(70, 76, 74, 0.82)",
        }}
      >
        +
      </div>

      <div
        style={{
          fontSize: 15,
          fontWeight: 900,
          color: "#2e3a35",
          lineHeight: 1.08,
        }}
      >
        Choose a path
      </div>

      <div
        style={{
          fontSize: 11.5,
          lineHeight: 1.22,
          color: "#66736d",
          fontWeight: 700,
        }}
      >
        truth, love,
        <br />
        awareness,
        <br />
        repentance, repair
      </div>
    </div>
  </div>
</div>

  <div className="hubCell hubPrayer">
  <HomeTile
    label="🙏"
    onClick={goPrayer}
    type="prayer"
  />
</div>

  <div className="hubCell hubCheckin">
    <HomeTile
      label="I’m just checking in and acknowledging how I feel."
      onClick={goCheckin}
      type="checkin"
    />
  </div>

  <div className="hubCell hubNeeds">
    <HomeTile
      label="What are needs, and how does Scripture support them?"
      onClick={goNeeds}
      type="needs"
    />
  </div>

  <div className="hubCell hubCommunication">
    <HomeTile
      label="How words can harm, and how love repairs"
      onClick={goCommunication}
      type="communication"
    />
  </div>

  <div className="hubCell hubLog">
    <HomeTile
      label="LOG: past entries on this device / export"
      onClick={goLog}
      type="log"
    />
  </div>
</div>
          </div>
        </div>  
        <div className="panel">
          <div style={{ display: "grid", gap: 12 }}>
            <PurposeDropdown items={purposeDropdown} />
          </div>
        </div>

        <div className="panel">
          <div style={{ display: "grid", gap: 10 }}>
            <div className="sectionTitle">Disclaimer</div>

            <div className="smallMuted" style={{ lineHeight: 1.55 }}>
              This tool is for emotional awareness and communication support. It is not a clinical diagnostic tool and does not determine intent or abuse. For relational or mental health concerns, consult qualified pastoral or licensed professionals.
            </div>

            <div className="smallMuted" style={{ lineHeight: 1.55 }}>
              Naming a need does not remove personal responsibility for behavior.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}