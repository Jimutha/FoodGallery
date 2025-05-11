import React, { useState, useEffect } from 'react';

const FoodPostCard = ({ post, onClick, onLike, onAddComment, isLiked }) => {
  const [commentText, setCommentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === (post.mediaUrls?.length - 1 || 0) ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [post.mediaUrls]);

  const handleCommentSubmit = (e) => {
    e.preventPropagation();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  console.log(`Rendering FoodPostCard for post ${post.id}, isLiked: ${isLiked}, likes: ${post.likes}`);

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
          <span className="flex items-center text-base text-black">
            <i className="bi bi-bar-chart mr-1"></i>
            Difficulty: {post.difficulty || "N/A"}
          </span>
          <span className="flex items-center text-base text-black">
            <i className="bi bi-calendar mr-1"></i>
            Created: {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
          </span>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLiked) onLike(true);
            }}
            className={`flex items-center gap-2 ${!isLiked ? 'bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} font-semibold py-2 px-4 rounded-full transition-all duration-300`}
            disabled={isLiked}
          >
            <i className={`bi ${isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
            <span>Like ({post.likes})</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isLiked) onLike(false);
            }}
            className={`flex items-center gap-2 ${isLiked ? 'bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} font-semibold py-2 px-4 rounded-full transition-all duration-300`}
            disabled={!isLiked}
          >
            <i className={`bi ${isLiked ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'}`}></i>
            <span>Unlike ({post.likes})</span>
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