// src/pages/CommunicationSinPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/layout/Header.jsx";
import TopNav from "../components/layout/TopNav.jsx";
import Panel from "../components/ui/Panel.jsx";
import { getCommunicationPageBackground } from "../utils/pageThemes.js";
import ScriptureRotator from "../components/ui/ScriptureRotator.jsx";


function normalizeItems(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).map(([key, value]) => ({
    key,
    ...(value || {}),
  }));
}

function compactPhrase(s) {
  return String(s || "")
    .replace(/^can\s+/i, "")
    .replace(/^is\s+/i, "")
    .replace(/^may\s+/i, "")
    .trim();
}


function SummaryBanner({ item }) {
  const common = Array.isArray(item?.common_forms) ? item.common_forms : [];
  const harm = Array.isArray(item?.harm_impact) ? item.harm_impact : [];
const repair = Array.isArray(item?.repair_steps) && item.repair_steps.length
    ? item.repair_steps
    : Array.isArray(item?.love_repair)
      ? item.love_repair
      : [];
        const empathy = Array.isArray(item?.empathy_prompts) ? item.empathy_prompts : [];

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.14)",
        background:
          "linear-gradient(180deg, rgb(116, 129, 214), rgb(174, 164, 211))",
        padding: 14,
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
 <div style={{ fontWeight: 900, marginBottom: 6 }}>What repair sounds like when this communication pattern is present</div>
          <div style={{ lineHeight: 1.5, fontSize: 14, opacity: 0.94 }}>
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
            border: "1px solid rgba(255,120,120,0.18)",
            background: "rgba(255,120,120,0.18)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Why this pattern matters</div>
          <div style={{ lineHeight: 1.5, fontSize: 14, opacity: 0.94 }}>
            {harm.length ? compactPhrase(harm[0]) : "It can damage trust, clarity, dignity, and safety."}
          </div>
        </div>

        <div
          style={{
            borderRadius: 12,
            padding: 12,
            border: "1px solid rgba(120,220,160,0.18)",
            background: "rgba(120,220,160,0.18)",
          }}
        >
                    <div style={{ fontWeight: 900, marginBottom: 6 }}>What this harmful pattern often looks like</div>
          <div style={{ lineHeight: 1.5, fontSize: 14, opacity: 0.94 }}>
            {common.length ? compactPhrase(common[0]) : "A harmful communication pattern that needs to be named clearly."}
          </div>

         
        </div>
      </div>
    </div>
  );
}

function CategoryVisual({ emoji, title, subtitle }) {
  return (
    <div
      style={{
        minHeight: 168,
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.18)",
background:
"linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.30))",
        display: "grid",
        placeItems: "center",
        padding: 18,
        textAlign: "center",
        boxShadow: "0 10px 24px rgba(35, 32, 82, 0.10)",
        backdropFilter: "blur(3px)",
      }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ fontSize: 46, lineHeight: 1 }}>{emoji}</div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#000000",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.45,
            color: "#000000",
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function SinChip({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.22)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.18))",
color: "#1b1f3b",
        padding: "14px 14px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: 14,
        lineHeight: 1.28,
        fontWeight: 800,
        boxShadow: "0 8px 18px rgba(35, 32, 82, 0.10)",
        backdropFilter: "blur(3px)",
        transition:
          "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 12px 22px rgba(35, 32, 82, 0.14)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)";
        e.currentTarget.style.background =
          "linear-gradient(180deg, rgba(255,255,255,0.36), rgba(255,255,255,0.22))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0 8px 18px rgba(35, 32, 82, 0.10)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
        e.currentTarget.style.background =
          "linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.18))";
      }}
    >
      <div style={{ fontWeight: 900 }}>{item.title || item.key}</div>
    </button>
  );
}

