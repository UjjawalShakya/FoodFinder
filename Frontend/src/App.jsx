import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import AllRestaurants from './AllRestaurants';
import RestaurantById from './RestaurantById';
import SearchNearby from './SearchNearby';
import RestaurantDetails from './RestaurantDetails';
import RestaurantsByCuisine from './RestaurantsByCuisine';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<AllRestaurants />} />
          <Route path="/restaurant-by-id" element={<RestaurantById />} />
          <Route path="/search-nearby" element={<SearchNearby />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/restaurants/cuisine/:cuisine" element={<RestaurantsByCuisine />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;