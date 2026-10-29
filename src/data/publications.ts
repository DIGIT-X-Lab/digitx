import data from './publications.json';
import curation from './publications-curation.json';
import { publicationNotes, type PublicationNote } from './publication-notes';

export interface Publication {
  paperId: string;
  title: string;
  authors: string[];
  year: number | null;
  venue: string;
  publicationDate: string | null;
  citationCount: number | null;
  citationSource?: string;
  citationUrl?: string;
  groupAuthors?: string[];
  doi: string | null;
  pubmedId: string | null;
  source?: string;
  sourceProfile?: string;
  sourceUrl?: string;
  semanticScholarUrl?: string;
  note?: PublicationNote;
}

/** Verified journal papers (2025+), newest first. Editorial notes survive refreshes. */
export const publications: Publication[] = (data as Publication[])
  .filter((publication) => !Object.prototype.hasOwnProperty.call(curation.exclude, publication.paperId))
  .map((publication) => ({ ...publication, note: publicationNotes[publication.paperId] }));
