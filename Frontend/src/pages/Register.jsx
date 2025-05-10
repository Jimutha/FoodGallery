
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
import React from "react";

const Register = () => {

  return <div></div>;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (!userCredential.user) {
        throw new Error("Failed to create user.");
      }
      const user = userCredential.user;

      // Update user profile in Firebase with username
      await updateProfile(user, {
        displayName: username,
      });

      // Sync with backend (no profile image)
      const firebaseToken = await user.getIdToken();
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: firebaseToken,
          displayName: username,
          profileImage: "" // No image, send empty string
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sync with backend. Check backend logs for details.");
      }

      navigate("/login");
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Image and Text */}
      <div className="lg:w-1/2 bg-gradient-to-br from-red-300 to-rose-200 flex flex-col justify-center p-8 lg:p-16 text-white">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white opacity-100 drop-shadow-md">Join Food Gallery!</h1>
        <p className="text-lg lg:text-xl mb-8 text-white opacity-100 drop-shadow-md">
          Share your culinary creations with the world.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </div>
            <p className="text-lg text-white opacity-100 drop-shadow-md">Access thousands of recipes</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-lg text-white opacity-100 drop-shadow-md">Save your favorite dishes</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-lg text-white opacity-100 drop-shadow-md">Share your culinary creations</p>
          </div>
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Join Food Gallery</h2>
            <Link to="/login" className="text-red-500 font-medium flex items-center hover:text-red-600">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </Link>
          </div>
          <p className="text-gray-600">Create an account to get started!</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="flex items-center text-red-500 font-medium mb-1">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h2a4 4 0 004-4V4a4 4 0 00-4-4H6a4 4 0 00-4 4v4a4 4 0 004 4h2m-2 4h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                </svg>
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-red-500 font-medium mb-1">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h2a4 4 0 004-4V4a4 4 0 00-4-4H6a4 4 0 00-4 4v4a4 4 0 004 4h2m-2 4h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                </svg>
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-red-500 font-medium mb-1">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2z"></path>
                </svg>
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-red-500 font-medium mb-1">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2z"></path>
                </svg>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </>
              ) : (
                <>
                  Sign Up
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </>
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 font-medium flex items-center justify-center hover:text-red-600">
              Log in
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </p>
        </div>
      </div>

      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 lg:w-1/2 bg-cover bg-center bg-blur"
        style={{
          backgroundImage:
            "url('')",
          filter: "blur(5px)", // Apply blur to the background image
        }}
      ></div>
    </div>
  );

};

export default Register;
