const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const User = require('./userModel');
const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');
const foodsData = require('./foodsData');

const app = express();

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/bitedashDB')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'bitedash_secret_key_123',
  resave: false,
  saveUninitialized: false
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Food list API (Returns dummy food array directly from foodsData.js)
app.get('/api/foods', (req, res) => {
  res.json({ success: true, foods: foodsData });
});

// Serve static frontend files from current single folder
app.use(express.static(__dirname));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
