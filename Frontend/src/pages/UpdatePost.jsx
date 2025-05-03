import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostById, updatePost } from "../services/api";

const UpdatePost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [existingMediaUrls, setExistingMediaUrls] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(id);
        setTitle(post.title || "");
        setDescription(post.description || "");
        setExistingMediaUrls(post.mediaUrls || []);
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to load post details: ${err.message}`);
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingMediaUrls.length > 3) {
      setError("You can upload a maximum of 3 media files.");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.type.startsWith("video/")) {
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(file);
        return new Promise((resolve) => {
          videoElement.onloadedmetadata = () => {
            resolve(videoElement.duration <= 30);
          };
          videoElement.onerror = () => resolve(false);
        }).then((isValid) => {
          if (!isValid) {
            setError("Videos must be 30 seconds or less.");
          }
          return isValid;
        });
      }
      return true;
    });

    Promise.all(validFiles).then((filteredFiles) => {
      setMedia((prevMedia) => [...prevMedia, ...filteredFiles]);
      setError(null);
    });
  };

  const removeExistingMedia = (index) => {
    setExistingMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      const postData = {
        title,
        description,
        media: media.length > 0 ? media : undefined,
      };

      await updatePost(id, postData);
      alert("Post updated successfully!");
      window.location.href = `/post/${id}`;
    } catch (err) {
      setError(`Failed to update post: ${err.message}`);
      console.error("Update error:", err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Update Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-2 bg-red-100 text-red-700 border border-red-300 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="Describe your food post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Media (1–3, Images or Videos up to 30s)
            </label>
            <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                Select Media
              </label>
              <p className="text-gray-500 mt-2">
                Upload 1 to 3 images or videos (max 30s)
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {existingMediaUrls.map((url, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img
                    src={url}
                    alt={`Existing Media ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingMedia(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {media.map((file, index) => (
                <div key={`new-${index}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New Media ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewMedia(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
