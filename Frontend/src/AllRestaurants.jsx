import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const limit = 12;

  useEffect(() => {
    fetchRestaurants();
  }, [page]);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://food-finder-xv2a.onrender.com/api/restaurants?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Handle different possible response structures
      if (Array.isArray(data)) {
        setRestaurants(data);
      } else if (data.restaurants && Array.isArray(data.restaurants)) {
        setRestaurants(data.restaurants);
      } else if (data.data && Array.isArray(data.data)) {
        setRestaurants(data.data);
      } else {
        console.error('Unexpected data structure:', data);
        setRestaurants([]);
        setError('Unexpected data format received from server');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch restaurants');
      setRestaurants([]); // Ensure restaurants is always an array
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => setPage((prevPage) => Math.max(1, prevPage - 1));
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>All Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div 
              key={restaurant['Restaurant ID']} 
              className="restaurant-card clickable"
              onClick={() => handleRestaurantClick(restaurant['Restaurant ID'])}
            >
              <img src={restaurant.featured_image} alt={restaurant['Restaurant Name']} />
              <h3>{restaurant['Restaurant Name']}</h3>
              <p>{restaurant['Cuisines']}</p>
              <p>{restaurant['Address']}</p>
              <p>{renderStars(restaurant['Aggregate rating'])} ({restaurant['Aggregate rating']})</p>
            </div>
          ))
        ) : (
          <div>No restaurants found</div>
        )}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>Prev</button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={restaurants.length < limit}>Next</button>
      </div>
    </div>
  );
};

const renderStars = (rating) => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return <span>{stars}</span>;
};

export default AllRestaurants;
