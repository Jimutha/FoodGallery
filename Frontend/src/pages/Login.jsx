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
            "url('data:image/jpeg;base64,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')",
        }}
      ></div>
    </div>
  );
};

export default Login;