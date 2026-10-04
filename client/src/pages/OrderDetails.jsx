import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingForms, setRatingForms] = useState({});
  const [ratedFoods, setRatedFoods] = useState([]);
  const [ratingMessage, setRatingMessage] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateRatingForm = (foodId, field, value) => {
    setRatingForms((current) => ({
      ...current,
      [foodId]: { rating: 5, review: '', ...current[foodId], [field]: value }
    }));
  };

  const submitRating = async (foodId) => {
    const form = ratingForms[foodId] || { rating: 5, review: '' };
    try {
      await api.post('/ratings', { food: foodId, order: order._id, ...form });
      setRatedFoods((current) => [...current, foodId]);
      setRatingMessage('Rating submitted. Thank you for your feedback!');
    } catch (err) {
      setRatingMessage(err.response?.data?.message || 'Unable to submit rating');
    }
  };

  useEffect(() => {
    fetchOrder();
    
    // Polling for real-time like updates (every 5 seconds)
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="loading">Loading Order...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!order) return <div className="error-msg">Order not found</div>;

  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="order-details-page">
      <div className="order-header">
        <h2>Order Confirmation</h2>
        <div className="order-id">ID: {order.orderId}</div>
      </div>

      <div className="pickup-token-card">
        <h3>Smart Pickup Token</h3>
        <div className="token-number">{order.pickupToken}</div>
        <p className="token-status">Status: <strong>{order.status.toUpperCase()}</strong></p>
      </div>

      <div className="order-tracking">
        <h3>Live Tracking</h3>
        <div className="tracking-progress">
          {statuses.map((status, index) => (
            <div 
              key={status} 
              className={`tracking-step ${index <= currentStatusIndex ? 'active' : ''} ${index === currentStatusIndex ? 'current' : ''}`}
            >
              <div className="step-circle">{index <= currentStatusIndex ? '✓' : ''}</div>
              <div className="step-label">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary-details">
        <h3>Order Items</h3>
        <ul>
          {order.items.map((item) => (
            <li key={item._id}>
              {item.name} x {item.quantity} <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="order-total">
          <strong>Total Amount:</strong> <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {order.status === 'completed' && (
        <div className="order-rating-section">
          <h3>Rate Your Food</h3>
          {ratingMessage && <p className="rating-message">{ratingMessage}</p>}
          {order.items.map((item) => (
            <div className="order-rating-item" key={item._id || item.food}>
              <strong>{item.name}</strong>
              {ratedFoods.includes(item.food) ? (
                <span className="rating-submitted">Rating submitted</span>
              ) : (
                <>
                  <div className="star-picker" role="group" aria-label={`Rate ${item.name}`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        type="button"
                        key={value}
                        className={(ratingForms[item.food]?.rating || 5) >= value ? 'selected' : ''}
                        onClick={() => updateRatingForm(item.food, 'rating', value)}
                      >★</button>
                    ))}
                  </div>
                  <textarea
                    value={ratingForms[item.food]?.review || ''}
                    onChange={(event) => updateRatingForm(item.food, 'review', event.target.value)}
                    placeholder="Optional review"
                    rows="2"
                  />
                  <button type="button" className="btn-primary" onClick={() => submitRating(item.food)}>
                    Submit Rating
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      
      <Link to="/menu" className="btn-primary" style={{marginTop: '2rem', display: 'inline-block'}}>
        Back to Menu
      </Link>
    </div>
  );
};

export default OrderDetails;
