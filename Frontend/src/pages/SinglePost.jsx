import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostById } from "../services/api";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(id);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-96 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={
              post.imageUrl ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80"
            }
            alt={post.title}
          />
        </div>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-500 mb-6">
            <span className="text-sm">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {post.description}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SinglePost;
