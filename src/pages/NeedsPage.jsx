import { useMemo, useState } from "react";
import Header from "../components/layout/Header.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import Panel from "../components/ui/Panel.jsx";
import { getNeedsPageBackground } from "../utils/pageThemes.js";
import needsPageContent from "../data/needsPageContent.json";
import { getNeedDetail } from "../data/needsDetails.js";
import NeedModal from "../components/needs/NeedModal.jsx";


const NEED_CATEGORIES = [
  {
    key: "safety",
    title: "Safety, protection, and trust",
    subtitle: "Needs that help a person feel less threatened, more secure, and more able to stay present.",
    emoji: "🛡️",
    items: ["Safety", "Protection", "Trust", "Predictability", "Stability", "Reliability", "Consistency", "Peace", "Calm", "Reassurance", "Privacy"],
  },
  {
    key: "truth",
    title: "Truth, clarity, and understanding",
    subtitle: "Needs that help reality feel coherent, understandable, and communicable.",
    emoji: "💡",
    items: ["Truthfulness", "Transparency", "Honesty", "Clarity", "Context", "Understanding", "Information", "Orientation", "Guidance", "Stepwise explanation", "Stepwise plan", "Shared Expectations", "Order", "Coordination", "Accountability", "Integrity", "Repair", "Fairness", "Equity"],
  },
  {
    key: "rest",
    title: "Rest, regulation, and pace",
    subtitle: "Needs that reduce overload and help the body or mind settle.",
    emoji: "🌿",
    items: ["Preparation Time", "Processing Time", "Time", "Pace", "Control over pace", "Space", "Stillness", "Simplicity", "Reduced Stimulation", "Rest / Sleep", "Recovery", "Ease", "Relief", "Comfort", "Warmth"],
  },
  {
    key: "connection",
    title: "Care, belonging, and relational dignity",
    subtitle: "Needs that nourish closeness, mutuality, emotional safety, and personhood.",
    emoji: "🤝",
    items: ["Respect", "Care", "Support", "Encouragement", "Hope", "Acceptance", "Gentleness", "Dignity", "Belonging", "Connection", "Being Seen", "Being Heard", "Acknowledgment", "Consideration", "Appreciation", "Reciprocity", "Closeness / Intimacy", "Harmony", "Cooperation", "Forgiveness"],
  },
  {
    key: "agency",
    title: "Agency, freedom, and boundaries",
    subtitle: "Needs that support responsible choice, autonomy, and consent.",
    emoji: "🧭",
    items: ["Agency", "Autonomy", "Choice", "Freedom", "Space to Decide", "Boundaries / Consent", "Permission to be new", "Learning", "Growth", "Self-Compassion", "Meaning / Purpose", "Progress"],
  },
  {
    key: "embodied",
    title: "Embodied and practical needs",
    subtitle: "Needs tied to living as a finite, embodied person rather than a machine.",
    emoji: "🍞",
    items: ["Movement / Exercise", "Food", "Water", "Air", "Health", "Play"],
  },
];

function CollapsiblePanel({
  title,
  subtitle = "",
  children,
  defaultOpen = false,
  background,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Panel
      style={{
        background:
          background ||
          "linear-gradient(180deg, rgba(242, 242, 243, 0.92), rgba(164, 107, 203, 0.72))",
        border: "1px solid rgba(255,255,255,0.12)",
        width: "min(1120px, 100%)",
        margin: "0 auto",
        marginTop: 2,
        borderRadius: 18,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          padding: "10px 16px",
          borderRadius: 5,
          margin: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          textAlign: "left",
          color: "#111111",
        }}
      >
        <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: "clamp(18px, 3.6vw, 22px)",
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>

          {subtitle ? (
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.35,
                color: "rgba(20,20,20,0.72)",
                fontWeight: 600,
                maxWidth: 820,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <span
          style={{
            fontSize: "clamp(18px, 3.6vw, 22px)",
            lineHeight: 1,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
            flex: "0 0 auto",
          }}
        >
          ›
        </span>
      </button>

      {open ? (
        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {children}
        </div>
      ) : null}
    </Panel>
  );
}

function getNeedCategories(globalNeeds = []) {
  const allowed = new Set((Array.isArray(globalNeeds) ? globalNeeds : []).map((x) => String(x)));
  const used = new Set();

  const categories = NEED_CATEGORIES.map((group) => {
    const items = group.items.filter((item) => allowed.has(item));
    items.forEach((item) => used.add(item));
    return { ...group, items };
  }).filter((group) => group.items.length > 0);

  const leftovers = (Array.isArray(globalNeeds) ? globalNeeds : []).filter((item) => !used.has(item));
  if (leftovers.length) {
    categories.push({
      key: "other",
      title: "Additional needs",
      subtitle: "Needs still present in the shared list that have not yet been grouped more specifically.",
      emoji: "📎",
      items: leftovers,
    });
  }

  return categories;
}

function SectionCard({ title, subtitle, emoji, children }) {
  return (
    <Panel
      style={{
  display: "grid",
  gap: 14,
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 14px 30px rgba(20, 58, 66, 0.10)",
  backdropFilter: "blur(6px)",
}}
    >
    

      <div
        className="mobileStack"
        style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 14, alignItems: "start" }}
      >
        <div
          style={{
  minHeight: 140,
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.22)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.18))",
  display: "grid",
  placeItems: "center",
  padding: 18,
  textAlign: "center",
  boxShadow: "0 10px 24px rgba(24, 58, 68, 0.08)",
  backdropFilter: "blur(4px)",
}}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontSize: 46, lineHeight: 1 }}>{emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#111" }}>{title}</div>
<div style={{ fontSize: 13, lineHeight: 1.45, color: "#333" }}>{subtitle}</div>

          </div>
        </div>
        {children}
      </div>
    </Panel>
  );
}

function NeedChip({ text, armed, requireDoubleTap, onArm, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!requireDoubleTap) {
          onOpen?.(text);
          return;
        }

        if (armed) onOpen?.(text);
        else onArm?.(text);
      }}
      style={{
        borderRadius: 999,
        border: armed
          ? "1px solid rgba(255,255,255,0.52)"
          : "1px solid rgba(255,255,255,0.34)",
        background: armed
          ? "linear-gradient(180deg, rgba(255,255,255,0.76), rgba(255,255,255,0.34))"
          : "linear-gradient(180deg, rgba(255,255,255,0.58), rgba(255,255,255,0.24))",
        color: "#08303c",
        padding: "13px 15px",
        fontSize: 15,
        fontWeight: 900,
        lineHeight: 1.2,
        boxShadow: armed
          ? "0 16px 30px rgba(16, 78, 90, 0.24), inset 0 1px 0 rgba(255,255,255,0.50)"
          : "0 10px 22px rgba(16, 78, 90, 0.18), inset 0 1px 0 rgba(255,255,255,0.40)",
        cursor: "pointer",
        textAlign: "left",
        transition:
          "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease",
        WebkitTapHighlightColor: "transparent",
        transform: armed ? "translateY(-1px) scale(1.02)" : "translateY(0px) scale(1)",
      }}
      onMouseEnter={(e) => {
        if (requireDoubleTap && armed) return;
        e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.46)";
        e.currentTarget.style.background =
          armed
            ? "linear-gradient(180deg, rgba(255,255,255,0.76), rgba(255,255,255,0.34))"
            : "linear-gradient(180deg, rgba(255,255,255,0.68), rgba(255,255,255,0.30))";
        e.currentTarget.style.boxShadow =
          "0 16px 28px rgba(16, 78, 90, 0.22), inset 0 1px 0 rgba(255,255,255,0.46)";
      }}
      onMouseLeave={(e) => {
        if (requireDoubleTap && armed) return;
        e.currentTarget.style.transform = armed
          ? "translateY(-1px) scale(1.02)"
          : "translateY(0px) scale(1)";
        e.currentTarget.style.borderColor = armed
          ? "rgba(255,255,255,0.52)"
          : "rgba(255,255,255,0.34)";
        e.currentTarget.style.background = armed
          ? "linear-gradient(180deg, rgba(255,255,255,0.76), rgba(255,255,255,0.34))"
          : "linear-gradient(180deg, rgba(255,255,255,0.58), rgba(255,255,255,0.24))";
        e.currentTarget.style.boxShadow = armed
          ? "0 16px 30px rgba(16, 78, 90, 0.24), inset 0 1px 0 rgba(255,255,255,0.50)"
          : "0 10px 22px rgba(16, 78, 90, 0.18), inset 0 1px 0 rgba(255,255,255,0.40)";
      }}
    >
      {text}
    </button>
  );
}

