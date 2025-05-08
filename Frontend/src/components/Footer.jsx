import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Placeholder for subscription logic
      console.log("Subscribed with email:", email);
      setEmail("");
      alert("Thank you for subscribing!");
    }
  };

  return (
    <footer className="bg-white text-gray-700 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Section: Brand and Subscription */}
          <div className="col-span-1">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Food Gallery
            </h2>
            <p className="text-sm mb-6">
              Discover delicious recipes and stunning food presentations. Join
              our community to share your culinary creations and get inspired.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your e-mail"
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full max-w-xs"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
              >
                Join our community
              </button>
            </form>
          </div>

          {/* Middle Section: Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  className="hover:text-primary-500 transition-colors"
                >
                  Food Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes"
                  className="hover:text-primary-500 transition-colors"
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/decorations"
                  className="hover:text-primary-500 transition-colors"
                >
                  Decorations
                </Link>
              </li>
            </ul>
          </div>

          {/* Middle Section: Policies */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Policies
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/terms"
                  className="hover:text-primary-500 transition-colors"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-primary-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/feedback"
                  className="hover:text-primary-500 transition-colors"
                >
                  Customer Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section: Help & Support and Follow Us */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Help & Support
            </h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <a
                  href="/help"
                  className="hover:text-primary-500 transition-colors"
                >
                  Help
                </a>
              </li>
              <li>
                <a
                  href="/tips"
                  className="hover:text-primary-500 transition-colors"
                >
                  Tips
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="hover:text-primary-500 transition-colors"
                >
                  Customer Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Food Gallery.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
