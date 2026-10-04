export const EMAIL = "scottbarclay02@gmail.com";
export const RESUME_HREF = "/resume.pdf";

/** Chapters I to III are sections of the home page. IV is the resume link. */
export const CHAPTERS = [
  { id: "i", numeral: "I", label: "About" },
  { id: "ii", numeral: "II", label: "Work" },
  { id: "iii", numeral: "III", label: "Contact" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];
