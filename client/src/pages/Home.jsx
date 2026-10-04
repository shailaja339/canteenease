import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0 });
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    // Fetch a few featured foods
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/foods');
        // Pick top 4 items
        setFeaturedFoods(res.data.slice(0, 4));
      } catch (err) {
        // If backend not running, we just show no foods
      }
    };
    fetchFeatured();

    // If user logged in, fetch their recent orders
    if (user) {
      const fetchStats = async () => {
        try {
          const res = await api.get('/orders/my');
          const pending = res.data.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length;
          setStats({ totalOrders: res.data.length, pendingOrders: pending });
          setLatestOrder(res.data[0] || null);
        } catch (err) {
          setStats({ totalOrders: 0, pendingOrders: 0 });
          setLatestOrder(null);
        }
      };
      fetchStats();
    } else {
      setStats({ totalOrders: 0, pendingOrders: 0 });
      setLatestOrder(null);
    }
  }, [user]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">🍽️ Smart College Canteen</span>
          <h1 className="hero-title">
            Skip the Queue,<br />
            <span className="hero-highlight">Pre-Order & Pickup!</span>
          </h1>
          <p className="hero-subtitle">
            Order your favourite canteen food in advance. Get a smart token. 
            Walk in, pick up, and go — no waiting, no stress.
          </p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn-primary">
              🛒 Browse Menu
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary">
                Get Started Free
              </Link>
            )}
            {user && (
              <Link to="/orders" className="btn-secondary">
                My Orders
              </Link>
            )}
          </div>
        </div>
        <div className="hero-illustration">
          <div
            className="canteen-visual"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/36159723/pexels-photo-36159723.jpeg?auto=compress&cs=tinysrgb&w=1400')"
            }}
          >
            {user && (
              latestOrder ? (
                <div className="token-card">
                  <div className="token-label">Your Pickup Token</div>
                  <div className="token-number">🎫 {latestOrder.pickupToken}</div>
                  <div className={`token-status ${latestOrder.status === 'ready' ? 'ready' : 'pending'}`}>
                    {latestOrder.status === 'ready' ? 'Ready for Pickup!' : `Status: ${latestOrder.status}`}
                  </div>
                </div>
              ) : (
                <div className="token-card empty-token-card">
                  <div className="token-label">No Active Order</div>
                  <div className="token-number">🎫 —</div>
                  <div className="token-status pending">Place your first order to get a token</div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar (only for logged in users) */}
      {user && (
        <section className="user-stats-bar">
          <div className="stat-item">
            <span className="stat-number">{stats.totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.pendingOrders}</span>
            <span className="stat-label">Active Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{cartItems.length}</span>
            <span className="stat-label">Cart Items</span>
          </div>
          <div className="stat-item">
            <Link to="/cart" className="stat-cta">Go to Cart →</Link>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p className="section-subtitle">Simple, fast, and stress-free food ordering for college students</p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📱</div>
            <h3>Browse & Order</h3>
            <p>Browse the canteen menu, pick your items, and place your order anytime before you arrive.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🎫</div>
            <h3>Get Smart Token</h3>
            <p>Instantly receive a unique pickup token number. This is your place in the queue.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">🔔</div>
            <h3>Get Notified</h3>
            <p>Real-time status updates — Pending → Preparing → Ready. Know exactly when your food is ready.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-icon">🍱</div>
            <h3>Pick Up & Go!</h3>
            <p>Show your token at the counter. No waiting. Just grab your food and enjoy!</p>
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      {featuredFoods.length > 0 && (
        <section className="featured-section">
          <h2>Popular Today</h2>
          <p className="section-subtitle">Freshly prepared favourites from the canteen</p>
          <div className="featured-grid">
            {featuredFoods.map(food => (
              <div key={food._id} className="featured-card">
                <div className="featured-emoji">{getCategoryEmoji(food.category)}</div>
                <div className="featured-info">
                  <h4>{food.name}</h4>
                  <p className="featured-category">{food.category}</p>
                  <div className="featured-footer">
                    <span className="featured-price">₹{food.price}</span>
                    {food.isVegetarian && <span className="veg-badge">🟢 Veg</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/menu" className="view-all-link">View Full Menu →</Link>
        </section>
      )}

      {/* Features */}
      <section className="features-section">
        <h2>Why CanteenEase?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <h4>Save Time</h4>
            <p>No more standing in long queues during lunch break.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <h4>Track Your Order</h4>
            <p>Live order status from confirmed to ready for pickup.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h4>Secure Login</h4>
            <p>JWT-based authentication for safe and private ordering.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <h4>Mobile Friendly</h4>
            <p>Works perfectly on your phone, tablet, or laptop.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👨‍💼</span>
            <h4>Admin Panel</h4>
            <p>Canteen staff can manage orders and update status in real-time.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <h2>Ready to Skip the Queue?</h2>
          <p>Join hundreds of students already ordering smarter at the canteen.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">Create Account</Link>
            <Link to="/login" className="btn-outline">Login</Link>
          </div>
        </section>
      )}

      <footer className="home-footer">
        <p>CanteenEase &copy; {new Date().getFullYear()} &mdash; Smart College Canteen Pre-Order System</p>
        <p>Built with React + Node.js + MongoDB</p>
      </footer>
    </div>
  );
};

const getCategoryEmoji = (category) => {
  const map = {
    'Breakfast': '🥞',
    'Snacks': '🍟',
    'Main Course': '🍛',
    'Beverages': '☕',
    'Desserts': '🍰',
    'Fast Food': '🍔',
  };
  return map[category] || '🍽️';
};

export default Home;
