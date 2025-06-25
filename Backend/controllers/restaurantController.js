const Restaurant = require("../models/Restaurants");
const { haversineDistance } = require('../utils/helpers');

/**
 * Get restaurant by ID
 */
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      "Restaurant ID": req.params.id,
    });
    
    if (!restaurant) {
      return res.status(404).json({ 
        success: false,
        message: "Restaurant not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get list of restaurants with pagination
 */
const getAllRestaurants = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  try {
    const restaurants = await Restaurant.find()
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));
    
    const totalRestaurants = await Restaurant.countDocuments();
    const totalPages = Math.ceil(totalRestaurants / parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: restaurants,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRestaurants,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get restaurants near given coordinates within radius
 */
const getNearbyRestaurants = async (req, res) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({
      success: false,
      message: "Please provide latitude, longitude, and radius"
    });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const radiusInMeters = parseFloat(radius) * 1000;

  try {
    const allRestaurants = await Restaurant.find();

    const restaurantsWithinRadius = allRestaurants.filter((restaurant) => {
      if (!restaurant.Latitude || !restaurant.Longitude) return false;

      const restaurantCoords = {
        lat: parseFloat(restaurant.Latitude),
        lng: parseFloat(restaurant.Longitude),
      };

      const distance = haversineDistance(
        { lat: latitude, lng: longitude },
        restaurantCoords
      );

      return distance <= radiusInMeters;
    });

    if (restaurantsWithinRadius.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No restaurants found within this range",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      data: restaurantsWithinRadius,
      searchParams: {
        latitude,
        longitude,
        radiusKm: radius,
        resultsCount: restaurantsWithinRadius.length
      }
    });
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Get restaurants by cuisine type
 */
const getRestaurantsByCuisine = async (req, res) => {
  const { cuisine } = req.params;
  const { page = 1, limit = 12 } = req.query;

  if (!cuisine) {
    return res.status(400).json({
      success: false,
      message: "Cuisine parameter is required"
    });
  }

  try {
    // Create case-insensitive regex for cuisine search
    const cuisineRegex = new RegExp(cuisine.trim(), 'i');
    
    // Find restaurants with matching cuisine
    const restaurantsQuery = Restaurant.find({
      'Cuisines': { $regex: cuisineRegex }
    });

    // Get total count for pagination
    const totalRestaurants = await Restaurant.countDocuments({
      'Cuisines': { $regex: cuisineRegex }
    });

    // Apply pagination
    const restaurants = await restaurantsQuery
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select({
        'Restaurant ID': 1,
        'Restaurant Name': 1,
        'Cuisines': 1,
        'City': 1,
        'Locality': 1,
        'Average Cost for two': 1,
        'Currency': 1,
        'Aggregate rating': 1,
        'Rating text': 1,
        'featured_image': 1,
        'Has Online delivery': 1,
        'Has Table booking': 1
      });

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No restaurants found serving ${cuisine} cuisine`,
        data: []
      });
    }

    const totalPages = Math.ceil(totalRestaurants / parseInt(limit));

    res.status(200).json({
      success: true,
      data: restaurants,
      searchParams: {
        cuisine: cuisine,
        totalResults: totalRestaurants
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRestaurants,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching restaurants by cuisine:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getRestaurantById,
  getAllRestaurants,
  getNearbyRestaurants,
  getRestaurantsByCuisine
};