// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/auth/login');
};

// Middleware to check if user is NOT authenticated (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  next();
};

// Middleware to make user data available to all views
const setUserLocals = async (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  
  if (req.session && req.session.userId) {
    try {
      const User = require('../models/userSchema');
      const user = await User.findById(req.session.userId);
      res.locals.currentUser = user;
    } catch (error) {
      res.locals.currentUser = null;
    }
  } else {
    res.locals.currentUser = null;
  }
  
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  setUserLocals
};
