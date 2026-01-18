'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/discountCalculator';

export default function CartItems() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-100">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Shopping Cart</h2>
        <p className="text-slate-500 text-center py-8">Your cart is empty</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Clothing':
        return 'bg-purple-200 text-purple-900 border border-purple-300';
      case 'Accessories':
        return 'bg-amber-200 text-amber-900 border border-amber-300';
      case 'Electronics':
        return 'bg-sky-200 text-sky-900 border border-sky-300';
      default:
        return 'bg-slate-200 text-slate-800 border border-slate-300';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-700">
          Shopping Cart ({items.length} items)
        </h2>
        <button
          onClick={clearCart}
          className="text-rose-600 hover:text-rose-800 text-sm font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            {/* Top row: Name, Category, Remove button */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-slate-800 text-sm sm:text-base break-words">
                  {item.name}
                </span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-rose-500 hover:text-rose-700 p-1 font-bold shrink-0"
                title="Remove item"
              >
                ✕
              </button>
            </div>

            {/* Bottom row: Price per item, Quantity controls, Total */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {formatCurrency(item.price)} THB each
              </p>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Quantity controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-6 sm:w-8 text-center font-semibold text-slate-800 text-sm sm:text-base">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Total price */}
                <div className="text-right">
                  <span className="font-bold text-indigo-700 text-sm sm:text-base whitespace-nowrap">
                    {formatCurrency(item.price * item.quantity)} THB
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
