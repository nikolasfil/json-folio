import React from "react";
import data from "../../../public/archived/data.json";

const ProjectsPage = () => {
  const projects = data.projects?.items || [];
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Featured Projects</h1>
      {projects.map((project: any, idx: number) => (
        <section key={idx} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
          <p>{project.description}</p>
          <ul>
            {project.technologies.map((tech: string, i: number) => (
              <li key={i}>{tech}</li>
            ))}
          </ul>
          {project.githubLink && (
            <a
              href={project.githubLink}
              className="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              className="text-green-500 underline ml-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          )}
        </section>
      ))}
    </main>
  );
};

export default ProjectsPage;
