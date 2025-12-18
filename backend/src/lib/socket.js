const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173'];

const io = new Server(server,{
    cors:{
        origin: allowedOrigins
    }
})


exports.getReciverScoketId = (userId)=>{
    return userSocketMap[userId];
}


//used to store online users
const userSocketMap = {

};


io.on('connection',(socket)=>{
    console.log('A user connected:', socket.id);
    const userId = socket.handshake.query.userId;
    if(userId){userSocketMap[userId] = socket.id;}
    io.emit('get-online-users',Object.keys(userSocketMap));
    socket.on('disconnect',()=>{
        console.log('User disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit('get-online-users',Object.keys(userSocketMap));
    });


})



module.exports = {io,app,server,...exports};