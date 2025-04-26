// Mock API functions for fetching posts
const mockPosts = [
  {
    id: 4,
    title: "Beautiful Cake Decoration",
    description: "A stunning cake decorated with fresh flowers.",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    category: "DECORATION",
    createdAt: "2025-04-01T10:00:00Z",
  },
];

// Mock user database (for login and registration)
const mockUsers = [
  {
    id: 1,
    email: "test@example.com",
    password: "password123",
    username: "TestUser",
  },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch posts by category
export const getPostsByCategory = async (category) => {
  await delay(1000);
  const filteredPosts = mockPosts.filter((post) => post.category === category);
  return { data: filteredPosts };
};

// Fetch a single post by ID
export const getPostById = async (id) => {
  await delay(1000);
  const post = mockPosts.find((post) => post.id === parseInt(id));
  if (!post) {
    throw new Error("Post not found");
  }
  return { data: post };
};

// Create a new post
export const createPost = async (post) => {
  await delay(500);
  mockPosts.push(post);
  return { success: true, data: post };
};

// Update an existing post
export const updatePost = async (id, updatedPost) => {
  await delay(500);
  const index = mockPosts.findIndex((post) => post.id === id);
  if (index === -1) {
    throw new Error("Post not found");
  }
  mockPosts[index] = { ...mockPosts[index], ...updatedPost };
  return { success: true, data: mockPosts[index] };
};

// Mock user registration
export const registerUser = async (userData) => {
  await delay(500);
  const { email, password, username } = userData;

  const existingUser = mockUsers.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const newUser = {
    id: mockUsers.length + 1,
    email,
    password,
    username,
  };
  mockUsers.push(newUser);

  return {
    success: true,
    token: `mock-token-${newUser.id}`,
    user: { id: newUser.id, email: newUser.email, username: newUser.username },
  };
};

// Mock user login
export const loginUser = async (credentials) => {
  await delay(500);
  const { email, password } = credentials;

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) {
    throw new Error("Invalid email or password");
  }

  return {
    success: true,
    token: `mock-token-${user.id}`,
    user: { id: user.id, email: user.email, username: user.username },
  };
};
