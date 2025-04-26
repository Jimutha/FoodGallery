import { useState, useRef, useEffect } from "react";
import { createPost, updatePost } from "../services/api";

const CreateRecipeForm = ({
  onClose,
  onSubmitSuccess,
  recipeToEdit,
  isEditing,
}) => {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([""]);
  const [previewImage, setPreviewImage] = useState(null);
  const [detailedImages, setDetailedImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoDurationError, setVideoDurationError] = useState(null);
  const videoRef = useRef(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (isEditing && recipeToEdit) {
      setTitle(recipeToEdit.title || "");
      setSteps(recipeToEdit.steps || [""]);
      // Since we can't pre-fill file inputs, we'll leave them as null
      // Optionally, you can display the current image URLs as placeholders or labels
      setPreviewImage(null); // Reset file input
      setDetailedImages([]); // Reset file input
      setVideo(null); // Reset file input
    }
  }, [isEditing, recipeToEdit]);

  const addStep = () => {
    if (steps.length < 30) {
      setSteps([...steps, ""]);
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handlePreviewImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(file);
    }
  };

  const handleDetailedImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = detailedImages.length + files.length;
    if (totalImages > 2) {
      alert("You can only upload up to 2 detailed images.");
      return;
    }
    setDetailedImages([...detailedImages, ...files]);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || steps.some((step) => !step.trim())) {
      alert("Please fill in all fields (title and steps).");
      return;
    }
    if (!isEditing && !previewImage) {
      alert("Please upload a preview image.");
      return;
    }
    if (videoDurationError) {
      alert("Please fix the video duration error.");
      return;
    }

    // Mock media URLs (since we can't upload files to a real server)
    const previewImageUrl = previewImage
      ? "https://example.com/preview-image.jpg"
      : isEditing
        ? recipeToEdit.imageUrl
        : null;
    const detailedImageUrls =
      detailedImages.length > 0
        ? detailedImages.map(
            (_, index) => `https://example.com/detailed-image${index + 1}.jpg`
          )
        : isEditing
          ? recipeToEdit.additionalImages
          : [];
    const videoUrl = video
      ? "https://example.com/video.mp4"
      : isEditing
        ? recipeToEdit.videoUrl
        : null;

    const recipeData = {
      title,
      description: steps.join("; "),
      imageUrl:
        previewImageUrl ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
      category: "RECIPE",
      createdAt: isEditing ? recipeToEdit.createdAt : new Date().toISOString(),
      additionalImages: detailedImageUrls,
      videoUrl,
      steps,
    };

    try {
      if (isEditing) {
        // Update existing recipe
        const updatedRecipe = { ...recipeData, id: recipeToEdit.id };
        await updatePost(recipeToEdit.id, updatedRecipe);
        onSubmitSuccess(updatedRecipe, true); // Pass isEditing flag
      } else {
        // Create new recipe
        const newRecipe = { ...recipeData, id: Date.now() };
        await createPost(newRecipe);
        onSubmitSuccess(newRecipe, false);
      }
      onClose();
    } catch (err) {
      console.error("Error saving recipe:", err);
      alert(
        `Failed to ${isEditing ? "update" : "create"} recipe. Please try again.`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Media
        </label>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Preview Image{" "}
            {isEditing
              ? "(Optional - Leave blank to keep current)"
              : "(Required)"}
          </label>
          {isEditing && recipeToEdit.imageUrl && (
            <p className="text-sm text-gray-600 mb-1">
              Current Preview Image:{" "}
              <a
                href={recipeToEdit.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View
              </a>
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePreviewImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewImage && (
            <p className="text-sm text-gray-600 mt-1">
              New preview image selected: {previewImage.name}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Detailed Pictures (Optional, up to 2)
          </label>
          {isEditing &&
            recipeToEdit.additionalImages &&
            recipeToEdit.additionalImages.length > 0 && (
              <div className="text-sm text-gray-600 mb-1">
                Current Detailed Images:
                {recipeToEdit.additionalImages.map((url, index) => (
                  <span key={index}>
                    {" "}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Image {index + 1}
                    </a>
                  </span>
                ))}
              </div>
            )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleDetailedImagesUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-sm text-gray-600 mt-1">
            {detailedImages.length} detailed image(s) selected (max 2)
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Video (Optional, max 30 seconds)
          </label>
          {isEditing && recipeToEdit.videoUrl && (
            <p className="text-sm text-gray-600 mb-1">
              Current Video:{" "}
              <a
                href={recipeToEdit.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View
              </a>
            </p>
          )}
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
              New video selected: {video.name}
            </p>
          )}
        </div>
      </div>

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
          {isEditing ? "Update Recipe" : "Create Recipe"}
        </button>
      </div>
    </form>
  );
};

export default CreateRecipeForm;
