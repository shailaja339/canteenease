import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminQueue from './pages/AdminQueue';
import AdminFoods from './pages/AdminFoods';
import StaffRatings from './pages/StaffRatings';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/queue" element={<AdminQueue />} />
          <Route path="/admin/foods" element={<AdminFoods />} />
          <Route path="/admin/ratings" element={<StaffRatings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staff/login" element={<Login />} />
          <Route path="/staff/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
