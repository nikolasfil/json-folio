import { motion } from "framer-motion";
import type { PortfolioData } from "../../types/portfolio-data.type";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const ExperienceTimeline = dynamic(() => import("../ExperienceTimeline"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

interface VolunteeringSectionProps {
  volunteering: NonNullable<PortfolioData["volunteering"]>;
}

/**
 * Mirrors ExperienceSection, but uses volunteering data.
 */
export default function VolunteeringSection({
  volunteering,
}: VolunteeringSectionProps) {
  if (!volunteering?.enabled) return null;

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
        <ExperienceTimeline experiences={volunteering.items} />
      </Suspense>
    </section>
  );
}
