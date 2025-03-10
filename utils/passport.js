const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Ganti dengan Client ID dari Google
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Ganti dengan Client Secret
  callbackURL: 'http://localhost:3600/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await new User({
        idUser: Math.random().toString(36).substr(2, 5),
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      }).save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});