// Frontend/src/RestaurantsByCuisine.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RestaurantsByCuisine.css';

const RestaurantsByCuisine = () => {
  const { cuisine } = useParams();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const limit = 12;

  useEffect(() => {
    fetchRestaurantsByCuisine();
  }, [cuisine, page]);

  const fetchRestaurantsByCuisine = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://food-finder-xv2a.onrender.com/api/restaurants/cuisine/${encodeURIComponent(cuisine)}?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch restaurants');
      }
      
      setRestaurants(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const renderStars = (rating) => {
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return <span className="stars">{stars}</span>;
  };

  if (loading) {
    return (
      <div className="cuisine-restaurants-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Finding {cuisine} restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cuisine-restaurants-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Restaurants</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cuisine-restaurants-container">
      <div className="header-section">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1 className="page-title">🍽️ {cuisine} Restaurants</h1>
        {pagination && (
          <p className="results-count">
            Found {pagination.totalRestaurants} restaurant{pagination.totalRestaurants !== 1 ? 's' : ''} serving {cuisine} cuisine
          </p>
        )}
      </div>

      {restaurants.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">🔍</div>
          <h3>No Restaurants Found</h3>
          <p>No restaurants found serving {cuisine} cuisine</p>
        </div>
      ) : (
        <>
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant['Restaurant ID']} 
                className="restaurant-card"
                onClick={() => handleRestaurantClick(restaurant['Restaurant ID'])}
              >
                <div className="restaurant-image-container">
                  <img 
                    src={restaurant.featured_image || '/api/placeholder/300/200'} 
                    alt={restaurant['Restaurant Name']}
                    className="restaurant-image"
                  />
                  <div className="cuisine-badge">
                    🍽️ {cuisine}
                  </div>
                </div>
                
                <div className="restaurant-info">
                  <h3 className="restaurant-name">{restaurant['Restaurant Name']}</h3>
                  
                  <div className="cuisine-info">
                    <span className="cuisines">{restaurant.Cuisines}</span>
                  </div>
                  
                  <div className="location-info">
                    <span className="location">📍 {restaurant.City}, {restaurant.Locality}</span>
                  </div>
                  
                  <div className="rating-section">
                    {renderStars(restaurant['Aggregate rating'])}
                    <span className="rating-value">({restaurant['Aggregate rating']}/5)</span>
                    <span className="rating-text">{restaurant['Rating text']}</span>
                  </div>
                  
                  <div className="cost-section">
                    <span className="cost">
                      💰 {restaurant.Currency} {restaurant['Average Cost for two']} for two
                    </span>
                  </div>
                  
                  <div className="services-section">
                    {restaurant['Has Online delivery'] === 'Yes' && (
                      <span className="service-badge delivery">🚚 Delivery</span>
                    )}
                    {restaurant['Has Table booking'] === 'Yes' && (
                      <span className="service-badge booking">📅 Booking</span>
                    )}
                  </div>
                  
                  <button className="view-details-btn">
                    View Full Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrevPage}
                className="pagination-btn"
              >
                ← Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantsByCuisine;