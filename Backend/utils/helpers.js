const geolib = require("geolib");
const multer = require('multer');

// Calculates Distance between two geographical coordinates using the Haversine formula
function haversineDistance(coords1, coords2) {
  return geolib.getDistance(
    { latitude: coords1.lat, longitude: coords1.lng },
    { latitude: coords2.lat, longitude: coords2.lng }
  );
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Helper function to parse Gemini response into structured data
function parseGeminiResponse(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  let cuisine = 'Unknown';
  let confidence = 'Medium';

  // Try to extract structured information
  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (lower.includes('cuisine') && lower.includes(':')) {
      cuisine = line.split(':')[1]?.trim() || cuisine;
    }
  });

  if (cuisine.length > 3) {
    cuisine = cuisine.substring(3).trim();
  }
//   // If structured parsing fails, use the full text as description
//   if (cuisine === 'Unknown') {
//     // Try to identify cuisine from common keywords
//     const cuisineKeywords = {
//       'italian': ['pasta', 'pizza', 'risotto', 'marinara', 'parmesan'],
//       'chinese': ['noodles', 'rice', 'stir fry', 'dumpling', 'wok'],
//       'indian': ['curry', 'naan', 'biryani', 'masala', 'tikka'],
//       'mexican': ['taco', 'burrito', 'salsa', 'guacamole', 'quesadilla'],
//       'japanese': ['sushi', 'ramen', 'tempura', 'miso', 'sake'],
//       'thai': ['pad thai', 'tom yum', 'green curry', 'coconut'],
//       'french': ['croissant', 'baguette', 'coq au vin', 'ratatouille'],
//     };

//     for (const [cuisineType, keywords] of Object.entries(cuisineKeywords)) {
//       if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
//         cuisine = cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1);
//         break;
//       }
//     }
//   }

  return {
    cuisine,
    confidence,
    fullAnalysis: text
  };
}

module.exports = {
  haversineDistance,
  upload,
  parseGeminiResponse
};