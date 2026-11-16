import { useEffect, useState } from "react";

const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

/** True only on devices with a precise pointer (mouse/trackpad) and motion allowed. */
const useFinePointerMotion = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return enabled;
};

export default useFinePointerMotion;
