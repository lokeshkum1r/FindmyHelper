const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { updateProfile } = require("../controllers/authController");
const {
  register,
  login,
  getCurrentUser // Add this import
} = require('../controllers/authController');
const authenticate = require('../middlewares/auth');

// Public routes
router.post('/register', [
  check('firstName', 'First name is required').notEmpty(),
  check('lastName', 'Last name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6+ characters').isLength({ min: 6 })
], register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.get('/profile', authenticate, (req, res) => {
  res.json(req.user);
});
// Add this route with the others
router.put('/update', authenticate,[
  check('firstName', 'First name is required').notEmpty(),
  check('lastName', 'Last name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail()
], updateProfile);

module.exports = router;