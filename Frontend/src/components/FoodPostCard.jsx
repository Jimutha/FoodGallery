import React, { useState, useEffect } from 'react';

const FoodPostCard = ({ post, onClick, onLike, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === (post.mediaUrls?.length - 1 || 0) ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [post.mediaUrls]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {post.mediaUrls && post.mediaUrls.length > 0 ? (
        <div className="w-full h-80 flex overflow-hidden relative">
          {post.mediaUrls.map((url, index) => (
            <div
              key={index}
              className={`w-full h-80 flex-shrink-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <img
                src={url}
                alt={`${post.title || "Decoration"} Image ${index + 1}`}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  console.error(`Image load failed for URL: ${url.slice(0, 50)}...`, e);
                  e.target.src = "https://via.placeholder.com/300?text=Image+Failed+to+Load";
                }}
                onLoad={() => console.log(`Image loaded successfully: ${url.slice(0, 50)}...`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
      <div className="p-8 bg-gray-200">
        <div className="flex flex-col gap-2 text-sm">
          <span className="flex items-center text-base text-black font-bold">
            <i className="bi bi-person mr-1"></i>
            Author: {post.author || "Unknown"}
          </span>
          <span className="flex items-center text-base text-black ">
            <i className="bi bi-bar-chart mr-1"></i>
            Difficulty: {post.difficulty || "N/A"}
          </span>
          <span className="flex items-center text-base text-black">
            <i className="bi bi-calendar mr-1"></i>
            Created Date: {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
          </span>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="flex items-center text-red-500 hover:text-red-700"
          >
            <i className="bi bi-heart-fill mr-1"></i>
            <span>{post.likes} Likes</span>
          </button>
          <span className="flex items-center text-gray-600">
            <i className="bi bi-chat-fill mr-1"></i>
            <span>{post.comments ? post.comments.length : 0} Comments</span>
          </span>
        </div>
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Add a comment..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            onClick={(e) => e.stopPropagation()}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoodPostCard;