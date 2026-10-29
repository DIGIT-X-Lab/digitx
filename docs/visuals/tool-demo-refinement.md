# Tool demo refinements, 26 October 2026

## Current assets

Built-in image generation was used for each asset; originals remain in the generated-images library. These are conceptual illustrations, not model inference results. They replace the narrowed MOOSE v4 organ contours and the identical-body LION pair.

MOOSE is a contour conversion of the original `front-segmented-v1.png`. The generated layer reframed the organs; the SVG uses one uniform `translate(180 80) scale(.65)` registration to match the original body. There is no independent lung distortion. It retains lungs, heart, liver, stomach, kidneys, bowel, bladder and tissue contours. The exact Home body remains the base image.

LION reuses the existing female `patient-002.webp` and male `patient-003.webp` figures from the approach film, as specifically requested by the PI. Three coral FDG and nine bright blue PSMA tumour masks now reuse the approved PUMA atlas alpha for stronger visibility at preview scale. Shapes are coloured with instance-specific SVG flood/composite filters, without changing the source raster. Captions remain FDG and PSMA only. Each SVG is absolutely contained in a flexible image region; the label is a separate fixed-height sibling with a 28px gap. See `lion-visibility.md` for placements and provenance.

FALCON now compares displaced frames with a clean aligned reference in two larger, bounded artwork regions. It settles by 1.25 seconds, holds the result and repeats on a five-second cycle. Hover and reduced motion show the completed alignment immediately. Narrow layouts size the stage to its available width to avoid dead space around the figures. See `falcon-demo.md` for the spatial concept and motion details.

### moose-contours-v5.png

Saved asset: `public/illustrations/anatomy/moose-contours-v5.png`.

Generated images are saved to /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e as /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-ad3dee75-f7a4-4a86-88dc-a49708822d54.png.

Final built-in prompt:

> Use case: precise-object-edit. Image 1 is the edit target, the original filled-organ wireframe illustration. Convert precisely those coloured internal organs and green tissue regions into clean fine coloured segmentation CONTOURS, with NO filled areas. Preserve the original organ shapes, sizes and positions, including the broad rounded lungs. Do NOT make the lungs long thin slivers and do NOT enlarge them. Keep the lung outlines at exactly their original coordinates (approximately left x388..500/y274..485, right x525..635/y274..485 on the 1024x1536 canvas). Keep the heart, liver, stomach, kidneys, bowel and bladder contours at their original coordinates too. Simplify their interior detail to a few clean anatomical boundaries, no dense mesh inside organs. Colour mapping: lungs muted blue, heart coral, liver ochre, stomach coral, kidneys coral, bowel muted blue/green, bladder ochre, thigh/shoulder muscle regions muted sage. REMOVE the entire outer beige human wireframe and REMOVE the black background, leaving ONLY the coloured internal organ/tissue outlines on a truly transparent RGBA canvas, including transparent organ interiors. Image 2 is the exact matching bare body registration reference; the extracted contour layer must overlay it without any scaling or translation. Crucial: retain full 1024x1536 canvas and all original empty margins; do not crop or resize the organ group to fill canvas. No human mesh in output, no text, no shading, no gradient, no glow, no fills. This is a direct outline conversion of the original, not a new arrangement of organs.

### Superseded: lion-fdg-female-v2.png

Saved asset: `public/illustrations/anatomy/lion-fdg-female-v2.png`.

Generated images are saved to /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e as /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-2654f29f-7c69-46f9-895d-3e2c5bb94ad3.png.

Final built-in prompt:

> Scientific university research illustration: an adult woman in a smooth opaque black full-length medical scanning bodysuit, including black chest coverage, with a sparse warm ivory wireframe grid drawn across the bodysuit and a blank mannequin head. Match the supplied reference's sparse grid aesthetic, neutral forward-facing pose and full-length proportions. Adult female silhouette, relaxed arms at sides, full head and feet visible. For an FDG breast-cancer schematic, draw one small coral irregular contour ring OVER THE SUIT at the upper outer chest on image-right and two smaller coral rings near the adjacent axilla. These are segmentation marks on the suit, no exposed breast or skin detail. Entire figure including bodysuit uses deep near-black #0c0b09 and thin ivory grid. 1024x1536 portrait canvas, crown near y20 and feet near y1465, figure centred. Transparent background outside the figure. No text, gradients, glow, realistic skin, shadows or surrounding scene.

### Superseded: lion-psma-male-v2.png

Saved asset: `public/illustrations/anatomy/lion-psma-male-v2.png`.

Generated images are saved to /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e as /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-affb8887-d6e5-41ff-a988-effef1037325.png.

Final built-in prompt:

> Scientific medical illustration for a university oncology research website. Match the reference's sparse warm ivory wireframe mesh, neutral front view, full body framing, line weight, and featureless mannequin style. True transparent RGBA background and transparent body interior. 1024x1536 canvas, crown y20 and soles y1465, centred x512. No filled surfaces, no skin, no clothing textures, no floor, no text or glow. Adult male anatomical mannequin for a PSMA PET prostate cancer example. Use male body proportions with broad shoulders and narrower hips. Show one small irregular blue contour ring centrally in the lower pelvis indicating a prostate lesion, plus two small pelvic node contours above it. Keep all lesion markings inside the body, contour outlines only. Restrained schematic medical diagram.

