import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

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
    description: "Samsung’s best yet with a titanium frame, S Pen, and 200MP camera for ultimate detail."
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
    await Product.deleteMany();
    await Product.insertMany(realProducts);
    console.log("✅ Real products inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
};

seedProducts();