function SectionList({ title, intro, emoji, subtitle, items, onOpen }) {
  return (
    <Panel
  style={{
    display: "grid",
    gap: 14,
    background: "linear-gradient(180deg, rgba(244, 207, 249, 0.62), rgba(93, 57, 184, 0.64))",
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 10px 24px rgba(35, 32, 82, 0.08)",
  }}
>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#000000" }}>
          {title}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: "#000000" }}>
          {intro}
        </div>
      </div>

      <div
      className="mobileStack"
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <CategoryVisual emoji={emoji} title={title} subtitle={subtitle} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 10,
            
          }}
        >
          {items.map((item) => (
            <SinChip key={item.key} item={item} onClick={onOpen} />
          ))}
        </div>
      </div>
    </Panel>
  );
}



function TheologyMiniCard({ title, body, verses = [] }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgb(0, 0, 0)",
        background: "linear-gradient(180deg, rgba(254, 253, 255, 0.92), rgb(112, 47, 216))",
        padding: 14,
        display: "grid",
        gap: 10,
        boxShadow: "0 8px 18px rgba(35, 32, 82, 0.29)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 900, color: "#000000", lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(0, 0, 0, 0.95)" }}>{body}</div>
      {verses.length ? (
  <ScriptureRotator
    scriptures={verses}
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
) : null}
    </div>
  );
}

function getSectionTone(type) {
  switch (type) {
    case "scripture":
      return {
        bg: "linear-gradient(180deg, rgba(120, 133, 230, 0.99), rgba(20, 169, 27, 0.88))",
        border: "rgba(96,104,168,0.35)",
        color: "#ffffff",
      };
    case "forms":
      return {
        bg: "linear-gradient(180deg, rgba(251, 187, 67, 0.94), rgba(241, 226, 52, 0.95))",
        border: "rgba(210,170,95,0.35)",
        color: "#ffffff",
      };
    case "harm":
      return {
        bg: "linear-gradient(180deg, rgba(255, 68, 68, 0.97), rgba(91, 4, 4, 0.95))",
        border: "rgba(188,94,94,0.35)",
        color: "#ffffff",
      };
    case "conviction":
      return {
        bg: "linear-gradient(180deg, rgba(26, 255, 110, 0.42), rgba(247, 188, 12, 0.93))",
        border: "rgba(70,140,96,0.35)",
        color: "#ffffff",
      };
    case "empathy":
      return {
        bg: "linear-gradient(180deg, rgba(90, 206, 249, 0.77), rgba(4, 125, 155, 0.95))",
        border: "rgba(78,146,170,0.35)",
        color: "#ffffff",
      };
    case "love":
  return {
    bg: "linear-gradient(180deg, rgba(221, 74, 251, 0.73), rgb(205, 215, 112))",
    border: "rgb(170, 220, 90)",
    color: "#ffffff",
  };
  case "repair":
      return {
        bg: "linear-gradient(180deg, rgba(104, 225, 170, 0.96), rgba(17, 132, 88, 0.95))",
        border: "rgba(70,160,120,0.35)",
        color: "#ffffff",
      };
    case "application":
      return {
        bg: "linear-gradient(180deg, rgba(255, 205, 96, 0.96), rgba(196, 122, 16, 0.95))",
        border: "rgba(190,140,55,0.35)",
        color: "#ffffff",
      };
    case "interrupts":
      return {
        bg: "linear-gradient(180deg, rgba(186, 145, 255, 0.96), rgba(95, 54, 166, 0.95))",
        border: "rgba(132,102,188,0.35)",
        color: "#ffffff",
      };
    case "reflection":
      return {
        bg: "linear-gradient(180deg, rgba(140, 201, 255, 0.96), rgba(36, 103, 180, 0.95))",
        border: "rgba(82,132,188,0.35)",
        color: "#ffffff",
      };
    case "needs":
      return {
        bg: "linear-gradient(180deg, rgba(255, 182, 193, 0.96), rgba(173, 74, 108, 0.95))",
        border: "rgba(185,100,130,0.35)",
        color: "#ffffff",
      };
  default:
      return {
        bg: "rgba(255,255,255,0.08)",
        border: "rgba(255,255,255,0.12)",
        color: "#ffffff",
      };
  }
}

