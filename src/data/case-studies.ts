// Published Aim Consulting case studies Josh wrote (PRD §3.7).
import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [
  {
    cmd: "$ grep sessions analytics.log",
    stat: { text: "43,000+ sessions", source: "resume" },
    caption: "after rollout to 10,000+ stores",
    tags: ["React", "GraphQL", "2025"],
    title: "Modernizing Staff Planning with React",
    desc: "Replaced store managers' Excel staffing process for a national beverage retailer, from a 400-store pilot to full rollout.",
    href: "https://aimconsulting.com/insights/modernizing-staff-planning-with-react-case-study/",
  },
  {
    cmd: "$ git diff --stat auth/",
    stat: { text: "ADAL → MSAL", source: "resume" },
    caption: "retired auth replaced to clear a security SLA",
    tags: [".NET", "Azure.Identity", "2024"],
    title: "Compliance and Technical Debt Resolved",
    desc: "Took over 22 legacy .NET projects nobody had maintained, rebuilt their toolchains and moved them off deprecated packages to meet a security deadline.",
    href: "https://aimconsulting.com/insights/compliance-technical-debt-resolved-case-study/",
  },
];
