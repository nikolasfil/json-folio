import React from "react";
import { AboutSection } from "../app/components/sections";
import dynamic from "next/dynamic";

const SkillsSection = dynamic(
  () => import("../app/components/sections/SkillsSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const PublicationsSection = dynamic(
  () => import("../app/components/sections/PublicationsSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const ExperienceSection = dynamic(
  () => import("../app/components/sections/ExperienceSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const EducationSection = dynamic(
  () => import("../app/components/sections/EducationSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const ProjectsSection = dynamic(
  () => import("../app/components/sections/ProjectsSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const AchievementsSection = dynamic(
  () => import("../app/components/sections/AchievementsSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const ContactSection = dynamic(
  () => import("../app/components/sections/ContactSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const QuoteSection = dynamic(
  () => import("../app/components/sections/QuoteSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const FooterSection = dynamic(
  () => import("../app/components/sections/FooterSection"),
  { ssr: false, loading: () => React.createElement("div") },
);
const CustomSections = dynamic(
  () => import("../app/components/sections/CustomSections"),
  { ssr: false, loading: () => React.createElement("div") },
);
const TestimonialsSection = dynamic(
  () => import("../app/components/sections/TestimonialsSection"),
  { ssr: false, loading: () => React.createElement("div") },
);

export const sectionRegistry = {
  about: AboutSection,
  skills: SkillsSection,
  publications: PublicationsSection,
  experience: ExperienceSection,
  education: EducationSection,
  portfolio: ProjectsSection,
  achievements: AchievementsSection,
  contact: ContactSection,
  quote: QuoteSection,
  testimonials: TestimonialsSection,
  custom: CustomSections,
  footer: FooterSection,
};
