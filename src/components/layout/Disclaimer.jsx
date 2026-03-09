export default function Disclaimer({ title = "Disclaimer", variant = "footer" }) {
  const body = (
    <>
      This tool is for emotional awareness and communication support. It is not a clinical diagnostic
      tool and does not determine intent or abuse. For relational or mental health concerns, consult
      qualified pastoral or licensed professionals.
      <br />
      Naming a need does not remove personal responsibility for behavior.
    </>
  );

  // Footer style (small, subtle)
  if (variant === "footer") {
    return (
      <div className="panel" style={{ color: "rgba(21, 17, 17, 0.68)", marginTop: 12 }}>
        <div className="smallMuted" style={{ color: "rgba(21, 17, 17, 0.68)", lineHeight: 1.45 }}>
          {body}
        </div>
      </div>
    );
  }

  // Card style (for About/Purpose page)
  return (
    <div className="panel">
      <div style={{color: "rgba(21, 17, 17, 0.68)", display: "grid", gap: 10 }}>
        <div style={{ color: "rgba(21, 17, 17, 0.68)", fontWeight: 700 }}>{title}</div>
        <div className="smallMuted" style={{ color: "rgba(21, 17, 17, 0.68)", lineHeight: 1.5 }}>
          {body}
        </div>
      </div>
    </div>
  );
}