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
