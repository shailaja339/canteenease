import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🍽️ CanteenEase</Link>
      </div>

      {/* Hamburger for mobile */}
      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {user ? (
          <>
            {user.role === 'admin' && (
              <>
                <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Staff Dashboard</Link></li>
                <li><Link to="/admin/queue" onClick={() => setMenuOpen(false)}>Live Queue</Link></li>
                <li><Link to="/admin/foods" onClick={() => setMenuOpen(false)}>Manage Menu</Link></li>
                <li><Link to="/admin/ratings" onClick={() => setMenuOpen(false)}>Ratings</Link></li>
                <li><NotificationBell /></li>
              </>
            )}
            {user.role !== 'admin' && (
              <>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                <li><Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link></li>
                <li><Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link></li>
                <li><NotificationBell /></li>
                <li>
                  <Link to="/cart" onClick={() => setMenuOpen(false)}>
                    🛒 Cart {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                  </Link>
                </li>
              </>
            )}
            <li>
              <span className="user-greeting">Hi, {user.name?.split(' ')[0]}!</span>
            </li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
            <li><Link to="/staff/login" onClick={() => setMenuOpen(false)}>Staff Portal</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
