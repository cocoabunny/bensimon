import React, { useState, useEffect, useRef } from "react";

const ProjectItem = ({ project, isEven }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  // Generate low-quality placeholder URL from Cloudinary
  const getPlaceholderUrl = (url) => {
    return url.replace("/upload/", "/upload/q_10,w_100/");
  };

  const placeholderUrl = getPlaceholderUrl(project.image);

  useEffect(() => {
    // Setup intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgElement = entry.target;
            const imgSrc = imgElement.getAttribute("data-src");

            if (imgSrc) {
              // Create a new image object to preload
              const img = new Image();
              img.onload = () => {
                // Once image is loaded, update the src and mark as loaded
                imgElement.src = imgSrc;
                imgElement.removeAttribute("data-src");
                setImageLoaded(true);
              };
              img.src = imgSrc;

              // Store the current observer reference
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

    // Store the current ref values
    const currentImageRef = imageRef.current;
    const currentObserver = observerRef.current;

    // Start observing once component is mounted
    if (currentImageRef && currentObserver) {
      currentObserver.observe(currentImageRef);
    }

    return () => {
      // Use stored reference in cleanup
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, []);

  return (
    <div
      className={`flex flex-col md:flex-row mb-16 ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="relative md:w-1/2 mb-6 md:mb-0">
        <img
          ref={imageRef}
          src={placeholderUrl}
          data-src={project.image}
          alt={project.title}
          className={`w-full h-auto rounded-lg shadow-lg transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-70"
          }`}
          loading="lazy"
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
  const [isInViewport, setIsInViewport] = useState(false);
  const componentRef = useRef(null);

  // Check if component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    // Store the current ref value
    const currentRef = componentRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      // Use the stored reference in the cleanup function
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Project data with Cloudinary URLs
  const projects = [
    {
      id: 1,
      title: "Poison Ink",
      image:
        "https://res.cloudinary.com/dbvdsg784/image/upload/v1743916223/poisonink.proj1_ukvsgi.png",
      role: "Tyler",
      director: "Chan Chan",
      production: "Written by Jacq Jax",
      year: "2023",
      description:
        "Cruel words are nothing more than ink on paper, or are they? A short film shot in Melbourne Victoria, Australia.",
      videoLink: "https://vimeo.com/984699219",
    },
    {
      id: 2,
      title: "NNT Scrubs",
      image:
        "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912095/Proj_NNT_wq0xro.png",
      role: "Actor",
      director: "John Doe",
      production: "ofthesaints Media Co",
      year: "2023",
      description: "An advertisement for NNT Active Wear Scrubs.",
      videoLink: "https://www.instagram.com/p/C3bX5S6pwtB/",
    },
  ];

  return (
    <div className="py-16 bg-gray-100" ref={componentRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Past Work
        </h2>
        {isInViewport && (
          <div className="space-y-12">
            {projects.map((project, index) => (
              <ProjectItem
                key={project.id}
                project={project}
                isEven={index % 2 !== 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
