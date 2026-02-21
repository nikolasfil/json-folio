import React from "react";
import data from "../../../public/archived/data.json";

const AchievementsPage = () => {
  const highlights = data.achievements?.description || [];
  const certifications = data.achievements?.certifications || [];
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Highlights & Achievements</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Highlights</h2>
        <ul>
          {highlights.map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Certifications</h2>
        <ul>
          {certifications.map((cert: any, idx: number) => (
            <li key={idx}>
              {cert.name} - {cert.issuer}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default AchievementsPage;
