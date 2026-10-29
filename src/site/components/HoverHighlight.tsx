import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type HoverHighlightTarget } from "./useHoverHighlight";
import "./hover-highlight.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotionPreference(update: () => void) {
  const preference = matchMedia(motionQuery);
  preference.addEventListener("change", update);
  return () => preference.removeEventListener("change", update);
}

/** One blended surface keeps text inversion aligned with the moving highlight. */
export function HoverHighlight({ target, inset = 16 }: { target: HoverHighlightTarget | null; inset?: number }) {
  const reduced = useSyncExternalStore(subscribeMotionPreference, () => matchMedia(motionQuery).matches, () => true);
  const bounds = target ? { top: target.top, left: target.left - inset, width: target.width + inset * 2, height: target.height } : undefined;
  // Switching preference also removes any in-flight layout transforms immediately.
  if (reduced) return target && <div className="hover-highlight" aria-hidden="true"><div className="hover-highlight-surface" style={bounds} /></div>;
  return <AnimatePresence>{target && <motion.div key="highlight" className="hover-highlight" aria-hidden="true"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: .14, ease: "easeOut" }}>
    <motion.div className="hover-highlight-wake" layout style={bounds}
      transition={{ layout: { duration: .22, ease: [.22, 1, .36, 1] } }} />
    <motion.div className="hover-highlight-surface" layout style={bounds}
      transition={{ layout: { duration: .16, ease: [.22, 1, .36, 1] } }} />
  </motion.div>}</AnimatePresence>;
}
