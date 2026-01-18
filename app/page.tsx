'use client';

import AddItemForm from './components/AddItemForm';
import CartItems from './components/CartItems';
import DiscountForm from './components/DiscountForm';
import CartSummary from './components/CartSummary';

export default function Home() {
  return (
    <main className="min-h-screen py-6 sm:py-10 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 bg-white/90 backdrop-blur-sm rounded-2xl py-6 sm:py-8 px-4 shadow-xl border border-white/50">
          <h1 className="text-2xl sm:text-4xl font-bold text-indigo-700 mb-2">
            🛒 Playtorium Discount Module
          </h1>
          <p className="text-slate-600 font-medium text-sm sm:text-base">
            Shopping Cart with Multiple Discount Campaigns
          </p>
        </div>

        {/* Main Layout - 2 columns on large screens */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left Side - Forms */}
          <div className="xl:col-span-4 space-y-4 sm:space-y-6">
            <AddItemForm />
            <DiscountForm />
          </div>

          {/* Right Side - Cart & Summary */}
          <div className="xl:col-span-8 space-y-4 sm:space-y-6">
            {/* Cart Items - Full width */}
            <CartItems />
            
            {/* Summary - Sticky on desktop */}
            <div className="xl:sticky xl:top-6">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
