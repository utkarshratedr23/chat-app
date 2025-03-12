import express from 'express';
import isLogin from '../middlewares/isLogin.js';
import { getUserBySearch } from '../controllers/userSearchHandler.js';
const router=express.Router();
router.get('/search',isLogin,getUserBySearch)

export default router;