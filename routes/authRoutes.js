const router = require('express').Router();
const authController = require('../controllers/authController');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter for login attempts (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration (3 attempts per hour)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per windowMs
  message: 'Too many registration attempts. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Login routes
router.get('/login', isNotAuthenticated, authController.auth_get_login);
router.post('/login', isNotAuthenticated, loginLimiter, authController.auth_post_login);

// Registration routes
router.get('/register', isNotAuthenticated, authController.auth_get_register);
router.post('/register', isNotAuthenticated, registerLimiter, authController.auth_post_register);

// Logout route
router.get('/logout', isAuthenticated, authController.auth_get_logout);

module.exports = router;
