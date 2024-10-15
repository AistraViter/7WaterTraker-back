import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { login } from '../controllers/loginController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema } from '../validation/loginValidation.js';

const router = express.Router();

router.post('/login', validateBody(loginSchema), ctrlWrapper(login));

export default router;
