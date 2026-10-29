# Publication updates

`npm run fetch-pubs` refreshes `src/data/publications.json` through the public [Europe PMC REST API](https://europepmc.org/RestfulWebService). It requires Node 20 or later and no API key. The existing GitHub workflow runs Mondays at 06:00 UTC; this local replacement takes effect in that workflow after integration into the default branch.

The previous Google Scholar scraper failed with HTTP 403 on [26 October 2026](https://github.com/DIGIT-X-Lab/digitx/actions/runs/40323989799). The replacement has been run locally and returns 13 original journal papers in the current 2025+ scope, retaining the nine reviewed journal records from the PI's Scholar profile and adding four verified records. The live Scholar profile could not be cross-checked because access was blocked. Citation counts now come from Europe PMC, not Google Scholar; their databases count different sets of citing works. Each positive count links to and identifies its actual source. The UI displays a hyphen for both zero and unavailable counts, while the underlying data preserves the distinction.

## Identity and coverage

`src/data/publication-researchers.json` is the explicit discovery list, independent of the People page. Currently it contains only Lalith Kumar Shiyam Sundar, with ORCID `0000-0003-3004-7937` checked against the public ORCID person record. Candidate records must match that ORCID, or a reviewed full-name variant and known author affiliation. A conflicting ORCID is rejected. Discovery by initials never grants attribution by itself.

Only the PI's papers are currently in scope. Other team members are excluded until the user supplies their Google Scholar profiles. This is not a bibliography of the entire team or the PI's full career.

When the user adds a researcher, verify the supplied Scholar identity and the authorship of its papers using primary publication/profile evidence before enabling import. Never discover or attribute by surname or initials alone, and never copy the entire team list into the importer.

## Publication rules

- Require journal-article metadata, a journal, a title, a year in scope and verified authorship.
- Reject conference papers/abstracts, proceedings, supplements with ambiguous types, preprints, reviews, letters, editorials, corrections and retracted records.
- Journal data papers remain eligible even when their abstract mentions a conference challenge.
- `src/data/publications-curation.json` handles metadata exceptions by DOI and preserves legacy IDs and approved titles. DOI matching prevents duplicate journal records; explicit exclusions remove superseded preprints.
- Preserve existing curated records when a source does not return them. Fail without overwriting on empty/incomplete responses, failed requests or no eligible verified papers. Write the finished snapshot atomically.

## Summaries and checks

`src/data/publication-notes.ts` contains sourced summaries and editorial author information, keyed by stable paper ID. Automatic updates do not invent a summary: new records without a note link readers to the original paper until a sourced summary is added. The four papers added on 27 October 2026 have summaries checked against their PubMed abstracts (PMIDs 42816125, 42738377, 42350034, 42432027).

Run `node --test scripts/test-publication-import.mjs`, `node scripts/test-publication-archive.mjs`, `npx tsc --noEmit -p tsconfig.app.json` and `npm run build`. The import tests need no dependencies or network and also run in the scheduled workflow. No external site is updated by running these commands locally.
