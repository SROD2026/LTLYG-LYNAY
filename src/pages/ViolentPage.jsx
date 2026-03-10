// src/pages/ViolentPage.jsx
import { useMemo, useState } from "react";
import Header from "../components/layout/Header.jsx";
import EmotionGrid from "../components/grid/EmotionGrid.jsx";
import EmotionModal from "../components/emotion/EmotionModal.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import { buildViolentCauseIndex, getReplacementEmotions } from "../utils/data.js";
import { getViolentPageBackground } from "../utils/pageThemes.js";

export default function ViolentPage({ goHome, master, loading, error }) {
  const [selected, setSelected] = useState(null);

  const grid = Array.isArray(master?.violentGrid) ? master.violentGrid : [];
  const nnmGrid = Array.isArray(master?.nnmGrid) ? master.nnmGrid : [];
  const meta =
    master?.emotion_meta && typeof master.emotion_meta === "object"
      ? master.emotion_meta
      : {};
  const needsSupplement =
    master?.needs_supplement && typeof master.needs_supplement === "object"
      ? master.needs_supplement
      : { global: [] };

  const violent2 = master?.violent2 || {};
  const causeIndex = useMemo(() => buildViolentCauseIndex(violent2), [violent2]);

const bgStyle = useMemo(() => getViolentPageBackground(selected), [selected]);

  const replacements = useMemo(() => {
    return getReplacementEmotions({ violentCell: selected, nnmGrid, count: 15 });
  }, [selected, nnmGrid]);

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
      <div
        className="panel textOutlineRed"
        style={{
          width: "min(1120px, 100%)",
margin: "0 auto",
        }}
      >
        <div className="metaRow">
          <div style={{ minWidth: 0, maxWidth: 1120, flex: "1 1 620px" }}>
            <Header
              title="I'm Feeling Violent"
              subtitle={
                <>
                  We all feel this way sometimes. However, these emotions are
                  rarely helpful in getting our needs met. After you pick one,
                  consider alternatives that foster connection, and speak the
                  truth in love.
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
            }}
          >
            <div className="smallMuted">
              {loading
                ? "Loading…"
                : error
                ? `Error: ${String(error.message || error)}`
                : `Loaded ${grid.length} entries`}
            </div>

            <TopNav
              goHome={goHome}
              goGrid={() => (window.location.hash = "#/grid")}
              goCheckin={() => (window.location.hash = "#/checkin")}
              goNeeds={() => (window.location.hash = "#/needs")}
              goPrayer={() => (window.location.hash = "#/prayer")}
              goCommunication={() => (window.location.hash = "#/communication-sins")}
              goLog={() => (window.location.hash = "#/log")}
            />
          </div>
        </div>
      </div>

      <div
        className="panel textOutlineRed gridPanel"
        style={{
          width: "100%",
          margin: "0 auto",
        }}
      >
        <EmotionGrid
          grid={grid}
          meta={meta}
          onPick={setSelected}
          axisLabels={{
            tl: "RED (activated)",
            tr: "YELLOW (surprised)",
            bl: "PURPLE (shame)",
            br: "BLUE (low)",
          }}
          tileSize={78}
          labelScale={1.10}
        />
      </div>
    </div>

    <EmotionModal
      open={!!selected}
      onClose={() => setSelected(null)}
      cell={selected}
      mode="violent"
      master={master}
      meta={meta}
      causeIndex={causeIndex}
      replacementOptions={replacements}
      needsSupplement={needsSupplement}
    />
  </div>
);
}