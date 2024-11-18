import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import "./Home.css"
const Home = () => {
  return (
    <div className='home'>
        <Navbar />
    <div className="home-container">
   
       <div className='shortcut settings' >
        <Link className='shortlinks' to="/">تنظیمات</Link> 
</div>
<div className='shortcut finance' >
        <Link className='shortlinks' to="/add-cottage">مالی</Link> 
        </div>
        <div className='shortcut documents' >
        <Link className='shortlinks' to="/cottages">همه اسناد</Link>
        </div>
       

    </div>
    </div>
  );
};

export default Home;
