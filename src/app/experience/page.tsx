"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const ExperienceSection = dynamic(
  () => import("../components/sections/ExperienceSection"),
  { ssr: false, loading: () => <div /> },
);

export default function ExperiencePage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.experience?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load experience{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell
      data={data}
      title={data.experience.title}
      description={`All ${data.experience.title.toLowerCase()}`}
    >
      <ExperienceSection experience={data.experience} variant="page" />
    </PageShell>
  );
}
