import { useLocation } from "react-router-dom";

/**
 * World-class elevation pass, November 2026. The Motion register was chosen
 * by the PI and shipped: it is now the register everywhere, and the old
 * /redesign/* preview routes redirect home. The type keeps its three values
 * so history reads correctly; "current" survives only as the name of the
 * pre-elevation baseline in gated code paths, which no route reaches now.
 */
export type Register = "current" | "editorial" | "motion";

export function useRegister(): Register {
  // Routes no longer influence the register; the site is the Motion register.
  useLocation();
  return "motion";
}

export function registerBase(register: Register) {
  void register;
  return "/";
}
