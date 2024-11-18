import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddCottage from './pages/AddCottage';
import CottageListPage from './pages/CottageListPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Cottage Management System</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-cottage" element={<AddCottage />} />
            <Route path="/cottages" element={<CottageListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
