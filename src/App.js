import React, { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import Headshots from "./components/Headshots";
import Projects from "./components/Projects";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const contactRef = useRef(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans">
      <Navbar onContactClick={scrollToContact} />
      <HeroBanner />
      <Headshots openModal={openModal} />
      <Projects />
      <div ref={contactRef}>
        <ContactForm />
      </div>
      <Footer />
      <SpeedInsights />
      {selectedImage && <Modal image={selectedImage} onClose={closeModal} />}
    </div>
  );
}

export default App;
