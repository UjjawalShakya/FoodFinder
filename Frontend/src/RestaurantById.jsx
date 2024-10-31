import React, { useState } from 'react';
import './RestaurantBy.css';

const RestaurantById = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [singleRestaurant, setSingleRestaurant] = useState(null);

  const fetchRestaurantById = async () => {
    try {
      const response = await fetch(`https://foodfinder-backend-stzh.onrender.com/api/restaurant/${restaurantId}`);
      const data = await response.json();
      setSingleRestaurant(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="search-section">
        <h2>Get Restaurant by ID</h2>
        <input
          type="text"
          placeholder="Restaurant ID"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
        />
        <button onClick={fetchRestaurantById}>Get Restaurant</button>
      </div>

      {singleRestaurant && (
        <div className="single-restaurant">
          <h3>{singleRestaurant['Restaurant Name']}</h3>
          <p>{singleRestaurant['Cuisines']}</p>
          <p>{singleRestaurant['Address']}</p>
          <p className="stars">{renderStars(singleRestaurant['Aggregate rating'])} ({singleRestaurant['Aggregate rating']})</p>
          <img src={singleRestaurant.featured_image} alt={singleRestaurant['Restaurant Name']} />
        </div>
      )}
    </div>
  );
};

const renderStars = (rating) => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return <span>{stars}</span>;
};

export default RestaurantById;
