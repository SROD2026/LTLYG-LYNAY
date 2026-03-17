// src/components/grid/EmotionGrid.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cellColor } from "../../utils/color.js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

function fontForLabel(label, tileSize = 92, mobile = false) {
  const s = String(label || "").trim();
  if (!s) return mobile ? 9 : 14;

  const words = s.split(/\s+/).filter(Boolean);
  const longest = words.reduce((m, w) => Math.max(m, w.length), 0);
  const chars = s.length;

  let size = tileSize * (mobile ? 0.155 : 0.18);

  if (longest >= 18) size *= 0.46;
  else if (longest >= 16) size *= 0.52;
  else if (longest >= 14) size *= 0.60;
  else if (longest >= 12) size *= 0.68;
  else if (longest >= 10) size *= 0.78;
  else if (longest >= 8) size *= 0.88;

  if (chars >= 34) size *= 0.66;
  else if (chars >= 30) size *= 0.72;
  else if (chars >= 26) size *= 0.79;
  else if (chars >= 22) size *= 0.86;
  else if (chars >= 18) size *= 0.93;

  return Math.round(clamp(size, mobile ? 6.8 : 8, mobile ? 13 : 21) * 10) / 10;
}

function renderBoardCells({
  coords,
  map,
  mobile,
  hoveredKey,
  pressedKey,
  focusedKey,
  setHoveredKey,
  setPressedKey,
  setFocusedKey,
  handleTileActivate,
  colorFn,
  labelScale,
  TILE,
  GAP,
  PAD,
  TILE_RADIUS,
  onPick,
  overlay = false,
}) {
  return coords.map(({ x, y }) => {
    const key = `${x},${y}`;

    if (x === 0 || y === 0) {
      return (
        <div
          key={key}
          aria-hidden="true"
          style={{
            width: TILE,
            height: TILE,
            borderRadius: TILE_RADIUS,
            border: overlay
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(255,255,255,0.06)",
            background: overlay ? "rgba(255,255,255,0.03)" : "transparent",
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
    const isFocused = focusedKey === key;

    return (
      <button
        key={key}
        type="button"
        disabled={isEmpty}
        onClick={() => {
          if (!isEmpty) {
            handleTileActivate(cell);
            onPick?.(cell);
          }
        }}
        onMouseEnter={() => !mobile && !isEmpty && setHoveredKey(key)}
        onMouseLeave={() => !mobile && setHoveredKey((prev) => (prev === key ? "" : prev))}
        onMouseDown={() => !isEmpty && setPressedKey(key)}
        onMouseUp={() => setPressedKey((prev) => (prev === key ? "" : prev))}
        onTouchStart={() => {
          if (!isEmpty) {
            setPressedKey(key);
            setFocusedKey(key);
          }
        }}
        onTouchEnd={() => setPressedKey((prev) => (prev === key ? "" : prev))}
        onTouchCancel={() => setPressedKey((prev) => (prev === key ? "" : prev))}
        title={label || ""}
        style={{
          width: TILE,
          height: TILE,
          borderRadius: TILE_RADIUS,
          border: `1px solid ${
            isHovered || isPressed || isFocused
              ? "rgba(255,255,255,0.38)"
              : overlay
              ? "rgba(255,255,255,0.18)"
              : "rgba(255,255,255,0.14)"
          }`,
          background: isEmpty
            ? overlay
              ? "rgba(255,255,255,0.04)"
              : `
                linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)),
                radial-gradient(circle at 30% 22%, rgba(255,255,255,0.10), transparent 42%),
                rgba(255,255,255,0.02)
              `
            : `
              linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)),
              radial-gradient(circle at 30% 22%, rgba(255,255,255,0.18), transparent 42%),
              ${colorFn(cell.x, cell.y)}
            `,
          color: "#ffffff",
          padding: overlay ? 4 : 2,
          minWidth: 0,
          display: "grid",
          placeItems: "center",
          cursor: isEmpty ? "default" : "pointer",
          WebkitTapHighlightColor: "transparent",
          transformOrigin: "center",
          touchAction: "none",
          boxShadow: isEmpty
            ? "none"
            : overlay
            ? "inset 0 0 8px rgba(0,0,0,0.18), 0 12px 24px rgba(0,0,0,0.28)"
            : mobile
            ? "inset 0 0 4px rgba(0,0,0,0.14)"
            : isHovered || isPressed || isFocused
            ? "inset 0 0 10px rgba(0,0,0,0.18), 0 18px 34px rgba(0,0,0,0.30)"
            : "inset 0 0 6px rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.22)",
          filter: mobile
            ? "none"
            : isHovered || isPressed || isFocused
            ? "brightness(1.08) saturate(1.10)"
            : "brightness(1) saturate(1)",
          transition: mobile
            ? "border-color 120ms ease"
            : "transform 150ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 150ms ease, filter 150ms ease, border-color 150ms ease",
          transform: mobile
            ? isPressed
              ? "scale(1.02)"
              : "scale(1)"
            : isHovered
            ? "translateY(-6px) scale(1.08)"
            : isPressed
            ? "translateY(-2px) scale(1.06)"
            : isFocused
            ? "translateY(-3px) scale(1.07)"
            : "translateY(0) scale(1)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            whiteSpace: "normal",
            lineHeight: mobile ? 0.86 : 0.92,
            letterSpacing: mobile ? "-0.04em" : labelLetterSpacing,
            maxWidth: "100%",
            overflowWrap: "normal",
            textWrap: "balance",
            wordBreak: "normal",
            hyphens: "none",
            overflow: "hidden",
            padding: mobile ? "1px" : "0",
            fontSize: `${fontForLabel(label, TILE, mobile) * labelScale}px`,
          }}
        >
          {label || ""}
        </div>
      </button>
    );
  });
}

export default function EmotionGrid({
  grid = [],
  onPick,
  axisLabels,
  colorFn = cellColor,
  meta = {},
  tileSize = 82,
  labelScale = 1,

  compactOverlay = false,
  compactGrid = [],
  compactTileSize = 108,
  compactLabelScale = 1.16,
}) {
  const map = useMemo(() => new Map(grid.map((c) => [`${c.x},${c.y}`, c])), [grid]);
  const compactMap = useMemo(
    () => new Map((compactGrid || []).map((c) => [`${c.x},${c.y}`, c])),
    [compactGrid]
  );

  const rootRef = useRef(null);
  const boardRef = useRef(null);

  const [mobile, setMobile] = useState(isMobileLikeViewport);
  const [hoveredKey, setHoveredKey] = useState("");
  const [pressedKey, setPressedKey] = useState("");
  const [focusedKey, setFocusedKey] = useState("");
  const [fitScale, setFitScale] = useState(null);

  const coords = [];
  for (let y = 7; y >= -7; y--) {
    for (let x = -7; x <= 7; x++) coords.push({ x, y });
  }

  const compactCoords = [];
  for (let y = 4; y >= -4; y--) {
    for (let x = -4; x <= 4; x++) compactCoords.push({ x, y });
  }

  const COLS = 15;
  const ROWS = 15;

  const MOBILE_TILE = Math.min(tileSize, 54);
  const TILE = mobile ? MOBILE_TILE : tileSize;

  const GAP = mobile ? 2 : 5;
  const PAD = mobile ? 3 : 10;
  const CROSS_THICKNESS = mobile ? 5 : 10;
  const TILE_RADIUS = mobile ? 9 : 14;

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

  useLayoutEffect(() => {
    let frame = 0;

    const updateScale = () => {
      if (typeof window === "undefined") return;

      const rootWidth = rootRef.current?.clientWidth || Math.max(180, window.innerWidth - 20);
      const availableWidth = Math.max(180, rootWidth - (mobile ? 4 : 8));
      const minScale = mobile ? 0.26 : 0.5;

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

  function handleTileActivate(cell) {
    if (!cell) return;
    onPick?.(cell);
  }

  const scale = fitScale ?? 1;
  const fittedWidth = boardWidth * scale;
  const fittedHeight = boardHeight * scale;

  const compactOverlayScale = mobile ? Math.min(scale * 0.98, 1) : Math.min(scale * 1.06, 1.12);
  const COMPACT_TILE = mobile
    ? Math.min(compactTileSize, 90)
    : compactTileSize;
  const compactGap = mobile ? 3 : 7;
  const compactRadius = mobile ? 11 : 18;

  const compactBoardWidth = 9 * COMPACT_TILE + 8 * compactGap;
  const compactBoardHeight = 9 * COMPACT_TILE + 8 * compactGap;

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
      }}
    >
      {axisLabels ? (
        <div className="gridAxisLabels gridAxisLabels--top">
          <div style={{ textAlign: "left" }}>{axisLabels.tl || ""}</div>
          <div style={{ textAlign: "right" }}>{axisLabels.tr || ""}</div>
        </div>
      ) : null}

      <div
        className="gridZoomShell"
        style={{
          position: "relative",
          width: "100%",
          minWidth: 0,
          overflowX: "auto",
          overflowY: "hidden",
          touchAction: "manipulation",
        }}
      >
        <TransformWrapper
          minScale={1}
          maxScale={mobile ? 4 : 4}
          wheel={{ step: mobile ? 0.08 : 0.12 }}
          pinch={{ step: mobile ? 3 : 4 }}
          initialScale={1}
          limitToBounds={true}
          centerOnInit
          centerZoomedOut
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: true }}
          disablePadding
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              overflow: "hidden",
            }}
            contentStyle={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: fittedWidth,
                height: fittedHeight,
                margin: "0 auto",
              }}
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
                    boxShadow: mobile
                      ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
                      : "inset 0 0 0 1px rgba(255,255,255,0.10), 0 10px 22px rgba(0,0,0,0.35)",
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
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  willChange: "transform",
                  boxSizing: "border-box",
                  width: boardWidth,
                  height: boardHeight,
                  opacity: fitScale == null ? 0 : compactOverlay ? 0.22 : 1,
                  filter: compactOverlay ? "blur(1.4px) saturate(0.7)" : "none",
                  transition: "opacity 180ms ease, filter 180ms ease",
                }}
              >
                {renderBoardCells({
                  coords,
                  map,
                  mobile,
                  hoveredKey,
                  pressedKey,
                  focusedKey,
                  setHoveredKey,
                  setPressedKey,
                  setFocusedKey,
                  handleTileActivate,
                  colorFn,
                  labelScale,
                  TILE,
                  GAP,
                  PAD,
                  TILE_RADIUS,
                })}
              </div>

              {compactOverlay ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${compactOverlayScale})`,
                    transformOrigin: "center center",
                    zIndex: 8,
                    width: compactBoardWidth,
                    height: compactBoardHeight,
                    display: "grid",
                    gridTemplateColumns: `repeat(9, ${COMPACT_TILE}px)`,
                    gridTemplateRows: `repeat(9, ${COMPACT_TILE}px)`,
                    gap: compactGap,
                    pointerEvents: "auto",
                  }}
                >
                  {renderBoardCells({
                    coords: compactCoords,
                    map: compactMap,
                    mobile,
                    hoveredKey,
                    pressedKey,
                    focusedKey,
                    setHoveredKey,
                    setPressedKey,
                    setFocusedKey,
                    handleTileActivate,
                    colorFn,
                    labelScale: compactLabelScale,
                    TILE: COMPACT_TILE,
                    GAP: compactGap,
                    PAD: 0,
                    TILE_RADIUS: compactRadius,
                    onPick,
                    overlay: true,
                  })}
                </div>
              ) : null}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {axisLabels ? (
        <div className="gridAxisLabels gridAxisLabels--bottom">
          <div style={{ textAlign: "left" }}>{axisLabels.bl || ""}</div>
          <div style={{ textAlign: "right" }}>{axisLabels.br || ""}</div>
        </div>
      ) : null}

      {axisLabels?.xNeg || axisLabels?.xPos ? (
        <div className="gridAxisFoot">
          <div style={{ textAlign: "left" }}>{axisLabels.xNeg || ""}</div>
          <div style={{ textAlign: "right" }}>{axisLabels.xPos || ""}</div>
        </div>
      ) : null}
    </div>
  );
}