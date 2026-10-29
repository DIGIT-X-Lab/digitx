# Project identity artwork

27 October 2026. The user approved an ivory wave for KEPLER, the original Lumos mascot for ARCHE, and a minimalist wireframe GALAH head for BREZN. The dense coral portrait and rocking motion were subsequently rejected. These are conceptual project identities, not research outputs.

## Saved assets

- `public/illustrations/projects/galah-wireframe-alpha.png`: final 1254 × 1254 RGBA image, generated and edited using the built-in ImageGen tool with `transparent_background: true`. Source retained at `/Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-f4a96aa7-e9d3-4acf-8999-efc705312f16.png`.
- `src/site/illustrations/lumos-mascot-paths.ts`: unchanged path geometry from `public/brand/lumos-logo.svg`.
- KEPLER reuses the installed Thinking Orbs `composing` geometry.

The final GALAH has no eye and roughly half as many mesh contours as the first alpha version. It is sparse monochrome ivory wirework with transparent background and transparent mesh interiors. Browser rendering was inspected over both page near-black and a grey-blue background. No raster editing, background-removal script or blend-mode workaround is used. The display wrapper offsets the original transparent top margin to optically centre the portrait.

## Built-in ImageGen prompt set

Initial generation, no image reference:

> Use case: logo-brand.
Asset type: transparent wireframe portrait for a minimal black research website.
Create a close-up headshot of a GALAH Australian cockatoo, head and short neck only, facing slightly left in three-quarter profile. Recognisable compact curved parrot beak, simple small round eye, gently raised short swept crest, elegant rounded skull. The entire bird must be drawn ONLY in SPARSE warm-ivory wireframe contour lines (#e1daca). An open three-dimensional longitude/latitude mesh like a minimal wireframe humanoid: about 12 widely spaced horizontal contours and 12 vertical curved contours across the whole head, a few following the beak and crest. Generous transparent gaps between every wire. Uniform fine clean strokes; subtle line-opacity depth is fine. A single simple ring for the eye. No realistic feather texture or dense fine mesh, no detailed iris, no decorative patterns. Calm sculptural silhouette, beautifully proportioned and recognisable at small sizes, centred, occupies 80% of square canvas with generous margin, crest and beak entirely within frame.
TRUE TRANSPARENT BACKGROUND: all space outside the strokes AND all space inside the mesh cells must be fully transparent alpha. Absolutely NO black backing, NO white backing, NO filled surface, NO glow, NO shadow, NO coloured feathers, NO coral, NO gradients, NO solid body. Ivory lines only floating on transparency. No text or label.

Final edit, using the inspected initial image at `exec-1700012c-56b4-466d-9bcf-10664beb5c99.png` as its only target:

> Edit target: the provided transparent ivory wireframe cockatoo head.
Change ONLY the crest silhouette: make it a GALAH, with a short compact crest swept close to the round crown. Reduce the crest height by about 75 percent, to only two or three low curved feather tips. It must NOT have a tall five-point sulphur-crested cockatoo crown. Preserve the sparse ivory wireframe, exactly the same face, eye, beak, neck, camera angle, stroke quality, transparent mesh cells and alpha background. Keep the artwork centred in the canvas with clean breathing room. No colours, fills, black backdrop, glow, texture, words, noise or extra detail. True transparent background.

Final simplification edit, using the inspected compact-crest alpha image at `exec-484ee73e-be28-462c-8318-234a54cca1e7.png`:

> Edit the provided transparent ivory wireframe GALAH head into a much more minimal and sculptural identity.
> ONLY simplify the drawing. Keep the same overall head, beak, low swept crest and neck silhouette, camera angle, placement, canvas size, warm ivory line colour, stroke weight and genuine alpha transparency.
> REMOVE the eye completely: delete all circular and concentric eye rings, the pupil, and the radial spokes aimed at the eye. NO eye, NO eye socket, NO tiny dot replacement. Let the beak and compact crest define the bird.
> Reduce total mesh line count by approximately HALF. Across the large rounded cranium, use only about SIX widely spaced curved latitude contours and FIVE widely spaced longitude contours. The face should read as an elegant calm shell of broad flowing wires, not a technical grid or concentric web. Simplify the beak to its outer silhouette and just two or three inner contour curves. Simplify the crest to two restrained swept curves with very few cross-wires. No tiny cells, no detailed mouth, no decorative circuitry.
> All mesh cells and background must remain transparent alpha. Ivory strokes only, no filled surface, no black backing, no shadows, no glow, no colours, no text. Preserve the same crop and margins as reference; do not enlarge or shift the bird.

## Motion

GALAH stays stationary. A single 1.6-second light sweep passes through an alpha mask of the artwork; a soft cursor light is clipped by the same mask, so only existing wires brighten. The picture never rocks or tilts. Its base remains visible immediately. Reduced motion hides both light layers.

KEPLER remains capped at 30fps; Lumos blinks intermittently and follows the mouse within a small range. All three share the same display area. Clicking artwork toggles motion without an adjacent pause icon. Hidden-tab, offscreen and live reduced-motion changes suspend motion. Visible keyboard focus releases the sticky stack.

## Verification

Production build and typography checks; TypeScript; WebKit rendering at desktop and mobile sizes; transparent artwork over contrasting backdrops; stationary GALAH under cursor motion; pause and reduced-motion behaviour; title-row separation through the final card's shared stack exit.
