import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Placeholder for search functionality
      console.log("Searching for:", searchQuery);
      // You can implement your search logic here, e.g., redirect to a search results page
      // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              FOOD GALLERY
            </Link>

            {/* Search Bar */}
            <div className="md:ml-10 flex items-center">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, recipes..."
                  className="px-3 py-1.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-48 md:w-64"
                />
                <button
                  type="submit"
                  className="bg-primary-500 text-white px-3 py-1.5 rounded-r-md hover:bg-primary-600 transition-colors duration-300 text-sm font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:ml-4 md:flex md:space-x-8">
              <Link
                to="/post-details"
                className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
              >
                Food Posts
              </Link>
              <Link
                to="/recipes"
                className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
              >
                Food Recipies
              </Link>
              <Link
                to="/decorations"
                className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
              >
                Food Decorations
              </Link>
            </div>
          </div>

          {/* Auth Links */}
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
                  Login
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
