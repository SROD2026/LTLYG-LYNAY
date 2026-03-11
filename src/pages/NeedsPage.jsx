import { useMemo, useState } from "react";
import Header from "../components/layout/Header.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import Panel from "../components/ui/Panel.jsx";
import { getNeedsPageBackground } from "../utils/pageThemes.js";

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

const THEOLOGY_FALLBACK = {
  title: "Needs are universal; love shows up as respect, stewardship, and mutual care",
  sections: [
    {
      label: "Needs language (human reality)",
      bullets: [
        "Every person has needs such as safety, clarity, rest, belonging, agency, honesty, and stability.",
        "Maturity includes learning to meet needs responsibly rather than extracting them through coercion or manipulation.",
      ],
    },
    {
      label: "Burdens vs. loads (mutual care with responsibility)",
      bullets: [
        "We help carry burdens: needs someone cannot carry alone.",
        "We also bear our own load: personal responsibility and ownership remain.",
      ],
    },
    {
      label: "Respect is love in action",
      bullets: [
        "Respect means honoring limits, pace, and personhood.",
        "Ignoring boundaries is not love; it is harm dressed up as urgency.",
      ],
    },
  ],
  scriptures: [
    { ref: "Galatians 6:2-5", principle: "Bear one another’s burdens, yet each bears their own load." },
    { ref: "Romans 13:8-10", principle: "Love fulfills the law and does no wrong to a neighbor." },
    { ref: "Philippians 2:3-4", principle: "In humility count others more significant; look to their interests." },
    { ref: "1 Corinthians 10:24", principle: "Seek the good of your neighbor, not only your own." },
  ],
};

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
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 10px 24px rgba(32, 72, 82, 0.10)",
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#ffffff" }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 14, lineHeight: 1.55, color: "#ffffff" }}>{subtitle}</div> : null}
      </div>

      <div 
      className="mobileStack"
      style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 14, alignItems: "start" }}>
        <div
          style={{
            minHeight: 168,
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.50), rgba(255,255,255,0.24))",
            display: "grid",
            placeItems: "center",
            padding: 18,
            textAlign: "center",
            boxShadow: "0 10px 24px rgba(24, 58, 68, 0.12)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontSize: 46, lineHeight: 1 }}>{emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#ffffff" }}>{title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: "#ffffff" }}>{subtitle}</div>
          </div>
        </div>
        {children}
      </div>
    </Panel>
  );
}

function NeedChip({ text }) {
  return (
    <div
      style={{
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.20)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.12))",
        color: "#0e3340",
        padding: "10px 12px",
        fontSize: 13,
        fontWeight: 800,
        lineHeight: 1.2,
        boxShadow: "0 8px 18px rgba(27, 72, 81, 0.10)",
      }}
    >
      {text}
    </div>
  );
}

function TheologyCard({ refText, principle }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.16)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.08)" }}>
      <div style={{ fontWeight: 900, marginBottom: 6, color: "rgba(255,255,255,0.98)" }}>{refText}</div>
      <div style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.94)" }}>{principle}</div>
    </div>
  );
}



