import { motion } from "framer-motion";
import type { PortfolioData } from "../../types/portfolio-data.type";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Link from "next/link";
import { getHighlightedItems } from "../../utils/highlightedItems";

const ExperienceTimeline = dynamic(() => import("../ExperienceTimeline"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

interface VolunteeringSectionProps {
  volunteering: NonNullable<PortfolioData["volunteering"]>;
  variant?: "home" | "page";
}

/**
 * Mirrors ExperienceSection, but uses volunteering data.
 */
export default function VolunteeringSection({
  volunteering,
  variant = "home",
}: VolunteeringSectionProps) {
  if (!volunteering?.enabled) return null;

  const isHome = variant === "home";
  const displayedItems = isHome
    ? getHighlightedItems(volunteering.items)
    : volunteering.items;
  const showReadMore =
    isHome && volunteering.items.length > displayedItems.length;

  return (
    <section id="volunteering" className="py-12">
      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-6 md:mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {volunteering.title.split(volunteering.highlight)[0]}
        <span className="text-purple-400"> {volunteering.highlight}</span>
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
            href="/volunteering"
            className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-all duration-200 font-semibold"
          >
            Read More
          </Link>
        </div>
      )}
    </section>
  );
}
