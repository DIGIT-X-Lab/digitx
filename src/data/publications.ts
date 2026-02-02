import data from './publications.json';

export interface Publication {
  paperId: string;
  title: string;
  authors: string[];
  year: number | null;
  venue: string;
  publicationDate: string | null;
  citationCount: number;
  doi: string | null;
  pubmedId: string | null;
  semanticScholarUrl: string;
}

/** All fetched publications (2025+), newest first. */
export const publications: Publication[] = data as Publication[];

/** Semantic Scholar author IDs — add new members here. */
export const AUTHOR_IDS: Record<string, string[]> = {
  'Lalith Shiyam Sundar': ['41126165', '41067995', '2002047424', '2189043918'],
  'Sahib Julka': ['51259504'],
};

/**
 * Last-name fragments used to highlight lab members in author lists.
 * Matched against the last word of each author name (case-insensitive).
 */
const LAB_MEMBER_LASTNAMES = new Set(['sundar', 'julka', 'rawat']);

export function isLabMember(authorName: string): boolean {
  const last = authorName.trim().split(/\s+/).pop()?.toLowerCase() ?? '';
  return LAB_MEMBER_LASTNAMES.has(last);
}
