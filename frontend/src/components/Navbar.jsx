// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../style/Navbar.css";
// import { logout } from "../actions/authActions";
// import { useDispatch, useSelector } from "react-redux";
// import NotificationsDropdown from "./NotificationsDropdown"; // Adjust path as needed
// import {
//   FaBell,
//   FaCog,
//   FaFileAlt,
//   FaHome,
//   FaRobot,
//   FaSignOutAlt,
//   FaTimes,
//   FaUser,
// } from "react-icons/fa";

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const [showSubSubmenu, setShowSubSubmenu] = useState({
//     "receive-order": false,
//   });
//   const role = user?.role;
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   const [showSubmenu, setShowSubmenu] = useState({
//     asnad: false,
//     tanzimat: false,
//     karbar: false,
//     notifications: false,
//   });

//   const [showMenu, setShowMenu] = useState(false);
//   const navigate = useNavigate();

//   const handleMouseEnter = (menu) => {
//     setShowSubmenu((prevState) => ({ ...prevState, [menu]: true }));
//   };

//   const handleMouseLeave = (menu) => {
//     setShowSubmenu((prevState) => ({ ...prevState, [menu]: false }));
//   };

//   const toggleMenu = () => {
//     setShowMenu((prev) => !prev);
//   };

//   const closeMenu = () => {
//     setShowMenu(false);
//   };
//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };
//   const handleSubmenuMouseEnter = (submenu) => {
//     setShowSubSubmenu((prevState) => ({ ...prevState, [submenu]: true }));
//   };

//   const handleSubmenuMouseLeave = (submenu) => {
//     setShowSubSubmenu((prevState) => ({ ...prevState, [submenu]: false }));
//   };

//   return (
//     <>
//       {/* Navbar Header with Hamburger Button for Mobile View */}
//       <div className="navbar-header">
//         <button className="menu-toggle " onClick={toggleMenu}>
//           {/* Hamburger Icon */}
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//           >
//             <path
//               d="M4 6H20M4 12H20M4 18H20"
//               stroke="#6B6B6B"
//               strokeWidth="2"
//               strokeLinecap="round"
//             />
//           </svg>
//         </button>
//       </div>
//       <div className="nacbar-container-cont">
//         <div className="navbar-container">
//           <ul className="navbar">
//             {/* Home */}
//             <Link to="/" className="nav-item nav-link">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <path
//                   d="M9 16C9.85 16.63 10.885 17 12 17C13.115 17 14.15 16.63 15 16"
//                   stroke="#6B6B6B"
//                   stroke-width="1.5"
//                   stroke-linecap="round"
//                 />
//                 <path
//                   d="M22 12.204V13.725C22 17.625 22 19.576 20.828 20.788C19.656 22 17.771 22 14 22H10C6.229 22 4.343 22 3.172 20.788C2.001 19.576 2 17.626 2 13.725V12.204C2 9.915 2 8.771 2.52 7.823C3.038 6.874 3.987 6.286 5.884 5.108L7.884 3.867C9.889 2.622 10.892 2 12 2C13.108 2 14.11 2.622 16.116 3.867L18.116 5.108C20.013 6.286 20.962 6.874 21.481 7.823"
//                   stroke="#6B6B6B"
//                   stroke-width="1.5"
//                   stroke-linecap="round"
//                 />
//               </svg>
//               <span>صفحه اصلی</span>
//             </Link>

//             {/* Documents */}
//             <li
//               className="nav-item"
//               onMouseEnter={() => handleMouseEnter("asnad")}
//               onMouseLeave={() => handleMouseLeave("asnad")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <path
//                   d="M18.18 8.04L18.643 7.576C19.0116 7.20722 19.5117 6.99999 20.0331 6.99989C20.5546 6.9998 21.0547 7.20685 21.4235 7.5755C21.7923 7.94415 21.9995 8.44421 21.9996 8.96565C21.9997 9.4871 21.7926 9.98722 21.424 10.356L20.961 10.82M18.18 8.04C18.18 8.04 18.238 9.024 19.107 9.893C19.976 10.762 20.961 10.82 20.961 10.82M18.18 8.04L13.92 12.3C13.63 12.588 13.486 12.733 13.362 12.892C13.2153 13.08 13.0906 13.282 12.988 13.498C12.901 13.68 12.837 13.873 12.708 14.26L12.295 15.5L12.161 15.901M20.961 10.82L16.701 15.08C16.411 15.37 16.267 15.514 16.108 15.638C15.92 15.7847 15.718 15.9093 15.502 16.012C15.32 16.099 15.127 16.163 14.74 16.292L13.5 16.705L13.099 16.839M12.161 15.901L12.028 16.303C11.997 16.3963 11.9926 16.4964 12.0152 16.5921C12.0379 16.6878 12.0867 16.7752 12.1562 16.8448C12.2257 16.9143 12.3132 16.9631 12.4089 16.9858C12.5046 17.0084 12.6047 17.004 12.698 16.973L13.099 16.839M12.161 15.901L13.099 16.839"
//                   stroke="#6B6B6B"
//                   stroke-width="1.5"
//                 />
//                 <path
//                   d="M8 13H10.5M8 9H14.5M8 17H9.5M3 14V10C3 6.229 3 4.343 4.172 3.172C5.344 2.001 7.229 2 11 2H13C16.771 2 18.657 2 19.828 3.172M21 14C21 17.771 21 19.657 19.828 20.828M19.828 20.828C18.657 22 16.771 22 13 22H11C7.229 22 5.343 22 4.172 20.828M19.828 20.828C20.772 19.885 20.955 18.48 20.991 16"
//                   stroke="#6B6B6B"
//                   stroke-width="1.5"
//                   stroke-linecap="round"
//                 />
//               </svg>
//               <span>اسناد</span>

//               {/* Submenu for Documents */}
//               {showSubmenu.asnad && (
//                 <ul className="submenu">
//                   <li
//                     className="submenu-item"
//                     onMouseEnter={() =>
//                       handleSubmenuMouseEnter("receive-order")
//                     }
//                     onMouseLeave={() =>
//                       handleSubmenuMouseLeave("receive-order")
//                     }
//                   >
//                     <span> ثبت سفارش ها</span>
//                     {/* Submenu within Submenu */}
//                     {showSubSubmenu["receive-order"] && (
//                       <ul className="sub-submenu">
//                         <Link className="submenu-link" to="/add-order">
//                           <li className="submenu-item">ایجاد ثبت سفارش</li>
//                         </Link>
//                         <Link className="submenu-link" to="/reged-orders">
//                           <li className="submenu-item">لیست ثبت سفارش ها</li>
//                         </Link>
//                         {role === "admin" && (
//                           <Link className="submenu-link" to="/import-prf">
//                             <li className="submenu-item">دریافت از سامانه</li>
//                           </Link>
//                         )}
//                       </ul>
//                     )}
//                   </li>
//                   <li
//                     className="submenu-item"
//                     onMouseEnter={() =>
//                       handleSubmenuMouseEnter("receive-order")
//                     }
//                     onMouseLeave={() =>
//                       handleSubmenuMouseLeave("receive-order")
//                     }
//                   >
//                     <span>اظهارنامه ها</span>
//                     {/* Submenu within Submenu */}
//                     {showSubSubmenu["receive-order"] && (
//                       <ul className="sub-submenu">
//                         <Link className="submenu-link" to="/expense-list">
//                           <li className="submenu-item">لیست هزینه ها</li>
//                         </Link>
//                         <Link className="submenu-link" to="/cottages">
//                           <li className="submenu-item">لیست اظهارنامه ها</li>
//                         </Link>
//                         <Link className="submenu-link" to="/cottage-goods-list">
//                           <li className="submenu-item">لیست کلی کالا ها</li>
//                         </Link>
//                         {role === "admin" && (
//                           <Link className="submenu-link" to="/decl">
//                             <li className="submenu-item">دریافت از سامانه</li>
//                           </Link>
//                         )}
//                       </ul>
//                     )}
//                   </li>
//                   <li
//                     className="submenu-item"
//                     onMouseEnter={() =>
//                       handleSubmenuMouseEnter("receive-order")
//                     }
//                     onMouseLeave={() =>
//                       handleSubmenuMouseLeave("receive-order")
//                     }
//                   >
//                     <span>اظهارنامه های صادراتی</span>
//                     {/* Submenu within Submenu */}
//                     {showSubSubmenu["receive-order"] && (
//                       <ul className="sub-submenu">
//                         <Link className="submenu-link" to="/add-export">
//                           <li className="submenu-item">ایجاد اظهارنمه</li>
//                         </Link>
//                         <Link className="submenu-link" to="/export-cottages">
//                           <li className="submenu-item">لیست اظهارنامه ها</li>
//                         </Link>
//                         {role === "admin" && (
//                           <Link className="submenu-link" to="/export-decl">
//                             <li className="submenu-item">دریافت از سامانه</li>
//                           </Link>
//                         )}
//                       </ul>
//                     )}
//                   </li>
//                   <li
//                     className="submenu-item"
//                     onMouseEnter={() =>
//                       handleSubmenuMouseEnter("receive-order")
//                     }
//                     onMouseLeave={() =>
//                       handleSubmenuMouseLeave("receive-order")
//                     }
//                   >
//                     <span>چک ها</span>
//                     {/* Submenu within Submenu */}
//                     {showSubSubmenu["receive-order"] && (
//                       <ul className="sub-submenu">
//                         <Link className="submenu-link" to="/add-check">
//                           <li className="submenu-item">ایجاد چک جدید</li>
//                         </Link>
//                         <Link className="submenu-link" to="/checks">
//                           <li className="submenu-item">لیست چک ها</li>
//                         </Link>
//                         <Link className="submenu-link" to="/check-from-excel">
//                           <li className="submenu-item">ورود چک</li>
//                         </Link>
//                       </ul>
//                     )}
//                   </li>
//                   <li
//                     className="submenu-item"
//                     onMouseEnter={() =>
//                       handleSubmenuMouseEnter("receive-order")
//                     }
//                     onMouseLeave={() =>
//                       handleSubmenuMouseLeave("receive-order")
//                     }
//                   >
//                     <span>وکالت نامه ها</span>
//                     {/* Submenu within Submenu */}
//                     {showSubSubmenu["receive-order"] && (
//                       <ul className="sub-submenu">
//                         <Link className="submenu-link" to="/add-representation">
//                           <li className="submenu-item">ایجاد وکالتنامه</li>
//                         </Link>
//                         <Link className="submenu-link" to="/representations">
//                           <li className="submenu-item">لیست وکالتنامه ها</li>
//                         </Link>
//                         <Link className="submenu-link" to="/rep-from-excel">
//                           <li className="submenu-item">ورود وکالتنامه</li>
//                         </Link>
//                       </ul>
//                     )}
//                   </li>
//                   <li
//                     className="submenu-item"
//                     onMouseEnter={() =>
//                       handleSubmenuMouseEnter("receive-order")
//                     }
//                     onMouseLeave={() =>
//                       handleSubmenuMouseLeave("receive-order")
//                     }
//                   >
//                     <span>صدور اسناد</span>
//                     {/* Submenu within Submenu */}
//                     {showSubSubmenu["receive-order"] && (
//                       <ul className="sub-submenu">
//                         <Link className="submenu-link" to="/invoices/new">
//                           <li className="submenu-item">
//                             ایجاد اینوویس/پکینگ/گواهی مبدا
//                           </li>
//                         </Link>
//                         <Link className="submenu-link" to="/invoices/list">
//                           <li className="submenu-item">
//                             لیست اینوویس/پکینگ/گواهی مبدا
//                           </li>
//                         </Link>
//                         <Link
//                           className="submenu-link"
//                           to="/proforma-invoices/new"
//                         >
//                           <li className="submenu-item">ایجاد پروفورما</li>
//                         </Link>
//                         <Link
//                           className="submenu-link"
//                           to="/proforma-invoices/list"
//                         >
//                           <li className="submenu-item">لیست پروفورما</li>
//                         </Link>
//                       </ul>
//                     )}
//                   </li>
//                   <li
//                     className="submenu-item"
//                     onMouseEnter={() =>
//                       handleSubmenuMouseEnter("receive-order")
//                     }
//                     onMouseLeave={() =>
//                       handleSubmenuMouseLeave("receive-order")
//                     }
//                   >
//                     <span>طرفین</span>
//                     {/* Submenu within Submenu */}
//                     {showSubSubmenu["receive-order"] && (
//                       <ul className="sub-submenu">
//                         <Link className="submenu-link" to="/sellers/new">
//                           <li className="submenu-item">ایجاد فروشنده</li>
//                         </Link>
//                         <Link className="submenu-link" to="/sellers/list">
//                           <li className="submenu-item">لیست فروشنده ها</li>
//                         </Link>
//                         <Link className="submenu-link" to="/buyers/new">
//                           <li className="submenu-item">ایجاد خریدار</li>
//                         </Link>
//                         <Link className="submenu-link" to="/buyers/list">
//                           <li className="submenu-item">لیست خریدار ها</li>
//                         </Link>
//                         <Link className="submenu-link" to="/customers/new">
//                           <li className="submenu-item">ایجاد شخص جدید</li>
//                         </Link>
//                         <Link className="submenu-link" to="/customers/list">
//                           <li className="submenu-item">لیست اشخاص</li>
//                         </Link>
//                       </ul>
//                     )}
//                   </li>
//                   {/*
//                   <Link className='submenu-link' to="/chatbot">
//                   <li className="submenu-item">
//                      مشاور هوش مصنوعی
//                   </li></Link>*/}
//                 </ul>
//               )}
//             </li>

//             {/* Settings */}
//             <li
//               className="nav-item"
//               onMouseEnter={() => handleMouseEnter("tanzimat")}
//               onMouseLeave={() => handleMouseLeave("tanzimat")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <g clip-path="url(#clip0_517_2)">
//                   <path
//                     d="M13.0125 4.9995C12.9845 4.94228 12.9715 4.87884 12.9747 4.8152C12.978 4.75155 12.9975 4.6898 13.0312 4.63575C13.065 4.58171 13.112 4.53717 13.1678 4.50633C13.2236 4.47549 13.2863 4.45938 13.35 4.4595H18.375C18.4745 4.4595 18.5698 4.49901 18.6402 4.56934C18.7105 4.63967 18.75 4.73505 18.75 4.8345V6.375C18.75 6.47446 18.7105 6.56984 18.6402 6.64017C18.5698 6.7105 18.4745 6.75 18.375 6.75H12.375C12.2755 6.75 12.1802 6.7105 12.1098 6.64017C12.0395 6.56984 12 6.47446 12 6.375C12 6.27555 12.0395 6.18016 12.1098 6.10984C12.1802 6.03951 12.2755 6 12.375 6H13.5L13.0125 4.9995ZM13.5 7.875C13.5 7.77555 13.5395 7.68016 13.6098 7.60984C13.6802 7.53951 13.7755 7.5 13.875 7.5H18.375C18.4745 7.5 18.5698 7.53951 18.6402 7.60984C18.7105 7.68016 18.75 7.77555 18.75 7.875V8.25C18.75 8.5455 18.6825 8.838 18.5505 9.111C18.4132 9.39114 18.219 9.63965 17.9805 9.84075C17.7375 10.05 17.448 10.2158 17.1293 10.3283C16.4792 10.5576 15.7702 10.5579 15.12 10.329C14.8089 10.2198 14.5204 10.0546 14.2687 9.8415C14.0304 9.64011 13.8365 9.39134 13.6995 9.111C13.568 8.84305 13.4997 8.54849 13.5 8.25V7.875ZM18.5363 11.25C18.6116 11.2498 18.6852 11.2723 18.7475 11.3145C18.8099 11.3568 18.858 11.4168 18.8858 11.4868C18.9136 11.5568 18.9196 11.6335 18.9031 11.707C18.8867 11.7805 18.8485 11.8473 18.7935 11.8988L13.1355 17.2088C13.1029 17.2394 13.0621 17.2598 13.0181 17.2675C12.974 17.2752 12.9287 17.2698 12.8877 17.252C12.8467 17.2342 12.8118 17.2048 12.7873 17.1674C12.7628 17.13 12.7499 17.0862 12.75 17.0415V14.004L9.057 16.737C8.81702 16.9111 8.51802 16.9834 8.22501 16.9382C7.93201 16.893 7.66867 16.734 7.49226 16.4958C7.31586 16.2575 7.24063 15.9592 7.28295 15.6658C7.32527 15.3723 7.48171 15.1075 7.71825 14.9288L12.3885 11.472C12.59 11.3231 12.8355 11.2458 13.086 11.2523L13.125 11.25H18.5363ZM12.8655 18.7163C12.8289 18.7513 12.7998 18.7935 12.7799 18.8402C12.7601 18.8868 12.7499 18.937 12.75 18.9878V19.125C12.75 19.2245 12.7895 19.3198 12.8598 19.3902C12.9302 19.4605 13.0255 19.5 13.125 19.5H19.125C19.2245 19.5 19.3198 19.4605 19.3902 19.3902C19.4605 19.3198 19.5 19.2245 19.5 19.125V13.2488C19.5002 13.1752 19.4787 13.1032 19.4382 13.0418C19.3978 12.9803 19.3402 12.9321 19.2725 12.9032C19.2049 12.8743 19.1302 12.8659 19.0579 12.879C18.9855 12.8922 18.9186 12.9263 18.8655 12.9773L12.8655 18.7163ZM5.25 12.75C5.05109 12.75 4.86032 12.829 4.71967 12.9697C4.57902 13.1103 4.5 13.3011 4.5 13.5V17.25C4.5 17.4489 4.57902 17.6397 4.71967 17.7803C4.86032 17.921 5.05109 18 5.25 18H6V12.8438C6 12.8189 5.99012 12.795 5.97254 12.7775C5.95496 12.7599 5.93111 12.75 5.90625 12.75H5.25ZM6 18.75C6 18.9489 6.07902 19.1397 6.21967 19.2803C6.36032 19.421 6.55109 19.5 6.75 19.5H10.5C10.6989 19.5 10.8897 19.421 11.0303 19.2803C11.171 19.1397 11.25 18.9489 11.25 18.75V18.0938C11.25 18.0689 11.2401 18.045 11.2225 18.0275C11.205 18.0099 11.1811 18 11.1562 18H6.09375C6.06889 18 6.04504 18.0099 6.02746 18.0275C6.00988 18.045 6 18.0689 6 18.0938V18.75Z"
//                     fill="#6B6B6B"
//                   />
//                   <path
//                     d="M4.5 0.75C4.00754 0.75 3.51991 0.846997 3.06494 1.03545C2.60997 1.22391 2.19657 1.50013 1.84835 1.84835C1.14509 2.55161 0.75 3.50544 0.75 4.5V19.5C0.75 20.4946 1.14509 21.4484 1.84835 22.1517C2.19657 22.4999 2.60997 22.7761 3.06494 22.9645C3.51991 23.153 4.00754 23.25 4.5 23.25H19.5C20.4946 23.25 21.4484 22.8549 22.1517 22.1517C22.8549 21.4484 23.25 20.4946 23.25 19.5V4.5C23.25 4.00754 23.153 3.51991 22.9645 3.06494C22.7761 2.60997 22.4999 2.19657 22.1517 1.84835C21.8034 1.50013 21.39 1.22391 20.9351 1.03545C20.4801 0.846997 19.9925 0.75 19.5 0.75H4.5ZM2.25 4.5C2.25 3.90326 2.48705 3.33097 2.90901 2.90901C3.33097 2.48705 3.90326 2.25 4.5 2.25H19.5C20.0967 2.25 20.669 2.48705 21.091 2.90901C21.5129 3.33097 21.75 3.90326 21.75 4.5V19.5C21.75 20.0967 21.5129 20.669 21.091 21.091C20.669 21.5129 20.0967 21.75 19.5 21.75H4.5C3.90326 21.75 3.33097 21.5129 2.90901 21.091C2.48705 20.669 2.25 20.0967 2.25 19.5V4.5Z"
//                     fill="#6B6B6B"
//                   />
//                 </g>
//                 <defs>
//                   <clipPath id="clip0_517_2">
//                     <rect width="24" height="24" fill="white" />
//                   </clipPath>
//                 </defs>
//               </svg>
//               <span>گمرکی</span>

//               {/* Submenu for Settings */}
//               {showSubmenu.tanzimat && (
//                 <ul className="submenu">
//                   <li className="submenu-item">
//                     <Link to="/hscode-list">جدول تعرفه ها</Link>
//                   </li>
//                   <li className="submenu-item">
//                     <Link to="/hscode-inf">لیست تعرفه ها</Link>
//                   </li>
//                   <li className="submenu-item">
//                     <Link to="/tariff-calculator">محاسبه گمرکی</Link>
//                   </li>
//                 </ul>
//               )}
//             </li>
//             {/* Settings */}
//             <Link className="nav-item nav-link" to="/chatbot">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="28"
//                 height="28"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <path
//                   d="M21 11V9H19V7C18.9984 6.47005 18.7872 5.96227 18.4125 5.58753C18.0377 5.2128 17.5299 5.00158 17 5H15V3H13V5H11V3H9V5H7C6.47005 5.00158 5.96227 5.2128 5.58753 5.58753C5.2128 5.96227 5.00158 6.47005 5 7V9H3V11H5V13H3V15H5V17C5.00158 17.5299 5.2128 18.0377 5.58753 18.4125C5.96227 18.7872 6.47005 18.9984 7 19H9V21H11V19H13V21H15V19H17C17.5299 18.9984 18.0377 18.7872 18.4125 18.4125C18.7872 18.0377 18.9984 17.5299 19 17V15H21V13H19V11H21ZM17 17H7V7H17V17Z"
//                   fill="#6B6B6B"
//                 />
//                 <path
//                   d="M11.361 8H10.016L8.00601 16H9.03301L9.49701 14.125H11.813L12.265 16H13.327L11.361 8ZM9.63201 13.324L10.65 8.95H10.696L11.679 13.324H9.63201ZM14.244 8H15.244V16H14.244V8Z"
//                   fill="#6B6B6B"
//                 />
//               </svg>
//               <span>مشاور AI</span>
//             </Link>
//           </ul>
//         </div>
//         <div className="navbar-container2">
//           {/* User */}
//           <li
//             className="nav-item-left"
//             onMouseEnter={() => handleMouseEnter("karbar")}
//             onMouseLeave={() => handleMouseLeave("karbar")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="52"
//               height="52"
//               viewBox="0 0 52 52"
//               fill="none"
//             >
//               <path
//                 d="M26 21.6667C30.7865 21.6667 34.6667 17.7865 34.6667 13C34.6667 8.21353 30.7865 4.33333 26 4.33333C21.2136 4.33333 17.3334 8.21353 17.3334 13C17.3334 17.7865 21.2136 21.6667 26 21.6667Z"
//                 stroke="#6B6B6B"
//                 stroke-width="1.5"
//               />
//               <path
//                 d="M43.329 39C43.3319 38.6447 43.3334 38.2835 43.3334 37.9167C43.3334 32.5325 35.5724 28.1667 26 28.1667C16.4277 28.1667 8.66669 32.5325 8.66669 37.9167C8.66669 43.3008 8.66669 47.6667 26 47.6667C30.8339 47.6667 34.32 47.3265 36.8334 46.7198"
//                 stroke="#6B6B6B"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//               />
//             </svg>
//             <span>{isAuthenticated && user ? user.username : "کاربر"}</span>

//             {/* Submenu for User */}
//             {showSubmenu.karbar && (
//               <ul className="submenu">
//                 <li className="submenu-item">
//                   <FaUser
//                     size={28}
//                     style={{
//                       marginLeft: "15",
//                     }}
//                   />
//                   <Link to="/user/profile">پروفایل من</Link>
//                 </li>
//                 <li className="submenu-item">
//                   {/* Attach Logout Handler */}
//                   <button
//                     className="hover:bg-[#FFECEC] submenu-link logout-btn"
//                     onClick={handleLogout}
//                   >
//                     خروج
//                     <FaSignOutAlt
//                       size={28}
//                       style={{
//                         marginLeft: "15",
//                       }}
//                     />
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Notifications */}
//           <li
//             className="nav-item-left"
//             onMouseEnter={() => handleMouseEnter("notifications")}
//             onMouseLeave={() => handleMouseLeave("notifications")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="150"
//               height="50"
//               viewBox="0 0 50 50"
//               fill="none"
//             >
//               <path
//                 d="M25 12.5V20.8333M15.625 39.5833C16.9896 43.225 20.6708 45.8333 25 45.8333C25.5097 45.8333 26.0097 45.7986 26.5 45.7292M34.375 39.5833C33.8107 41.0705 32.8772 42.3897 31.6625 43.4167M18.9729 5.57083C20.8466 4.64383 22.9095 4.16323 25 4.16666C32.7646 4.16666 39.0625 10.7 39.0625 18.7604V20.2292C39.06 21.9824 39.5603 23.6996 40.5042 25.1771L42.8125 28.7687C44.9188 32.05 43.3104 36.5104 39.6458 37.5479C30.0702 40.2597 19.9298 40.2597 10.3542 37.5479C6.68959 36.5104 5.08126 32.05 7.18751 28.7708L9.49584 25.1771C10.4397 23.6996 10.94 21.9824 10.9375 20.2292V18.7604C10.9375 16.5229 11.4229 14.4021 12.2917 12.5062"
//                 stroke="#6B6B6B"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//               />
//             </svg>
//             <span>اعلان‌ها</span>

//             {/* Replace the static submenu with our notifications dropdown */}
//             {showSubmenu.notifications && <NotificationsDropdown />}
//           </li>
//         </div>
//       </div>
//       {/* Overlay Menu for Mobile */}
//       {showMenu && (
//         <div className="overlay-menu fixed inset-0 bg-black bg-opacity-60 flex justify-end z-50 transition-opacity duration-300 ease-in-out font-vazir">
//           <div className="bg-white w-full sm:w-80 h-full shadow-2xl p-6 flex flex-col gap-4">
//             <button
//               className="close-overlay  self-end text-gray-600 text-2xl sm:text-3xl hover:text-red-500 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-colors duration-200"
//               onClick={closeMenu}
//             >
//               <FaTimes />
//             </button>

//             <ul className="overlay-navbar flex flex-col gap-">
//               <li>
//                 <Link
//                   to="/"
//                   onClick={closeMenu}
//                   className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
//                 >
//                   <FaHome className="text-blue-500" />
//                   صفحه اصلی
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/asnad"
//                   onClick={closeMenu}
//                   className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
//                 >
//                   <FaFileAlt className="text-blue-500" />
//                   اسناد
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/settings"
//                   onClick={closeMenu}
//                   className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
//                 >
//                   <FaCog className="text-blue-500" />
//                   تنظیمات
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/user/profile"
//                   onClick={closeMenu}
//                   className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
//                 >
//                   <FaUser className="text-blue-500" />
//                   کاربر
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/notifications"
//                   onClick={closeMenu}
//                   className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
//                 >
//                   <FaBell className="text-blue-500" />
//                   اعلان‌ها
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/chatbot"
//                   onClick={closeMenu}
//                   className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
//                 >
//                   <FaRobot className="text-blue-500" />
//                   مشاور هوش مصنوعی
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Navbar.css";
import { logout } from "../actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import NotificationsDropdown from "./NotificationsDropdown"; // Adjust path as needed
import { RiInformation2Fill } from "react-icons/ri";
import {
  FaBell,
  FaCog,
  FaFileAlt,
  FaHome,
  FaRobot,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showSubSubmenu, setShowSubSubmenu] = useState({
    "receive-order": false,
  });
  const role = user?.role;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [showSubmenu, setShowSubmenu] = useState({
    asnad: false,
    tanzimat: false,
    karbar: false,
    notifications: false,
  });

  const [showMenu, setShowMenu] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState({
    asnad: false,
    tanzimat: false,
    "receive-order": false,
    declarations: false,
    exportDeclarations: false,
    checks: false,
    representations: false,
    issueDocuments: false,
    parties: false,
  });
  const navigate = useNavigate();

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
    setMobileSubmenu({
      asnad: false,
      tanzimat: false,
      "receive-order": false,
      declarations: false,
      exportDeclarations: false,
      checks: false,
      representations: false,
      issueDocuments: false,
      parties: false,
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSubmenuMouseEnter = (submenu) => {
    setShowSubSubmenu((prevState) => ({ ...prevState, [submenu]: true }));
  };

  const handleSubmenuMouseLeave = (submenu) => {
    setShowSubSubmenu((prevState) => ({ ...prevState, [submenu]: false }));
  };

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <>
      {/* Navbar Header with Hamburger Button for Mobile View */}
      <div className="navbar-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="#6B6B6B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="nacbar-container-cont">
        <div className="navbar-container">
          <ul className="navbar">
            {/* Home */}
            <Link to="/" className="nav-item nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 16C9.85 16.63 10.885 17 12 17C13.115 17 14.15 16.63 15 16"
                  stroke="#6B6B6B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M22 12.204V13.725C22 17.625 22 19.576 20.828 20.788C19.656 22 17.771 22 14 22H10C6.229 22 4.343 22 3.172 20.788C2.001 19.576 2 17.626 2 13.725V12.204C2 9.915 2 8.771 2.52 7.823C3.038 6.874 3.987 6.286 5.884 5.108L7.884 3.867C9.889 2.622 10.892 2 12 2C13.108 2 14.11 2.622 16.116 3.867L18.116 5.108C20.013 6.286 20.962 6.874 21.481 7.823"
                  stroke="#6B6B6B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <span>صفحه اصلی</span>
            </Link>

            {/* Documents */}
            <li
              className="nav-item"
              onMouseEnter={() => handleMouseEnter("asnad")}
              onMouseLeave={() => handleMouseLeave("asnad")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18.18 8.04L18.643 7.576C19.0116 7.20722 19.5117 6.99999 20.0331 6.99989C20.5546 6.9998 21.0547 7.20685 21.4235 7.5755C21.7923 7.94415 21.9995 8.44421 21.9996 8.96565C21.9997 9.4871 21.7926 9.98722 21.424 10.356L20.961 10.82M18.18 8.04C18.18 8.04 18.238 9.024 19.107 9.893C19.976 10.762 20.961 10.82 20.961 10.82M18.18 8.04L13.92 12.3C13.63 12.588 13.486 12.733 13.362 12.892C13.2153 13.08 13.0906 13.282 12.988 13.498C12.901 13.68 12.837 13.873 12.708 14.26L12.295 15.5L12.161 15.901M20.961 10.82L16.701 15.08C16.411 15.37 16.267 15.514 16.108 15.638C15.92 15.7847 15.718 15.9093 15.502 16.012C15.32 16.099 15.127 16.163 14.74 16.292L13.5 16.705L13.099 16.839M12.161 15.901L12.028 16.303C11.997 16.3963 11.9926 16.4964 12.0152 16.5921C12.0379 16.6878 12.0867 16.7752 12.1562 16.8448C12.2257 16.9143 12.3132 16.9631 12.4089 16.9858C12.5046 17.0084 12.6047 17.004 12.698 16.973L13.099 16.839M12.161 15.901L13.099 16.839"
                  stroke="#6B6B6B"
                  stroke-width="1.5"
                />
                <path
                  d="M8 13H10.5M8 9H14.5M8 17H9.5M3 14V10C3 6.229 3 4.343 4.172 3.172C5.344 2.001 7.229 2 11 2H13C16.771 2 18.657 2 19.828 3.172M21 14C21 17.771 21 19.657 19.828 20.828M19.828 20.828C18.657 22 16.771 22 13 22H11C7.229 22 5.343 22 4.172 20.828M19.828 20.828C20.772 19.885 20.955 18.48 20.991 16"
                  stroke="#6B6B6B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <span>اسناد</span>

              {/* Submenu for Documents */}
              {showSubmenu.asnad && (
                <ul className="submenu">
                  <li
                    className="submenu-item"
                    onMouseEnter={() =>
                      handleSubmenuMouseEnter("receive-order")
                    }
                    onMouseLeave={() =>
                      handleSubmenuMouseLeave("receive-order")
                    }
                  >
                    <span> ثبت سفارش ها</span>
                    {/* Submenu within Submenu */}
                    {showSubSubmenu["receive-order"] && (
                      <ul className="sub-submenu">
                        <Link className="submenu-link" to="/add-order">
                          <li className="submenu-item">ایجاد ثبت سفارش</li>
                        </Link>
                        <Link className="submenu-link" to="/reged-orders">
                          <li className="submenu-item">لیست ثبت سفارش ها</li>
                        </Link>
                        {role === "admin" && (
                          <Link className="submenu-link" to="/import-prf">
                            <li className="submenu-item">دریافت از سامانه</li>
                          </Link>
                        )}
                      </ul>
                    )}
                  </li>
                  <li
                    className="submenu-item"
                    onMouseEnter={() =>
                      handleSubmenuMouseEnter("receive-order")
                    }
                    onMouseLeave={() =>
                      handleSubmenuMouseLeave("receive-order")
                    }
                  >
                    <span>اظهارنامه ها</span>
                    {/* Submenu within Submenu */}
                    {showSubSubmenu["receive-order"] && (
                      <ul className="sub-submenu">
                        <Link className="submenu-link" to="/expense-list">
                          <li className="submenu-item">لیست هزینه ها</li>
                        </Link>
                        <Link className="submenu-link" to="/cottages">
                          <li className="submenu-item">لیست اظهارنامه ها</li>
                        </Link>
                        <Link className="submenu-link" to="/cottage-goods-list">
                          <li className="submenu-item">لیست کلی کالا ها</li>
                        </Link>
                        {role === "admin" && (
                          <Link className="submenu-link" to="/decl">
                            <li className="submenu-item">دریافت از سامانه</li>
                          </Link>
                        )}
                      </ul>
                    )}
                  </li>
                  <li
                    className="submenu-item"
                    onMouseEnter={() =>
                      handleSubmenuMouseEnter("receive-order")
                    }
                    onMouseLeave={() =>
                      handleSubmenuMouseLeave("receive-order")
                    }
                  >
                    <span>اظهارنامه های صادراتی</span>
                    {/* Submenu within Submenu */}
                    {showSubSubmenu["receive-order"] && (
                      <ul className="sub-submenu">
                        <Link className="submenu-link" to="/add-export">
                          <li className="submenu-item">ایجاد اظهارنمه</li>
                        </Link>
                        <Link className="submenu-link" to="/export-cottages">
                          <li className="submenu-item">لیست اظهارنامه ها</li>
                        </Link>
                        {role === "admin" && (
                          <Link className="submenu-link" to="/export-decl">
                            <li className="submenu-item">دریافت از سامانه</li>
                          </Link>
                        )}
                      </ul>
                    )}
                  </li>
                  <li
                    className="submenu-item"
                    onMouseEnter={() =>
                      handleSubmenuMouseEnter("receive-order")
                    }
                    onMouseLeave={() =>
                      handleSubmenuMouseLeave("receive-order")
                    }
                  >
                    <span>چک ها</span>
                    {/* Submenu within Submenu */}
                    {showSubSubmenu["receive-order"] && (
                      <ul className="sub-submenu">
                        <Link className="submenu-link" to="/add-check">
                          <li className="submenu-item">ایجاد چک جدید</li>
                        </Link>
                        <Link className="submenu-link" to="/checks">
                          <li className="submenu-item">لیست چک ها</li>
                        </Link>
                        <Link className="submenu-link" to="/check-from-excel">
                          <li className="submenu-item">ورود چک</li>
                        </Link>
                      </ul>
                    )}
                  </li>
                  <li
                    className="submenu-item"
                    onMouseEnter={() =>
                      handleSubmenuMouseEnter("receive-order")
                    }
                    onMouseLeave={() =>
                      handleSubmenuMouseLeave("receive-order")
                    }
                  >
                    <span>وکالت نامه ها</span>
                    {/* Submenu within Submenu */}
                    {showSubSubmenu["receive-order"] && (
                      <ul className="sub-submenu">
                        <Link className="submenu-link" to="/add-representation">
                          <li className="submenu-item">ایجاد وکالتنامه</li>
                        </Link>
                        <Link className="submenu-link" to="/representations">
                          <li className="submenu-item">لیست وکالتنامه ها</li>
                        </Link>
                        <Link className="submenu-link" to="/rep-from-excel">
                          <li className="submenu-item">ورود وکالتنامه</li>
                        </Link>
                      </ul>
                    )}
                  </li>
                  <li
                    className="submenu-item"
                    onMouseEnter={() =>
                      handleSubmenuMouseEnter("receive-order")
                    }
                    onMouseLeave={() =>
                      handleSubmenuMouseLeave("receive-order")
                    }
                  >
                    <span>صدور اسناد</span>
                    {/* Submenu within Submenu */}
                    {showSubSubmenu["receive-order"] && (
                      <ul className="sub-submenu">
                        <Link className="submenu-link" to="/invoices/new">
                          <li className="submenu-item">
                            ایجاد اینوویس/پکینگ/گواهی مبدا
                          </li>
                        </Link>
                        <Link className="submenu-link" to="/invoices/list">
                          <li className="submenu-item">
                            لیست اینوویس/پکینگ/گواهی مبدا
                          </li>
                        </Link>
                        <Link
                          className="submenu-link"
                          to="/proforma-invoices/new"
                        >
                          <li className="submenu-item">ایجاد پروفورما</li>
                        </Link>
                        <Link
                          className="submenu-link"
                          to="/proforma-invoices/list"
                        >
                          <li className="submenu-item">لیست پروفورما</li>
                        </Link>
                      </ul>
                    )}
                  </li>
                  <li
                    className="submenu-item"
                    onMouseEnter={() =>
                      handleSubmenuMouseEnter("receive-order")
                    }
                    onMouseLeave={() =>
                      handleSubmenuMouseLeave("receive-order")
                    }
                  >
                    <span>طرفین</span>
                    {/* Submenu within Submenu */}
                    {showSubSubmenu["receive-order"] && (
                      <ul className="sub-submenu">
                        <Link className="submenu-link" to="/sellers/new">
                          <li className="submenu-item">ایجاد فروشنده</li>
                        </Link>
                        <Link className="submenu-link" to="/sellers/list">
                          <li className="submenu-item">لیست فروشنده ها</li>
                        </Link>
                        <Link className="submenu-link" to="/buyers/new">
                          <li className="submenu-item">ایجاد خریدار</li>
                        </Link>
                        <Link className="submenu-link" to="/buyers/list">
                          <li className="submenu-item">لیست خریدار ها</li>
                        </Link>
                        <Link className="submenu-link" to="/customers/new">
                          <li className="submenu-item">ایجاد شخص جدید</li>
                        </Link>
                        <Link className="submenu-link" to="/customers/list">
                          <li className="submenu-item">لیست اشخاص</li>
                        </Link>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>

            {/* Settings */}
            <li
              className="nav-item"
              onMouseEnter={() => handleMouseEnter("tanzimat")}
              onMouseLeave={() => handleMouseLeave("tanzimat")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g clip-path="url(#clip0_517_2)">
                  <path
                    d="M13.0125 4.9995C12.9845 4.94228 12.9715 4.87884 12.9747 4.8152C12.978 4.75155 12.9975 4.6898 13.0312 4.63575C13.065 4.58171 13.112 4.53717 13.1678 4.50633C13.2236 4.47549 13.2863 4.45938 13.35 4.4595H18.375C18.4745 4.4595 18.5698 4.49901 18.6402 4.56934C18.7105 4.63967 18.75 4.73505 18.75 4.8345V6.375C18.75 6.47446 18.7105 6.56984 18.6402 6.64017C18.5698 6.7105 18.4745 6.75 18.375 6.75H12.375C12.2755 6.75 12.1802 6.7105 12.1098 6.64017C12.0395 6.56984 12 6.47446 12 6.375C12 6.27555 12.0395 6.18016 12.1098 6.10984C12.1802 6.03951 12.2755 6 12.375 6H13.5L13.0125 4.9995ZM13.5 7.875C13.5 7.77555 13.5395 7.68016 13.6098 7.60984C13.6802 7.53951 13.7755 7.5 13.875 7.5H18.375C18.4745 7.5 18.5698 7.53951 18.6402 7.60984C18.7105 7.68016 18.75 7.77555 18.75 7.875V8.25C18.75 8.5455 18.6825 8.838 18.5505 9.111C18.4132 9.39114 18.219 9.63965 17.9805 9.84075C17.7375 10.05 17.448 10.2158 17.1293 10.3283C16.4792 10.5576 15.7702 10.5579 15.12 10.329C14.8089 10.2198 14.5204 10.0546 14.2687 9.8415C14.0304 9.64011 13.8365 9.39134 13.6995 9.111C13.568 8.84305 13.4997 8.54849 13.5 8.25V7.875ZM18.5363 11.25C18.6116 11.2498 18.6852 11.2723 18.7475 11.3145C18.8099 11.3568 18.858 11.4168 18.8858 11.4868C18.9136 11.5568 18.9196 11.6335 18.9031 11.707C18.8867 11.7805 18.8485 11.8473 18.7935 11.8988L13.1355 17.2088C13.1029 17.2394 13.0621 17.2598 13.0181 17.2675C12.974 17.2752 12.9287 17.2698 12.8877 17.252C12.8467 17.2342 12.8118 17.2048 12.7873 17.1674C12.7628 17.13 12.7499 17.0862 12.75 17.0415V14.004L9.057 16.737C8.81702 16.9111 8.51802 16.9834 8.22501 16.9382C7.93201 16.893 7.66867 16.734 7.49226 16.4958C7.31586 16.2575 7.24063 15.9592 7.28295 15.6658C7.32527 15.3723 7.48171 15.1075 7.71825 14.9288L12.3885 11.472C12.59 11.3231 12.8355 11.2458 13.086 11.2523L13.125 11.25H18.5363ZM12.8655 18.7163C12.8289 18.7513 12.7998 18.7935 12.7799 18.8402C12.7601 18.8868 12.7499 18.937 12.75 18.9878V19.125C12.75 19.2245 12.7895 19.3198 12.8598 19.3902C12.9302 19.4605 13.0255 19.5 13.125 19.5H19.125C19.2245 19.5 19.3198 19.4605 19.3902 19.3902C19.4605 19.3198 19.5 19.2245 19.5 19.125V13.2488C19.5002 13.1752 19.4787 13.1032 19.4382 13.0418C19.3978 12.9803 19.3402 12.9321 19.2725 12.9032C19.2049 12.8743 19.1302 12.8659 19.0579 12.879C18.9855 12.8922 18.9186 12.9263 18.8655 12.9773L12.8655 18.7163ZM5.25 12.75C5.05109 12.75 4.86032 12.829 4.71967 12.9697C4.57902 13.1103 4.5 13.3011 4.5 13.5V17.25C4.5 17.4489 4.57902 17.6397 4.71967 17.7803C4.86032 17.921 5.05109 18 5.25 18H6V12.8438C6 12.8189 5.99012 12.795 5.97254 12.7775C5.95496 12.7599 5.93111 12.75 5.90625 12.75H5.25ZM6 18.75C6 18.9489 6.07902 19.1397 6.21967 19.2803C6.36032 19.421 6.55109 19.5 6.75 19.5H10.5C10.6989 19.5 10.8897 19.421 11.0303 19.2803C11.171 19.1397 11.25 18.9489 11.25 18.75V18.0938C11.25 18.0689 11.2401 18.045 11.2225 18.0275C11.205 18.0099 11.1811 18 11.1562 18H6.09375C6.06889 18 6.04504 18.0099 6.02746 18.0275C6.00988 18.045 6 18.0689 6 18.0938V18.75Z"
                    fill="#6B6B6B"
                  />
                  <path
                    d="M4.5 0.75C4.00754 0.75 3.51991 0.846997 3.06494 1.03545C2.60997 1.22391 2.19657 1.50013 1.84835 1.84835C1.14509 2.55161 0.75 3.50544 0.75 4.5V19.5C0.75 20.4946 1.14509 21.4484 1.84835 22.1517C2.19657 22.4999 2.60997 22.7761 3.06494 22.9645C3.51991 23.153 4.00754 23.25 4.5 23.25H19.5C20.4946 23.25 21.4484 22.8549 22.1517 22.1517C22.8549 21.4484 23.25 20.4946 23.25 19.5V4.5C23.25 4.00754 23.153 3.51991 22.9645 3.06494C22.7761 2.60997 22.4999 2.19657 22.1517 1.84835C21.8034 1.50013 21.39 1.22391 20.9351 1.03545C20.4801 0.846997 19.9925 0.75 19.5 0.75H4.5ZM2.25 4.5C2.25 3.90326 2.48705 3.33097 2.90901 2.90901C3.33097 2.48705 3.90326 2.25 4.5 2.25H19.5C20.0967 2.25 20.669 2.48705 21.091 2.90901C21.5129 3.33097 21.75 3.90326 21.75 4.5V19.5C21.75 20.0967 21.5129 20.669 21.091 21.091C20.669 21.5129 20.0967 21.75 19.5 21.75H4.5C3.90326 21.75 3.33097 21.5129 2.90901 21.091C2.48705 20.669 2.25 20.0967 2.25 19.5V4.5Z"
                    fill="#6B6B6B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_517_2">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>گمرکی</span>

              {/* Submenu for Settings */}
              {showSubmenu.tanzimat && (
                <ul className="submenu">
                  <li className="submenu-item">
                    <Link to="/hscode-list">جدول تعرفه ها</Link>
                  </li>
                  <li className="submenu-item">
                    <Link to="/hscode-inf">لیست تعرفه ها</Link>
                  </li>
                  <li className="submenu-item">
                    <Link to="/tariff-calculator">محاسبه گمرکی</Link>
                  </li>
                </ul>
              )}
            </li>
            {/* AI Consultant */}
            <Link className="nav-item nav-link" to="/chatbot">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 11V9H19V7C18.9984 6.47005 18.7872 5.96227 18.4125 5.58753C18.0377 5.2128 17.5299 5.00158 17 5H15V3H13V5H11V3H9V5H7C6.47005 5.00158 5.96227 5.2128 5.58753 5.58753C5.2128 5.96227 5.00158 6.47005 5 7V9H3V11H5V13H3V15H5V17C5.00158 17.5299 5.2128 18.0377 5.58753 18.4125C5.96227 18.7872 6.47005 18.9984 7 19H9V21H11V19H13V21H15V19H17C17.5299 18.9984 18.0377 18.7872 18.4125 18.4125C18.7872 18.0377 18.9984 17.5299 19 17V15H21V13H19V11H21ZM17 17H7V7H17V17Z"
                  fill="#6B6B6B"
                />
                <path
                  d="M11.361 8H10.016L8.00601 16H9.03301L9.49701 14.125H11.813L12.265 16H13.327L11.361 8ZM9.63201 13.324L10.65 8.95H10.696L11.679 13.324H9.63201ZM14.244 8H15.244V16H14.244V8Z"
                  fill="#6B6B6B"
                />
              </svg>
              <span>مشاور AI</span>
            </Link>
          </ul>
        </div>
        <div className="navbar-container2">
          {/* User */}
          <li
            className="nav-item-left"
            onMouseEnter={() => handleMouseEnter("karbar")}
            onMouseLeave={() => handleMouseLeave("karbar")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
            >
              <path
                d="M26 21.6667C30.7865 21.6667 34.6667 17.7865 34.6667 13C34.6667 8.21353 30.7865 4.33333 26 4.33333C21.2136 4.33333 17.3334 8.21353 17.3334 13C17.3334 17.7865 21.2136 21.6667 26 21.6667Z"
                stroke="#6B6B6B"
                stroke-width="1.5"
              />
              <path
                d="M43.329 39C43.3319 38.6447 43.3334 38.2835 43.3334 37.9167C43.3334 32.5325 35.5724 28.1667 26 28.1667C16.4277 28.1667 8.66669 32.5325 8.66669 37.9167C8.66669 43.3008 8.66669 47.6667 26 47.6667C30.8339 47.6667 34.32 47.3265 36.8334 46.7198"
                stroke="#6B6B6B"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <span>{isAuthenticated && user ? user.username : "کاربر"}</span>

            {/* Submenu for User */}
            {showSubmenu.karbar && (
              <ul className="submenu text-right">
                <li>
                  <Link
                    to="/user/profile"
                    className="block flex flex-row-reverse items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <FaUser size={20} className="flex-shrink-0" />
                    <span className="text-sm leading-none">پروفایل من</span>
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left flex flex-row-reverse items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-200 transition-colors cursor-pointer bg-transparent border-0 text-sm leading-none"
                  >
                    <FaSignOutAlt size={20} className="flex-shrink-0" />
                    <span>خروج</span>
                  </button>
                </li>

                <li>
                  <Link
                    to="/user/settings"
                    className="block flex flex-row-reverse items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <AiFillSetting size={20} className="flex-shrink-0" />
                    <span className="text-sm leading-none">تنظیمات</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/guide"
                    className="block flex flex-row-reverse items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <RiInformation2Fill size={20} className="flex-shrink-0" />
                    <span className="text-sm leading-none">پشتیبانی </span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Notifications */}
          <li
            className="nav-item-left"
            onMouseEnter={() => handleMouseEnter("notifications")}
            onMouseLeave={() => handleMouseLeave("notifications")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="150"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
            >
              <path
                d="M25 12.5V20.8333M15.625 39.5833C16.9896 43.225 20.6708 45.8333 25 45.8333C25.5097 45.8333 26.0097 45.7986 26.5 45.7292M34.375 39.5833C33.8107 41.0705 32.8772 42.3897 31.6625 43.4167M18.9729 5.57083C20.8466 4.64383 22.9095 4.16323 25 4.16666C32.7646 4.16666 39.0625 10.7 39.0625 18.7604V20.2292C39.06 21.9824 39.5603 23.6996 40.5042 25.1771L42.8125 28.7687C44.9188 32.05 43.3104 36.5104 39.6458 37.5479C30.0702 40.2597 19.9298 40.2597 10.3542 37.5479C6.68959 36.5104 5.08126 32.05 7.18751 28.7708L9.49584 25.1771C10.4397 23.6996 10.94 21.9824 10.9375 20.2292V18.7604C10.9375 16.5229 11.4229 14.4021 12.2917 12.5062"
                stroke="#6B6B6B"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <span>اعلان‌ها</span>

            {/* Replace the static submenu with our notifications dropdown */}
            {showSubmenu.notifications && <NotificationsDropdown />}
          </li>
        </div>
      </div>
      {/* Overlay Menu for Mobile */}
      {showMenu && (
        <div className="overlay-menu fixed inset-0 bg-black bg-opacity-60 flex justify-end z-50 transition-opacity duration-300 ease-in-out font-vazir">
          <div className="bg-white w-full sm:w-80 h-full shadow-2xl p-6 flex flex-col gap-4">
            <button
              className="close-overlay self-end text-gray-600 text-2xl sm:text-3xl hover:text-red-500 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-colors duration-200"
              onClick={closeMenu}
            >
              <FaTimes />
            </button>

            <ul className="overlay-navbar flex flex-col gap-2">
              <li>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <FaHome className="text-blue-500" />
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <button
                  onClick={() => toggleMobileSubmenu("asnad")}
                  className="flex items-center justify-between w-full text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-blue-500" />
                    اسناد
                  </div>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      mobileSubmenu.asnad ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSubmenu.asnad && (
                  <ul className="flex flex-col gap-2 pr-4">
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("receive-order")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        ثبت سفارش ها
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu["receive-order"] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu["receive-order"] && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/add-order"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد ثبت سفارش
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/reged-orders"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست ثبت سفارش ها
                            </Link>
                          </li>
                          {role === "admin" && (
                            <li>
                              <Link
                                to="/import-prf"
                                onClick={closeMenu}
                                className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                              >
                                دریافت از سامانه
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("declarations")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        اظهارنامه ها
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.declarations ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.declarations && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/expense-list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست هزینه ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/cottages"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست اظهارنامه ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/cottage-goods-list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست کلی کالا ها
                            </Link>
                          </li>
                          {role === "admin" && (
                            <li>
                              <Link
                                to="/decl"
                                onClick={closeMenu}
                                className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                              >
                                دریافت از سامانه
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          toggleMobileSubmenu("exportDeclarations")
                        }
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        اظهارنامه های صادراتی
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.exportDeclarations ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.exportDeclarations && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/add-export"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد اظهارنمه
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/export-cottages"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست اظهارنامه ها
                            </Link>
                          </li>
                          {role === "admin" && (
                            <li>
                              <Link
                                to="/export-decl"
                                onClick={closeMenu}
                                className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                              >
                                دریافت از سامانه
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("checks")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        چک ها
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.checks ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.checks && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/add-check"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد چک جدید
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/checks"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست چک ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/check-from-excel"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ورود چک
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("representations")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        وکالت نامه ها
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.representations ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.representations && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/add-representation"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد وکالتنامه
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/representations"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست وکالتنامه ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/rep-from-excel"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ورود وکالتنامه
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("issueDocuments")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        صدور اسناد
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.issueDocuments ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.issueDocuments && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/invoices/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد اینوویس/پکینگ/گواهی مبدا
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/invoices/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست اینوویس/پکینگ/گواهی مبدا
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/proforma-invoices/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد پروفورما
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/proforma-invoices/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست پروفورما
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("parties")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        طرفین
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.parties ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.parties && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/sellers/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد فروشنده
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/sellers/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست فروشنده ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/buyers/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد خریدار
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/buyers/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست خریدار ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/customers/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد شخص جدید
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/customers/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست اشخاص
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={() => toggleMobileSubmenu("tanzimat")}
                  className="flex items-center justify-between w-full text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <div className="flex items-center gap-3">
                    <FaCog className="text-blue-500" />
                    گمرکی
                  </div>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      mobileSubmenu.tanzimat ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSubmenu.tanzimat && (
                  <ul className="flex flex-col gap-1 pr-4">
                    <li>
                      <Link
                        to="/hscode-list"
                        onClick={closeMenu}
                        className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                      >
                        جدول تعرفه ها
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/hscode-inf"
                        onClick={closeMenu}
                        className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                      >
                        لیست تعرفه ها
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tariff-calculator"
                        onClick={closeMenu}
                        className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                      >
                        محاسبه گمرکی
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link
                  to="/chatbot"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <FaRobot className="text-blue-500" />
                  مشاور هوش مصنوعی
                </Link>
              </li>
              <li>
                <Link
                  to="/user/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <FaUser className="text-blue-500" />
                  کاربر
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <FaBell className="text-blue-500" />
                  اعلان‌ها
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
