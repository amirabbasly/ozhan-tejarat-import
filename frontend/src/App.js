import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AddCottage from './pages/AddCottage';
import CottageListPage from './pages/CottageListPage';
import Navbar from './components/Navbar';
import ImportProforma from './pages/ImportPrf';
import CustomsDeclarationList from './components/CustomsDeclarationList';
import CustomsDeclarationDetails from './components/CustomsDeclarationDetails';
import CottageDetails from './pages/CottageDetails';
import Login from './components/login';

import { Provider } from 'react-redux';
import store from './store'; // Import the store you created
import './App.css';

function App() {
  return (
    <Router>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </Router>
  );
}

// Separate AppContent to use useLocation
function AppContent() {
  const location = useLocation();

  // List of paths where the Navbar should not be displayed
  const noNavbarRoutes = ['/login'];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-cottage" element={<AddCottage />} />
          <Route path="/cottages" element={<CottageListPage />} />
          <Route path="/import-prf" element={<ImportProforma />} />
          <Route path="/declarations/:FullSerialNumber" element={<CustomsDeclarationDetails />} />
          <Route path="/decl" element={<CustomsDeclarationList />} />
          <Route path="/cottages/:cottageNumber" element={<CottageDetails />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
