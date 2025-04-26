import { useEffect, useState } from "react";
import FoodPostCard from "../components/FoodPostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostsByCategory } from "../services/api";

const Decorations = () => {
  const [decorations, setDecorations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDecorations = async () => {
      try {
        const response = await getPostsByCategory("DECORATION");
        setDecorations(response.data);
      } catch (error) {
        console.error("Error fetching decorations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecorations();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Food Decorations</h1>
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {decorations.map((decoration) => (
            <FoodPostCard key={decoration.id} post={decoration} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Decorations;
