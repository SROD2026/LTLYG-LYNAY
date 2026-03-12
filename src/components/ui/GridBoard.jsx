// src/components/ui/GridBoard.jsx
import { useEffect, useMemo, useRef, useState } from "react";

export default function GridBoard({ grid = [], onPick }) {
  const map = useMemo(
    () => new Map((grid || []).map((c) => [`${c.x},${c.y}`, c])),
    [grid]
  );

  const coords = [];
  for (let y = 7; y >= -7; y--) {
    for (let x = -7; x <= 7; x++) coords.push({ x, y });
  }

  const [armedKey, setArmedKey] = useState("");
  const timeoutRef = useRef(null);

  function clearArmed() {
    setArmedKey("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function armCell(key) {
    setArmedKey(key);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setArmedKey("");
      timeoutRef.current = null;
    }, 5000);
  }

  function handleCellPress(cell) {
    if (!cell) return;

    const key = `${cell.x},${cell.y}`;

    if (armedKey === key) {
      clearArmed();
      onPick?.(cell);
      return;
    }

    armCell(key);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(15, minmax(48px, 1fr))",
        gap: 8,
        padding: 6,
        boxSizing: "border-box",
        minWidth: 15 * 56,
      }}
    >
      {coords.map(({ x, y }) => {
        const cell = map.get(`${x},${y}`);
        const label = cell?.emotion ?? "";
        const isEmpty = !cell;
        const key = `${x},${y}`;
        const isArmed = armedKey === key;

        return (
          <button
            key={key}
            disabled={isEmpty}
            onClick={() => handleCellPress(cell)}
            style={{
              aspectRatio: "1 / 1",
              borderRadius: 14,
              border: isArmed
                ? "2px solid rgba(255,255,255,0.90)"
                : "1px solid rgba(255,255,255,0.14)",
              background: isEmpty
                ? "rgba(255,255,255,0.03)"
                : isArmed
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.92)",
              padding: 6,
              fontSize: 12,
              lineHeight: 1.05,
              textAlign: "center",
              overflow: "hidden",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isEmpty ? "default" : "pointer",
              WebkitTapHighlightColor: "transparent",
              boxShadow: isArmed
                ? "0 0 0 2px rgba(255,255,255,0.18), 0 8px 18px rgba(0,0,0,0.20)"
                : "none",
              transition:
                "background 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
            }}
            title={
              label
                ? isArmed
                  ? `${label} — tap again to open`
                  : label
                : ""
            }
          >
            {label || "—"}
          </button>
        );
      })}
    </div>
  );
}