import React, { useEffect, useState } from "react";
import axios from "axios";
import PromoCarousel from "../components/PromoCarousel";
import ProductCardFade from "../components/ProductCardFade";
import 'nprogress/nprogress.css'; 

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
            <ProductCardFade key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="px-6 py-3 bg-secondary text-foreground hover:bg-secondary/80 rounded-full font-medium shadow">
            See More Products →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
