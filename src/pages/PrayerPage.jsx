import { useMemo, useState } from "react";
import TopNav from "../components/layout/TopNav.jsx";
import EmotionGrid from "../components/grid/EmotionGrid.jsx";
import PrayerModal from "../components/prayer/PrayerModal.jsx";
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
    position: "relative",
    minHeight: "100dvh",
  }}
>
        <div
        className="appShell"
        style={{
          width: "100%",
          maxWidth: 1120,
          margin: "0 auto",
          minHeight: "100dvh",
        }}
      >
        <div
          className="panel gridPanel"
          style={{
            width: "min(1120px, 100%)",
            margin: "0 auto",
            background: "rgba(231, 197, 197, 0.85)",
            border: "1px solid rgba(255,255,255,0.14)",
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
color: "rgba(24,28,34,0.96)"                }}
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
                Left side: painful emotions • Right side: restorative emotions •
                Top: more activated • Bottom: more grounded. Select an emotion to
                turn it into prayer, Scripture, body awareness, and a Philippians
                4:8 redirection.
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
              <div className="smallMuted">
                Loaded {prayerGrid.length} prayer emotions
              </div>

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
            width: "100%",
            margin: "0 auto",
            background: "rgb(214, 205, 202)", 
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
        <EmotionGrid
  grid={prayerGrid}
  meta={prayerMeta}
  colorFn={prayerColor}
  onPick={setSelected}
  tileSize={Math.min(78, (window.innerWidth - 40) / 12)}
  labelScale={1.15}
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
        <PrayerModal
          open={!!selected}
          onClose={() => setSelected(null)}
          cell={selected}
          meta={prayerMeta}
        />

    </div>
 
 
  );
}