"use client";

import { useScroll, useTransform } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import Head from "next/head";
import type { PortfolioData } from "../types/portfolio-data.type";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

const BackgroundAnimation = dynamic(
  () => import("../components/sections/BackgroundAnimation"),
  { ssr: false, loading: () => <div /> },
);
const FooterSection = dynamic(
  () => import("../components/sections/FooterSection"),
  { ssr: false, loading: () => <div /> },
);

export default function EducationPage() {
  const { scrollYProgress } = useScroll();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  const backgroundX = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isDevelopment = process.env.NODE_ENV === "development";
        const url = isDevelopment
          ? "/archived/data.json"
          : process.env.NEXT_PUBLIC_PORTFOLIO_DATA_URL;
        const response = await fetch(url!);
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.education.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load education. Please try again later.
        </div>
      </div>
    );
  }

  const education = data.education;

  return (
    <>
      <Head>
        <title>
          {education.title} | {data.meta.title}
        </title>
        <meta
          name="description"
          content={`All ${education.title.toLowerCase()}`}
        />
        <link rel="icon" href={data.meta.favicon} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden relative">
        <Suspense fallback={<div />}>
          <BackgroundAnimation
            backgroundX={backgroundX}
            backgroundY={backgroundY}
            codeElements={data.codeElements}
          />
        </Suspense>

        {data.header.enabled && (
          <Navbar
            logo={data.header.logo}
            navLinks={data.header.navLinks}
            socialLinks={data.contact.socialLinks}
            activeSection=""
          />
        )}

        <main className="relative z-10 pt-20 md:pt-24 pb-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[95%] 2xl:max-w-[1600px] mx-auto w-full">
          {/* Back Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              {/* You can use an icon here if desired */}
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(() => {
              const highlightIndex = education.title.indexOf(
                education.highlight,
              );
              const titleBefore =
                highlightIndex >= 0
                  ? education.title.substring(0, highlightIndex)
                  : education.title;
              const titleAfter =
                highlightIndex >= 0
                  ? education.title.substring(
                      highlightIndex + education.highlight.length,
                    )
                  : "";
              return (
                <>
                  {titleBefore}
                  {highlightIndex >= 0 && (
                    <span className="text-purple-400">
                      {education.highlight}
                    </span>
                  )}
                  {titleAfter}
                </>
              );
            })()}
          </motion.h1>

          {/* All Education Items */}
          <div className="space-y-5 md:space-y-6">
            {education.items.map((edu, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-800/50 rounded-xl p-4 md:p-5 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start">
                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="text-base md:text-lg font-semibold text-white">
                        {edu.degree}
                      </h3>
                      <span className="text-xs tracking-wide uppercase text-gray-400 bg-gray-800/80 px-3 py-1 rounded-full hidden md:inline-block border border-gray-700">
                        {edu.stream}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-2">
                      {edu.institute}
                    </div>
                    <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                        <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded">
                          {edu.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-3 text-xs md:text-sm text-gray-400 flex-shrink-0 whitespace-nowrap">
                        <span>{edu.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        <Suspense fallback={<div />}>
          <FooterSection footer={data.footer} />
        </Suspense>
      </div>
    </>
  );
}
