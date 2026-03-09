// src/components/TopNav.jsx

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
  return (
    <div
      style={{
        display: "flex",
        fontSize: 22,
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
        "--btn-bg": "rgba(24, 16, 18, 0.78)",
        "--btn-border": "rgba(255,255,255,0.14)",
        "--btn-text": "rgba(255,255,255,0.96)",
      }}
    >
      {goHome && <button className="btn" onClick={goHome}>Back to the Homepage</button>}
      {goGrid && <button className="btn" onClick={goGrid}>I want to express my need respectfully</button>}
      {goViolent && <button className="btn" onClick={goViolent}>I feel accusatory</button>}
      {goCheckin && <button className="btn" onClick={goCheckin}>Positive Check-In / I am grateful</button>}
      {goNeeds && <button className="btn" onClick={goNeeds}>Needs and theology</button>}
      {goPrayer && <button className="btn" onClick={goPrayer}>Emotional prayer</button>}
      {goCommunication && <button className="btn" onClick={goCommunication}>Communication and repair</button>}
      {goLog && <button className="btn" onClick={goLog}>View past reflections</button>}
      {onExport && <button className="btn" onClick={onExport}>Export</button>}
    </div>
  );
}
