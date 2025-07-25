import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedStorage, setSelectedStorage] = useState("128GB");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  return (
    <div className="bg-white py-10 px-4 md:px-10 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="md:col-span-6">
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[500px] object-contain"
            />
          </div>

          {/* Gallery Thumbnails (mock) */}
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm"
              >
                <img
                  src={product.image}
                  alt={`thumb-${i}`}
                  className="w-16 h-16 object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-6 space-y-5">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {product.title}
          </h1>

          <p className="text-sm text-gray-500">Brand: {product.brand}</p>

          <div className="text-2xl font-bold text-gray-800 mb-2">
            ₱{product.price.toLocaleString()}
          </div>

          {product.rating && (
            <div className="flex items-center gap-2 text-yellow-500">
              ★★★★★ <span className="text-gray-600 text-sm">{product.rating}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600 font-semibold">
              {product.stock > 0 ? "Stock available" : "Out of stock"}
            </span>
            <span className="text-gray-500">Delivery: About 2-5 working days</span>
          </div>
          {/* Color Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Color:</h4>
            <div className="flex gap-3">
              {["Black", "Silver", "Gold", "Blue"].map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                  style={{
                    backgroundColor:
                      color.toLowerCase() === "black"
                        ? "#1f1f1f"
                        : color.toLowerCase() === "silver"
                        ? "#d9d9d9"
                        : color.toLowerCase() === "gold"
                        ? "#f0e68c"
                        : "#1e90ff", // blue
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Storage Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Storage:</h4>
            <div className="flex gap-3">
              {["128GB", "256GB", "512GB", "1TB"].map((storage, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                    selectedStorage === storage
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                  onClick={() => setSelectedStorage(storage)}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="border px-6 py-3 w-1/2 rounded-full text-sm font-medium text-gray-800 hover:bg-gray-100">
              Store Pickup
            </button>
            <button
              onClick={() => {
                addToCart({
                  id: product._id,
                  title: product.title,
                  image: product.image,
                  price: product.price,
                  stock: product.stock,
                  sku: product.sku || product._id,
                });
                toast.success("Added to cart");
              }}
              disabled={product.stock === 0}
              className={`w-1/2 py-3 rounded-full font-semibold text-white transition duration-200 text-sm flex items-center justify-center gap-2
                ${
                  product.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293a1 1 0 00.217 1.32l.083.057a1 1 0 001.32-.217L10 15h7m-1 4a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-semibold border-b-2 ${activeTab === "details" ? "border-black" : "border-transparent text-gray-500"}`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`px-4 py-2 font-semibold border-b-2 ${activeTab === "specs" ? "border-black" : "border-transparent text-gray-500"}`}
                onClick={() => setActiveTab("specs")}
              >
                Specification
              </button>
            </div>
            {activeTab === "details" && (
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <ul className="list-disc list-inside">
                  <li>PREMIUM DESIGN – {product.title} features a sleek, durable design with a large, high-resolution display.</li>
                  <li>POWERFUL CAMERA SYSTEM – Capture sharp photos and videos with advanced multi-lens technology.</li>
                  <li>SMOOTH PERFORMANCE – Equipped with a fast processor for seamless multitasking and gaming.</li>
                  <li>VIBRANT DISPLAY – Enjoy crisp visuals and true-to-life colors on a responsive touchscreen.</li>
                  <li>LONG BATTERY LIFE – Stay powered all day with efficient battery management and fast charging support.</li>
                  <li>AMPLE STORAGE – Store your photos, videos, and apps with generous storage options.</li>
                  <li>SECURITY FEATURES – Includes facial recognition or fingerprint unlock for enhanced security.</li>
                  <li>LATEST OS – Runs on the latest version of Android or iOS for optimal compatibility and features.</li>
                  <li>CONNECTIVITY – Supports 5G, Bluetooth, and Wi-Fi for fast, reliable connections.</li>
                </ul>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="350"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Product Specification"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
