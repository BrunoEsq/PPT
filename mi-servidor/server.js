const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://ppt-gamma-six.vercel.app",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "https://ppt-gamma-six.vercel.app"
}));

let rooms = {}; // Para almacenar información de las salas y los jugadores

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Unirse a una sala
  socket.on('joinRoom', ({ room, avatar }) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    if (!rooms[room]) {
      rooms[room] = { players: [], choices: {} };
    }

    rooms[room].players.push(socket.id);

    // Si la sala tiene dos jugadores, se notifica que ambos han entrado
    if (rooms[room].players.length === 2) {
      io.to(room).emit('message', 'Both players have joined! Start playing.');
    }
  });

  // Recibir elección del jugador
  socket.on('playGame', ({ room, choice }) => {
    if (!rooms[room]) return;

    // Almacena la elección del jugador
    rooms[room].choices[socket.id] = choice;

    const players = rooms[room].players;

    // Si ambos jugadores han hecho su elección
    if (rooms[room].choices[players[0]] !== undefined && rooms[room].choices[players[1]] !== undefined) {
      const player1Choice = rooms[room].choices[players[0]];
      const player2Choice = rooms[room].choices[players[1]];

      // Envía el resultado a ambos jugadores
      io.to(players[0]).emit('gameResult', { playerChoice: player1Choice, opponentChoice: player2Choice });
      io.to(players[1]).emit('gameResult', { playerChoice: player2Choice, opponentChoice: player1Choice });

      // Reinicia las elecciones para el próximo juego
      rooms[room].choices = {};
    }
  });

  socket.on('message', (data) => {
    io.emit('message', data); // Emitir el mensaje a todos los clientes conectados
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Eliminar al jugador de la sala y limpiar la sala si está vacía
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter(id => id !== socket.id);
      if (rooms[room].players.length === 0) {
        delete rooms[room];
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
