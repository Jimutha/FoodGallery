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
        // Load tips from localStorage
        const tips = JSON.parse(localStorage.getItem('decorationTips') || '[]');
        // Validate and filter tips
        const validTips = tips.filter((tip) => {
          return (
            tip &&
            typeof tip === 'object' &&
            tip.id &&
            tip.title &&
            tip.description &&
            (tip.media === undefined || Array.isArray(tip.media))
          );
        });
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-4"> Decorations</h1>
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
            <FoodPostCard key={decoration.id} post={decoration} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Decorations;