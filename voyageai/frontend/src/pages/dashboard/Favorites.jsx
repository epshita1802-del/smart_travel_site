import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import TourCard from "../../components/TourCard";
import * as userService from "../../services/userService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await userService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFavoriteChange = (tourId) => {
    setFavorites((prev) => prev.filter((t) => t._id !== tourId));
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Favorite Tours</h1>
      {favorites.length === 0 ? (
        <EmptyState title="No favorites yet" message="Tap the heart icon on any tour to save it here." action={<Link to="/packages" className="btn-primary">Browse Tours</Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {favorites.map((t) => (
            <TourCard key={t._id} tour={t} favorited onFavoriteChange={handleFavoriteChange} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
