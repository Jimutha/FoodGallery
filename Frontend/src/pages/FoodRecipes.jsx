import { useEffect, useState } from "react";
import RecipePostCard from "../components/RecipePostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import CreateRecipeForm from "../components/CreateRecipeForm";
import { getPostsByCategory } from "../services/api";

const FoodRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await getPostsByCategory("RECIPE");
      setRecipes(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleRecipeCreated = (newRecipe, isEditing) => {
    if (isEditing) {
      // Update existing recipe in state
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === newRecipe.id ? newRecipe : recipe
        )
      );
    } else {
      // Add new recipe to state
      setRecipes([...recipes, newRecipe]);
    }
    setShowModal(false);
  };

  const handleModifyRecipe = (updatedRecipe) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  };

  const handleDeleteRecipe = (recipeId) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
  };

  return (
    <div
      className="container mx-auto px-4 py-12"
      style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
        <h1 className="text-3xl font-bold">Food Recipes</h1>
        {recipes.length > 0 && !isLoading && !error && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            + Create New Recipe
          </button>
        )}
      </div>

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
          <button
            onClick={() => setShowModal(true)}
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Create your first recipe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipePostCard
              key={recipe.id}
              post={recipe}
              onModify={handleModifyRecipe}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New Food Recipe"
      >
        <CreateRecipeForm
          onClose={() => setShowModal(false)}
          onSubmitSuccess={handleRecipeCreated}
          recipeToEdit={null}
          isEditing={false}
        />
      </Modal>
    </div>
  );
};

export default FoodRecipes;
