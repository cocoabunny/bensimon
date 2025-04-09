import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import Modal from "./Modal";

const headshots = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743998746/Benjamin_Simon_-_017_-_Full_1_1_lxpqjf.jpg",
    orientation: "portrait",
    title: "Headshot 1",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743998747/Benjamin_Simon_-_086_-_Full_1_aqd8ot.jpg",
    orientation: "landscape",
    title: "Headshot 2",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743998762/Benjamin_Simon_-_226_1_lvcuvb.jpg",
    orientation: "landscape",
    title: "Headshot 3",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743998747/Benjamin_Simon_-_182_1_su9cxn.jpg",
    orientation: "portrait",
    title: "Headshot 4",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743998748/Benjamin_Simon_-_187_1_fuknjo.jpg",
    orientation: "portrait",
    title: "Headshot 5",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743998747/Benjamin_Simon_-_121_-_Full_1_olck1q.jpg",
    orientation: "landscape",
    title: "Headshot 6",
  },
  {
    id: 7,
    src: "https://res.cloudinary.com/dbvdsg784/image/upload/v1743912094/Benjamin_Simon_-_303_udfmj6.jpg",
    orientation: "portrait",
    title: "Headshot 7",
  },
];

const Headshots = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});
  const componentRef = useRef(null);
  const observer = useRef(null);

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

  // Preload images for visible slides
  useEffect(() => {
    const loadImagesForCurrentView = () => {
      const imagesToLoad = [];
      for (let i = 0; i < imagesPerView; i++) {
        const index = (currentIndex + i) % headshots.length;
        imagesToLoad.push(headshots[index]);
      }

      imagesToLoad.forEach((headshot) => {
        if (!imagesLoaded[headshot.src] && !loadingImages[headshot.src]) {
          setLoadingImages((prev) => ({ ...prev, [headshot.src]: true }));

          const img = new Image();
          img.onload = () => {
            setImagesLoaded((prev) => ({ ...prev, [headshot.src]: true }));
            setLoadingImages((prev) => {
              const updated = { ...prev };
              delete updated[headshot.src];
              return updated;
            });
          };
          img.src = headshot.src;
        }
      });
    };

    // Set up IntersectionObserver to trigger image loading
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImagesForCurrentView();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    const currentRef = componentRef.current;
    if (currentRef) {
      observer.current.observe(currentRef);
    }

    // Also load initially without waiting for intersection
    loadImagesForCurrentView();

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [currentIndex, isDesktop, imagesPerView, imagesLoaded, loadingImages]);

  // Auto rotate for desktop view
  useEffect(() => {
    let interval;
    if (isDesktop) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [nextSlide, isDesktop]);

  const renderImageView = (headshot) => {
    const isLoaded = imagesLoaded[headshot.src];
    const isLoading = loadingImages[headshot.src];

    return (
      <div className="relative overflow-hidden rounded-lg">
        {/* Image container with background color to hide white borders */}
        <div className="bg-[#0c0f14] relative">
          {/* Loading spinner */}
          {isLoading && !isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0c0f14]">
              <ImSpinner8 className="animate-spin text-white w-8 h-8" />
            </div>
          )}

          {/* Only show actual image once loaded */}
          {isLoaded && (
            <img
              src={headshot.src}
              alt={headshot.title}
              className={`w-full ${
                isDesktop ? "h-96 object-cover" : "h-auto object-contain"
              }`}
              onClick={() => setModalImage(headshot)}
            />
          )}

          {/* Empty placeholder with same dimensions until loaded */}
          {!isLoaded && (
            <div
              className={`w-full ${isDesktop ? "h-96" : "h-64"} bg-[#0c0f14]`}
            ></div>
          )}
        </div>

        {/* Overlay border with the exact same background color */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 2px #0c0f14",
            border: "2px solid #0c0f14",
          }}
        />
      </div>
    );
  };

  // Render mobile view (single image per slide)
  const renderMobileView = () => {
    const headshot = headshots[currentIndex];

    return (
      <div className="relative w-full h-auto max-w-md mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6 text-white">
          Headshots
        </h2>
        <div className="w-full shadow-lg backdrop-blur-sm bg-black/30 overflow-hidden">
          {renderImageView(headshot)}
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
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white hidden md:block">
          Headshots
        </h2>
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white p-3 hover:opacity-70 transition z-10"
          aria-label="Previous slide"
          disabled={transitioning}
        >
          <FaChevronLeft size={28} />
        </button>

        <div className="flex justify-between items-center gap-4 px-12">
          {visibleHeadshots.map((headshot) => (
            <div
              key={`${headshot.id}`}
              className="w-full cursor-pointer transition-all duration-500 ease-in-out"
            >
              {renderImageView(headshot)}
            </div>
          ))}
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
        {!isDesktop && renderMobileView()}

        {isDesktop && renderDesktopView()}
      </div>

      {modalImage && (
        <Modal image={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
};

export default Headshots;
