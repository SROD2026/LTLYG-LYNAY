import { useMemo } from "react";

function normalizeRegion(region) {
  return String(region || "").trim();
}

function effectFromSensation(s) {
  const t = String(s || "").toLowerCase();

  if (/(tight|pressure|heavy|crush|clench)/.test(t)) return "pulse";
  if (/(shake|trem|restless|adrenaline|surge)/.test(t)) return "shake";
  if (/(warm|heat|flush)/.test(t)) return "heat";
  if (/(cold|hollow|numb)/.test(t)) return "cool";
  if (/(buzz|vibrat|tingl)/.test(t)) return "spark";
  if (/(fog|confus)/.test(t)) return "fog";
  if (/(dizz|lighthead)/.test(t)) return "fog";

  return "pulse";
}

function regionLabel(region) {
  return String(region || "").replaceAll("_", " ");
}

export default function InteroStickFigure({ intero = [], theme = "default" }) {
  const active = useMemo(() => {
    const out = {};

    for (const item of intero) {
      if (!item?.region || !item?.sensation) continue;

      const region = normalizeRegion(item.region);
      const eff = effectFromSensation(item.sensation);

      out[region] = out[region] || [];
      out[region].push(eff);

      if (region === "Whole_Body" && !out[region].includes("pulse")) {
        out[region].push("pulse");
      }
    }

    return out;
  }, [intero]);

  const legendItems = useMemo(() => {
    return (Array.isArray(intero) ? intero : []).filter(
      (item) => item?.region && item?.sensation
    );
  }, [intero]);

  const cls = (region) => {
    const effects = active[region] || [];
    if (effects.length === 0) return "";
return ["overlay", ...effects.map((e) => `eff-${e}`)].join(" ");
  };

  const isActive = (region) => (active[region] || []).length > 0;

  return (
    <div
      className={`interoFigureCard interoFigureCard--${theme}`}
      style={{
        display: "grid",
        gap: 10,
        placeItems: "center",
        width: "100%",
      }}
    >
      <div className="interoFigureStage">
        <div className="interoFigureGlow" aria-hidden="true" />

        <svg
          id="intero-figure"
          width="190"
          height="280"
          viewBox="0 0 190 280"
          aria-label="Interoception figure"
        >
          {/* base silhouette */}
          <g className="interoSilhouette" aria-hidden="true">
            <path d="M95 14 C71 14 58 27 56 45 C54 61 60 75 68 84 L70 101 C72 118 73 138 73 156 C73 172 67 196 63 217 C60 232 67 244 78 247 C87 249 94 243 95 236 C96 243 103 249 112 247 C123 244 130 232 127 217 C123 196 117 172 117 156 C117 138 118 118 120 101 L122 84 C130 75 136 61 134 45 C132 27 119 14 95 14 Z" />
          </g>

          {/* stick figure base */}
          <g
            stroke="rgba(255,255,255,0.92)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          >
            <circle cx="95" cy="42" r="20" />
            <path d="M95 62 L95 156" />
            <path d="M58 98 L132 98" />
            <path d="M95 156 L63 236" />
            <path d="M95 156 L127 236" />
          </g>

          {/* subtle central glow line */}
          <g aria-hidden="true">
            <path
              d="M95 62 L95 156"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>

          {/* region overlays */}
          <g>
            {isActive("Head") && (
              <circle className={cls("Head")} cx="95" cy="42" r="23" />
            )}

            {isActive("Throat") && (
              <rect
                className={cls("Throat")}
                x="86"
                y="64"
                width="18"
                height="20"
                rx="7"
              />
            )}

            {isActive("Chest") && (
              <ellipse className={cls("Chest")} cx="95" cy="96" rx="25" ry="16" />
            )}

            {isActive("Abdomen") && (
              <ellipse className={cls("Abdomen")} cx="95" cy="132" rx="24" ry="16" />
            )}

            {isActive("Arms_and_Hands") && (
              <>
                <rect
                  className={cls("Arms_and_Hands")}
                  x="47"
                  y="88"
                  width="22"
                  height="26"
                  rx="11"
                />
                <rect
                  className={cls("Arms_and_Hands")}
                  x="121"
                  y="88"
                  width="22"
                  height="26"
                  rx="11"
                />
              </>
            )}

            {isActive("Legs_and_Feet") && (
              <>
                <ellipse
                  className={cls("Legs_and_Feet")}
                  cx="63"
                  cy="240"
                  rx="13"
                  ry="9"
                />
                <ellipse
                  className={cls("Legs_and_Feet")}
                  cx="127"
                  cy="240"
                  rx="13"
                  ry="9"
                />
              </>
            )}

            {isActive("Whole_Body") && (
              <path
                className={`${cls("Whole_Body")} wholeBody`}
                d="M95 10
                   C58 10 47 36 47 58
                   C47 88 63 104 66 124
                   C70 149 67 194 73 222
                   C76 238 84 250 95 250
                   C106 250 114 238 117 222
                   C123 194 120 149 124 124
                   C127 104 143 88 143 58
                   C143 36 132 10 95 10 Z"
              />
            )}
          </g>
        </svg>
      </div>

      {legendItems.length ? (
        <div className="interoLegend">
          {legendItems.map((item, idx) => {
            const eff = effectFromSensation(item.sensation);
            return (
              <div
                key={`${item.region}-${item.sensation}-${idx}`}
                className={`interoLegendItem eff-${eff}`}
              >
                <span className="interoLegendDot" />
                <span className="interoLegendText">
                  <strong>{regionLabel(item.region)}:</strong> {item.sensation}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}