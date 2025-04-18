import React, { useState, useEffect } from "react";
import {
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

const Navbar = ({ onContactClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nameSize, setNameSize] = useState(24); // Start with a base size

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleContactClick = () => {
    onContactClick?.();
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      // Adjust these breakpoints and scaling factors as needed
      if (viewportWidth < 640) {
        // sm
        setNameSize(20);
      } else if (viewportWidth < 768) {
        // md
        setNameSize(24);
      } else if (viewportWidth < 1024) {
        // lg
        setNameSize(28);
      } else if (viewportWidth < 1280) {
        //xl
        setNameSize(32);
      } else {
        setNameSize(36); // Default size for larger screens
      }
    };

    handleResize(); // Initial size on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-md navbar-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* масштабируемый заголовок */}
          <div
            className="flex-shrink-0 font-light italic text-white navbar-glass-text"
            style={{
              fontSize: `${nameSize}px`,
              textAlign: "center",
              flexGrow: 1,
            }} // Центрирование и изменение размера
          >
            Ben Simon
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-white focus:outline-none transition duration-300"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={handleContactClick}
              className="text-white hover:text-white transition duration-300"
            >
              <FaEnvelope size={20} />
            </button>
            <a
              href="https://www.instagram.com/ben.simon.actor/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white transition duration-300"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white transition duration-300"
            >
              <FaTiktok size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white transition duration-300"
            >
              <SiX size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden navbar-glass p-4">
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleContactClick}
              className="flex items-center space-x-2 text-white font-light hover:text-white transition duration-300"
            >
              <FaEnvelope size={20} />
              <span>Contact</span>
            </button>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white font-light hover:text-white transition duration-300"
            >
              <FaInstagram size={20} />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white font-light hover:text-white transition duration-300"
            >
              <FaTiktok size={20} />
              <span>TikTok</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white font-light hover:text-white transition duration-300"
            >
              <SiX size={20} />
              <span>X</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
