import { useState, useRef } from "react";
import { createPost } from "../services/api";

const CreateRecipeForm = ({ onClose, onSubmitSuccess }) => {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([""]); // Start with one step
  const [images, setImages] = useState([]); // Array for image files
  const [video, setVideo] = useState(null); // Single video file
  const [videoDurationError, setVideoDurationError] = useState(null); // Video duration error
  const videoRef = useRef(null);

  // Handle adding a new step
  const addStep = () => {
    if (steps.length < 30) {
      setSteps([...steps, ""]);
    }
  };

  // Handle step input change
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;
    if (totalImages > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    setImages([...images, ...files]);
  };

  // Handle video upload and validate duration
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        if (duration > 30) {
          setVideoDurationError("Video must be 30 seconds or less.");
          setVideo(null);
        } else {
          setVideoDurationError(null);
          setVideo(file);
        }
      };
      videoElement.src = URL.createObjectURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || steps.some((step) => !step.trim())) {
      alert("Please fill in all fields (title and steps).");
      return;
    }
    if (images.length === 0 && !video) {
      alert("Please upload at least one image or video.");
      return;
    }
    if (videoDurationError) {
      alert("Please fix the video duration error.");
      return;
    }

    // Mock media URLs (since we can't upload files to a real server)
    const imageUrls = images.map(
      (_, index) => `https://example.com/image${index + 1}.jpg`
    );
    const videoUrl = video ? "https://example.com/video.mp4" : null;

    const newRecipe = {
      id: Date.now(), // Simple unique ID
      title,
      description: steps.join("; "), // Combine steps into description for display
      imageUrl:
        imageUrls[0] ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80", // Use first image or fallback
      category: "RECIPE",
      createdAt: new Date().toISOString(),
      additionalImages: imageUrls.slice(1), // Store additional images
      videoUrl, // Store video URL
      steps, // Store steps as an array
    };

    try {
      await createPost(newRecipe);
      onSubmitSuccess(newRecipe); // Notify parent to refresh recipes
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error creating recipe:", err);
      alert("Failed to create recipe. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter recipe title"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Steps to Follow */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Steps to Follow
        </label>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Enter step ${index + 1}`}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}
        {steps.length < 30 && (
          <button
            type="button"
            onClick={addStep}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            +
          </button>
        )}
      </div>

      {/* Upload Media */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Media (1-3 images, video max 30 seconds)
        </label>
        {/* Images */}
        <div className="mb-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-sm text-gray-600 mt-1">
            {images.length} image(s) selected (max 3)
          </p>
        </div>
        {/* Video */}
        <div>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            ref={videoRef}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {videoDurationError && (
            <p className="text-sm text-red-600 mt-1">{videoDurationError}</p>
          )}
          {video && !videoDurationError && (
            <p className="text-sm text-gray-600 mt-1">
              Video selected: {video.name}
            </p>
          )}
        </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Recipe
        </button>
      </div>
    </form>
  );
};

export default CreateRecipeForm;
