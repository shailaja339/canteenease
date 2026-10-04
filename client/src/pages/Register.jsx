import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    staffCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isStaffRegistration = location.pathname.startsWith('/staff');

  const { name, studentId, email, phone, password, confirmPassword, staffCode } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const result = await register({ name, studentId, email, phone, password, ...(isStaffRegistration && { staffCode }) });
      navigate(result.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">🍽️</div>
        <h2>{isStaffRegistration ? 'Register Canteen Staff' : 'Create Account'}</h2>
        <p className="auth-subtitle">{isStaffRegistration ? 'Staff registration requires an invite code' : 'Join CanteenEase and skip the queue!'}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-grid">
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            {isStaffRegistration && (
              <div className="auth-field">
                <label htmlFor="staffCode">Staff Invite Code</label>
                <input
                  id="staffCode"
                  type="password"
                  name="staffCode"
                  required
                  value={staffCode}
                  onChange={handleChange}
                  placeholder="Enter staff invite code"
                />
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="studentId">Student ID / Roll Number</label>
              <input
                id="studentId"
                type="text"
                name="studentId"
                required
                value={studentId}
                onChange={handleChange}
                placeholder="e.g. CS2023001"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="email">College Email</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={email}
                onChange={handleChange}
                placeholder="student@college.edu"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                required
                value={phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                required
                minLength="6"
                value={password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                minLength="6"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to={isStaffRegistration ? '/staff/login' : '/login'}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
