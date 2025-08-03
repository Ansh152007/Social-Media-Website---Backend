import express from 'express';
import { registerUser, loginUser, logoutUser, currentUser, getUser, getUserProfile, updateUserProfile } from '../controllers/user.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
router.get('/me', isAuthenticated, currentUser);
router.get('/:id', isAuthenticated, getUser);
router.get('/profile', isAuthenticated, getUserProfile);
router.put('/profile', isAuthenticated, updateUserProfile);

export default router;
