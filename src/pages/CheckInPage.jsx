  // src/pages/CheckInPage.jsx
  // COPY/PASTE ENTIRE FILE

  import { useMemo, useState } from "react";
  import Header from "../components/layout/Header.jsx";
  import EmotionGrid from "../components/grid/EmotionGrid.jsx";
  import PositiveCheckInModal from "../components/checkin/PositiveCheckInModal.jsx";
  import TopNav from "../components/layout/TopNav.jsx";
  import { checkinColor } from "../utils/checkinColor.js";

  export default function CheckInPage({
    goHome,
    checkinGrid,
    checkinMeta,
    needsSupplement,
    loading,
    error,
  }) {
    const [selected, setSelected] = useState(null);

    const grid = Array.isArray(checkinGrid) ? checkinGrid : [];
    const count = grid.length;

    const bgStyle = useMemo(() => {
      const sunsetBase = `
        linear-gradient(
          to top,
          #efd6a5 0%,
          #f4c2a1 16%,
          #f3aab2 34%,
          #e59bc8 54%,
          #cda6ea 76%,
          #9cc0f6 100%
        )
      `;

      return {
        "--page-bg": "#f3c9a8",
        "--page-bg-gradient": `
          radial-gradient(circle at 50% 78%, rgba(255, 226, 170, 0.55) 0%, transparent 26%),
          radial-gradient(circle at 50% 38%, rgba(255, 176, 196, 0.28) 0%, transparent 34%),
          ${sunsetBase}
        `,
      };
    }, []);

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
      width: "min(1120px, 100%)",
      margin: "0 auto",
    }}
  >
  <div className="panel" style={{    width: "min(1120px, 100%)", margin: "0 auto" }}>
              <div className="metaRow">
                  <div style={{ minWidth: 0, maxWidth: 1120, flex: "1 1 620px" }}>

              <Header
                title="Positive Emotion Check-In: Interoception and Gratitude"
                subtitle={
    <>
      Left: what feels fulfilled • Right: what you are grateful for • Top: activated or energized • Bottom: calm or settled
    </>
  }
              />
  </div>
            <div
    style={{
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap",
      "--btn-bg": "rgba(28, 34, 32, 0.78)",
      "--btn-border": "rgba(255,255,255,0.14)",
      "--btn-text": "rgba(255,255,255,0.96)",
    }}
  >
    
                <div className="smallMuted">
                  {loading
                    ? "Loading…"
                    : error
                      ? `Error: ${String(error.message || error)}`
                      : `Loaded ${count} entries`}
                </div>

                <TopNav
                  goHome={goHome}
                  goGrid={() => (window.location.hash = "#/grid")}
                  goViolent={() => (window.location.hash = "#/violent")}
                  goNeeds={() => (window.location.hash = "#/needs")}
                  goPrayer={() => (window.location.hash = "#/prayer")}
                  goCommunication={() => (window.location.hash = "#/communication-sins")}
                  goLog={() => (window.location.hash = "#/log")}
                />
              </div>
            </div>
          </div>

  <div className="panel gridPanel" style={{ width: "100%", margin: "0 auto" }}>
       <EmotionGrid
  grid={grid}
  onPick={setSelected}
  colorFn={checkinColor}
  meta={checkinMeta}
  tileSize={Math.min(78, (window.innerWidth - 40) / 12)}
  labelScale={1.2}
  axisLabels={{
    tl: "Internally fulfilled (energized)",
    tr: "Externally grateful (energized)",
    bl: "Internally fulfilled (settled)",
    br: "Externally grateful (settled)",
    xNeg: "Needs met inside",
    xPos: "Appreciation toward others",
  }}
/>
        </div>

  </div>
          <PositiveCheckInModal
            open={!!selected}
            onClose={() => setSelected(null)}
            cell={selected}
            checkinMeta={checkinMeta}
            needsSupplement={needsSupplement}
          />
      </div>
    );
  }