import express from 'express';
import productController from '../controllers/productController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin, isSeller } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Add Product (Admin/Seller)
router.post('/', verifyToken, isSeller, productController.addProduct);
// Get Products (public, with search/filter)
router.get('/', productController.getProducts);
// Update Product (Admin/Seller)
router.put('/:id', verifyToken, isSeller, productController.updateProduct);
// Delete Product (Admin/Seller)
router.delete('/:id', verifyToken, isSeller, productController.deleteProduct);

export default router; 