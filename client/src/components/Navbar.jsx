import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-black shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          TechStore
        </Link>

        {/* Links */}
        <ul className="flex items-center space-x-6 text-sm font-medium text-white">
          <li>
            <Link to="/#products" className="hover:text-gray-300 transition">
              Products
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-gray-300 transition">
              Cart
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-gray-300 transition">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
