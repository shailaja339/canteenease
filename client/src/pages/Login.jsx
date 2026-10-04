import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isStaffLogin = location.pathname.startsWith('/staff');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      navigate(result.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍽️</div>
        <h2>{isStaffLogin ? 'Canteen Staff Login' : 'Welcome Back!'}</h2>
        <p className="auth-subtitle">{isStaffLogin ? 'Access staff order and menu management' : 'Login to your CanteenEase account'}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@college.edu"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to={isStaffLogin ? '/staff/register' : '/register'}>Register here</Link>
        </p>

        {!isStaffLogin && (
          <p className="auth-switch">
            Canteen staff? <Link to="/staff/login">Open Staff Portal</Link>
          </p>
        )}

        <div className="auth-demo-info">
          <strong>Demo Credentials:</strong><br />
          Admin: admin@canteenease.com / admin123<br />
          Student: student@college.edu / student123
        </div>
      </div>
    </div>
  );
};

export default Login;
