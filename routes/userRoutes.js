import express from 'express';
import isLogin from '../middlewares/isLogin.js';
import { currentchatters, getUserBySearch } from '../controllers/userSearchHandler.js';
const router=express.Router();
router.get('/search',isLogin,getUserBySearch)
router.get('/currentchatters',isLogin,currentchatters)

export default router;