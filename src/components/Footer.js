import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { SiX } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-white text-[#282c34] py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-xl font-light italic">
            Ben Simon
          </div>
          <div className="flex space-x-6">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#282c34] hover:text-[#3e4451]"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#282c34] hover:text-[#3e4451]"
            >
              <FaTiktok size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#282c34] hover:text-[#3e4451]"
            >
              <SiX size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
