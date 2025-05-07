import React from 'react';
import { useNavigate } from 'react-router-dom';

const FoodPostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/addtip', { state: { tip: post } });
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <h2 className="mb-2 text-xl font-semibold text-gray-800">{post.title || 'Untitled'}</h2>
      <p className="mb-4 text-gray-600">{post.description || 'No description'}</p>
      {post.media && Array.isArray(post.media) && post.media.length > 0 ? (
        <div className="mb-4">
          {post.mediaType === 'video' ? (
            <video controls className="h-auto w-full rounded-lg">
              <source src={post.media[0]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {post.media.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${post.title || 'Image'} ${index + 1}`}
                  className="h-auto w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="mb-4 text-gray-500">No media available</p>
      )}
      <div className="mb-2 flex justify-between text-sm text-gray-500">
        <span>Author: {post.author || 'Unknown'}</span>
        <span>Difficulty: {post.difficulty || 'N/A'}</span>
      </div>
      <div className="mb-4 text-sm text-gray-500">Category: {post.category || 'N/A'}</div>
      <button
        onClick={handleEdit}
        className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-600"
      >
        Edit Tip
      </button>
    </div>
  );
};

export default FoodPostCard;