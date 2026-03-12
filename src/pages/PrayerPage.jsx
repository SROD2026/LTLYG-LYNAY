import { useMemo, useState } from "react";
import Header from "../components/layout/Header.jsx";
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
          <div className="pageMetaRow">
            <div className="pageHeaderTitle"
              style={{
                minWidth: 0,
                maxWidth: 1120,
                display: "grid",
                gap: 10,
              }}
            >
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
      <>
        Left side: painful emotions • Right side: restorative emotions •
        Top: more activated • Bottom: more grounded. Select an emotion to
        turn it into prayer, Scripture, body awareness, and a Philippians
        4:8 redirection.
      </>
    }
  />
</div>
            </div>

            <div
  className="pageTopNavWrap"
  style={{
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 12
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
              />
            </div>
          </div>
        </div>

        <div
          className="panel gridPanel"
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