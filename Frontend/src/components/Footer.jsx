import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand/Logo Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Food Gallery
            </h2>
            <p className="text-sm mb-4">
              Discover delicious recipes and beautiful food presentations. Join
              our community to share your culinary creations and get inspired by
              others.
            </p>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-pink-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  className="hover:text-pink-500 flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Food Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes"
                  className="hover:text-pink-500 flex items-center"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/decorations"
                  className="hover:text-pink-500 flex items-center"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Decorations
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <a href="tel:+1234567890" className="hover:text-pink-500">
                  +1 234 567 890
                </a>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <a
                  href="mailto:support@foodgallery.com"
                  className="hover:text-pink-500"
                >
                  support@foodgallery.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Food Gallery. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