function SectionCard({ type, title, children, isOpen, onToggle }) {
  const tone = getSectionTone(type);

  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: "#ffffff",
        overflow: "hidden",
        boxShadow: isOpen
          ? "0 10px 20px rgba(0,0,0,0.18)"
          : "0 6px 14px rgba(0,0,0,0.12)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          color: "#ffffff",
          textAlign: "left",
          cursor: "pointer",
          padding: "12px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          fontWeight: 900,
          fontSize: 16,
          textShadow: "0 1px 3px rgba(0,0,0,0.45)",
        }}
      >
        <span>{title}</span>
        <span
          style={{
            fontSize: 18,
            opacity: 0.9,
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
          }}
        >
          ›
        </span>
      </button>

      {isOpen ? (
        <div
          style={{
            padding: "10px 16px 16px",
            display: "grid",
            gap: 10,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function BulletList({ items, compact = false, textColor = "#000000" }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const shown = compact ? items.slice(0, 4) : items;

  return (
    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55, color: textColor }}>
      {shown.map((x, i) => (
        <li key={i} style={{ marginBottom: 6 }}>
          {String(x)}
        </li>
      ))}
    </ul>
  );
}


function ConvictionColumns({ block }) {
  if (!block || typeof block !== "object") return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}
    >
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 12,
          padding: 12,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Guilt / conviction</div>
        <BulletList items={block.guilt} textColor="rgba(255,255,255,0.96)" />
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 12,
          padding: 12,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Shame</div>
        <BulletList items={block.shame} textColor="rgba(255,255,255,0.96)" />
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 12,
          padding: 12,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Love-led reframe</div>
        <BulletList items={block.love_led_reframe} textColor="rgba(255,255,255,0.96)" />
      </div>
    </div>
  );
}

function MiniHeading({ children }) {
  return (
    <div
      style={{
        marginTop: 4,
        marginBottom: 4,
        fontSize: 14,
        fontWeight: 900,
        color: "rgba(255,255,255,0.98)",
        textTransform: "uppercase",
        letterSpacing: 0.2,
      }}
    >
      {children}
    </div>
  );
}

function CollapsiblePanel({ title, children, defaultOpen = false, background }) {
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
          padding: "1px 16px",
          borderRadius: 5,
          transition: "background 0.15ms ease",
          margin: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          textAlign: "left",
          color: "#111111",
          fontWeight: 900,
          fontSize: 22,
        }}
      >
        <span>{title}</span>
        <span
          style={{
            fontSize: 22,
            lineHeight: 1,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
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

function SinModal({ item, onClose }) {
  const [openSection, setOpenSection] = useState(null);
const repairSteps = item?.repair_steps || [];
const empathyVisibility =
  item?.empathy_visibility &&
  (
    item.empathy_visibility.summary ||
    (Array.isArray(item.empathy_visibility.hidden_reactions) &&
      item.empathy_visibility.hidden_reactions.length > 0) ||
    (Array.isArray(item.empathy_visibility.processed_later) &&
      item.empathy_visibility.processed_later.length > 0)
  )
    ? item.empathy_visibility
    : null;
const conversationApplication = item?.conversation_application || null;
const practiceInterrupts = item?.practice_interrupts || [];
const reflectionQuestions = item?.reflection_questions || [];
const requestFlowNeeds = item?.request_flow_needs || [];

  useEffect(() => {
    setOpenSection(null);
  }, [item]);

  if (!item) return null;

  const empathy = Array.isArray(item.empathy_prompts) ? item.empathy_prompts : [];
  const loveRepair = Array.isArray(item.love_repair) ? item.love_repair : [];
  const commonForms = Array.isArray(item.common_forms) ? item.common_forms : [];
  const harmImpact = Array.isArray(item.harm_impact) ? item.harm_impact : [];
   const scriptures = Array.isArray(item.scriptures)
    ? item.scriptures
    : Array.isArray(item.scripture)
      ? item.scripture
      : [];

  return (
    <div
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
  padding:
  window.innerWidth <= 520
    ? "max(12px, env(safe-area-inset-top)) max(22px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(22px, env(safe-area-inset-left))"
    : "max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))",
    background: "rgba(10,12,20,0.52)",
  backdropFilter: "blur(3px)",
  WebkitBackdropFilter: "blur(3px)",
}}
    >
      <div
        style={{
          width: "min(1040px, 100%)",
          margin: "40px auto",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.14)",
background: "linear-gradient(180deg, rgba(33,40,58,0.98), rgba(24,30,44,0.98))",
          color: "rgba(255,255,255,0.94)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 4,
            width: "100%",
            background:
              "linear-gradient(90deg, rgba(255,210,120,0.95), rgba(255,120,120,0.95), rgba(160,130,255,0.95))",
          }}
        />

        <div
          style={{
            padding: 18,
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
            <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.05 }}>
              {item.title || item.key}
            </div>
            {item.definition ? (
              <div style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.92 }}>
                {item.definition}
              </div>
            ) : null}
          </div>

          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div style={{ padding: "0 18px 18px", display: "grid", gap: 14 }}>
          <SummaryBanner item={item} />

          <SectionCard
            type="love"
            title="What love does instead"
            isOpen={openSection === "love"}
            onToggle={() => setOpenSection(openSection === "love" ? null : "love")}
          >
            <BulletList items={loveRepair} />
          </SectionCard>

 {repairSteps.length > 0 ? (
            <SectionCard
              type="repair"
              title="Repair steps"
              isOpen={openSection === "repair"}
              onToggle={() =>
                setOpenSection(openSection === "repair" ? null : "repair")
              }
            >
              <BulletList items={repairSteps} textColor="rgba(255,255,255,0.97)" />
            </SectionCard>
          ) : null}

          <SectionCard
            type="scripture"
            title="Scripture"
            isOpen={openSection === "scripture"}
            onToggle={() =>
              setOpenSection(openSection === "scripture" ? null : "scripture")
            }
          >
