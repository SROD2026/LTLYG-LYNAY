// src/components/layout/TopNav.jsx
import { useMemo } from "react";
import { getTopNavTone } from "../../utils/pageThemes.js";

function itemStyle(targetKey) {
  const tone = getTopNavTone(targetKey);

  return {
    borderRadius: 14,
    whiteSpace: "nowrap",
    fontSize: 14,
    padding: "10px 14px",
    borderColor: tone.border,
    color: tone.text,
    background: `
      linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.06)),
      ${tone.bg}
    `,
    boxShadow: tone.shadow,
  };
}

export default function TopNav({
  goHome,
  goGrid,
  goViolent,
  goCheckin,
  goNeeds,
  goPrayer,
  goCommunication,
  goLog,
  onExport,
}) {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 760px)").matches;

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
        goNeeds && {
          key: "needs",
          label: isMobile ? "Needs" : "Needs and theology",
          onClick: goNeeds,
        },
        goPrayer && {
          key: "prayer",
          label: isMobile ? "Prayer" : "Emotional prayer",
          onClick: goPrayer,
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
    [goHome, goGrid, goViolent, goCheckin, goNeeds, goPrayer, goCommunication, goLog, onExport, isMobile]
  );

  return (
    <div className={`topNav ${isMobile ? "topNav--mobile" : "topNav--desktop"}`}>
      {items.map((item) => (
        <button
          key={item.label}
          className="btn topNav__btn"
          onClick={item.onClick}
          type="button"
          style={itemStyle(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}