import { useMemo, useState, useEffect } from "react";
import Header from "../components/layout/Header.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import EmotionGrid from "../components/grid/EmotionGrid.jsx";
import PrayerModal from "../components/prayer/PrayerModal.jsx";
import { prayerGrid, prayerMeta } from "../data/prayerGridData.js";
import { prayerColor } from "../utils/prayerColor.js";
import { getPrayerPageBackground } from "../utils/pageThemes.js";
import { compactPrayerGrid } from "../data/compactPrayerGrid.js";

export default function PrayerPage({ goHome, showExpandedGrid, setShowExpandedGrid, }) {
  const [selected, setSelected] = useState(null);

  const bgStyle = useMemo(() => getPrayerPageBackground(selected), [selected]);


  return (
    <div
  className="container"
  style={{
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
        }}
      >
        <div
          className="panel gridPanel"
          style={{
            width: "min(1120px, 100%)",
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(236, 25, 57, 0.85), rgba(140, 123, 206, 0.85), rgba(79, 223, 47, 0.85))",
            border: "2px solid rgba(77, 255, 23, 0.14)",
              padding: "8px 8px 10px",

          }}
        >
          <div className="pageMetaRow">
           <div
  className="pageHeaderTitle"
  style={{
    minWidth: 0,
    maxWidth: 1120,
    display: "grid",
    gap: 10,
  }}
  >


  <Header
    title="Emotional Prayer"
    subtitle={
      <span style={{ color: "rgba(255,255,255,0.94)" }}>
      <>
        Left side: painful emotions • Right side: restorative emotions •
        Top: more activated • Bottom: more grounded. Select an emotion to
        turn it into prayer, Scripture, body awareness, and a Philippians
        4:8 redirection.
      </>
      </span>
      }
  />
  </div>

            <div
  className="pageTopNavWrap"
  style={{
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4
  }}
  >

              <TopNav
                goHome={goHome}
                goGrid={() => (window.location.hash = "#/grid")}
                goViolent={() => (window.location.hash = "#/violent")}
                goCheckin={() => (window.location.hash = "#/checkin")}
                goNeeds={() => (window.location.hash = "#/needs")}
                goCommunication={() => (window.location.hash = "#/communication-sins")}
                goLog={() => (window.location.hash = "#/log")}
                expanded={showExpandedGrid}
                onToggleExpanded={() => setShowExpandedGrid((v) => !v)}
             />
            </div>
          </div>
        </div>

        <div
          className="panel gridPanel"
          style={{
            width: "100%",
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(242, 95, 95, 0.85), rgba(77, 98, 232, 0.85), rgba(118, 198, 83, 0.85))",
            border: "1px solid rgba(255,255,255,0.10)",
    padding: "10px 10px 8px",
          }}
        >
  <EmotionGrid
  grid={prayerGrid}
  compactOverlay={!showExpandedGrid}
  compactGrid={compactPrayerGrid}
  compactTileSize={120}
  compactLabelScale={1.18}
  meta={prayerMeta}
  colorFn={prayerColor}
  onPick={(value) => {
    setSelected(value);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 80);
  }}
  tileSize={78}
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