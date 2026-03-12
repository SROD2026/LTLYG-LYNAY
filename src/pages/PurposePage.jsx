// src/pages/PurposePage.jsx
import { useEffect, useState } from "react";
import Header from "../components/layout/Header.jsx";
import PurposeDropdown from "../components/purpose/PurposeDropdown.jsx";
import Panel from "../components/ui/Panel.jsx";

const PURPOSE_KEY = "blameless_purpose_text_v1";
const CONTENT_CANVAS_WIDTH = 1200;

const tileBase = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.18)",
  padding: 0,
  overflow: "hidden",
  position: "relative",
  minHeight: 112,
  minWidth: 112,
  textAlign: "left",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
  transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
};

function CollapsiblePanel({ title, children, defaultOpen = false, background }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Panel
      style={{
        background:
          background ||
          "linear-gradient(180deg, rgba(242, 242, 243, 0.92), rgba(164, 107, 203, 0.72))",
        border: "1px solid rgba(255,255,255,0.12)",
        width: "min(1120px, 100%)",
        margin: "0 auto",
        marginTop: 2,
        borderRadius: 18,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          padding: "1px 16px",
          borderRadius: 5,
          transition: "background 0.15ms ease",
          margin: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          textAlign: "left",
          color: "#111111",
          fontWeight: 900,
          fontSize: 22,
        }}
      >
        <span>{title}</span>
        <span
          style={{
            fontSize: 22,
            lineHeight: 1,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
          }}
        >
          ›
        </span>
      </button>

      {open ? (
        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {children}
        </div>
      ) : null}
    </Panel>
  );
}

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
    color: "#3f2f36",
    border: "1px solid rgba(214, 150, 152, 0.22)",
    background: `
      linear-gradient(
        180deg,
        #efd6a5 0%,
        #f4c2a1 16%,
        #f3aab2 34%,
        #e59bc8 54%,
        #cda6ea 76%,
        #9cc0f6 100%
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
          minHeight: 112,
          height: "100%",
          alignItems: "stretch",
          padding: isPrayer ? "6px" : "10px 10px",
          background:
  type === "prayer"
    ? "none"
    : type === "communication"
      ? "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))"
      : isDark
        ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
        : "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
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
  className="hubPrayerEmoji"
  style={{
    fontSize: 64,
    lineHeight: 1,
    display: "inline-block",
  }}
>
                {label}
              </div>
            </div>

          </>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr auto",
              minHeight: 0,
              height: "100%",
              gap: 2,
            }}
          >
<div
  className="hubTileLabel"
  style={{
    fontSize: 16,
    fontWeight: 900,
    lineHeight: 1.02,
    letterSpacing: "-0.02em",
    color: "#111",
    WebkitTextStroke: "1px rgba(255,255,255,0.48)",
    textShadow: `
      -.5px -.5px 0 rgba(255,255,255,0.48),
       .5px -.5px 0 rgba(255,255,255,0.48),
      -.5px  .5px 0 rgba(255,255,255,0.48),
       .5px  .5px 0 rgba(255,255,255,0.48)
    `,
    display: "block",
  }}
>
  {label}
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
  boxShadow: "0 8px 18px hsla(0, 0%, 0%, 0.06)",
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
> 


  <div className="panel">
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
        className="centerTitle"
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
        className="centerSubtitle"
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

         <CollapsiblePanel
  title="Lets get it straight: What Love Really Is"
  defaultOpen={false}
  background="linear-gradient(180deg, rgba(255,255,255,0.9), rgba(210,197,245,0.85))"
>
  <div style={{ display: "grid", gap: 14 }}>

    <div
      style={{
        padding: 14,
        borderLeft: "4px solid rgba(108, 108, 255, 0.72)",
        background: "rgba(255,255,255,0.58)",
        borderRadius: 10,
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 900, color: "#111" }}>John 14</div>
      <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
        Jesus says that he is the way, the truth, and the life, and that love for him is shown in keeping his word.
        He does not leave his people as orphans, but gives the Holy Spirit, the Spirit of truth, to guide, teach,
        and bring peace.
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
          Love begins with God
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
          Scripture teaches that “God is love,” and Jesus shows what that love looks like in real life. Love is not
          merely emotion or performance — it is living in truth, remaining connected to God, and allowing his Spirit
          to guide our lives and relationships.
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
          Human beings were created for love
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
          Jesus commanded his followers to love one another and said this would mark his disciples. Love is therefore
          not optional for healthy relationships — it is foundational. Because many people grow up with love absent,
          distorted, or confused, learning love is a journey of growth, maturity, and healing.
        </div>
      </div>
    </div>

    <hr
      style={{
        border: "none",
        borderTop: "1px solid rgba(0,0,0,0.12)",
        margin: "2px 0",
      }}
    />

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
          Love moves toward relationship
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
          Love welcomes connection instead of hiding, blame, or withdrawal. Healthy love honors another person’s needs,
          pace, limits, dignity, and unique inner world. It does not erase individuality or demand emotional sameness.
          Instead, it creates space for truth, growth, and repair.
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
          We learn love by receiving it first
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
          “We love because he first loved us.” Receiving God’s love changes how we see ourselves and others. Instead of
          performing for acceptance or trying to earn love, we begin from a place of being known and welcomed. From that
          foundation, love starts shaping our thoughts, emotions, words, and actions.
        </div>
      </div>
    </div>

    <hr
      style={{
        border: "none",
        borderTop: "1px solid rgba(0,0,0,0.12)",
        margin: "2px 0",
      }}
    />

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
          Love includes affection and emotional maturity
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
          Love includes care, comfort, kindness, patience, and presence. Scripture describes the fruit of the Spirit —
          love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control — as visible signs
          of a maturing heart. Emotional growth and relational maturity are therefore part of spiritual growth.
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
          Distortions of love damage connection
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
          When love is absent or distorted, people often turn toward substitutes such as control, fear, addiction,
          obsession, or lust. These may feel powerful, but they damage trust and connection. God’s love, by contrast,
          brings clarity, peace, and restoration, and the Holy Spirit guides hearts back toward truth and healthy
          relationship.
        </div>
      </div>
    </div>

    <hr
      style={{
        border: "none",
        borderTop: "1px solid rgba(0,0,0,0.12)",
        margin: "2px 0",
      }}
    />

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
          Why this tool exists
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
          This tool is meant to support that journey. By helping you observe situations, name emotions, and identify
          underlying needs, it encourages honest reflection and healthier communication. Over time, patterns become
          clearer, making it easier to respond with truth, compassion, boundaries, and repair.
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
          Love tells the truth and seeks restoration
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
          Love does not ignore harm or erase responsibility. It seeks truth, accountability, and restoration. When
          relationships repeatedly refuse empathy, honesty, or repair, wise boundaries may be necessary. Healthy love
          protects dignity while still keeping a posture of compassion and hope.
        </div>
      </div>
    </div>

    <div
      style={{
        padding: 14,
        borderLeft: "4px solid rgba(126, 86, 234, 0.72)",
        background: "rgba(255,255,255,0.58)",
        borderRadius: 10,
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 900, color: "#111" }}>Final takeaway</div>
      <div style={{ fontSize: 15, lineHeight: 1.6, color: "#111" }}>
        Learning love is a lifelong process. As we remain connected to Christ — the way, the truth, and the life —
        we grow deeper in our ability to love God, ourselves, and others with honesty, humility, and grace.
      </div>
    </div>

  </div>
</CollapsiblePanel>


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