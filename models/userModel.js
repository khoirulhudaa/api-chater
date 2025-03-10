// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idUser:{
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  role: {
    type: String,
    default: 'user',
  },
  googleId: { // Optional: simpan Google ID untuk referensi
    type: String,
    unique: true,
    required: false,
    sparse: true // Allow null values tapi tetap unik
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);