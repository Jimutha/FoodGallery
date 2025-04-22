import { Link } from "react-router-dom";

const FoodPostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
      <div className="h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
          src={
            post.imageUrl ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80"
          }
          alt={post.title}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
        <Link
          to={`/post/${post.id}`}
          className="inline-flex items-center text-primary-500 font-medium hover:underline"
        >
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FoodPostCard;
