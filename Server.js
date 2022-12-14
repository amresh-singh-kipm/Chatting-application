// const express = require('express')
// const app = express()
// const server = require('http').Server(app)
// const io = require('socket.io')(server)
// const { v4: uuidV4 } = require('uuid')

// app.set('view engine', 'ejs')
// app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room })
// })

// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected', userId)

//     socket.on('disconnect', () => {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId)
//     })
//   })
// })

// server.listen(3000)

const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
const users = {};
app.set('view engine', 'ejs');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
debug: true,
});
app.use('/peerjs', peerServer);
app.use(express.static('public'));
app.get('/', (req, res) => {
res.redirect(`/${uuidv4()}`);
});
app.get('/:room', (req, res) => {
res.render('room', { roomId: req.params.room });
});
io.on('connection', (socket) => {
console.log("user is connected",socket.id);
socket.on('join-room', (roomId, userId) => {
socket.join(roomId);
socket.to(roomId).broadcast.emit('user-connected', userId);
});
socket.on("chat",display=>{
    socket.broadcast.emit("chat-message",{display:display,userName:users[socket.id]})
})
socket.on("name",name=>{
    users[socket.id] = name;
    socket.broadcast.emit("username",name);
})
});
server.listen(5000);
