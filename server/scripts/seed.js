import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import sharp from 'sharp'; // npm install sharp
import Product from "../models/Product.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};

// Optimized image processing with compression
const imageToOptimizedBase64 = async (imagePath) => {
  try {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(__dirname, '..', 'client', 'public', cleanPath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Image not found: ${fullPath}`);
      return null;
    }

    console.log(`🔄 Optimizing ${imagePath}...`);
    
    // Use Sharp to resize and compress image
    const optimizedBuffer = await sharp(fullPath)
      .resize(400, 400, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 80,
        progressive: true 
      })
      .toBuffer();

    const originalSize = fs.statSync(fullPath).size;
    const optimizedSize = optimizedBuffer.length;
    const compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`📏 ${imagePath}: ${(originalSize/1024).toFixed(1)}KB → ${(optimizedSize/1024).toFixed(1)}KB (${compressionRatio}% smaller)`);
    
    // Convert to Base64
    const base64 = optimizedBuffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    
    // Check if resulting document would be too large
    const estimatedDocSize = JSON.stringify({ base64: dataUrl }).length;
    if (estimatedDocSize > 15 * 1024 * 1024) { // 15MB limit (safety margin)
      console.warn(`⚠️  ${imagePath} still too large after optimization (${(estimatedDocSize/1024/1024).toFixed(1)}MB)`);
      return null;
    }
    
    return dataUrl;
  } catch (error) {
    console.error(`❌ Error processing image ${imagePath}:`, error.message);
    return null;
  }
};

// Modified Product schema for better performance
const createOptimizedProductSchema = () => {
  const productSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    image: { type: String }, // Base64 image
    thumbnail: { type: String }, // Smaller version for listings
    price: { type: Number, required: true, index: true },
    stock: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    description: String
  });
  
  // Create compound indexes for common queries
  productSchema.index({ brand: 1, category: 1 });
  productSchema.index({ price: 1, rating: -1 });
  
  return mongoose.model('Product', productSchema);
};

const generateThumbnail = async (imagePath) => {
  try {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(__dirname, '..', 'client', 'public', cleanPath);
    
    if (!fs.existsSync(fullPath)) return null;

    // Create very small thumbnail (100x100, low quality)
    const thumbnailBuffer = await sharp(fullPath)
      .resize(100, 100, { fit: 'cover' })
      .jpeg({ quality: 60 })
      .toBuffer();

    const base64 = thumbnailBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`❌ Error creating thumbnail:`, error.message);
    return null;
  }
};

const realProducts = [
  // Apple
  {
    title: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "Smartphone",
    image: "/images/iphone-16-pro-max.png",
    price: 84999,
    stock: 10,
    rating: 4.9,
    description: "Apple's latest flagship with A18 chip, titanium build, and advanced ProMotion display."
  },
  {
    title: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphone",
    image: "/images/iphone-15-pro.png",
    price: 78999,
    stock: 15,
    rating: 4.8,
    description: "Sleek and powerful with A17 Pro chip, titanium finish, and industry-leading cameras."
  },
  {
    title: "iPhone 15",
    brand: "Apple",
    category: "Smartphone",
    image: "/images/iphone-15.png",
    price: 74999,
    stock: 12,
    rating: 4.7,
    description: "Dynamic Island and USB-C meet Apple's powerful A16 chip in a fresh, colorful design."
  },
  {
    title: "iPhone SE 2024",
    brand: "Apple",
    category: "Smartphone",
    image: "/images/iphone-se-2024.webp",
    price: 42999,
    stock: 8,
    rating: 4.4,
    description: "Affordable iPhone with classic Touch ID, fast A15 chip, and reliable camera performance."
  },
  {
    title: "iPhone 14",
    brand: "Apple",
    category: "Smartphone",
    image: "/images/iphone-14.webp",
    price: 70999,
    stock: 6,
    rating: 4.6,
    description: "Dependable all-around phone with crash detection, vibrant OLED display, and A15 chip."
  },

  // Samsung
  {
    title: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphone",
    image: "/images/galaxy-s24-ultra.webp",
    price: 76999,
    stock: 10,
    rating: 4.8,
    description: "Samsung's best yet with a titanium frame, S Pen, and 200MP camera for ultimate detail."
  },
  {
    title: "Galaxy Z Fold 5",
    brand: "Samsung",
    category: "Smartphone",
    image: "/images/galaxy-z-fold-5.webp",
    price: 99999,
    stock: 5,
    rating: 4.7,
    description: "Foldable flagship with immersive inner display and multitasking for productivity on the go."
  },
  {
    title: "Galaxy S23 FE",
    brand: "Samsung",
    category: "Smartphone",
    image: "/images/galaxy-s23-fe.webp",
    price: 56999,
    stock: 12,
    rating: 4.3,
    description: "Fan Edition packed with power, vibrant AMOLED display, and triple-lens camera system."
  },
  {
    title: "Galaxy A55",
    brand: "Samsung",
    category: "Smartphone",
    image: "/images/galaxy-a55.webp",
    price: 22990,
    stock: 15,
    rating: 4.2,
    description: "Affordable 5G-ready phone with large Super AMOLED display and long-lasting battery."
  },
  {
    title: "Galaxy Note 22",
    brand: "Samsung",
    category: "Smartphone",
    image: "/images/galaxy-note-22.webp",
    price: 69999,
    stock: 9,
    rating: 4.5,
    description: "Classic productivity powerhouse with S Pen, expansive display, and powerful performance."
  },

  // Realme
  {
    title: "Realme GT 7",
    brand: "Realme",
    category: "Smartphone",
    image: "/images/realme-gt-7.webp",
    price: 37999,
    stock: 18,
    rating: 4.1,
    description: "Flagship killer with Snapdragon 8 Gen 2, fast charging, and futuristic design."
  },
  {
    title: "Realme 13",
    brand: "Realme",
    category: "Smartphone",
    image: "/images/realme-13-pro.webp",
    price: 24999,
    stock: 20,
    rating: 4.3,
    description: "Midrange marvel with curved display, AI cameras, and sleek matte finish."
  },
  {
    title: "Realme 14 Pro",
    brand: "Realme",
    category: "Smartphone",
    image: "/images/realme-14-pro-5g.webp",
    price: 20999,
    stock: 25,
    rating: 4.0,
    description: "All-new 5G experience with 120Hz AMOLED and Dimensity 7050 performance."
  },
  {
    title: "Realme C75",
    brand: "Realme",
    category: "Smartphone",
    image: "/images/realme-c75.webp",
    price: 8999,
    stock: 0,
    rating: 3.9,
    description: "Entry-level powerhouse with big battery, clean UI, and dual-camera setup."
  },
  {
    title: "Realme GT 6",
    brand: "Realme",
    category: "Smartphone",
    image: "/images/realme-gt-6.webp",
    price: 24999,
    stock: 12,
    rating: 4.2,
    description: "High-end performance meets gamer-friendly design and lightning-fast charging."
  },

  // Vivo
  {
    title: "Vivo X80 Pro",
    brand: "Vivo",
    category: "Smartphone",
    image: "/images/vivo-x80-pro.png",
    price: 59999,
    stock: 10,
    rating: 4.6,
    description: "Flagship-level photography meets premium performance with ZEISS optics and Snapdragon 8 Gen 1."
  },
  {
    title: "Vivo V29e",
    brand: "Vivo",
    category: "Smartphone",
    image: "/images/vivo-v29e.png",
    price: 16999,
    stock: 11,
    rating: 4.4,
    description: "Sleek design with AMOLED display, 64MP OIS camera, and all-day battery life."
  },
  {
    title: "Vivo Y18",
    brand: "Vivo",
    category: "Smartphone",
    image: "/images/vivo-y18.png",
    price: 6499,
    stock: 13,
    rating: 4.0,
    description: "Affordable daily driver with stylish build, AI-powered camera, and extended battery life."
  },
  {
    title: "Vivo X70",
    brand: "Vivo",
    category: "Smartphone",
    image: "/images/vivo-x70.png",
    price: 34999,
    stock: 8,
    rating: 4.3,
    description: "Capture studio-quality photos with ZEISS optics and enjoy fluid performance on a vivid display."
  },
  {
    title: "Vivo V27",
    brand: "Vivo",
    category: "Smartphone",
    image: "/images/vivo-v27.png",
    price: 24999,
    stock: 14,
    rating: 4.5,
    description: "Elegant curved screen design with portrait-enhancing camera system and 66W fast charging."
  }
];

const seedProducts = async () => {
  await connectDB();

  try {
    console.log("🔄 Starting optimized image processing...");
    
    const imagesDir = path.join(__dirname, '..', 'client', 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      console.error(`❌ Images directory not found: ${imagesDir}`);
      process.exit(1);
    }

    const productsWithOptimizedImages = [];
    
    for (const product of realProducts) {
      console.log(`\n📝 Processing: ${product.title}`);
      
      const [optimizedImage, thumbnail] = await Promise.all([
        imageToOptimizedBase64(product.image),
        generateThumbnail(product.image)
      ]);
      
      if (optimizedImage && thumbnail) {
        productsWithOptimizedImages.push({
          ...product,
          image: optimizedImage,
          thumbnail: thumbnail
        });
      }
    }

    console.log(`\n📊 Processing Summary:`);
    console.log(`✅ Successfully processed: ${productsWithOptimizedImages.length} images`);
    
    if (productsWithOptimizedImages.length === 0) {
      console.error("❌ No valid products to insert.");
      process.exit(1);
    }

    console.log("\n🗃️  Clearing existing products...");
    await Product.deleteMany();
    
    console.log("💾 Inserting optimized products...");
    
    // Insert in smaller batches to avoid memory issues
    const batchSize = 10;
    for (let i = 0; i < productsWithOptimizedImages.length; i += batchSize) {
      const batch = productsWithOptimizedImages.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`📦 Inserted batch ${Math.floor(i/batchSize) + 1}`);
    }
    
    console.log("✅ Optimized products inserted successfully!");
    console.log(`📊 Total products in database: ${productsWithOptimizedImages.length}`);
    
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
};

seedProducts();