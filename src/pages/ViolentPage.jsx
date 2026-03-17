// src/pages/ViolentPage.jsx
import { useMemo, useState, useEffect } from "react";
import Header from "../components/layout/Header.jsx";
import EmotionGrid from "../components/grid/EmotionGrid.jsx";
import EmotionModal from "../components/emotion/EmotionModal.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import { buildViolentCauseIndex, getReplacementEmotions } from "../utils/data.js";
import { getViolentPageBackground } from "../utils/pageThemes.js";
import { compactViolentGrid } from "../data/compactViolentGrid.js";

export default function ViolentPage({ goHome, master, loading, error, showExpandedGrid, setShowExpandedGrid,}) {
  const [selected, setSelected] = useState(null);
const GRID_PREF_KEY = "preferredGridMode";
const [mobile, setMobile] = useState(false);

useEffect(() => {
  const update = () => setMobile(window.innerWidth <= 768);
  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, []);

useEffect(() => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    GRID_PREF_KEY,
    showExpandedGrid ? "expanded" : "compact"
  );
  }, [showExpandedGrid]);

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
   {/* HEADER PANEL */}
<div
  className="panel textOutlineRed"
  style={{
    width: "min(1120px, 100%)",
    margin: "0 auto",
    padding: "8px 8px 10px",
    border: "2px solid rgba(77, 255, 23, 0.14)",
  }}
>

  <div className="pageMetaRow">
    <div className="pageHeaderTitle" style={{ minWidth: 0, maxWidth: 1120 }}>
      <Header
        title="I've been wronged..."
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
      className="pageTopNavWrap"
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: 12,
      }}
    >
      <TopNav
        goHome={goHome}
        goGrid={() => (window.location.hash = "#/grid")}
        goCheckin={() => (window.location.hash = "#/checkin")}
        goNeeds={() => (window.location.hash = "#/needs")}
        goPrayer={() => (window.location.hash = "#/prayer")}
        goCommunication={() => (window.location.hash = "#/communication-sins")}
        goLog={() => (window.location.hash = "#/log")}
        expanded={showExpandedGrid}
onToggleExpanded={(e) => {
  e?.currentTarget?.blur?.();

  const y = window.scrollY;
  setShowExpandedGrid((v) => !v);

  requestAnimationFrame(() => {
    window.scrollTo(0, y);
  });
}}
      />
    </div>
  </div>

</div>

{/* GRID PANEL */}
<div
  className="panel textOutlineRed"
  style={{
    width: "100%",
    margin: "0 auto",
    minWidth: 0,
    background: "linear-gradient(135deg, rgba(210,49,49,0.55), rgba(63,2,2,0.85), rgba(199,157,157,0.69))",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: "10px 10px 8px",
  }}
>
  <EmotionGrid
    grid={grid}
    compactOverlay={!showExpandedGrid}
    compactGrid={compactViolentGrid}
    compactTileSize={120}
    compactLabelScale={1.18}
    meta={meta}
    onPick={(value) => {
      setSelected(value);

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 80);
    }}
    axisLabels={{
      tl: "RED (activated)",
      tr: "YELLOW (surprised)",
      bl: "PURPLE (shame)",
      br: "BLUE (low)",
    }}
    tileSize={78}
    labelScale={1.05}
  /> 
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
  </div>
);
}