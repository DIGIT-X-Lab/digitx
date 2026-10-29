# FALCON motion-correction concept

The side-by-side illustration compares displaced time-frame anatomy with a shared spatial reference. The left pane keeps the frame displacement visible while the right pane brings the same three views into alignment, then holds one clean result. The existing `public/illustrations/anatomy/front-clean.webp` is used throughout, at identical coordinates and scale. No new raster artwork was generated.

This is a spatial concept illustration, not a FALCON output, validation example or patient study. It does not depict PET uptake, a time–activity curve or quantitative results. Converging wireframes represent spatial alignment only; they do not claim that tracer intensities become identical across time frames. The simplified translations and rotations illustrate frame displacement without claiming to reproduce the complete registration method.

`FalconStudyVisual.tsx` contains the composition and `falcon-study-visual.css` contains its motion. The containing `Study` controls visibility, hidden-tab suspension and explicit pause. Each five-second cycle shows the initial displacement for 400ms, converges over 750ms, and crossfades to a single exact Home wireframe by 1.25 seconds. The result holds until 4.65 seconds. Using one image for the completed reference prevents doubled outlines and colour fringes. Hover inspection and reduced motion expose this clean result immediately.

Coral distinguishes the displaced frames; pale blue distinguishes the alignment phase. The completed body returns to the original ivory. Functional labels use the shared metadata type role, live in `toolStudyCopy.falcon`, and sit outside the flexible artwork regions. There are no local font-size values, panels or additional explanatory paragraphs.

An isolated Playwright WebKit render was inspected at desktop 740 × 560 and mobile 390 × 430, using 450px and 360px stages respectively. Both complete figures fit their artwork regions, and labels have separate space underneath. Integrated catalogue and route checks are performed by the integrating agent after the shared build.

Below a 380px container width, the integrated stage height follows its width. This prevents the desktop-style fixed stage from adding empty vertical space around the smaller side-by-side figures. Integrated checks cover catalogue widths from 320px to 1920px, detail routes, hover/resume, explicit pause and live reduced-motion changes.
