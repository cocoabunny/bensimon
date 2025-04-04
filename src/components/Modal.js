import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>
        <img
          src={image.src}
          alt="Ben Simon headshot fullscreen view"
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
};

export default Modal;
