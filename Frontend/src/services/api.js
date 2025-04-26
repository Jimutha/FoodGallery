import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (credentials) => API.post("/auth/login", credentials);

// Post endpoints
export const getPostsByCategory = (category) => API.get(`/posts/${category}`);
export const getPostById = (id) => API.get(`/posts/${id}`);
export const createPost = (postData) => API.post("/posts", postData);
export const updatePost = (id, postData) => API.put(`/posts/${id}`, postData);
export const deletePost = (id) => API.delete(`/posts/${id}`);

// Recipe endpoints
export const createRecipe = (recipeData) => {
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

  return API.post("/recipes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getRecipes = () => API.get("/recipes?category=RECIPE");
export const getRecipeById = (id) => API.get(`/recipes/${id}`);
export const updateRecipe = (id, recipeData) => {
  const formData = new FormData();

  formData.append("title", recipeData.title);

  recipeData.steps.forEach((step, index) => {
    formData.append(`steps[${index}]`, step);
  });

  if (recipeData.media) {
    recipeData.media.forEach((file) => {
      if (file instanceof File) {
        formData.append("media", file);
      }
    });
  }

  return API.put(`/recipes/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);

// Media endpoints
export const uploadMedia = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteMedia = (mediaId) => API.delete(`/media/${mediaId}`);
