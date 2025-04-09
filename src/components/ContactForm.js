import React, { useRef, useState } from "react";

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

  const toggleExpand = (field) => {
    setExpandedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formSubmitData = new FormData();
    formSubmitData.append("fullName", fullNameRef.current.value);
    formSubmitData.append("email", emailRef.current.value);
    formSubmitData.append("website", websiteRef.current.value);
    formSubmitData.append("ideas", ideasRef.current.value);
    formSubmitData.append("heardFrom", heardFromRef.current.value);
    formSubmitData.append("_subject", "New portfolio contact!");
    formSubmitData.append("_captcha", "false");

    try {
      const response = await fetch(
        "https://formsubmit.co/Ben@bensimonactor.com",
        {
          method: "POST",
          body: formSubmitData,
        }
      );

      if (response.ok) {
        setSubmitStatus("success");
        setShowModal(true);
        e.target.reset();
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
                <input
                  type="text"
                  name="fullName"
                  ref={fullNameRef}
                  placeholder="Full Name*"
                  required
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  placeholder="Email*"
                  required
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  name="website"
                  ref={websiteRef}
                  placeholder="Affiliated Website"
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <div
                  onClick={() => toggleExpand("ideas")}
                  className="w-full bg-[#f9f9f9] border-b-2 border-[#0c0f14] px-3 py-2 text-[#282c34] cursor-pointer flex justify-between items-center"
                >
                  <span className="text-[#6a7085]">
                    Tell me about your ideas
                  </span>
                  <span>{expandedFields.ideas ? "−" : "+"}</span>
                </div>
                {expandedFields.ideas && (
                  <textarea
                    name="ideas"
                    ref={ideasRef}
                    rows="4"
                    maxLength="1000"
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
                    How did you hear about me?
                  </span>
                  <span>{expandedFields.heardFrom ? "−" : "+"}</span>
                </div>
                {expandedFields.heardFrom && (
                  <textarea
                    name="heardFrom"
                    ref={heardFromRef}
                    rows="4"
                    maxLength="1000"
                    className="w-full mt-4 bg-[#e9eaed] border border-[#e9eaed] rounded p-3 text-[#282c34] focus:outline-none"
                  />
                )}
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
    </div>
  );
};

export default ContactForm;
