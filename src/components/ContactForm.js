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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    try {
      // Create form data for submission
      const formSubmitData = new FormData();
      for (const key in formData) {
        formSubmitData.append(key, formData[key]);
      }
      // Add the hidden fields
      formSubmitData.append("_subject", "New portfolio contact!");
      formSubmitData.append("_captcha", "false");

      // Send the data to FormSubmit.io with the new email address
      const response = await fetch("https://formsubmit.co/Ben@BenSimon.com", {
        method: "POST",
        body: formSubmitData,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setShowModal(true);
        resetForm();
      } else {
        setSubmitStatus("error");
        setShowModal(true);
      }
    } catch (error) {
      setSubmitStatus("error");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Modal component
  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 md:mx-0">
          <div className="text-center">
            {submitStatus === "success" ? (
              <>
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
                <h3 className="text-xl font-bold mb-2 text-[#282c34]">
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
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                <h3 className="text-xl font-bold mb-2 text-[#282c34]">
                  Something Went Wrong
                </h3>
                <p className="text-[#4a4f5c] mb-6">
                  We couldn't send your message. Please try again later.
                </p>
              </>
            )}
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
    <div id="contact" className="py-16 bg-[#282c34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          Let's Work Together
        </h2>

        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <form onSubmit={handleSubmit}>
                {/* FormSubmit.io additional features */}
                <input
                  type="hidden"
                  name="_subject"
                  value="New portfolio contact!"
                />
                <input type="hidden" name="_captcha" value="false" />
                {/* Add honeypot field to prevent spam */}
                <input type="text" name="_honey" style={{ display: "none" }} />

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
                      className="w-full mt-4 bg-[#e9eaed] border border-[#282c34] rounded p-3 text-[#282c34] focus:outline-none transition-all duration-300 ease-in-out"
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
                      className="w-full mt-4 bg-[#e9eaed] border border-[#282c34] rounded p-3 text-[#282c34] focus:outline-none transition-all duration-300 ease-in-out"
                      rows="4"
                      maxLength="1000"
                    ></textarea>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#282c34] text-white py-3 px-8 rounded hover:bg-[#3e4451] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </form>
            </div>

            <div className="hidden md:block md:w-1/2">
              <img
                src="https://res.cloudinary.com/dbvdsg784/image/upload/v1743912092/Benjamin_Simon_-_290_-_Contact_lcpdr2.jpg"
                alt="Ben Simon"
                className="w-full h-full object-cover"
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
