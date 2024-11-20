import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddCottage from './pages/AddCottage';
import CottageListPage from './pages/CottageListPage';
import Navbar from './components/Navbar';
import ImportProforma from './pages/ImportPrf';
import CustomsDeclarationList from './components/CustomsDeclarationList';
import './App.css';

function App() {
  return (
    
    <Router>

<Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-cottage" element={<AddCottage />} />
            <Route path="/cottages" element={<CottageListPage />} />
            <Route path="/import-prf" element={<ImportProforma />} />
            <Route path="/decl" element={<CustomsDeclarationList />} />
          </Routes>
        </main>

    </Router>
  );
}

export default App;
