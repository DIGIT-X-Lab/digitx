/**
 * Editorial placeholders (CONTENT REQUIRED, VERIFY) render in development and in
 * preview builds made with VITE_SHOW_SLOTS=1. Production omits them entirely.
 */
export const showSlots = import.meta.env.DEV || import.meta.env.VITE_SHOW_SLOTS === "1";

/** Opt-in, local People design review; independent of other editorial slots. */
export const showPeoplePreview = import.meta.env.VITE_PEOPLE_PREVIEW === "1";

/** Opt-in local comparison; the unparameterised homepage keeps its current ending. */
export const showEndingPreview = import.meta.env.DEV || import.meta.env.VITE_ENDING_PREVIEW === "1";

/** Separate, local full-site review mockup. */
export const showReviewPrototype = import.meta.env.DEV || import.meta.env.VITE_REVIEW_PROTOTYPE === "1";

/** Local viewport workbench for the unchanged original site. */
export const showDevicePreview = import.meta.env.DEV || import.meta.env.VITE_DEVICE_PREVIEW === "1";
