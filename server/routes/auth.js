import express from 'express';
import { registerUser, loginUser, forgotPassword } from '../controllers/auth.js';
import { validateRegister, validateLogin, validateForgotPassword } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', validateForgotPassword, forgotPassword);

export { router as authRouter };