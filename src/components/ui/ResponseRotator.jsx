import { useEffect, useMemo, useState } from "react";

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map((x) => String(x ?? "").trim()).filter(Boolean);
}

export default function ResponseRotator({
  items = [],
  buttonLabel = "Another response",
  emptyLabel = "No response available.",
  style = {},
}) {
  const normalized = useMemo(() => normalizeItems(items), [items]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [normalized.join("||")]);

  if (!normalized.length) {
    return (
      <div style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.82, ...style }}>
        {emptyLabel}
      </div>
    );
  }

  const current = normalized[index % normalized.length];
  const canCycle = normalized.length > 1;

  return (
    <div style={{ display: "grid", gap: 10, ...style }}>
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.55,
          padding: "12px 14px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.05)",
        }}
      >
        {current}
      </div>

      {canCycle ? (
        <div>
          <button
            type="button"
            className="btn"
            onClick={() => setIndex((i) => (i + 1) % normalized.length)}
          >
            {buttonLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}