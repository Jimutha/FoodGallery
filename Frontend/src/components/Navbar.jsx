import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              FOOD GALLERY
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/posts"
                className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
              >
                Food Posts
              </Link>
              <Link
                to="/recipes"
                className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
              >
                Recipes
              </Link>
              <Link
                to="/decorations"
                className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
              >
                Decorations
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