## Interaction and copy

### PUMA RGB tumour multiplexing

PI correction: show tumour heterogeneity across one patient, with different channel combinations at different lesion sites. The source atlas is saved at `public/illustrations/anatomy/puma-rgb-tumours-v1.png`. Built-in image generation edited the existing `tumour-overlay.png`; the original result remains at `/Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-f4a74ea7-321e-4167-a487-3caf05d83d69.png`. It is a transparent conceptual illustration, not patient data or a PUMA output. The source atlas is reused without changing the raster file.

Show three RGB tracer views fusing into one registered patient. Six lesion placements in `toolStudyCopy.puma.lesions` specify source-atlas crops and contributing channels: one red-only lesion, two red–green lesions, two green–blue lesions and one RGB lesion. Every contribution at a given site uses the identical source alpha mask, crop, viewport and transform. SVG flood/composite filters colour that common mask uniformly. The final lesions are therefore red, yellow, cyan or white, with no rainbow fringes within a fully overlapping lesion. Source anatomy uses separate RGB channels of the exact same Home wireframe; after fusion, one neutral Home image and one derived colour mask per lesion supply the stable final frame. Filters have instance-specific IDs so overlapping preview transitions do not collide.

Preserve the PI-requested fusion animation: the three source views merge during the first 1.68 seconds of a six-second cycle, hold the aligned composite until 4.68 seconds, then separate for the next cycle. Source views and the completed composite crossfade over 120ms at either end of the hold. Hovering the artwork presents the fully fused result for inspection; leaving restarts the fusion sequence unless explicitly paused. The existing pause control, offscreen/hidden-tab suspension and reduced-motion behaviour remain. Reduced motion shows the fused result immediately. The catalogue, inline mobile demonstration and detail route share the same component.

Source-atlas generation prompt (the final per-lesion channel assignments above are applied in the SVG):

> Use case: precise-object-edit, scientific-educational concept diagram. Edit the attached tumour-overlay image into a RED/GREEN/BLUE multiplexed tumour map for a medical imaging research website. Preserve the full portrait 1024x1536 coordinate canvas and empty margins. Retain the three tumour locations centred approximately at (432,378), (430,565), (510,716); sizes about 90,120,72 pixels respectively. Each of the THREE tumour clusters must contain distinct partially overlapping irregular lobulated subregions in pure red (#ff0000), pure green (#00ff00) and pure blue (#0000ff). The three tracer distributions are DIFFERENT in shape and extent within each shared lesion, showing intratumoural heterogeneity, not three identical outlines shifted sideways. Show delicate bright coloured outer segmentation contours and a sparse internal filament mesh, with transparent interiors. Where channels genuinely coincide, use additive secondary colours: yellow, cyan, magenta and small white intersections. Match the thin scientific wireframe aesthetic of the source lesions; keep shapes organic, not circles or a Venn diagram. IMPORTANT: remove ALL black background, diffuse glow and halo; the output must contain ONLY the three small RGB tumour clusters on a genuinely transparent RGBA background, with the full original canvas retained. No human body, no organs, no text, no labels, no connecting lines, no borders. Do not crop or enlarge the cluster group to fill the canvas. No photorealistic tissue or solid realistic organ fills.

Use two cohesive sentences, preserving input, output and practical use, in the shared body size with the shared 600 emphasis weight. Replace the duplicated preview tool name with a brief explanation of input, output and research use, from `ToolGuide.demo`. Read each linked project's current README on 26 October 2026. Content uses British English and does not claim validation or performance beyond the repository. Repository actions remain next to each tool.

Text uses a bounded word-by-word blur-to-focus reveal inspired by https://www.shadcn.io/text/text-generate-effect, implemented using the existing Framer Motion dependency. Total duration is at most 570ms; reduced motion is immediate. The complete paragraph is exposed once to screen readers. No new package is required.

MOOSE reveals once in 550ms, with no initial hold and no disappearing loop. Pointer hover cannot freeze that short entrance. Clicking the selected tool replays its preview, while hover and focus retain the existing stable selection behaviour. Looped demos retain pause controls. LION's complete illustrative pair holds still for inspection.

## Sources

- MOOSE: https://github.com/ENHANCE-PET/MOOSE#readme
- LION: https://github.com/ENHANCE-PET/LION#readme (PET-only input; tumour masks and volume/SUV CSV output)
- FALCON: https://github.com/ENHANCE-PET/FALCON#readme
- PUMA: https://github.com/ENHANCE-PET/PUMA#readme
- nifti2dicom: https://github.com/ENHANCE-PET/nifti2dicom#readme
- MOSAICX: https://github.com/DIGIT-X-Lab/MOSAICX#readme
- ANNOTATEX: https://github.com/DIGIT-X-Lab/ANNOTATEX#readme


PI clarification: two sentences is a content structure, not a two-line limit. Preserve useful explanatory detail, use the full demo width and allow natural wrapping. Do not reduce the copy merely to control line count.
