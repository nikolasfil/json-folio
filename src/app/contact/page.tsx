"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import PageShell from "../components/PageShell";
import { usePortfolioData } from "../hooks/usePortfolioData";

const ContactSection = dynamic(
  () => import("../components/sections/ContactSection"),
  { ssr: false, loading: () => <div /> },
);

export default function ContactPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.contact?.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load contact{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  return (
    <PageShell
      data={data}
      title={data.contact.title}
      description={`Contact ${data.meta.title}`}
    >
      <ContactSection contact={data.contact} contactForm={data.contactForm} />
    </PageShell>
  );
}
