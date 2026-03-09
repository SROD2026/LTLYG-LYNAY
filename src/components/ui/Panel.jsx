export default function Panel({ title, children, style = {}, className = "" }) {
  return (
    <div
      className={className}
      style={{
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 16,
        padding: 14,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
        display: "grid",
        gap: 12,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 24px rgba(0,0,0,0.10)",
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            lineHeight: 1.18,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
      ) : null}

      {children ? (
        <div
          style={{
            fontSize: 16,
            display: "grid",
            gap: 12,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}