import React, { useState } from 'react';

const FoodPostCard = ({ post, onClick, onLike, onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText(''); // Clear input after submitting
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {post.mediaUrls && post.mediaUrls.length > 0 ? (
        <img
          src={post.mediaUrls[0]}
          alt={post.title || "Decoration Image"}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.error(`Image load failed for URL: ${post.mediaUrls[0].slice(0, 50)}...`, e);
            e.target.src = "https://via.placeholder.com/300?text=Image+Failed+to+Load";
          }}
          onLoad={() => console.log(`Image loaded successfully: ${post.mediaUrls[0].slice(0, 50)}...`)}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
      <div className="p-4 bg-gray-100">
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="#" className="flex items-center text-indigo-500 hover:underline">
            <i className="bi bi-person mr-1"></i>
            Author: {post.author || "Unknown"}
          </a>
          <a href="#" className="flex items-center text-indigo-500 hover:underline">
            <i className="bi bi-tag mr-1"></i>
            Category: {post.category || "N/A"}
          </a>
          <a href="#" className="flex items-center text-indigo-500 hover:underline">
            <i className="bi bi-bar-chart mr-1"></i>
            Difficulty: {post.difficulty || "N/A"}
          </a>
          <a href="#" className="flex items-center text-indigo-500 hover:underline">
            <i className="bi bi-calendar mr-1"></i>
            Created: {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
          </a>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
        <p className="text-gray-600 line-clamp-2 mb-4">{post.description || "No description"}</p>
        <div className="flex items-center mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click from navigating
              onLike();
            }}
            className="flex items-center text-red-500 hover:text-red-700"
          >
            <i className="bi bi-heart-fill mr-1"></i>
            <span>{post.likes} Likes</span>
          </button>
        </div>
        <div className="comment-section">
          <div className="mb-2">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <p key={index} className="text-gray-600 text-sm">{comment}</p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}
          </div>
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent card click from navigating
              placeholder="Add a comment..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()} // Prevent card click from navigating
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodPostCard;