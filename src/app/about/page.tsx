import React from "react";
import data from "../../../public/archived/data.json";

const AboutPage = () => {
  // Example: Render more info from data.about.more
  const more = data.intro?.more || [];
  return (
    <>
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
      <div className="mt-8 flex justify-center">
        <a
          href="/about/page"
          className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-all duration-200 font-semibold"
        >
          Read More
        </a>
      </div>
    </>
  );
};

export default AboutPage;
