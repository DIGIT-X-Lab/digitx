/** Scholar/PubMed venue strings arrive as catalogue entries, lowercase with
 * subtitles: "Journal of nuclear medicine : official publication, Society of
 * Nuclear Medicine". The archive shows the journal's name: subtitle cut at
 * the colon, volume digits dropped, title-cased with minor words and
 * acronyms left alone. Presentation only; the records keep the raw string. */
const MINOR = new Set(["of", "and", "in", "for", "the", "on", "to", "a", "an", "der", "und", "für"]);

export function cleanVenueName(venue: string) {
  const base = venue.split(/\s+[:(]/)[0].split(/\s\d/)[0].trim();
  return base.split(/\s+/).map((word, index) => {
    if (/^[A-Z]{2,}/.test(word)) return word;
    const lower = word.toLowerCase();
    if (index > 0 && MINOR.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" ");
}
