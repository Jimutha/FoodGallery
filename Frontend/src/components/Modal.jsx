const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl p-8 w-full max-w-xl max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
