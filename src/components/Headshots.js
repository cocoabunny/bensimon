import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Modal from "./Modal";

const headshots = [
  {
    id: 1,
    src: "/images/Benjamin Simon - 017 - Full.jpg",
    orientation: "portrait",
  },
  {
    id: 2,
    src: "/images/Benjamin Simon - 086 - Full.jpg",
    orientation: "landscape",
  },
  {
    id: 3,
    src: "/images/Benjamin Simon - 121 - Full.jpg",
    orientation: "landscape",
  },
  {
    id: 4,
    src: "/images/Benjamin Simon - 182.jpg",
    orientation: "portrait",
  },
  {
    id: 5,
    src: "/images/Benjamin Simon - 187.jpg",
    orientation: "portrait",
  },
  {
    id: 6,
    src: "/images/Benjamin Simon - 226 - Full.jpg",
    orientation: "landscape",
  },
  {
    id: 7,
    src: "/images/Benjamin Simon - 303.jpg",
    orientation: "portrait",
  },
];

const Headshots = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const observerRef = useRef(null);
  const imageRefs = useRef([]);

  // Check if we're on desktop or mobile
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Calculate how many images to show based on viewport
  const imagesPerView = isDesktop ? 3 : 1;

  const nextSlide = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % headshots.length);
    setTimeout(() => setTransitioning(false), 500);
  }, [transitioning]);

  const prevSlide = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? headshots.length - 1 : prevIndex - 1
    );
    setTimeout(() => setTransitioning(false), 500);
  }, [transitioning]);

  // Setup IntersectionObserver for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgElement = entry.target;
            const imgSrc = imgElement.getAttribute("data-src");
            if (imgSrc) {
              imgElement.src = imgSrc;
              imgElement.removeAttribute("data-src");
              setImagesLoaded((prev) => ({ ...prev, [imgSrc]: true }));
              observerRef.current.unobserve(imgElement);
            }
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle lazy loading for gallery images
  useEffect(() => {
    // Store a reference to current images at the time this effect runs
    const currentImageRefs = [...imageRefs.current];

    currentImageRefs.forEach((img) => {
      if (img && observerRef.current) {
        observerRef.current.observe(img);
      }
    });

    return () => {
      if (observerRef.current) {
        // Use the stored reference in cleanup
        currentImageRefs.forEach((img) => {
          if (img) observerRef.current.unobserve(img);
        });
      }
    };
  }, [currentIndex]);

  // Auto rotation for desktop view
  useEffect(() => {
    if (isDesktop) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [nextSlide, isDesktop]);

  // Render mobile view (single image per slide)
  const renderMobileView = () => {
    const headshot = headshots[currentIndex];

    return (
      <div className="relative w-full h-auto max-w-md mx-auto">
        <div className="w-full shadow-lg backdrop-blur-sm bg-black/30 rounded-lg overflow-hidden">
          <img
            ref={(el) => {
              if (el) imageRefs.current[currentIndex] = el;
            }}
            src={
              imagesLoaded[headshot.src]
                ? headshot.src
                : "/images/placeholder.jpg"
            }
            data-src={headshot.src}
            alt={`Headshot ${currentIndex + 1}`}
            className="w-full h-auto object-contain"
            onClick={() => setModalImage(headshot)}
          />
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white p-3 hover:opacity-70 transition z-10"
          aria-label="Previous slide"
          disabled={transitioning}
        >
          <FaChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white p-3 hover:opacity-70 transition z-10"
          aria-label="Next slide"
          disabled={transitioning}
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    );
  };

  // Render desktop view (three images per slide)
  const renderDesktopView = () => {
    const visibleHeadshots = [];
    for (let i = 0; i < imagesPerView; i++) {
      const index = (currentIndex + i) % headshots.length;
      visibleHeadshots.push(headshots[index]);
    }

    return (
      <div className="relative w-full max-w-7xl mx-auto">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-black p-3 hover:opacity-70 transition z-10"
          aria-label="Previous slide"
          disabled={transitioning}
        >
          <FaChevronLeft size={28} />
        </button>

        <div className="flex justify-between items-center gap-4 px-12">
          {visibleHeadshots.map((headshot, index) => (
            <div
              key={`${headshot.id}-${index}`}
              className="w-full cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => setModalImage(headshot)}
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  ref={(el) => {
                    if (el) imageRefs.current[currentIndex + index] = el;
                  }}
                  src={
                    imagesLoaded[headshot.src]
                      ? headshot.src
                      : "/images/placeholder.jpg"
                  }
                  data-src={headshot.src}
                  alt={`Headshot ${index + 1}`}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-black p-3 hover:opacity-70 transition z-10"
          aria-label="Next slide"
          disabled={transitioning}
        >
          <FaChevronRight size={28} />
        </button>
      </div>
    );
  };

  return (
    <div className="py-8 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isDesktop && (
          <div className="bg-transparent">{renderMobileView()}</div>
        )}

        {isDesktop && (
          <>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12">
              Headshots
            </h2>
            {renderDesktopView()}
          </>
        )}
      </div>

      {modalImage && (
        <Modal image={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
};

export default Headshots;
