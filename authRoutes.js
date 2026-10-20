const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('./userModel');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { username, email, fullname, phone, password } = req.body;
    const newUser = new User({ username, email, fullname, phone });
    
    await User.register(newUser, password);
    passport.authenticate('local')(req, res, () => {
      res.json({ success: true, message: 'Registration successful!', user: req.user });
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login User
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ success: false, message: info ? info.message : 'Invalid credentials' });
    
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ success: true, message: 'Login successful!', user });
    });
  })(req, res, next);
});

// Logout User
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current logged-in user details
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.json({ success: false, user: null });
  }
});

module.exports = router;
