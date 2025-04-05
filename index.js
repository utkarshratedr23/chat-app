import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/authUser.js";
import dbConnect from "./database/connection.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';
import { app, server } from './Socket/socket.js';

// ✅ Properly define __dirname using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

// ✅ Serve frontend from 'chatapp/dist'
app.use(express.static(path.join(__dirname, 'chatapp', 'dist')));

// ✅ Fallback route for SPA (Single Page App)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'chatapp', 'dist', 'index.html'));
});

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server running on port ${PORT}`);
});
