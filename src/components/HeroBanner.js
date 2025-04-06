import React, { useEffect, useRef } from "react";

const HeroBanner = () => {
  const videoRef = useRef(null);
  const cloudinaryUrl =
    "https://res.cloudinary.com/dbvdsg784/video/upload/q_auto,f_auto/v1743912145/hero-video_er3cen.mp4";

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      // Start video muted to improve autoplay reliability
      videoElement.muted = true;

      // Play the video
      const playPromise = videoElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video started playing successfully

            // Set a timeout to unmute after 1 second
            setTimeout(() => {
              videoElement.muted = false;
              console.log("Video unmuted");
            }, 1000);
          })
          .catch((error) => {
            console.error("Video play error:", error);
          });
      }

      // Add event listener to handle any play/pause issues
      videoElement.addEventListener("playing", () => {
        console.log("Video is playing");
      });
    }

    // Cleanup function
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.removeEventListener("playing", () => {});
      }
    };
  }, []);

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
    </div>
  );
};

export default HeroBanner;
