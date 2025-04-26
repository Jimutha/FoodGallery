import React from "react";
import { useNavigate } from "react-router-dom";

const FoodPostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-600">{post.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {post.mediaUrls.map((url, index) => (
          <img
            key={index}
            src={url} // Use the direct Firebase Storage URL
            alt={`Media ${index + 1}`}
            className="w-full h-32 object-cover rounded-md"
            onError={(e) => (e.target.src = "/placeholder-image.jpg")} // Fallback image if URL fails
          />
        ))}
      </div>
    </div>
  );
};

export default FoodPostCard;
