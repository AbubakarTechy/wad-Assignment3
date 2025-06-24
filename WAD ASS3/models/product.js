import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String },
  availability: { type: Boolean, default: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

export default mongoose.model('Product', productSchema); 