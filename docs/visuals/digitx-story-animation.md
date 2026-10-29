# DIGITX mission animation study

Preview: `/previews/digitx-story.html`. Opens independently of the main website.

The PI-approved narrative expands beyond a single image and report: observations over time, computable measurements and facts, unified patient records, connected relationships, then the design of autonomous AI research systems to investigate biology. The human remains through the connected-record transition, then leaves the final scene so attention moves to research across people.

## Motion and composition

The PI-approved headlines establish the context, then describe DIGITX’s ongoing work in the first-person present tense:

1. One person. Many observations.
2. We make observations computable.
3. We bring each person’s information together.
4. We connect information across people.
5. We develop and test autonomous AI for discovery.

The final headline frames discovery as the purpose of development and testing, not a completed or validated outcome.

- 48-second, one-shot narrative. After the final frame, only KEPLER’s orb and border beam continue. Five independently selectable chapters. Pause, resume, replay, scrub, arrow-key navigation, reduced-motion stills and background-tab pause. At the ending, Pause and Resume motion control the effects; Replay restarts the story. Seeking always pauses and resets both clocks to the selected point.
- The opening has five illustrative image visits above radiology, pathology, laboratory and treatment reports. It uses the CHILI chevron path (`m7 7 17 17L7 41`).
- Image measurements finish before report extraction starts. The human and measurement panel leave together. Large stacked reports take the human’s place. Pathology, laboratory and treatment examples each show running prose, followed by multiple computable observations. Extraction preserves negation and sample scope, normalises written quantities and units, and associates observations with the correct visit. Each source receives four seconds before the next; the other stages retain their original durations. The human returns as those facts join the patient record.
- The selected table row, patient identity, body render and lesion pattern use exactly the same time boundaries. PAT-002 uses a distinct female wireframe figure; PAT-003 uses a broader male figure. The connected-record view returns to PAT-001.
- Discrete lesion layers shrink or disappear over visits, while a new lesion appears at week twelve. Intermediate images are illustrative states, not additional measured records. Lesion geometry is not calculated from the fictional volume values.
- `digitx-story-network.mjs` builds one complete radial hierarchy from the same fictional records: cohort, person, visit, domain, measurement field and value. Numerical quantities retain distinct numeric values and units in data, but display together as a single measurement label. The circular branching and fine Bézier fans follow the PI’s supplied radial-tree reference, adapted to the CHILI palette.
- All edges paint first, points next and labels last. SVG text strokes and `paint-order` are absent. Solid label backplates prevent branch intersections without relying on Safari text-stroke rendering. Small radial labels follow the perimeter; no large labels float among branches.
- The closing title is “We develop and test autonomous AI for discovery.” At the PI’s request, the human fades out as the circular graph moves to the left and grows by 5%. KEPLER occupies the right. The panel sequentially describes a 20.6% tumour-volume decrease and the CRP change, then suggests comparing more people. The percentage is calculated from the fictional table, not hard-coded as a tool result. The PI requested removal of the “Illustrative dialogue” header label; the persistent fictional-data footer and expandable concept provenance remain. It is an authored concept, not a live KEPLER run, validated capability, discovered association or causal conclusion. The actual KEPLER project facts elsewhere on the website remain unchanged.
- `keplerAnswers` is shared by the dialogue and graph: each answer identifies its onset, fields and records. The tumour-volume answer selects only PAT-001’s baseline and week-six tumour volumes. The context answer selects that person’s CRP and treatment observations. The proposed comparison selects tumour volume and CRP across the example records, without claiming a cohort result or inventing follow-up for PAT-002/003. Selected paths, nodes, field labels, values and visit labels brighten together; unrelated graph content dims. Earlier messages also recede as the next answer appears.
- Active source passages use bright red lettering (`#ef6257`) on a subtle dark-red backing (`#301714`). Solid full-width bars were removed after the PI found that they still read as salmon, even when sampled from the tumour artwork. A static SVG flood/merge filter fits the backing to each text line’s intrinsic bounds; no blur or colour animation is involved. Each passage highlights before its corresponding fact appears; the last passage remains highlighted for review until that report leaves.
- KEPLER uses the official [Thinking Orbs](https://libraries.dev/orbs) geometry engine, version 0.3.2 (MIT), drawn as native SVG in the header. The PI selected the flowing, spherical `composing` mode from the library; it stays in that mode throughout the closing scene. The 64 px icon has 18 px of clear space before the header divider. “Hi, I’m Kepler.” appears before the findings. A blue/ivory travelling border follows the PI’s [Border Beam reference](https://libraries.dev/beam). The beam is a native SVG interpretation, not the React BorderBeam package, so it shares the scene’s time and coordinate system. Both effects pause, seek and honour reduced motion with the rest of the scene.
- After the PI flagged compression, the graph now uses equal horizontal and vertical radii. Measurement values and units share a leaf, reducing peripheral labels from 40 to 24. The Connect caption uses a dedicated baseline at y=784 below the outer-label envelope. Investigate replaces the bottom captions with the KEPLER panel.
- Graph geometry stays below the headline and inside the illustration area. Floating numerical transfers and SVG title tooltips remain removed.
- The editorial foundation and Home opportunity copy were reread for this revision. They describe developing methods to make data computable and building and testing research systems to work with it. The PI’s latest clarification makes autonomous AI research-system development explicit while retaining the same scientific purpose.

## Homepage placement

`/previews/digitx-story.html?layout=home` shows the animation directly after the approved mission statement and before the existing “More to investigate.” research introduction. The placement study remains available. The approved animation is also now integrated into Home.tsx through ResearchStory, with embed=1 suppressing the preview chrome. Playback starts once the animation enters view, and pauses when it leaves. See website-assembly.md for the full website mapping.
- UI font is licensed Fontsource Inter, copied from the installed package. Anatomy uses the existing generated clean base with separate tumour, muscle and fat layers. Source and limits are recorded in `segmentation-animation-provenance.json`. The additional patient PNGs, lossless WebP copies and exact generation prompts are recorded in `patient-render-variants.json`.

## Fictional records

All IDs, clinical text and numbers in `digitx-story-data.mjs` are illustrative. Nothing is measured from the rendered body. The example observation of adenocarcinoma is taken from a fictional pathology report. `reportExamples` also illustrates specimen location and a negated finding scoped to the sampled tissue; the following compact table displays a subset of these facts. CRP and treatment status come from fictional laboratory and treatment notes. Repeated visits retain time. Examples describe the concept, not a cleared clinical dataset or a real tool run.

## Implementation

`digitx-story-scene.mjs` generates the SVG scene and timing specifications. `motionAt` is deterministic and independently renderable. The browser controller uses one requestAnimationFrame loop and updates only changed attributes. Narrative time stops at 48 seconds, while effect time continues until paused. Only the KEPLER effects redraw at the ending. Reduced motion disables autoplay and the ending loop; visibility changes and the pause button stop the entire loop. Bitmap artwork is preloaded and decoded before playback. `digitx-story-kepler.mjs` draws the small Thinking Orb using reusable SVG element pools, with no separate animation timer. The beam uses layered thin strokes without animated filters. There are no inference calls.

`node scripts/test-story-playback.mjs` exercises the real controller with a fake animation clock and a minimal DOM. It checks continuation past the narrative end, pause, resume without a restart, replay, seek, hidden-tab pause and reduced motion. It does not verify browser paint or frame rate.

`npm run sync:story-vendor` copies the installed Thinking Orbs engine, its module dependency and MIT licence to `public/previews/vendor/thinking-orbs/`. This also runs before the production build, keeping the standalone preview independent of bare npm imports and CDNs. The engine files are unmodified. The package version is pinned in package.json and the lockfile.

Use `?from=37.3` to preview the ending in motion, or `?stage=2` for the complete laboratory extraction still. Reduced-motion preference prevents autoplay from a requested time.

Static SVG compositions can be rendered natively to inspect layout. This does not verify interactive browser playback or its frame rate. Browser QA is limited when the connected browser runtime is unavailable.

## Review scope

The animation remains an illustrative research concept. Subsequent PI direction authorised assembling the complete website from the Markdown handoff and the CHILI design reference. The existing image/text demonstrations remain on Research. No deployment or commit has been requested.