function TheologyCard({ refText, principle }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.20)",
        borderRadius: 16,
        padding: 14,
        background: "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.14))",
        boxShadow: "0 8px 20px rgba(20, 58, 66, 0.08)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          marginBottom: 6,
          color: "#111",
          fontSize: 15,
        }}
      >
        {refText}
      </div>

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: "#2a2a2a",
        }}
      >
        {principle}
      </div>
    </div>
  );
}

function TeachingCard({ title, body }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 16,
        border: "1px solid rgba(255,255,255,0.20)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.14))",
        boxShadow: "0 8px 20px rgba(20, 58, 66, 0.08)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          marginBottom: 8,
          color: "#111",
          fontSize: 16,
          lineHeight: 1.25,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "#2a2a2a",
        }}
      >
        {body}
      </div>
    </div>
  );
}

export default function NeedsPage({ goHome, needsSupplement }) {
  const [selectedKey, setSelectedKey] = useState("safety");
  const bgStyle = useMemo(() => getNeedsPageBackground(), []);
  const globalNeeds = Array.isArray(needsSupplement?.global) ? needsSupplement.global : [];
  const categories = useMemo(() => getNeedCategories(globalNeeds), [globalNeeds]);
  const selectedCategory = useMemo(
    () => categories.find((item) => item.key === selectedKey) || categories[0] || null,
    [categories, selectedKey]
  );
const [selectedNeedName, setSelectedNeedName] = useState("");
const [armedNeedName, setArmedNeedName] = useState("");
const requireDoubleTap = useMemo(() => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}, []);

const selectedNeedDetail = useMemo(() => {
  return selectedNeedName ? getNeedDetail(selectedNeedName) : null;
}, [selectedNeedName]);
  const content = needsPageContent || {};

  return (
<div
  className="container needsPage"
  style={{
    "--page-bg": "#4ea8a9",
    "--page-bg-gradient": "none",
    color: "#000000",
    ...(bgStyle || {}),
  }}
>
  
        <div className="appShell" style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
        <div className="panel" style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
  <div style={{ display: "grid", gap: 8 }}>
    <div style={{ minWidth: 0, maxWidth: 860 }}>
      <Header
        title={content.pageTitle || "Needs"}
        subtitle={<>{content.pageSubtitle || ""}</>}
      />
    </div>

    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
        width: "100%",
        "--btn-bg": "rgba(12, 44, 50, 0.76)",
        "--btn-border": "rgba(255,255,255,0.14)",
        "--btn-text": "rgba(255,255,255,0.96)",
      }}
    >
      <TopNav
        goHome={goHome}
        goGrid={() => (window.location.hash = "#/grid")}
        goViolent={() => (window.location.hash = "#/violent")}
        goCheckin={() => (window.location.hash = "#/checkin")}
        goPrayer={() => (window.location.hash = "#/prayer")}
        goCommunication={() => (window.location.hash = "#/communication-sins")}
        goLog={() => (window.location.hash = "#/log")}
      />
    </div>
  </div>
</div>
<CollapsiblePanel
  title={content.intro?.title || "How this page works"}
  defaultOpen={false}
  background="linear-gradient(180deg, rgba(255,255,255,0.72), rgba(214,236,241,0.58))"
>
  <div style={{ display: "grid", gap: 10 }}>
    {(content.intro?.paragraphs || []).map((p, index) => (
      <div
        key={index}
        style={{
          lineHeight: 1.55,
          color: "rgba(18, 18, 18, 0.92)",
          fontSize: 15,
        }}
      >
        {p}
      </div>
    ))}
  </div>
