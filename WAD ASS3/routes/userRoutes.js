import express from 'express';
import userController from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.put('/update-password', verifyToken, userController.updatePassword);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

export default router; 