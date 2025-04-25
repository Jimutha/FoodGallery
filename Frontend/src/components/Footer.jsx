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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10 0 1.305-.264 2.546-.736 3.704H14v-2h-4v-2h4v-1.5c0-1.657 1.343-3 3-3h1v2h-1c-.552 0-1 .448-1 1V12h2l-.5 2h-1.5v7.296C16.546 22.454 14.273 24 12 24c-5.514 0-10-4.486-10-10S6.486 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072c-4.95.089-6.5 2.209-6.589 6.589C.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.089 4.95 2.209 6.5 6.589 6.589C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.95-.089 6.5-2.209 6.589-6.589C23.986 15.668 24 15.259 24 12c0-3.259-.014-3.668-.072-4.948-.089-4.95-2.209-6.5-6.589-6.589C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.56 4.24 1.62 6.06L0 24l6.03-1.58A11.92 11.92 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.863 0-3.59-.602-5-1.62l-.43-.27-3.58.94.95-3.53-.27-.44c-1.02-1.62-1.62-3.48-1.62-5.48 0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.56-6.73l-.93-.5c-.31-.17-.65-.25-.99-.25-.34 0-.67.1-.96.29-.29.19-.54.46-.76.81-.22.35-.38.73-.47 1.12-.09.39-.13.79-.13 1.19 0 .29.02.58.06.86l-.13.02c-.63-.1-1.25-.27-1.84-.5-.59-.23-1.15-.51-1.67-.83-.52-.32-1-.69-1.44-1.09-.44-.4-.83-.83-1.17-1.28-.34-.45-.63-.92-.87-1.41-.24-.49-.42-.99-.54-1.5-.12-.51-.18-1.03-.18-1.55 0-.34.04-.68.12-1.01.08-.33.21-.65.38-.94.17-.29.38-.55.62-.77.24-.22.51-.4.81-.53.3-.13.62-.2 1.02-.2.33 0 .66.07.97.2.31.13.59.32.83.56.24.24.44.52.6.83.16.31.28.64.36.98.08.34.12.69.12 1.04 0 .37-.05.73-.14 1.07-.09.34-.22.67-.39.98-.17.31-.37.6-.6.86-.23.26-.48.5-.74.71-.26.21-.53.4-.81.56-.28.16-.57.29-.87.39-.3.1-.61.17-.92.21-.31.04-.62.06-.93.06-.37 0-.73-.04-1.07-.12-.34-.08-.67-.21-.98-.38-.31-.17-.59-.38-.83-.62-.24-.24-.45-.52-.62-.83-.17-.31-.3-.64-.39-.98-.09-.34-.14-.69-.14-1.04 0-.35.04-.7.12-1.04.08-.34.2-.67.36-.98.16-.31.36-.59.6-.83.24-.24.52-.43.83-.56.31-.13.64-.2.97-.2.4 0 .72.07 1.02.2.3.13.57.31.81.53.24.22.45.48.62.77.17.29.3.61.38.94.08.33.12.67.12 1.01 0 .52-.06 1.04-.18 1.55-.12.51-.3 1.01-.54 1.5-.24.49-.53.96-.87 1.41-.34.45-.73.88-1.17 1.28-.44.4-.92.77-1.44 1.09-.52.32-1.08.6-1.67.83-.59.23-1.21.4-1.84.5l-.13-.02c.04-.28.06-.57.06-.86 0-.4-.04-.8-.13-1.19-.09-.39-.25-.77-.47-1.12-.22-.35-.47-.62-.76-.81-.29-.19-.62-.29-.96-.29-.34 0-.68.08-.99.25l-.93.5c-.55.3-1.1.52-1.66.67-.56.15-1.13.22-1.7.22-.58 0-1.15-.07-1.7-.22-.55-.15-1.1-.37-1.66-.67-.55-.3-1.09-.67-1.61-1.09-.52-.42-1.01-.9-1.45-1.43-.44-.53-.83-1.1-1.16-1.71-.33-.61-.61-1.25-.83-1.91-.22-.66-.39-1.34-.5-2.02-.11-.68-.17-1.37-.17-2.07 0-.7.06-1.39.17-2.07.11-.68.28-1.36.5-2.02.22-.66.5-1.3.83-1.91.33-.61.72-1.18 1.16-1.71.44-.53.93-1.01 1.45-1.43.52-.42 1.06-.79 1.61-1.09.55-.3 1.1-.52 1.66-.67.56-.15 1.13-.22 1.7-.22.57 0 1.14.07 1.7.22.56.15 1.11.37 1.66.67.55.3 1.09.67 1.61 1.09.52.42 1.01.9 1.45 1.43.44.53.83 1.1 1.16 1.71.33.61.61 1.25.83 1.91.22.66.39 1.34.5 2.02.11.68.17 1.37.17 2.07 0 .7-.06 1.39-.17 2.07-.11.68-.28 1.36-.5 2.02-.22.66-.5 1.3-.83 1.91-.33.61-.72 1.18-1.16 1.71-.44.53-.93 1.01-1.45 1.43-.52.42-1.06.79-1.61 1.09z" />
                </svg>
              </a>
            </div>
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
