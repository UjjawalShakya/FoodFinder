import React, { useState, useEffect } from 'react';
// import './AllRestaurants.css'; // Add your styles here

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchRestaurants();
  }, [page]);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`/api/restaurants?page=${page}&limit=${limit}`);
      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrevPage = () => setPage((prevPage) => Math.max(1, prevPage - 1));
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);

  return (
    <div>
      <h2>All Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant['Restaurant ID']} className="restaurant-card">
            <img src={restaurant.featured_image} alt={restaurant['Restaurant Name']} />
            <h3>{restaurant['Restaurant Name']}</h3>
            <p>{restaurant['Cuisines']}</p>
            <p>{restaurant['Address']}</p>
            <p>{renderStars(restaurant['Aggregate rating'])} ({restaurant['Aggregate rating']})</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage}>Prev</button>
        {page}
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

const renderStars = (rating) => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return <span>{stars}</span>;
};

export default AllRestaurants;
