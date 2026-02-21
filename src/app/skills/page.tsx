import React from "react";
import data from "../../../public/archived/data.json";

const SkillsPage = () => {
  const skills = data.skills?.categories || [];
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Skills</h1>
      {skills.map((category: any, idx: number) => (
        <section key={idx} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
          <ul>
            {category.items.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
};

export default SkillsPage;
