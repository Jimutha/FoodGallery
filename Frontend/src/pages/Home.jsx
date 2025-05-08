import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostsByCategory } from "../services/api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [likes, setLikes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPostsByCategory("POST");
        setPosts(Array.isArray(response) ? response : []);
        // Initialize comments and likes for each post
        const initialComments = {};
        const initialLikes = {};
        response.forEach((post) => {
          initialComments[post.id] = post.comments || [];
          initialLikes[post.id] = post.likes || 0;
        });
        setComments(initialComments);
        setLikes(initialLikes);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const comment = newComment[postId] || "";
    if (comment.trim()) {
      const updatedComments = [...(comments[postId] || []), comment];
      setComments((prev) => ({ ...prev, [postId]: updatedComments }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handleLike = (postId) => {
    const currentLikes = likes[postId] || 0;
    setLikes((prev) => ({ ...prev, [postId]: currentLikes + 1 }));
  };

  const handleUnlike = (postId) => {
    const currentLikes = likes[postId] || 0;
    if (currentLikes > 0) {
      setLikes((prev) => ({ ...prev, [postId]: currentLikes - 1 }));
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-96"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to FOOD GALLERY
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Discover delicious recipes and beautiful food presentations
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="px-6 py-1 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition duration-300"
              >
                Join Our Community
              </Link>
              <Link
                to="/posts"
                className="px-6 py-1 bg-white text-primary-500 font-medium rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Explore Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          All Food Posts
        </h2>
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">
            No posts available. Create a new post from the{" "}
            <Link to="/posts" className="text-blue-500 underline">
              Create Post
            </Link>{" "}
            page.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="relative">
                  {post.mediaUrls && post.mediaUrls.length > 0 ? (
                    <img
                      src={post.mediaUrls[0]}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mt-2">{post.title}</h3>
                <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-2 text-red-500 font-semibold">
                  {likes[post.id] || 0} Likes
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleUnlike(post.id)}
                    className="p-1 bg-gray-400 text-white rounded-md hover:bg-red-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v-5a2 2 0 012-2h2m-2 10h-2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-semibold">Comments</h4>
                  {comments[post.id] && comments[post.id].length > 0 ? (
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {comments[post.id].map((comment, index) => (
                        <li key={index} className="text-gray-700">
                          {comment}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}
                  <form
                    onSubmit={(e) => handleAddComment(post.id, e)}
                    className="flex gap-2 mt-1"
                  >
                    <input
                      type="text"
                      value={newComment[post.id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="Add a comment..."
                      className="flex-1 p-1 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
