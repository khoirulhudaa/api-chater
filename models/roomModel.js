const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  idRoom: {
    type: String,
    required: true,
    unique: true
  },
  room: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'Belum ada informasi group'
  },
  contents: {
    type: [{
      text: {
        type: String,
        required: true,
      },
      sender: {
        type: String,
        required: true,
      },
      timestamps: {
        type: Date,
        default: Date.now,
      },
    }],
    default: [] 
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model('room', roomSchema);
module.exports = Room;