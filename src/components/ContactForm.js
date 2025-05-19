import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    ideas: "",
    howDidYouHear: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // You can use a service like Formspree or create your own server endpoint
      // This is a placeholder for actual form submission logic
      // Replace with your actual form submission code

      // For demonstration purposes - simulating submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitMessage("Thank you for your message! We'll be in touch soon.");
      setFormData({
        name: "",
        email: "",
        website: "",
        ideas: "",
        howDidYouHear: "",
      });
    } catch (error) {
      setSubmitMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="py-16 bg-[#0c0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          Let's Work Together
        </h2>

        <div className="mt-12 md:flex overflow-hidden rounded-lg">
          {/* Form section */}
          <div
            className="md:w-1/2 p-8 bg-white rounded-l-lg"
            style={{ boxShadow: "inset 0px 0px 8px rgba(0, 0, 0, 0.05)" }}
          >
            {submitMessage ? (
              <div className="h-full flex flex-col items-center justify-center">
                <p className="text-xl text-center text-green-600 font-medium">
                  {submitMessage}
                </p>
                <button
                  onClick={() => setSubmitMessage("")}
                  className="mt-6 bg-[#0c0f14] text-white py-2 px-6 rounded hover:bg-[#3e4451] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0c0f14] focus:ring-[#0c0f14] sm:text-sm"
                    style={{ borderWidth: "1px", padding: "0.5rem" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0c0f14] focus:ring-[#0c0f14] sm:text-sm"
                    style={{ borderWidth: "1px", padding: "0.5rem" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website (optional)
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0c0f14] focus:ring-[#0c0f14] sm:text-sm"
                    style={{ borderWidth: "1px", padding: "0.5rem" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="ideas"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tell me about your ideas
                  </label>
                  <textarea
                    id="ideas"
                    name="ideas"
                    value={formData.ideas}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0c0f14] focus:ring-[#0c0f14] sm:text-sm"
                    style={{ borderWidth: "1px", padding: "0.5rem" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="howDidYouHear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    How did you hear about me?
                  </label>
                  <textarea
                    id="howDidYouHear"
                    name="howDidYouHear"
                    value={formData.howDidYouHear}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0c0f14] focus:ring-[#0c0f14] sm:text-sm"
                    style={{ borderWidth: "1px", padding: "0.5rem" }}
                  />
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0c0f14] text-white py-2 px-8 rounded hover:bg-[#3e4451] transition-colors"
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Your information is secure and will never be shared with third
                  parties.
                </div>
              </form>
            )}
          </div>

          {/* Image section */}
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
    </div>
  );
};

export default ContactForm;
