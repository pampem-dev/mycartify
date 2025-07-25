import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Footer from "./components/Footer";
import TopLoader from "./components/TopLoader";
import { CartProvider } from "./context/CartContext";
import { Toaster } from 'react-hot-toast';
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <CartProvider>
      <TopLoader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* Add other routes here */}
      </Routes>
      <Footer />
      </CartProvider>
    </Router>
  );
};

export default App;
