import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/layout/Header.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import Panel from "../components/ui/Panel.jsx";
import SegmentedTabs from "../components/ui/SegmentedTabs.jsx";
import ScriptureRotator from "../components/ui/ScriptureRotator.jsx";
import { getCumulativeSinsPageBackground } from "../utils/pageThemes.js";
function titleCase(s) {
  return String(s || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function compactPhrase(s) {
  return String(s || "")
    .replace(/^can\s+/i, "")
    .replace(/^is\s+/i, "")
    .replace(/^may\s+/i, "")
    .trim();
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function normalizeScriptures(value) {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];

  return arr
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === "string") {
        const ref = entry.split("—")[0].trim();
        return ref ? { ref } : null;
      }
      if (typeof entry === "object" && entry.ref) {
        return { ref: String(entry.ref).trim() };
      }
      return null;
    })
    .filter(Boolean);
}

function normalizeItem(item, fallbackKey = "item", groupTitle = "") {
  if (!item || typeof item !== "object") {
    return {
      key: fallbackKey,
      title: titleCase(fallbackKey),
      definition: "",
      common_forms: [],
      harm_impact: [],
      love_repair: [],
      repair_steps: [],
      empathy_prompts: [],
      encouragements: [],
      reflection_questions: [],
      opposite_fruit: [],
      flesh_forms: [],
      scriptures: [],
      group_title: groupTitle,
    };
  }

  return {
    key: item.key || fallbackKey,
    title: item.title || titleCase(item.key || fallbackKey),
    subtitle: item.subtitle || "",
    definition: item.definition || item.description || "",
    description: item.description || item.definition || "",
    common_forms: asArray(item.common_forms),
    harm_impact: asArray(item.harm_impact),
    love_repair: asArray(item.love_repair),
    repair_steps: asArray(item.repair_steps),
    empathy_prompts: asArray(item.empathy_prompts),
    encouragements: asArray(item.encouragements),
    reflection_questions: asArray(item.reflection_questions),
    opposite_fruit: asArray(item.opposite_fruit),
    flesh_forms: asArray(item.flesh_forms),
    scriptures: normalizeScriptures(item.scriptures || item.scripture),
    group_title: item.group_title || groupTitle,
  };
}

function normalizeSection(section, idx = 0) {
  const title = section?.title || `Section ${idx + 1}`;
  return {
    key: section?.key || `section_${idx}`,
    title,
    intro: section?.intro || section?.description || "",
    subtitle: section?.subtitle || "",
    items: Array.isArray(section?.items)
      ? section.items.map((item, itemIdx) =>
          normalizeItem(item, `${section?.key || "section"}_${itemIdx}`, title)
        )
      : [],
  };
}

function BulletList({ items, color = "#111827" }) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.58, color }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }}>
          {String(item)}
        </li>
      ))}
    </ul>
  );
}

