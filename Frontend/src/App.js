import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import CreateFoodPost from "./pages/CreateFoodPost";
import PostDetails from "./pages/PostDetails";
import FoodRecipes from "./pages/FoodRecipes";
import Decorations from "./pages/Decorations";
import SinglePost from "./pages/SinglePost";


function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<CreateFoodPost />} />
          <Route path="/post-details" element={<PostDetails />} />
          <Route path="/recipes" element={<FoodRecipes />} />
          <Route path="/decorations" element={<Decorations />} />
          <Route path="/post/:id" element={<SinglePost />} />
        </Routes>
      </main>
      <Footer />
    </div>

import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/food-posts" element={<FoodPosts />} />
            <Route path="/recipes" element={<FoodRecipes />} />
            <Route path="/decorations" element={<Decorations />} />
            <Route path="/posts/:id" element={<SinglePost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>

  );
}

export default App;
