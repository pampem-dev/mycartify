import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Create a new product
router.post("/", async (req, res) => {
  try {
    const {
      title,
      brand,
      price,
      stock,
      category,
      description,
      image,
      rating
    } = req.body;

    // Basic validation
    if (!title || !brand || !price || !category) {
      return res.status(400).json({ 
        message: "Title, brand, price, and category are required" 
      });
    }

    const newProduct = new Product({
      title,
      brand,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category,
      description: description || '',
      image: image || '',
      rating: parseFloat(rating) || 0
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error while creating product" });
  }
});

// PUT - Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      brand,
      price,
      stock,
      category,
      description,
      image,
      rating
    } = req.body;

    // Find the product first
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (brand !== undefined) updateData.brand = brand;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (rating !== undefined) updateData.rating = parseFloat(rating);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Server error while updating product" });
  }
});

// DELETE - Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully", deletedProduct: product });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error while deleting product" });
  }
});

export default router;