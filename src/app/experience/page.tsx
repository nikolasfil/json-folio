import React from "react";
import data from "../../../public/archived/data.json";

const ExperiencePage = () => {
  const experiences = data.experience?.items || [];
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Work Experience</h1>
      {experiences.map((exp: any, idx: number) => (
        <section key={idx} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{exp.title}</h2>
          <p className="mb-2">
            {exp.period} @ {exp.company}, {exp.location}
          </p>
          <ul>
            {exp.description.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
};

export default ExperiencePage;
