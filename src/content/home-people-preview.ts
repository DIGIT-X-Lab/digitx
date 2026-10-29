/** PI-requested dummy responses. Themes checked against the live site on
 * 2026-10-25; these are not quotations or approved personal statements.
 * Portraits are entirely fictional people, not reconstructed likenesses.
 * Keep these preview records separate from the verified researcher roster.
 */
export const homePeoplePreview: Record<string, { portrait: string; response: string }> = {
  "lalith-shiyam-sundar": {
    portrait: "/illustrations/people/portrait-01.png",
    response: "What can we learn about the body when images, clinical information and computational methods can work together?",
  },
  "hagen-lamprecht": {
    portrait: "/illustrations/people/portrait-02.png",
    response: "Can an AI research system improve an imaging model, then show us clearly whether the change actually helped?",
  },
  "peter-benedict-schildberg": {
    portrait: "/illustrations/people/portrait-03.png",
    response: "How can we connect a person’s observations over time without losing the sequence that makes their story meaningful?",
  },
};
