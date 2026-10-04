const express = require('express');
const router = express.Router();
const {
    createRating,
    getFoodRatings,
    getAllRatings
} = require('../controllers/ratingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createRating);
router.get('/food/:foodId', getFoodRatings);
router.get('/', protect, admin, getAllRatings);

module.exports = router;
