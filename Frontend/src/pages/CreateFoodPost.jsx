import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateFoodPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [media, setMedia] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration <= 30);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const totalMedia = media.length + files.length;

    if (totalMedia > 3) {
      setError("You can upload a maximum of 3 media files.");
      return;
    }

    if (totalMedia < 1) {
      setError("Please upload at least 1 media file.");
      return;
    }

    const validMedia = [];
    for (const file of files) {
      if (file.type.startsWith("video/")) {
        const isValidDuration = await validateVideoDuration(file);
        if (!isValidDuration) {
          setError("Video clips must be 30 seconds or less.");
          return;
        }
      }
      validMedia.push({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    }

    setError("");
    setMedia((prev) => [...prev, ...validMedia]);
  };

  const removeMedia = (index) => {
    setMedia((prev) => {
      const newMedia = prev.filter((_, i) => i !== index);
      if (newMedia.length === 0) {
        setError("Please upload at least 1 media file.");
      }
      return newMedia;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (media.length < 1) {
      setError("Please upload at least 1 media file.");
      return;
    }
    if (media.length > 3) {
      setError("You can upload a maximum of 3 media files.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      media.forEach((item) => {
        submissionData.append("media", item.file); // Match backend's expected key
      });

      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        body: submissionData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setFormData({ title: "", description: "" });
      setMedia([]);
      setError("");
      alert("Post created successfully!");
      navigate("/post-details"); // Redirect to PostDetails page
    } catch (err) {
      setError("Error creating post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Create Food Post</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your food post"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Media (1-3, Images or Videos up to 30s)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Select Media
            </label>
            <p className="mt-2 text-sm text-gray-500">
              Upload 1 to 3 images or videos (max 30s)
            </p>
          </div>

          {media.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {media.map((item, index) => (
                <div key={index} className="relative">
                  {item.type === "image" ? (
                    <img
                      src={item.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={item.preview}
                      className="w-full h-32 object-cover rounded-md"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateFoodPost;
