import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/add-cottage">Add Cottage</Link> | 
        <Link to="/cottages">View Cottages</Link>
        </nav>

    </div>
  );
};

export default Home;
