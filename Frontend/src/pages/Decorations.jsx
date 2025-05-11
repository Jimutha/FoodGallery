import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodPostCard from '../components/FoodPostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Decorations = () => {
  const [decorations, setDecorations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    const parsed = saved ? JSON.parse(saved) : {};
    console.log('Initial likedPosts from localStorage:', parsed);
    return parsed;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecorations = () => {
      try {
        const tips = JSON.parse(localStorage.getItem('decorationTips') || '[]');
        console.log('Raw tips from localStorage:', tips);
        const validTips = tips
          .filter((tip) => tip && typeof tip === 'object' && tip.id && tip.title && tip.description)
          .map(tip => {
            const mediaUrls = Array.isArray(tip.mediaUrls) && tip.mediaUrls.length > 0
              ? tip.mediaUrls
              : Array.isArray(tip.media)
              ? tip.media.filter(media => typeof media === 'string' && media.startsWith('data:image/'))
              : [];
            const formattedComments = Array.isArray(tip.comments)
              ? tip.comments.map(c => ({
                  text: typeof c === 'string' ? c : c.text || '',
                  replies: Array.isArray(c.replies) ? c.replies : [],
                  reactions: typeof c.reactions === 'number' ? c.reactions : 0
                }))
              : [];
            console.log(`Transformed mediaUrls for tip ${tip.id}:`, mediaUrls);
            console.log(`Formatted comments for tip ${tip.id}:`, formattedComments);
            return {
              ...tip,
              mediaUrls,
              likes: tip.likes || 0,
              comments: formattedComments,
            };
          });
        console.log('Valid tips after transformation:', validTips);
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

  useEffect(() => {
    console.log('Saving likedPosts to localStorage:', likedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  const handleAddTip = () => {
    navigate('/addtip');
  };

  const handleCardClick = (post) => {
    navigate(`/decoration/${post.id}`, { state: { post } });
  };

  const handleLike = (id, isLikeAction) => {
    console.log(`Handling ${isLikeAction ? 'Like' : 'Unlike'} for post ${id}. Current likes: ${decorations.find(d => d.id === id)?.likes}`);
    const updatedDecorations = decorations.map(decoration => {
      if (decoration.id === id) {
        const change = isLikeAction ? 1 : -1;
        const newLikes = decoration.likes + change;
        return { ...decoration, likes: Math.max(newLikes, 0) };
      }
      return decoration;
    });
    setDecorations(updatedDecorations);
    setLikedPosts(prev => ({
      ...prev,
      [id]: isLikeAction,
    }));
    localStorage.setItem('decorationTips', JSON.stringify(updatedDecorations));
  };

  const handleAddComment = (id, comment) => {
    const updatedDecorations = decorations.map(decoration => {
      if (decoration.id === id) {
        return { 
          ...decoration, 
          comments: [...(decoration.comments || []), { text: comment, replies: [], reactions: 0 }]
        };
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
              onLike={(isLikeAction) => handleLike(decoration.id, isLikeAction)}
              isLiked={!!likedPosts[decoration.id]}
              onAddComment={(comment) => handleAddComment(decoration.id, comment)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Decorations;