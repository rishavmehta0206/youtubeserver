import express from 'express'
import {loginUser,  registerUser} from '../controllers/auth.js'
const router = express.Router();


router.post('/signup',registerUser);
router.post('/signin',loginUser);

export default router;