import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faCog, faFileAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className='nacbar-container-cont'>
    <div className="navbar-container">
      <ul className="navbar">
        {/* Home */}
        <li className="nav-item">
        <Link to="/" className="nav-link">
          <FontAwesomeIcon icon={faHome} className="nav-icon" />
          <span>صفحه اصلی</span>
          </Link>
        </li>

        {/* Documents */}
        <li className="nav-item">
            
          <FontAwesomeIcon icon={faFileAlt} className="nav-icon" />
          <span>اسناد</span>
        </li>

        {/* Settings */}
        <li className="nav-item">
          <FontAwesomeIcon icon={faCog} className="nav-icon" />
          <span>تنظیمات</span>
        </li> </ul>
</div>
<div className="navbar-container2">


        {/* User */}
        <li className="nav-item-left">
          <FontAwesomeIcon icon={faUser} className="nav-icon" />
          <span>کاربر</span>
        </li>
        {/* Notifications */}
        <li className="nav-item-left">
          <FontAwesomeIcon icon={faBell} className="nav-icon" />
          <span>0</span>
        </li>

     </div>
    </div>
  );
};

export default Navbar;
