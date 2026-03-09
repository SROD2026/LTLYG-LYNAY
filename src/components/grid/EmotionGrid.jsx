// src/components/EmotionGrid.jsx
import { useEffect, useRef, useState } from "react";
import { cellColor } from "../../utils/color.js";


function fontForLabel(label, tileSize = 92) {
  const s = String(label || "").trim();
  if (!s) return 14;

  const words = s.split(/\s+/).filter(Boolean);
  const longest = words.reduce((m, w) => Math.max(m, w.length), 0);
  const chars = s.length;

  // base size tied to tile size
  let size = tileSize * 0.18;

  // reduce based on long words first
  if (longest >= 18) size *= 0.52;
  else if (longest >= 16) size *= 0.58;
  else if (longest >= 14) size *= 0.66;
  else if (longest >= 12) size *= 0.74;
  else if (longest >= 10) size *= 0.82;
  else if (longest >= 8) size *= 0.9;

  // reduce based on total character count
  if (chars >= 34) size *= 0.72;
  else if (chars >= 30) size *= 0.78;
  else if (chars >= 26) size *= 0.84;
  else if (chars >= 22) size *= 0.9;
  else if (chars >= 18) size *= 0.96;

  // clamp to a readable range
  size = Math.max(8, Math.min(size, 18));

  return Math.round(size * 10) / 10;
}

function setTileVisualState(target, state, hoverTransform, activeTransform) {
  if (!target) return;

  if (state === "hover") {
    target.style.transform = hoverTransform;
    target.style.boxShadow =
      "inset 0 0 10px rgba(0,0,0,0.18), 0 18px 34px rgba(0,0,0,0.34)";
    target.style.filter = "brightness(1.08) saturate(1.08)";
    target.style.borderColor = "rgba(255,255,255,0.34)";
    target.style.zIndex = "3";
    return;
  }

  if (state === "active") {
    target.style.transform = activeTransform;
    target.style.boxShadow =
      "inset 0 0 10px rgba(0,0,0,0.20), 0 10px 20px rgba(0,0,0,0.28)";
filter: "brightness(1.08) saturate(1.18)",
    target.style.borderColor = "rgba(255,255,255,0.30)";
    target.style.zIndex = "3";
    return;
  }

  target.style.transform = "translateY(0) scale(1)";
  target.style.boxShadow =
    "inset 0 0 6px rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.22)";
  target.style.filter = "brightness(1) saturate(1)";
  target.style.borderColor = "rgba(255,255,255,0.14)";
  target.style.zIndex = "0";
}

function isMobileLikeViewport() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 640px), (pointer: coarse)").matches;
}

function visualStateForTile({ isEmpty, isHovered, isPressed, isCentered }) {
  if (isEmpty) {
    return {
  transform: "translateY(0) scale(1)",
  boxShadow: "inset 0 0 3px rgba(255,255,255,0.06), 0 6px 16px rgba(0,0,0,0.16)",
  filter: "brightness(1.04) saturate(1.16)",
  borderColor: "rgba(255,255,255,0.16)",
  zIndex: 0,
};
  }

  if (isPressed) {
    return {
      transform: "translateY(-2px) scale(1.04)",
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.20), 0 10px 20px rgba(0,0,0,0.28)",
      filter: "brightness(1.05) saturate(1.05)",
      borderColor: "rgba(255,255,255,0.30)",
      zIndex: 4,
    };
  }

  if (isHovered || isCentered) {
    return {
      transform: "translateY(-6px) scale(1.08)",
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.18), 0 18px 34px rgba(0,0,0,0.34)",
filter: "brightness(1.10) saturate(1.22)",
      borderColor: "rgba(255,255,255,0.34)",
      zIndex: 3,
    };
  }

  return {
    transform: "translateY(0) scale(1)",
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.22)",
    filter: "brightness(1) saturate(1)",
    borderColor: "rgba(255,255,255,0.14)",
    zIndex: 0,
  };
}

