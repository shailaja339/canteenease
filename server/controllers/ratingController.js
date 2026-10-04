const Rating = require('../models/Rating');
const Food = require('../models/Food');
const Order = require('../models/Order');

const refreshFoodRating = async (foodId) => {
    const result = await Rating.aggregate([
        { $match: { food: foodId } },
        { $group: { _id: '$food', averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }
    ]);

    const summary = result[0] || { averageRating: 0, ratingCount: 0 };
    await Food.findByIdAndUpdate(foodId, {
        rating: Math.round(summary.averageRating * 10) / 10,
        ratingCount: summary.ratingCount
    });
};

exports.createRating = async (req, res) => {
    try {
        const { food, order, rating, review = '' } = req.body;
        const numericRating = Number(rating);

        if (!food || !order || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: 'Food, order, and a rating from 1 to 5 are required' });
        }

        const completedOrder = await Order.findOne({
            _id: order,
            student: req.user._id,
            status: 'completed',
            'items.food': food
        });
        if (!completedOrder) {
            return res.status(403).json({ message: 'Only food from your completed orders can be rated' });
        }

        const foodItem = await Food.findById(food);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food not found' });
        }

        const existingRating = await Rating.findOne({ food, order, student: req.user._id });
        if (existingRating) {
            return res.status(409).json({ message: 'You have already rated this food for this order' });
        }

        const createdRating = await Rating.create({
            food,
            order,
            student: req.user._id,
            rating: numericRating,
            review
        });
        await refreshFoodRating(foodItem._id);
        res.status(201).json(createdRating);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You have already rated this food for this order' });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.getFoodRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ food: req.params.foodId })
            .populate('student', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({})
            .populate('food', 'name rating ratingCount')
            .populate('student', 'name studentId')
            .populate('order', 'orderId')
            .sort({ createdAt: -1 });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
