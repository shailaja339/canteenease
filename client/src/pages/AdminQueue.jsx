import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './AdminQueue.css';

const AdminQueue = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling every 5 seconds for live queue feel
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="admin-queue-page">
      <h2>Live Pickup Queue</h2>
      
      <div className="queue-container">
        
        <div className="queue-column preparing-column">
          <h3>Now Preparing</h3>
          <div className="token-grid">
            {preparingOrders.length > 0 ? (
              preparingOrders.map(order => (
                <div key={order._id} className="queue-token token-preparing">
                  Token {order.pickupToken}
                </div>
              ))
            ) : (
              <p className="empty-text">No orders preparing right now</p>
            )}
          </div>
        </div>

        <div className="queue-column ready-column">
          <h3>READY FOR PICKUP</h3>
          <div className="token-grid">
            {readyOrders.length > 0 ? (
              readyOrders.map(order => (
                <div key={order._id} className="queue-token token-ready">
                  Token {order.pickupToken}
                </div>
              ))
            ) : (
              <p className="empty-text">No orders ready for pickup</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminQueue;
