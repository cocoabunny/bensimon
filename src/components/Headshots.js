import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Modal from "./Modal";

const headshots = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912089/Benjamin_Simon_-_017_-_Full_sqjqlg.jpg",
    orientation: "portrait",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912090/Benjamin_Simon_-_086_-_Full_ctijcl.jpg",
    orientation: "landscape",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912089/Benjamin_Simon_-_121_-_Full_lot7uz.jpg",
    orientation: "landscape",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912093/Benjamin_Simon_-_182_lxbwn9.jpg",
    orientation: "portrait",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912091/Benjamin_Simon_-_187_zeohby.jpg",
    orientation: "portrait",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912091/Benjamin_Simon_-_226_-_Full_pwwnl0.jpg",
    orientation: "landscape",
  },
  {
    id: 7,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912094/Benjamin_Simon_-_303_udfmj6.jpg",
    orientation: "portrait",
  },
];

const Headshots = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isInViewport, setIsInViewport] = useState(false);
  const componentRef = useRef(null);
  const imageRefs = useRef([]);
  const observerRef = useRef(null);

  // Check if we're on desktop or mobile
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

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
              // Create a new image object to preload
              const img = new Image();
              img.onload = () => {
                // Once image is loaded, update the src and mark as loaded
                imgElement.src = imgSrc;
                imgElement.removeAttribute("data-src");
                setImagesLoaded((prev) => ({ ...prev, [imgSrc]: true }));
              };
              img.src = imgSrc;

              // Store current observer reference
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

    // Store current observer for cleanup
    const currentObserver = observerRef.current;

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, []);

  // Load visible images when component enters viewport
  useEffect(() => {
    if (isInViewport) {
      const startIndex = currentIndex;
      const endIndex = isDesktop
        ? (currentIndex + imagesPerView) % headshots.length
        : currentIndex;

      // Get visible images based on current view
      const visibleImageRefs = [];
      for (let i = 0; i <= endIndex - startIndex; i++) {
        const idx = (startIndex + i) % headshots.length;
        if (imageRefs.current[idx]) {
          visibleImageRefs.push(imageRefs.current[idx]);
        }
      }

      // Store current observer reference
      const currentObserver = observerRef.current;

      visibleImageRefs.forEach((img) => {
        if (img && currentObserver) {
          currentObserver.observe(img);
        }
      });
    }
  }, [isInViewport, currentIndex, isDesktop, imagesPerView]);

  // Auto rotation for desktop view - only when in viewport
  useEffect(() => {
    if (isDesktop && isInViewport) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [nextSlide, isDesktop, isInViewport]);

  // Generate low-quality placeholder URL from Cloudinary
  const getPlaceholderUrl = (url) => {
    return url.replace("/upload/", "/upload/q_10,w_100/");
  };

  // Render mobile view (single image per slide)
  const renderMobileView = () => {
    const headshot = headshots[currentIndex];
    const placeholderUrl = getPlaceholderUrl(headshot.src);

    return (
      <div className="relative w-full h-auto max-w-md mx-auto">
        <div className="w-full shadow-lg backdrop-blur-sm bg-black/30 rounded-lg overflow-hidden">
          <img
            ref={(el) => {
              if (el) imageRefs.current[currentIndex] = el;
            }}
            src={imagesLoaded[headshot.src] ? headshot.src : placeholderUrl}
            data-src={headshot.src}
            alt={`Headshot ${currentIndex + 1}`}
            className="w-full h-auto object-contain"
            onClick={() => setModalImage(headshot)}
            loading="lazy"
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
      visibleHeadshots.push({ ...headshots[index], index });
    }

    return (
      <div className="relative w-full max-w-7xl mx-auto">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white p-3 hover:opacity-70 transition z-10"
          aria-label="Previous slide"
          disabled={transitioning}
        >
          <FaChevronLeft size={28} />
        </button>

        <div className="flex justify-between items-center gap-4 px-12">
          {visibleHeadshots.map((headshot, i) => {
            const placeholderUrl = getPlaceholderUrl(headshot.src);

            return (
              <div
                key={`${headshot.id}-${i}`}
                className="w-full cursor-pointer transition-all duration-500 ease-in-out"
                onClick={() => setModalImage(headshot)}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    ref={(el) => {
                      if (el) imageRefs.current[headshot.index] = el;
                    }}
                    src={
                      imagesLoaded[headshot.src] ? headshot.src : placeholderUrl
                    }
                    data-src={headshot.src}
                    alt={`Headshot ${i + 1}`}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white p-3 hover:opacity-70 transition z-10"
          aria-label="Next slide"
          disabled={transitioning}
        >
          <FaChevronRight size={28} />
        </button>
      </div>
    );
  };

  return (
    <div
      className="py-8 md:py-16 relative bg-[#0c0f14] text-white"
      ref={componentRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isDesktop && (
          <div className="bg-transparent">{renderMobileView()}</div>
        )}

        {isDesktop && (
          <>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-white">
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
