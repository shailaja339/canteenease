import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Poll for new orders every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Canteen Staff Dashboard - Order Management</h2>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>New Orders</h3>
          <p>{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="stat-card">
          <h3>Preparing</h3>
          <p>{orders.filter(o => o.status === 'preparing').length}</p>
        </div>
        <div className="stat-card">
          <h3>Ready</h3>
          <p>{orders.filter(o => o.status === 'ready').length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{orders.filter(o => o.status === 'completed').length}</p>
        </div>
      </div>

      <div className="admin-orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Token</th>
              <th>Student</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Order Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td><strong>{order.pickupToken}</strong></td>
                <td>{order.student?.name}</td>
                <td>{order.items?.map(item => `${item.name} x${item.quantity}`).join(', ')}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.paymentMethod}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
