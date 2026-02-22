"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const SkillsSection = dynamic(() => import("../components/sections/SkillsSection"), {
  ssr: false,
  loading: () => <div />,
});

export default function SkillsPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.skills?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load skills{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell
      data={data}
      title={data.skills.title}
      description={`All ${data.skills.title.toLowerCase()}`}
    >
      <SkillsSection skills={data.skills} variant="page" />
    </PageShell>
  );
}
