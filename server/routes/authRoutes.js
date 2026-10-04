const express = require('express');
const router = express.Router();
const { registerUser, registerStaff, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/staff/register', registerStaff);
router.post('/login', loginUser);
router.get('/profile', protect, getMe);
router.get('/me', protect, getMe);

module.exports = router;
