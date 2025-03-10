// routers/authRouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/userController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Login via akun Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://chater-v1.vercel.app/auth/login' }),
  (req, res) => {

    console.log('req passport:', req.user)

    const token = jwt.sign({ idUser: req.user.id }, 'Chater', {expiresIn: "2h"})
    const userData = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      token
    };
    const redirectUrl = `https://chater-v1.vercel.app/auth/google/callback?userData=${encodeURIComponent(JSON.stringify(userData))}`;

    // Redirect ke URL frontend dengan data pengguna
    res.redirect(redirectUrl);
  }
);

module.exports = router;