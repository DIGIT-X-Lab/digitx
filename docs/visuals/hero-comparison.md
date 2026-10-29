# Home: question, human, computation

## Current approved direction, 27 October 2026

The opening keeps the existing full-body humanoid sharp and centred. The PI rejected enlarging the available raster into a head-to-chest close-up, so no replacement artwork was generated and no close-up remains.

The exact approved question frames the figure: “What can we” / “understand” on the left and “about the” / “human body” on the right, followed by the computability condition. The left block aligns towards the body. Smaller lead-ins use `--type-lead`; the focus words use the new central `--type-hero-focus` role, reaching 104px. Their brief staggered upward entrances are inspired by React Bits Split Text. The spatial transition draws on Scroll Float. Instrument and Locomotive were also inspected for typography and image hierarchy, without copying their branding or assets.

- https://reactbits.dev/text-animations/split-text
- https://reactbits.dev/text-animations/scroll-float
- https://www.instrument.com/
- https://locomotive.ca/en

The introductory copies are decorative and hidden from assistive technology. The semantic H1 preserves every word of the original question. On smaller screens the phrases frame the figure above and below. The controller measures the condition against the scroll cue; if they would collide, only the decorative repeat of the condition is omitted. The complete final question always remains available.

## Sequence and lifecycle

A continuous-gradient binary band travels through the figure in a 3.6-second loop until the first scroll. It fades out over 180ms. Cursor inspection is disabled during this introductory phase, preventing the confirmed overlap between the automatic band and pointer patches.

About 72% of the available viewport height supplies the native scroll interval. The same figure moves right as the question becomes a two-line composition on the left. The original conditional question, support and actions follow. The settled subject “the human body” uses outlined lettering that fills under the pointer, replacing the rectangular highlight. The hero heading is larger, up to 104px, with 1.12 line-height on desktop. Spacing before support scales from 32px to 56px with viewport height, with 24–40px before actions; mobile uses 36px and 32px respectively. The complete text group remains centred against the figure. Affiliation now uses the metadata role. The principal question and supporting copy retain their existing shared tokens.

There is no forced full binary conversion during scrolling, wheel interception, snapping or text blur. The scroll follower has a 28ms time constant. Moving/hidden states do not trigger React renders.

Completion is remembered in module memory, surviving scroll-back and client-side navigation until refresh. After native scrolling has been idle for 180ms, the temporary scroll interval is removed. When the hero is visible, its stage top is anchored while removing the temporary height. Farther down the page, the scroll position is compensated by the exact removed document height. This preserves both the viewed hero and deep-anchor destinations as the final layout becomes shorter. Returning Home shows the finished composition immediately.

Reduced motion and failed artwork show the final layout immediately. The native “Scroll to explore” button completes the sequence and focuses the question, scrolling it into view on shorter screens. Animation stops offscreen and in hidden tabs. At completion, observers no longer repaint the hero.

## Artwork and settled interaction

Both approved assets are unchanged: `front-clean.webp` and `front-binary-v2.png`, each 1024×1536, translated by (−200, −8) within the established `0 0 630 1480` SVG viewBox.

The binary image overlays the wireframe through one alpha mask. A continuous linear-gradient rect supplies the opening band. This replaces the two complementary masks and stepped pulse strips. A local warm-black backdrop retains the approved lighten blending.

After completion, pointer inspection reveals binary in 35-unit cells with a 170-unit radius. Patches arrive with a 55ms time constant, hold 120ms after departure, and fade over a 175ms time constant. Click, tap, Enter or Space toggles the entire binary view through a native button with `aria-pressed`. Reduced motion makes explicit toggles immediate. A stationary pointer has no continuing animation loop once its patch settles.

## Verification

`scripts/test-hero-sequence.mjs` exercises real-browser framing, overlapping text/figure timing, one-time completion, scroll-space compensation, route return and refresh, pointer/pulse exclusivity, repeat pulses, native keyboard/pointer controls, deep and smooth anchors, mobile focus, offscreen suspension, reduced motion and both failed-artwork paths.

It uses an externally supplied Playwright installation (`PLAYWRIGHT_MODULE`), optional `PLAYWRIGHT_EXECUTABLE_PATH`, and `HERO_TEST_BROWSER` (`webkit` by default). Preview defaults to port 5180; screenshots go to `/tmp/digitx-hero-qa`.

The independent review found intro-condition/scroll-cue collisions at 320×740 and 390×701. Both were reproduced and fixed by measuring the available space. Those sizes are included in the regression suite. No new dependencies, image assets, commits or deployment were needed.

## Typography refinement, 28 October

