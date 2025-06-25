import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchNearby.css';

const SearchNearby = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState(5);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const navigate = useNavigate();

  const radiusOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50,500];

  // Get user's current location
  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setGettingLocation(false);
          setError('');
        },
        (error) => {
          setError('Unable to get your location. Please enter coordinates manually.');
          setGettingLocation(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setGettingLocation(false);
    }
  };

  const handleSearch = async () => {
    if (!latitude || !longitude) {
      setError('Please provide both latitude and longitude');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const response = await fetch(`http://localhost:3000/api/restaurants/near?lat=${latitude}&lng=${longitude}&radius=${radius}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setRestaurants(data.data || []);
      } else {
        setRestaurants([]);
        setError(data.message || 'No restaurants found in this area');
      }
      setSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search restaurants. Please try again.');
      setRestaurants([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const renderStars = (rating) => {
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return <span className="stars">{stars}</span>;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  return (
    <div className="search-nearby-container">
      <div className="search-header">
        <h1 className="page-title">🗺️ Find Nearby Restaurants</h1>
        <p className="page-subtitle">Discover great restaurants around you</p>
      </div>

      <div className="search-card">
        <div className="location-section">
          <h3 className="section-title">📍 Location</h3>
          <div className="location-inputs">
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  className="location-input"
                  type="number"
                  placeholder="Latitude (e.g., 28.7041)"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  onKeyPress={handleKeyPress}
                  step="any"
                />
                <div className="input-icon">🌐</div>
              </div>
              <div className="input-wrapper">
                <input
                  className="location-input"
                  type="number"
                  placeholder="Longitude (e.g., 77.1025)"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  onKeyPress={handleKeyPress}
                  step="any"
                />
                <div className="input-icon">🌐</div>
              </div>
            </div>
            <button 
              className="location-btn" 
              onClick={getCurrentLocation}
              disabled={gettingLocation}
            >
              {gettingLocation ? (
                <>
                  <div className="spinner"></div>
                  Getting Location...
                </>
              ) : (
                <>
                  📍 Use My Location
                </>
              )}
            </button>
          </div>
        </div>

        <div className="radius-section">
          <h3 className="section-title">📏 Search Radius</h3>
          <div className="radius-selector">
            <button 
              className="radius-button" 
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <span className="radius-value">{radius} km</span>
              <span className="dropdown-arrow">{isDrawerOpen ? '▲' : '▼'}</span>
            </button>
            {isDrawerOpen && (
              <div className="radius-drawer">
                {radiusOptions.map((option) => (
                  <button
                    key={option}
                    className={`radius-option ${radius === option ? 'selected' : ''}`}
                    onClick={() => {
                      setRadius(option);
                      setIsDrawerOpen(false);
                    }}
                  >
                    {option} km
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          className="search-button" 
          onClick={handleSearch}
          disabled={loading || !latitude || !longitude}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Searching...
            </>
          ) : (
            <>
              🔍 Search Restaurants
            </>
          )}
        </button>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="results-section">
        {searched && !loading && (
          <div className="results-header">
            <h2>
              {restaurants.length > 0 
                ? `Found ${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} within ${radius}km` 
                : 'No restaurants found'
              }
            </h2>
          </div>
        )}

        {restaurants.length > 0 && (
          <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant['Restaurant ID']} 
                className="restaurant-card"
                onClick={() => handleRestaurantClick(restaurant['Restaurant ID'])}
              >
                <div className="restaurant-image-container">
                  <img 
                    src={restaurant.featured_image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={restaurant['Restaurant Name']}
                    className="restaurant-image"
                  />
                  <div className="radius-badge">
                    📍 Within {radius}km
                  </div>
                </div>
                
                <div className="restaurant-info">
                  <h3 className="restaurant-name">{restaurant['Restaurant Name']}</h3>
                  
                  <div className="cuisine-info">
                    <span className="cuisines">🍽️ {restaurant['Cuisines']}</span>
                  </div>
                  
                  <div className="address-info">
                    <span className="address">📍 {restaurant['Address']}</span>
                  </div>
                  
                  <div className="rating-section">
                    {renderStars(restaurant['Aggregate rating'])}
                    <span className="rating-value">({restaurant['Aggregate rating']}/5)</span>
                    <span className="rating-text">{restaurant['Rating text']}</span>
                  </div>

                  {restaurant['Average Cost for two'] && (
                    <div className="cost-section">
                      <span className="cost">
                        💰 {restaurant.Currency} {restaurant['Average Cost for two']} for two
                      </span>
                    </div>
                  )}
                  
                  <div className="services-section">
                    {restaurant['Has Online delivery'] === 'Yes' && (
                      <span className="service-badge delivery">🚚 Delivery</span>
                    )}
                    {restaurant['Has Table booking'] === 'Yes' && (
                      <span className="service-badge booking">📅 Booking</span>
                    )}
                  </div>
                  
                  <button className="view-details-btn">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searched && restaurants.length === 0 && !loading && !error && (
          <div className="no-results-card">
            <div className="no-results-icon">🔍</div>
            <h3>No Restaurants Found</h3>
            <p>Try expanding your search radius or checking a different location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchNearby;