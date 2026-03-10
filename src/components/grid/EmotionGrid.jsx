// src/components/grid/EmotionGrid.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cellColor } from "../../utils/color.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function isMobileLikeViewport() {
  if (typeof window === "undefined") return false;

const touch =
  ("ontouchstart" in window) ||
  (navigator.maxTouchPoints || 0) > 0 ||
  (navigator.msMaxTouchPoints || 0) > 0;

  const smallScreen = window.innerWidth <= 760;

  return touch || smallScreen;
}

function fontForLabel(label, tileSize = 92) {
  const s = String(label || "").trim();
  if (!s) return 14;

  const words = s.split(/\s+/).filter(Boolean);
  const longest = words.reduce((m, w) => Math.max(m, w.length), 0);
  const chars = s.length;

  let size = tileSize * 0.18;
  if (longest >= 18) size *= 0.52;
  else if (longest >= 16) size *= 0.58;
  else if (longest >= 14) size *= 0.66;
  else if (longest >= 12) size *= 0.74;
  else if (longest >= 10) size *= 0.82;
  else if (longest >= 8) size *= 0.9;

  if (chars >= 34) size *= 0.72;
  else if (chars >= 30) size *= 0.78;
  else if (chars >= 26) size *= 0.84;
  else if (chars >= 22) size *= 0.9;
  else if (chars >= 18) size *= 0.96;

  return Math.round(clamp(size, 8, 21) * 10) / 10;
}

export default function EmotionGrid({
  grid = [],
  onPick,
  axisLabels,
  colorFn = cellColor,
  meta = {},
  tileSize = 82,
  labelScale = 1,
}) {

  const map = useMemo(() => new Map(grid.map((c) => [`${c.x},${c.y}`, c])), [grid]);
  const rootRef = useRef(null);
const boardRef = useRef(null);

  const [mobile, setMobile] = useState(isMobileLikeViewport);
  const [hoveredKey, setHoveredKey] = useState("");
  const [pressedKey, setPressedKey] = useState("");
  const [touchArmedKey, setTouchArmedKey] = useState("");
const touchArmTimerRef = useRef(null);
const [fitScale, setFitScale] = useState(null);


  const coords = [];
  for (let y = 7; y >= -7; y--) {
    for (let x = -7; x <= 7; x++) coords.push({ x, y });
  }

const COLS = 15;
const ROWS = 15;

const MOBILE_TILE = Math.min(tileSize, 74);
const TILE = mobile ? MOBILE_TILE : tileSize;

const GAP = mobile ? 3 : 5;
const PAD = mobile ? 6 : 10;
const CROSS_THICKNESS = mobile ? 7 : 10;

const boardWidth = COLS * TILE + (COLS - 1) * GAP + PAD * 2;
const boardHeight = ROWS * TILE + (ROWS - 1) * GAP + PAD * 2;


  useEffect(() => {
    const updateViewport = () => setMobile(isMobileLikeViewport());
    updateViewport();
    window.addEventListener("resize", updateViewport, { passive: true });
    window.addEventListener("orientationchange", updateViewport, { passive: true });
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

useEffect(() => {
  return () => {
    if (touchArmTimerRef.current) {
      clearTimeout(touchArmTimerRef.current);
    }
  };
}, []);
  
useLayoutEffect(() => {
  let frame = 0;

  const updateScale = () => {
    if (typeof window === "undefined") return;

const rootWidth =
  rootRef.current?.clientWidth ||
  Math.max(180, window.innerWidth - 20);

const availableWidth = Math.max(180, rootWidth - (mobile ? 4 : 8));
const minScale = mobile ? 0.34 : 0.72;


    const rawScale = clamp(availableWidth / boardWidth, minScale, 1);
    const nextScale = Math.round(rawScale * 1000) / 1000;

    setFitScale((prev) => {
      if (prev != null && Math.abs(prev - nextScale) < 0.015) return prev;
      return nextScale;
    });
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(updateScale);
  };

  updateScale();

  let ro = null;
  if (typeof ResizeObserver !== "undefined" && rootRef.current) {
    ro = new ResizeObserver(() => {
      scheduleUpdate();
    });
    ro.observe(rootRef.current);
  }

  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleUpdate, { passive: true });


  return () => {
    cancelAnimationFrame(frame);
    if (ro) ro.disconnect();
    window.removeEventListener("resize", scheduleUpdate);
    window.removeEventListener("orientationchange", scheduleUpdate);
  };
}, [mobile, boardWidth]);

function handleTileActivate(cell, key) {
  if (!cell) return;

  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  if (!isTouch) {
    onPick?.(cell);
    return;
  }

  if (touchArmedKey === key) {
    if (touchArmTimerRef.current) clearTimeout(touchArmTimerRef.current);
    touchArmTimerRef.current = null;
    setTouchArmedKey("");
    onPick?.(cell);
    return;
  }

  setTouchArmedKey(key);

  if (touchArmTimerRef.current) clearTimeout(touchArmTimerRef.current);
  touchArmTimerRef.current = setTimeout(() => {
    setTouchArmedKey((prev) => (prev === key ? "" : prev));
    touchArmTimerRef.current = null;
  }, 700);
}


const scale = fitScale ?? 1;
const fittedWidth = boardWidth * scale;
const fittedHeight = boardHeight * scale;

  return (
    <div
      ref={rootRef}
      className={`emotionGridRoot ${mobile ? "emotionGridRoot--mobile" : "emotionGridRoot--desktop"}`}
      style={{
  display: "grid",
  gap: mobile ? 8 : 10,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  position: "relative",
  overflowX: "visible",
}}>
      
      {axisLabels ? (
        <div className="gridAxisLabels gridAxisLabels--top">
          <div style={{ textAlign: "left" }}>{axisLabels.tl || ""}</div>
          <div style={{ textAlign: "right" }}>{axisLabels.tr || ""}</div>
        </div>
      ) : null}

      <div
  style={{
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: fittedHeight,
    minHeight: fittedHeight,
    overflow: "visible",
    minWidth: 0,
  }}
>
  
  <div
    style={{
      position: "relative",
      width: fittedWidth,
      height: fittedHeight,
margin: "0 auto",  }}
  >
    <div
      aria-hidden="true"
      className="gridCrossOverlay"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        width: fittedWidth,
        height: fittedHeight,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 6 * scale,
          bottom: 6 * scale,
          left: `calc(50% - ${(CROSS_THICKNESS * scale) / 2}px)`,
          width: CROSS_THICKNESS * scale,
          borderRadius: 999,
          background: "rgba(0,0,0,0.35)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10), 0 10px 22px rgba(0,0,0,0.35)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 6 * scale,
          right: 6 * scale,
          top: `calc(50% - ${(CROSS_THICKNESS * scale) / 2}px)`,
          height: CROSS_THICKNESS * scale,
          borderRadius: 999,
          background: "rgba(0,0,0,0.35)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10), 0 10px 22px rgba(0,0,0,0.35)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: Math.max(40, 50 * scale),
          height: Math.max(40, 50 * scale),
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.22)",
          background: "rgba(0,0,0,0.28)",
          display: "grid",
          placeItems: "center",
          fontWeight: 1000,
          color: "rgba(255,255,255,0.88)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
          fontSize: Math.max(20, 24 * scale),
        }}
      >
        ✝
      </div>
    </div>

    <div
      ref={boardRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, ${TILE}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${TILE}px)`,
        gap: GAP,
        padding: PAD,
        boxSizing: "border-box",
        width: boardWidth,
        height: boardHeight,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      opacity: fitScale == null ? 0 : 1,
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
              }}
            />
          );
        }

        const cell = map.get(key);
        const label = cell?.emotion ?? "";
        const words = String(label || "").trim().split(/\s+/).filter(Boolean);
const longestWord = words.reduce((m, w) => Math.max(m, w.length), 0);

const labelLetterSpacing =
  longestWord >= 16
    ? "-0.07em"
    : longestWord >= 13
    ? "-0.05em"
    : longestWord >= 10
    ? "-0.03em"
    : "-0.015em";
    
    const isEmpty = !cell;
const isHovered = !mobile && hoveredKey === key;
const isPressed = pressedKey === key;
const isTouchArmed =
  ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
  touchArmedKey === key;


        return (
          <button
            key={key}
            type="button"
            disabled={isEmpty}
onClick={() => handleTileActivate(cell, key)}
            onMouseEnter={() => !mobile && !isEmpty && setHoveredKey(key)}
            onMouseLeave={() => !mobile && setHoveredKey((prev) => (prev === key ? "" : prev))}
            onMouseDown={() => !isEmpty && setPressedKey(key)}
            onMouseUp={() => setPressedKey((prev) => (prev === key ? "" : prev))}
            onTouchStart={() => !isEmpty && setPressedKey(key)}
            onTouchEnd={() => setPressedKey((prev) => (prev === key ? "" : prev))}
            onTouchCancel={() => setPressedKey((prev) => (prev === key ? "" : prev))}
            title={label || ""}
            style={{
              width: TILE,
              height: TILE,
              borderRadius: 14,
border: `1px solid ${
  isHovered || isPressed || isTouchArmed
    ? "rgba(255,255,255,0.38)"
    : "rgba(255,255,255,0.14)"
}`,
              background: `
                linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)),
                radial-gradient(circle at 30% 22%, rgba(255,255,255,0.18), transparent 42%),
                ${colorFn(x, y)}
              `,
              color: "#ffffff",
padding: 2,
              minWidth: 0,
              display: "grid",
              placeItems: "center",
              cursor: isEmpty ? "default" : "pointer",
              WebkitTapHighlightColor: "transparent",
              transformOrigin: "center",
              touchAction: "manipulation",
              boxShadow: isHovered || isPressed || isTouchArmed
  ? "inset 0 0 10px rgba(0,0,0,0.18), 0 18px 34px rgba(0,0,0,0.30)"
  : "inset 0 0 6px rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.22)",
  
  filter: isHovered || isPressed || isTouchArmed
  ? "brightness(1.08) saturate(1.10)"
  : "brightness(1) saturate(1)",
  
transform: isHovered
  ? "translateY(-6px) scale(1.08)"
  : isPressed
  ? "translateY(-2px) scale(1.06)"
  : isTouchArmed
  ? "translateY(-3px) scale(1.07)"
  : "translateY(0) scale(1)",

  transition: "transform 150ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 150ms ease, filter 150ms ease, border-color 150ms ease",
            }}
          >
            <div
              style={{
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  textAlign: "center",
  whiteSpace: "normal",
  lineHeight: 0.92,
  letterSpacing: labelLetterSpacing,
  maxWidth: "100%",
  overflowWrap: "normal",
  wordBreak: "keep-all",
  hyphens: "none",
  overflow: "hidden",
  fontSize: `${fontForLabel(label, TILE) * labelScale}px`,
}}
            >
              {label || "—"}
            </div>
          </button>
        );
      })}
    </div>
  </div>
</div>

      {axisLabels ? (
        <div className="gridAxisLabels gridAxisLabels--bottom">
          <div style={{ textAlign: "left" }}>{axisLabels.bl || ""}</div>
          <div style={{ textAlign: "right" }}>{axisLabels.br || ""}</div>
        </div>
      ) : null}

      {axisLabels?.xNeg || axisLabels?.xPos ? (
        <div className="gridAxisFoot">
          <div>{axisLabels.xNeg || ""}</div>
          <div>{axisLabels.xPos || ""}</div>
        </div>
      ) : null}
    </div>
  );
}
