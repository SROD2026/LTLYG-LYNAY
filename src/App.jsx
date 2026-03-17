// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import useAppData from "./hooks/useAppData.js";

import Header from "./components/layout/Header.jsx";
import EmotionGrid from "./components/grid/EmotionGrid.jsx";
import EmotionModal from "./components/emotion/EmotionModal.jsx";
import TopNav from "./components/layout/TopNav.jsx";
import Footer from "./components/layout/Footer.jsx";
import { clearExpiredEsvCache } from "./utils/esv.js";

import ViolentPage from "./pages/ViolentPage.jsx";
import PurposePage from "./pages/PurposePage.jsx";
import LogPage from "./pages/LogPage.jsx";
import CheckInPage from "./pages/CheckInPage.jsx";
import CommunicationSinPage from "./pages/CommunicationSinPage.jsx";
import NeedsPage from "./pages/NeedsPage.jsx";
import PrayerPage from "./pages/PrayerPage.jsx";
import { compactNonviolentGrid } from "./data/compactNonviolentGrid.js";
import CumulativeSinsPage from "./pages/CumulativeSinsPage.jsx";

import { getGrids, getEmotions, getNeeds } from "./utils/masterSelectors.js";
import { getGridPageBackground } from "./utils/pageThemes.js";

import "./App.css";

const GRID_PREF_KEY = "preferredGridMode";

