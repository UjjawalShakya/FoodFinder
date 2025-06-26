require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const restaurantRoutes = require('./routes/restaurantRoutes.js');

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: "https://food-finder-sandy.vercel.app/",
  credentials: true
};

app.use(cors(corsOptions));

const password = encodeURIComponent("@Shakya123");

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

// Routes
app.use('/api', restaurantRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});