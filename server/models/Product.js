import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  brand: String,
  category: String,
  stock: Number,
  rating: Number,
});

const Product = mongoose.model("Product", productSchema);
export default Product;
