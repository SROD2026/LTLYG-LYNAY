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
  if (/(dizz|lighthead)/.test(t)) return "spin";

  return "pulse"; // safe default
}

export default function InteroStickFigure({ intero = [] }) {
  const active = useMemo(() => {
    // reduce into: { Chest: ["pulse","heat"], Abdomen:["cool"], ... }
    const out = {};
    for (const item of intero) {
      if (!item?.region || !item?.sensation) continue;

      const region = normalizeRegion(item.region);
      const eff = effectFromSensation(item.sensation);

      // ✅ initialize array before pushing (prevents crash)
      out[region] = out[region] || [];

      out[region].push(eff);

      // ✅ Whole Body always pulses when selected
      if (region === "Whole_Body" && !out[region].includes("pulse")) out[region].push("pulse");
    }
    return out;
  }, [intero]);

 const cls = (region) => {
  const effects = active[region] || [];

  // If nothing is selected for this region, show nothing (no class)
  if (effects.length === 0) return "";

  // If selected, show overlay + effect classes
  return ["overlay", ...effects.map((e) => `eff-${e}`)].join(" ");
};
const isActive = (region) => (active[region] || []).length > 0;
  return (
    <div style={{ display: "grid", placeItems: "center" }}>
<svg id="intero-figure" width="180" height="260" viewBox="0 0 180 260" aria-label="Interoception figure">        {/* Stick figure base */}
        <g stroke="rgba(255,255,255,0.95)" strokeWidth="4" fill="none" strokeLinecap="round">
          <circle cx="90" cy="40" r="20" />
          <path d="M90 60 L90 150" />
          <path d="M55 95 L125 95" />
          <path d="M90 150 L60 220" />
          <path d="M90 150 L120 220" />
        </g>

        {/* Region overlays */}
        <g>
        {isActive("Head") && <circle className={cls("Head")} cx="90" cy="40" r="22" />}
         {isActive("Throat") && <rect className={cls("Throat")} x="82" y="62" width="16" height="18" rx="6" />}
        {isActive("Chest") && <ellipse className={cls("Chest")} cx="90" cy="92" rx="22" ry="14" />}
        {isActive("Abdomen") && <ellipse className={cls("Abdomen")} cx="90" cy="128" rx="22" ry="14" />}
        {isActive("Arms_and_Hands") && <circle className={cls("Arms_and_Hands")} cx="55" cy="95" r="12" />}
        {isActive("Arms_and_Hands") && <circle className={cls("Arms_and_Hands")} cx="125" cy="95" r="12" />}
        {isActive("Legs_and_Feet") && <circle className={cls("Legs_and_Feet")} cx="60" cy="220" r="12" />}
    {isActive("Legs_and_Feet") && <circle className={cls("Legs_and_Feet")} cx="120" cy="220" r="12" />}
    {isActive("Whole_Body") && (
      <path
        className={`${cls("Whole_Body")} wholeBody`}
        d="M90 8
                C55 8 45 35 45 55
                C45 85 60 100 60 120
                C60 155 55 200 70 230
                C78 245 102 245 110 230
                C125 200 120 155 120 120
                C120 100 135 85 135 55
                C135 35 125 8 90 8 Z"
      />
    )}
  </g>
      </svg>
    </div>
  );
}