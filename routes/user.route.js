import express from 'express';
import { registerUser, loginUser, logoutUser, currentUser, getUserProfile, updateUserProfile } from '../controllers/user.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js';
import upload from '../utilities/multer.js';
const router = express.Router();

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
router.get('/me', isAuthenticated, currentUser);
router.get('/profile/:userId', getUserProfile);
router.put('/profile', isAuthenticated, upload.single('avatar'), updateUserProfile);

export default router;
