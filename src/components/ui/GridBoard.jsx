// src/components/ui/GridBoard.jsx
export default function GridBoard({ grid = [], onPick }) {
  // Expect grid cells in the same format as EmotionGrid: [{x,y,emotion}]
  const map = new Map((grid || []).map((c) => [`${c.x},${c.y}`, c]));

  const coords = [];
  for (let y = 7; y >= -7; y--) {
    for (let x = -7; x <= 7; x++) coords.push({ x, y });
  }

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

        return (
          <button
            key={`${x},${y}`}
            disabled={isEmpty}
            onClick={() => cell && onPick?.(cell)}
            style={{
              aspectRatio: "1 / 1",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.14)",
              background: isEmpty ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.08)",
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
            }}
            title={label || ""}
          >
            {label || "—"}
          </button>
        );
      })}
    </div>
  );
}