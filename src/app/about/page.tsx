"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const AboutSection = dynamic(() => import("../components/sections/AboutSection"), {
  ssr: false,
  loading: () => <div />,
});

export default function AboutPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.intro?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load about{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell data={data} title="About" description={data.meta.description}>
      <AboutSection
        intro={data.intro}
        stats={data.stats}
        socialLinks={data.contact.socialLinks}
        tracking={data.tracking}
      />
    </PageShell>
  );
}
