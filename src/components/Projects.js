import React, { useState, useEffect, useRef } from "react";

const ProjectItem = ({ project, isEven, isFirst }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  // Generate low-quality placeholder URL from Cloudinary
  const getPlaceholderUrl = (url) => {
    return url.replace("/upload/", "/upload/q_10,w_100/");
  };

  const placeholderUrl = getPlaceholderUrl(project.image);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgElement = entry.target;
            const imgSrc = imgElement.getAttribute("data-src");

            if (imgSrc) {
              const img = new Image();
              img.onload = () => {
                imgElement.src = imgSrc;
                imgElement.removeAttribute("data-src");
                setImageLoaded(true);
              };
              img.src = imgSrc;

              const currentObserver = observerRef.current;
              if (currentObserver) {
                currentObserver.unobserve(imgElement);
              }
            }
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    const currentImageRef = imageRef.current;
    const currentObserver = observerRef.current;

    if (currentImageRef && currentObserver) {
      currentObserver.observe(currentImageRef);
    }

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, []);

  // Check if this is the third project (NNT Scrubs)
  const isThirdProject = project.id === 3;

  return (
    <div
      className={`flex flex-col md:flex-row mb-12 rounded-lg shadow-md overflow-hidden ${
        isEven ? "md:flex-row-reverse" : ""
      } bg-white/5`} // All cards now have the same background
    >
      <div
        className={`relative md:w-1/2 mb-6 md:mb-0 bg-black ${
          !isThirdProject ? "flex items-center justify-center" : ""
        }`}
      >
        <img
          ref={imageRef}
          src={placeholderUrl}
          data-src={project.image}
          alt={project.title}
          className={`w-full h-auto transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-70"
          } ${!isThirdProject ? "md:object-contain md:max-h-96" : ""}`}
          loading="lazy"
          style={{
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
            borderTopRightRadius: isEven ? "0.5rem" : "0",
            borderBottomRightRadius: isEven ? "0.5rem" : "0",
          }}
        />
      </div>
      <div
        className={`md:w-1/2 p-6 ${
          isEven ? "md:pr-8" : "md:pl-8"
        } flex flex-col justify-start text-white`}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 italic text-white">
          {project.title}
        </h2>
        <hr className="border-t border-white w-full mb-6" />
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
          className="inline-block py-2 px-6 rounded transition-colors w-max font-medium bg-white text-[#0c0f14] hover:bg-gray-200"
        >
          View >
        </a>
      </div>
    </div>
  );
};

const Projects = () => {
  const componentRef = useRef(null);

  // Project data with Cloudinary URLs
  const projects = [
    {
      id: 1,
      title: "Hitchhiker",
      image:
        "https://res.cloudinary.com/dbvdsg784/image/upload/v1744361985/HitchHiking_ysvsnm.png",
      role: "Ben Simon - Hitchhiker",
      director: "Ylia Trotter",
      production: "Producer: Meg Trotter",
      year: "2023",
      description:
        "This award-winning short film follows the story of one serial killer hitching a ride from another, unbeknownst to them both. The film was an official selection at multiple film festivals including Show Me Shorts, Houston Comedy Film Festival, and Melbourne Underground Film Festival, winning awards at each of these events.",
      videoLink: "https://www.youtube.com/watch?v=wJo9tbyRaLQ",
    },
    {
      id: 2,
      title: "Poison Ink",
      image:
        "https://res.cloudinary.com/dbvdsg784/image/upload/v1743916223/poisonink.proj1_ukvsgi.png",
      role: "Tyler",
      director: "Chan Chan",
      production: "Written by Jacq Jax",
      year: "2023",
      description:
        "I played the lead role of Tyler in Poison Ink, a short film shot in Melbourne, Victoria. The story centers on the paralyzing grip of writer's block—not just the creative silence, but the self-doubt and emotional unraveling that come with it...",
      videoLink: "https://vimeo.com/984699219",
    },
    {
      id: 3,
      title: "NNT Scrubs",
      image:
        "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912095/Proj_NNT_wq0xro.png",
      role: "Rock Climbing Feature Shoot",
      director: "John Doe",
      production: "ofthesaints Media Co",
      year: "2023",
      description:
        "I recently had the opportunity to model for NNT Active Wear Scrubs in a campaign that combined two things I'm passionate about: movement and functionality...",
      videoLink: "https://www.instagram.com/p/C3bX5S6pwtB/",
    },
  ];

  return (
    <div
      className="py-16 bg-[#0c0f14] text-white"
      ref={componentRef}
      id="projects"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Past Work
        </h2>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <ProjectItem
              key={project.id}
              project={project}
              isEven={index % 2 !== 0}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
