export default function Select({ value, onChange, placeholder, options = [] }) {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",

          borderRadius: 14,
          padding: "12px 46px 12px 14px",
          border: "1px solid rgba(255,255,255,0.16)",

          background: `
            linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05)),
            rgba(0,0,0,0.24)
          `,
          color: "rgba(255,255,255,0.96)",
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.35,

          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 18px rgba(0,0,0,0.16)",

          outline: "none",
          cursor: "pointer",
          transition:
            "border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)";
          e.currentTarget.style.boxShadow =
            "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 3px rgba(255,255,255,0.08), 0 10px 22px rgba(0,0,0,0.18)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
          e.currentTarget.style.boxShadow =
            "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 18px rgba(0,0,0,0.16)";
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "rgba(255,255,255,0.74)",
          fontSize: 15,
          lineHeight: 1,
        }}
      >
        ▾
      </div>
    </div>
  );
}