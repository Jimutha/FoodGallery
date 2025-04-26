import { useState } from "react";
import Modal from "./Modal";
import CreateRecipeForm from "./CreateRecipeForm";
import { deletePost } from "../services/api";

const RecipePostCard = ({ post, onModify, onDelete }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const openDetailsModal = () => setShowDetailsModal(true);
  const closeDetailsModal = () => setShowDetailsModal(false);

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const handleEditSubmit = (updatedRecipe) => {
    onModify(updatedRecipe); // Notify parent to update the recipe
    closeEditModal();
  };

  const handleDelete = async () => {
    // Show confirmation prompt
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${post.title}"?`
    );
    if (!confirmDelete) return;

    try {
      await deletePost(post.id); // Call API to delete the post
      onDelete(post.id); // Notify parent to update state
    } catch (err) {
      console.error("Error deleting recipe:", err);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Preview Image */}
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        {/* Title, View Details, Modify, and Delete Buttons */}
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
          <div className="space-x-3">
            <button
              onClick={openDetailsModal}
              className="inline-block text-blue-500 hover:text-blue-700 font-medium"
            >
              View Details
            </button>
            <button
              onClick={openEditModal}
              className="inline-block text-green-500 hover:text-green-700 font-medium"
            >
              Modify
            </button>
            <button
              onClick={handleDelete}
              className="inline-block text-red-500 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Recipe Details */}
      <Modal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        title={post.title}
      >
        <div className="space-y-6">
          {/* Preview Image */}
          <div className="relative">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
          </div>

          {/* Steps */}
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Steps to Follow
            </h4>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              {post.steps && post.steps.length > 0 ? (
                post.steps.map((step, index) => (
                  <li
                    key={index}
                    className="pl-2 py-2 bg-gray-100 rounded-lg shadow-sm"
                  >
                    {step}
                  </li>
                ))
              ) : (
                <p className="text-gray-600 italic">No steps provided.</p>
              )}
            </ol>
          </div>

          {/* Detailed Images */}
          {post.additionalImages && post.additionalImages.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Detailed Images
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.additionalImages.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Detailed image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg border border-gray-200 shadow-sm hover:scale-110 transition-transform duration-300"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Video */}
          {post.videoUrl && (
            <div className="relative">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Video
              </h4>
              <video
                controls
                src={post.videoUrl}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="bg-white/80 rounded-full p-4 hover:bg-white transition-colors"
                  onClick={(e) => e.target.parentElement.nextSibling.play()}
                >
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={closeDetailsModal}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for Editing Recipe */}
      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title="Modify Recipe"
      >
        <CreateRecipeForm
          onClose={closeEditModal}
          onSubmitSuccess={handleEditSubmit}
          recipeToEdit={post}
          isEditing={true}
        />
      </Modal>
    </>
  );
};

export default RecipePostCard;
