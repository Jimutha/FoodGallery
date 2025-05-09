import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed with email:", email);
      setEmail("");
      alert("Thank you for subscribing to Food Gallery!");
    }
  };

  return (
    <footer className="border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          {/* Centered Brand and Subscription Section */}
          <div className="max-w-2xl text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.761 0-5 2.239-5 5v1h10v-1c0-2.761-2.239-5-5-5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Food Gallery
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Dive into a world of delicious recipes and stunning food
              presentations. Join our community to share your culinary
              masterpieces and find endless inspiration.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-80"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm font-medium shadow-md hover:shadow-lg"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Notice - Centered */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Food Gallery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