The PI asked for a more distinctive font treatment and criticised the slide-like blocks and excess settled spacing. `HeroPressureText.tsx` adapts the variable-weight concept from [React Bits Text Pressure](https://reactbits.dev/text-animations/text-pressure) to the installed Inter font. “understand” is solid, while “human body” echoes the illustration's outline. Local pointer pressure increases weight and fills nearby outlined letters. Fixed glyph slots prevent width changes. The effect has no idle loop, global pointer listener, distortion, extra font download or new runtime dependency. Touch and reduced motion show solid text. The semantic heading remains the original question, with decorative glyph clones hidden from assistive technology.

The settled desktop composition fills one visible viewport below the measured header. Its text block and compact full-body figure share a vertical centre, so Research begins below the first screen. Header measurements continue after the intro finishes, keeping the fit correct through resize and client navigation without replaying the sequence. Below 1200px the figure and text stack and flow to their content height. The scroll controller anchors the visible stage when removing the introductory scroll interval.

## Saved review point, 28 October 2026

The user requested saving the site at this point. Retain the opening's current outer margins, centred full-body figure and staggered question blocks. The latest settled view includes the more generous headline, support and action spacing described above, while keeping the text vertically centred against the humanoid and the desktop hero within one screen below the header.

Verification at this checkpoint: production build (including the typography guard), the complete WebKit hero regression suite, and Chromium layout checks at 1960×1110, 1484×1000, 1484×650 and 390×844 passed. The preview is served from `dist` at `http://127.0.0.1:5180/`; rebuild after source changes. This is a local checkpoint, without a push or deployment.

## Balanced settled desktop composition, 29 October 2026

The settled desktop text track sizes to the question's intrinsic width. The grid distributes its remaining width around both tracks with `space-around`, giving the composition equal outer space and allowing the question and figure a clear internal separation. This supersedes the tightly packed, left-aligned version, which left too much empty space at the right. The unused inline-size containment on the copy remains removed so its content can determine the track width. The figure track, shared typography, exact text, artwork registration, vertical centring and mobile layout are unchanged. The sequence continues to measure the final position, so its opening remains centred and its native scroll transition lands in the balanced composition.

The user's Chrome window was measured at 1484×823 CSS pixels with DPR 2. At that size, the settled row now has approximately 99px at each outer edge and a 110px internal gap, compared with the preceding layout's 67px left margin, 198px right margin and 45px gap. Checks also cover 1440×768, 1920×823, 1920×1080 and 2048×1152. Each has equal outer space, unchanged figure dimensions, headline sizes, line widths and vertical placement, without horizontal overflow or a clipped figure. The complete composition was visually inspected at the actual browser dimensions and the wider sizes, alongside its opening and transition. The typography guard, layout detector and full Chromium hero regression suite pass, including binary inspection, keyboard controls, navigation, scroll-space removal, reduced motion and failed-artwork fallback. Screenshots and measured before/after bounds are saved under `/tmp/digitx-hero-balance/`.

## Automatic existing hover effect, 29 October 2026

The opening's “human body” and the settled question's “the human body” receive an automatic virtual-pointer pass through the same calculation as the existing cursor interaction. Their letters gain the same variable weight and outlined-to-solid fill; there is no new overlay, gradient, glow or replacement visual treatment. A pass lasts 2.6 seconds, followed by 3.8 seconds with the original outline. The opening pass starts without scrolling, after its short entrance. It stops as the introductory phrase fades, and the settled pass starts once the sequence is revealed. Only the visible phase can run automatically.

The real pointer takes priority and retains control while it stays over the text. After leaving, the automatic pass resumes following a 1.4-second pause. Animation frames run only during a pass; the delay between passes uses a timer. Offscreen text and hidden documents stop the work and clear active pressure. Reduced motion and coarse pointers retain the existing solid, static lettering. The figure, exact copy, shared typography, reserved glyph widths and balanced composition are unchanged.

The native “Scroll to explore” cue's label and arrow gently move down and back by 4px over a 2.8-second cycle with a brief rest. The button itself stays fixed, keeping its horizontal centring and stable click target. Hovering or focusing the button pauses the motion. The cue's animation also pauses when it becomes inert, offscreen or hidden, and reduced motion removes it. Completion still removes the cue with the introductory layout.

Dedicated Chromium checks at 1484×823 with DPR 2, 1440×768 and 1920×1080 verified automatic weight and fill changes without a real pointer, repeat passes separated by the outline, pointer priority, stable geometry, offscreen suspension, document-visibility handling and readable reduced motion. TypeScript, the typography guard and the full existing Chromium hero regression suite pass. Screenshots are saved under `/tmp/digitx-hero-shine/`.

The opening refinement was checked at 1484×823 with DPR 2 and 1920×1080: automatic pressure starts at scroll position zero, the intro yields to the pointer and hands over to the settled text, and the cue's label moves within 4px while the button bounds stay fixed. A normal click reveals the question. Hidden-document pause, offscreen suspension and reduced motion also pass. Opening and settled screenshots are saved under `/tmp/digitx-hero-intro/`.
