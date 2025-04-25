import api from "./api";

export const createRecipe = async (recipeData) => {
  const formData = new FormData();

  // Append basic fields
  formData.append("title", recipeData.title);
  formData.append("category", "RECIPE");

  // Append steps
  recipeData.steps.forEach((step, index) => {
    formData.append(`steps[${index}]`, step);
  });

  // Append media files
  recipeData.media.forEach((file) => {
    formData.append("media", file);
  });

  try {
    const response = await api.post("/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecipes = async () => {
  try {
    const response = await api.get("/recipes?category=RECIPE");
    return response.data;
  } catch (error) {
    throw error;
  }
};