function useHashRoute() {
  const get = () => (window.location.hash || "#/").replace(/^#/, "");
  const [route, setRoute] = useState(get());
  
  useEffect(() => {
    const onHash = () => setRoute(get());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = (hash) => {
    window.location.hash = hash.startsWith("#") ? hash : `#${hash}`;
  };

  return [route, nav];
}

function routeEntryDirection(route) {
  switch (route) {
    case "/grid":
      return "left";
    case "/violent":
      return "top";
    case "/checkin":
      return "bottom";
    case "/prayer":
      return "right";
    case "/needs":
      return "bottom";
    case "/communication-sins":
      return "bottom";
    case "/log":
      return "bottom";
    case "/":
    default:
      return "fade";
  }
}

function PageTransition({ route, children }) {
  const direction = routeEntryDirection(route);

  return (
    <div key={route} className={`pageTransition pageTransition--${direction}`}>
      {children}
    </div>
  );
}

function HomePage({
  goViolent,
  goPurpose,
  goLog,
  goCheckin,
  goCommunication,
  goNeeds,
  goPrayer,
  master,
  showExpandedGrid,
  setShowExpandedGrid,
}) {
  const [selected, setSelected] = useState(null);

  const { nnmGrid } = getGrids(master);
  const { meta } = getEmotions(master);
  const { supplement: needsSupplement } = getNeeds(master);

  const fullGrid = nnmGrid;
  
  const bgStyle = useMemo(() => getGridPageBackground(selected), [selected]);

  const pageStyle = {
    "--text": "#24324a",
    "--muted": "#5f6c88",
    "--card": "rgba(255,255,255,0.78)",
    "--border": "rgba(102, 120, 194, 0.14)",
    "--shadow": "0 14px 34px rgba(108, 124, 196, 0.12)",
    "--btn-bg": "rgba(255,255,255,0.34)",
    "--btn-border": "rgba(102, 120, 194, 0.18)",
    "--btn-text": "rgba(37, 49, 77, 0.94)",
    "--page-bg": "#b9c7f0",
    "--page-bg-gradient": `
      radial-gradient(circle at 22% 22%, rgba(138,164,234,0.28) 0%, transparent 28%),
      radial-gradient(circle at 78% 18%, rgba(185,199,240,0.26) 0%, transparent 30%),
      radial-gradient(circle at 50% 82%, rgba(235,224,210,0.22) 0%, transparent 24%),
      linear-gradient(180deg, #8aa4ea 0%, #b9c7f0 52%, #ebe0d2 100%)
    `,
    ...(bgStyle || {}),
  };

  return (
<div className="container" style={{ ...pageStyle, position: "relative" }}>     
   <div
        className="appShell"
        style={{
    width: "min(1120px, 100%)",
          margin: "0 auto",
        }}
      >
        

        
<div className="panel textOutlineGreen" style={{ width: "100%", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div className="pageMetaRow">
              <div className="pageHeaderTitle" style={{ minWidth: 0, maxWidth: 1120 }}>

                <Header
                  title="I feel like this..."
                  subtitle={
                    <>
                      This tool is for present moment conflict. You can communicate your need while owning your own emotion:
                      <br />
                      When I notice/observe ___, I feel ___ because I need ___.
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
    marginTop: 12
  }}
>
  
              <TopNav
                goHome={goPurpose}
                goViolent={goViolent}
                goCheckin={goCheckin}
                goNeeds={goNeeds}
                goPrayer={goPrayer}
                goCommunication={goCommunication}
                goLog={goLog}
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
        </div>


        <div className="panel textOutlineGreen" style={{ width: "100%", margin: "0 auto", minWidth: 0 }}>
<EmotionGrid
  grid={fullGrid}
  compactOverlay={!showExpandedGrid}
  compactGrid={compactNonviolentGrid}
  compactTileSize={120}
  compactLabelScale={1.18}
  onPick={(value) => {
    setSelected(value);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 80);
  }}
  meta={meta}
  tileSize={78}
  labelScale={1.0}
  axisLabels={{
    tl: "RED (activated)",
    tr: "YELLOW (surprised)",
    bl: "BLUE (low)",
    br: "PURPLE (shame)",
    xNeg: "Lower intensity",
    xPos: "Higher intensity",
    yPos: "Activated",
    yNeg: "Low / heavy",
  }}
/>
        </div>

        <EmotionModal
          open={!!selected}
          onClose={() => setSelected(null)}
          cell={selected}
          mode="blameless"
          master={master}
          meta={meta}
          needsSupplement={needsSupplement}
        />
      </div>
            <Footer />
    </div>
 
);
}

export default function App() {

  const [route, nav] = useHashRoute();

  const [showExpandedGrid, setShowExpandedGrid] = useState(() => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(GRID_PREF_KEY) === "expanded";
  })
  ;

    useEffect(() => {
    clearExpiredEsvCache();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      GRID_PREF_KEY,
      showExpandedGrid ? "expanded" : "compact"
    );
  }, [showExpandedGrid]);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [route]);

  useEffect(() => {
  function handleEscape(e) {
    if (e.key === "Escape") {
      const closeBtn = document.querySelector(".modalHeaderActions .btn");
      if (closeBtn) closeBtn.click();
    }
  }

  window.addEventListener("keydown", handleEscape);

  return () => {
    window.removeEventListener("keydown", handleEscape);
  };
  }, []);

  const { master, loading, error, checkinGrid, checkinMeta, purposeDropdown } = useAppData();
  const { supplement: needsSupplement } = getNeeds(master);

  if (route === "/violent") {
    return (
      <PageTransition route={route}>
        <>
        <ViolentPage
          master={master}
          loading={loading}
          error={error}
          goHome={() => nav("#/")}
          showExpandedGrid={showExpandedGrid}
          setShowExpandedGrid={setShowExpandedGrid}
        />
              <Footer />
      </>
      </PageTransition>
    );
  }

  if (route === "/grid") {
    return (
      <PageTransition route={route}>
        <HomePage
          master={master}
          goViolent={() => nav("#/violent")}
          goPurpose={() => nav("#/")}
          goCheckin={() => nav("#/checkin")}
          goNeeds={() => nav("#/needs")}
          goPrayer={() => nav("#/prayer")}
          goCommunication={() => nav("#/communication-sins")}
          goLog={() => nav("#/log")}
          showExpandedGrid={showExpandedGrid}
          setShowExpandedGrid={setShowExpandedGrid}
        />
      </PageTransition>
    );
  }

  if (route === "/log") {
    return (
      <PageTransition route={route}>
        <>
        <LogPage
          master={master}
          loading={loading}
          error={error}
          goHome={() => nav("#/")}
        />
        <Footer />
        </>
      </PageTransition>
    );
  }

  if (route === "/checkin") {
    return (
      <PageTransition route={route}>
       <>
        <CheckInPage
          goHome={() => nav("#/")}
          checkinGrid={checkinGrid}
          checkinMeta={checkinMeta}
          needsSupplement={needsSupplement}
          loading={loading}
          error={error}
          showExpandedGrid={showExpandedGrid}
          setShowExpandedGrid={setShowExpandedGrid} 
        />
        <Footer />
        </>
      </PageTransition>
    );
  }

  if (route === "/communication-sins") {
    return (
      <PageTransition route={route}>
        <>  
        <CommunicationSinPage goHome={() => nav("#/")} />
      <Footer />
      </>
      </PageTransition>
    );
  }

if (route === "/cumulative-sins") {
  return (
    <PageTransition route={route}>
      <>
        <CumulativeSinsPage
          goHome={() => nav("#/")}
          goCommunication={() => nav("#/communication-sins")}
        />
        <Footer />
      </>
    </PageTransition>
  );
}

  if (route === "/needs") {
    return (
      <PageTransition route={route}>
       <>
        <NeedsPage
          goHome={() => nav("#/")}
          needsSupplement={needsSupplement}
          purposeDropdown={purposeDropdown}
        />
        <Footer />
      </>
      </PageTransition>
    );
  }

  if (route === "/prayer") {
    return (
      <PageTransition route={route}>
       <>
        <PrayerPage
          goHome={() => nav("#/")}
          showExpandedGrid={showExpandedGrid}
          setShowExpandedGrid={setShowExpandedGrid}
        />
        <Footer />
      </>
      </PageTransition>
    );
  }

  return (
    <PageTransition route={route}>
       <>
        <PurposePage
          master={master}
          loading={loading}
          error={error}
          purposeDropdown={purposeDropdown}
          goHome={() => nav("#/")}
        goGrid={() => nav("#/grid")}
        goViolent={() => nav("#/violent")}
        goCheckin={() => nav("#/checkin")}
        goNeeds={() => nav("#/needs")}
        goPrayer={() => nav("#/prayer")}
        goLog={() => nav("#/log")}
        goCommunication={() => nav("#/communication-sins")}
      />
      <Footer />
      </>
    </PageTransition>
  
);
}