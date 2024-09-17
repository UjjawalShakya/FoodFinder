const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const geolib=require('geolib');
const restaurantRoutes = require('./routes/restaurantRoutes.js'); // Ensure this path is correct

const app = express();
app.use(bodyParser.json());
const password = encodeURIComponent("@Shakya123");
// const cluster = "cluster0.06bk8.mongodb.net";
// const dbName = "restaurants";
// Connect to MongoDB
mongoose.connect(`mongodb+srv://ujjawal7668:${password}@cluster0.uiri8.mongodb.net/zomato?retryWrites=true&w=majority&appName=Cluster0`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB successfully');
});
// Use the restaurant routes
app.use('/api', restaurantRoutes); // Ensure restaurantRoutes is a valid router

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});