import { useState } from "react";

export default function useInteroState(initial = []) {
  const [intero, setIntero] = useState(initial);

  function update(region, sensation) {
    setIntero((prev) => {
      const next = [...prev];

      const index = next.findIndex((x) => x.region === region);

      if (index >= 0) {
        next[index] = { region, sensation };
      } else {
        next.push({ region, sensation });
      }

      return next;
    });
  }

  function clear() {
    setIntero([]);
  }

  return {
    intero,
    update,
    clear,
  };
}