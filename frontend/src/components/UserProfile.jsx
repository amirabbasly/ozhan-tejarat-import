// import React, { useEffect, useState, useRef } from "react";
// import {
//   FaUserCircle,
//   FaEnvelope,
//   FaBriefcase,
//   FaCalendarAlt,
//   FaEdit,
//   FaCamera,
// } from "react-icons/fa";
// import PropTypes from "prop-types";
// import axiosInstance from "../utils/axiosInstance";
// import { logout } from "../actions/authActions";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const UserProfile = ({ user = {} }) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [showFakeLoading, setShowFakeLoading] = useState(false);
//   const [fakeProgress, setFakeProgress] = useState(0);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     email: "",
//     username: "",
//     first_name: "",
//     last_name: "",
//     phone_number: "",
//     birth_date: "",
//     role: "",
//     picture: null,
//   });

//   const [passwordFormData, setPasswordFormData] = useState({
//     old_password: "",
//     new_password: "",
//     confirm_password: "",
//   });

//   const [passwordError, setPasswordError] = useState(null);
//   const fileInputRef = useRef(null);
//   const modalFileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const { data } = await axiosInstance.get("/accounts/profile/");
//         setData(data);
//         setFormData({
//           email: data.email || "",
//           username: data.username || "",
//           first_name: data.first_name || "",
//           last_name: data.last_name || "",
//           phone_number: data.phone_number || "",
//           birth_date: data.birth_date || "",
//           role: data.role || "",
//           picture: null,
//         });

