import React, { useEffect, useRef, useState } from "react";

const HeroBanner = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showControl, setShowControl] = useState(false);
  const [showEndText, setShowEndText] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Video sources
  const desktopVideoUrl =
    "https://res.cloudinary.com/dbvdsg784/video/upload/q_auto,f_auto/v1743912145/hero-video_er3cen.mp4";
  const mobileVideoUrl =
    "https://res.cloudinary.com/dbvdsg784/video/upload/v1744235335/DearHenry_Web_guy4tb.mp4";
  const placeholderImageUrl =
    "https://res.cloudinary.com/dbvdsg784/image/upload/v1744235430/Screenshot_2025-03-25_111240_isj5dk.png";

  // Determine if device is mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileDevices =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileDevices.test(userAgent));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Setup video event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Start with video muted
    videoElement.muted = true;

    // Handle video events
    const handleCanPlay = () => {
      console.log("Video can play");
      if (hasUserInteracted) {
        startPlayback();
      }
    };

    const handleEnded = () => {
      console.log("Video ended");
      setShowEndText(false);
      // Reset state for loop
      videoElement.muted = true;
      setIsMuted(true);
    };

    const handleTimeUpdate = () => {
      if (!videoElement) return;

      const duration = videoElement.duration;
      const currentTime = videoElement.currentTime;

      // Show end text during last 8 seconds
      if (duration - currentTime <= 8) {
        setShowEndText(true);
      } else {
        setShowEndText(false);
      }

      // Reset state if video loops back to beginning
      if (currentTime < 0.1 && isVideoPlaying) {
        videoElement.muted = true;
        setIsMuted(true);
        setShowEndText(false);
      }
    };

    // Add event listeners
    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    // Try auto-play but prepare for failure
    tryAutoPlay();

    // Cleanup
    return () => {
      if (videoElement) {
        videoElement.removeEventListener("canplay", handleCanPlay);
        videoElement.removeEventListener("ended", handleEnded);
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.pause();
      }
    };
  }, [hasUserInteracted, isMobile]);

  // Global document event listeners for user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        console.log("User interaction detected");
        setHasUserInteracted(true);
        tryAutoPlay();
      }
    };

    // Add listeners for user interaction
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });
    document.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("click", handleUserInteraction);
    };
  }, [hasUserInteracted]);

  // Try to autoplay the video
  const tryAutoPlay = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      console.log("Attempting autoplay");
      // Load the correct source
      videoElement.src = isMobile ? mobileVideoUrl : desktopVideoUrl;
      videoElement.load();

      // Try to play
      await videoElement.play();
      console.log("Autoplay successful");
      startPlayback();
    } catch (error) {
      console.warn("Autoplay prevented:", error);
      // Show video controls and wait for manual interaction
      setShowControl(true);
      // Keep video invisible, show placeholder instead
      setIsVideoVisible(false);
    }
  };

  // Start video playback with proper states and timing
  const startPlayback = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    setIsVideoPlaying(true);
    setIsVideoVisible(true);

    // Unmute after 500ms
    setTimeout(() => {
      if (videoElement) {
        videoElement.muted = false;
        setIsMuted(false);
        setShowControl(true);
      }
    }, 500);
  };

  // Toggle mute state
  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newMutedState = !isMuted;
    videoElement.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // Manual play function for the play button
  const manualPlay = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    console.log("Manual play initiated");
    setHasUserInteracted(true);

    try {
      // Ensure video has the right source
      videoElement.src = isMobile ? mobileVideoUrl : desktopVideoUrl;
      videoElement.load();

      await videoElement.play();
      startPlayback();
    } catch (error) {
      console.error("Manual play failed:", error);
      // If even manual play fails, we're probably in a browser that
      // really doesn't support video playback well
      alert("Video playback is not supported in your browser");
    }
  };

  const scrollToContact = () => {
    const contactForm = document.getElementById("contact");
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Placeholder Image (shown until video starts playing) */}
      {!isVideoVisible && (
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={placeholderImageUrl}
            alt="Video placeholder"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={manualPlay}
              className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-all focus:outline-none"
              aria-label="Play video"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Background Video */}
      <video
        ref={videoRef}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVideoVisible ? "opacity-100" : "opacity-0"
        }`}
        preload="auto"
        muted
        loop
        playsInline
      />

      {/* Black overlay for end animation */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-black transition-opacity duration-1000 ${
          showEndText ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* End Text Animation */}
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
      {showControl && isVideoVisible && (
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
