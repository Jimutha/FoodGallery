import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodPostCard from '../components/FoodPostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Decorations = () => {
  const [decorations, setDecorations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecorations = () => {
      try {
        const tips = JSON.parse(localStorage.getItem('decorationTips') || '[]');
        console.log("Raw tips from localStorage:", tips);
        const validTips = tips
          .filter((tip) => {
            return (
              tip &&
              typeof tip === 'object' &&
              tip.id &&
              tip.title &&
              tip.description
            );
          })
          .map(tip => {
            const mediaUrls = Array.isArray(tip.mediaUrls) && tip.mediaUrls.length > 0
              ? tip.mediaUrls
              : Array.isArray(tip.media)
              ? tip.media.filter(media => 
                  typeof media === 'string' && media.startsWith('data:image/')
                )
              : [];
            console.log("Transformed mediaUrls for tip", tip.id, ":", mediaUrls);
            return {
              ...tip,
              mediaUrls,
              likes: tip.likes || 0, // Initialize likes if not present
              comments: tip.comments || [], // Initialize comments if not present
            };
          });
        console.log("Valid tips after transformation:", validTips);
        setDecorations(validTips);
      } catch (error) {
        console.error('Error fetching decorations:', error);
        setDecorations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecorations();
  }, []);

  const handleAddTip = () => {
    navigate('/addtip');
  };

  const handleCardClick = (post) => {
    navigate(`/decoration/${post.id}`, { state: { post } });
  };

  const handleLike = (id) => {
    const updatedDecorations = decorations.map(decoration => {
      if (decoration.id === id) {
        return { ...decoration, likes: decoration.likes + 1 };
      }
      return decoration;
    });
    setDecorations(updatedDecorations);
    localStorage.setItem('decorationTips', JSON.stringify(updatedDecorations));
  };

  const handleAddComment = (id, comment) => {
    const updatedDecorations = decorations.map(decoration => {
      if (decoration.id === id) {
        return { ...decoration, comments: [...decoration.comments, comment] };
      }
      return decoration;
    });
    setDecorations(updatedDecorations);
    localStorage.setItem('decorationTips', JSON.stringify(updatedDecorations));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">Decorations Tips</h1>
      <div className="flex justify-end mb-8">
        <button
          onClick={handleAddTip}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Decoration
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : decorations.length === 0 ? (
        <p className="text-center text-gray-600">No decoration tips found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {decorations.map((decoration) => (
            <FoodPostCard 
              key={decoration.id} 
              post={decoration} 
              onClick={() => handleCardClick(decoration)}
              onLike={() => handleLike(decoration.id)}
              onAddComment={(comment) => handleAddComment(decoration.id, comment)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Decorations;