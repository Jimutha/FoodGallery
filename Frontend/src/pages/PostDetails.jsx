import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostsByCategory } from "../services/api";

const PostDetails = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPostsByCategory("POST");
        setPosts(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again.");
        setPosts([]); // Fallback to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleAddNewPost = () => {
    navigate("/posts");
  };

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full max-w-6xl mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Food Posts</h1>
        <button
          onClick={handleAddNewPost}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 text-sm font-medium shadow-md"
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
      ) : error ? (
        <div className="text-center text-red-500 text-lg">{error}</div>
      ) : !Array.isArray(posts) || posts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No posts available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePostClick(post.id)}
            >
              {/* Image or Video with Title and More Options */}
              <div className="relative">
                {post.mediaUrls && post.mediaUrls.length > 0 ? (
                  post.mediaUrls[0].startsWith("data:image/") ? (
                    <img
                      src={post.mediaUrls[0]}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                  ) : (
                    <video
                      src={post.mediaUrls[0]}
                      className="w-full h-64 object-cover"
                      controls
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Media Available</span>
                  </div>
                )}
                {/* Title in Bottom-Left Corner */}
                <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  {post.title}
                </h2>
                {/* More Options in Top-Right Corner */}
                <div className="absolute top-4 right-4">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v.01M12 12v.01M12 18v.01"
                    />
                  </svg>
                </div>
              </div>
              {/* Description */}
              <div className="p-4">
                <p className="text-gray-700 text-sm">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetails;
