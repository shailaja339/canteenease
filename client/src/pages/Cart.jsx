import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.food} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
            </div>
            <div className="cart-item-actions">
              <button onClick={() => updateQuantity(item.food, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.food, item.quantity + 1)}>+</button>
              <button className="btn-danger" onClick={() => removeFromCart(item.food)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>Subtotal: ₹{subtotal}</h3>
        <div className="cart-buttons">
          <button className="btn-danger" onClick={clearCart}>Clear Cart</button>
          <button className="btn-primary" onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
