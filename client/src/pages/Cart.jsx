import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import ConfirmDialog from "../components/ConfirmDialog";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const total = subtotal - discount;


  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleRemoveClick = (itemId) => {
    setItemToRemove(itemId);
    setShowConfirm(true);
  };

  const confirmRemove = () => {
    removeFromCart(itemToRemove);
    setShowConfirm(false);
    setItemToRemove(null);
  };

  const cancelRemove = () => {
    setShowConfirm(false);
    setItemToRemove(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left Section */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold">Shopping Cart</h2>

        {/* Delivery Method */}
        <div className="bg-gray-50 border rounded-lg flex items-center justify-between p-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" name="delivery" defaultChecked />
              <span>Home Delivery</span>
            </label>
            <p className="text-sm text-gray-500">Your order will be delivered to your address</p>
          </div>
          <label className="flex items-center gap-2">
            <input type="radio" name="delivery" />
            <span>Store Pickup</span>
          </label>
        </div>

        {/* Cart Items */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="font-medium">All Products</span>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-t py-4"
            >
              <div className="flex items-center gap-4">
                <input type="checkbox" className="mt-1" defaultChecked />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>

                  <div className="flex items-center mt-2 gap-2">
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="ml-2 px-2 py-1 border rounded text-red-500"
                      onClick={() => handleRemoveClick(item.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
              <p className="font-bold text-lg">
                ₱{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className="space-y-6">
        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Order Summary ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
          </h3>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₱{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Discount</span>
            <span>-₱{discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span>₱{total.toLocaleString()}</span>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-100 p-4 rounded">
              <p className="font-medium text-sm mb-1">
                Enjoy our fantastic deal! Pay only ₱ 3,083/month for 24 months.
              </p>
              <p className="text-xs text-gray-700">
                Explore exciting installment options and pick the plan that fits your budget.
              </p>
              <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Pay with Installment
              </button>
            </div>

            <div className="bg-yellow-50 p-4 rounded">
              <p className="font-medium text-sm mb-1">
                Get a special deal! Pay ₱ 58,490 in cash and enjoy any applicable discount.
              </p>
              <p className="text-xs text-gray-700">
                Choose your preferred payment method on the next page.
              </p>
              <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Pay with Cash
              </button>
            </div>
          </div>
        </div>
      </div>
    <ConfirmDialog
    isOpen={showConfirm}
    onConfirm={confirmRemove}
    onCancel={cancelRemove}
    />
    </div>
  
  );
  
};
export default Cart;
