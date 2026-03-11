// src/components/ui/ScriptureRotator.jsx

import { useEffect, useMemo, useState } from "react";

function normalizeScripture(item) {
  if (!item) return null;

  if (typeof item === "string") {
    const parts = item.split("—");
    if (parts.length >= 2) {
      return {
        ref: parts[0].trim(),
        principle: parts.slice(1).join("—").trim(),
      };
    }

    return {
      ref: "",
      principle: item.trim(),
    };
  }

  if (typeof item === "object") {
    return {
      ref: String(item.ref || "").trim(),
      principle: String(item.principle || item.text || "").trim(),
    };
  }

  return null;
}

function chunkItems(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export default function ScriptureRotator({
  scriptures = [],
  title = "Scripture",
  perPage = 2,
  buttonLabel = "More scripture",
  emptyText = "(No scriptures available.)",
  cardStyle = {},
  containerStyle = {},
  titleStyle = {},
}) {
  const normalized = useMemo(() => {
    return (Array.isArray(scriptures) ? scriptures : [])
      .map(normalizeScripture)
      .filter((x) => x && (x.ref || x.principle));
  }, [scriptures]);

useEffect(() => {
  setPageIndex(0);
}, [scriptures, perPage]);

  const safePerPage = Math.max(1, Number(perPage) || 1);

  const pages = useMemo(() => {
    return chunkItems(normalized, safePerPage);
  }, [normalized, safePerPage]);

  const [pageIndex, setPageIndex] = useState(0);

  const currentPage = pages[pageIndex] || [];

  function handleNext() {
    if (!pages.length) return;
    setPageIndex((prev) => (prev + 1) % pages.length);
  }

  if (!normalized.length) {
    return (
      <div
        style={{
          display: "grid",
          gap: 10,
          ...containerStyle,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            ...titleStyle,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 13,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        ...containerStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontWeight: 900,
            ...titleStyle,
          }}
        >
          {title}
        </div>

        {pages.length > 1 ? (
          <button
            type="button"
            className="btn"
            onClick={handleNext}
            style={{
              padding: "8px 12px",
              fontSize: 12,
              borderRadius: 10,
            }}
          >
            {buttonLabel}
          </button>
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {currentPage.map((s, idx) => (
          <div
            key={`${s.ref}-${s.principle}-${idx}`}
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 12,
              padding: 12,
              background: "rgba(255,255,255,0.05)",
              ...cardStyle,
            }}
          >
            {s.ref ? (
              <div
                style={{
                  fontWeight: 900,
                  marginBottom: 6,
                  color: "rgba(255,255,255,0.96)",
                }}
              >
                {s.ref}
              </div>
            ) : null}

            <div
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.92)",
              }}
            >
              {s.principle}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}