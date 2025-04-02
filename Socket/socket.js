import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:['http://localhost:5173'],
        methods:["GET","POST"]
    }
})
export const getReciverSocketId=(receiverId)=>{
    console.log("Checking receiver ID:", receiverId);
    console.log("Current userSocketmap:", userSocketmap);
    return userSocketmap[receiverId];
}
const userSocketmap={};
io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("User Connected with ID:", userId, "Socket ID:", socket.id);
    if(userId!=="undefine")
    userSocketmap[userId]=socket.id;
    console.log("Updated userSocketmap:", userSocketmap);
    io.emit("getOnlineUsers",Object.keys(userSocketmap))

    socket.on('disconnect',()=>{
        console.log("User Disconnected:", socket.id);
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    })
    })
    export {app,io,server}