const Room = require('../models/roomModel');

const createRoom = async (req, res) => {
    try {
      const { idRoom, name, description } = req.body
      
      console.log(idRoom, name, description)

      const data = {
        idRoom,
        room: name,
        description
      }
      await new Room(data).save();

      return res.status(201).json({
        data,
        message: 'Berhasil membuat group baru!',
        status: 200
      })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 500
        });
    }
}

const getAllRooms = async (req, res) => {
    try {
      const data = await Room.find();
      return res.status(200).json({
        data,
        message: 'Berhasil dapatkan semua daftar group!',
        status: 200
      })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 500
        });
    }
}

const editRoom = async (req, res) => {
  try {
    const { idRoom, room, description } = req.body;
    const equalRoom = await Room.findById({idRoom});

    if (!equalRoom) {
        res.status(404).json({
            message: 'Group tersebut tidak ada!',
            status: 404
        });
    }

    equalRoom.room = room;
    equalRoom.description = description;
    await room.save();

    res.status(200).json({
        data: message,
        message: 'Informasi group berhasil diperbaui!',
        status: 200
      });
  } catch (error) {
    res.status(500).json({
        data: messages,
        message: error.message,
        status: 500
    });
  }
};

// Endpoint untuk menghapus pesan
const deleteRoom =  async (req, res) => {
  try {

    const { idRoom } = req.body;

    const equalRoom = await Room.findById({idRoom});

    if (!equalRoom) {
        res.status(404).json({
            message: 'Group tersebut tidak ditemukan!'
        });
    }

    await editRoom.remove();

    res.status(200).json({
        data: message,
        message: 'Group telah berhasil dihapus!',
        status: 200
    });
  } catch (error) {
    res.status(500).json({
        message: error.message,
        status: 500
    });
  }
};

module.exports = {
    createRoom,
    getAllRooms,
    editRoom,
    deleteRoom
}