function TeachingCard({ title, body }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: 14,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
        color: "rgba(255,255,255,0.96)",
        boxShadow: "0 8px 18px rgba(27, 72, 81, 0.10)",
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}
export default function NeedsPage({ goHome, needsSupplement, purposeDropdown = [] }) {
  const [selectedKey, setSelectedKey] = useState("safety");
  const bgStyle = useMemo(() => getNeedsPageBackground(), []);
  const globalNeeds = Array.isArray(needsSupplement?.global) ? needsSupplement.global : [];
  const categories = useMemo(() => getNeedCategories(globalNeeds), [globalNeeds]);
  const selectedCategory = useMemo(() => categories.find((item) => item.key === selectedKey) || categories[0] || null, [categories, selectedKey]);
  const theologyBlock = useMemo(() => {
    const items = Array.isArray(purposeDropdown) ? purposeDropdown : [];
    return items.find((item) => String(item?.title || "").toLowerCase().includes("needs are universal")) || THEOLOGY_FALLBACK;
  }, [purposeDropdown]);

  return (
    <div className="container" style={{ "--page-bg": "#4ea8a9", "--page-bg-gradient": "none", ...(bgStyle || {}) }}>
      <div className="appShell" style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
        <div className="panel" style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
          <div className="metaRow">
            <div style={{ minWidth: 0, maxWidth: 1120, flex: "1 1 620px" }}>
              <Header
                title="Needs: what they are, why they matter, and how Scripture supports them"
                subtitle={<></>}
              />
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", "--btn-bg": "rgba(12, 44, 50, 0.76)", "--btn-border": "rgba(255,255,255,0.14)", "--btn-text": "rgba(255,255,255,0.96)" }}>
              <div className="smallMuted">{globalNeeds.length} global needs loaded</div>
              <TopNav goHome={goHome} goGrid={() => (window.location.hash = "#/grid")} goViolent={() => (window.location.hash = "#/violent")} goCheckin={() => (window.location.hash = "#/checkin")} goCommunication={() => (window.location.hash = "#/communication-sins")} goLog={() => (window.location.hash = "#/log")} />
            </div>
          </div>
        </div>

        <div className="panel">
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 20 }}>How this page works</div>
            <div style={{ lineHeight: 1.6, color: "rgba(18, 18, 18, 0.94)" }}>These needs are grouped to make it easier to see that they are broader than one moment of emotion: they include safety, truth, pace, care, agency, and embodied stewardship.</div>
            <div style={{ lineHeight: 1.6, color: "rgba(0, 0, 0, 0.94)" }}>Scripture supports naming our own real needs without excusing sin. Love seeks the good of the neighbor, truth protects reality, wisdom honors limits, and mutual care helps carry burdens without removing personal responsibility.</div>
          </div>
        </div>

        <SectionCard title="List of Needs" subtitle="Select a category to view associated needs." emoji="🧩">
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((group) => {
                const active = selectedCategory?.key === group.key;
                return (
                  <button key={group.key} type="button" onClick={() => setSelectedKey(group.key)} style={{ padding: "10px 14px", borderRadius: 999, border: active ? "1px solid rgba(255,255,255,0.32)" : "1px solid rgba(255,255,255,0.16)", background: active ? "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.16))" : "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))", color: "#ffffff", fontWeight: active ? 900 : 800, cursor: "pointer" }}>
                    {group.title}
                  </button>
                );
              })}
            </div>

            {selectedCategory ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.14)", background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))", padding: 14, color: "rgba(255,255,255,0.96)" }}>
                  <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>{selectedCategory.emoji} {selectedCategory.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.55 }}>{selectedCategory.subtitle}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                  {selectedCategory.items.map((need) => <NeedChip key={need} text={need} />)}
                </div>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="Theological support for needs" subtitle="Scripture clearly supports the human needs listed. We are content in all circumstances through our hope of eternal life with God. On this earth, our needs are not a given, but through these needs we can learn to love and show compassion to others as Christ did. Putting others needs above our own is the definition of compassion." emoji="✝️">
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.14)", background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))", padding: 14, display: "grid", gap: 10 }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: "#ffffff" }}>{theologyBlock.title}</div>
              {(theologyBlock.sections || []).map((section, index) => (
                <div key={`${section.label}-${index}`} style={{ display: "grid", gap: 6 }}>
                  <div style={{ fontWeight: 800, color: "rgba(255,255,255,0.96)" }}>{section.label}</div>
                  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.94)" }}>
                    {(section.bullets || []).map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {(theologyBlock.scriptures || []).map((scripture, index) => <TheologyCard key={`${scripture.ref}-${index}`} refText={scripture.ref} principle={scripture.principle} />)}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Why needs language helps" subtitle="Needs are not selfish demands. Needs are the human conditions that help a person live, relate, regulate, tell the truth, and love well. Naming our needs in a situation guides the one stating them away from accusation towards a path of mutual understanding" emoji="🪜">
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {[
                { title: "Needs are not demands", body: "A need is a human good such as safety, clarity, care, or rest. A demand is a controlling insistence on one particular outcome or person." },
                { title: "Needs do not erase accountability", body: "Naming a need explains what matters; it does not justify coercion, contempt, manipulation, or harm." },
                { title: "Needs help translate emotion", body: "An emotion often becomes more understandable when the person can say what feels threatened, missing, or newly met." },
              ].map((item) => (
                <div key={item.title} style={{ borderRadius: 12, padding: 12, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.96)" }}>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ lineHeight: 1.5, fontSize: 14 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Biblical grounding: needs are human, but how we pursue them matters" subtitle="Scripture affirms creaturely need while still requiring love, repentance, and mutual care." emoji="📖">
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              <TeachingCard title="Human need is not a moral defect" body="People are finite (limited), embodied, relational creatures. Needing safety, honesty, belonging, rest, understanding, and help is not sin, nor are these needs signs of weakness." />
              <TeachingCard title="Sin often enters at the strategy level" body="CS Lewis said in Mere Christianity that all persons are trying to get their needs met, the ones who we would call evil are attempting to meet their needs in distorted ways. A person can seek belonging through control, seek safety through deception, or seek understanding through accusation instead of truth and love." />
              <TeachingCard title="Love carries both care and responsibility" body="Compassion and respect is the pursuit of meeting both others and our own needs (not necessarily wants). We are called to bear burdens together while still refusing manipulation, coercion, and blame-shifting." />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {[
                { refText: "Genesis 2:18", principle: "It is not good for man to be alone; relational need is part of creation, not proof of weakness." },
                { refText: "Matthew 22:37-39", principle: "Love of God and neighbor frames how needs are pursued and how another person's needs are treated." },
                { refText: "1 Corinthians 12:21-26", principle: "The body needs every part; dependence and mutual care are normal in God's design." },
              ].map((item) => (
                <TheologyCard key={item.refText} refText={item.refText} principle={item.principle} />
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              <TeachingCard title="Example: safety" body="Safety is ruineed through lies, domination, or punishing control. Pursuing safety through truth, boundaries, support, and wise pace is consistent with love and godliness." />
              <TeachingCard title="Example: belonging" body="Guilt, pressure, or emotional fusion is not how we are to get our need of belonging met. Accommodating the need of belonging through honesty, mutuality, and faithful presence is more aligned with Scripture." />
              <TeachingCard title="Example: understanding" body="Pursuing understanding through accusation, mind-reading, or endless demand is not loving. Pursuing understanding through clarification, patient listening, and stepwise explanation protects dignity." />
            </div>
          </div>
        </SectionCard>
      </div>

    </div>
  );
}