<ScriptureRotator
  scriptures={scriptures}
    perPage={2}
  title=""
  buttonLabel="Show more"
  emptyText="(No scriptures available.)"
/>          </SectionCard>

          <SectionCard
            type="forms"
            title="Common forms"
            isOpen={openSection === "forms"}
            onToggle={() => setOpenSection(openSection === "forms" ? null : "forms")}
          >
            <BulletList items={commonForms} />
          </SectionCard>

          <SectionCard
            type="harm"
            title="How this can harm"
            isOpen={openSection === "harm"}
            onToggle={() => setOpenSection(openSection === "harm" ? null : "harm")}
          >
            <BulletList items={harmImpact} />
          </SectionCard>

{empathyVisibility ? (
            <SectionCard
              type="empathy"
              title="Unseen impact"
              isOpen={openSection === "unseen-impact"}
              onToggle={() =>
                setOpenSection(openSection === "unseen-impact" ? null : "unseen-impact")
              }
            >
              {empathyVisibility.summary ? (
                <div style={{ lineHeight: 1.6 }}>{empathyVisibility.summary}</div>
              ) : null}

              {Array.isArray(empathyVisibility.hidden_reactions) &&
              empathyVisibility.hidden_reactions.length > 0 ? (
                <>
                  <MiniHeading>Hidden reactions</MiniHeading>
                  <BulletList
                    items={empathyVisibility.hidden_reactions}
                    textColor="rgba(255,255,255,0.97)"
                  />
                </>
              ) : null}

              {Array.isArray(empathyVisibility.processed_later) &&
              empathyVisibility.processed_later.length > 0 ? (
                <>
                  <MiniHeading>Often processed later</MiniHeading>
                  <BulletList
                    items={empathyVisibility.processed_later}
                    textColor="rgba(255,255,255,0.97)"
                  />
                </>
              ) : null}
            </SectionCard>
          ) : null}

          <SectionCard
            type="conviction"
            title="LOVE motivation: Conviction, not shame"
            isOpen={openSection === "conviction"}
            onToggle={() =>
              setOpenSection(openSection === "conviction" ? null : "conviction")
            }
          >
            <ConvictionColumns block={item.conviction_not_shame} />
          </SectionCard>

          <SectionCard
            type="empathy"
            title="Empathy for the person harmed"
            isOpen={openSection === "empathy"}
            onToggle={() =>
              setOpenSection(openSection === "empathy" ? null : "empathy")
            }
          >
            
            <BulletList items={empathy} textColor="rgba(255,255,255,0.97)" />
                      </SectionCard>

            {conversationApplication ? (
            <SectionCard
              type="application"
              title="Conversation application"
              isOpen={openSection === "application"}
              onToggle={() =>
                setOpenSection(openSection === "application" ? null : "application")
              }
            >
              
              {conversationApplication.before ? (
                <>
                  <MiniHeading>Before speaking</MiniHeading>
                  <div style={{ lineHeight: 1.6 }}>{conversationApplication.before}</div>
                </>
              ) : null}

              {conversationApplication.during ? (
                <>
                  <MiniHeading>While speaking</MiniHeading>
                  <div style={{ lineHeight: 1.6 }}>{conversationApplication.during}</div>
                </>
              ) : null}

              {conversationApplication.after ? (
                <>
                  <MiniHeading>After harm happens</MiniHeading>
                  <div style={{ lineHeight: 1.6 }}>{conversationApplication.after}</div>
                </>
              ) : null}
            </SectionCard>
          ) : null}

          {practiceInterrupts.length > 0 ? (
            <SectionCard
              type="interrupts"
              title="Practice interrupts"
              isOpen={openSection === "interrupts"}
              onToggle={() =>
                setOpenSection(openSection === "interrupts" ? null : "interrupts")
              }
            >
              <BulletList
                items={practiceInterrupts}
                textColor="rgba(255,255,255,0.97)"
              />
            </SectionCard>
          ) : null}
          
           {reflectionQuestions.length > 0 ? (
            <SectionCard
              type="reflection"
              title="Reflection questions"
              isOpen={openSection === "reflection"}
              onToggle={() =>
                setOpenSection(openSection === "reflection" ? null : "reflection")
              }
            >
              <BulletList
                items={reflectionQuestions}
                textColor="rgba(255,255,255,0.97)"
              />
            </SectionCard>
          ) : null}
{requestFlowNeeds.length > 0 ? (
            <SectionCard
              type="needs"
              title="Needs underneath this pattern"
              isOpen={openSection === "needs"}
              onToggle={() =>
                setOpenSection(openSection === "needs" ? null : "needs")
              }
            >
              <BulletList
                items={requestFlowNeeds}
                textColor="rgba(255,255,255,0.97)"
              />
            </SectionCard>
          ) : null}

        </div>
      </div>
    </div>
  );
}

