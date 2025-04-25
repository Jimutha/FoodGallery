import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodPostCard from "../components/FoodPostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostsByCategory } from "../services/api";

const FoodPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPostsByCategory("POST");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleAddNewPost = () => {
    navigate("/posts");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-purple-500 pb-1">
          Food Posts
        </h1>
        <button
          onClick={handleAddNewPost}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 text-sm font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Post
        </button>
      </div>

      {/* Posts Section */}
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <FoodPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodPosts;
