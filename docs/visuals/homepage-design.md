# Home design review

Scope: the approved Home opening and its connection to the main site. Main destinations now form one continuous document. Individual tool and job records retain separate URLs. No commit or deployment.

Visitor job: understand what the lab develops and why, then find research, tools, evidence, people or contact.

Content authority: `editorial/01-HOME.md` supplies the exact opening question and support. The PI's subsequent scrolling direction makes that hero the opening of a continuous document, followed by the full Research, Tools, Projects, Publications, People and Contact content. The earlier Home overview modules remain in source rather than repeating their examples and preview lists before the full sections. Do not invent a replacement slogan or move the scientific question into a subordinate section.

Visual authority: CHILI’s warm black, ivory type, restrained coral and blue, clear labels, sparse wireframe anatomy and purposeful reveals. Wide compositions with viewport minimum heights and normal scrolling reflect the PI’s subsequent layout preference.

Latest direction: a static editorial question, supporting sentence and actions aligned left; the approved human figure sits on the right. Remove Lumos, the speaker label, typing, caret and automatic transformation. Retain the headline scale and move the ivory highlight to “What can we understand about the human body”. The conditional question remains plain.

Hero interaction: an invisible cursor grid locally reveals binary beneath the pointer and returns those patches to wireframe after it passes. The approved images retain their registration and crop. A shared SVG opacity field supplies complementary masks, with direct updates outside React rendering. Start at the full wireframe; there is no slider, divider, handle, pulse, entrance sweep or visible instruction. Clicking, tapping or keyboard activation toggles the complete representation. Reduced motion disables hover animation and changes the complete view instantly. Pending animation is cleared offscreen or when the document is hidden, and no frame loop runs at rest. Keep all text still. See `docs/visuals/hero-comparison.md`; the Research film remains unchanged.

Page order:
1. Original scientific question and “We develop…” sentence.
2. Research: full-width introduction, approach film, horizontal expandable pillars with scientific examples, then the methods paragraph bridging to Tools. See `research-page.md` for the current film and drawer behaviour.
3. Tools: the full filterable catalogue with verified code links.
4. Projects: the verified funded-project records.
5. Publications: the searchable, source-linked publication list.
6. People: the existing researcher records and opportunities.
7. Contact: What are you trying to understand? / We'll listen first.

No new claims or synthetic research results. The generated People portraits and draft responses remain explicitly labelled as requested for the design preview; replace with approved material before launch. Other examples retain their fictional provenance.

Verification: build and TypeScript, exact copy and section order, responsive widths, keyboard navigation and example selection, motion pause/replay/offscreen/reduced-motion, film open/close and focus return. Visual review remains the PI’s decision.

Hero action hierarchy: the main question is the only filled ivory emphasis in the hero. “Explore our research” is an unfilled, underlined text link with an arrow, a 48px hit area and visible keyboard focus. “Browse our tools” has the same type size and hit area, with quieter colour and an underline on hover. Other page buttons are unchanged.

Hero spacing: keep the heading and conditional clause together. Leave 64px before the supporting statement and 40px before the action links on desktop (40px and 32px on mobile). The affiliation shares the Research pillars subheading size, retaining its muted colour.

Hero type hierarchy: retain the approved large main question. The conditional clause and “We develop…” supporting statement share the Research introduction's lead-text size, line height, weight and tracking at every viewport. The supporting statement wraps naturally without shrinking. Hero actions share a 22px size on desktop and 20px on mobile; navigation remains 18px. The primary action gains prominence through medium weight, an underline and an arrow, without another filled highlight.

Navigation refinement: “Explore our research” scrolls to /#research and “Browse our tools” to /#tools. The sticky navigation includes an explicit Home link and follows the section on screen. The optional film lives with Research. Remove the redundant “Discover our approach” footer cue. Home leads into Research with a subtle 1px `--line-section` boundary, with 48px Research top padding on desktop and 32px on mobile, and no reserved caption space beneath the human. Keep the approved type sizes and comparison artwork; the human uses the cursor reveal described above. No snapping or scroll hijacking; reduced motion jumps directly to the section. Older page URLs redirect to the corresponding anchors.
