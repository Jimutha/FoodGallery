import { useEffect, useState } from "react";
import FoodPostCard from "../components/FoodPostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostsByCategory } from "../services/api";

const FoodPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Food Posts</h1>
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
