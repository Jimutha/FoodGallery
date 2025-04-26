import { useState } from "react";
import Modal from "./Modal";
import CreateRecipeForm from "./CreateRecipeForm";
import { deletePost } from "../services/api";

const RecipePostCard = ({ post, onModify, onDelete }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDetailsModal = () => setShowDetailsModal(true);
  const closeDetailsModal = () => setShowDetailsModal(false);

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleEditSubmit = (updatedRecipe) => {
    onModify(updatedRecipe);
    closeEditModal();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(post.id);
      onDelete(post.id);
      closeDeleteModal();
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
        {/* Title and Action Buttons */}
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
          <div className="flex space-x-2">
            {/* View Details Button */}
            <button
              onClick={openDetailsModal}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
              aria-label="View recipe details"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View
            </button>
            {/* Modify Button */}
            <button
              onClick={openEditModal}
              className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
              aria-label="Modify recipe"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                />
              </svg>
              Modify
            </button>
            {/* Delete Button */}
            <button
              onClick={openDeleteModal}
              className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
              aria-label="Delete recipe"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0H6a1 1 0 00-1 1v1h14V4a1 1 0 00-1-1h-4m-5 4v12m0-12h8"
                />
              </svg>
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

      {/* Modal for Delete Confirmation */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
      >
        <div className="space-y-6">
          <p className="text-gray-700">
            Are you sure you want to delete "
            <span className="font-semibold">{post.title}</span>"? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              aria-label="Confirm deletion"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RecipePostCard;
