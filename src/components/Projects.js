import React from "react";
const ProjectItem = ({ project, isEven }) => {
  return (
    <div
      className={`flex flex-col md:flex-row mb-16 ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="relative md:w-1/2 mb-6 md:mb-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <h3 className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 text-xl font-bold rounded">
          {project.title}
        </h3>
      </div>
      <div
        className={`md:w-1/2 ${
          isEven ? "md:pr-8" : "md:pl-8"
        } flex flex-col justify-center`}
      >
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            <strong>Role:</strong> {project.role}
          </li>
          <li>
            <strong>Director:</strong> {project.director}
          </li>
          <li>
            <strong>Production:</strong> {project.production}
          </li>
          <li>
            <strong>Year:</strong> {project.year}
          </li>
        </ul>
        <p className="mb-6">{project.description}</p>

        <a
          href={project.videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#282c34] text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors w-max"
        >
          Watch Now
        </a>
      </div>
    </div>
  );
};
const Projects = () => {
  // Sample project data - replace with actual project information
  const projects = [
    {
      id: 1,
      title: "Project 1",
      image: "/images/Benjamin Simon - 017 - Full.jpg",
      role: "Lead Actor",
      director: "Jane Smith",
      production: "XYZ Studios",
      year: "2023",
      description:
        "A gripping drama about overcoming personal challenges in the face of adversity.",
      videoLink: "https://example.com/video1",
    },
    {
      id: 2,
      title: "NNT Scrubs",
      image: "/images/Proj_NNT.png",
      role: "Actor",
      director: "John Doe",
      production: "ABC Films",
      year: "2023",
      description: "An advertisement for NNT Active Wear Scrubs,",
      videoLink: "https://example.com/video2",
    },
    {
      id: 3,
      title: "Project 3",
      image: "/images/Benjamin Simon - 226 - Full.jpg",
      role: "Character Actor",
      director: "Sarah Johnson",
      production: "Indie Productions",
      year: "2021",
      description:
        "An experimental short film showcasing new narrative techniques and visual storytelling.",
      videoLink: "https://example.com/video3",
    },
  ];
  return (
    <div className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Past Work
        </h2>
        <div className="space-y-12">
          {projects.map((project, index) => (
            <ProjectItem
              key={project.id}
              project={project}
              isEven={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Projects;
