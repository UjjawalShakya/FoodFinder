// Frontend/src/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const navigate = useNavigate();

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Store uploaded image for preview
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3000/api/analyze-food', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      setAnalysisResult(result.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to analyze image. Please try again.');
      setUploadedImage(null);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setAnalysisResult(null);
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
      setUploadedImage(null);
    }
  };

  const handleFindRestaurants = () => {
    if (analysisResult?.cuisine) {
      navigate(`/restaurants/cuisine/${encodeURIComponent(analysisResult.cuisine)}`);
      closeModal();
    }
  };

  const getConfidenceClass = (confidence) => {
    if (confidence?.toLowerCase().includes('high')) return 'High';
    if (confidence?.toLowerCase().includes('medium')) return 'Medium';
    return 'Low';
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h2>🍽️ Zomato</h2>
          </div>
          <ul className="navbar-menu">
            <li><a href="/">Home</a></li>
            <li><a href="/search-nearby">Search Nearby</a></li>
            <li><a href="/restaurant-by-id">Find by ID</a></li>
            <li>
              <label 
                htmlFor="photo-upload" 
                className={`photo-upload-btn ${isUploading ? 'uploading' : ''}`}
              >
                {isUploading ? (
                  <>
                    <div className="upload-spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    📸 Identify Food
                  </>
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
            </li>
          </ul>
        </div>
      </nav>

      {/* Enhanced Analysis Results Modal */}
      {showModal && analysisResult && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>🍽️ Food Analysis Results</h2>
            
            {/* Image Preview */}
            {uploadedImage && (
              <div className="image-preview-section">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded food" 
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '3px solid #e2e8f0'
                  }}
                />
              </div>
            )}
            
            <div className="analysis-section">
              <h3>🥘 Identified Cuisine</h3>
              <p className="cuisine-result">{analysisResult.cuisine || 'Unable to identify'}</p>
            </div>

            {analysisResult.foodItems && (
              <div className="analysis-section">
                <h3>🍽️ Identified Dishes</h3>
                <div style={{ 
                  background: 'white', 
                  padding: '12px 16px', 
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0'
                }}>
                  <p style={{ margin: 0, color: '#475569', lineHeight: '1.6' }}>
                    {analysisResult.foodItems}
                  </p>
                </div>
              </div>
            )}

            {/* <div className="analysis-section">
              <h3>🎯 Confidence Level</h3>
              <p 
                className="confidence-result" 
                data-confidence={getConfidenceClass(analysisResult.confidence)}
              >
                {analysisResult.confidence || 'Medium'}
              </p>
            </div> */}

            <div className="modal-actions">
              <button 
                className="find-restaurants-btn"
                onClick={handleFindRestaurants}
                disabled={!analysisResult.cuisine}
              >
                🔍 Find {analysisResult.cuisine} Restaurants
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;