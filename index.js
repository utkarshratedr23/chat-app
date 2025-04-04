import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/authUser.js";
import dbConnect from "./database/connection.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import path from "path";
// ✅ Explicitly specify the path to config.env
/*dotenv.config();*/

import {app,server} from './Socket/socket.js'
const __dirname=path.resolve();
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRouter);
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)

app.use(express.static(path.join(__dirname, "/Backend/chatapp/dist")));

// Fallback route to serve "index.html" for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname,"Backend", "chatapp", "dist","index.html"));
});
app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server running on port ${PORT}`);
});
