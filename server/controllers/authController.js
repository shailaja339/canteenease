const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, studentId, email, phone, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { studentId }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email or student ID already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            studentId,
            email,
            phone,
            password,
            role: 'student'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                studentId: user.studentId,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a canteen staff member with the configured invite code
// @route   POST /api/auth/staff/register
// @access  Public with invite code
exports.registerStaff = async (req, res) => {
    try {
        const { name, studentId, email, phone, password, staffCode } = req.body;

        if (!process.env.STAFF_REGISTRATION_CODE || staffCode !== process.env.STAFF_REGISTRATION_CODE) {
            return res.status(403).json({ message: 'A valid staff registration code is required' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { studentId }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email or student ID already exists' });
        }

        const user = await User.create({ name, studentId, email, phone, password, role: 'admin' });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            studentId: user.studentId,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                studentId: user.studentId,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
