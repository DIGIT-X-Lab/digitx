# Tool contour overlays

Current assets and interaction refinements are documented in [tool-demo-refinement.md](tool-demo-refinement.md). MOOSE v5 replaces the narrowed v4 lungs with a contour conversion of the original filled-organ illustration. LION now uses separate female FDG and male PSMA figures. The variants below remain as provenance only.

## Superseded v4 lung fit

Current asset: `public/illustrations/anatomy/moose-contours-v4.png`. Built-in image generation output: `/Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-9cac9942-f50e-475d-a568-1063e931f48d.png`. This supersedes v3, whose lateral lung boundaries still lacked clearance at full display size.

The current SVG registration is `translate(102 55) scale(.8)`. Equal horizontal and vertical scaling removes the previous slight horizontal stretch while keeping the overlay centred. The original body remains unchanged.

### Final prompt

Edit the transparent organ-contour overlay in Image 1. Image 2 shows how it is composited on the mannequin: both lung lower outer corners are STILL too far out. This requires a SUBSTANTIAL narrowing, not a small change. Keep Image 1's full 1024 x 1536 transparent canvas and keep the heart, liver, kidneys and bladder EXACTLY as they are. Change ONLY the two blue lung outlines and their internal curves. Pull the entire lateral boundary of the image-left lung about 45 original-canvas pixels inward toward the centre, and pull the entire lateral boundary of the image-right lung about 55 pixels inward. Make each lung approximately one-third slimmer than in Image 1. The new lungs should fit within x=415..492 on the left and x=553..625 on the right on the original canvas. Keep their apex height near y=310; raise their bases to about y=515. The low outer tips must curve inward softly with no flared pointed tails. Preserve the medial edges and a clear cardiac notch. Prioritise generous visible clearance from the torso's side outlines in the composed screenshot. Preserve the original muted blue, coral and ochre colours and line weight. Output the overlay ONLY, without the human or the screenshot. True RGBA transparency everywhere except the fine contour lines, including all interiors. No glow, shading, fill, background, labels, outer mesh, or cropping. Original canvas scale, empty margins and non-lung organs unchanged.


## Initial lung-boundary correction (superseded)

The PI identified the remaining lower lung contours extending beyond the torso. The first correction used `public/illustrations/anatomy/moose-contours-v3.png`, generated using the built-in image tool from v2 and the PI's screenshot. It narrows the lateral lung boundaries and draws their bases upward and inward. The original Home body and the existing SVG registration transform remain unchanged.

Generated source: `/Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-20c7a782-6d4a-4ee7-8e69-16e3556e8165.png`.

### Prompt

Use case: precise-object-edit. Edit Image 1, the transparent organ-contour overlay, to correct ONLY the two blue lungs. Image 2 is a screenshot showing the problem after this overlay is placed on the existing wireframe: the lower lateral lung contours stick outside the torso. Keep the original 1024 x 1536 overlay canvas and every non-lung organ in exactly the same position, size and colour. Do not output the screenshot or draw any mannequin. Make both lungs substantially narrower toward their outer and lower sides, and shorten their lower ends. Preserve the upper apex positions and the medial border beside the heart. Pull each lower outer lung edge inward so there is visible breathing room inside the torso outline. On the original overlay canvas, the left lung should stay within roughly x=405..495 and y=305..535; the right lung within x=553..640 and y=305..535. Taper the outer boundaries inward near the bases rather than making large flared pointed lower corners. Keep smooth anatomically suggestive contours and the same sparse internal curves. The heart, liver, kidneys and bladder must stay unchanged. Output only the coloured contour lines, with true transparent alpha everywhere else including all organ interiors. Preserve the original empty margins and 1024 x 1536 framing. No backdrop, body mesh, labels, trachea, limb structures, shading, fill or glow.


26 October 2026. Built-in image-generation tool, using the original Home mannequin as the registration reference. These are conceptual illustrations, not patient images or model predictions. The PI requested sparse segmentation contours with transparent interiors, retaining the original Home wireframe and page background. LION uses coral for FDG and pale blue for PSMA, with permanent text labels; no input-to-output arrow diagram.

All assets are 1024 × 1536 RGBA. The original `front-clean.webp` remains the base image in each SVG. Only the generated contour overlay is revealed. Do not flatten a backdrop into these assets or replace them with filled organ renders.

## LION paper

Pires et al. Fully Automated Segmentation of [18F]FDG and [68Ga]/[18F]PSMA PET/CT Images via Data-Centric Deep Learning. Journal of Nuclear Medicine, 30 September 2026, online ahead of print. DOI: https://doi.org/10.2967/jnumed.126.272852. Verified against https://pubmed.ncbi.nlm.nih.gov/42816125/ on 26 October 2026. This supersedes the software archive as LION's primary paper action in the catalogue and detail page.

## moose_contours

Project asset: `public/illustrations/anatomy/moose-contours-v2.png`.

Generated images are saved to /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e as /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-c8916eb9-cfbe-4f6b-83de-2f3881639aa2.png by default.

### Initial prompt

