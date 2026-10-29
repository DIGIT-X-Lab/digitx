# Archived: Lumos hero exploration

Superseded on 25 October 2026 at the PI’s request. The mascot and word animation felt cluttered and gimmicky. The current hero uses the direct comparison in `hero-comparison.md`. The implementation described below has been removed; this file preserves its asset provenance.

# Lumos as the lab's companion

On 25 October 2026 the PI confirmed that Lumos comes from the lab and can serve as its recurring mascot. The PI requested an avatar to the left of the opening question and a cohesive transition, permitting the former scanner-line effect to be replaced.

The original source is `/Users/nutellabear/Documents/00-Code/lumos-app/assets/brand/lumos-logo.svg`, copied unchanged to `public/brand/lumos-logo.svg`. No files in the Lumos repository were edited. The SVG is tinted through a CSS mask for the static fallback and through its alpha in canvas. Its path geometry is preserved.

The hero retains the exact editorial question and supporting sentence. The avatar identifies the speaker without an extra label. The PI requested a conversational word reveal on 25 October 2026. This is an authored character animation, not a live chat or a demonstration of Lumos processing images.

## Motion

- 0–3.6 seconds: the question appears word by word beside Lumos, with a thin caret following the current word and a pause before the conditional clause. The full text occupies its final layout from the beginning. “Computable?” and its highlight arrive together.
- 3.6–5.25: the complete question holds for reading; the caret is gone.
- 5.25–5.95: the SVG silhouette resolves into the composing orb using sampled particle destinations.
- 5.95–6.65: brief thinking state, at the same avatar position.
- 6.65–7.5: a fast left-to-right reveal changes the human into the approved binary figure. No visible scanner line.
- 7.6–8.3: the orb returns to the original Lumos mark.
- 8.3–12: settled character and binary figure; playback then stops and remains on that composition.

Pause and replay control the words and both figures through one clock. Reduced motion shows the entire question immediately, with the original character and wireframe. Screen readers receive the complete heading once. On stacked layouts, the question finishes while it is visible, then the timeline waits at 3.6 seconds until the body enters view. Offscreen and hidden-page suspension remain enabled. Static fallbacks remain present while assets load; a failed asset or canvas preparation reveals the full question and stops playback. The existing full research film is unaffected.

The installed `thinking-orbs` geometry engine provides the composing orb. Alpha sampling and nearest-target matching follow the existing approach in `lumos-app/marketing/launch-film/src/commercial/OrbMark.tsx`.
