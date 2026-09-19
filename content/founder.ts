import { LINKS } from "./site";

export type Founder = {
  name: string;
  role: string;
  monogram: string;
  /** Optional photo in /public; without it the monogram renders. */
  photo?: { src: string; alt: string };
  /** He is a current student, not a graduate — keep `year` up to date each academic year. */
  education: { year: string; degree: string; institution: string; city: string };
  summary: string;
  highlights: { text: string; strong: string[] }[];
  interests: string;
  links: { portfolio?: string; github: string };
};

export const founder: Founder = {
  name: "Johnbosco J Elanjikal",
  role: "Founder & Organisation Owner",
  monogram: "JE",
  education: {
    year: "Third-year",
    degree: "B.E. Computer Science & Engineering",
    institution: "Loyola-ICAM College of Engineering and Technology",
    city: "Chennai",
  },
  summary:
    "Full-stack developer working across web platforms, real-time APIs, computer vision and systems programming.",
  highlights: [
    {
      text: "Clareo began as EyeGuard, a real-time fatigue-detection API that placed 7th at Ctrl Alt Hack 2.0.",
      strong: ["EyeGuard", "7th at Ctrl Alt Hack 2.0"],
    },
    { text: "5th place, Buildathon 3.0.", strong: ["5th place, Buildathon 3.0"] },
    {
      text: "Built Excelsior ERP, an institutional platform with role-based access.",
      strong: ["Excelsior ERP"],
    },
    { text: "Led oLearn, an e-learning platform, with a 4-member team.", strong: ["oLearn"] },
  ],
  interests: "Developer tools, hackathons, chess and systems programming.",
  links: { portfolio: LINKS.portfolio, github: LINKS.github },
};
