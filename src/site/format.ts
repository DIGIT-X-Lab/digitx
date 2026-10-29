/** Scholar truncates long author lists with "..."; show that as "et al.". */
export function formatAuthors(authors: string[]) {
  const named = authors.filter((a) => a.trim() && a.trim() !== "...");
  const truncated = named.length < authors.length;
  return named.join(", ") + (truncated ? " et al." : "");
}

/** Scholar venues often carry volume and page numbers; keep the journal name. */
export function venueName(venue: string) {
  return venue.split(/\s\d/)[0].trim();
}
