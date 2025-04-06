import React, { useState } from "react";
import {
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-md navbar-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 font-light text-xl navbar-glass-text italic text-white">
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
              onClick={() => scrollToSection("contact")}
              className="text-white hover:text-white transition duration-300"
            >
              <FaEnvelope size={20} />
            </button>
            <a
              href="https://www.instagram.com"
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
              onClick={() => scrollToSection("contact")}
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
              rel="noopener
              noreferrer"
              className="flex items-center space-x-2 text-white
              font-light hover:text-white transition duration-300"
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