function SummaryBanner({ item }) {
  const common = asArray(item?.common_forms);
  const harm = asArray(item?.harm_impact);
  const repair = asArray(item?.repair_steps).length
    ? asArray(item?.repair_steps)
    : asArray(item?.love_repair);
  const empathy = asArray(item?.empathy_prompts);
  const fruit = asArray(item?.opposite_fruit);

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.14)",
background: "linear-gradient(180deg, rgba(244, 210, 220, 0.74), rgba(132, 60, 84, 0.72))",        padding: 14,
        display: "grid",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: 0.2,
          color: "rgba(255,255,255,0.98)",
          textTransform: "uppercase",
        }}
      >
        Core takeaway
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        <div
          style={{
            borderRadius: 12,
            padding: 12,
            border: "1px solid rgba(255,210,120,0.18)",
            background: "rgba(255,210,120,0.18)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6, color: "#fff" }}>
            What repair sounds like
          </div>
          <div style={{ lineHeight: 1.5, fontSize: 14, color: "rgba(255,255,255,0.96)" }}>
            {repair.length
              ? compactPhrase(repair[0])
              : empathy.length
                ? compactPhrase(empathy[0])
                : "Move toward ownership, empathy, clarity, and love-led repair."}
          </div>
        </div>

        <div
          style={{
            borderRadius: 12,
            padding: 12,
            border: "1px solid rgba(125,220,190,0.18)",
            background: "rgba(125,220,190,0.18)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6, color: "#fff" }}>
            What this harms
          </div>
          <div style={{ lineHeight: 1.5, fontSize: 14, color: "rgba(255,255,255,0.96)" }}>
            {harm.length
              ? compactPhrase(harm[0])
              : "It distorts love, obscures truth, and weakens trust."}
          </div>
        </div>

        <div
          style={{
            borderRadius: 12,
            padding: 12,
            border: "1px solid rgba(170,200,255,0.18)",
            background: "rgba(170,200,255,0.18)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6, color: "#fff" }}>
            Love-led refocus
          </div>
          <div style={{ lineHeight: 1.5, fontSize: 14, color: "rgba(255,255,255,0.96)" }}>
            {fruit.length
              ? `Move toward ${fruit.slice(0, 3).join(", ")}.`
              : common.length
                ? `Interrupt ${compactPhrase(common[0])} and move toward faithful love.`
                : "Return to truth, humility, obedience, and love."}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children, background }) {
  return (
    <Panel
      style={{
        background:
          background ||
          "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.10))",
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </Panel>
  );
}

function SinChip({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      style={{
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.18)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.78), rgba(232,224,248,0.68))",
        color: "#1b1f33",
        padding: "16px 14px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: "0 8px 18px rgba(35, 32, 82, 0.10)",
        fontWeight: 900,
        fontSize: 15,
        lineHeight: 1.25,
      }}
    >
      <div>{item?.title || titleCase(item?.key)}</div>
      {item?.subtitle ? (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            lineHeight: 1.4,
            fontWeight: 700,
            color: "rgba(38,40,58,0.72)",
          }}
        >
          {item.subtitle}
        </div>
      ) : null}
    </button>
  );
}

function SectionList({ title, intro, subtitle, items, onOpen }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Panel
      style={{
background: "linear-gradient(180deg, rgba(244, 210, 220, 0.74), rgba(132, 60, 84, 0.72))",        border: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#1d2235" }}>{title}</div>

        {intro ? (
          <div style={{ fontSize: 15, lineHeight: 1.58, color: "rgba(31,35,52,0.92)" }}>
            {intro}
          </div>
        ) : null}

        {subtitle ? (
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: "rgba(43,47,70,0.72)",
              fontWeight: 700,
            }}
          >
            {subtitle}
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 10,
          }}
        >
          {safeItems.map((item) => (
            <SinChip key={item.key} item={item} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function SinModal({ item, onClose }) {
  const backdropRef = useRef(null);
  const modalCardRef = useRef(null);

  useEffect(() => {
    if (!item) return;

    const id = setTimeout(() => {
      if (backdropRef.current) {
        backdropRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }

      if (modalCardRef.current) {
        modalCardRef.current.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    }, 40);

    return () => clearTimeout(id);
  }, [item]);

  if (!item) return null;

  const scriptures = normalizeScriptures(item?.scriptures || item?.scripture);
  const commonForms = asArray(item?.common_forms);
  const harmImpact = asArray(item?.harm_impact);
  const loveRepair = asArray(item?.love_repair);
  const repairSteps = asArray(item?.repair_steps);
  const empathyPrompts = asArray(item?.empathy_prompts);
  const reflectionQuestions = asArray(item?.reflection_questions);
  const encouragements = asArray(item?.encouragements);
  const oppositeFruit = asArray(item?.opposite_fruit);
  const fleshForms = asArray(item?.flesh_forms);

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflowY: "auto",
        display: "grid",
        justifyItems: "center",
        alignItems: "start",
        padding: 16,
        background: "rgba(10,12,20,0.52)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
    >
      <div
        ref={modalCardRef}
        style={{
          width: "min(980px, 100%)",
          marginTop: 8,
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.14)",
background: "linear-gradient(180deg, rgba(244, 210, 220, 0.74), rgba(132, 60, 84, 0.72))",          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            padding: "18px 18px 8px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#fff" }}>
              {item.title || titleCase(item.key)}
            </div>

            {item.group_title ? (
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.72)",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {item.group_title}
              </div>
            ) : null}

            {item.definition || item.description ? (
              <div style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.94)" }}>
                {item.definition || item.description}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: 12,
              padding: "10px 12px",
              cursor: "pointer",
              fontWeight: 800,
              flex: "0 0 auto",
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: 18, display: "grid", gap: 14 }}>
          <SummaryBanner item={item} />

          {scriptures.length ? (
            <Panel
              style={{
                background: "linear-gradient(180deg, rgba(84, 152, 245, 0.90), rgba(74, 179, 111, 0.88))",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 10 }}>
                Scripture
              </div>
              <ScriptureRotator
                scriptures={scriptures}
                perPage={2}
                title=""
                buttonLabel="Show more"
                containerStyle={{ gap: 8 }}
                cardStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(27,31,59,0.20)",
                  padding: 10,
                }}
              />
            </Panel>
          ) : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {commonForms.length ? (
              <SectionCard title="Common forms" background="linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.12))">
                <BulletList items={commonForms} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}

            {harmImpact.length ? (
              <SectionCard title="Harm" background="linear-gradient(180deg, rgba(255, 189, 89, 0.95), rgba(212, 143, 18, 0.92))">
                <BulletList items={harmImpact} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}

            {loveRepair.length ? (
              <SectionCard title="Love refocus" background="linear-gradient(180deg, rgba(123, 187, 255, 0.95), rgba(43, 112, 196, 0.92))">
                <BulletList items={loveRepair} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}

            {repairSteps.length ? (
              <SectionCard title="Repair steps" background="linear-gradient(180deg, rgba(108, 205, 171, 0.95), rgba(57, 145, 115, 0.92))">
                <BulletList items={repairSteps} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}

            {empathyPrompts.length ? (
              <SectionCard title="Empathy prompts" background="linear-gradient(180deg, rgba(182, 153, 255, 0.96), rgba(101, 76, 198, 0.92))">
                <BulletList items={empathyPrompts} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}

            {reflectionQuestions.length ? (
              <SectionCard title="Reflection" background="linear-gradient(180deg, rgba(169, 210, 255, 0.95), rgba(74, 132, 215, 0.92))">
                <BulletList items={reflectionQuestions} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}

            {encouragements.length ? (
              <SectionCard title="Encouragement" background="linear-gradient(180deg, rgba(250, 225, 156, 0.95), rgba(197, 154, 46, 0.92))">
                <BulletList items={encouragements} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}

            {oppositeFruit.length ? (
              <SectionCard title="Fruit of the Spirit Direction" background="linear-gradient(180deg, rgba(138, 222, 182, 0.95), rgba(43, 148, 101, 0.92))">
                <BulletList items={oppositeFruit} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}

            {fleshForms.length ? (
              <SectionCard title="Flesh forms" background="linear-gradient(180deg, rgba(236, 151, 151, 0.95), rgba(180, 68, 68, 0.92))">
                <BulletList items={fleshForms} color="rgba(255,255,255,0.96)" />
              </SectionCard>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabIntroCard({ activeTab, tabData }) {
  let title = "Biblical framing";
  let body =
    "Select a category to open a more detailed view with Scripture, repair, and love-led refocus.";

  if (activeTab === "structural_biblical_map") {
    title = "Biblical map";
    body =
      "This tab gives a broader map of sinful patterns: against God, against neighbor, within the heart, and in neglected responsibilities.";
  } else if (activeTab === "three_roots_of_sin") {
    title = "Three roots";
    body =
      "This tab groups sinful patterns under lust of the flesh, lust of the eyes, and pride of life.";
  } else if (activeTab === "heart_idols_model") {
    title = "Heart idols";
    body =
      "This tab names ruling desires such as control, approval, comfort, power, and security, then opens them into deeper reflection and refocus.";
  } else if (activeTab === "fruit_vs_flesh_crossmap") {
    title = "Fruit vs flesh";
    body =
      "This tab pairs recurring sin-clusters with flesh expressions and opposing fruit so the page moves from diagnosis to redirection and repair.";
  }

  if (tabData?.description && typeof tabData.description === "string") {
    body = tabData.description;
  }

  return (
    <Panel
      style={{
background: "linear-gradient(180deg, rgba(244, 210, 220, 0.74), rgba(132, 60, 84, 0.72))",        border: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#1d2235" }}>{title}</div>
        <div style={{ color: "rgba(31,35,52,0.92)", lineHeight: 1.58 }}>{body}</div>
      </div>
    </Panel>
  );
}

export default function CumulativeSinsPage({ goHome, goCommunication }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("structural_biblical_map");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setError("");
        const res = await fetch("/data/accountability/cumulativeSins.json", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!alive) return;
        setData(json);
      } catch (e) {
        if (!alive) return;
        setError(String(e?.message || e));
        setData(null);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const pageStyle = useMemo(() => getCumulativeSinsPageBackground?.() || {}, []);

  const tabOptions = [
    { value: "structural_biblical_map", label: "Biblical Map" },
    { value: "three_roots_of_sin", label: "3 Roots" },
    { value: "heart_idols_model", label: "Heart Idols" },
    { value: "fruit_vs_flesh_crossmap", label: "Fruit vs Flesh" },
  ];

  const currentTabData = data?.tabs?.[activeTab] || null;
  const currentSections = Array.isArray(currentTabData?.sections)
    ? currentTabData.sections.map((section, idx) => normalizeSection(section, idx))
    : [];
  const anchorScriptures = normalizeScriptures(
    currentTabData?.scripture || currentTabData?.scriptures
  );

  return (
    <div className="container" style={{ ...(pageStyle || {}) }}>
      <Header
        title="Cumulative Sins"
      />

      <TopNav goHome={goHome} />

      <div style={{ width: "min(1120px, 100%)", margin: "0 auto", display: "grid", gap: 14 }}>
        {goCommunication ? (
          <Panel
            style={{
background: "linear-gradient(180deg, rgba(244, 210, 220, 0.74), rgba(132, 60, 84, 0.72))",            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ color: "#ffffff",  padding: "10px 14px", borderRadius: 20, lineHeight: 1.5 }}>
                This page expands beyond communication sins into a broader biblical sin framework.
              </div>
              <button
                type="button"
                onClick={goCommunication}
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.10)",
background: "linear-gradient(180deg, rgba(244, 210, 220, 0.74), rgba(132, 60, 84, 0.72))",                  padding: "10px 14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  color: "#111827",
                }}
              >
                Back to Communication Page
              </button>
            </div>
          </Panel>
        ) : null}

        <Panel
          style={{
background: "linear-gradient(180deg, rgba(244, 210, 220, 0.74), rgba(132, 60, 84, 0.72))",            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SegmentedTabs value={activeTab} onChange={setActiveTab} options={tabOptions} />
          </div>
        </Panel>

        {error ? (
          <Panel>
            <div style={{ color: "rgba(180,40,40,0.96)" }}>
              Could not load <b>cumulativeSins.json</b>: {error}
            </div>
          </Panel>
        ) : null}

        {!error ? <TabIntroCard activeTab={activeTab} tabData={currentTabData} /> : null}

        {!error && anchorScriptures.length ? (
          <Panel
            style={{
background: "linear-gradient(180deg, rgba(244, 210, 220, 0.74), rgba(132, 60, 84, 0.72))",              border: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: "#1d2235", marginBottom: 10 }}>
              Anchor scripture
            </div>

            <ScriptureRotator
              scriptures={anchorScriptures}
              perPage={1}
              title=""
              buttonLabel="Show more"
              containerStyle={{ gap: 8 }}
              cardStyle={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(74, 80, 140, 0.16)",
                padding: 10,
              }}
            />
          </Panel>
        ) : null}

        {!error &&
          currentSections.map((section) => (
            <SectionList
              key={section.key}
              title={section.title}
              intro={section.intro}
              subtitle={section.subtitle}
              items={section.items}
              onOpen={setSelectedItem}
            />
          ))}

        {!error && !currentSections.length ? (
          <Panel>
            <div style={{ color: "#111827", lineHeight: 1.55 }}>
              No sections were found for this tab. Check that
              <code style={{ marginLeft: 6 }}>tabs.{activeTab}.sections</code>
              exists in <code style={{ marginLeft: 6 }}>cumulativeSins.json</code>.
            </div>
          </Panel>
        ) : null}
      </div>

      <SinModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}