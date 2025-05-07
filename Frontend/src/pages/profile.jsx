
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [errors, setErrors] = useState({ username: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user details from localStorage
    const user = localStorage.getItem("user");
    let details;
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        details = {
          username: parsedUser.username || "N/A",
          email: parsedUser.email || "N/A",
        };
      } catch (error) {
        console.error("Error parsing user details:", error);
        details = { username: "N/A", email: "N/A" };
      }
    } else {
      // If no user details, set example details and redirect to login if not logged in
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      // Set example details if no user data exists
      details = {
        username: "john_doe",
        email: "john@example.com",
      };
      localStorage.setItem("user", JSON.stringify(details));
    }
    setUserDetails(details);
    setFormData(details);
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", email: "" };

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Save updated details to localStorage
    const updatedUser = {
      username: formData.username,
      email: formData.email,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserDetails(updatedUser);
    setIsEditing(false);
    toast.success("Profile updated successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleCancel = () => {
    setFormData(userDetails);
    setErrors({ username: "", email: "" });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            View and edit your account details
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`mt-1 appearance-none rounded-md w-full px-3 py-2 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm transition-all duration-300 hover:border-pink-300`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500 animate-slide-in">
                    {errors.username}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 appearance-none rounded-md w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm transition-all duration-300 hover:border-pink-300`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 animate-slide-in">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <p className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 sm:text-sm">
                  {userDetails.username}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 sm:text-sm">
                  {userDetails.email}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleEdit}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                >
                  Edit Profile
                </button>
                <Link
                  to="/"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-in {
            animation: slideIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Profile;