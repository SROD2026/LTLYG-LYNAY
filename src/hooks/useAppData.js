// src/hooks/useAppData.js
import { useEffect, useMemo, useState } from "react";
import { validateMaster, printValidation } from "../utils/validateMaster.js";

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

// Keeps the hook resilient if you ever wrap a grid as { grid: [...] } etc.
function normalizeGridLike(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.grid)) return data.grid;
    if (Array.isArray(data.cells)) return data.cells;
    if (Array.isArray(data.checkinGrid)) return data.checkinGrid;
  }
  return [];
}

function normalizeObjectLike(data, fallback = {}) {
  return data && typeof data === "object" && !Array.isArray(data) ? data : fallback;
}

async function loadModularData() {
  const [
    nnmGridRaw,
    violentGridRaw,
    checkinGridRaw,
    emotionPrayerMapRaw,
    emotionMetaRaw,
    checkinMetaRaw,
    needsSupplementRaw,
    violent2Raw,
    violationsRaw,
    protocolsRaw,
    promisesRaw,
    theologyRaw,
    purposeDropdownRaw,
  ] = await Promise.all([
    loadJson("/data/grids/nnmGrid.json"),
    loadJson("/data/grids/violentGrid.json"),
    loadJson("/data/grids/checkinGrid.json"),
    loadJson("/data/content/emotionPrayerMap.json"),
    loadJson("/data/meta/emotionMeta.json"),
    loadJson("/data/meta/checkinMeta.json"),
    loadJson("/data/meta/needsSupplement.json"),
    loadJson("/data/meta/violentCauseMap.json"),
    loadJson("/data/accountability/violations.json"),
    loadJson("/data/accountability/protocols.json"),
    loadJson("/data/accountability/promises.json"),
    loadJson("/data/accountability/theology.json"),
    loadJson("/data/content/purposeDropdown.json"),
  ]);

  const nnmGrid = normalizeGridLike(nnmGridRaw);
  const violentGrid = normalizeGridLike(violentGridRaw);
  const checkinGrid = normalizeGridLike(checkinGridRaw);

  const emotionPrayerMap = normalizeObjectLike(emotionPrayerMapRaw, {});
  const emotion_meta = normalizeObjectLike(emotionMetaRaw, {});
  const checkinMeta = normalizeObjectLike(checkinMetaRaw, {});
  const needs_supplement = normalizeObjectLike(needsSupplementRaw, { global: [] });
  const violent2 = normalizeObjectLike(violent2Raw, {});
  const violations = normalizeObjectLike(violationsRaw, {});
  const protocols = normalizeObjectLike(protocolsRaw, {});
  const promises = normalizeObjectLike(promisesRaw, {});
  const theology = normalizeObjectLike(theologyRaw, {});
  const purposeDropdown = Array.isArray(purposeDropdownRaw) ? purposeDropdownRaw : [];

  const master = {
    meta: {
      schema: "master_accountability_v1_modular_runtime",
      source: "modularized files",
    },

    nnmGrid,
    violentGrid,
    emotion_meta,
    violent2,
    needs_supplement,
    violations,
    violent_map: violations,
    protocols,
    promises,
    theology,
    emotionPrayerMap,

    grids: {
      nnm: nnmGrid,
      violent: violentGrid,
    },
    emotions: {
      meta: emotion_meta,
      violent2,
    },
    needs: {
      supplement: needs_supplement,
    },
    accountability: {
      violations,
      protocols,
      promises,
      theology,
    },
    prayer: {
      emotionPrayerMap,
    },
  };

  return { master, checkinGrid, checkinMeta, purposeDropdown };
}


export default function useAppData() {
  const [master, setMaster] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkinGrid, setCheckinGrid] = useState([]);
  const [checkinMeta, setCheckinMeta] = useState({});
  const [purposeDropdown, setPurposeDropdown] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const data = await loadModularData();
        if (!alive) return;

        const result = validateMaster(data.master);
        printValidation(result);

        if (!result.ok && import.meta?.env?.DEV) {
          throw new Error("Modular data failed validation (see console).");
        }

        setMaster(data.master);
        setCheckinGrid(data.checkinGrid);
        setCheckinMeta(data.checkinMeta);
        setPurposeDropdown(data.purposeDropdown);
        setError(null);
      } catch (e) {
        if (!alive) return;
        setError(e);
        setMaster(null);
        setCheckinGrid([]);
        setCheckinMeta({});
        setPurposeDropdown([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const derived = useMemo(() => {
    const m = master;
    if (!m) return null;

    return {
      emotionKeys: Object.keys(m.emotion_meta || {}),
      violationKeys: Object.keys(m.violations || {}),
      protocolKeys: Object.keys(m.protocols || {}),
      promiseKeys: Object.keys(m.promises || {}),
      theologyKeys: Object.keys(m.theology || {}),
    };
  }, [master]);

  return {
    master,
    derived,
    loading,
    error,
    checkinGrid,
    checkinMeta,
    purposeDropdown,
  };
}
