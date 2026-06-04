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
  source?: string;
  sourceProfile?: string;
  sourceUrl?: string;
  semanticScholarUrl?: string;
}

/** All fetched publications (2025+), newest first. */
export const publications: Publication[] = data as Publication[];

/** Google Scholar profile IDs used by scripts/fetch-publications.mjs. */
export const GOOGLE_SCHOLAR_PROFILES: Record<string, string> = {
  'Lalith Shiyam Sundar': 'L6iMPN4AAAAJ',
};

/**
 * Last-name fragments used to highlight lab members in author lists.
 * Matched against the last word of each author name (case-insensitive).
 */
const LAB_MEMBER_LASTNAMES = new Set(['sundar', 'rawat']);

export function isLabMember(authorName: string): boolean {
  const last = authorName.trim().split(/\s+/).pop()?.toLowerCase() ?? '';
  return LAB_MEMBER_LASTNAMES.has(last);
}
