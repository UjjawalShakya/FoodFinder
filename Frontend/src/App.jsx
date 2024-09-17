import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import AllRestaurants from './AllRestaurants';
import RestaurantById from './RestaurantById';
import SearchNearby from './SearchNearby';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<AllRestaurants />} />
          <Route path="/restaurant-by-id" element={<RestaurantById />} />
          <Route path="/search-nearby" element={<SearchNearby />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;