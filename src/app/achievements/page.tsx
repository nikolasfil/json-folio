"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const AchievementsSection = dynamic(
  () => import("../components/sections/AchievementsSection"),
  { ssr: false, loading: () => <div /> },
);

export default function AchievementsPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.achievements?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load achievements{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell
      data={data}
      title={data.achievements.title}
      description={`All ${data.achievements.title.toLowerCase()}`}
    >
      <AchievementsSection achievements={data.achievements} />
    </PageShell>
  );
}
