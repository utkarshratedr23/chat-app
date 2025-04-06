import express from 'express';
import isLogin from '../middlewares/isLogin.js';
import { currentchatters, getRegisteredUsers, getUserBySearch } from '../controllers/userSearchHandler.js';
const router=express.Router();
router.get('/search',isLogin,getUserBySearch)
router.get('/currentchatters',isLogin,currentchatters)
router.get('/allusers',isLogin,getRegisteredUsers)
export default router;