"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const PublicationsSection = dynamic(
  () => import("../components/sections/PublicationsSection"),
  { ssr: false, loading: () => <div /> },
);

export default function PublicationsPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.publications?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load publications{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell
      data={data}
      title={data.publications.title}
      description={`All ${data.publications.title.toLowerCase()}`}
    >
      <PublicationsSection publications={data.publications} variant="page" />
    </PageShell>
  );
}
