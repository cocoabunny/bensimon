// import React from "react";

// const HeroBanner = () => {
//   return (
//     <section className="w-full h-screen relative">
//       {/* Vimeo Embed - positioned to fill entire viewport */}
//       <div className="absolute inset-0 w-full h-full overflow-hidden">
//         <iframe
//           className="w-full h-full object-cover"
//           src="https://player.vimeo.com/video/1072715057?h=50271e040a&background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&transparent=1&muted=1&quality=1080p"
//           frameBorder="0"
//           allow="autoplay; fullscreen; picture-in-picture"
//           allowFullScreen
//           title="Dear Henry, For the Emperor."
//         ></iframe>
//       </div>
//     </section>
//   );
// };

// export default HeroBanner;

import React from "react";
const HeroBanner = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/hero-video.mp4" // Replace with actual Cloudflare hosted video URL
        type="video/mp4"
        autoPlay
        loop
        playsInline
      />
    </div>
  );
};
export default HeroBanner;
