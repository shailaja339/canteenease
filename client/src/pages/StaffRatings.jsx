import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './StaffRatings.css';

const StaffRatings = () => {
  const { user } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get('/ratings');
        setRatings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ratings');
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  if (loading) return <div className="loading">Loading Ratings...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  const groupedRatings = ratings.reduce((groups, rating) => {
    const foodId = rating.food?._id || 'unknown';
    if (!groups[foodId]) groups[foodId] = { food: rating.food, ratings: [] };
    groups[foodId].ratings.push(rating);
    return groups;
  }, {});

  return (
    <div className="staff-ratings-page">
      <div className="staff-ratings-header">
        <h2>Food Ratings & Reviews</h2>
        <span>{ratings.length} review{ratings.length === 1 ? '' : 's'}</span>
      </div>
      {Object.values(groupedRatings).length === 0 ? (
        <p className="staff-ratings-empty">No student ratings yet.</p>
      ) : (
        <div className="staff-ratings-list">
          {Object.values(groupedRatings).map(({ food, ratings: foodRatings }) => (
            <section className="staff-rating-food" key={food?._id}>
              <div className="staff-rating-food-header">
                <h3>{food?.name || 'Food item'}</h3>
                <strong>★ {Number(food?.rating || 0).toFixed(1)} ({food?.ratingCount || foodRatings.length})</strong>
              </div>
              {foodRatings.map((item) => (
                <article className="staff-review" key={item._id}>
                  <div className="staff-review-stars">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>
                  <p>{item.review || 'No written review.'}</p>
                  <small>{item.student?.name || 'Student'} · {new Date(item.createdAt).toLocaleDateString()}</small>
                </article>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffRatings;
