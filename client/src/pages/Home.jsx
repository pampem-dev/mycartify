import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import PromoCarousel from "../components/PromoCarousel";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background text-foreground">
      {/* wag galawin pag iisipan ko kung lalagay*/}
    {/* <section
        className="h-screen flex items-center justify-center text-center relative"
        style={{
          backgroundImage: "url('/bg.jpg')", // replace with your hero image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
          <div className="absolute inset-0 bg-transparent" />
          <div className="relative z-10 px-6">
            <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Upgrade Your Tech Game
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-6">
              Premium gadgets. Unbeatable prices.
            </p>
            <a
              href="#products"
              className="inline-block bg-[#d4d4d1] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#fefae0]/90 transition"
            >
              Browse Products
            </a>
        </div>
      </section> */}

      <PromoCarousel /> 

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="rounded-xl overflow-hidden relative">
          <img
            src="/ads.webp" // Replace with your own banner path
            alt="Ad Banner"
            className="w-full h-64 object-cover rounded-xl shadow-md"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">Mid-Year Sale</h2>
            <p className="text-white text-lg mb-4">Get up to 50% off on selected smartphones</p>
            <a
              href="#products"
              className="inline-block bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>
      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <h2 className="text-4xl font-bold text-center mb-16 tracking-tight text-card-foreground">
          Discover By Brand
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Apple", image: "/ios-banner.jpg" },
            { name: "Samsung", image: "/samsung-banner.jpg" },
            { name: "Realme", image: "/realme-banner.jpg" },
            { name: "Vivo", image: "/vivo-banner.jpg" },
          ].map((brand) => (
            <div
              key={brand.name}
              className="relative group rounded-xl overflow-hidden shadow-md cursor-pointer"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold group-hover:text-primary">
                  {brand.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 bg-card" id="products">
        <h2 className="text-4xl font-bold text-center mb-16 text-card-foreground">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.slice(0, 10).map((product) => (
            <div
              key={product._id}
              className="group bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-500 z-0"
              />
              <div className="p-4">
                <h3 className="text-base font-medium text-card-foreground line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{product.brand}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-2xl font-bold text-card-foreground">
                    ₱{product.price.toLocaleString()}
                  </p>
                  
                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      product.stock > 0
                        ? 'border-primary text-primary hover:bg-primary/10'
                        : 'border-muted text-muted-foreground cursor-not-allowed'
                    } transition duration-200`}
                    disabled={product.stock === 0}
                    title={product.stock > 0 ? "Add to Cart" : "Out of Stock"}
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
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="flex justify-center mt-6">
          <button className="px-6 py-3 bg-secondary text-foreground hover:bg-secondary/80 rounded-full font-medium shadow">
            See More Products →
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">TechStore</h3>
            <p className="text-sm text-gray-400">
              Your one-stop shop for the latest gadgets and unbeatable deals. Shop with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#products" className="hover:text-white">Products</a></li>
              <li><a href="#brands" className="hover:text-white">Brands</a></li>
              <li><a href="/cart" className="hover:text-white">Cart</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Stay Connected</h4>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded bg-gray-800 text-sm placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:bg-primary/90 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 py-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TechStore. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Home;
