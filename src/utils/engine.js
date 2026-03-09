import engine from "../data/accountability_engine.json";

export function getEmotionNeeds(emotion) {
  return engine.emotions.nonviolent[emotion]?.needs ?? [];
}

export function getViolationProtocols(v) {
  return engine.violations[v]?.protocol_links ?? [];
}