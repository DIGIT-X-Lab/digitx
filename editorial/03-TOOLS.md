# Tools | public copy and records

**H1:** Tools

**Intro (PI direction, 26 October 2026: tools arise from our own biological research, then are shared openly):** We build tools to solve the problems we encounter in studying how the body works. Where we can, we share them as open-source software, so others can use them, adapt them and take the work further.

**Filter labels:** All · Image · Text

**Practical note below the released tools:** Removed at the PI’s request on 29 October 2026.

**Tags:** Image and Text map to the existing Imaging and Documents data assignments. Tools that support both carry both tags and appear in both filters.

**Catalogue (PI-selected focus-view list, 29 October 2026):** A full-width list with names, verified GitHub star counts, one plain-English description and an arrow-only action. Keep the always-visible logo in a fixed column to the left of the name and the star count close to the name. Keep Image/Text in the filters and focused-view metadata, not on every row. Group Image tools together, followed by Text tools. Search and filter the entire catalogue, then paginate eight released tools at a time; show pagination only when needed. Hover or keyboard focus reveals the white flowing highlight with text and the always-visible tool icon turning black. Selecting a row or its arrow opens a focused view with its existing demonstration looping continuously, explanation, Explore tool, verified Paper and GitHub actions. Retain pause/play and reduced-motion support. Display the dated, repository-matched GitHub star count on the row and GitHub action. Close or Escape returns to the same row. Keep the same focused view on mobile. Tools in development retain their separate group and animations. Keep interface, installation and licence details on individual tool pages. Preserve verified functions and repository links from `src/content/tools.ts`.

**Approved catalogue descriptions:**

- **MOOSE:** Segments organs and tissues in CT scans.
- **MOSAICX:** Turns medical documents into structured data linked to the source text.
- **LION:** Finds and outlines tumours in FDG and PSMA PET scans.
- **FALCON:** Corrects movement between frames in dynamic PET scans.
- **PUMA:** Aligns PET/CT scans across tracers and time.
- **ANNOTATEX:** Helps researchers label text and connect related information.
- **nifti2dicom:** Converts NIfTI images and masks into DICOM.

**Tool-page title and field labels:** What it does · See an example · Get the code · Documentation · Requirements · Related work · Known limitations · Licence · Status

**Tool records: descriptions approved in principle, operational fields require repository checks before publish.**

- **MOOSE** | Whole-body organ and tissue segmentation in CT scans. | Image | interface **VERIFY** | release **VERIFY** | link **VERIFY**.
- **LION** | Motion correction for imaging research. | Image | interface **VERIFY** | release **VERIFY** | exact scope **VERIFY**.
- **PUMA** | Alignment of multi-tracer and serial imaging studies. | Image | licence GPL-3.0 **VERIFY** | release **VERIFY**.
- **nifti2dicom** | Conversion between research imaging and DICOM formats. | Image | exact inputs and outputs **VERIFY**.
- **MOSAICX** | Extracts structured information from medical documents, with excerpts linking values to source text. | Documents | command line | public repository confirmed | Apache-2.0 confirmed in public repository.
- **ANNOTATEX** | Application for expert labelling and structuring of text. | Documents | application | public repository confirmed | licence **VERIFY**.
- **FALCON** | Detailed function **CONTENT REQUIRED**. | licence GPL-3.0 **VERIFY** | don't invent description.
- **TAIPAN** | Explores how PET signals change over time. | built, ready for validation, private | no download link; planned Apache-2.0 on release, not a current licence.
- **Lumos** | Turns documents into structured data and runs analyses through Ask Lumos. | built, ready for validation, private | no download link; planned Apache-2.0 on release.
- **GALAH** | Turns PET/CT images into a report draft for clinician review. | built, ready for validation, private | no download link; planned Apache-2.0 on release.

## Tools awaiting release, revised after PI feedback 27 October 2026

TAIPAN, Lumos and GALAH are built and need validation. This is background context, not the public headline. The PI rejected the validation timeline, disconnected layout and literal “The tools are built” copy. The section should communicate the research problem, the tool's contribution and a meaningful opportunity to collaborate, with strong visual treatment.

**Section:** COMING SOON

**Animated heading (PI-approved revision, 29 October 2026):** Use the straight-line React Bits Text Loop for “COMING SOON”. Use a compact white banner with black text, moving slowly and seamlessly across the available width. Use normal letter spacing and the smaller shared heading role so it reads as a subdivision of Tools. Keep the gap after the released list to 32px on desktop and 24px on mobile. Hover does not interrupt the loop; the heading itself supports click and keyboard pause/resume, without an adjacent pause button. Pause offscreen and in hidden tabs. Reduced motion shows “COMING SOON” once as a static, wrapping heading.

**Introduction:** A few things we’re working on, and would love to explore with you.

**Tool headings (PI direction):** Match the Research pillars: Image/Text metadata, left-aligned tool names, boxed +/− controls, white hover/focus highlight and one drawer open at a time. Start closed; allow click, keyboard and Escape. Keep the animated section title above these controls.

