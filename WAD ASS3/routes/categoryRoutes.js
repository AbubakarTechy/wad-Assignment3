import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Add Category (Admin)
router.post('/', verifyToken, isAdmin, categoryController.addCategory);
// Get Categories (public)
router.get('/', categoryController.getCategories);
// Update Category (Admin)
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);
// Delete Category (Admin)
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

export default router; 