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
      // Firebase Authentication with email/password
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Log in to Food Gallery
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your culinary creations
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-500 hover:text-primary-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : "Log in"}
            </button>
          </div>
        </form>

        {/* Google Sign-In Button */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.55-.19-2.28h-11.3v4.31h6.47c-.28 1.48-1.12 2.73-2.38 3.57v2.96h3.85c2.25-2.07 3.55-5.12 3.55-8.56z"/>
                <path fill="#34A853" d="M12.255 24c3.24 0 5.96-1.07 7.95-2.89l-3.85-2.96c-1.07.72-2.44 1.14-4.1 1.14-3.15 0-5.82-2.13-6.77-4.99H1.535v3.13c1.98 3.86 6.03 6.57 10.72 6.57z"/>
                <path fill="#FBBC05" d="M5.485 14.36c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.56H1.535c-.72 1.55-1.12 3.27-1.12 5.13s.4 3.58 1.12 5.13l3.95-3.46z"/>
                <path fill="#EA4335" d="M12.255 4.73c1.77 0 3.35.61 4.59 1.81l3.44-3.44C18.215 1.07 15.495 0 12.255 0 7.575 0 3.525 2.31 1.535 6.56l3.95 3.46c.95-2.86 3.62-4.99 6.77-4.99z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="text-center text-sm mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;