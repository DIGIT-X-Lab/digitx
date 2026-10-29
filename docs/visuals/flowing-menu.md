# Research and Tools white reveals

Research pillars, forthcoming tools and the available Tools catalogue use one directional white reveal. Native titles, metadata, descriptions, links and plus controls remain stationary. Research pillars have no identity icons. Tool icons appear beside their names on hover or keyboard focus, fading over 100ms; their slots are reserved so no text moves. Original Lumos remains unchanged. The coming-soon symbols are centred on the title cap height, independently of the preserved title/plus alignment.

The current [React Bits Flowing Menu](https://reactbits.dev/components/flowing-menu) supplied the directional white-surface reference. Its upstream licence is retained in [react-bits-license.txt](react-bits-license.txt). The earlier JavaScript edge springs have been replaced with native Web Animations API transforms: 140ms entry, 110ms exit, ease-out `cubic-bezier(.16,1,.3,1)`. A clipped full-height white band translates from the nearest vertical edge. On reversal, its currently displayed transform is captured before the previous animation is cancelled. Partial journeys use proportionally shorter durations. Each row owns its band, with no shared layout tween, marquee or cursor attraction.

The white band uses difference blending against native content, so letters and icon silhouettes darken as the white surface passes. No duplicated text, separate text-colour timeline or continuously running animation is required. Transform animation avoids a per-frame JavaScript spring loop and clip-path updates competing with demo rendering. Settled animations are cancelled and departing bands are removed. Keyboard focus and reduced motion use immediate full coverage. Touch, selected demonstrations, drawer controls, Escape and stationary-pointer scroll tracking remain available.

A transparent clipping wrapper contains decoration at the existing 12px/16px highlight insets. Native content and focus outlines stay outside it. Invisible icons retain their layout slots and remain decorative, so adjacent native titles still provide accessible names.

## Performance investigation

A full-page WebKit reproduction found two blank frames before the former spring started moving, and a 124ms frame gap during the initial LION artwork paint. Hiding only the artwork reduced that gap to 19ms; hiding the summary left it at 122ms. Native transforms now show substantial travel by the first changed frame and over 99% coverage around 110ms in the recorded sample, before the demo mount. These are local measurements, not cross-device guarantees.

LION and PUMA colour filters now restrict their filter region to each already-displayed tumour-atlas window. Previously every small lesion filtered the entire 1024×1536 atlas before the viewport clipped it. The raster, colour, placement and sampled window stay unchanged. The final LION first-load sample reduced the largest frame gap from 124ms to 54ms.

## Verification

Temporary checks live in `/tmp/digitx-native-hover-qa.mjs`, `/tmp/digitx-hover-latency-probe.mjs` and `/tmp/digitx-annotatex-spacing-qa.mjs`. Verify hover-only icons, absent Research icons, stationary titles, full coverage, quick exits and reversals, cap-height centring, 320px containment, keyboard, reduced motion, Paper/GitHub hit targets, drawer/Escape and touch. Preserve the original tumour colours and registration when inspecting LION/PUMA. The ANNOTATEX relationship is content-sized with equal 24px gaps; MOSAICX retains its own layout.
