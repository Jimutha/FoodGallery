import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FoodPostCard from "../components/FoodPostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostsByCategory } from "../services/api";

const FoodRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await getPostsByCategory("RECIPE");
        setRecipes(response.data || []); // Ensure recipes is always an array
        setError(null);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div
      className="container mx-auto px-4 py-12"
      style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}
    >
      {/* Header Section with Title and Conditional Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
        <h1 className="text-3xl font-bold">Food Recipes</h1>
        {/* Show "Create New Recipe" button only if there are recipes */}
        {recipes.length > 0 && !isLoading && !error && (
          <Link
            to="/recipes/create"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            + Create New Recipe
          </Link>
        )}
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
          {error}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600 mb-4">
            No recipes found
          </h3>
          <Link
            to="/recipes/create"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Create your first recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <FoodPostCard key={recipe.id} post={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodRecipes;
