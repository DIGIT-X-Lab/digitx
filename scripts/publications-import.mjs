/** Europe PMC core metadata. Discovery names are never sufficient for attribution. */
const normalise = value => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const doiKey = value => String(value ?? '').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').trim().toLowerCase();

export function plainText(value = '') {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '-', mdash: '-', hellip: '...' };
  let text = String(value);
  for (let pass = 0; pass < 2; pass++) text = text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity) => {
    if (entity[0] !== '#') return entities[entity.toLowerCase()] ?? match;
    const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
  });
  return text.replace(/<\/?(?:sup|sub|i|b|em|strong)\b[^>]*>/gi, '').replace(/<[^>]*>/g, ' ').normalize('NFKC').replace(/\s+/g, ' ').trim();
}

function matchesResearcher(author, researcher) {
  const ids = [author.authorId].flat().filter(Boolean);
  const orcids = ids.filter(id => id.type === 'ORCID').map(id => id.value.replace(/^https?:\/\/orcid.org\//, ''));
  if (orcids.includes(researcher.orcid)) return true;
  if (orcids.length) return false;
  const name = normalise([author.firstName, author.lastName].filter(Boolean).join(' '));
  if (!researcher.names?.some(alias => normalise(alias) === name)) return false;
  const affiliations = author.authorAffiliationDetailsList?.authorAffiliation ?? [];
  return affiliations.some(({ affiliation }) => researcher.affiliations?.some(known => normalise(affiliation).includes(normalise(known))));
}

export function toPublication(record, config) {
  const year = Number(record.pubYear);
  const types = record.pubTypeList?.pubType ?? [];
  const journal = record.journalInfo?.journal?.title;
  if (!Number.isInteger(year) || year < config.minYear || !journal || !record.title || !record.id) return null;
  if (!types.some(type => type.toLowerCase() === 'journal article')) return null;
  if (types.some(type => /conference|congress|meeting|preprint|review|editorial|letter|comment|erratum|retract|news|correction/i.test(type))) return null;
  // Supplements with unclear article-level types are held out for manual review.
  if (/conference|congress|meeting abstracts|proceedings|\bsuppl(?:ement)?\b|^s\s?\d/i.test(`${record.journalInfo?.issue ?? ''} ${journal}`)) return null;
  const authors = record.authorList?.author ?? [];
  const groupAuthors = config.researchers.filter(person => authors.some(author => matchesResearcher(author, person))).map(person => person.name);
  if (!groupAuthors.length) return null;
  const count = record.citedByCount;
  const sourceUrl = `https://europepmc.org/article/${encodeURIComponent(record.source)}/${encodeURIComponent(record.id)}`;
  return {
    paperId: `epmc:${record.source}:${record.id}`,
    title: plainText(record.title).replace(/\.$/, ''),
    authors: authors.map(author => plainText([author.firstName, author.lastName].filter(Boolean).join(' ') || author.fullName)),
    groupAuthors, year, venue: plainText(journal),
    publicationDate: record.firstPublicationDate ?? null,
    citationCount: Number.isInteger(count) && count >= 0 ? count : null,
    citationSource: 'Europe PMC', citationUrl: sourceUrl,
    doi: doiKey(record.doi) || null, pubmedId: record.source === 'MED' ? record.id : null,
    publicationTypes: types, source: 'europe-pmc', sourceUrl,
  };
}

export function mergePublications(previous, records, config, curation) {
  if (!records.length) throw new Error('Empty metadata response; keeping the existing archive.');
  const excluded = paper => curation.exclude?.[paper.paperId] || curation.excludeDois?.[doiKey(paper.doi)];
  const key = paper => paper.doi ? `doi:${doiKey(paper.doi)}` : `title:${normalise(paper.title)}`;
  const papers = new Map();
  const existingByTitle = new Map();
  for (const raw of previous) {
    const paper = { ...raw, ...curation.overrides?.[raw.paperId] };
    if (excluded(paper) || paper.year < config.minYear) continue;
    papers.set(key(paper), paper);
    existingByTitle.set(normalise(paper.title), paper);
  }
  let eligible = 0;
  for (const record of records) {
    const imported = toPublication(record, config);
    if (!imported) continue;
    eligible++;
    if (excluded(imported)) continue;
    const existing = papers.get(key(imported)) ?? existingByTitle.get(normalise(imported.title));
    const paper = { ...imported, ...(existing ? { paperId: existing.paperId, title: existing.title } : {}), ...curation.overrides?.[existing?.paperId ?? imported.paperId] };
    if (excluded(paper)) continue;
    if (existing) papers.delete(key(existing));
    papers.set(key(paper), paper);
  }
  if (!eligible) throw new Error('No eligible verified journal papers; keeping the existing archive.');
  return [...papers.values()].sort((a, b) => b.year - a.year || (b.publicationDate ?? '').localeCompare(a.publicationDate ?? '') || a.paperId.localeCompare(b.paperId));
}

async function fetchPage(url, fetcher) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try { response = await fetcher(url, { signal: AbortSignal.timeout(20_000), headers: { Accept: 'application/json' } }); }
    catch (error) { if (attempt === 2) throw error; }
    if (response?.ok) return response.json();
    if (response && response.status !== 429 && response.status < 500) throw new Error(`Europe PMC returned ${response.status}`);
    if (attempt === 2) throw new Error(`Europe PMC returned ${response?.status ?? 'no response'}`);
    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
  }
}

export async function fetchRecords(query, fetcher = fetch) {
  const records = [];
  let cursor = '*';
  const seen = new Set();
  for (let page = 0; page < 100; page++) {
    if (seen.has(cursor)) throw new Error('Incomplete response: repeated Europe PMC cursor.');
    seen.add(cursor);
    const url = new URL('https://www.ebi.ac.uk/europepmc/webservices/rest/search');
    for (const [name, value] of Object.entries({ query, format: 'json', resultType: 'core', pageSize: '100', cursorMark: cursor })) url.searchParams.set(name, value);
    const result = await fetchPage(url, fetcher);
    const batch = result.resultList?.result;
    if (!Number.isInteger(result.hitCount) || !Array.isArray(batch) || !batch.length) throw new Error('Empty or incomplete Europe PMC response; archive unchanged.');
    records.push(...batch);
    if (records.length >= result.hitCount) return records;
    if (!result.nextCursorMark) throw new Error('Incomplete Europe PMC response: missing next cursor.');
    cursor = result.nextCursorMark;
  }
  throw new Error('Incomplete Europe PMC response: page limit exceeded.');
}

export function discoveryQuery(config) {
  const clauses = config.researchers.flatMap(person => [
    ...(person.orcid ? [`AUTHORID:${person.orcid}`] : []),
    ...(person.discoveryNames ?? []).map(name => `AUTH:"${name}"`),
  ]);
  if (!clauses.length) throw new Error('No verified publication researchers configured.');
  return `(${clauses.join(' OR ')}) AND PUB_YEAR:[${config.minYear} TO 3000]`;
}
