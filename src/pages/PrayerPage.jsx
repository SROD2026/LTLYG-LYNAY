// src/pages/PrayerPage.jsx

import { useMemo, useState } from "react";
import Header from "../components/layout/Header.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import EmotionGrid from "../components/grid/EmotionGrid.jsx";
import PrayerModal from "../components/prayer/PrayerModal.jsx";
import Panel from "../components/ui/Panel.jsx";
import { prayerGrid, prayerMeta } from "../data/prayerGridData.js";
import { prayerColor } from "../utils/prayerColor.js";
import { getPrayerPageBackground } from "../utils/pageThemes.js";

export default function PrayerPage({ goHome }) {
  const [selected, setSelected] = useState(null);
  const bgStyle = useMemo(() => getPrayerPageBackground(selected), [selected]);

  return (
    <div
      className="container"
      style={{
        "--page-bg": "#2a3f74",
        "--page-bg-gradient": "none",
        ...(bgStyle || {}),
      }}
    >
      <div
        className="appShell"
        style={{
          animation: "prayerHorizonDrift 18s ease-in-out infinite",
          width: "fit-content",
          margin: "0 auto",
        }}
      >
<div
  className="panel"
  style={{
    width: "min(1120px, calc(100vw - 36px))",
    margin: "0 auto",
    background: "rgba(18,24,44,0.85)",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(6px)"
  }}
>
            <div className="metaRow">
<div
  style={{
    minWidth: 0,
    maxWidth: 1120,
    flex: "1 1 620px",
    display: "grid",
    gap: 10,
  }}
>
  <div
    style={{
      fontSize: 32,
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: "-0.02em",
      color: "rgba(255,255,255,0.98)",
    }}
  >
    Emotional Prayer
  </div>

  <div
    style={{
      fontSize: 16,
      lineHeight: 1.35,
      maxWidth: 1120,
      color: "rgba(255,255,255,0.82)",
    }}
  >
    Left side: painful emotions • Right side: restorative emotions • Top:
    more activated • Bottom: more grounded. Select an emotion to turn it
    into prayer, Scripture, body awareness, and a Philippians 4:8
    redirection.
  </div>
</div>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
                "--btn-bg": "rgba(18, 24, 44, 0.78)",
                "--btn-border": "rgba(255,255,255,0.14)",
                "--btn-text": "rgba(255,255,255,0.96)",
              }}
            >
              <div className="smallMuted">Loaded {prayerGrid.length} prayer emotions</div>

              <TopNav
                goHome={goHome}
                goGrid={() => (window.location.hash = "#/grid")}
                goViolent={() => (window.location.hash = "#/violent")}
                goCheckin={() => (window.location.hash = "#/checkin")}
                goNeeds={() => (window.location.hash = "#/needs")}
                goCommunication={() => (window.location.hash = "#/communication-sins")}
                goLog={() => (window.location.hash = "#/log")}
              />
            </div>
          </div>
        </div>

<div
  className="panel"
  style={{
    width: "fit-content",
    margin: "0 auto",
    background: "rgba(18,24,44,0.72)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(6px)",
  }}
>
            <div className="gridScroll">
            <EmotionGrid
              grid={prayerGrid}
              meta={prayerMeta}
              colorFn={prayerColor}
              onPick={setSelected}
              axisLabels={{
                tl: "Painful + activated",
                tr: "Hopeful + activated",
                bl: "Painful + heavy",
                br: "Peaceful + grounded",
                xNeg: "Burdened / painful",
                xPos: "Strengthened / restored",
                yPos: "Activated / stirred",
                yNeg: "Grounded / settled",
              }}
            />
          </div>
        </div>

<Panel
  style={{
    width: "min(1120px, calc(100vw - 36px))",
    margin: "0 auto",
    background: "rgba(18,24,44,0.78)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
    color: "rgba(255,255,255,0.94)",
    backdropFilter: "blur(6px)",
  }}
>
  <div style={{ display: "grid", gap: 18 }}>
    <div
      style={{
        fontSize: 20,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: "-0.01em",
        color: "rgba(255,255,255,0.98)",
      }}
    >
      Prayer and Emotion
    </div>

  <div style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.90)" }}>
    This page helps bring emotions before God honestly. Scripture contains many prayers spoken from fear, sorrow, gratitude, and hope.
  </div>

  <div style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.90)" }}>
    Emotion itself is not sin. What matters is how we respond to emotion. Prayer allows emotion to become conversation with God so that the mind can be renewed.
  </div>

  <div
    style={{
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.10)",
      background: "rgba(255,255,255,0.06)",
      padding: 14,
    }}
  >
    <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8, color: "rgba(255,255,255,0.96)" }}>
      Philippians 4:6–8
    </div>
    <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.88)" }}>
      Bring everything to God in prayer and direct your thoughts toward what is true, honorable, just, pure, and worthy of praise.
    </div>
  </div>
</div>      


 </Panel>


        <PrayerModal
          open={!!selected}
          onClose={() => setSelected(null)}
          cell={selected}
          meta={prayerMeta}
        />
      </div>

      <style>{`
        @keyframes prayerHorizonDrift {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}