</CollapsiblePanel>


        <SectionCard
          title={content.needsSection?.title || "List of Needs"}
          subtitle={content.needsSection?.subtitle || "Select a category to view associated needs."}
          emoji={content.needsSection?.emoji || "🧩"}
        >
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((group) => {
                const active = selectedCategory?.key === group.key;
                return (
                  <button
                    key={group.key}
                    type="button"
onClick={() => {
  setSelectedKey(group.key);
  setArmedNeedName("");
}}
                   style={{
  padding: "10px 14px",
  borderRadius: 999,
  border: active
    ? "1px solid rgba(255,255,255,0.40)"
    : "1px solid rgba(255,255,255,0.22)",
  background: active
    ? "linear-gradient(180deg, rgba(255,255,255,0.56), rgba(255,255,255,0.28))"
    : "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.12))",
  color: "#0f2f39",
  fontWeight: active ? 900 : 800,
  cursor: "pointer",
  boxShadow: active
    ? "0 10px 20px rgba(20, 58, 66, 0.14), inset 0 1px 0 rgba(255,255,255,0.40)"
    : "0 4px 10px rgba(20, 58, 66, 0.08)",
  transition:
    "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease",
}}
                  >
                    {group.title}
                  </button>
                );
              })}
            </div>

            {selectedCategory ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.12))",
  padding: 16,
  color: "#111",
  boxShadow: "0 10px 22px rgba(20, 58, 66, 0.08)",
}}
                >
                  <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6, color: "#111" }}>
  {selectedCategory.emoji} {selectedCategory.title}
</div>
<div style={{ fontSize: 14, lineHeight: 1.55, color: "#2f2f2f" }}>
  {selectedCategory.subtitle}
</div>
                </div>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 12,
  }}
>
{selectedCategory.items.map((need) => (
  <NeedChip
    key={need}
    text={need}
    onOpen={(name) => {
      setSelectedNeedName(name);
    }}
  />
))}                </div>


              </div>
            ) : null}
          </div>
        </SectionCard>

<CollapsiblePanel
  title={content.whyNeedsHelp?.title || "Why needs language helps"}
  subtitle={content.whyNeedsHelp?.subtitle || ""}
  defaultOpen={false}
  background="linear-gradient(180deg, rgba(255,255,255,0.72), rgba(214,236,241,0.58))"
>
  <div style={{ display: "grid", gap: 12 }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
      }}
    >
      {(content.whyNeedsHelp?.cards || []).map((item) => (
        <div
          key={item.title}
          style={{
            borderRadius: 12,
            padding: 12,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "rgba(255,255,255,0.10)",
            color: "rgba(0, 0, 0, 0.96)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>{item.title}</div>
          <div style={{ lineHeight: 1.5, fontSize: 14 }}>{item.body}</div>
        </div>
      ))}
    </div>
  </div>
</CollapsiblePanel>

<CollapsiblePanel
  title={content.biblicalGrounding?.title || "Biblical grounding"}
  subtitle={content.biblicalGrounding?.subtitle || ""}
  defaultOpen={false}
  background="linear-gradient(180deg, rgba(255,255,255,0.72), rgba(214,236,241,0.58))"
>
  <div style={{ display: "grid", gap: 14 }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
      }}
    >
      {(content.biblicalGrounding?.teachings || []).map((item) => (
        <TeachingCard key={item.title} title={item.title} body={item.body} />
      ))}
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}
    >
      {(content.biblicalGrounding?.scriptures || []).map((item) => (
        <TheologyCard key={item.ref} refText={item.ref} principle={item.principle} />
      ))}
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
      }}
    >
      {(content.biblicalGrounding?.examples || []).map((item) => (
        <TeachingCard key={item.title} title={item.title} body={item.body} />
      ))}
    </div>
  </div>
</CollapsiblePanel>


      </div>
      <NeedModal
  open={!!selectedNeedName}
  detail={selectedNeedDetail}
  onClose={() => {
    setSelectedNeedName("");
    setArmedNeedName("");
  }}
/>
    </div>
  );
}