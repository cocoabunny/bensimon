import React, { useRef, useState, useEffect } from "react";

const ContactForm = () => {
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const websiteRef = useRef(null);
  const ideasRef = useRef(null);
  const heardFromRef = useRef(null);

  const [expandedFields, setExpandedFields] = useState({
    ideas: false,
    heardFrom: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);

  // Track which fields have been filled out
  const [filledFields, setFilledFields] = useState({
    website: false,
    ideas: false,
    heardFrom: false,
  });

  const toggleExpand = (field) => {
    setExpandedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Check if all optional fields are filled
  const checkAllFieldsFilled = () => {
    const websiteValue = websiteRef.current?.value || "";
    const ideasValue = ideasRef.current?.value || "";
    const heardFromValue = heardFromRef.current?.value || "";

    const allFilled =
      websiteValue.trim() !== "" &&
      ideasValue.trim() !== "" &&
      heardFromValue.trim() !== "";

    return allFilled;
  };

  // Track field changes
  const handleFieldChange = (field, value) => {
    setFilledFields((prev) => ({
      ...prev,
      [field]: value.trim() !== "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    const allFieldsFilled = checkAllFieldsFilled();

    // If not all fields are filled, show incomplete modal first
    if (!allFieldsFilled) {
      setShowIncompleteModal(true);
      return;
    }

    // Otherwise proceed with normal submission
    submitForm();
  };

  const submitForm = async () => {
    setIsSubmitting(true);

    const formSubmitData = new FormData();
    formSubmitData.append("fullName", fullNameRef.current.value);
    formSubmitData.append("email", emailRef.current.value);
    formSubmitData.append("website", websiteRef.current.value || "");
    formSubmitData.append("ideas", ideasRef.current.value || "");
    formSubmitData.append("heardFrom", heardFromRef.current.value || "");
    formSubmitData.append("_subject", "New portfolio contact!");
    formSubmitData.append("_captcha", "false");

    try {
      // Fixed FormSubmit endpoint - this is the correct way to use FormSubmit.co
      const response = await fetch(
        "https://formsubmit.co/ajax/Ben@bensimonactor.com", // Using ajax endpoint for API submissions
        {
          method: "POST",
          body: formSubmitData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setSubmitStatus("success");
        setShowModal(true);
        // Reset the form
        fullNameRef.current.value = "";
        emailRef.current.value = "";
        websiteRef.current.value = "";
        ideasRef.current.value = "";
        heardFromRef.current.value = "";
        setFilledFields({
          website: false,
          ideas: false,
          heardFrom: false,
        });
      } else {
        setSubmitStatus("error");
        setShowModal(true);
      }
    } catch (err) {
      setSubmitStatus("error");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Continue with submission after incomplete modal acknowledgment
  const continueWithIncompleteSubmission = () => {
    setShowIncompleteModal(false);
    submitForm();
  };

  const Modal = () => {
    if (!showModal) return null;

    const isSuccess = submitStatus === "success";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 md:mx-0 text-center">
          {isSuccess ? (
            <>
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-xl font-bold mb-2 text-[#0c0f14]">
                Thank You!
              </h3>
              <p className="text-[#4a4f5c] mb-6">
                Your message has been sent successfully. I'll get back to you
                soon.
              </p>
            </>
          ) : (
            <>
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h3 className="text-xl font-bold mb-2 text-[#0c0f14]">
                Something Went Wrong
              </h3>
              <p className="text-[#4a4f5c] mb-6">
                We couldn't send your message. Please try again later.
              </p>
            </>
          )}
          <button
            onClick={() => setShowModal(false)}
            className="bg-[#0c0f14] text-white py-2 px-6 rounded hover:bg-[#3e4451] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // New Modal for incomplete submissions
  const IncompleteModal = () => {
    if (!showIncompleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 md:mx-0 text-center">
          <svg
            className="w-16 h-16 text-yellow-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-bold mb-2 text-[#0c0f14]">
            You didn't tell us everything
          </h3>
          <p className="text-[#4a4f5c] mb-6">
            Nonetheless, we're keen to meet you. Would you like to continue with
            your submission?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={continueWithIncompleteSubmission}
              className="bg-[#0c0f14] text-white py-2 px-6 rounded hover:bg-[#3e4451] transition-colors"
            >
              Submit Anyway
            </button>
            <button
              onClick={() => setShowIncompleteModal(false)}
              className="bg-gray-200 text-[#0c0f14] py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="contact" className="py-16 bg-[#0c0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          Let's Work Together
        </h2>

        <div className="mt-12 md:flex overflow-hidden rounded-lg">
          {/* Form section with white background and left rounded corners */}
          <div
            className="md:w-1/2 p-8 bg-white rounded-l-lg"
            style={{ boxShadow: "inset 0px 0px 8px rgba(0, 0, 0, 0.05)" }}
          >
            <form onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="_subject"
                value="New portfolio contact!"
              />
              <input type="hidden" name="_captcha" value="false" />
              <input type="text" name="_honey" style={{ display: "none" }} />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="fullName"
                  ref={fullNameRef}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Affiliated Website{" "}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  name="website"
                  ref={websiteRef}
                  placeholder="Enter your website URL"
                  onChange={(e) => handleFieldChange("website", e.target.value)}
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <div
                  onClick={() => toggleExpand("ideas")}
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] cursor-pointer flex justify-between items-center"
                >
                  <span className="text-[#6a7085]">
                    Tell me about your ideas{" "}
                    <span className="text-xs text-gray-500">(optional)</span>
                  </span>
                  <span>{expandedFields.ideas ? "−" : "+"}</span>
                </div>
                {expandedFields.ideas && (
                  <textarea
                    name="ideas"
                    ref={ideasRef}
                    rows="4"
                    maxLength="1000"
                    onChange={(e) => handleFieldChange("ideas", e.target.value)}
                    placeholder="Share your project ideas or vision"
                    className="w-full mt-4 bg-[#e9eaed] border border-[#e9eaed] rounded p-3 text-[#282c34] focus:outline-none"
                  />
                )}
              </div>

              <div className="mb-6">
                <div
                  onClick={() => toggleExpand("heardFrom")}
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] cursor-pointer flex justify-between items-center"
                >
                  <span className="text-[#6a7085]">
                    How did you hear about me?{" "}
                    <span className="text-xs text-gray-500">(optional)</span>
                  </span>
                  <span>{expandedFields.heardFrom ? "−" : "+"}</span>
                </div>
                {expandedFields.heardFrom && (
                  <textarea
                    name="heardFrom"
                    ref={heardFromRef}
                    rows="4"
                    maxLength="1000"
                    onChange={(e) =>
                      handleFieldChange("heardFrom", e.target.value)
                    }
                    placeholder="Let me know how you discovered my services"
                    className="w-full mt-4 bg-[#e9eaed] border border-[#e9eaed] rounded p-3 text-[#282c34] focus:outline-none"
                  />
                )}
              </div>

              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Please note:</span> While only
                  name and email are required, we encourage you to complete all
                  fields for a more personalized response.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0c0f14] text-white py-3 px-8 rounded hover:bg-[#3e4451] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </form>
          </div>

          {/* Image section with dark background and right rounded corners */}
          <div
            className="md:w-1/2 rounded-r-lg overflow-hidden flex"
            style={{ backgroundColor: "#0c0f14" }}
          >
            <div className="relative h-full w-full">
              <img
                src="https://res.cloudinary.com/dbvdsg784/image/upload/v1743998747/Benjamin_Simon_-_290_1_iv1ffc.jpg"
                alt="Ben Simon"
                className="h-full w-full object-cover"
              />

              {/* Border overlay to cover any white edges */}
              <div
                className="absolute inset-0 pointer-events-none rounded-r-lg"
                style={{
                  boxShadow: "inset 0 0 0 5px #0c0f14",
                  zIndex: 5,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal />
      <IncompleteModal />
    </div>
  );
};

export default ContactForm;
