"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const VolunteeringSection = dynamic(
  () => import("../components/sections/VolunteeringSection"),
  { ssr: false, loading: () => <div /> },
);

export default function VolunteeringPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.volunteering?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load volunteering{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell
      data={data}
      title={data.volunteering.title}
      description={`All ${data.volunteering.title.toLowerCase()}`}
    >
      <VolunteeringSection volunteering={data.volunteering} />
    </PageShell>
  );
}
