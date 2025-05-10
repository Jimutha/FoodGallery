import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CreateFoodPost from "./pages/CreateFoodPost";
import PostDetails from "./pages/PostDetails";
import FoodRecipes from "./pages/FoodRecipes";
import Decorations from "./pages/Decorations";
import SinglePost from "./pages/SinglePost";

import UpdatePost from "./pages/UpdatePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import React from 'react';
//import { useAuth } from "./context/AuthContext";


import Addtip from "./pages/Addtip";
import DecorationDetail from "./components/DecorationDetail";

import UpdatePost from "./pages/UpdatePost";


function App() {

  //const { isAuthenticated } = useAuth();
 // <Route
 // path="/"
 // element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
///> 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pb-16">
        <Routes>
   
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<CreateFoodPost />} />
          <Route path="/update-posts/:id" element={<UpdatePost />} />
          <Route path="/post-details" element={<PostDetails />} />
          <Route path="/recipes" element={<FoodRecipes />} />
          <Route path="/decorations" element={<Decorations />} />

          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/addtip" element={<Addtip />} />
          <Route path="/decoration/:id" element={<DecorationDetail />} />
          <Route path="/post/:id" element={<SinglePost />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;