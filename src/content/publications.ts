/**
 * Publications page copy. Source: editorial/05-PUBLICATIONS.md.
 * Records come from src/data/publications.json (scripts/fetch-publications.mjs).
 */

export const publicationsPage = {
  title: "Publications",
  intro: "Questions we’ve followed, and what we’ve learned along the way.",
  controls: {
    search: "Search publications",
    year: "Year",
    area: "Research area",
    status: "Publication status",
    all: "All",
  },
  featured: {
    title: "One figure, explained.",
    slot: "Featured figure: published caption or properly adapted with attribution, a short note on what it shows and does not establish, full citation and link. Never fabricate a figure.",
  },
  empty: "No publications match that search.",
  slots: {
    bibliography: "CONTENT REQUIRED: verified bibliography with DOIs, publication status and contribution attribution. Distinguish current DIGITX work, earlier PI work and wider collaborations.",
    filters: "Research area and publication status filters appear once each record carries verified tags.",
  },
};
