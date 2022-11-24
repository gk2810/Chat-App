const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server);
const path = require('path');
const {generateMessage} = require('./utils/messages')

const staticfolder = path.join(__dirname, '../public');
console.log(__dirname);
app.use(express.static(staticfolder));

io.on("connection", (socket) => {

    socket.emit('conn', generateMessage('welcome'))

    socket.broadcast.emit('message',generateMessage('new user joined'))
    
    socket.on('sendmessage',(message,cb)=>{
        io.emit('message',generateMessage(message));
        cb('ok from server');
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('user disconnected'));
    })

    socket.on('sendlocation',(coords,ack)=>{
        io.emit('location_message',`https://www.google.com/maps?q=${coords.latitude}, ${coords.longitude}`);
        ack('recieved ok');
    })
});


server.listen(8080, () => {
    console.log('server is running on 8080');
})