**TAIPAN headline:** See what time reveals.

**TAIPAN summary:** A dynamic PET scan records how a tracer moves through the body over time. TAIPAN turns those changing signals into spatial maps, helping researchers explore the physiology behind the images.

**TAIPAN invitation:** Working with dynamic PET? Let’s explore what we could learn together.

**Lumos headline:** Your documents. New questions.

**Lumos summary:** Lumos turns your documents into a dataset you can check against the source. Ask a research question, and Ask Lumos runs the analysis and creates figures for you, all in one workspace.

**Lumos invitation:** Have a research question buried in documents? We’d love to hear it.

**GALAH headline:** From images to a report.

**GALAH summary:** Bring a PET/CT study into GALAH and ask it to draft a report. Image viewing, measurements and reporting share one workspace, so clinicians can review the findings and refine the draft alongside the scan.

**GALAH invitation:** Work with PET/CT? Help us evaluate how this fits into reading and reporting.

**GUI workflow previews (PI correction):** All three are applications. Show dynamic PET → temporal analysis → spatial maps for TAIPAN; documents → dataset → Ask Lumos analysis → figure for Lumos; PET/CT images → request → generated report draft for GALAH. Use the existing synthetic CHILI and Lumos examples and fictional GALAH demo prose. Do not expose named TAIPAN parameters, methods or unpublished findings. Make the section heading visually stronger with the shared section type role. Remove the generic infrastructure sentence.

**Preview corrections:** Use the actual opening CHILI circulation animation for TAIPAN. Reuse the original Lumos HTML scenes rather than embedding a video. GALAH greets first, followed by the user request and a generated report in the same dark, scrolling chat, with PDF/DICOM SR example exports. All three preview windows share their size and arrangement. Lumos shows its complete interface and has no bottom explanatory sentence. GALAH reveals characters smoothly, with stable word wrapping and continuous scroll following. Repeated visible synthetic labels are removed at the PI’s request; accessible descriptions and export metadata retain provenance.

**Action:** Want to validate it with us? This single invitation replaces both former lines, at the shared action type size with an arrow. Opens an email to RAD-Digitx@med.uni-muenchen.de with the subject “Validating [tool name] together”. The website sends no message.

**Individual tool page invitation:** Interested in evaluating this tool in your research? We’d love to explore a collaboration.

**Availability:** Not yet publicly available. Planned licences remain future licences. Do not expose private repository links, TAIPAN methods/results, clinical clearance claims or unconfirmed collaborators.

**Verified public source pointers:**
- MOSAICX: https://github.com/DIGIT-X-Lab/MOSAICX
- ANNOTATEX: https://github.com/DIGIT-X-Lab/ANNOTATEX

**Release policy:** An unreleased tool may be shown only if its existence/function is cleared for public disclosure; otherwise hide it. Most public tool licences may be Apache-2.0 but verify **each** in the relevant repository. Do not substitute a GitHub organisation search link for a verified individual tool repository.

**Example protocol:** All demos are precomputed and run in the browser. Text example must be synthetic or rights-cleared; never use identifiable patient records. Label synthetic examples. Do not imply validations that have not been demonstrated.

**Tool page body template:**

`[Tool name]`
`[Plain one-sentence function, approved]`
`[Real figure or labelled illustrative example]`
`[What it does: 1 short paragraph grounded in docs]`
`[Availability + interface + hardware/dependencies + code + docs]`
`[Published evaluation + limits; omit unsupported claims]`
`[Maintainers/contributors as credited; citation]`

## Demo explanations, requested 26 October 2026

Two cohesive bold sentences per tool, preserving a useful summary of its input, output and research use. Use the full available demo width with natural wrapping; there is no two-line limit. All seven linked repository READMEs were rechecked for this pass.

**moose**

MOOSE turns CT scans into labelled maps of organs and tissues. These maps give researchers defined anatomical regions to measure and compare across the body, with different models covering different structures.

**mosaicx**

MOSAICX uses a researcher-defined template to turn medical documents into structured data. It returns the requested fields with excerpts from the original text, so each extracted value can be traced back to its source and reviewed.

**lion**

LION identifies and outlines tumours in FDG or PSMA PET scans using tracer-specific models. It returns segmentation masks, tumour volumes and tracer-uptake measurements that researchers can review and use in further analysis.

**falcon**

FALCON corrects movement between frames in dynamic PET scans, including brain, whole-body and total-body studies. It produces an aligned image series for investigating how tracer uptake changes over time.

**puma**

PUMA aligns PET/CT studies acquired with different tracers or at different time points in the same person. It returns aligned images and masks, and can combine tracer signals into colour-coded views for studying complementary information together.

**annotatex**

ANNOTATEX lets researchers highlight observations in text, assign labels and connect related findings. It keeps these annotations linked to their source and exports the labels and relationships as structured data for research or model development.

**nifti2dicom**

nifti2dicom converts NIfTI images and segmentation masks into DICOM images or DICOM SEG, using a reference scan to preserve spatial geometry. It also produces a conversion report recording the geometry, label mapping and any warnings for review.
