export const getPostsByCategory = async (category) => {
  const response = await fetch(
    `http://localhost:8080/api/posts/category/${category}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};

export const getPostById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/posts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
};

export const deletePost = async (id) => {
  const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
};
