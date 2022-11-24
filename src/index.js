const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server);
const path = require('path');

const staticfolder = path.join(__dirname, '../public');
console.log(__dirname);
app.use(express.static(staticfolder));

io.on("connection", (socket) => {

    socket.broadcast.emit('message','new user joined')

    const msg = 'welcome!';
    socket.emit('conn', msg)
    
    socket.on('sendmessage',(message,cb)=>{
        io.emit('message',message);
        cb('ok from server');
    })

    socket.on('disconnect',()=>{
        io.emit('message','user disconnected');
    })

    socket.on('sendlocation',(coords,ack)=>{
        io.emit('message',`https://www.google.com/maps?q=${coords.latitude}, ${coords.longitude}`);
        ack('recieved ok');
    })
});


server.listen(8080, () => {
    console.log('server is running on 8080');
})