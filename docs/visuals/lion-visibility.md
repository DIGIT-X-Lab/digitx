# LION lesion visibility, 26 October 2026

The PI requested the stronger lesion visibility already established by PUMA. `LionStudyVisual` retains the existing PAT-002 woman (`patient-002.webp`) for FDG and PAT-003 man (`patient-003.webp`) for PSMA, including their full head, feet and original pose.

The three FDG and nine PSMA placements reuse cropped alpha masks from the approved generated `puma-rgb-tumours-v1.png` atlas. SVG flood/composite filters give the masks consistent coral and blue colour while preserving their irregular filled mesh. No raster asset is altered. Each component instance has unique filter IDs, including during preview crossfades.

FDG has one larger breast lesion and two smaller adjacent axillary sites. PSMA has one pelvic site, two pelvic nodes, three spine sites, two rib sites and one proximal femoral site. Modest size increases keep the separate lesions visible at preview scale. These are conceptual illustrations, not patient data or model inference results.

The component supplies the children of `<Study slug="lion" once>` and imports its own colour stylesheet. Shared `.tool-study-tracers`, `.tool-study-tracer-art` and `.tool-study-tracer-label` styles retain the two columns, bounded image regions, 28px caption gap and shared subheading type size. The only visible labels remain FDG and PSMA. There is no added glow, motion, opacity pulse, arrow or caption.
