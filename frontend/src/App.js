import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddCottage from './pages/AddCottage';
import CottageListPage from './pages/CottageListPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    
    <Router>


        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-cottage" element={<AddCottage />} />
            <Route path="/cottages" element={<CottageListPage />} />
          </Routes>
        </main>

    </Router>
  );
}

export default App;
