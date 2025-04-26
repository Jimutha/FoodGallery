import { useEffect, useState } from "react";
import FoodPostCard from "../components/FoodPostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPostsByCategory } from "../services/api";

const FoodRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getPostsByCategory("RECIPE");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Food Recipes</h1>
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
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
