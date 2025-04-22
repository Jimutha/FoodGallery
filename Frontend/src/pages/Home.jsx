import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FoodPostCard from "../components/FoodPostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostsByCategory } from "../services/api";

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPostsByCategory("POST");
        setFeaturedPosts(response.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

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
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition duration-300"
              >
                Join Our Community
              </Link>
              <Link
                to="/posts"
                className="px-6 py-3 bg-white text-primary-500 font-medium rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Explore Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Featured Food Posts
        </h2>
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <FoodPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
