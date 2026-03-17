// src/components/layout/TopNav.jsx
import { useMemo } from "react";
import { getTopNavTone } from "../../utils/pageThemes.js";

function itemStyle(targetKey, isMobile = false) {
  const tone = getTopNavTone(targetKey);

  return {
    borderRadius: isMobile ? 10 : 14,
    whiteSpace: "nowrap",
    fontSize: isMobile ? 11 : 14,
    padding: isMobile ? "6px 10px" : "6px 10px",
    minHeight: isMobile ? 34 : undefined,
    borderColor: tone.border,
    color: tone.text,
    marginTop: 6,
    background: `
      linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.06)),
      ${tone.bg}
    `,
    boxShadow: tone.shadow,
    width: isMobile ? "100%" : undefined,
  };
}

export default function TopNav({
  goHome,
  goGrid,
  goViolent,
  goCheckin,
  goPrayer,
  goNeeds,
  goCommunication,
  goLog,
  onExport,
  onToggleExpanded,
  expanded,
}) {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 760px)").matches;

  const hash = typeof window !== "undefined" ? window.location.hash || "#/" : "#/";
  const isGridPage =
    hash.startsWith("#/grid") ||
    hash.startsWith("#/violent") ||
    hash.startsWith("#/prayer") ||
    hash.startsWith("#/checkin");

  const items = useMemo(
    () =>
      [
        goHome && {
          key: "home",
          label: isMobile ? "Home" : "Back to the Homepage",
          onClick: goHome,
        },
        goGrid && {
          key: "grid",
          label: isMobile ? "Respectful" : "Express need respectfully",
          onClick: goGrid,
        },
        goViolent && {
          key: "violent",
          label: isMobile ? "Accusatory" : "I feel accusatory",
          onClick: goViolent,
        },
        goCheckin && {
          key: "checkin",
          label: isMobile ? "Gratitude" : "Positive Check-In / Gratitude",
          onClick: goCheckin,
        },
        goPrayer && {
          key: "prayer",
          label: isMobile ? "Prayer" : "Emotional prayer",
          onClick: goPrayer,
        },
        goNeeds && {
          key: "needs",
          label: isMobile ? "Needs" : "Needs and theology",
          onClick: goNeeds,
        },
        goCommunication && {
          key: "communication",
          label: isMobile ? "Repair" : "Communication and repair",
          onClick: goCommunication,
        },
        goLog && {
          key: "log",
          label: isMobile ? "Log" : "View past reflections",
          onClick: goLog,
        },
        onExport && {
          key: "export",
          label: "Export",
          onClick: onExport,
        },
      ].filter(Boolean),
    [
      goHome,
      goGrid,
      goViolent,
      goCheckin,
      goPrayer,
      goNeeds,
      goCommunication,
      goLog,
      onExport,
      isMobile,
    ]
  );

  return (
    <div
      className={`topNav ${isMobile ? "topNav--mobile" : "topNav--desktop"}`}
      style={
        isMobile
          ? {
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 6,
              width: "100%",
            }
          : {
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              width: "100%",
              alignItems: "center",
              overflow: "visible",
            }
      }
    >
      {items.map((item) => (
        <button
          key={item.key}
          className="btn topNav__btn"
          onClick={item.onClick}
          type="button"
          style={itemStyle(item.key, isMobile)}
        >
          {item.label}
        </button>
      ))}

      {isGridPage && onToggleExpanded ? (
  <button
    className="btn topNav__btn"
    onClick={onToggleExpanded}
    type="button"
    style={{
      ...itemStyle("grid", isMobile),
      fontWeight: 800,
      opacity: 1,
      backgroundColor: expanded ? "rgba(255,255,255,0.18)" : undefined,
    }}
  >
    {expanded ? "Compact Grid" : "Expanded Grid"}
  </button>
) : null}

    </div>
  );
}
