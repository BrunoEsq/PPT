const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:4200"
}));

io.on('connection', (socket) => {
  console.log('a user connected');

  // Unirse a una sala
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Enviar mensaje solo a los clientes en la misma sala
  socket.on('message', (data) => {
    const { room, message } = data;
    io.to(room).emit('message', message); // Emitir mensaje solo a la sala específica
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
