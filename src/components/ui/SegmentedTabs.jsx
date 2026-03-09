export default function SegmentedTabs({ value, onChange, options = [] }) {
  return (
    <div
      style={{
        display: "inline-flex",
        padding: 4,
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: 16,
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 18px rgba(0,0,0,0.14)",
        gap: 4,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            style={{
              padding: "10px 14px",
              border: "none",
              borderRadius: 12,
              background: active
                ? "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))"
                : "transparent",
              color: active
                ? "rgba(255,255,255,0.98)"
                : "rgba(255,255,255,0.84)",
              cursor: "pointer",
              fontWeight: active ? 800 : 700,
              fontSize: 14,
              transition:
                "background 140ms ease, color 140ms ease, transform 140ms ease, box-shadow 140ms ease",
              boxShadow: active
                ? "0 8px 16px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "none",
            }}
            onMouseEnter={(e) => {
              if (active) return;
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "rgba(255,255,255,0.94)";
            }}
            onMouseLeave={(e) => {
              if (active) return;
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.84)";
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}