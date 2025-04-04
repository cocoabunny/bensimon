import React from "react";
const HeroBanner = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/DearHenry_4K.mp4" // Replace with actual Cloudflare hosted video URL
        type="video/mp4"
        autoPlay
        loop
        playsInline
      />
    </div>
  );
};
export default HeroBanner;
