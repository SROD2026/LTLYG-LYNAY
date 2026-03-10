import { useEffect } from "react";

export default function useEscapeToClose(onClose) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);
}