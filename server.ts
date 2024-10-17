import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import http from 'http';
import { Server } from 'socket.io';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;  // Aquí devuelves la instancia de Express
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Crear la app Express
  const server = app();

  // Crear el servidor HTTP para Socket.io
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:4200", // Permitir conexiones desde tu frontend
      methods: ["GET", "POST"],
    },
  });

  // Socket.io - Manejo de eventos
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
      io.to(room).emit('message', 'A new user has joined the room');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  // Iniciar el servidor HTTP
  httpServer.listen(port, () => {
    console.log(`Node Express server with Socket.io listening on http://localhost:${port}`);
  });
}

run();
