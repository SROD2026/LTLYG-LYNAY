import { useEffect, useState } from "react";

export default function useModalSpacer() {
  const [spacer, setSpacer] = useState(0);

  useEffect(() => {
    function measure() {
      const nav = document.querySelector(".topNav");
      if (!nav) return;

      const rect = nav.getBoundingClientRect();
      setSpacer(rect.height || 0);
    }

    measure();

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  return spacer;
}