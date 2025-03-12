import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/authUser.js";
import dbConnect from "./database/connection.js";
import cookieParser from "cookie-parser";
import userRouter from './routes/userRoutes.js';
import messageRouter from "./routes/messageRoutes.js";
// ✅ Explicitly specify the path to config.env
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRouter);
app.use('/api/message',messageRouter)
app.use('api/user',userRouter)

app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  dbConnect();
  console.log(`Server running on port ${PORT}`);
});
