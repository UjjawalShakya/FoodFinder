import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'https://food-finder-xv2a.onrender.com/api';

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/restaurant/${id}`);
      if (!response.ok) {
        throw new Error('Restaurant not found');
      }
      const result = await response.json();
      setRestaurant(result.data || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return <span className="stars">{stars}</span>;
  };

  const formatCurrency = (amount, currency) => {
    return currency ? `${currency} ${amount}` : amount;
  };

  const getStatusIndicator = (status) => {
    const isAvailable = status === 'Yes';
    return (
      <span className={`status-indicator ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
        <span>{isAvailable ? '✓' : '✕'}</span>
        {isAvailable ? 'Available' : 'Not Available'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Loading restaurant details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h3>⚠️ Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="error">
        <h3>🔍 Restaurant not found</h3>
        <p>The restaurant you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="restaurant-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Results
      </button>
      
      {/* Hero Section */}
      <div className="restaurant-hero-card">
        <div className="restaurant-hero-content">
          <div className="restaurant-image-section">
            <img 
              src={restaurant.featured_image || '/api/placeholder/400/400'} 
              alt={restaurant['Restaurant Name']} 
            />
            <div className="image-overlay">
              <div className="location-quick-info">
                📍 {restaurant.City}, {restaurant.Locality}
              </div>
            </div>
          </div>
          <div className="restaurant-main-info">
            <h1 className="restaurant-title">{restaurant['Restaurant Name']}</h1>
            <p className="restaurant-subtitle">{restaurant['Cuisines']}</p>
            
            <div className="rating-section">
              <div className="rating-badge">
                {renderStars(restaurant['Aggregate rating'])}
                <span className="rating-text">{restaurant['Aggregate rating']}/5</span>
              </div>
              <div className="rating-description">
                {restaurant['Rating text']}
              </div>
            </div>
            
            <div className="location-quick-info">
              📍 {restaurant['Address']}
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="details-grid">
        
        {/* Location Information */}
        <div className="detail-card">
          <div className="card-header">
            <div className="card-icon">📍</div>
            <h3 className="card-title">Location Details</h3>
          </div>
          <div className="detail-row">
            <span className="detail-label">City</span>
            <span className="detail-value">{restaurant.City}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Locality</span>
            <span className="detail-value">{restaurant.Locality}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address</span>
            <span className="detail-value">{restaurant.Address}</span>
          </div>
          {/* <div className="detail-row">
            <span className="detail-label">Coordinates</span>
            <span className="detail-value coordinates-text">
              {restaurant.Latitude}, {restaurant.Longitude}
            </span>
          </div> */}
        </div>

        {/* Pricing Information */}
        <div className="detail-card">
          <div className="card-header">
            <div className="card-icon">💰</div>
            <h3 className="card-title">Pricing & Cost</h3>
          </div>
          <div className="detail-row">
            <span className="detail-label">Average Cost for Two</span>
            <span className="detail-value price-highlight">
              {formatCurrency(restaurant['Average Cost for two'], restaurant.Currency)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Price Range</span>
            <span className="detail-value">
              {'💰'.repeat(restaurant['Price range'])} ({restaurant['Price range']}/5)
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Currency</span>
            <span className="detail-value">{restaurant.Currency}</span>
          </div>
        </div>

        {/* Services & Features */}
        <div className="detail-card">
          <div className="card-header">
            <div className="card-icon">🛎️</div>
            <h3 className="card-title">Services & Features</h3>
          </div>
          <div className="detail-row">
            <span className="detail-label">Table Booking</span>
            <span className="detail-value">
              {getStatusIndicator(restaurant['Has Table booking'])}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Online Delivery</span>
            <span className="detail-value">
              {getStatusIndicator(restaurant['Has Online delivery'])}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Currently Delivering</span>
            <span className="detail-value">
              {getStatusIndicator(restaurant['Is delivering now'])}
            </span>
          </div>
        </div>

        {/* Ratings & Reviews */}
        <div className="detail-card">
          <div className="card-header">
            <div className="card-icon">⭐</div>
            <h3 className="card-title">Ratings & Reviews</h3>
          </div>
          <div className="detail-row">
            <span className="detail-label">Overall Rating</span>
            <span className="detail-value">
              {renderStars(restaurant['Aggregate rating'])} {restaurant['Aggregate rating']}/5
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Rating Category</span>
            <span className="detail-value">{restaurant['Rating text']}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Votes</span>
            <span className="detail-value">{restaurant.Votes?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>

        {/* Quick Actions */}
        {(restaurant.url || restaurant.menu_url || restaurant.book_url || restaurant.photos_url) && (
          <div className="detail-card actions-card">
            <div className="card-header">
              <div className="card-icon">🔗</div>
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="actions-grid">
              {restaurant.url && (
                <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="action-button">
                  🌐 View on Zomato
                </a>
              )}
              {restaurant.menu_url && (
                <a href={restaurant.menu_url} target="_blank" rel="noopener noreferrer" className="action-button">
                  📋 View Menu
                </a>
              )}
              {restaurant.book_url && (
                <a href={restaurant.book_url} target="_blank" rel="noopener noreferrer" className="action-button">
                  📅 Book Table
                </a>
              )}
              {restaurant.photos_url && (
                <a href={restaurant.photos_url} target="_blank" rel="noopener noreferrer" className="action-button">
                  📸 View Photos
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RestaurantDetails;