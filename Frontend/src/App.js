import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import the new Footer component
import Home from "./pages/Home";
import FoodPosts from "./pages/FoodPosts";
import FoodRecipes from "./pages/FoodRecipes";
import Decorations from "./pages/Decorations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";
import ProtectedRoute from "./components/ProtectedRoute";
import FoodPostCard from "./components/FoodPostCard";
import PostDetails from "./pages/PostDetails";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<FoodPosts />} />
          <Route path="/post-details" element={<PostDetails />} />
          <Route path="/recipes" element={<FoodRecipes />} />
          <Route path="/decorations" element={<Decorations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/food-post-card" element={<FoodPostCard />} />
          <Route path="/dashboard" element={<ProtectedRoute />} />
        </Routes>
      </main>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}

export default App;
