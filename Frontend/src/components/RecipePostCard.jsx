import { Link } from "react-router-dom";

const RecipePostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Preview Image */}
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      {/* Title */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {post.title}
        </h3>
        {/* View Details Link */}
        <Link
          to={`/recipes/${post.id}`}
          className="inline-block text-blue-500 hover:text-blue-700 font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RecipePostCard;
