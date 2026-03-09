function chipStyle(active) {
  return {
    border: active
      ? "1px solid rgba(255,255,255,0.26)"
      : "1px solid rgba(255,255,255,0.12)",
    background: active
      ? "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))"
      : "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: active ? 800 : 700,
    color: active ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.90)",
    cursor: "pointer",
    userSelect: "none",
    boxShadow: active
      ? "0 8px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 4px 10px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.04)",
    transition:
      "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease",
  };
}

export default function Chips({ items = [], value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((n) => {
        const v = String(n);
        const active = v === String(value);

        return (
          <span
            key={v}
            style={chipStyle(active)}
            onClick={() => onChange(v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onChange(v);
            }}
            onMouseEnter={(e) => {
              if (active) return;
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={(e) => {
              if (active) return;
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            {v}
          </span>
        );
      })}
    </div>
  );
}