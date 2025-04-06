import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import Headshots from "./components/Headshots";
import Projects from "./components/Projects";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { SpeedInsights } from "@vercel/speed-insights/react"; // Import the component

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="font-sans">
      <Navbar />
      <HeroBanner />
      <Headshots openModal={openModal} />
      <Projects />
      <ContactForm />
      <Footer />
      <SpeedInsights />
      {selectedImage && <Modal image={selectedImage} onClose={closeModal} />}
    </div>
  );
}

export default App;
