"use client";
import { useState, useEffect, Suspense } from "react";
import { useScroll, useTransform } from "framer-motion";
import Head from "next/head";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const BackgroundAnimation = dynamic(
  () => import("../components/sections/BackgroundAnimation"),
  { ssr: false, loading: () => <div /> },
);
const FooterSection = dynamic(
  () => import("../components/sections/FooterSection"),
  { ssr: false, loading: () => <div /> },
);

export default function ExperiencePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
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
    return <Loading />;
  }

  if (!data || !data.experience?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load experience. Please try again later.
        </div>
      </div>
    );
  }

  const experience = data.experience;
  const experiences = experience.items || [];

  return (
    <>
      <Head>
        <title>
          {experience.title} | {data.meta.title}
        </title>
        <meta
          name="description"
          content={`All ${experience.title.toLowerCase()}`}
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
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-6 text-center">
            {experience.title}
          </h1>

          {experiences.map((exp: any, idx: number) => (
            <section key={idx} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{exp.title}</h2>
              <p className="mb-2">
                {exp.period} @ {exp.company}, {exp.location}
              </p>
              <ul>
                {exp.description.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </main>

        <Suspense fallback={<div />}>
          <FooterSection footer={data.footer} />
        </Suspense>
      </div>
    </>
  );
}
