import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantBy.css';

const RestaurantById = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [singleRestaurant, setSingleRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const fetchRestaurantById = async () => {
    if (!restaurantId.trim()) {
      setError('Please enter a valid Restaurant ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSingleRestaurant(null);
    setSearched(false);

    try {
      const response = await fetch(`https://food-finder-xv2a.onrender.com/api/restaurant/${restaurantId}`);
      
      if (response.status === 404) {
        setError('No restaurant found with this ID');
        setSearched(true);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
      }

      const result = await response.json();
      setSingleRestaurant(result.data || result);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchRestaurantById();
    }
  };

  const handleViewDetails = () => {
    navigate(`/restaurant/${singleRestaurant['Restaurant ID']}`);
  };

  const renderStars = (rating) => {
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return <span className="stars">{stars}</span>;
  };

  return (
    <div className="restaurant-by-id-container">
      <div className="search-header">
        <h1 className="page-title">Find Restaurant by ID</h1>
        <p className="page-subtitle">Enter a restaurant ID to get detailed information</p>
      </div>

      <div className="search-card">
        <div className="search-input-group">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter Restaurant ID"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="restaurant-id-input"
            />
            <div className="input-icon">🔍</div>
          </div>
          <button 
            onClick={fetchRestaurantById} 
            disabled={loading || !restaurantId.trim()}
            className="search-btn"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Searching...
              </>
            ) : (
              'Search Restaurant'
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        {error && (
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h3>Restaurant Not Found</h3>
            <p>{error}</p>
            <div className="error-suggestions">
              <p>Try:</p>
              <ul>
                <li>Double-checking the Restaurant ID</li>
                <li>Using a different ID number</li>
                <li>Browsing all restaurants from the home page</li>
              </ul>
            </div>
          </div>
        )}

        {singleRestaurant && (
          <div className="restaurant-result-card">
            <div className="restaurant-image-section">
              <img 
                src={singleRestaurant.featured_image || '/api/placeholder/400/300'} 
                alt={singleRestaurant['Restaurant Name']}
                className="restaurant-image"
              />
              <div className="restaurant-badge">
                <span className="restaurant-id-badge">ID: {singleRestaurant['Restaurant ID']}</span>
              </div>
            </div>

            <div className="restaurant-info-section">
              <div className="restaurant-header">
                <h2 className="restaurant-name">{singleRestaurant['Restaurant Name']}</h2>
                <div className="rating-section">
                  {renderStars(singleRestaurant['Aggregate rating'])}
                  <span className="rating-value">({singleRestaurant['Aggregate rating']}/5)</span>
                  <span className="rating-text">{singleRestaurant['Rating text']}</span>
                </div>
              </div>

              <div className="restaurant-details">
                <div className="detail-item">
                  <span className="detail-icon">🍽️</span>
                  <span className="detail-label">Cuisines:</span>
                  <span className="detail-value">{singleRestaurant['Cuisines']}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{singleRestaurant['Address']}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">🏙️</span>
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{singleRestaurant.City}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">💰</span>
                  <span className="detail-label">Cost for Two:</span>
                  <span className="detail-value price">
                    {singleRestaurant.Currency} {singleRestaurant['Average Cost for two']}
                  </span>
                </div>

                <div className="services-section">
                  <div className="service-item">
                    <span className={`service-badge ${singleRestaurant['Has Table booking'] === 'Yes' ? 'available' : 'unavailable'}`}>
                      {singleRestaurant['Has Table booking'] === 'Yes' ? '✓' : '✕'} Table Booking
                    </span>
                  </div>
                  <div className="service-item">
                    <span className={`service-badge ${singleRestaurant['Has Online delivery'] === 'Yes' ? 'available' : 'unavailable'}`}>
                      {singleRestaurant['Has Online delivery'] === 'Yes' ? '✓' : '✕'} Online Delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button onClick={handleViewDetails} className="view-details-btn">
                  View Full Details
                </button>
                {singleRestaurant.url && (
                  <a 
                    href={singleRestaurant.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="external-link-btn"
                  >
                    View on Zomato
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      
        {searched && !singleRestaurant && !error && (
          <div className="no-results-card">
            <div className="no-results-icon">🔍</div>
            <h3>Search Complete</h3>
            <p>No restaurant found with ID: {restaurantId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantById;