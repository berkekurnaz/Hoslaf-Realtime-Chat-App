const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let allUsers = [];

io.on('connection', (socket) => {

    allUsers.push({
        id: socket.id,
        username: 'default',
        room_id: "0"
    })

    io.emit('total_user_count', allUsers.length);

    socket.on('join_room', (msg) => {
      let findIndex = allUsers.findIndex( item => item.id === socket.id );
      allUsers[findIndex] = {
        id: socket.id,
        username: msg.username,
        room_id: msg.room_id
      } 

      socket.join(msg.room_id);
      
      io.in(msg.room_id).emit('room_users', allUsers.filter(x => x.room_id == msg.room_id));
    });

    socket.on("send_message", (msg) => {
      io.in(msg.room_id).emit('send_message', msg);
    });
    
    socket.on('disconnect', () => {
        let removeIndex = allUsers.findIndex( item => item.id === socket.id );
        allUsers.splice(removeIndex, 1);

        io.emit('total_user_count', allUsers.length);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});