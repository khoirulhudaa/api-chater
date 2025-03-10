const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Register
const register = async (req, res) => {
  try {
    const { idUser, email, username } = req.body;

    if (!email || !username) {
        return res.status(400).json({
            message: 'Data belum lengkap!',
            status: 400
        })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({
            message: 'Email sudah terdaftar!',
            status: 400
        })
    }

    const user = new User({ idUser, email, username });
    await user.save();

    return res.status(201).json({
        data: {
            idUser,
            username,
            email,
        },
        message: 'Berhasil daftar akun!',
        status: 201
    })
  } catch (error) {
    return res.status(500).json({
        message: error.message,
        status: 500
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
        return res.status(400).json({
            message: 'Email atau username wajib diisi!',
            status: 400
        })
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            message: 'Akun tidak ditemukan!',
            status: 401
        })
    }

    const token = jwt.sign({ idUser: user.idUser }, 'Chater', {expiresIn: "2h"})

    return res.status(200).json({
        data: user,
        token,
        message: 'Berhasil masuk!',
        status: 200
    })
  } catch (error) {
    return res.status(500).json({
        message: error.message,
        status: 500
    });
  }
};

module.exports = { register, login };