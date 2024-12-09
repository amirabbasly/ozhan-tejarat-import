// src/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const LoginForm = () => {
    const [captchaUrl, setCaptchaUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCsrfTokenAndCaptcha = async () => {
            try {
                // Fetch CSRF token
                await axiosInstance.get('/get_csrf_token/');
                console.log('CSRF token fetched');

                // Fetch CAPTCHA image
                const captchaResponse = await axiosInstance.get('/get_captcha/', {
                    responseType: 'blob',
                });
                const captchaBlob = new Blob([captchaResponse.data], { type: 'image/png' });
                setCaptchaUrl(URL.createObjectURL(captchaBlob));
                console.log('Captcha fetched');
            } catch (err) {
                console.error('Failed to fetch CSRF token or CAPTCHA:', err);
                setError('Failed to load CAPTCHA. Please try again.');
            }
        };

        fetchCsrfTokenAndCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password || !captchaText) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axiosInstance.post('/login-to-epl/', {
                username,
                password,
                captcha_text: captchaText,
            });
            console.log('Login response:', response.data);
            if (response.data.status === 'success') {
                setSuccess('Logged in successfully!');
                // Redirect or perform other actions as needed
            } else {
                setError(response.data.message || 'Login failed.');
                // Optionally, reload CAPTCHA here
            }
        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            // Optionally, reload CAPTCHA here
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    {captchaUrl && <img src={captchaUrl} alt="CAPTCHA" />}
                </div>
                <div>
                    <label>Enter CAPTCHA:</label>
                    <input
                        type="text"
                        value={captchaText}
                        onChange={(e) => setCaptchaText(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
