import Product from '../models/product.js';
import Category from '../models/category.js';

const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, availability, category } = req.body;
    const cat = await Category.findById(category);
    if (!cat) return res.status(400).json({ message: 'Invalid category' });
    const product = new Product({ name, description, price, stock, imageUrl, availability, category });
    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, name, availability } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (availability !== undefined) filter.availability = availability === 'true';
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { addProduct, getProducts, updateProduct, deleteProduct }; 