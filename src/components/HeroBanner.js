import React, { useEffect, useRef, useState } from "react";

const HeroBanner = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showControl, setShowControl] = useState(false);
  const [showEndText, setShowEndText] = useState(false);
  const cloudinaryUrl =
    "https://res.cloudinary.com/dbvdsg784/video/upload/q_auto,f_auto/v1743912145/hero-video_er3cen.mp4";

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      // Start video muted to improve autoplay reliability
      videoElement.muted = true;

      // Play the video
      const playPromise = videoElement.play();

      // Handle initial unmute after successful play
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video started playing successfully
            // Unmute after 1 second
            setTimeout(() => {
              videoElement.muted = false;
              setIsMuted(false);
              setShowControl(true); // Show control once we've unmuted
            }, 1000);
          })
          .catch((error) => {
            console.error("Video play error:", error);
            // If autoplay fails, show the control anyway
            setShowControl(true);
          });
      }

      // Function to handle video timing for end animation
      const handleTimeUpdate = () => {
        // Get video duration and current time
        const duration = videoElement.duration;
        const currentTime = videoElement.currentTime;

        // Show the text during the last 8 seconds
        if (duration - currentTime <= 8) {
          setShowEndText(true);
        } else {
          setShowEndText(false);
        }

        // Check if the video has looped (currentTime very small)
        if (currentTime < 0.1) {
          videoElement.muted = true;
          setIsMuted(true);
          setShowEndText(false); // Hide text when video loops
        }
      };

      // Use timeupdate event to track video progress
      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      // Get video metadata to know the duration
      videoElement.addEventListener("loadedmetadata", () => {
        console.log("Video duration:", videoElement.duration);
      });

      // Cleanup function
      return () => {
        if (videoElement) {
          videoElement.removeEventListener("timeupdate", handleTimeUpdate);
          videoElement.pause();
        }
      };
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const scrollToContact = () => {
    // Scroll to contact form
    const contactForm = document.getElementById("contact");
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={cloudinaryUrl}
        type="video/mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Black overlay that appears during end animation - now fully black */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-black transition-opacity duration-1000 ${
          showEndText ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* End Text Animation - Stacked and staggered text */}
      <div
        className={`absolute top-32 md:top-1/3 left-1/2 transform -translate-x-1/2
                    text-center transition-opacity duration-700 w-full px-4 ${
                      showEndText
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
      >
        <button
          onClick={scrollToContact}
          className="bg-transparent border-none p-0 cursor-pointer focus:outline-none"
          aria-label="Go to contact form"
        >
          <div className="flex flex-col items-center">
            <h1
              className="text-white font-normal text-center
                       text-5xl md:text-6xl tracking-wide italic mb-3"
            >
              Dear Henry,
            </h1>
            <p
              className="text-white font-normal text-center
                        text-3xl md:text-4xl tracking-wide ml-8"
            >
              Click me
            </p>
          </div>
        </button>
      </div>

      {/* Sound Toggle Button */}
      {showControl && (
        <button
          onClick={toggleMute}
          className="absolute bottom-8 right-8 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all focus:outline-none"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default HeroBanner;
