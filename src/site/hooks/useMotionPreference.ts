import { useEffect, useState } from "react";

/** The installed Motion hook reads the preference only once. These previews
 * also stop when the visitor changes the OS preference while the page is open. */
export function useMotionPreference() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    update();
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}
