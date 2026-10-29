/** Department and institution wording confirmed by the PI, 28 October 2026. */
export const institution = "LMU University Hospital";

export const affiliations = {
  radiology: `Department of Radiology, ${institution}`,
  nuclearMedicine: `Department of Nuclear Medicine, ${institution}`,
  neurosurgery: `Department of Neurosurgery, ${institution}`,
} as const;
