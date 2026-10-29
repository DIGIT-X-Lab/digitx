# Projects

27 October 2026. Mode: Persuade. Preserve the shared CHILI palette, Inter typography, square edges and normal document scrolling.

The PI selected a vertical stack inspired by [React Bits Scroll Expand](https://reactbits.dev/animations/scroll-expand), replacing the initially proposed project disclosure controls. Research and Tools retain their approved + controls and alignment.

The three project panels widen and their media frames open as they approach the reading position. Later panels naturally slide over earlier ones using CSS sticky positioning. The implementation uses the site's existing Framer Motion dependency, with no copied React Bits component or additional runtime dependency. Scroll position directly drives frame clipping and a small media scale change; text never scales or waits for a timed reveal. There is no wheel interception, nested scroller or scroll snapping. A short final scroll interval (25svh, bounded to 160–280px) lets BREZN settle beneath ARCHE before the completed stack leaves. Invisible padding aligns the sticky boxes’ lower boundaries, with the following card’s top margin compensating so visible spacing stays unchanged. This keeps title-row separation intact throughout the exit. The added interval and padding are absent in normal-flow fallbacks.

Enable stacking only above 1100px when every whole panel fits beneath the navigation and all earlier project title rows. Measure each complete title row, including its lower spacing, to set cumulative sticky offsets. Earlier names and status labels remain visible as later cards cover their bodies. Fit complete interface previews within the remaining height without cropping or reducing text sizes. Mobile, short windows, reduced motion and keyboard focus use normal flow. React to live preference and viewport changes. All content remains in the document. Project anchors and direct tool links work independently of the effect.

Project panels use the same near-black background as the page and their visuals, avoiding dark rectangular cut-outs against charcoal. Fine borders define the stacked edges. The Tools footer uses 32px of spacing on desktop and 24px on mobile; remove the older competing 110px rule. The Projects opening starts with 32px of padding. Shared disclosure geometry stays unchanged.

The intro leads with worthwhile research problems and grant funding, uses the full section width and matches the shared page-lead role. It wraps naturally without a local text-width cap. Project names use the shared heading role, with a quiet phase label. Confirmed facts remain in `editorial/04-PROJECTS.md` and `src/content/projects.ts`: KEPLER starts January 2027, ARCHE develops Lumos, and BREZN develops GALAH. Funding and partners remain compact supporting metadata. ARCHE → Lumos and BREZN → GALAH link to their existing tool detail pages.

## Animated identities

The PI approved replacing interface screenshots with distinct identities on 27 October 2026. All three use one 420px desktop display area, 300px on mobile, constrained to available stack height. Scientific copy, metadata and software links remain outside the artwork. The original interface demonstrations remain in Tools.

- KEPLER retains the installed Thinking Orbs ivory wave, rendered at the displayed resolution and capped at 30fps. Its slow ambient shape change pauses during direct cursor interaction.
- ARCHE uses the original Lumos mascot from `public/brand/lumos-logo.svg`. `src/site/illustrations/lumos-mascot-paths.ts` preserves its three path geometries exactly, separating body and eyes for a small blink and cursor response. No replacement logo was invented.
- BREZN uses `public/illustrations/projects/galah-wireframe-alpha.png`, generated with the built-in ImageGen tool. Sparse ivory wire contours and true alpha replace the rejected dense coral portrait and black backing. The portrait stays stationary: a single 1.6-second light pass reveals its wires on first viewing, and a soft cursor light follows only the existing lines. No rocking, perspective tilt or blend-mode background workaround. See `project-identity-assets.md` for the final prompts and provenance.

The artwork itself is a keyboard-accessible pause/play control without adjacent chrome. All motion pauses offscreen, when the document is hidden and for live reduced-motion preferences. Mouse clicks on the artwork retain the sticky stack; visible keyboard focus releases it to normal flow. Cursor tracking is mouse-only: bounded angles for KEPLER and Lumos, wire illumination for GALAH. No software interface screenshots are shown in project panels.

## Verification

Check full expansion, overlapping scroll positions, all three direct anchors and both tool destinations. At each stacked reading position, verify every earlier title and status label remains exposed and the current card fits beneath them. Verify tab access releases stacking, live reduced-motion switching, 320–1920px layouts, short windows, no horizontal overflow, complete preview images, and no browser errors. Check the separate numbered Tools headings retain their title/+ alignment.

Verified in WebKit at 320, 390, 768, 1024, 1280, 1484 and 1920px, including a short desktop viewport. Full-width intro, no horizontal overflow, numbered disclosure alignment, keyboard navigation, both software destinations, live reduced motion and image loading passed. Production build, typography contract and TypeScript checks passed.

The final-card regression was reproduced beyond its arrival position: BREZN previously left immediately and overtook ARCHE. Checks now cover the final settled interval, shared stack exit and reverse scrolling at 1484 × 840 and 1920 × 1080. Title-row separation remains constant throughout.
