import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './AdminFoods.css';

const AdminFoods = () => {
  const { user } = useContext(AuthContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editFood, setEditFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Snacks',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 10,
  });
  const [message, setMessage] = useState('');

  const categories = ['Main Food', 'Cold Drinks', 'Fruit Juices', 'Ice Cream', 'Breakfast', 'Snacks', 'Main Course', 'Beverages', 'Desserts', 'Fast Food', 'South Indian', 'Breakfast/Main', 'Main/Snacks', 'Snacks/Main', 'Indo-Chinese', 'Dessert'];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await api.get('/foods');
      setFoods(res.data);
    } catch (err) {
      console.error('Failed to fetch foods');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editFood) {
        await api.put(`/foods/${editFood._id}`, formData);
        setMessage('Food item updated successfully!');
      } else {
        await api.post('/foods', formData);
        setMessage('Food item added successfully!');
      }
      fetchFoods();
      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (food) => {
    setEditFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      isVegetarian: food.isVegetarian,
      isAvailable: food.isAvailable,
      preparationTime: food.preparationTime,
    });
    setShowForm(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/foods/${id}`);
      setMessage('Food item deleted.');
      fetchFoods();
    } catch (err) {
      setMessage('Failed to delete item');
    }
  };

  const toggleAvailability = async (food) => {
    try {
      await api.put(`/foods/${food._id}`, { ...food, isAvailable: !food.isAvailable });
      fetchFoods();
    } catch (err) {
      alert('Failed to toggle availability');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditFood(null);
    setFormData({
      name: '', description: '', price: '', category: 'Snacks',
      isVegetarian: false, isAvailable: true, preparationTime: 10,
    });
  };

  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  if (loading) return <div className="loading">Loading Foods...</div>;

  return (
    <div className="admin-foods-page">
      <div className="admin-foods-header">
        <h2>🍽️ Food Menu Management</h2>
        <button className="add-food-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add New Item
        </button>
      </div>

      {message && <div className="food-message">{message}</div>}

      {showForm && (
        <div className="food-form-container">
          <h3>{editFood ? 'Edit Food Item' : 'Add New Food Item'}</h3>
          <form className="food-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Food Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Masala Dosa"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the food item..."
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Prep Time (minutes)</label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  min="1"
                  max="60"
                />
              </div>
            </div>

            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleChange}
                />
                🟢 Vegetarian
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
                ✅ Available
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editFood ? 'Update Item' : 'Add Item'}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="foods-table-container">
        <table className="foods-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Prep Time</th>
              <th>Type</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(food => (
              <tr key={food._id}>
                <td><strong>{food.name}</strong></td>
                <td><span className="category-tag">{food.category}</span></td>
                <td>₹{food.price}</td>
                <td>{food.preparationTime} min</td>
                <td>{food.isVegetarian ? '🟢 Veg' : '🔴 Non-Veg'}</td>
                <td>
                  <button
                    className={`availability-btn ${food.isAvailable ? 'available' : 'unavailable'}`}
                    onClick={() => toggleAvailability(food)}
                  >
                    {food.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(food)}>✏️ Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(food._id)}>🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {foods.length === 0 && (
          <div className="no-foods">No food items found. Add some items above.</div>
        )}
      </div>
    </div>
  );
};

export default AdminFoods;
