"use client";

import { Suspense, type ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

import type { PortfolioData } from "../types/portfolio-data.type";
import Navbar from "./Navbar";

const BackgroundAnimation = dynamic(
  () => import("./sections/BackgroundAnimation"),
  { ssr: false, loading: () => <div /> },
);

const FooterSection = dynamic(() => import("./sections/FooterSection"), {
  ssr: false,
  loading: () => <div />,
});

export type PageShellProps = {
  data: PortfolioData;
  title: string;
  description?: string;
  /** Defaults to true */
  showBackToHome?: boolean;
  children: ReactNode;
};

/**
 * Shared page layout used by standalone pages.
 * Keeps background, navbar, padding, and footer consistent across routes.
 */
export default function PageShell({
  data,
  title,
  description,
  showBackToHome = true,
  children,
}: PageShellProps) {
  const { scrollYProgress } = useScroll();
  const backgroundX = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <>
      <Head>
        <title>
          {title} | {data.meta.title}
        </title>
        <meta name="description" content={description ?? data.meta.description} />
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
          {showBackToHome && (
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          )}

          {children}
        </main>

        <Suspense fallback={<div />}>
          <FooterSection footer={data.footer} />
        </Suspense>
      </div>
    </>
  );
}
