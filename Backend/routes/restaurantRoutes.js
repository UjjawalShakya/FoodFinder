const express = require("express");
const router = express.Router();
const { upload } = require('../utils/helpers');

// Import controllers
const restaurantController = require('../controllers/restaurantController');
const foodAnalysisController = require('../controllers/foodAnalysisController');

// Restaurant routes
router.get("/restaurant/:id", restaurantController.getRestaurantById);
router.get("/restaurants", restaurantController.getAllRestaurants);
router.get("/restaurants/near", restaurantController.getNearbyRestaurants);
router.get("/restaurants/cuisine/:cuisine", restaurantController.getRestaurantsByCuisine);

// Food analysis routes
router.post('/analyze-food', upload.single('image'), foodAnalysisController.analyzeFoodImage);

module.exports = router;