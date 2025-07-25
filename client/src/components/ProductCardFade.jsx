// components/ProductCardFade.jsx
import React from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

const ProductCardFade = ({ product }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <Link to={`/product/${product._id}`}>
      <div
        ref={ref}
        className={`group bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="p-4">
          <h3 className="text-base font-medium text-card-foreground line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {product.brand}
          </p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-2xl font-bold text-card-foreground">
              ₱{product.price.toLocaleString()}
            </p>
{/*             <button
              onClick={(e) => e.preventDefault()} // Prevent button from triggering navigation
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                product.stock > 0
                  ? "border-primary text-primary hover:bg-primary/10"
                  : "border-muted text-muted-foreground cursor-not-allowed"
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
            </button> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardFade;
