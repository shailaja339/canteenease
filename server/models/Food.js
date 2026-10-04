const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a food name']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Breakfast', 'Snacks', 'Main Course', 'Beverages', 'Desserts', 'Fast Food', 'South Indian', 'Breakfast/Main', 'Main/Snacks', 'Snacks/Main', 'Indo-Chinese', 'Dessert', 'Main Food', 'Cold Drinks', 'Fruit Juices', 'Ice Cream']
    },
    image: {
        type: String,
        default: 'placeholder.jpg' // Default placeholder if no image provided
    },
    ingredients: {
        type: [String]
    },
    isVegetarian: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number, // in minutes
        default: 10
    },
    stock: {
        type: Number,
        default: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Food', foodSchema);