const THEOLOGY_FOUNDATION_VERSES = {
  correction: [
    { ref: "Matthew 23:4", principle: "Jesus rebukes leaders who burden others without helping them." },
    { ref: "Matthew 23:13", principle: "Jesus confronts leaders whose actions block others from God." },
    { ref: "Matthew 23:23-28", principle: "Jesus names hypocrisy concretely and calls for inward and outward integrity." },
    { ref: "John 8:10-11", principle: "Jesus refuses condemnation while still calling the woman to leave sin." },
    { ref: "Luke 19:8-10", principle: "Jesus' presence leads Zacchaeus toward restitution and changed behavior." },
    { ref: "Mark 10:21", principle: "Jesus speaks truth in love, exposing what must change." },
    { ref: "Revelation 3:19", principle: "The Lord rebukes and disciplines those he loves, calling them to repent." },
    { ref: "Luke 22:61-62", principle: "Jesus' truthful look brings Peter to conviction, not mere humiliation." },
    { ref: "John 21:15-17", principle: "Jesus restores Peter through direct questions and renewed calling." },
    { ref: "Matthew 18:15", principle: "Sin is to be addressed directly and specifically for restoration." },
  ],

  emotions: [
    { ref: "Galatians 6:5", principle: "Each person bears their own load; responsibility remains personal." },
    { ref: "James 1:19-20", principle: "Human anger does not produce God's righteousness." },
    { ref: "Ephesians 4:26-29", principle: "Emotion must not become sinful speech; words must still build up." },
    { ref: "Proverbs 29:11", principle: "A fool vents fully, but wisdom restrains and orders emotion." },
    { ref: "Proverbs 16:32", principle: "Self-control is better than raw emotional force." },
    { ref: "1 Peter 5:7", principle: "Anxiety is to be brought to God rather than used to control others." },
    { ref: "Psalm 62:8", principle: "God invites honest emotional pouring-out before him." },
    { ref: "Genesis 4:6-7", principle: "Strong feeling does not excuse sin; it must be ruled rightly." },
    { ref: "Ecclesiastes 7:9", principle: "Quick anger leads toward foolishness." },
    { ref: "Philippians 4:6-7", principle: "Distress is to be redirected through prayer, thanksgiving, and peace in God." },
  ],

  thoughts: [
    { ref: "Romans 12:2", principle: "Transformation comes through renewal of the mind." },
    { ref: "2 Corinthians 10:5", principle: "Thoughts are to be taken captive in obedience to Christ." },
    { ref: "Matthew 15:18-19", principle: "Words and corrupt actions flow out of the heart." },
    { ref: "James 1:14-15", principle: "Disordered inner desire grows outward into sin." },
    { ref: "Luke 6:45", principle: "The mouth speaks from what fills the heart." },
    { ref: "Proverbs 4:23", principle: "The heart must be guarded because life flows from it." },
    { ref: "Philippians 4:8", principle: "Thought life should be directed toward what is true and excellent." },
    { ref: "Colossians 3:2", principle: "The mind is to be set on higher things, not ruled by impulse." },
    { ref: "Ephesians 4:22-24", principle: "Repentance includes putting off the old self and renewing the mind." },
    { ref: "Psalm 19:14", principle: "Both meditation and speech are to be acceptable before God." },
  ],
};

