import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Addtip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const editTip = location.state?.tip;

  const [formData, setFormData] = useState({
    id: editTip?.id || Date.now().toString(), // Generate unique ID for new tips
    title: editTip?.title || '',
    description: editTip?.description || '',
    category: editTip?.category || '',
    difficulty: editTip?.difficulty || '',
    media: editTip?.media || [],
    author: editTip?.author || '',
    tip: editTip?.tip || '',
    mediaType: editTip?.mediaType || 'images',
    createdAt: editTip?.createdAt || new Date().toISOString(),
  });
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editTip?.media?.length > 0) {
      const initialPreviews = editTip.media.map((media, index) => ({
        url: media,
        file: null,
        isVideo: editTip.mediaType === 'video',
      }));
      setPreviews(initialPreviews);
    }
  }, [editTip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.mediaType === 'images' && formData.media.length === 0) {
      setError('Please upload at least one image');
      setIsSubmitting(false);
      return;
    }
    if (formData.mediaType === 'video' && formData.media.length === 0) {
      setError('Please upload a video');
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert media files to base64
      const mediaBase64 = await Promise.all(
        formData.media.map((file) =>
          file instanceof File
            ? new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
              })
            : Promise.resolve(file)
        )
      );

      const tipData = {
        ...formData,
        media: mediaBase64,
      };

      // Load existing tips from localStorage
      const existingTips = JSON.parse(localStorage.getItem('decorationTips') || '[]');

      if (editTip) {
        // Update existing tip
        const updatedTips = existingTips.map((tip) =>
          tip.id === editTip.id ? tipData : tip
        );
        localStorage.setItem('decorationTips', JSON.stringify(updatedTips));
      } else {
        // Add new tip
        localStorage.setItem(
          'decorationTips',
          JSON.stringify([...existingTips, tipData])
        );
      }

      // Show success message
      alert('Successfully submitted!');

      // Navigate to decorations page
      navigate('/decorations');
    } catch (err) {
      console.error('Error saving tip:', err);
      setError('Failed to save tip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaTypeChange = (type) => {
    setFormData({
      ...formData,
      mediaType: type,
      media: [],
    });
    setPreviews([]);
    setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    setError('');

    if (formData.mediaType === 'images') {
      if (formData.media.length + files.length > 3) {
        setError('You can upload a maximum of 3 images');
        return;
      }

      const imageFiles = files.filter((file) => file.type.match('image.*'));
      if (imageFiles.length !== files.length) {
        setError('Please upload only image files');
        return;
      }

      const newPreviews = [];
      const newMedia = [...formData.media];

      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            url: reader.result,
            file: file,
          });
          newMedia.push(file);

          if (newPreviews.length === imageFiles.length) {
            setPreviews([...previews, ...newPreviews]);
            setFormData({ ...formData, media: newMedia });
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      if (files.length > 1) {
        setError('Please upload only one video');
        return;
      }

      const videoFile = files[0];
      if (!videoFile.type.match('video.*')) {
        setError('Please upload a video file');
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          setError('Video must be 30 seconds or shorter');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews([
            {
              url: reader.result,
              file: videoFile,
              isVideo: true,
            },
          ]);
          setFormData({ ...formData, media: [videoFile] });
        };
        reader.readAsDataURL(videoFile);
      };

      video.src = URL.createObjectURL(videoFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeMedia = (index) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    const newMedia = [...formData.media];
    newMedia.splice(index, 1);
    setFormData({ ...formData, media: newMedia });
  };

  const handleBack = () => {
    navigate('/decorations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-green-500 rounded-t-2xl"></div>

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-indigo-500 after:to-green-500 after:rounded">
          {editTip ? 'Edit Decoration Tip' : 'Create a Decoration Tip'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-600 flex items-center">
              <i className="bi bi-person-badge mr-2"></i> Basic Information
            </h2>

            <div className="mb-6">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your name or nickname"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Perfect Frosting Technique"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Briefly describe your decorating tip"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-600 flex items-center">
              <i className="bi bi-lightbulb mr-2"></i> Tip Details
            </h2>

            <div className="mb-6">
              <label htmlFor="tip" className="block text-sm font-medium text-gray-700 mb-2">
                Decoration Tip <span className="text-red-500">*</span>
              </label>
              <textarea
                id="tip"
                name="tip"
                rows="6"
                value={formData.tip}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Explain your decorating tip in detail"
                required
              ></textarea>
            </div>
          </div>

          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-600 flex items-center">
              <i className="bi bi-images mr-2"></i> Media Upload
            </h2>

            <div className="flex mb-4 rounded-lg overflow-hidden">
              <div
                className={`flex-1 text-center py-3 cursor-pointer ${
                  formData.mediaType === 'images' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                } rounded-l-lg border border-gray-200 transition-colors duration-300`}
                onClick={() => handleMediaTypeChange('images')}
              >
                <i className="bi bi-images mr-2"></i>
                Images (Max 3)
              </div>
              <div
                className={`flex-1 text-center py-3 cursor-pointer ${
                  formData.mediaType === 'video' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                } rounded-r-lg border border-gray-200 transition-colors duration-300`}
                onClick={() => handleMediaTypeChange('video')}
              >
                <i className="bi bi-camera-reels mr-2"></i>
                Video (Max 30s)
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={formData.mediaType === 'images' ? 'image/*' : 'video/*'}
              className="hidden"
              multiple={formData.mediaType === 'images'}
            />

            <div
              className={`border-2 border-dashed ${
                isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'
              } rounded-lg p-8 text-center mb-6 transition-all duration-300 cursor-pointer hover:border-indigo-600 hover:bg-indigo-50`}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previews.length === 0 ? (
                <>
                  <div className="text-indigo-600 text-5xl mb-4 opacity-80">
                    <i className={`bi ${formData.mediaType === 'images' ? 'bi-images' : 'bi-camera-reels'}`}></i>
                  </div>
                  <div className="text-center">
                    <h5 className="text-lg font-bold text-indigo-600 mb-2">
                      {formData.mediaType === 'images'
                        ? 'Drag & Drop your images here'
                        : 'Drag & Drop your video here'}
                    </h5>
                    <p className="text-gray-600 text-sm mb-4">or click to browse files</p>
                    <p className="text-gray-500 text-xs">
                      {formData.mediaType === 'images'
                        ? 'Supports: JPG, PNG, GIF (Max 5MB each)'
                        : 'Supports: MP4, MOV (Max 30 seconds)'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-500 transition-colors duration-300"
                  >
                    <i className="bi bi-folder2-open mr-2"></i> Browse Files
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden shadow-md aspect-square hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      {preview.isVideo ? (
                        <video controls className="w-full h-full object-cover">
                          <source src={preview.url} type={preview.file?.type || 'video/mp4'} />
                        </video>
                      ) : (
                        <img src={preview.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-300 opacity-90 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMedia(index);
                        }}
                      >
                        <i className="bi bi-x text-sm"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="font-semibold text-indigo-600">
                {previews.length} {previews.length === 1 ? 'file' : 'files'} selected
              </div>
              <div className="text-gray-500">
                {formData.mediaType === 'images' ? 'Max 3 images' : 'Max 1 video'}
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-4">
            <div className="text-gray-600 text-sm flex items-center">
              <i className="bi bi-calendar mr-2"></i>
              {new Date(formData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={handleBack}
                className="w-full md:w-auto bg-gradient-to-r from-gray-500 to-gray-400 text-white font-bold py-2 px-6 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <i className="bi bi-arrow-left-circle mr-2"></i>
                Back
              </button>
              <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-bold py-2 px-6 rounded-lg hover:from-indigo-600 hover:to-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70 disabled:hover:from-indigo-500 disabled:hover:to-indigo-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle mr-2"></i>
                    {editTip ? 'Update Tip' : 'Add Tip'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addtip;