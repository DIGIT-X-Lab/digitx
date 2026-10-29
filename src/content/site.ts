import { affiliations } from "@/data/affiliations";

/**
 * Site-wide identity, navigation and footer.
 * Copy source: DIGITX editorial handoff (editorial/00-FOUNDATION.md, 01-HOME.md, 07-CONTACT.md).
 */

export const identity = `DIGITX · ${affiliations.radiology}`;

export const nav = [
  { id: "home", to: "/#home", label: "Home" },
  { id: "research", to: "/#research", label: "Research" },
  { id: "tools", to: "/#tools", label: "Tools" },
  { id: "projects", to: "/#projects", label: "Projects" },
  { id: "publications", to: "/#publications", label: "Publications" },
  { id: "people", to: "/#people", label: "People" },
  { id: "contact", to: "/#contact", label: "Contact" },
] as const;

export type SiteSection = typeof nav[number]["id"];

/** Public lab mailbox confirmed by the PI, 27 October 2026. */
export const contactEmail = "RAD-Digitx@med.uni-muenchen.de";

export const legal = [
  { href: "https://www.lmu-klinikum.de/imprint?homepage=b2c7dca3b5b72d5e", label: "Impressum" },
  { href: "https://www.lmu-klinikum.de/data_safety", label: "Datenschutz" },
] as const;

export const profiles = {
  github: "https://github.com/DIGIT-X-Lab",
  scholar: "https://scholar.google.com/citations?user=L6iMPN4AAAAJ&hl=en",
} as const;
