import React from "react";
import data from "../../../public/archived/data.json";

const AboutPage = () => {
  // Example: Render more info from data.about.more
  const more = data.about?.more || [];
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">About</h1>
      <ul>
        {more.map((item: string, idx: number) => (
          <li key={idx} className="mb-4">
            {item}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default AboutPage;
