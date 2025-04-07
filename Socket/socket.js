import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['https://chat-app-1-7qav.onrender.com/'],
        methods: ["GET", "POST"]
    }
});

const userSocketmap = {};

export const getReciverSocketId = (receiverId) => {
    console.log("Checking receiver ID:", receiverId);
    console.log("Current userSocketmap:", userSocketmap);
    return userSocketmap[receiverId];
};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected with ID:", userId, "Socket ID:", socket.id);

    if (userId !== "undefine") {
        userSocketmap[userId] = socket.id;
    }

    console.log("Updated userSocketmap:", userSocketmap);

    // Broadcast all online users to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketmap));

    // 🔥 TYPING FEATURE STARTS HERE
    socket.on("typing", ({ senderId, receiverId, username }) => {
        const receiverSocketId = getReciverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", {
                senderId,
                username
            });
        }
    });

    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id);
        delete userSocketmap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketmap));
    });
});

export { app, io, server };
