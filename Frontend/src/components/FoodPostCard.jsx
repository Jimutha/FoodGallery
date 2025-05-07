import React from "react";
import { useNavigate } from "react-router-dom";

const FoodPostCard = ({ post }) => {
  const navigate = useNavigate();

  console.log("FoodPostCard post:", post);

  if (!post) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-red-500">Error: Post data is missing.</p>
      </div>
    );
  }

  const handleClick = () => {
    navigate(`/decoration/${post.id}`, { state: { post } }); // Pass post data via state
  };

  const mediaUrls = Array.isArray(post.mediaUrls) ? post.mediaUrls : [];

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {post.title || "Untitled"}
      </h2>
      <p className="text-gray-600 mb-4">{post.description || "No description"}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {mediaUrls.length > 0 ? (
          mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
              onError={(e) => (e.target.src = "/placeholder-image.jpg")}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No media available.</p>
        )}
      </div>
    </div>
  );
};

export default FoodPostCard;