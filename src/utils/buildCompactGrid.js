export function buildCompactGrid({
  sourceGrid,
  keepWords,
  size = 9,
}) {
  const cells = Array.isArray(sourceGrid) ? sourceGrid : [];

  const kept = cells.filter((cell) => {
    const word = String(cell?.emotion || cell?.word || "").trim();
    return keepWords.includes(word);
  });

  const coords = [];
  const half = Math.floor(size / 2);

  for (let y = half; y >= -half; y -= 1) {
    for (let x = -half; x <= half; x += 1) {
      coords.push({ x, y });
    }
  }

  return kept.slice(0, coords.length).map((cell, idx) => ({
    ...cell,
    x: coords[idx].x,
    y: coords[idx].y,
  }));
}