/** Editorial additions, kept separate from the automated metadata import.
 * Summaries and current-team authors checked against the linked primary sources
 * on 2026-10-27. Membership comes from team.ts, never a surname heuristic.
 * Citation counts are refreshed independently from Europe PMC.
 */
export interface PublicationNote {
  summary: string;
  authors: string[];
  groupAuthors: string[];
  doi: string;
  evidenceUrl: string;
  affiliationNote?: string;
}

const lalith = "Lalith Kumar Shiyam Sundar";

export const publicationNotes: Record<string, PublicationNote> = {
  "scholar:L6iMPN4AAAAJ:bFI3QPDXJZMC": {
    authors: ["Lena Giebeler", "Deepa Krishnaswamy", "David Clunie", "Jakob Wasserthal", "Lalith Kumar Shiyam Sundar", "Andres Diaz-Pinto", "Klaus H. Maier-Hein", "Murong Xu", "Bjoern Menze", "Steve Pieper", "Ron Kikinis", "Andrey Fedorov"],
    summary: "Different AI tools can draw different boundaries around the same organ. This work makes their results easier to compare, helping researchers spot disagreements and inspect possible errors when expert reference outlines are unavailable.",
    groupAuthors: [lalith],
    doi: "10.1117/1.JMI.13.6.062204",
    evidenceUrl: "https://arxiv.org/abs/2512.15921",
  },
  "scholar:L6iMPN4AAAAJ:zA6iFVUQeVQC": {
    authors: ["Daria Ferrara", "Manuel Pires", "Sebastian Gutschmayer", "Josef Yu", "Yasser G. Abdelhafez", "Elisabetta Abenavoli", "Ramsey D. Badawi", "Abhijit J. Chaudhari", "Moon S. Chen Jr.", "Simon R. Cherry", "Armin Frille", "Barbara K. Geist", "Stefan Gruenert", "Marcus Hacker", "Swen Hesse", "Teresa Kerkhoff", "Pia Linder", "Johanna Pappisch", "Smilla Pusitz", "Osama A. Raslan", "Ivo Rausch", "Siba P. Raychaudhuri", "Osama Sabri", "Fabian P. Schmidt", "Roberto Sciagrà", "Benjamin A. Spencer", "Guobao Wang", "Hubert Wirtz", "Thomas Beyer", "Lalith Kumar Shiyam Sundar"],
    summary: "An openly shared collection pairs PET/CT scans with checked outlines of organs and tissues. It gives researchers a common resource for developing and comparing methods that study metabolism across the body.",
    groupAuthors: [lalith],
    doi: "10.1038/s41597-026-07218-y",
    evidenceUrl: "https://www.nature.com/articles/s41597-026-07218-y",
  },
  "scholar:L6iMPN4AAAAJ:NhqRSupF_l8C": {
    authors: ["Julie Auriac", "Ghada Lemoudda", "Narinée Hovhannisyan-Baghdasarian", "Manuel Pires", "Lalith Kumar Shiyam Sundar", "Paulette Salamoun-Feghali", "Romain-David Seban", "Nina Jehanno", "Christophe Nioche", "Marie Luporsi", "Thomas Beyer", "Alain Livartowski", "Nicolas Girard", "Irène Buvat", "Fanny Orlhac"],
    summary: "Brain activity on routine PET scans was linked to survival in people with advanced lung cancer, adding information beyond tumour measurements. These retrospective findings suggest a possible marker to investigate in future studies.",
    groupAuthors: [lalith],
    doi: "10.2967/jnumed.125.271400",
    evidenceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13321949/",
  },
  "scholar:L6iMPN4AAAAJ:D03iK_w7-QYC": {
    authors: ["Maurice M. Heimer", "Jakob Dexl", "Johanna Ta", "Ricarda Ebner", "Felix L. Herr", "Leon Orasanin", "Katharina Jeblick", "Lisa C. Adams", "Lalith K. Shiyam Sundar", "Amanda Tufman", "Rudolf A. Werner", "Gabriel Sheikh", "Jens Ricke", "Michael Ingrisch", "Matthias P. Fabritius", "Clemens C. Cyran"],
    summary: "Finding tumours accurately does not automatically mean assigning the right cancer stage. This study found that AI could detect many lesions yet overestimate disease spread, showing why evaluation must reflect the clinical decision it supports.",
    groupAuthors: [lalith],
    doi: "10.1007/s00259-025-07677-2",
    evidenceUrl: "https://link.springer.com/article/10.1007/s00259-025-07677-2",
  },
  "scholar:L6iMPN4AAAAJ:f2IySw72cVMC": {
    authors: ["Shaul A. Duke", "Peter Sandøe", "Thomas Bøker Lund", "Elisabetta Maria Abenavoli", "Thomas Beyer", "Daria Ferrara", "Armin Frille", "Stefan Gruener", "Osama Sabri", "Roberto Sciagrà", "Miriam Pepponi", "Hesse Swen", "Anke Tönjes", "Hubert Wirtz", "Josef Yu", "Lalith Kumar Shyam Sundar", "Sune Holm"],
    summary: "An AI explanation that helps one specialist can leave another confused. Interviews with clinicians using a developing decision-support tool show why explanations need to fit the expertise of the people expected to use them.",
    groupAuthors: [lalith],
    doi: "10.1007/s43681-025-00837-y",
    evidenceUrl: "https://link.springer.com/article/10.1007/s43681-025-00837-y",
  },
  "scholar:L6iMPN4AAAAJ:u_35RYKgDlwC": {
    authors: ["Lalith Kumar Shiyam Sundar", "Sebastian Gutschmayer", "Manuel Pires", "Daria Ferrara", "Toni Nguyen", "Yasser Gaber Abdelhafez", "Benjamin Spencer", "Simon R. Cherry", "Ramsey D. Badawi", "David Kersting", "Wolfgang P. Fendler", "Moon-Sung Kim", "Martin Lyngby Lassen", "Philip Hasbak", "Fabian Schmidt", "Pia Linder", "Xingyu Mu", "Zewen Jiang", "Elisabetta M. Abenavoli", "Roberto Sciagrà", "Armin Frille", "Hubert Wirtz", "Swen Hesse", "Osama Sabri", "Dale Bailey", "David Chan", "Jason Callahan", "Rodney J. Hicks", "Thomas Beyer"],
    summary: "PUMA lines up PET/CT scans taken with different tracers and combines them into one colour image. Researchers can compare complementary signals at the same location and explore how disease differs across the body.",
    groupAuthors: [lalith],
    doi: "10.2967/jnumed.125.269688",
    evidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/40967756/",
  },
  "scholar:L6iMPN4AAAAJ:yD5IFk8b50cC": {
    authors: ["Sophie Carina Siegmund", "Magdalena Schöll", "Vera U. Wenter", "Gabriel T. Sheikh", "Maximilian Scheifele", "Franz Josef Gildehaus", "Simon Lindner", "Lalith K. Shiyam Sundar", "Christine Spitzweg", "Christoph J. Auernhammer", "Rudolf A. Werner", "Mathias J. Zacherl"],
    summary: "How a tumour is outlined on a PET scan changes its measured size. Comparing methods on lymph-node metastases identified a promising approach, with further validation needed before using it to measure total tumour burden or monitor treatment.",
    groupAuthors: [lalith],
    doi: "10.1186/s41824-025-00273-5",
    evidenceUrl: "https://link.springer.com/article/10.1186/s41824-025-00273-5",
  },
  "scholar:L6iMPN4AAAAJ:cFHS6HbyZ2cC": {
    authors: ["Sebastian Gutschmayer", "Josef Yu", "Barbara Katharina Geist", "Öykü Özer", "Bettina Reiterits", "Daria Ferrara", "Manuel Pires", "Ivo Rausch", "Harald Ibeschitz", "Georgios Karanikas", "Lalith Kumar Shiyam Sundar", "Lukas Nics", "Zacharias Chalampalakis", "Dina Muin", "Werner Langsteger", "Marcus Hacker", "Thomas Beyer"],
    summary: "Repeat PET/CT scans from healthy volunteers help researchers understand how much organ measurements naturally vary. This open dataset provides a reference for studying metabolism across the body and checking whether measurements are repeatable.",
    groupAuthors: [lalith],
    doi: "10.1038/s41597-025-05997-4",
    evidenceUrl: "https://www.nature.com/articles/s41597-025-05997-4",
  },
  "scholar:L6iMPN4AAAAJ:fPk4N6BV_jEC": {
    authors: ["Julie Auriac", "Christophe Nioche", "Narinée Hovhannisyan-Baghdasarian", "Charlotte Loisel", "Romain-David Seban", "Nina Jehanno", "Lalith Kumar Shiyam Sundar", "Thomas Beyer", "Irène Buvat", "Fanny Orlhac"],
    summary: "MOOSE and TotalSegmentator often produce similar organ measurements, but they are not interchangeable for every organ or measurement. Average PET uptake was generally more consistent between tools than peak or maximum uptake.",
    groupAuthors: [lalith],
    doi: "10.1002/mp.70025",
    evidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/40993940/",
    affiliationNote: "Vienna affiliation in this paper",
  },
  "epmc:MED:42816125": {
    "authors": [
      "Manuel Pires",
      "Sebastian Gutschmayer",
      "Enrica Bergalla",
      "Stephane Chauvie",
      "Dominik Amereller",
      "Elisabetta Abenavoli",
      "Aleksa Lazarevic",
      "Natalia Wegrzyn",
      "Philip Richter",
      "Iustin Tibu",
      "Ken Miller",
      "David Kersting",
      "Moon-Sung Kim",
      "Jakob Dexl",
      "Michael Ingrisch",
      "Clemens C Cyran",
      "Maurice Heimer",
      "Mej Kazazi",
      "Jason Callahan",
      "Rodney Hicks",
      "Eduardo Calderón",
      "Jonas Benecke",
      "Fabian Schmidt",
      "Roberto Sciagra",
      "Julie Auriac",
      "Romain-David Seban",
      "Fanny Orlhac",
      "Irene Buvat",
      "Sophie Carina Siegmund",
      "Liam Widjaja",
      "Rudolf A Werner",
      "Giulia Santo",
      "Ariane Kronthaler",
      "Irene J Virgolini",
      "Yasser Gaber Abdelhafez",
      "Hande Nalbant",
      "Miju Cheon",
      "Ramsey D Badawi",
      "Lorenzo Nardo",
      "Anting Li",
      "Ahti Vehmanen",
      "Jukka Kemppainen",
      "Riku Klén",
      "Thomas Beyer",
      "Lalith Kumar Shiyam Sundar"
    ],
    "summary": "LION outlines tumours in FDG and PSMA scans using the PET image alone. The study shows how organ context and varied tumour locations in the training data help the models work across different diseases.",
    "groupAuthors": [
      "Lalith Kumar Shiyam Sundar"
    ],
    "doi": "10.2967/jnumed.126.272852",
    "evidenceUrl": "https://pubmed.ncbi.nlm.nih.gov/42816125/"
  },
  "epmc:MED:42738377": {
    "authors": [
      "Blerina Resuli",
      "Amanda Tufman",
      "Friederike Völter",
      "Diego Kauffmann-Guerrero",
      "Paula Mras",
      "Paola Arnold",
      "Clemens Bleistein",
      "Jürgen Behr",
      "Victoriya Vasileva",
      "Lalith Kumar Shiyam Sundar",
      "Jens Ricke",
      "Clemens Cyran",
      "Wolfgang G Kunz",
      "Matthias P Fabritius",
      "Nabeel Mansour"
    ],
    "summary": "Measurements of muscle and abdominal fat on CT were associated with survival in people receiving immunotherapy for advanced lung cancer. These exploratory findings suggest body composition may add useful information, but need confirmation in larger studies.",
    "groupAuthors": [
      "Lalith Kumar Shiyam Sundar"
    ],
    "doi": "10.3390/cancers18172857",
    "evidenceUrl": "https://pubmed.ncbi.nlm.nih.gov/42738377/"
  },
  "epmc:MED:42350034": {
    "authors": [
      "Alina T Küper",
      "Lalith Kumar Shiyam Sundar",
      "Loíc Djaileb",
      "Justin Roschlak",
      "Kim M Pabst",
      "Ieva Ciuciulkaite",
      "Sofia Carrilho Vaz",
      "Anja Welt",
      "Noah Hammersen",
      "Michael Nader",
      "Lale Umutlu",
      "Martin Schuler",
      "Ken Herrmann",
      "Wolfgang P Fendler",
      "Sherko Kümmel",
      "David Kersting"
    ],
    "summary": "The study compared PET tracers that reveal different features of breast cancer. Standard FDG imaging detected disease better overall, while receptor-targeted imaging suggested a possible treatment target in a small subset of patients.",
    "groupAuthors": [
      "Lalith Kumar Shiyam Sundar"
    ],
    "doi": "10.2967/jnumed.126.272521",
    "evidenceUrl": "https://pubmed.ncbi.nlm.nih.gov/42350034/"
  },
  "epmc:MED:42432027": {
    "authors": [
      "Katharina Jeblick",
      "Balthasar Schachtner",
      "Andreas Mittermeier",
      "Jakob Dexl",
      "Philipp Wesp",
      "Thomas Küstner",
      "Sergios Gatidis",
      "Marcel Früh",
      "Matthias P Fabritius",
      "Felix Herr",
      "Lena Unterrainer",
      "Konrad Klimek",
      "Gabriel Sheikh",
      "Guido Böning",
      "Matthias Brendel",
      "Jens Ricke",
      "Rudolf A Werner",
      "Sijing Gu",
      "Lalith Kumar Shiyam Sundar",
      "Michael Ingrisch",
      "Thomas Geyer",
      "Clemens Cyran"
    ],
    "summary": "An open collection of PSMA PET/CT scans includes tumour outlines drawn by experts. It provides a shared resource for training and comparing methods that detect and measure prostate cancer on scans.",
    "groupAuthors": [
      "Lalith Kumar Shiyam Sundar"
    ],
    "doi": "10.1038/s41597-026-07821-z",
    "evidenceUrl": "https://pubmed.ncbi.nlm.nih.gov/42432027/"
  },
};
