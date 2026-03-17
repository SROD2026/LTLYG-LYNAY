// src/components/ui/ScriptureRotator.jsx

import { useEffect, useMemo, useState } from "react";
import ScriptureText from "../common/ScriptureText.jsx";

function normalizeScripture(item) {
  if (!item) return null;

  if (typeof item === "string") {
    const parts = item.split("—");

    if (parts.length >= 2) {
      return {
        ref: parts[0].trim(),
        principle: "",
      };
    }

    return {
      ref: item.trim(),
      principle: "",
    };
  }

  if (typeof item === "object") {
    return {
      ref: String(item.ref || "").trim(),
      principle: "",
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
          gap: 8,
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
    gap: 6,
    width: "100%",
    ...containerStyle,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: -2,
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
              padding: "7px 11px",
              fontSize: 12,
              borderRadius: 10,
              alignSelf: "flex-start",
              marginTop: -2,
            }}
          >
            {buttonLabel}
          </button>
        ) : null}
      </div>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      typeof window !== "undefined" && window.innerWidth <= 640
        ? "1fr"
        : "repeat(2, minmax(0, 1fr))",
    gap: 10,
    width: "100%",
    alignItems: "stretch",
  }}
>

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
<ScriptureText reference={s.ref} showCopyright={false} />
            ) : null}
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 11,
          opacity: 0.7,
          lineHeight: 1.4,
          marginTop: 2,
        }}
      >
        Scripture quotations are from the ESV® Bible (The Holy Bible, English
        Standard Version®), © 2001 by Crossway, a publishing ministry of Good
        News Publishers. Used by permission. All rights reserved.
      </div>
    </div>
  );
}