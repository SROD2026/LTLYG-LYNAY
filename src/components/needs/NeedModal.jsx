import { useEffect, useRef } from "react";
import ScriptureRotator from "../ui/ScriptureRotator.jsx";

function SectionBlock({ title, children }) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.08)",
        padding: 14,
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 18, color: "#ffffff" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
    <ul
      style={{
        margin: 0,
        paddingLeft: 18,
        lineHeight: 1.6,
        color: "rgba(255,255,255,0.94)",
      }}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function NeedModal({ open, onClose, detail }) {

  const modalBackdropRef = useRef(null);
const modalCardRef = useRef(null);

  useEffect(() => {
  if (!open || !detail) return;

  const id = window.setTimeout(() => {
    if (modalBackdropRef.current) {
      modalBackdropRef.current.scrollTop = 0;
    }

    if (modalCardRef.current) {
      modalCardRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "nearest",
      });
    }
  }, 0);

  return () => window.clearTimeout(id);
}, [open, detail]);


  if (!open || !detail) return null;

  return (
    <div
      ref={modalBackdropRef}
      role="dialog"
      aria-modal="true"
      className="modalBackdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflowY: "auto",
        display: "grid",
        background: "rgba(10,12,20,0.52)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
    >
      <div
      ref={modalCardRef}
        className="modalCard"
        style={{
          justifySelf: "center",
          position: "relative",
          borderRadius: 18,
          border: "1px solid rgba(120,255,220,0.22)",
          background:
            "linear-gradient(180deg, rgba(20,28,38,0.98), rgba(18,24,32,0.97))",
          color: "rgba(255,255,255,0.96)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.50)",
          overflow: "visible",
          pointerEvents: "auto",
        }}
      >
        <div
          className="modalHeader"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 16,
            alignItems: "start",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div style={{ display: "grid", gap: 8, minWidth: 0 }}>
            <div
              className="modalTitle"
              style={{
                fontSize: "clamp(28px, 7vw, 34px)",
                fontWeight: 900,
                lineHeight: 1.05,
                color: "#ffffff",
              }}
            >
              {detail.title}
            </div>

            <div
              className="modalSubtitle"
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.80)",
              }}
            >
              {detail.categoryTitle}
            </div>

            <div
              className="modalSubtitle"
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.92)",
                maxWidth: 760,
              }}
            >
              {detail.definition}
            </div>
          </div>

          <div
            className="modalHeaderActions"
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div
          style={{ padding: "18px", display: "grid", gap: 14 }}
        >
          <SectionBlock title="Biblical examples">
            <BulletList items={detail.biblicalExamples} />
          </SectionBlock>

          <SectionBlock title="Scripture support">
            <ScriptureRotator
              scriptures={detail.scriptures || []}
              perPage={2}
              title=""
              buttonLabel="Show more"
              emptyText="(No scriptures added yet.)"
            />
          </SectionBlock>

          <SectionBlock title="Harms when this need is not met">
            <BulletList items={detail.harms} />
          </SectionBlock>

          <SectionBlock title="Healthy ways this need can be supported">
            <BulletList items={detail.healthyWays} />
          </SectionBlock>

          <SectionBlock title="Distortion risks when trying to meet this need sinfully">
            <BulletList items={detail.distortionRisks} />
          </SectionBlock>
        </div>
      </div>
    </div>
  );
}