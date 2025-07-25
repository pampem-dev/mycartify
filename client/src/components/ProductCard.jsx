    {/* pag cinlick yung product */}

import React from "react";

const ProductCard = ({ product }) => {
  return (
  <div key={product._id} className="group relative rounded-2xl border border-border bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    {/* Product Image + Stock Badge */}
    <div className="relative bg-gray-50 p-5 h-64 flex items-center justify-center">
      {product.stock > 0 ? (
        <span className="absolute top-4 left-4 z-10 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          In Stock
        </span>
      ) : (
        <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          Out of Stock
        </span>
      )}

    <img
      src={product.image}
      alt={product.title}
      className="h-full object-contain transition-transform duration-500 group-hover:scale-105 z-0"
    />
    </div>

    {/* Product Info */}
    <div className="p-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          {product.category}
        </span>
        {product.rating && (
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            ★ <span className="text-gray-600">{product.rating}</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
      <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>

      <p className="text-xl font-bold text-gray-900 mb-4">
        ₱{product.price.toLocaleString()}
      </p>

      <button
        className={`w-full py-3 text-sm font-medium rounded-full transition-colors ${
          product.stock > 0
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  </div>
  );
};

export default ProductCard;
