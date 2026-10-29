import { motion, useReducedMotion } from "framer-motion";

/** A brief blur-to-focus reveal, following the requested shadcn text effect.
 * The complete sentence remains available to assistive technology throughout. */
export function TextGenerateEffect({ text, className = "" }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return <p className={className}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{words.map((word, index) => <motion.span key={index} className="text-generate-word"
      initial={reduced ? false : { opacity: .25, filter: "blur(3px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: reduced ? 0 : .22, delay: reduced ? 0 : index * Math.min(.014, .35 / Math.max(1, words.length - 1)), ease: "easeOut" }}
    >{word}{index < words.length - 1 ? " " : ""}</motion.span>)}</span>
  </p>;
}
