# Site typography contract

PI direction: preserve a consistent size for each element's role across pages.
This is an implementation rule, not a suggestion for the next page.

## Source of truth

`src/site/typography.css` owns the responsive scale. Page and component styles
consume its variables. Inter Variable remains the only text family. The shared
roles apply equally to continuous-page chapters and standalone detail routes.

| Role | Token | Wide desktop (1920px) | Mobile (390px) |
| --- | --- | --- | --- |
| Page title | `--type-display` | 88px | 54px |
| Opening emphasis (“understand”, “human body”) | `--type-hero-focus` | 104px | 44.85px |
| Main Home question | `--type-hero` | 103.68px | 36px |
| Prominent introduction | `--type-lead` | 45px | 28px |
| Section heading | `--type-section` | 48px | 32px |
| Individual pillar, tool, person or “COMING SOON” heading | `--type-heading` | 36px | 26px |
| Subheading (including “Research pillars”) | `--type-subheading` | 30px | 24px |
| Featured tool or project name | `--type-feature` | 88px | 48px |
| Body prose | `--type-body` | 24px | 20px |
| Action link or button | `--type-action` | 22px | 20px |
| Navigation, tabs or filters | `--type-nav` | 18px | 18px |
| Metadata or label (including Home affiliation) | `--type-meta` | 16px | 16px |
| Caption or review note | `--type-caption` | 14px | 14px |

Values are CSS pixels at the browser's default root size. Tokens use rem bounds
and responsive scaling; the browser's text settings and zoom remain effective.
Page titles reduce together to about 44px on a 320px viewport. The long Home
question is a separate display composition with its approved 36px mobile size.
This is the sole page-level display exception, not permission to create more.

The Home continuation, “when more of its data becomes computable?”, the Home
supporting statement, “We develop computational methods and research systems…”,
and the Research introduction use exactly the same lead token at every viewport.
The Home supporting statement uses the shared `page-lead` class, as do Tools,
Projects, Publications, People and Contact introductions. Let the longer Home
statement wrap naturally at this size; never reduce its type to keep one line.
Lead text uses weight 400, tracking -0.02em and line-height 1.35 (1.4 on mobile).
Body text uses weight 400 and line-height 1.65. Titles use weight 420. Primary
actions may use weight 500; their size remains identical to peer actions.

The group heading “Research pillars” uses the subheading role and primary text
colour. It introduces the choices without competing with the page's opening
statement. The three individual pillar titles retain the heading role and their
established three-column layout, stacking at 900px and below. The grouping label
does not need to be larger than the choices themselves; hierarchy also comes
from placement, spacing and colour.

The Home affiliation uses the same subheading size at the PI's request. Its muted
colour and regular weight retain its supporting role; institutional names may
wrap naturally instead of reducing the shared type size.

## Layout and exceptions

Keep prose measures readable, generally 45–75 characters when room permits.
The approved Research lead remains full width. Narrow columns may wrap or stack;
never reduce a role's size locally to force a line break or fit a container.
Colour, spacing and emphasis can distinguish content without adding new sizes.

Scientific measurement values, their units and source-report examples have
separate tokens. Proportional numeric artwork in `demonstrations.css` and DIGITX
wordmark lettering are the explicitly allowlisted fixed-size exceptions.
SVG scientific labels and the standalone HTML film use their own drawing
coordinates. In the embedded Research film, `ResearchStory.tsx` derives the scene
heading from the live Research lead and compensates for SVG scaling, so its
visible text remains the same size. Do not replace that with a guessed SVG size.

The dormant earlier Home modules also consume the shared roles, so reusing them
does not bring back the old scale. Embedded vendor effects retain their own
internal geometry; the surrounding native controls use site roles.

## Enforcement

`npm run check:typography` checks every stylesheet under `src/`: font sizes must
reference a defined type token, page-local token definitions and font shorthands
are rejected, and artwork exceptions are named explicitly. It runs before every
production build. Any new exception must have a justified role documented here.

After changing typography, inspect rendered values, natural wrapping and page
overflow at desktop, tablet and mobile widths. Check the Home lead against all
page introductions, page titles against one another, and the embedded film
heading against Research. A passing source check alone does not prove the
browser cascade or layout is correct.

The header also measures whether its navigation fits. Enlarging text switches
to the existing keyboard-accessible menu when needed; returning to a size that
fits restores the desktop links. This changes layout, not the navigation role.

Verified on 2026-10-25 in WebKit at 320, 390, 768, 1024, 1440 and 1920px:
all destination introductions, page titles, body prose and peer actions share
their respective rendered sizes. The Research invitation has equal gaps on
both sides. The embedded film heading matches the Research lead, including
tracking. The build guard rejects an injected local font-size declaration.

Tool demo explanations retain the body size and line height. Their requested bold emphasis uses the shared `--type-weight-emphasis` token (600); tracer captions use the subheading size.

The upcoming tools title “COMING SOON” uses `--type-heading` with `--type-weight-emphasis` (600), following the PI’s 29 October clarification that it is a subdivision of Tools. Its straight-line text loop uses normal letter spacing and black type on a compact warm-white banner. The loop stays within the content width, retaining the shared heading size on mobile. Reduced motion shows one static heading. The repeat distance is measured from DOM text rather than a separate artwork scale. Its supporting introduction retains the body role.

The PI requested a more dramatic opening on 27 October: the smaller lead-ins use the lead role and the key words use `--type-hero-focus`. This explicit emphasis role belongs to the introductory question surrounding the figure. The settled Home heading retains `--type-hero`; affiliation uses the metadata role. No prose was reduced to fit.

28 October refinement: the PI found the hero too sparse and presentation-like. The settled Home question now uses the 5.4vw / 104px maximum hero role, while the mobile size stays unchanged. The rectangular subject strip has been replaced with outlined-to-solid text. `HeroPressureText` uses the existing Inter variable font's weight axis, with glyph widths reserved at the maximum weight so pointer input cannot reflow the sentence. Coarse-pointer and reduced-motion readers receive solid text.
