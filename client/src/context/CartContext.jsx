import React, { createContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food) => {
    const existItem = cartItems.find((x) => x.food === food._id);
    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.food === existItem.food ? { ...existItem, quantity: existItem.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { 
        food: food._id, 
        name: food.name, 
        price: food.price, 
        image: food.image, 
        quantity: 1 
      }]);
    }
    showToast('success', `${food.name} added to cart.`);
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((x) =>
        x.food === id ? { ...x, quantity: qty } : x
      )
    );
    showToast('info', 'Cart updated.');
  };

  const removeFromCart = (id) => {
    const removedItem = cartItems.find((item) => item.food === id);
    setCartItems(cartItems.filter((x) => x.food !== id));
    if (removedItem) {
      showToast('info', `${removedItem.name} removed from cart.`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('info', 'Cart cleared.');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