export default function CommunicationSinPage({ goHome }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
const detailRef = useRef(null);



  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setError("");
        const res = await fetch("/data/accountability/communicationSins.json", {
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

useEffect(() => {
  if (!selectedItem) return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [selectedItem]);

  const speechItems = useMemo(() => normalizeItems(data?.speech_sins), [data]);
  const relationalItems = useMemo(() => normalizeItems(data?.relational_sins), [data]);
  const heartItems = useMemo(() => normalizeItems(data?.heart_sins), [data]);

  const meta = data?.meta || {};
  const categories = data?.categories || {};

  const pageStyle = {
    "--text": "#1f2338",
    "--muted": "#5f6387",
    "--card": "rgba(255,255,255,0.78)",
    "--border": "rgba(90,92,150,0.16)",
    "--shadow": "0 14px 34px rgba(92,92,170,0.14)",
    "--btn-bg": "rgba(255,255,255,0.34)",
    "--btn-border": "rgba(90,92,150,0.20)",
    "--btn-text": "#2b2d48",
    ...getCommunicationPageBackground(),
  };

  return (
    <div className="container" style={pageStyle}>
<div
  className="appShell"
  style={{
    gap: 16,
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
  }}
>
    <div className="panel textOutlineGreen">
  <div style={{ display: "grid", gap: 16 }}>
    <div className="pageMetaRow">
      <div className="pageHeaderTitle" style={{ minWidth: 0, maxWidth: 1120 }}>
        <Header
          title={meta.title || "How words can harm, and how love repairs"}
          subtitle={
            <>
              This section helps name harmful communication patterns honestly,
              compare them with Scripture, understand their impact, and move
              toward conviction, empathy, repentance, repair, and love-led change.
            </>
          }
        />
      </div>

      <div
  className="pageTopNavWrap"
  style={{
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 12
  }}
>
        <TopNav
          goHome={goHome}
          goGrid={() => (window.location.hash = "#/grid")}
          goViolent={() => (window.location.hash = "#/violent")}
          goCheckin={() => (window.location.hash = "#/checkin")}
          goNeeds={() => (window.location.hash = "#/needs")}
          goPrayer={() => (window.location.hash = "#/prayer")}
          goLog={() => (window.location.hash = "#/log")}
        />
      </div>
    </div>
  </div>
</div>

<CollapsiblePanel
  title="Purpose"
  defaultOpen={false}
  background="linear-gradient(180deg, rgb(242, 242, 243), rgb(167, 107, 250))"
>
  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55, color: "#111111" }}>
    {(meta.purpose || []).map((x, i) => (
      <li key={i}>{String(x)}</li>
    ))}
  </ul>
</CollapsiblePanel>

<CollapsiblePanel
  title="Framing"
  defaultOpen={false}
  background="linear-gradient(180deg, rgb(242, 242, 243), rgb(167, 107, 250))"
>
  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55, color: "#111111" }}>
    {(meta.framing || []).map((x, i) => (
      <li key={i}>{String(x)}</li>
    ))}
  </ul>
</CollapsiblePanel>


        {error ? (
          <div className="panel">
            <div style={{ color: "rgba(255,160,160,0.96)" }}>
              Could not load <b>communicationSins.json</b>: {error}
            </div>
          </div>
        ) : null}

        <SectionList
        
          title={categories?.speech_sins?.title || "Speech "}
          intro={
            categories?.speech_sins?.intro ||
            "Words can wound, distort reality, strip dignity, and damage safety."
          }
          emoji="🗣️"
          subtitle="Words, tone, framing, accusation, distortion, omission"
          items={speechItems}
          onOpen={setSelectedItem}
        />

        <SectionList
          title={categories?.relational_sins?.title || "Relational sins"}
          intro={
            categories?.relational_sins?.intro ||
            "These patterns affect presence, repair, trust, safety, and accountability."
          }
          emoji="🤝"
          subtitle="Presence, repair, ownership, withdrawal, blame, defensiveness"
          items={relationalItems}
          onOpen={setSelectedItem}
        />

        <SectionList
          title={categories?.heart_sins?.title || "Heart sins"}
          intro={
            categories?.heart_sins?.intro ||
            "These patterns identify deeper inward motives that often drive harmful communication."
          }
          emoji="❤️"
          subtitle="Pride, self-protection, hardness, control, fear, lack of love"
          items={heartItems}
          onOpen={setSelectedItem}
        />

<CollapsiblePanel
  title="Theological foundations for communication"
  defaultOpen={false}
  background="linear-gradient(180deg, rgba(254, 247, 255, 0.75), rgba(120, 31, 215, 0.64))"
  
>
  <div className="theologyPanel">
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(28, 26, 26, 0.94)" }}>
        This page names sinful communication patterns, but it also grounds communication in a biblical framework:
        Jesus corrects toward repentance, emotions do not excuse sin, and inner thought patterns shape the words
        that eventually come out.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
       <TheologyMiniCard
  title="Jesus corrects actions to call people toward change"
  body="Behavior-based correction makes repair possible. Identity attacks usually trap people in shame and defensiveness. Jesus' strongest public rebukes were aimed at leaders who burdened others and blocked access to God, while many individual encounters followed a pattern of truthful exposure plus invitation to repent."
  verses={THEOLOGY_FOUNDATION_VERSES.correction}
/>

<TheologyMiniCard
  title="Emotions are real signals, not moral permission"
  body="This tool takes emotions seriously, but it does not treat emotion as final authority. Feeling angry, afraid, ashamed, or hurt may reveal something true about need, threat, or loss; it does not justify contempt, deception, manipulation, or blame-shifting. Biblical maturity asks not only what I feel, but what I am doing with what I feel."
  verses={THEOLOGY_FOUNDATION_VERSES.emotions}
/>

<TheologyMiniCard
  title="Thoughts become words, and words become patterns"
  body="Communication does not begin at the mouth. Rehearsed thoughts shape emotional intensity; emotions influence tone and impulse; repeated speech and action become habits that either strengthen love or reinforce sin. That is why repentance includes mind renewal, truthfulness, and earlier interruption of distortion."
  verses={THEOLOGY_FOUNDATION_VERSES.thoughts}
/>
      </div>
    </div>
  </div>
</CollapsiblePanel>
      </div>

      <SinModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
    
  );
}