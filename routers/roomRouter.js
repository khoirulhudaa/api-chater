const express = require('express');
const Router = express.Router();
const roomController = require('../controllers/roomContoller');
const checkToken = require('../middlewares/verifyToken')

Router.post('/', checkToken, roomController.createRoom)
Router.get('/', checkToken, roomController.getAllRooms)
Router.put('/edit/:id', checkToken, roomController.editRoom)
Router.delete('/:id', checkToken, roomController.deleteRoom)

module.exports = Router