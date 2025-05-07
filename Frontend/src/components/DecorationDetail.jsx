import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DecorationDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  console.log("Received post in DecorationDetail:", post);

  if (!post) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">Item not found.</div>;
  }

  const handleEdit = () => {
    navigate('/addtip', { state: { tip: post } });
  };

  const handleDelete = () => {
    const tips = JSON.parse(localStorage.getItem('decorationTips') || '[]');
    const updatedTips = tips.filter((tip) => tip.id !== post.id);
    localStorage.setItem('decorationTips', JSON.stringify(updatedTips));
    navigate('/decorations');
  };

  const mediaUrls = Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0
    ? post.mediaUrls
    : Array.isArray(post.media)
    ? post.media.filter(url => typeof url === 'string' && url.startsWith('data:image/'))
    : [];

  console.log("Media URLs to display:", mediaUrls);

  return (
    <div className="container mx-auto px-4 py-12 bg-white rounded-lg shadow-md">
      <div className="w-full">
        {mediaUrls.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto">
            {mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${post.title || "Decoration"} Image ${index + 1}`}
                className="h-[600px] w-1/3 object-cover rounded-lg flex-shrink-0"
                onError={(e) => {
                  console.error(`Image load failed for URL: ${url.slice(0, 50)}...`, e);
                  e.target.src = "https://via.placeholder.com/300?text=Image+Failed+to+Load";
                }}
                onLoad={() => console.log(`Image loaded successfully: ${url.slice(0, 50)}...`)}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center rounded-t-lg">
            <p className="text-gray-500">No media available.</p>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <span className="flex items-center">
            <i className="bi bi-person mr-1 text-indigo-500"></i>
            Author: {post.author || "Unknown"}
          </span>
          <span className="flex items-center">
            <i className="bi bi-tag mr-1 text-indigo-500"></i>
            Category: {post.category || "N/A"}
          </span>
          <span className="flex items-center">
            <i className="bi bi-bar-chart mr-1 text-indigo-500"></i>
            Difficulty: {post.difficulty || "N/A"}
          </span>
          <span className="flex items-center">
            <i className="bi bi-calendar mr-1 text-indigo-500"></i>
            Created: {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{post.title || "Untitled"}</h1>
        <p className="text-gray-600 mb-4">{post.description || "No description"}</p>
        <p className="text-gray-600 mb-4">Tip: {post.tip || "No tip provided"}</p>
        <div className="comment-section mb-6">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <p key={index} className="text-gray-600 text-sm mb-1">{comment}</p>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}
        </div>
      </div>
      <div className="p-6 flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecorationDetail;