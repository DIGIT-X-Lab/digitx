# DIGITX website assembly

## Authority

All ten `editorial/*.md` files and `AGENTS.md` were checked against the original
`DIGITX_website_editorial_handoff.zip`; they match byte for byte. These define the
whole website, not only Home. Subsequent PI corrections to tool facts and the
mission statement take precedence and remain recorded in `src/content/`.

The CHILI presentation is the visual authority. No replacement brand direction
is being proposed. The accepted story animation supplies the main visual
explanation; it is available on Home behind an optional play control, retaining its existing chapter controls.

## Direction contract

- THESIS: medical observations become computable and connected, supporting
  investigation of human biology and research into computational intelligence.
- OWN-WORLD: CHILI warm black, ivory title strips, Inter, sparse anatomical
  wireframes, coral observations, pale blue emphasis and fine rules.
- STORY: mission and visual explanation; why computability matters; research
  directions; accessible tools; the published record; people; an invitation.
- FIRST VIEWPORT: a concise two-line headline and the full mission, two clear
  actions, and a large animated anatomical study derived from the approved film. The optional
  film feature sits below the hero, not inside the opening.
- FORM: full-screen sections with normal scrolling, separate destination
  pages, no forced film playback or slide-style page transitions.

## Source to destination

| Source | Destination |
| --- | --- |
| 00 Foundation | Mission, breadth, factual limits and identity throughout |
| 01 Home | Opening, idea, opportunity, contributions, record, people, invitation |
| 02 Research | Three research headings, approved prose and related work |
| 03 Tools | Filterable catalogue, tool details, status, licences, repositories |
| 04 Projects | Funded KEPLER, ARCHE and BREZN; no CHORUS proposal |
| 05 Publications | Searchable bibliography and original source links |
| 06 People | Real roster, profiles, authored answers when approved |
| 07 Contact | Direct invitation and existing contact address |
| 08 Design | Accessibility and behaviour, with CHILI as the visual reference |
| 09 Publishing | Unresolved facts stay in development notes; no deployment |

## Integration

The film poster mounts the player only after a visitor chooses to watch. Closing
returns keyboard focus to the poster and removes the player. The same-origin
story iframe preserves the approved scene and its single
animation clock. It reports content height to the parent and starts only after
the parent confirms visibility. Scrolling away pauses it. Returning does not
override the visitor's pause or restart the story. Reduced motion uses chapter
stills. Source and origin checks restrict messages to the expected document.

All generated anatomy and fictional report examples retain their provenance.
Tool illustrations describe the domain; they are not presented as tool outputs.
The site does not run models or accept medical data.

## Still awaiting supplied content

Authentic portraits and researcher-authored responses; cleared research figures;
verified tool requirements, evaluations and additional project metadata. The
production site hides the internal review notes. No claims fill these gaps.

## Home review, 25 October

The PI chose to design one page at a time. Home now has its own composition;
other destination pages remain available and await separate review. Generated
portrait placeholders and dummy personal responses are explicitly requested for
the Home design review, visibly labelled, and separate from the real roster.
See `homepage-design.md` and `people-placeholder-provenance.json`.
