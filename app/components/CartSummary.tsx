'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/discountCalculator';

export default function CartSummary() {
  const { calculation } = useCart();

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-100">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">Order Summary</h2>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-slate-700 font-medium">
          <span>Subtotal</span>
          <span>{formatCurrency(calculation.subtotal)} THB</span>
        </div>

        {/* Discount Breakdowns */}
        {calculation.discountBreakdowns.length > 0 && (
          <div className="border-t-2 border-slate-200 pt-3 space-y-2">
            <p className="text-sm font-semibold text-slate-700">Discounts Applied:</p>
            {calculation.discountBreakdowns.map((breakdown, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-emerald-600 font-medium"
              >
                <span className="flex-1 pr-2">{breakdown.description}</span>
                <span className="whitespace-nowrap">
                  -{formatCurrency(breakdown.discountAmount)} THB
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Total Discount */}
        {calculation.totalDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold border-t-2 border-slate-200 pt-3">
            <span>Total Savings</span>
            <span>-{formatCurrency(calculation.totalDiscount)} THB</span>
          </div>
        )}

        {/* Final Price */}
        <div className="flex justify-between text-xl font-bold text-slate-800 border-t-2 border-indigo-300 pt-4">
          <span>Total Price</span>
          <span className="text-indigo-600">
            {formatCurrency(calculation.finalPrice)} THB
          </span>
        </div>
      </div>
    </div>
  );
}
