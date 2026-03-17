import Select from "../ui/Select.jsx";

export default function BehavioralViolationBlock({
  master,
  selectedKey,
  onChangeKey,
  selectedObs,
  onChangeObs,
  title = "Behavioral violation",
  mode = "accountable",
  autoGuessText = "",
}) {
  const violations = master?.violations || {};

  const violationOptions = Object.entries(violations).map(([key, value]) => ({
    value: key,
    label: value?.label || value?.title || key.replaceAll("_", " "),
  }));

  const selectedViolation = selectedKey ? violations?.[selectedKey] : null;

  const observationTemplates = Array.isArray(selectedViolation?.observation_templates)
    ? selectedViolation.observation_templates
    : Array.isArray(selectedViolation?.observations)
      ? selectedViolation.observations
      : [];

  const observationOptions = observationTemplates.map((obs, idx) => ({
    value: `${idx}::${obs}`,
    label: obs,
  }));

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.82)",
        }}
      >
        Select the behavioral violation and optional observation template before moving into needs.
      </div>

      <Select
        value={selectedKey}
        onChange={onChangeKey}
        placeholder="Select the behavioral violation…"
        options={violationOptions}
      />

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>
          Observation template (optional)
        </div>

        <Select
          value={selectedObs}
          onChange={onChangeObs}
          placeholder="Select an observation template…"
          options={observationOptions}
        />
      </div>
    </div>
  );
}