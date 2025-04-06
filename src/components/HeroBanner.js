import React from "react";

const HeroBanner = () => {
  const cloudinaryUrl =
    "https://res.cloudinary.com/dbvdsg784/video/upload/q_auto,f_auto/v1743912145/hero-video_er3cen.mp4";

  return (
    <div className="relative w-full h-screen">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={cloudinaryUrl}
        type="video/mp4"
        autoPlay
        loop
        playsInline
      />
    </div>
  );
};

export default HeroBanner;