/**
 * Keeps ORIGINAL 15×15 coordinate layout (x,y in -7..7).
 * - Axis tiles (x=0 or y=0) are NOT rendered as buttons; they become empty spacers.
 * - Cross lines are drawn as an overlay so they can be thick without shifting coordinates.
 * - Optional labels are rendered OUTSIDE the grid (no overlap).
 */
export default function EmotionGrid({
  grid = [],
  onPick,
  axisLabels,
  colorFn = cellColor,
  meta = {},
}) {
  
  const map = new Map(grid.map((c) => [`${c.x},${c.y}`, c]));
  const rootRef = useRef(null);

  const [hoveredKey, setHoveredKey] = useState("");
  const [pressedKey, setPressedKey] = useState("");
  const [centeredKey, setCenteredKey] = useState("");
    const previewTimerRef = useRef(null);

  const [previewKey, setPreviewKey] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  const coords = [];
  for (let y = 7; y >= -7; y--) {
    for (let x = -7; x <= 7; x++) coords.push({ x, y });
  }

  const COLS = 15;
  const ROWS = 15;
  const GAP = 5;
  const TILE = 82;
  const PAD = 10;
  const CROSS_THICKNESS = 10;
      const HOVER_TRANSFORM = "translateY(-6px) scale(1.08)";
  const ACTIVE_TRANSFORM = "translateY(-2px) scale(1.04)";
  const BASE_TRANSITION =
    "transform 150ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 150ms ease, filter 150ms ease, border-color 150ms ease";

  const boardWidth = COLS * TILE + (COLS - 1) * GAP + PAD * 2;
  const boardHeight = ROWS * TILE + (ROWS - 1) * GAP + PAD * 2;

    const centeredCell = centeredKey ? map.get(centeredKey) || null : null;

  const previewEmotion = centeredCell?.emotion || "";
  const previewDefinition =
    (centeredCell?.emotion &&
      (meta?.[centeredCell.emotion]?.definition ||
        meta?.[String(centeredCell.emotion).toLowerCase()]?.definition)) ||
    "";
    // On mobile-like screens, open the scroller centered on the middle cross
  useEffect(() => {
    if (!isMobileLikeViewport()) return;
    if (!rootRef.current) return;

    const scroller = rootRef.current.closest(".gridScroll");
    if (!scroller) return;

    requestAnimationFrame(() => {
      const left = Math.max(0, (boardWidth - scroller.clientWidth) / 2);
      const top = Math.max(0, (boardHeight - scroller.clientHeight) / 2);
      scroller.scrollTo({ left, top, behavior: "auto" });
    });
  }, [boardWidth, boardHeight]);

  // Mobile center-targeting: whichever tile is under screen center gets the hover state
  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;

    const updateCenteredCell = () => {
      rafId = 0;

      if (!isMobileLikeViewport() || !rootRef.current) {
        setCenteredKey("");
        return;
      }


      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const hit = document
        .elementsFromPoint(centerX, centerY)
        .find((el) => {
          return (
            el instanceof HTMLElement &&
            el.dataset.gridCell === "true" &&
            el.closest(".emotionGridRoot") === rootRef.current
          );
        });
      const nextKey = hit ? `${hit.dataset.x},${hit.dataset.y}` : "";

      setCenteredKey((prev) => {
        if (prev !== nextKey) {
          setPreviewVisible(false);
          setPreviewKey("");
        }
        return prev === nextKey ? prev : nextKey;
      });
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateCenteredCell);
    };

    const scrollContainers = Array.from(document.querySelectorAll(".gridScroll"));

    scheduleUpdate();

    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
    window.addEventListener("touchmove", scheduleUpdate, { passive: true });
    window.addEventListener("touchend", scheduleUpdate, { passive: true });

    scrollContainers.forEach((el) => {
      el.addEventListener("scroll", scheduleUpdate, { passive: true });
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
      window.removeEventListener("touchmove", scheduleUpdate);
      window.removeEventListener("touchend", scheduleUpdate);

      scrollContainers.forEach((el) => {
        el.removeEventListener("scroll", scheduleUpdate);
      });
    };
  }, []);


    // Show preview only after the same centered tile stays under the reticle for 500ms
  useEffect(() => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }

    setPreviewVisible(false);

    if (!centeredKey || !centeredCell || !isMobileLikeViewport()) {
      setPreviewKey("");
      return;
    }

    previewTimerRef.current = setTimeout(() => {
      setPreviewKey(centeredKey);
      setPreviewVisible(true);
    }, 500);

    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
        previewTimerRef.current = null;
      }
    };
  }, [centeredKey, centeredCell]);

    useEffect(() => {
    if (pressedKey) {
      setPreviewVisible(false);
    }
  }, [pressedKey]);


  return (
    <div
      ref={rootRef}
      className="emotionGridRoot"
      style={{
        display: "grid",
        gap: 10,
        width: "fit-content",
        position: "relative",
      }}
    >
            <div className="gridViewportGuide" aria-hidden="true">
        <div className="gridViewportGuide__ring" />
        <div className="gridViewportGuide__dot" />
      </div>
            {previewVisible && previewKey === centeredKey && centeredCell ? (
        <div className="gridPreviewPopup" role="status" aria-live="polite">
          <div className="gridPreviewPopup__title">{previewEmotion}</div>

          {previewDefinition ? (
            <div className="gridPreviewPopup__definition">{previewDefinition}</div>
          ) : (
            <div className="gridPreviewPopup__definition">
              No definition available yet for this emotion.
            </div>
          )}

          <button
            type="button"
            className="gridPreviewPopup__button"
            onClick={() => onPick?.(centeredCell)}
          >
            Choose
          </button>
        </div>
      ) : null}

      <div className="gridViewportGuide" aria-hidden="true">
        <div className="gridViewportGuide__ring" />
        <div className="gridViewportGuide__dot" />
      </div>
      
            <div className="gridViewportGuide" aria-hidden="true">
        <div className="gridViewportGuide__ring" />
        <div className="gridViewportGuide__dot" />
      </div>
            {axisLabels ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            fontSize: 18,
fontWeight: 900,
letterSpacing: "-0.02em",
color: "#ffffff",
textShadow: "0 1px 4px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ textAlign: "left" }}>{axisLabels.tl || ""}</div>
          <div style={{ textAlign: "right" }}>{axisLabels.tr || ""}</div>
        </div>
      ) : null}

      <div style={{ position: "relative" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            padding: 4,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 6,
              bottom: 6,
              left: `calc(50% - ${CROSS_THICKNESS / 2}px)`,
              width: CROSS_THICKNESS,
              borderRadius: 999,
              background: "rgba(0,0,0,0.35)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.10), 0 10px 22px rgba(0,0,0,0.35)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 6,
              right: 6,
              top: `calc(50% - ${CROSS_THICKNESS / 2}px)`,
              height: CROSS_THICKNESS,
              borderRadius: 999,
              background: "rgba(0,0,0,0.35)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.10), 0 10px 22px rgba(0,0,0,0.35)",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 50,
              height: 50,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(0,0,0,0.28)",
              display: "grid",
              placeItems: "center",
              fontWeight: 1000,
              color: "rgba(255,255,255,0.88)",
              boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
            }}
          >
            ✝
          </div>
        </div>

                <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${TILE}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${TILE}px)`,
            gap: GAP,
            padding: PAD,
            boxSizing: "border-box",
            width: boardWidth,
            minWidth: boardWidth,
            height: boardHeight,
            minHeight: boardHeight,
          }}
        >
          {coords.map(({ x, y }) => {
            const key = `${x},${y}`;

            if (x === 0 || y === 0) {
              return (
                <div
                  key={key}
                  aria-hidden="true"
                  style={{
                    width: TILE,
                    height: TILE,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "transparent",
                    boxShadow: "none",
                  }}
                />
              );
            }

            const cell = map.get(key);
            const label = cell?.emotion ?? "";
            const labelFont = fontForLabel(label);
            const isEmpty = !cell;
            const hasSpace = String(label || "").includes(" ");
            const textColor = "#ffffff";
            const textGlow = "none";
            const hoverable = !isEmpty;   return (
                                       <button
                key={key}
                disabled={isEmpty}
                onClick={() => cell && onPick(cell)}
                onMouseEnter={() => {
                  if (!hoverable) return;
                  setHoveredKey(key);
                }}
                onMouseLeave={() => {
                  if (!hoverable) return;
                  setHoveredKey((prev) => (prev === key ? "" : prev));
                  setPressedKey((prev) => (prev === key ? "" : prev));
                }}
                onMouseDown={() => {
                  if (!hoverable) return;
                  setPressedKey(key);
                }}
                onMouseUp={() => {
                  if (!hoverable) return;
                  setPressedKey((prev) => (prev === key ? "" : prev));
                }}
                onTouchStart={() => {
                  if (!hoverable) return;
                  setPressedKey(key);
                }}
                onTouchEnd={() => {
                  if (!hoverable) return;
                  setPressedKey((prev) => (prev === key ? "" : prev));
                }}
                onTouchCancel={() => {
                  if (!hoverable) return;
                  setPressedKey((prev) => (prev === key ? "" : prev));
                }}
                title={label || ""}
                data-grid-cell={hoverable ? "true" : "false"}
                data-x={x}
                data-y={y}
                data-emotion={label || ""}
                style={{
                  width: TILE,
                  height: TILE,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
background: `
  linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)),
  radial-gradient(circle at 30% 22%, rgba(255,255,255,0.18), transparent 42%),
  ${colorFn(x, y)}
