const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let players = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Assign player number (0 or 1) to the connected player
    const playerNumber = players.length;
    players.push({ id: socket.id, number: playerNumber });

    // Notify the player about their assigned number
    socket.emit('player-number', playerNumber);

    // Broadcast the updated player list to all players
    io.emit('update-players', players);

    // Handle player move
    socket.on('move', (data) => {
        io.emit('update', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove disconnected player from the players array
        players = players.filter(player => player.id !== socket.id);
        // Broadcast the updated player list to all players
        io.emit('update-players', players);
    });
});

server.listen(3000, () => {
    console.log("listening on port 3000");
});
