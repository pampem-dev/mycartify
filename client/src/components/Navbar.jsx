import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-black shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          TechStore
        </Link>

        {/* Links */}
        <ul className="flex items-center space-x-6 text-sm font-medium text-white">
          {!isAdmin && (
            <li>
              <Link to="/#products" className="hover:text-gray-300 transition">
                Products
              </Link>
            </li>
          )}

          {!isAdmin && (
            <li>
              <Link to="/cart" className="relative font-medium text-sm">
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </li>
          )}

          {!user ? (
            <li>
              <Link to="/login" className="hover:text-gray-300 transition">
                Login
              </Link>
            </li>
          ) : (
            <>
              <li className="text-gray-300">
                Hi, {user.name?.split(" ")[0] || "User"}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
