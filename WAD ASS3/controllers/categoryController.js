import Category from '../models/category.js';
import Product from '../models/product.js';

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: 'Category added', category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated', category: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Remove category from products
    await Product.updateMany({ category: id }, { $unset: { category: '' } });
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { addCategory, getCategories, updateCategory, deleteCategory }; 