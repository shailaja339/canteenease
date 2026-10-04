import React from 'react';
import './FoodCard.css';

const categoryEmoji = {
  'Breakfast': '🥞',
  'Snacks': '🍟',
  'Main Course': '🍛',
  'Beverages': '☕',
  'Desserts': '🍰',
  'Fast Food': '🍔',
};

const defaultFoodImages = {
  Breakfast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
  Snacks: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=80',
  'Main Course': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  Beverages: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
  Desserts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
  'Fast Food': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
};

const getFoodImage = (food) => {
  if (food?.image && (food.image.startsWith('http') || food.image.startsWith('/'))) return food.image;
  if (food?.category && defaultFoodImages[food.category]) return defaultFoodImages[food.category];
  return 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80';
};

const FoodCard = ({ food, onAddToCart }) => {
  const imageUrl = getFoodImage(food);

  return (
    <div className={`food-card ${!food.isAvailable ? 'food-card-unavailable' : ''}`}>
      {/* Food visual */}
      <div className="food-image-area">
        <img src={imageUrl} alt={food.name} className="food-image" onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80';
        }} />
        {food.isVegetarian && (
          <span className="veg-indicator" title="Vegetarian">🟢</span>
        )}
        {!food.isVegetarian && (
          <span className="non-veg-indicator" title="Non-Vegetarian">🔴</span>
        )}
        {!food.isAvailable && (
          <div className="sold-out-overlay">Sold Out</div>
        )}
      </div>

      {/* Food info */}
      <div className="food-info">
        <div className="food-header">
          <h3 className="food-name">{food.name}</h3>
          <span className="food-category">{food.category}</span>
        </div>

        <p className="food-desc">{food.description}</p>

        <div className="food-rating" aria-label={`${food.rating || 0} out of 5 stars from ${food.ratingCount || 0} ratings`}>
          <span>{'★'.repeat(Math.round(food.rating || 0))}{'☆'.repeat(5 - Math.round(food.rating || 0))}</span>
          <strong>{Number(food.rating || 0).toFixed(1)}</strong>
          <small>({food.ratingCount || 0} ratings)</small>
        </div>

        <div className="food-footer">
          <div className="food-price-area">
            <span className="food-price">₹{food.price}</span>
            {food.preparationTime && (
              <span className="prep-time">⏱ {food.preparationTime} min</span>
            )}
          </div>
          <button
            className="add-to-cart-btn"
            disabled={!food.isAvailable}
            onClick={() => onAddToCart(food)}
          >
            {food.isAvailable ? '+ Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
