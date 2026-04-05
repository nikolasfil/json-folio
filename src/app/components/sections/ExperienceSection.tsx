import { motion } from "framer-motion";
import type { PortfolioData } from "../../types/portfolio-data.type";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Link from "next/link";
import { getHighlightedItems } from "../../utils/highlightedItems";

const ExperienceTimeline = dynamic(() => import("../ExperienceTimeline"), { ssr: false, loading: () => <div>Loading...</div> });

interface ExperienceSectionProps {
  experience: PortfolioData["experience"];
  variant?: "home" | "page";
}

export default function ExperienceSection({
  experience,
  variant = "home",
}: ExperienceSectionProps) {
  if (!experience.enabled) return null;

  const isHome = variant === "home";
  const displayedItems = isHome
    ? getHighlightedItems(experience.items)
    : experience.items;
  const showReadMore = isHome && experience.items.length > displayedItems.length;

  return (
    <section id="experience" className="py-12">
      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-6 md:mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {experience.title.split(experience.highlight)[0]}
        <span className="text-purple-400"> {experience.highlight}</span>
      </motion.h2>
      <Suspense fallback={<div>Loading...</div>}>
        <ExperienceTimeline
          experiences={displayedItems}
          showExtendedText={!isHome}
        />
      </Suspense>
      {showReadMore && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/experience"
            className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-all duration-200 font-semibold"
          >
            Read More
          </Link>
        </div>
      )}
    </section>
  );
} 
