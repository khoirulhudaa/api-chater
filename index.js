const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const passport = require('passport');
const session = require('express-session');
const Messages = require('./models/roomModel');

require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'https://chater-v1.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'] 
}));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://chater-v1.vercel.app',
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true
    }
});

mongoose.connect(process.env.URL_MONGOOSE, {
    serverSelectionTimeoutMS: 30000, // Perpanjang waktu timeout untuk koneksi ke server MongoDB (30 detik)
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('Database sudah terhubung!')
})
.catch((error) => {
    console.log(error)
})

app.use((req, res, next) => {
    res.setTimeout(20000, () => {
        res.status(408).send('Request timeout');
    });
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

io.on('connection', async (socket) => {

    console.log('Pengguna sudah terkoneksi', socket.id)
    
    socket.on('joinRoom', async (room) => {
        console.log('Room yang diterima:', room);
        socket.join(room);
    
        const messages = await Messages.find({ room }).sort({ timestamp: 1 });
        console.log('messages1', messages);
        socket.emit('loadMessages', messages ? messages[0]?.contents : []);
    });
    
    socket.on('sendMessage', async (data) => {

        const { room, content, sender } = data;
        console.log('room send message', room)
        let messageDoc = await Messages.findOne({ room }); 

        if(!messageDoc) {
            console.log('data tidak ada!')
        }

        // Pastikan contents adalah array sebelum push
        if (!Array.isArray(messageDoc.contents)) {
            messageDoc.contents = []; // Inisialisasi ulang jika tidak valid
        }

        // Tambahkan pesan baru ke array contents
        messageDoc.contents.push({
            text: content,
            sender
        });

        await messageDoc.save();
        console.log('message contents:', messageDoc.contents)
        io.to(room).emit('loadMessages', messageDoc.contents);
    });
    
    socket.on('createGroup', async (data) => {

        try {
            const { idRoom, name, description } = data
            
            console.log(idRoom, name, description)
      
            const data = {
              idRoom,
              room: name,
              description
            }
            const groups = await new Room(data).save();
      
            io.emit('loadGroups', groups);
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
    });

    socket.on('deleteMessage', async (data) => {

        const { room, id } = data
        console.log('delete data:', data)

        let messageDoc = await Messages.findOne({ room }); 

        if(!messageDoc) {
            console.log('data tidak ada!')
        }

        // Pastikan contents adalah array sebelum push
        if (!Array.isArray(messageDoc.contents)) {
            messageDoc.contents = [];
            console.log([])
            return // Inisialisasi ulang jika tidak valid
        }

        // Tambahkan pesan baru ke array contents
        const result = await Messages.updateOne(
            { room }, // Filter dokumen berdasarkan room
            { $pull: { contents: { _id: id } } } // Hapus elemen dengan _id yang cocok
        );
        const updatedDoc = await Messages.findOne({ room });

        if (result.modifiedCount > 0) {
            console.log('Elemen berhasil dihapus dari contents');
        } else {
            console.log('Tidak ada elemen yang dihapus');
        }
    
        // Kirim data terbaru ke semua client di room
        io.to(room).emit('loadMessages', updatedDoc ? updatedDoc.contents : []);
    })

    socket.on('disconnect', () => {
        console.log('Pengguna sudah tidak terkoneksi!', socket.id);
    })
})

const roomRouter = require('./routers/roomRouter')
const userRouter = require('./routers/userRouter')

require('./utils/passport');

app.use('/auth', userRouter)
app.use('/room', roomRouter)

app.get('/test', (req, res) => [
    res.send('API - ON - SUCCESS')
])

server.listen(process.env.PORT, () => {
    console.log(`Aplikasi berjalan pada port ${process.env.PORT}`)
})