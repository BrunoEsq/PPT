"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = app;
var express_1 = require("express");
var node_url_1 = require("node:url");
var node_path_1 = require("node:path");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
// The Express app is exported so that it can be used by serverless Functions.
function app() {
    var server = (0, express_1.default)();
    var serverDistFolder = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(import.meta.url));
    var browserDistFolder = (0, node_path_1.resolve)(serverDistFolder, '../browser');
    var indexHtml = (0, node_path_1.join)(serverDistFolder, 'index.html'); // Cambié a index.html porque no estamos usando SSR
    server.set('view engine', 'html');
    server.set('views', browserDistFolder);
    // Example Express Rest API endpoints
    // server.get('/api/**', (req, res) => { });
    // Serve static files from /browser
    server.get('**', express_1.default.static(browserDistFolder, {
        maxAge: '1y',
        index: 'index.html', // Cambié para servir el archivo index.html en lugar de index.server.html
    }));
    return server; // Aquí devuelves la instancia de Express
}
function run() {
    var port = process.env['PORT'] || 4000;
    // Crear la app Express
    var server = app();
    // Crear el servidor HTTP para Socket.io
    var httpServer = http_1.default.createServer(server);
    var io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "http://localhost:4200", // Permitir conexiones desde tu frontend
            methods: ["GET", "POST"],
        },
    });
    // Socket.io - Manejo de eventos
    io.on('connection', function (socket) {
        console.log('A user connected');
        // Evento para unirse a una sala
        socket.on('joinRoom', function (room) {
            socket.join(room);
            console.log("User joined room: ".concat(room));
            io.to(room).emit('message', 'A new user has joined the room');
        });
        // Evento para manejar la desconexión
        socket.on('disconnect', function () {
            console.log('User disconnected');
        });
    });
    // Iniciar el servidor HTTP
    httpServer.listen(port, function () {
        console.log("Node Express server with Socket.io listening on http://localhost:".concat(port));
    });
}
run();
