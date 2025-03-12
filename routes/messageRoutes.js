import express from "express";
import { getMessage, sendMessage } from "../controllers/messageRouteController.js";
import isLogin from "../middlewares/isLogin.js";
const router=express.Router();
router.post('/send/:id',isLogin,sendMessage)
router.get('/:id',isLogin,getMessage)
export default router;