# DIGITX site: implementation contract

You are the **developer and interaction designer**, not the scientific author. Treat `editorial/` as the content source of truth. Do not rewrite its prose, invent facts or substitute filler copy. Preserve British English and avoid em dashes.

Read `editorial/00-FOUNDATION.md`, `editorial/01-HOME.md`, `editorial/08-DESIGN-AND-INTERACTIONS.md`, and the supplied CHILI reference **before** implementing components.

Build a complete responsive website with Home, Research, Tools, Projects, Publications, People, Contact. Keep website copy in structured source files. Render approved text verbatim. Items marked `CONTENT REQUIRED`, `VERIFY`, or `NOT PUBLIC` are editorial instructions, **not public-facing copy**. Never publish those strings in production.

Do not fabricate research figures, benchmark claims, team members, URLs, citations, grants, progress, sample outputs or paper metadata. Use asset slots in development; hide incomplete evidence-led modules on production builds rather than inventing them.

No backend, inference endpoint, paid model API, GPU hosting, or compulsory CMS. The website demonstrates with precomputed, appropriately cleared assets. Provide working repository/documentation links only when checked. Published tools and tools in development must be visually distinct.

Use the CHILI deck as visual language, not site content or site IA. Do not reproduce its single-topic total-body PET narrative as the lab homepage. Avoid scroll hijacking; maintain accessible navigation, keyboard operation, adequate contrast and reduced-motion handling. Do not embed the source deck's font binaries into the new site. Use a permitted installed/system/web font instead.

Preserve uncertainty and provenance. No clinical performance or autonomy claims without a source. No pre-LMU grants. Keep proposals and unpublished competitive details off the public website. Do not infer licence from a project name; verify per repository.

Acceptance: visitors can understand purpose, breadth, evidence, access to tools, and scientific authorship; a reviewer can find papers; an industry researcher can find technical methods and restrictions; a potential student can meet people. The site cannot look like a PET-only group, data-extraction vendor, or AI product company.

## Typography contract

The same semantic role must use the same responsive font-size token on every page. Use `src/site/typography.css` and the role table in `docs/visuals/typography.md`. Page titles, page introductions, body prose, actions, navigation and metadata each have their own role. The Home conditional question, its “We develop…” supporting statement and all destination introductions share `--type-lead`. Preserve the approved large Home heading and its documented mobile composition.

Do not invent local font sizes, override type tokens inside pages, or shrink text to make a layout fit. Reflow the layout instead. Change a role centrally when a site-wide adjustment is intended. Keep the Research film heading matched to the rendered lead style. Only the named wordmark and scientific-artwork exceptions documented in the contract may use independent sizes. Run `npm run check:typography` and check computed sizes and wrapping on desktop and mobile after typography changes; the build also enforces the source contract.