`,                  color: "#ffffff",
                  padding: 6,
                  fontSize: `${fontForLabel(label, TILE)}px`,
                  overflow: "visible",
                  minWidth: 0,
                  display: "grid",
                  placeItems: "center",
                  cursor: isEmpty ? "default" : "pointer",
                  WebkitTapHighlightColor: "transparent",
                  transition:
                    "transform 150ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 150ms ease, filter 150ms ease, border-color 150ms ease",
                  transformOrigin: "center",
                  position: "relative",
                  touchAction: "manipulation",
                  ...visualStateForTile({
                    isEmpty,
                    isHovered: hoveredKey === key,
                    isPressed: pressedKey === key,
                    isCentered: centeredKey === key,
                  }),
                }}
              >


                <div
                  style={{
                    opacity: isEmpty ? 0.4 : 1,
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    fontWeight: 900,
                    padding: "2px",
                    textAlign: "center",
                    whiteSpace: "normal",
                    lineHeight: 1.02,
                    letterSpacing: "-0.015em",
color: textColor,
                    textShadow:
                      hoveredKey === key || pressedKey === key || centeredKey === key
                        ? "0 1px 2px rgba(0,0,0,0.25), 0 0 10px rgba(255,255,255,0.18)"
                        : "0 1px 2px rgba(0,0,0,0.25)",
                        
                        display: hasSpace ? "-webkit-box" : "block",
                    WebkitBoxOrient: hasSpace ? "vertical" : undefined,
                    WebkitLineClamp: hasSpace ? 4 : undefined,
                    overflow: "hidden",
                    overflowWrap: "normal",
                    wordBreak: "keep-all",
                    hyphens: "none",
                    alignContent: "center",
                  }}>
                  {label || "—"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {axisLabels ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            fontSize: 18,
fontWeight: 900,
letterSpacing: "-0.02em",
color: "#ffffff",
textShadow: "0 1px 4px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ textAlign: "left" }}>{axisLabels.bl || ""}</div>
          <div style={{ textAlign: "right" }}>{axisLabels.br || ""}</div>
        </div>
      ) : null}

      {axisLabels?.xNeg || axisLabels?.xPos ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            fontSize: 18,
fontWeight: 900,
letterSpacing: "-0.02em",
color: "#ffffff",
textShadow: "0 1px 4px rgba(0,0,0,0.45)",}}
        >
          <div>{axisLabels.xNeg || ""}</div>
          <div>{axisLabels.xPos || ""}</div>
        </div>
      ) : null}
    </div>
  );
}