import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import { CartContext } from '../context/CartContext';
import './Menu.css';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const { addToCart } = useContext(CartContext);

  const categories = ['All', 'Main Food', 'Cold Drinks', 'Fruit Juices', 'Ice Cream', 'Breakfast', 'Snacks', 'Main Course', 'Beverages', 'Desserts', 'Fast Food', 'South Indian', 'Breakfast/Main', 'Main/Snacks', 'Snacks/Main', 'Indo-Chinese', 'Dessert'];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get('/foods');
        setFoods(res.data);
      } catch (err) {
        setError('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
    const refreshOnFocus = () => fetchFoods();
    window.addEventListener('focus', refreshOnFocus);
    return () => window.removeEventListener('focus', refreshOnFocus);
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food);
    alert(`Added ${food.name} to cart`);
  };

  const filteredFoods = foods.filter(food => {
    const matchSearch = food.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || food.category === category;
    return matchSearch && matchCategory;
  });

  if (loading) return <div className="loading">Loading Menu...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="menu-page">
      <h2>Canteen Menu</h2>
      
      <div className="menu-filters">
        <input 
          type="text" 
          placeholder="Search food..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="food-grid">
        {filteredFoods.length > 0 ? (
          filteredFoods.map(food => (
            <FoodCard key={food._id} food={food} onAddToCart={handleAddToCart} />
          ))
        ) : (
          <p>No food items found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
