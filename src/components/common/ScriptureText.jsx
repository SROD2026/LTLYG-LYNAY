import { useEffect, useState } from "react";
import { fetchEsvVerse, getCachedVerse } from "../../utils/esv.js";

const verseCache = {};

function cleanVerseText(raw) {
  return String(raw || "")
    .replace(/^[^\n]*\n/, "")          // remove first line reference
    .replace(/\[[^\]]+\]/g, "")        // remove [1], [a], [b]
    .replace(/\*/g, "")                // remove asterisks
    .replace(/\u00a0/g, " ")           // normalize nbsp
    .replace(/[ \t]+\n/g, "\n")        // trim line-end spaces
    .replace(/\n{3,}/g, "\n\n")        // collapse huge gaps
    .replace(/[ \t]{2,}/g, " ")        // collapse repeated spaces
    .trim();
}

export default function ScriptureText({ reference, showCopyright = true }) {
  const initialCached =
    verseCache[reference] || cleanVerseText(getCachedVerse(reference) || "");

  const [text, setText] = useState(initialCached);
  const [loading, setLoading] = useState(() => !initialCached);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!reference) {
        setText("");
        setLoading(false);
        setError("");
        return;
      }

      const memCached = verseCache[reference];
      if (memCached) {
        setText(memCached);
        setLoading(false);
        setError("");
        return;
      }

      const storedCached = getCachedVerse(reference);
      if (storedCached) {
        const cleaned = cleanVerseText(storedCached);
        verseCache[reference] = cleaned;
        setText(cleaned);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const verse = await fetchEsvVerse(reference);
        if (!alive) return;

        const cleaned = cleanVerseText(verse);
        verseCache[reference] = cleaned;
        setText(cleaned);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Unable to load Scripture.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [reference]);

  return (
    <div
      style={{
        display: "grid",
        gap: 8,
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 13,
          opacity: 0.9,
        }}
      >
        {reference}
      </div>

      {loading ? (
        <div
          style={{
            fontSize: 14,
            opacity: 0.8,
          }}
        >
          Loading verse...
        </div>
      ) : error ? (
        <div
          style={{
            fontSize: 14,
            color: "#ffb3b3",
          }}
        >
          {error}
        </div>
      ) : (
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            opacity: 0.95,
          }}
        >
          {text}
        </div>
      )}

      {showCopyright ? (
        <div
          style={{
            fontSize: 11,
            opacity: 0.7,
            lineHeight: 1.4,
          }}
        >
          Scripture quotations are from the ESV® Bible (The Holy Bible, English
          Standard Version®), © 2001 by Crossway, a publishing ministry of Good
          News Publishers. Used by permission. All rights reserved.
        </div>
      ) : null}
    </div>
  );
}