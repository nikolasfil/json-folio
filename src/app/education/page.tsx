import React from "react";
import data from "../../../public/archived/data.json";

const EducationPage = () => {
  const education = data.education?.items || [];
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Education</h1>
      {education.map((edu: any, idx: number) => (
        <section key={idx} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{edu.degree}</h2>
          <p>
            {edu.stream} @ {edu.institute}
          </p>
          <p>
            {edu.duration}, {edu.location}
          </p>
        </section>
      ))}
    </main>
  );
};

export default EducationPage;
