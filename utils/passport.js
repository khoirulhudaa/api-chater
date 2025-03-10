const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Ganti dengan Client ID dari Google
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Ganti dengan Client Secret
  callbackURL: 'https://api-chater.vercel.app/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOneAndUpdate(
      { googleId: profile.id },
      {
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      },
      { new: true, upsert: true } // `new: true` memastikan kita mendapatkan data terbaru, `upsert: true` untuk membuat dokumen baru jika tidak ditemukan
    );

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