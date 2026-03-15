import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { authService } from '../services/testService';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = ({ isDark, onThemeToggle, onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Demo credentials (kept for fallback)
    const DEMO_CREDENTIALS = { id: 'STU2025001', password: 'student123' };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Try real API authentication first
            const response = await authService.login(formData.id, formData.password);

            // Store token and user data
            localStorage.setItem('authToken', response.token);
            // Ensure we store only the user object in userData
            localStorage.setItem('userData', JSON.stringify(response.user || response));

            onLogin('student');
            navigate('/');
        } catch (err) {
            // Fallback to demo credentials for development
            if (formData.id === DEMO_CREDENTIALS.id && formData.password === DEMO_CREDENTIALS.password) {
                // Store demo user data
                const demoUser = {
                    email: formData.id,
                    name: 'Demo Student',
                    role: 'student'
                };
                localStorage.setItem('userData', JSON.stringify(demoUser));
                onLogin('student');
                navigate('/');
            } else {
                setError(err.message || 'Invalid credentials. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            // Map Google user data to app user structure
            const user = {
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                role: 'student',
                id: decoded.email // Use email as ID for Google users
            };

            localStorage.setItem('authToken', credentialResponse.credential);
            localStorage.setItem('userData', JSON.stringify(user));

            onLogin('student');
            navigate('/');
        } catch (error) {
            console.error('Google Auth Error:', error);
            setError('Failed to process Google Login.');
        }
    };

    const handleGoogleError = () => {
        setError('Google Login Failed. Please try again.');
    };

    // Eye icons for password visibility toggle
    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    );

    const EyeOffIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    );

    return (
        <div className="login-page">
            {/* Decorative Background Elements - Math Symbols */}
            <div className="login-bg-decoration">
                <span className="math-symbol symbol-1">π</span>
                <span className="math-symbol symbol-2">∑</span>
                <span className="math-symbol symbol-3">√</span>
                <span className="math-symbol symbol-4">∫</span>
                <span className="math-symbol symbol-5">∞</span>
                <span className="math-symbol symbol-6">÷</span>
                <span className="math-symbol symbol-7">×</span>
                <span className="math-symbol symbol-8">+</span>
                <span className="math-symbol symbol-9">=</span>
                <span className="math-symbol symbol-10">%</span>
                <span className="math-symbol symbol-11">42</span>
                <span className="math-symbol symbol-12">7</span>
                <span className="math-symbol symbol-13">∆</span>
                <span className="math-symbol symbol-14">θ</span>
            </div>

            <div className="login-container">
                {/* Theme Toggle */}
                <div className="login-theme-toggle">
                    <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
                </div>

                <div className="login-header">
                    <img src="/gradeflow-logo.png" alt="Gradeflow" className="login-logo-img" style={{ width: '80px', marginBottom: '1rem' }} />
                    <p>Sign in to continue</p>
                </div>

                {/* Student Login Title */}
                <div className="login-title">
                    <h2>Student Login</h2>
                </div>

                {/* Login Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="id">Roll Number</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleInputChange}
                            placeholder="e.g. STU2025001"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="login-spinner"></span>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>

                <div className="google-login-container" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div className="divider" style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1rem' }}>
                        <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}></span>
                        <span style={{ padding: '0 10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>OR</span>
                        <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}></span>
                    </div>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme={isDark ? "filled_black" : "outline"}
                        shape="pill"
                        width="300" // Adjust as needed
                    />
                </div>

                {/* Demo Credentials */}
                <div className="demo-credentials">
                    <p>Demo Credentials:</p>
                    <span>ID: <code>STU2025001</code> | Password: <code>student123</code></span>
                </div>
            </div>
        </div>
    );
};

export default Login;
