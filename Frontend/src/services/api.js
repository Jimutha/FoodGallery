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

export const createPost = async (postData) => {
  const formData = new FormData();
  formData.append("title", postData.title);
  formData.append("description", postData.description);
  if (postData.media && postData.media.length > 0) {
    postData.media.forEach((file, index) => {
      formData.append("media", file);
    });
  }

  const response = await fetch(`http://localhost:8080/api/posts`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return response.json();
};

export const updatePost = async (id, postData) => {
  const formData = new FormData();
  formData.append("title", postData.title);
  formData.append("description", postData.description);
  if (postData.media && postData.media.length > 0) {
    postData.media.forEach((file, index) => {
      formData.append("media", file);
    });
  }

  const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }
  return response.json();
};
