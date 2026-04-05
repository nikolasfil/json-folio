"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const EducationSection = dynamic(
  () => import("../components/sections/EducationSection"),
  { ssr: false, loading: () => <div /> },
);

export default function EducationPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.education?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load education{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell
      data={data}
      title={data.education.title}
      description={`All ${data.education.title.toLowerCase()}`}
    >
      <EducationSection education={data.education} variant="page" />
    </PageShell>
  );
}
