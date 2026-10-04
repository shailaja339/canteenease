const Food = require('../models/Food');

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
exports.getFoods = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-store');
        const foods = await Food.find({});
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get food by ID
// @route   GET /api/foods/:id
// @access  Public
exports.getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (food) {
            res.status(200).json(food);
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new food
// @route   POST /api/foods
// @access  Private/Admin
exports.createFood = async (req, res) => {
    try {
        const food = await Food.create(req.body);
        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Private/Admin
exports.updateFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (food) {
            res.status(200).json(food);
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (food) {
            res.status(200).json({ message: 'Food removed' });
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
