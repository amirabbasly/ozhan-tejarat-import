  import React, {useState} from 'react';
  import { Link } from 'react-router-dom';
  import './Navbar.css';

  const Navbar = () => {
    const [showSubmenu, setShowSubmenu] = useState({
      asnad: false,
      tanzimat: false,
      karbar: false,
      notifications: false,
    });
  
    const [showMenu, setShowMenu] = useState(false);
  
    const handleMouseEnter = (menu) => {
      setShowSubmenu((prevState) => ({ ...prevState, [menu]: true }));
    };
  
    const handleMouseLeave = (menu) => {
      setShowSubmenu((prevState) => ({ ...prevState, [menu]: false }));
    };
  
    const toggleMenu = () => {
      setShowMenu((prev) => !prev);
    };
  
    const closeMenu = () => {
      setShowMenu(false);
    };

    return (
      <>
          {/* Navbar Header with Hamburger Button for Mobile View */}
          <div className="navbar-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          {/* Hamburger Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className='nacbar-container-cont'>
      <div className="navbar-container">
        <ul className="navbar">
          {/* Home */}
          <Link to="/" className="nav-item nav-link">
        
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M9 16C9.85 16.63 10.885 17 12 17C13.115 17 14.15 16.63 15 16" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M22 12.204V13.725C22 17.625 22 19.576 20.828 20.788C19.656 22 17.771 22 14 22H10C6.229 22 4.343 22 3.172 20.788C2.001 19.576 2 17.626 2 13.725V12.204C2 9.915 2 8.771 2.52 7.823C3.038 6.874 3.987 6.286 5.884 5.108L7.884 3.867C9.889 2.622 10.892 2 12 2C13.108 2 14.11 2.622 16.116 3.867L18.116 5.108C20.013 6.286 20.962 6.874 21.481 7.823" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round"/>
</svg>
            <span>صفحه اصلی</span>
            
          </Link>

      {/* Documents */}
      <li
              className="nav-item"
              onMouseEnter={() => handleMouseEnter('asnad')}
              onMouseLeave={() => handleMouseLeave('asnad')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M18.18 8.04L18.643 7.576C19.0116 7.20722 19.5117 6.99999 20.0331 6.99989C20.5546 6.9998 21.0547 7.20685 21.4235 7.5755C21.7923 7.94415 21.9995 8.44421 21.9996 8.96565C21.9997 9.4871 21.7926 9.98722 21.424 10.356L20.961 10.82M18.18 8.04C18.18 8.04 18.238 9.024 19.107 9.893C19.976 10.762 20.961 10.82 20.961 10.82M18.18 8.04L13.92 12.3C13.63 12.588 13.486 12.733 13.362 12.892C13.2153 13.08 13.0906 13.282 12.988 13.498C12.901 13.68 12.837 13.873 12.708 14.26L12.295 15.5L12.161 15.901M20.961 10.82L16.701 15.08C16.411 15.37 16.267 15.514 16.108 15.638C15.92 15.7847 15.718 15.9093 15.502 16.012C15.32 16.099 15.127 16.163 14.74 16.292L13.5 16.705L13.099 16.839M12.161 15.901L12.028 16.303C11.997 16.3963 11.9926 16.4964 12.0152 16.5921C12.0379 16.6878 12.0867 16.7752 12.1562 16.8448C12.2257 16.9143 12.3132 16.9631 12.4089 16.9858C12.5046 17.0084 12.6047 17.004 12.698 16.973L13.099 16.839M12.161 15.901L13.099 16.839" stroke="#6B6B6B" stroke-width="1.5"/>
  <path d="M8 13H10.5M8 9H14.5M8 17H9.5M3 14V10C3 6.229 3 4.343 4.172 3.172C5.344 2.001 7.229 2 11 2H13C16.771 2 18.657 2 19.828 3.172M21 14C21 17.771 21 19.657 19.828 20.828M19.828 20.828C18.657 22 16.771 22 13 22H11C7.229 22 5.343 22 4.172 20.828M19.828 20.828C20.772 19.885 20.955 18.48 20.991 16" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round"/>
</svg>
              <span>اسناد</span>

              {/* Submenu for Documents */}
              {showSubmenu.asnad && (
                <ul className="submenu">
                <Link className='submenu-link' to="/add-cottage"> 
                  <li className="submenu-item">
                    افزودن کوتاژ 
                  </li></Link>
                <Link  className='submenu-link' to="/cottages">
                  <li className="submenu-item">
                     کوتاژ ها 
                  </li></Link>
                  <Link className='submenu-link' to="/import-prf">
                  <li className="submenu-item">
                     دریافت پرفورم
                  </li></Link>
                  <Link className='submenu-link' to="/decl">
                  <li className="submenu-item">
                     دریافت کوتاژ
                  </li></Link>
                </ul>
              )}
            </li>

            {/* Settings */}
            <li
              className="nav-item"
              onMouseEnter={() => handleMouseEnter('tanzimat')}
              onMouseLeave={() => handleMouseLeave('tanzimat')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#6B6B6B" stroke-width="1.5"/>
  <path d="M3.66099 10.64C4.13399 10.936 4.43799 11.442 4.43799 12C4.43799 12.558 4.13399 13.064 3.66099 13.36C3.33999 13.563 3.13199 13.724 2.98499 13.916C2.82508 14.1244 2.70781 14.3623 2.63986 14.6161C2.57191 14.8699 2.55463 15.1345 2.58899 15.395C2.64099 15.789 2.87399 16.193 3.33899 17C3.80599 17.807 4.03899 18.21 4.35399 18.453C4.56243 18.6129 4.80033 18.7302 5.0541 18.7981C5.30787 18.8661 5.57254 18.8834 5.83299 18.849C6.07299 18.817 6.31599 18.719 6.65199 18.541C6.89254 18.4097 7.16247 18.3415 7.43652 18.3429C7.71058 18.3443 7.9798 18.4152 8.21899 18.549C8.70199 18.829 8.98899 19.344 9.00899 19.902C9.02299 20.282 9.05899 20.542 9.15199 20.765C9.25251 21.0078 9.39989 21.2284 9.58572 21.4143C9.77154 21.6001 9.99217 21.7475 10.235 21.848C10.602 22 11.068 22 12 22C12.932 22 13.398 22 13.765 21.848C14.0078 21.7475 14.2284 21.6001 14.4143 21.4143C14.6001 21.2284 14.7475 21.0078 14.848 20.765C14.94 20.542 14.977 20.282 14.991 19.902C15.011 19.344 15.298 18.828 15.781 18.549C16.0202 18.4152 16.2894 18.3443 16.5635 18.3429C16.8375 18.3415 17.1074 18.4097 17.348 18.541C17.684 18.719 17.928 18.817 18.168 18.849C18.6937 18.9181 19.2253 18.7757 19.646 18.453C19.961 18.211 20.194 17.807 20.66 17C20.868 16.64 21.029 16.361 21.149 16.127M20.339 13.361C20.1051 13.2185 19.9111 13.019 19.7752 12.7811C19.6393 12.5433 19.566 12.2749 19.562 12.001C19.562 11.442 19.866 10.936 20.339 10.639C20.66 10.437 20.867 10.276 21.015 10.084C21.1749 9.87556 21.2922 9.63767 21.3601 9.38389C21.4281 9.13012 21.4454 8.86545 21.411 8.605C21.359 8.211 21.126 7.807 20.661 7C20.194 6.193 19.961 5.79 19.646 5.547C19.4376 5.38709 19.1997 5.26981 18.9459 5.20187C18.6921 5.13392 18.4274 5.11664 18.167 5.151C17.927 5.183 17.684 5.281 17.347 5.459C17.1066 5.59014 16.8368 5.6582 16.563 5.6568C16.2891 5.6554 16.0201 5.58459 15.781 5.451C15.5456 5.31069 15.3497 5.11298 15.2116 4.87635C15.0734 4.63973 14.9975 4.37193 14.991 4.098C14.977 3.718 14.941 3.458 14.848 3.235C14.7475 2.99218 14.6001 2.77155 14.4143 2.58572C14.2284 2.3999 14.0078 2.25251 13.765 2.152C13.398 2 12.932 2 12 2C11.068 2 10.602 2 10.235 2.152C9.99217 2.25251 9.77154 2.3999 9.58572 2.58572C9.39989 2.77155 9.25251 2.99218 9.15199 3.235C9.05999 3.458 9.02299 3.718 9.00899 4.098C9.00248 4.37193 8.9266 4.63973 8.78843 4.87635C8.65027 5.11298 8.45435 5.31069 8.21899 5.451C7.9798 5.58477 7.71058 5.65567 7.43652 5.65707C7.16247 5.65847 6.89254 5.59032 6.65199 5.459C6.31599 5.281 6.07199 5.183 5.83199 5.151C5.30631 5.08187 4.77469 5.22431 4.35399 5.547C4.03999 5.79 3.80599 6.193 3.33999 7C3.13199 7.36 2.97099 7.639 2.85099 7.873" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round"/>
</svg>
              <span>تنظیمات</span>

              {/* Submenu for Settings */}
              {showSubmenu.tanzimat && (
                <ul className="submenu">
                  <li className="submenu-item">
                    <Link to="/settings/profile">پروفایل</Link>
                  </li>
                  <li className="submenu-item">
                    <Link to="/settings/security">امنیت</Link>
                  </li>
                  <li className="submenu-item">
                    <Link to="/settings/preferences">ترجیحات</Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
  </div>
  <div className="navbar-container2">

    {/* User */}
    <li
            className="nav-item-left"
            onMouseEnter={() => handleMouseEnter('karbar')}
            onMouseLeave={() => handleMouseLeave('karbar')}
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
  <path d="M26 21.6667C30.7865 21.6667 34.6667 17.7865 34.6667 13C34.6667 8.21353 30.7865 4.33333 26 4.33333C21.2136 4.33333 17.3334 8.21353 17.3334 13C17.3334 17.7865 21.2136 21.6667 26 21.6667Z" stroke="#6B6B6B" stroke-width="1.5"/>
  <path d="M43.329 39C43.3319 38.6447 43.3334 38.2835 43.3334 37.9167C43.3334 32.5325 35.5724 28.1667 26 28.1667C16.4277 28.1667 8.66669 32.5325 8.66669 37.9167C8.66669 43.3008 8.66669 47.6667 26 47.6667C30.8339 47.6667 34.32 47.3265 36.8334 46.7198" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round"/>
</svg>
            <span>کاربر</span>

            {/* Submenu for User */}
            {showSubmenu.karbar && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/user/profile">پروفایل من</Link>
                </li>
                <li className="submenu-item">
                  <Link to="/user/logout">خروج</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Notifications */}
          <li
            className="nav-item-left"
            onMouseEnter={() => handleMouseEnter('notifications')}
            onMouseLeave={() => handleMouseLeave('notifications')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
<path d="M25 12.5V20.8333M15.625 39.5833C16.9896 43.225 20.6708 45.8333 25 45.8333C25.5097 45.8333 26.0097 45.7986 26.5 45.7292M34.375 39.5833C33.8107 41.0705 32.8772 42.3897 31.6625 43.4167M18.9729 5.57083C20.8466 4.64383 22.9095 4.16323 25 4.16666C32.7646 4.16666 39.0625 10.7 39.0625 18.7604V20.2292C39.06 21.9824 39.5603 23.6996 40.5042 25.1771L42.8125 28.7687C44.9188 32.05 43.3104 36.5104 39.6458 37.5479C30.0702 40.2597 19.9298 40.2597 10.3542 37.5479C6.68959 36.5104 5.08126 32.05 7.18751 28.7708L9.49584 25.1771C10.4397 23.6996 10.94 21.9824 10.9375 20.2292V18.7604C10.9375 16.5229 11.4229 14.4021 12.2917 12.5062" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round"/>
</svg>
            <span>اعلان‌ها</span>

            {/* Submenu for Notifications */}
            {showSubmenu.notifications && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/notifications/all">مشاهده همه</Link>
                </li>
                <li className="submenu-item">
                  <Link to="/notifications/settings">تنظیمات اعلان‌ها</Link>
                </li>
              </ul>
            )}
          </li>
        </div>
      </div>
          {/* Overlay Menu for Mobile */}
          {showMenu && (
        <div className="overlay-menu">
          <button className="close-overlay" onClick={closeMenu}>
            &times;
          </button>
          <ul className="overlay-navbar">
            <li>
              <Link to="/" onClick={closeMenu}>
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link to="/asnad" onClick={closeMenu}>
                اسناد
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={closeMenu}>
                تنظیمات
              </Link>
            </li>
            <li>
              <Link to="/user/profile" onClick={closeMenu}>
                کاربر
              </Link>
            </li>
            <li>
              <Link to="/notifications" onClick={closeMenu}>
                اعلان‌ها
              </Link>
            </li>
          </ul>
        </div>
      )}
      </>
    );
  };

  export default Navbar;