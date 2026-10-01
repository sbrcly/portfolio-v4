export const EMAIL = "scottbarclay02@gmail.com";
export const RESUME_HREF = "/resume.pdf";

/** Chapters I to IV are sections of the home page. V is the resume link. */
export const CHAPTERS = [
  { id: "i", numeral: "I", label: "Home" },
  { id: "ii", numeral: "II", label: "About" },
  { id: "iii", numeral: "III", label: "Work" },
  { id: "iv", numeral: "IV", label: "Contact" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];