Use case: precise-object-edit. This is a non-photorealistic medical research website illustration, not a real patient image. Produce a transparent overlay aligned exactly to the provided 1024 x 1536 wireframe mannequin reference. Keep the full original 1024 x 1536 canvas, scale and coordinates, with all empty space preserved. Do NOT crop to the drawn marks. Do NOT draw the body, face, skeleton, outer human mesh, backdrop, text, labels, arrows or a legend. Output only the requested coloured segmentation contours on genuine transparent RGBA. All interiors and all remaining pixels must be transparent. Contour lines must be crisp, restrained and legible on a nearly black webpage, without glow, halos, lighting or shading. No filled tissue, no realistic fleshy organs, no solid shapes. Image 1 is the alignment reference. Image 2 is a rejected filled-organ version: use ONLY its anatomical positions, never its filled style. Replace those filled structures with sparse segmentation boundary contours: paired lungs in muted pale blue, heart in coral, liver in ochre, kidneys and bladder in blue, and restrained sage contours for a few large upper-arm and thigh tissue compartments. Use anatomically shaped main outlines and only 2–4 light contour curves within each organ to suggest depth, keeping interiors wholly transparent. Do not draw tiny vascular branching, dense mesh or intestines. The segmentation should read as precise coloured delineation floating inside the original human when composited. Remove every original body line and background pixel from the OUTPUT; the existing base mannequin will be rendered separately underneath.

## lion_fdg

Project asset: `public/illustrations/anatomy/lion-fdg-contours-v1.png`.

Generated images are saved to /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e as /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-908a14cf-765e-42cb-872d-5fe8bcfea79c.png by default.

### Initial prompt

Use case: precise-object-edit. This is a non-photorealistic medical research website illustration, not a real patient image. Produce a transparent overlay aligned exactly to the provided 1024 x 1536 wireframe mannequin reference. Keep the full original 1024 x 1536 canvas, scale and coordinates, with all empty space preserved. Do NOT crop to the drawn marks. Do NOT draw the body, face, skeleton, outer human mesh, backdrop, text, labels, arrows or a legend. Output only the requested coloured segmentation contours on genuine transparent RGBA. All interiors and all remaining pixels must be transparent. Contour lines must be crisp, restrained and legible on a nearly black webpage, without glow, halos, lighting or shading. No filled tissue, no realistic fleshy organs, no solid shapes. Draw three illustrative FDG tumour-segmentation contour clusters in restrained coral (#e36b63), located inside the mannequin's chest and upper abdomen. Approximate cluster centres on the original canvas: (440,365), (455,535), and (570,600). Each cluster is an irregular small lobulated closed boundary, about 45–85 pixels wide, with 2–3 delicate interior contour loops suggesting a segmented volume. These are hypothetical illustrative lesions, not actual inference or uptake maps. Only the coral lesion contours should exist in the output. Preserve all original empty canvas space exactly.

## lion_psma

Project asset: `public/illustrations/anatomy/lion-psma-contours-v1.png`.

Generated images are saved to /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e as /Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-5a5353f7-d0c0-4385-baf0-d1d92dec0e89.png by default.

### Initial prompt

Use case: precise-object-edit. This is a non-photorealistic medical research website illustration, not a real patient image. Produce a transparent overlay aligned exactly to the provided 1024 x 1536 wireframe mannequin reference. Keep the full original 1024 x 1536 canvas, scale and coordinates, with all empty space preserved. Do NOT crop to the drawn marks. Do NOT draw the body, face, skeleton, outer human mesh, backdrop, text, labels, arrows or a legend. Output only the requested coloured segmentation contours on genuine transparent RGBA. All interiors and all remaining pixels must be transparent. Contour lines must be crisp, restrained and legible on a nearly black webpage, without glow, halos, lighting or shading. No filled tissue, no realistic fleshy organs, no solid shapes. Draw four illustrative PSMA tumour-segmentation contour clusters in restrained pale blue (#a9bbc9), located inside the mannequin's lower abdomen, pelvis and one upper thigh. Approximate cluster centres on the original canvas: (512,710), (460,655), (555,625), and (445,880). Each cluster is an irregular small lobulated closed boundary, about 35–65 pixels wide, with 2–3 delicate interior contour loops suggesting a segmented volume. These are hypothetical illustrative lesions, not actual inference or uptake maps. Only the blue lesion contours should exist in the output. Preserve all original empty canvas space exactly.

## MOOSE registration refinement

The first contour pass had oversized limb contours and a trachea extending into the head. The refinement removes those elements and places the remaining organ contours within the reference body.

Final generated source: `/Users/nutellabear/.codex/generated_images/01a1412f-3d0e-7c01-8f85-65914fd2188e/exec-5526b28b-9259-453f-b0e6-754b2d86adb4.png`. Copied to `public/illustrations/anatomy/moose-contours-v2.png`. The SVG registers this overlay with `translate(72 55) scale(.86 .8)` to fit the organ contours within the original mannequin's chest, abdomen and pelvis. The original body is not transformed.

### Refinement prompt

Use case: precise-object-edit. Correct the transparent medical segmentation contour overlay in image 1 using the exact full-body wireframe in image 2 ONLY as a spatial registration guide. Output an RGBA overlay only, on the full original 1024 x 1536 canvas. Preserve empty space and never crop. The current overlay's upper organs and limb contours are too large and extend outside the reference body. REMOVE the trachea entirely. REMOVE ALL green arm and thigh outlines entirely. Keep only the organ contour lines: two muted blue lung boundaries, coral heart, ochre liver, blue kidneys and bladder. Make the lungs fit below the reference collarbones, clearly within the ribcage, with tops around y=295 and bottoms around y=490; their outer x bounds should be 375 to 650. The heart belongs around x=520..585, y=365..475. Liver around x=390..555, y=500..565. Kidneys at x=430..475 and 550..595, y=575..640. Bladder around x=480..545, y=720..765. These coordinates are on the ORIGINAL 1024 x 1536 canvas. All structures should be restrained, anatomically shaped contour boundaries with only 1–3 light internal contour curves, not flat icons or filled shapes. Everything outside these sparse organ lines, including every organ interior, must be alpha=0 transparent. Do not draw the body, mannequin mesh, face, limbs, background, text, arrows or labels. No shaded realistic organs, no fill, no glow or halos. Keep the precise registration and original canvas framing.
