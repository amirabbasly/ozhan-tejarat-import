// // src/components/Login.js

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../actions/authActions";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import "../style/Login.css";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const auth = useSelector((state) => state.auth);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   const { email, password } = formData;

//   const onChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     await dispatch(login({ email, password }));
//     if (auth.isAuthenticated) {
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     if (auth.isAuthenticated) {
//       navigate("/");
//     }
//   }, [auth.isAuthenticated, navigate]);

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2>ورود به حساب کاربری</h2>
//         {auth.error && (
//           <p className="error-message">
//             {auth.error.detail || "Login failed."}
//           </p>
//         )}
//         <form onSubmit={onSubmit}>
//           <div className="form-group">
//             <input
//               type="email"
//               name="email"
//               value={email}
//               onChange={onChange}
//               required
//               placeholder="نام کاربری"
//             />
//           </div>
//           <div className="form-group password-field">
//   <input
//     type={showPassword ? "text" : "password"}
//     name="password"
//     value={password}
//     onChange={onChange}
//     required
//     placeholder="رمز عبور"
//   />
//   <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
//     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//   </span>
// </div>

//           <div className="remember-me">
//             <input type="checkbox" id="rememberMe" />
//             <label htmlFor="rememberMe">مرا به خاطر بسپار</label>
//           </div>
//           <button type="submit" className="login-button">
//             ورود
//           </button>
//         </form>
//       </div>
//       <footer className="login-footer">
//         تمامی حقوق متعلق به اوژن تجارت کیان میباشد ©
//       </footer>
//     </div>
//   );
// };

// export default Login;

// src/components/Login.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/authActions";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import "../style/Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error("لطفا همه فیلدها را پر کنید");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("لطفا ایمیل معتبر وارد کنید");
      return;
    }

    if (password.length < 6) {
      toast.error("رمز عبور باید حداقل 6 کاراکتر باشد");
      return;
    }

    try {
      setIsLoading(true); // شروع لودینگ هنگام ارسال درخواست
      await dispatch(login({ email, password }));
      // **اینجا دیگه auth.error رو چک نکن**
    } catch (error) {
      setIsLoading(false);
      toast.error(auth.error?.detail || "ورود ناموفق بود. لطفا دوباره تلاش کنید");
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      toast.success("ورود با موفقیت انجام شد");
      // نگه داشتن لودینگ ۲ ثانیه و سپس رفتن به صفحه اصلی
      const timer = setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (auth.error) {
      setIsLoading(false); // خطا داشتیم، لودینگ رو خاموش کن
      toast.error(auth.error.detail || "Login failed.");
    }
  }, [auth.isAuthenticated, auth.error, navigate]);

  return (
    <div className="login-container min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="login-box bg-white shadow-xl rounded-2xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          ورود به حساب کاربری
        </h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="نام کاربری"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-gray-700 placeholder-gray-400 transition-colors duration-200"
            />
          </div>
          <div className="form-group relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="رمز عبور"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-gray-700 placeholder-gray-400 transition-colors duration-200"
            />
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
              مرا به خاطر بسپار
            </label>
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" size={20} />
                <span>در حال ورود...</span>
              </>
            ) : (
              "ورود"
            )}
          </button>
        </form>
      </div>
      <footer className="login-footer mt-8 text-center text-gray-500 text-sm">
        تمامی حقوق متعلق به اوژن تجارت کیان میباشد ©
      </footer>
    </div>
  );
};

export default Login;
