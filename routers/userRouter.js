// routers/authRouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/userController');
const passport = require('passport');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Login via akun Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://chater.vercel.app/auth/login' }),
  (req, res) => {
    const userData = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.displayName,
    };
    res.status(200).json({
      message: 'Login berhasil',
      data: userData,
      status: 200
    });
  }
);

module.exports = router;