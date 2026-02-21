"use client";

import { useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import Script from "next/script";
import type { PortfolioData } from "./types/portfolio-data.type";
import { useActiveSection } from "./hooks/useActiveSection";
import { trackVisit } from "./functions/TrackVisit";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import { AboutSection } from "./components/sections";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { buildPageSections } from "../lib/page-builder/pageBuilder";
import { sectionRegistry } from "../lib/section-registry";

const SkillsSection = dynamic(
  () => import("./components/sections/SkillsSection"),
  { ssr: false, loading: () => <div /> },
);
const PublicationsSection = dynamic(
  () => import("./components/sections/PublicationsSection"),
  { ssr: false, loading: () => <div /> },
);
const ExperienceSection = dynamic(
  () => import("./components/sections/ExperienceSection"),
  { ssr: false, loading: () => <div /> },
);
const EducationSection = dynamic(
  () => import("./components/sections/EducationSection"),
  { ssr: false, loading: () => <div /> },
);
const ProjectsSection = dynamic(
  () => import("./components/sections/ProjectsSection"),
  { ssr: false, loading: () => <div /> },
);
const AchievementsSection = dynamic(
  () => import("./components/sections/AchievementsSection"),
  { ssr: false, loading: () => <div /> },
);
const ContactSection = dynamic(
  () => import("./components/sections/ContactSection"),
  { ssr: false, loading: () => <div /> },
);
const QuoteSection = dynamic(
  () => import("./components/sections/QuoteSection"),
  { ssr: false, loading: () => <div /> },
);
const FooterSection = dynamic(
  () => import("./components/sections/FooterSection"),
  { ssr: false, loading: () => <div /> },
);
const CustomSections = dynamic(
  () => import("./components/sections/CustomSections"),
  { ssr: false, loading: () => <div /> },
);
const BackgroundAnimation = dynamic(
  () => import("./components/sections/BackgroundAnimation"),
  { ssr: false, loading: () => <div /> },
);
const TestimonialsSection = dynamic(
  () => import("./components/sections/TestimonialsSection"),
  { ssr: false, loading: () => <div /> },
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        let url = process.env.NEXT_PUBLIC_PORTFOLIO_URL;
        if (!url || process.env.NODE_ENV === "development") {
          url = "/archived/data.json";
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch portfolio data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolioData();
  }, []);

  useEffect(() => {
    const hasTrackedVisit = sessionStorage.getItem("hasTrackedVisit");
    if (!hasTrackedVisit && data?.tracking?.enabled) {
      trackVisit(data.tracking);
      sessionStorage.setItem("hasTrackedVisit", "true");
    }
  }, [data]);

  // Build sections using the reusable engine
  const sections = buildPageSections({
    data,
    sectionRegistry,
    pageType: "home",
  });

  const backgroundX = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const activeSection = useActiveSection(data);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {/* Google Analytics */}
      {data?.tracking?.googleAnalytics?.enabled &&
        data.tracking.googleAnalytics.googleTag && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${data.tracking.googleAnalytics.googleTag}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${data.tracking.googleAnalytics.googleTag}');
              `}
            </Script>
          </>
        )}

      {data && (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden relative">
          <Suspense fallback={<div />}>
            <BackgroundAnimation
              backgroundX={backgroundX}
              backgroundY={backgroundY}
              codeElements={data.codeElements}
            />
          </Suspense>

          {data.header?.enabled && (
            <Navbar
              logo={data.header.logo}
              navLinks={data.header.navLinks}
              socialLinks={data.contact.socialLinks}
              activeSection={activeSection ?? "about"}
            />
          )}

          <main className="relative z-10 pt-20 md:pt-24 pb-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[95%] 2xl:max-w-[1600px] mx-auto w-full">
            <div className="space-y-10 md:space-y-8">
              {sections.map((section, idx) => (
                <React.Fragment key={idx}>{section}</React.Fragment>
              ))}
            </div>
          </main>

          <Suspense fallback={<div />}>
            {data.footer && <FooterSection footer={data.footer} />}
          </Suspense>
        </div>
      )}
    </>
  );
}
