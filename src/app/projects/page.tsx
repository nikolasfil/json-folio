"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const ProjectsSection = dynamic(
  () => import("../components/sections/ProjectsSection"),
  { ssr: false, loading: () => <div /> },
);

export default function ProjectsPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.projects?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load projects{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell
      data={data}
      title={data.projects.title}
      description={`All ${data.projects.title.toLowerCase()}`}
    >
      <ProjectsSection projects={data.projects} />
    </PageShell>
  );
}
