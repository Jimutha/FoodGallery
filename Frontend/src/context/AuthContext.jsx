import React, { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for token on mount to determine if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function to set token and user
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout function to clear token and user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };


  // Update user profile (e.g., after editing profile details)
  const updateUserProfile = (updatedUserData) => {
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserProfile }}>

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>

      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);


export default AuthContext;
