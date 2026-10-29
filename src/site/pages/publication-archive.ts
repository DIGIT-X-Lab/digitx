import type { Publication } from "@/data/publications";

export const PUBLICATIONS_PER_PAGE = 10;

export type PublicationLayout = {
  availableHeight: number;
  yearHeadingHeight: number;
  yearGap: number;
  rowHeights: Record<string, number>;
};

/** Keep the pager compact even for a long archive. */
export function publicationPages(page: number, pageCount: number): (number | "gap")[] {
  const near = page === 1 ? Math.min(2, pageCount) : page === pageCount ? Math.max(1, pageCount - 1) : page;
  const numbers = [...new Set([1, near, pageCount])].sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  numbers.forEach((number, index) => {
    if (index && number - numbers[index - 1] > 1) items.push("gap");
    items.push(number);
  });
  return items;
}
const normalise = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function filterPublications(records: Publication[], filters: { query: string; year: string }) {
  const terms = normalise(filters.query).trim().split(/\s+/).filter(Boolean);
  return records.filter((paper) => {
    if (filters.year !== "all" && String(paper.year) !== filters.year) return false;
    const searchable = normalise([paper.title, paper.venue, ...paper.authors, ...(paper.note?.authors ?? []),
      paper.note?.summary ?? "", ...(paper.note?.groupAuthors ?? paper.groupAuthors ?? []), paper.note?.doi ?? paper.doi ?? ""].join(" "));
    return terms.every((term) => searchable.includes(term));
  }).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export function selectPublications(records: Publication[], filters: { query: string; year: string; page?: number; anchor?: string | null }, layout?: PublicationLayout) {
  const matches = filterPublications(records, filters);
  const total = matches.length;
  const starts = [0];
  // Until the browser has measured the rows, retain the normal archive fallback.
  const measured = layout && matches.every(paper => layout.rowHeights[paper.paperId] > 0);
  let used = 0;
  for (let index = 0; index < total; index++) {
    if (!measured) {
      if (index > 0 && index % PUBLICATIONS_PER_PAGE === 0) starts.push(index);
      continue;
    }
    const first = index === starts[starts.length - 1];
    const newYear = first || matches[index - 1].year !== matches[index].year;
    const rowHeight = layout.rowHeights[matches[index].paperId];
    const required = rowHeight + (newYear ? layout.yearHeadingHeight + (first ? 0 : layout.yearGap) : 0);
    if (!first && used + required > layout.availableHeight) {
      starts.push(index);
      used = layout.yearHeadingHeight + rowHeight;
    } else used += required;
    // An oversized row gets a complete page, never clipped text or an empty page.
  }
  const anchorIndex = filters.anchor ? matches.findIndex(paper => paper.paperId === filters.anchor) : -1;
  const pageCount = starts.length;
  const anchoredPage = anchorIndex >= 0 ? starts.filter(start => start <= anchorIndex).length : null;
  const page = anchoredPage ?? Math.max(1, Math.min(Number.isFinite(filters.page) ? Math.floor(filters.page!) : 1, pageCount));
  const start = starts[page - 1];
  const end = starts[page] ?? total;
  const items = matches.slice(start, end);
  const groups: { year: number | null; items: Publication[] }[] = [];
  for (const paper of items) {
    const previous = groups[groups.length - 1];
    if (previous?.year === paper.year) previous.items.push(paper);
    else groups.push({ year: paper.year, items: [paper] });
  }
  return { items, groups, total, pageCount, page, pageAnchors: starts.map(start => matches[start]?.paperId), from: total ? start + 1 : 0, to: end };
}
