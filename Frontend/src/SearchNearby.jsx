import React, { useState } from 'react';
import './SearchNearby.css';

const SearchNearby = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState(5);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  const radiusOptions = [1, 3, 5, 10, 15, 20, 25, 30,40,50,60];

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/restaurants/near?lat=${latitude}&lng=${longitude}&radius=${radius}`);
      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-nearby-container">
      <h2 className="search-nearby-title">Search Nearby Restaurants</h2>
      <div className="search-form">
        <div className="input-group">
          <input
            className="input"
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <div className="radius-selector">
          <button className="radius-button" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            Radius: {radius} km
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
        <button className="search-button" onClick={handleSearch}>Search Nearby</button>
      </div>
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant['Restaurant ID']} className="restaurant-card">
          <img src={restaurant.featured_image} alt={restaurant['Restaurant Name']} />
            <h3 className="restaurant-name">{restaurant['Restaurant Name']}</h3>
            <p className="restaurant-cuisine">{restaurant['Cuisines']}</p>
            <p className="restaurant-address">{restaurant['Address']}</p>
            <p className="restaurant-rating">
              <span className="stars">{renderStars(restaurant['Aggregate rating'])}</span>
              {' '}({restaurant['Aggregate rating']})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderStars = (rating) => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return stars;
};

export default SearchNearby;