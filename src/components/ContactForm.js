import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    website: "",
    ideas: "",
    heardFrom: "",
  });

  const [expandedFields, setExpandedFields] = useState({
    ideas: false,
    heardFrom: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleExpand = (field) => {
    setExpandedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Reset form helper function
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      website: "",
      ideas: "",
      heardFrom: "",
    });
    setExpandedFields({
      ideas: false,
      heardFrom: false,
    });
  };

  // Submission tracking functions - using in-memory storage instead of localStorage
  const [submissionData, setSubmissionData] = useState({
    count: 0,
    timestamp: Date.now(),
  });

  const updateSubmissionCount = () => {
    setSubmissionData((current) => ({
      count: current.count + 1,
      timestamp: current.count === 0 ? Date.now() : current.timestamp,
    }));
  };

  const isTimeoutExpired = (timestamp) => {
    const TIMEOUT_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    return Date.now() - timestamp > TIMEOUT_DURATION;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Check submission count and timeout
    if (
      submissionData.count >= 200 &&
      !isTimeoutExpired(submissionData.timestamp)
    ) {
      setSubmitStatus("timeout");
      setShowModal(true);
      setIsSubmitting(false);
      return;
    }

    // Show immediate feedback - assume success and send in background
    const formDataCopy = { ...formData };
    updateSubmissionCount();
    setSubmitStatus("success");
    setShowModal(true);
    resetForm();
    setIsSubmitting(false);

    // Send email in background with timeout
    const submitInBackground = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", formDataCopy.fullName);
        formDataToSubmit.append("email", formDataCopy.email);
        formDataToSubmit.append(
          "website",
          formDataCopy.website || "Not provided"
        );
        formDataToSubmit.append(
          "message",
          `Ideas: ${formDataCopy.ideas}\n\nHow they heard about you: ${formDataCopy.heardFrom}`
        );
        formDataToSubmit.append(
          "_subject",
          "New Contact Form Submission - Ben Simon Actor"
        );
        formDataToSubmit.append("_cc", "benpsimon@gmail.com");
        formDataToSubmit.append("_captcha", "false");
        formDataToSubmit.append("_template", "table");

        const response = await fetch(
          "https://formsubmit.co/ajax/ben@bensimonactor.com",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: formDataToSubmit,
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error("FormSubmit failed silently:", await response.text());
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Form submission timed out - continuing in background");
        } else {
          console.error("Background submission error:", error);
        }
      }
    };

    // Fire and forget
    submitInBackground();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getModalContent = () => {
    switch (submitStatus) {
      case "success":
        return {
          title: "Thank You!",
          message: "Your message has been sent! I'll get back to you soon.",
          icon: (
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          ),
        };
      case "timeout":
        return {
          title: "Submission Limit Reached",
          message:
            "Form submissions are temporarily limited. Please try again in 24 hours or contact directly via email.",
          icon: (
            <svg
              className="w-16 h-16 text-orange-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          ),
        };
      case "error":
      default:
        return {
          title: "Something Went Wrong",
          message: "We couldn't send your message. Please try again later.",
          icon: (
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ),
        };
    }
  };

  // Modal component
  const Modal = () => {
    if (!showModal) return null;

    const modalContent = getModalContent();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 md:mx-0">
          <div className="text-center">
            {modalContent.icon}
            <h3 className="text-xl font-bold mb-2 text-[#282c34]">
              {modalContent.title}
            </h3>
            <p className="text-[#4a4f5c] mb-6">{modalContent.message}</p>
            <button
              onClick={closeModal}
              className="bg-[#282c34] text-white py-2 px-6 rounded hover:bg-[#3e4451] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="contact" className="py-16 bg-[#e9eaed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#282c34]">
          Let's Work Together
        </h2>

        <div className="mt-12 bg-[#f0f1f4] rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <div onSubmit={handleSubmit}>
                <div className="mb-6">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name*"
                    required
                    className="w-full bg-transparent border-b-2 border-[#282c34] px-3 py-2 text-[#282c34] focus:outline-none"
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email*"
                    required
                    className="w-full bg-transparent border-b-2 border-[#282c34] px-3 py-2 text-[#282c34] focus:outline-none"
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Affiliated Website"
                    className="w-full bg-transparent border-b-2 border-[#282c34] px-3 py-2 text-[#282c34] focus:outline-none"
                  />
                </div>

                <div className="mb-6">
                  <div
                    onClick={() => toggleExpand("ideas")}
                    className="w-full bg-transparent border-b-2 border-[#282c34] px-3 py-2 text-[#282c34] cursor-pointer flex justify-between items-center"
                  >
                    <span
                      className={
                        formData.ideas ? "text-[#282c34]" : "text-[#6a7085]"
                      }
                    >
                      {formData.ideas || "Tell me about your ideas"}
                    </span>
                    <span className="text-[#282c34]">
                      {expandedFields.ideas ? "−" : "+"}
                    </span>
                  </div>

                  {expandedFields.ideas && (
                    <textarea
                      name="ideas"
                      value={formData.ideas}
                      onChange={handleChange}
                      className="w-full mt-4 bg-[#e9eaed] border border-[#90949f] rounded p-3 text-[#282c34] focus:outline-none transition-all duration-300 ease-in-out"
                      rows="4"
                      maxLength="1000"
                    ></textarea>
                  )}
                </div>

                <div className="mb-6">
                  <div
                    onClick={() => toggleExpand("heardFrom")}
                    className="w-full bg-transparent border-b-2 border-[#282c34] px-3 py-2 text-[#282c34] cursor-pointer flex justify-between items-center"
                  >
                    <span
                      className={
                        formData.heardFrom ? "text-[#282c34]" : "text-[#6a7085]"
                      }
                    >
                      {formData.heardFrom || "How did you hear about me?"}
                    </span>
                    <span className="text-[#282c34]">
                      {expandedFields.heardFrom ? "−" : "+"}
                    </span>
                  </div>

                  {expandedFields.heardFrom && (
                    <textarea
                      name="heardFrom"
                      value={formData.heardFrom}
                      onChange={handleChange}
                      className="w-full mt-4 bg-[#e9eaed] border border-[#90949f] rounded p-3 text-[#282c34] focus:outline-none transition-all duration-300 ease-in-out"
                      rows="4"
                      maxLength="1000"
                    ></textarea>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#282c34] text-white py-3 px-8 rounded hover:bg-[#3e4451] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </div>
            </div>

            {/* Updated image section with mobile-friendly styling */}
            <div className="md:w-1/2 h-80 sm:h-96 md:h-auto">
              <img
                src="https://res.cloudinary.com/dbvdsg784/image/upload/v1743998747/Benjamin_Simon_-_290_1_iv1ffc.jpg"
                alt="Ben Simon"
                className="w-full h-full object-cover object-top md:object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Render the modal */}
      <Modal />
    </div>
  );
};

export default ContactForm;
