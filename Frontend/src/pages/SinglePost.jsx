import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(id);
        setPost(response);
        setError(null);
      } catch (err) {
        setError(`Failed to load post: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        alert("Post deleted successfully!");
        navigate("/post-details");
      } catch (err) {
        setError(`Failed to delete post: ${err.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  if (!post) {
    return (
      <div className="text-center text-gray-500 py-12">Post not found.</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-6">{post.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {post.mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              className="w-full h-48 object-cover rounded-md"
              onError={(e) => (e.target.src = "/placeholder-image.jpg")}
            />
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => navigate(`/update-posts/${id}`)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
