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
    // No navigation needed, search will filter navbar items directly
  };

  // Navigation items for filtering
  const navItems = [
    { to: "/post-details", label: "Food Posts" },
    { to: "/recipes", label: "Food Recipes" },
    { to: "/decorations", label: "Food Decorations" },
  ];

  const authItems = isLoggedIn
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { label: "Logout", onClick: handleLogout },
      ]
    : [
        { to: "/login", label: "Login" },
        { to: "/register", label: "Sign Up" },
      ];

  // Highlight matching text
  const highlightText = (text) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  };

  // Filter navigation items based on search query
  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAuthItems = authItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  placeholder="Search navbar items..."
                  className="px-3 py-1.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-48 md:w-64"
                />
                <button
                  type="submit"
                  className="bg-primary-500 text-white px-3 py-1.5 rounded-r-md hover:bg-primary-600 transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
                    />
                  </svg>
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            {filteredNavItems.length > 0 && (
              <div className="hidden md:ml-4 md:flex md:space-x-8">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(item.label),
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Auth Links */}
          {filteredAuthItems.length > 0 && (
            <div className="hidden md:flex items-center space-x-4">
              {filteredAuthItems.map((item) =>
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(item.label),
                    }}
                  />
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={
                      item.label === "Sign Up"
                        ? "bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                        : "text-gray-500 hover:text-primary-500 px-3 py-2 text-sm font-medium"
                    }
                    dangerouslySetInnerHTML={{
                      __html: highlightText(item.label),
                    }}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
