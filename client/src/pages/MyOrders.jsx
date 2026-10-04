import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading Orders...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>You haven't placed any orders yet</h2>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <Link to={`/orders/${order._id}`} key={order._id} className="order-card-link">
            <div className="order-card">
              <div className="order-card-header">
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className={`order-status ${order.status}`}>{order.status.toUpperCase()}</span>
              </div>
              <div className="order-card-body">
                <div className="order-token">Token: {order.pickupToken}</div>
                <div className="order-id-small">{order.orderId}</div>
                <div className="order-amount">₹{order.totalAmount}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
