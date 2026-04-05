import { motion } from "framer-motion";
import type { PortfolioData } from "../../types/portfolio-data.type";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Link from "next/link";
import { getHighlightedItems } from "../../utils/highlightedItems";

const ProjectCarousel = dynamic(() => import("../ProjectCarousel"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

interface ProjectsSectionProps {
  projects: PortfolioData["projects"];
  variant?: "home" | "page";
}

export default function ProjectsSection({
  projects,
  variant = "home",
}: ProjectsSectionProps) {
  if (!projects.enabled) return null;

  const isHome = variant === "home";
  const displayedItems = isHome
    ? getHighlightedItems(projects.items)
    : projects.items;
  const showReadMore = isHome && projects.items.length > displayedItems.length;

  return (
    <section id="portfolio" className="py-12">
      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-6 md:mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {projects.title.split(projects.highlight)[0]}
        <span className="text-purple-400"> {projects.highlight}</span>
      </motion.h2>

      <div className="relative">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectCarousel
            projects={displayedItems}
            showExtendedText={!isHome}
          />
        </Suspense>
      </div>
      {showReadMore && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/projects"
            className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-all duration-200 font-semibold"
          >
            Read More
          </Link>
        </div>
      )}
    </section>
  );
}