//         if (data.picture) {
//           setProfilePicture(`http://192.168.8.36:8000${data.picture}`);
//         }
//       } catch (err) {
//         setError(err);
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (showFakeLoading) {
//       setFakeProgress(0);
//       interval = setInterval(() => {
//         setFakeProgress((prev) => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             setTimeout(() => {
//               setShowFakeLoading(false);
//               setIsProfileModalOpen(false);
//             }, 300);
//             return 100;
//           }
//           return prev + 1;
//         });
//       }, 50);
//     }
//     return () => clearInterval(interval);
//   }, [showFakeLoading]);

//   const profileData = {
//     fullName:
//       data?.first_name && data?.last_name
//         ? `${data.first_name} ${data.last_name}`
//         : user.fullName || "کاربر ناشناس",
//     email: data?.email || user.email || "ایمیل ثبت نشده",
//     role: data?.role || user.role || "کاربر",
//     phoneNumber: data?.phone_number || user.phone_number || "شماره ثبت نشده",
//     joinDate: user.joinDate || "تاریخ دقیق در دسترس نیست",
//     lastLogin: user.lastLogin || "تاریخ دقیق در دسترس نیست ",
//     profilePicture: profilePicture || null,
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFormData((prev) => ({ ...prev, picture: file }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleProfileInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordInputChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordFormData((prev) => ({ ...prev, [name]: value }));
//     setPasswordError(null);
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setShowFakeLoading(true);
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     if (passwordFormData.new_password !== passwordFormData.confirm_password) {
//       setPasswordError("رمز عبور جدید و تأیید رمز عبور مطابقت ندارند.");
//       return;
//     }
//     try {
//       await axiosInstance.put(
//         "/accounts/profile/change-password/",
//         {
//           old_password: passwordFormData.old_password,
//           new_password: passwordFormData.new_password,
//         }
//       );
//       setPasswordFormData({
//         old_password: "",
//         new_password: "",
//         confirm_password: "",
//       });
//       setIsPasswordModalOpen(false);
//       setPasswordError(null);
//     } catch (err) {
//       console.error("Error changing password:", err);
//       setPasswordError("خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.");
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-vazir">
//         <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 sm:p-8">
//           <p className="text-center text-lg sm:text-xl font-medium text-gray-900">
//             در حال بارگذاری...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error || (!user && !data)) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-vazir">
//         <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 sm:p-8">
//           <p className="text-center text-lg sm:text-xl font-medium text-red-600">
//             اطلاعات کاربر در دسترس نیست.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-vazir">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 sm:p-8 flex flex-col gap-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             پروفایل کاربر
//           </h2>
//           <button
//             className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
//             onClick={() => setIsProfileModalOpen(true)}
//           >
//             <FaEdit />
//             ویرایش پروفایل
//           </button>
//         </div>

//         {/* Profile Picture */}
//         <div className="flex flex-col items-center mt-3 relative">
//           {profileData.profilePicture ? (
//             <div className="relative">
//               <img
//                 src={profileData.profilePicture}
//                 alt="Profile"
//                 className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-100"
//               />
//               <button
//                 className="absolute bottom-0 right-0 bg-blue-200 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
//                 onClick={() => fileInputRef.current.click()}
//               >
//                 <FaEdit className="text-blue-600 text-lg sm:text-xl" />
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />
//             </div>
//           ) : (
//             <div className="relative">
//               <FaUserCircle className="text-8xl sm:text-9xl text-blue-200" />
//               <button
//                 className="absolute bottom-0 right-0 bg-blue-200 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
//                 onClick={() => fileInputRef.current.click()}
//               >
//                 <FaEdit className="text-blue-600 text-lg sm:text-xl" />
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />
//             </div>
//           )}
//         </div>

//         {/* Info Fields */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//           <div className="flex items-center gap-3">
//             <FaUserCircle className="text-blue-600" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500">نام کامل</p>
//               <p className="text-base sm:text-lg font-medium text-gray-900">
//                 {profileData.fullName}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaEnvelope className="text-blue-600" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500">ایمیل</p>
//               <p className="text-base sm:text-lg font-medium text-gray-900">
//                 {profileData.email}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaBriefcase className="text-blue-600" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500">شماره تلفن</p>
//               <p className="text-base sm:text-lg font-medium text-gray-900">
//                 {profileData.phoneNumber}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaBriefcase className="text-blue-600" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500">نقش</p>
//               <p className="text-base sm:text-lg font-medium text-gray-900">
//                 {profileData.role}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaCalendarAlt className="text-blue-600" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500">تاریخ عضویت</p>
//               <p className="text-base sm:text-lg font-medium text-gray-900">
//                 {profileData.joinDate}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaCalendarAlt className="text-blue-600" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500">آخرین ورود</p>
//               <p className="text-base sm:text-lg font-medium text-gray-900">
//                 {profileData.lastLogin}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Account Actions */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
//             onClick={() => setIsPasswordModalOpen(true)}
//           >
//             تغییر رمز عبور
//           </button>
//           <button
//             className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
//             onClick={handleLogout}
//           >
//             خروج از حساب
//           </button>
//         </div>
//       </div>

//       {/* Profile Edit Modal */}
//       {isProfileModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg flex flex-col gap-4">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
//               ویرایش پروفایل
//             </h2>
//             <div className="flex flex-col gap-3">
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleProfileInputChange}
//                 placeholder="نام کاربری"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <input
//                 type="text"
//                 name="first_name"
//                 value={formData.first_name}
//                 onChange={handleProfileInputChange}
//                 placeholder="نام"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <input
//                 type="text"
//                 name="last_name"
//                 value={formData.last_name}
//                 onChange={handleProfileInputChange}
//                 placeholder="نام خانوادگی"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleProfileInputChange}
//                 placeholder="ایمیل"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <input
//                 type="tel"
//                 name="phone_number"
//                 value={formData.phone_number}
//                 onChange={handleProfileInputChange}
//                 placeholder="شماره تلفن"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <input
//                 type="date"
//                 name="birth_date"
//                 value={formData.birth_date}
//                 onChange={handleProfileInputChange}
//                 placeholder="تاریخ تولد"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <input
//                 type="text"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleProfileInputChange}
//                 placeholder="نقش"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <div className="flex items-center gap-3">
//                 <button
//                   className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200"
//                   onClick={() => modalFileInputRef.current.click()}
//                 >
//                   <FaCamera className="text-xl sm:text-2xl" />
//                 </button>
//                 <input
//                   type="file"
//                   ref={modalFileInputRef}
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                 />
//                 {formData.picture && (
//                   <span className="text-sm text-gray-500">
//                     {formData.picture.name}
//                   </span>
//                 )}
//               </div>

//               {showFakeLoading && (
//                 <div className="mt-3">
//                   <p className="text-sm text-gray-500 mb-1">
//                     در حال ذخیره تغییرات...
//                   </p>
//                   <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-blue-500 transition-all duration-100"
//                       style={{ width: `${fakeProgress}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1 text-left">
//                     {fakeProgress}% تکمیل شده
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
//                 onClick={handleProfileSubmit}
//                 disabled={showFakeLoading}
//               >
//                 {showFakeLoading ? "در حال ذخیره..." : "ذخیره"}
//               </button>
//               <button
//                 className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
//                 onClick={() => setIsProfileModalOpen(false)}
//                 disabled={showFakeLoading}
//               >
//                 لغو
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Password Change Modal */}
//       {isPasswordModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg flex flex-col gap-4">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
//               تغییر رمز عبور
//             </h2>
//             <div className="flex flex-col gap-3">
//               <input
//                 type="password"
//                 name="old_password"
//                 value={passwordFormData.old_password}
//                 onChange={handlePasswordInputChange}
//                 placeholder="رمز عبور قدیمی"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <input
//                 type="password"
//                 name="new_password"
//                 value={passwordFormData.new_password}
//                 onChange={handlePasswordInputChange}
//                 placeholder="رمز عبور جدید"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               <input
//                 type="password"
//                 name="confirm_password"
//                 value={passwordFormData.confirm_password}
//                 onChange={handlePasswordInputChange}
//                 placeholder="تأیید رمز عبور"
//                 className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
//               />
//               {passwordError && (
//                 <p className="text-red-600 text-sm mt-2">{passwordError}</p>
//               )}
//             </div>
//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
//                 onClick={handlePasswordSubmit}
//               >
//                 ذخیره
//               </button>
//               <button
//                 className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
//                 onClick={() => {
//                   setIsPasswordModalOpen(false);
//                   setPasswordError(null);
//                   setPasswordFormData({
//                     old_password: "",
//                     new_password: "",
//                     confirm_password: "",
//                   });
//                 }}
//               >
//                 لغو
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// UserProfile.propTypes = {
//   user: PropTypes.shape({
//     fullName: PropTypes.string,
//     email: PropTypes.string,
//     role: PropTypes.string,
//     phoneNumber: PropTypes.string,
//     joinDate: PropTypes.string,
//     lastLogin: PropTypes.string,
//     profilePicture: PropTypes.string,
//   }),
// };

// export default UserProfile;

import React, { useEffect, useState, useRef } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaBriefcase,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
} from "react-icons/fa";
import PropTypes from "prop-types";
import axiosInstance from "../utils/axiosInstance";
import { logout } from "../actions/authActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserProfileSkeleton from "./skeleton/UserProfileSkeleton";

const UserProfile = ({ user = {} }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showFakeLoading, setShowFakeLoading] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    birth_date: "",
    role: "",
    picture: null,
  });

  const [passwordFormData, setPasswordFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordError, setPasswordError] = useState(null);
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/accounts/profile/");
        setData(data);
        setFormData({
          email: data.email || "",
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone_number: data.phone_number || "",
          birth_date: data.birth_date || "",
          role: data.role || "",
          picture: null,
        });

        if (data.picture) {
          setProfilePicture(`http://192.168.8.36:8000${data.picture}`);
        }
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    let interval;
    if (showFakeLoading) {
      setFakeProgress(0);
      interval = setInterval(() => {
        setFakeProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowFakeLoading(false);
              setIsProfileModalOpen(false);
            }, 300);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [showFakeLoading]);

  const profileData = {
    fullName:
      data?.first_name && data?.last_name
        ? `${data.first_name} ${data.last_name}`
        : user.fullName || "کاربر ناشناس",
    email: data?.email || user.email || "ایمیل ثبت نشده",
    role: data?.role || user.role || "کاربر",
    phoneNumber: data?.phone_number || user.phone_number || "شماره ثبت نشده",
    joinDate: user.joinDate || "تاریخ دقیق در دسترس نیست",
    lastLogin: user.lastLogin || "تاریخ دقیق در دسترس نیست ",
    profilePicture: profilePicture || null,
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, picture: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(null);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setShowFakeLoading(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      setPasswordError("رمز عبور جدید و تأیید رمز عبور مطابقت ندارند.");
      return;
    }
    try {
      await axiosInstance.put("/accounts/profile/change-password/", {
        old_password: passwordFormData.old_password,
        new_password: passwordFormData.new_password,
      });
      setPasswordFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setIsPasswordModalOpen(false);
      setPasswordError(null);
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError("خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return <UserProfileSkeleton />;
  }

  if (error || (!user && !data)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-vazir">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 sm:p-8">
          <p className="text-center text-lg sm:text-xl font-medium text-red-600">
            اطلاعات کاربر در دسترس نیست.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-vazir">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 sm:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            پروفایل کاربر
          </h2>
          <button
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <FaEdit />
            ویرایش پروفایل
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mt-3 relative">
          {profileData.profilePicture ? (
            <div className="relative">
              <img
                src={profileData.profilePicture}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-100"
              />
              <button
                className="absolute bottom-0 right-0 bg-blue-200 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
                onClick={() => fileInputRef.current.click()}
              >
                <FaEdit className="text-blue-600 text-lg sm:text-xl" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          ) : (
            <div className="relative">
              <FaUserCircle className="text-8xl sm:text-9xl text-blue-200" />
              <button
                className="absolute bottom-0 right-0 bg-blue-200 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
                onClick={() => fileInputRef.current.click()}
              >
                <FaEdit className="text-blue-600 text-lg sm:text-xl" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>

        {/* Info Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-500">نام کامل</p>
              <p className="text-base sm:text-lg font-medium text-gray-900">
                {profileData.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-500">ایمیل</p>
              <p className="text-base sm:text-lg font-medium text-gray-900">
                {profileData.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaBriefcase className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-500">شماره تلفن</p>
              <p className="text-base sm:text-lg font-medium text-gray-900">
                {profileData.phoneNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaBriefcase className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-500">نقش</p>
              <p className="text-base sm:text-lg font-medium text-gray-900">
                {profileData.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-500">تاریخ عضویت</p>
              <p className="text-base sm:text-lg font-medium text-gray-900">
                {profileData.joinDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-500">آخرین ورود</p>
              <p className="text-base sm:text-lg font-medium text-gray-900">
                {profileData.lastLogin}
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            تغییر رمز عبور
          </button>
          <button
            className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            onClick={handleLogout}
          >
            خروج از حساب
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              ویرایش پروفایل
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleProfileInputChange}
                placeholder="نام کاربری"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleProfileInputChange}
                placeholder="نام"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleProfileInputChange}
                placeholder="نام خانوادگی"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileInputChange}
                placeholder="ایمیل"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleProfileInputChange}
                placeholder="شماره تلفن"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleProfileInputChange}
                placeholder="تاریخ تولد"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleProfileInputChange}
                placeholder="نقش"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <div className="flex items-center gap-3">
                <button
                  className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => modalFileInputRef.current.click()}
                >
                  <FaCamera className="text-xl sm:text-2xl" />
                </button>
                <input
                  type="file"
                  ref={modalFileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.picture && (
                  <span className="text-sm text-gray-500">
                    {formData.picture.name}
                  </span>
                )}
              </div>

              {showFakeLoading && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">
                    در حال ذخیره تغییرات...
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-100"
                      style={{ width: `${fakeProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-left">
                    {fakeProgress}% تکمیل شده
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                onClick={handleProfileSubmit}
                disabled={showFakeLoading}
              >
                {showFakeLoading ? "در حال ذخیره..." : "ذخیره"}
              </button>
              <button
                className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                onClick={() => setIsProfileModalOpen(false)}
                disabled={showFakeLoading}
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              تغییر رمز عبور
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                name="old_password"
                value={passwordFormData.old_password}
                onChange={handlePasswordInputChange}
                placeholder="رمز عبور قدیمی"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <input
                type="password"
                name="new_password"
                value={passwordFormData.new_password}
                onChange={handlePasswordInputChange}
                placeholder="رمز عبور جدید"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              <input
                type="password"
                name="confirm_password"
                value={passwordFormData.confirm_password}
                onChange={handlePasswordInputChange}
                placeholder="تأیید رمز عبور"
                className="p-3 border border-gray-300 rounded-lg w-full text-right text-base sm:text-lg"
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={handlePasswordSubmit}
              >
                ذخیره
              </button>
              <button
                className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError(null);
                  setPasswordFormData({
                    old_password: "",
                    new_password: "",
                    confirm_password: "",
                  });
                }}
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    phoneNumber: PropTypes.string,
    joinDate: PropTypes.string,
    lastLogin: PropTypes.string,
    profilePicture: PropTypes.string,
  }),
};

export default UserProfile;
