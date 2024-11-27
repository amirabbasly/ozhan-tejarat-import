// src/components/Login.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        await dispatch(login({ email, password }));
        if (auth.isAuthenticated) {
            navigate('/');
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate('/');
        }
    }, [auth.isAuthenticated, navigate]);

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>ورود به حساب کاربری</h2>
                {auth.error && <p className="error-message">{auth.error.detail || 'Login failed.'}</p>}
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            placeholder="نام کاربری"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            placeholder="رمز عبور"
                        />
                    </div>
                    <div className="remember-me">
                        <input type="checkbox" id="rememberMe" />
                        <label htmlFor="rememberMe">مرا به خاطر بسپار</label>
                    </div>
                    <button type="submit" className="login-button">
                        ورود
                    </button>
                </form>
            </div>
            <footer className="login-footer">
                تمامی حقوق متعلق به عمران ابنیه میباشد ©
            </footer>
        </div>
    );
};

export default Login;
