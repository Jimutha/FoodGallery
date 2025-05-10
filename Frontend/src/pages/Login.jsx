
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  // Existing email/password login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user) {
        throw new Error("User not found after login");
      }

      const firebaseToken = await userCredential.user.getIdToken();
      await authenticateWithBackend(firebaseToken, userCredential.user);
    } catch (err) {
      handleAuthError(err);
    }
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user) {
        throw new Error("Google Sign-In failed");
      }

      const firebaseToken = await result.user.getIdToken();
      await authenticateWithBackend(firebaseToken, result.user);
    } catch (err) {
      handleAuthError(err);
    }
  };

  // Common function to authenticate with backend
  const authenticateWithBackend = async (firebaseToken, user) => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: firebaseToken })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to verify with backend");
    }

    const data = await response.json();
    const userData = {
      email: data.user.email,
      displayName: data.user.displayName,
      photoURL: data.user.photoURL,
      uid: data.user.uid,
      createdAt: data.user.createdAt
    };
    login(data.token, userData);

    setSuccess("Login Successful!");
    setTimeout(() => {
      navigate("/dashboard");
      setLoading(false);
    }, 2000);
  };

  // Common error handler for both login methods
  const handleAuthError = (err) => {
    let errorMessage = "Failed to fetch. Please try again.";
    if (err.code === "auth/invalid-credential") {
      errorMessage = "Invalid email or password";
    } else if (err.code === "auth/too-many-requests") {
      errorMessage = "Account temporarily locked due to many failed attempts";
    } else if (err.message) {
      errorMessage = err.message;
    }
    setError(errorMessage);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Image and Text */}
      <div className="lg:w-1/2 bg-gradient-to-br from-red-300 to-rose-200 flex flex-col justify-center p-8 lg:p-16 text-white">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome Back to Food Gallery!</h1>
        <p className="text-lg lg:text-xl mb-8">
          Your favorite recipes are waiting. Sign in to continue your culinary journey.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </div>
            <p className="text-lg">Access thousands of recipes</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-lg">Save your favorite dishes</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-lg">Share your culinary creations</p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <Link to="/register" className="text-red-500 font-medium flex items-center hover:text-red-600">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </Link>
          </div>
          <p className="text-gray-600">Welcome back! Please enter your details.</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="flex items-center text-red-500 font-medium mb-1">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h2a4 4 0 004-4V4a4 4 0 00-4-4H6a4 4 0 00-4 4v4a4 4 0 004 4h2m-2 4h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                </svg>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                Sign In
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 border border-gray-300 rounded-md flex items-center justify-center text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.55-.19-2.28h-11.3v4.31h6.47c-.28 1.48-1.12 2.73-2.38 3.57v2.96h3.85c2.25-2.07 3.55-5.12 3.55-8.56z"/>
              <path fill="#34A853" d="M12.255 24c3.24 0 5.96-1.07 7.95-2.89l-3.85-2.96c-1.07.72-2.44 1.14-4.1 1.14-3.15 0-5.82-2.13-6.77-4.99H1.535v3.13c1.98 3.86 6.03 6.57 10.72 6.57z"/>
              <path fill="#FBBC05" d="M5.485 14.36c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.56H1.535c-.72 1.55-1.12 3.27-1.12 5.13s.4 3.58 1.12 5.13l3.95-3.46z"/>
              <path fill="#EA4335" d="M12.255 4.73c1.77 0 3.35.61 4.59 1.81l3.44-3.44C18.215 1.07 15.495 0 12.255 0 7.575 0 3.525 2.31 1.535 6.56l3.95 3.46c.95-2.86 3.62-4.99 6.77-4.99z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-red-500 font-medium flex items-center justify-center hover:text-red-600">
              Sign Up
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </p>
        </div>
      </div>

      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 lg:w-1/2 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('')",
        }}
      ></div>
    </div>
  );
import React from "react";

const Login = () => {
  return <div></div>;
};

export default Login;
