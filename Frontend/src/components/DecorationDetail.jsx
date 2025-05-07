import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DecorationDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  if (!post) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">Item not found.</div>;
  }

  const handleEdit = () => {
    navigate('/addtip', { state: { tip: post } }); // Navigate to Addtip with post data
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{post.title || "Untitled"}</h1>
      <p className="text-gray-600 mb-4">{post.description || "No description"}</p>
      <p className="text-gray-600 mb-4">Category: {post.category || "N/A"}</p>
      <p className="text-gray-600 mb-4">Difficulty: {post.difficulty || "N/A"}</p>
      <p className="text-gray-600 mb-4">Author: {post.author || "Unknown"}</p>
      <p className="text-gray-600 mb-4">Tip: {post.tip || "No tip provided"}</p>
      <p className="text-gray-600 mb-4">Created: {post.createdAt || "N/A"}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 ? (
          post.mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              className="w-full max-h-96 object-contain rounded-md"
              onError={(e) => (e.target.src = "/placeholder-image.jpg")}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No media available.</p>
        )}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default DecorationDetail;