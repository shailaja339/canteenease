import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash at Counter');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    try {
      const orderData = {
        items: cartItems,
        paymentMethod
      };
      
      const res = await api.post('/orders', orderData);
      clearCart();
      // Navigate to order tracking page
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {error && <p className="error-msg">{error}</p>}
      
      <div className="checkout-container">
        <div className="checkout-student-info">
          <h3>Student Details</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Student ID:</strong> {user?.studentId}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.food} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <h3>Total: ₹{subtotal}</h3>
          </div>
          <div className="payment-method">
            <p><strong>Payment Method</strong></p>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Cash at Counter"
                checked={paymentMethod === 'Cash at Counter'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Cash at Counter
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Online Payment"
                checked={paymentMethod === 'Online Payment'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Online Payment
            </label>
            <p><strong>Pickup:</strong> Canteen Counter</p>
          </div>
          <button 
            className="btn-place-order" 
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order & Get Token'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
