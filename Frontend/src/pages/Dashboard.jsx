import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.displayName || "");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfileImage(reader.result); // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Update Firebase profile
      await updateProfile(auth.currentUser, {
        displayName: newUsername,
      });

      // Update backend with new image
      const firebaseToken = await auth.currentUser.getIdToken();
      const response = await fetch("http://localhost:8080/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: firebaseToken,
          displayName: newUsername,
          profileImage: newProfileImage || user.photoURL // Use existing image if no new one
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update profile in backend");
      }

      // Update local context
      const updatedUser = {
        ...user,
        displayName: newUsername,
        photoURL: newProfileImage || user.photoURL
      };
      updateUserProfile(updatedUser);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to homepage
    } catch (err) {
      setError(err.message || "Logout failed");
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        await auth.currentUser.delete();
        await logout();
        navigate("/login");
      } catch (err) {
        setError(err.message || "Delete profile failed");
      }
    }
  };

  if (!user) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome, {user.displayName || user.email || "User"}!
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Your Profile</h3>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 border border-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 border border-green-300">
              {success}
            </div>
          )}
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition duration-300 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-gray-700 text-lg">
                    <strong>Username:</strong> {user.displayName || "Not set"}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>Email:</strong> {user.email || "Not set"}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;