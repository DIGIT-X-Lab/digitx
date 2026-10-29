# MOSAICX and ANNOTATEX demonstrations

Updated 27 October 2026. Both demonstrations retain the approved fictional pathology sentence from `src/content/illustrations.ts`. No new patient data, extraction result or performance claim is introduced. The existing bold two-sentence tool summaries remain unchanged.

## MOSAICX

The site and histology phrases gain matching colours and source references. Two connectors draw into the structured fields; values are fully revealed by 1.44 seconds of a six-second cycle, then hold until the final reset. The current project README was checked against https://github.com/DIGIT-X-Lab/MOSAICX: a researcher-defined template specifies the fields and the output carries source excerpts. This visual explains that relationship using the approved example, rather than implying a live model call.

## ANNOTATEX

The sequence demonstrates highlighting, labelling and connecting annotations. Blue and coral selection bands mark the source phrases, their site and histology labels appear, then the existing “located in” relationship connects adenocarcinoma to the left lower lobe. The relation is fully visible by 1.8 seconds. Desktop shows the relationship from left to right; narrow layouts put its arrow between stacked annotations.

The PI explicitly rejected the crossing source-to-label connectors. ANNOTATEX therefore has no source connector SVG. Matching colours, numbered references and interactive highlighting provide source tracing; the only arrow represents the actual annotation relationship. Keep the 28px gap before its labels instead of reserving space for removed connectors.

## Shared interaction and layout

`MosaicStudyVisual.tsx` provides the shared phrase/field interaction with a separate annotation presentation. Hover or keyboard focus highlights a matching pair. Clicking retains the selection; Escape clears it while preserving keyboard focus. A subsequent Escape can close the inline mobile preview through the existing catalogue behaviour. Clicking explicitly focuses the control so this also works in Safari, where pointer activation does not always focus native buttons.

The shared `Study` wrapper supplies visibility and hidden-tab suspension, explicit pause and live reduced-motion handling. Hovering the artwork, focusing a field or selecting a pair exposes the complete result. Reduced motion shows it immediately. Text stays in the DOM throughout, without live-region announcements on every loop. Functional labels, values and hints use the existing metadata, body and caption roles.

The text previews use their content height and align to the top of the preview canvas. This removes the fixed-height centring that created the large gap after the tool summary. Both now begin 28px below their summary; image-based previews retain their existing sizing. Values and relationship labels reflow at narrow widths rather than shrinking their font size.

Keep each source-reference marker directly beside its field label with a 6px gap. Do not distribute the label and reference to opposite ends of the field; the PI rejected that excessive separation.

Validation covers 320–1920px layouts, pointer and keyboard source tracing, Escape behaviour, pause/resume, reduced motion, 200% text within the demonstrations and standalone detail routes.
