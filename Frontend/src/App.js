import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import FoodPosts from "./pages/FoodPosts";
import FoodRecipes from "./pages/FoodRecipes";
import Decorations from "./pages/Decorations";
import SinglePost from "./pages/SinglePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import Addtip from "./pages/Addtip";
import PostDetails from "./pages/PostDetails";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts" element={<FoodPosts />} />
            <Route path="/food-posts" element={<FoodPosts />} />
            <Route path="/post-details" element={<PostDetails />} />
            <Route path="/recipes" element={<FoodRecipes />} />
            <Route path="/decorations" element={<Decorations />} />
            <Route path="/addtip" element={<Addtip />} />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/post/:id" element={<SinglePost />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/recipes/create" element={<FoodRecipes />} />
              <Route path="/dashboard" element={<ProtectedRoute />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;