'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  DiscountCampaign,
  ProductCategory,
  FixedAmountCoupon,
  PercentageCoupon,
  CategoryDiscount,
  PointsDiscount,
  SeasonalDiscount,
} from '../types';

type CampaignType = DiscountCampaign['type'];

const campaignOptions: { type: CampaignType; label: string; category: string }[] = [
  { type: 'FIXED_AMOUNT', label: 'Fixed Amount Coupon', category: 'Coupon' },
  { type: 'PERCENTAGE', label: 'Percentage Coupon', category: 'Coupon' },
  { type: 'PERCENTAGE_BY_CATEGORY', label: 'Category Discount', category: 'OnTop' },
  { type: 'POINTS', label: 'Points Discount', category: 'OnTop' },
  { type: 'SEASONAL', label: 'Seasonal Campaign', category: 'Seasonal' },
];

const categories: ProductCategory[] = ['Clothing', 'Accessories', 'Electronics'];

export default function DiscountForm() {
  const { addCampaign, campaigns, removeCampaign, clearCampaigns } = useCart();
  const [selectedType, setSelectedType] = useState<CampaignType>('FIXED_AMOUNT');
  
  // Form values
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState('');
  const [productCategory, setProductCategory] = useState<ProductCategory>('Clothing');
  const [points, setPoints] = useState('');
  const [everyX, setEveryX] = useState('');
  const [discountY, setDiscountY] = useState('');

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();

    let campaign: DiscountCampaign;

    switch (selectedType) {
      case 'FIXED_AMOUNT':
        if (!amount || parseFloat(amount) <= 0) {
          alert('Please enter a valid amount');
          return;
        }
        campaign = {
          type: 'FIXED_AMOUNT',
          category: 'Coupon',
          amount: parseFloat(amount),
        } as FixedAmountCoupon;
        break;

      case 'PERCENTAGE':
        if (!percentage || parseFloat(percentage) <= 0 || parseFloat(percentage) > 100) {
          alert('Please enter a valid percentage (1-100)');
          return;
        }
        campaign = {
          type: 'PERCENTAGE',
          category: 'Coupon',
          percentage: parseFloat(percentage),
        } as PercentageCoupon;
        break;

      case 'PERCENTAGE_BY_CATEGORY':
        if (!percentage || parseFloat(percentage) <= 0 || parseFloat(percentage) > 100) {
          alert('Please enter a valid percentage (1-100)');
          return;
        }
        campaign = {
          type: 'PERCENTAGE_BY_CATEGORY',
          category: 'OnTop',
          productCategory,
          percentage: parseFloat(percentage),
        } as CategoryDiscount;
        break;

      case 'POINTS':
        if (!points || parseInt(points) <= 0) {
          alert('Please enter valid points');
          return;
        }
        campaign = {
          type: 'POINTS',
          category: 'OnTop',
          points: parseInt(points),
        } as PointsDiscount;
        break;

      case 'SEASONAL':
        if (!everyX || parseFloat(everyX) <= 0 || !discountY || parseFloat(discountY) <= 0) {
          alert('Please enter valid amounts for seasonal discount');
          return;
        }
        campaign = {
          type: 'SEASONAL',
          category: 'Seasonal',
          everyXAmount: parseFloat(everyX),
          discountYAmount: parseFloat(discountY),
        } as SeasonalDiscount;
        break;

      default:
        return;
    }

    addCampaign(campaign);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setPercentage('');
    setPoints('');
    setEveryX('');
    setDiscountY('');
  };

  const getCampaignDescription = (campaign: DiscountCampaign): string => {
    switch (campaign.type) {
      case 'FIXED_AMOUNT':
        return `Fixed: -${campaign.amount} THB`;
      case 'PERCENTAGE':
        return `Percentage: -${campaign.percentage}%`;
      case 'PERCENTAGE_BY_CATEGORY':
        return `${campaign.percentage}% off ${campaign.productCategory}`;
      case 'POINTS':
        return `Points: ${campaign.points} pts (max 20%)`;
      case 'SEASONAL':
        return `Every ${campaign.everyXAmount} THB → -${campaign.discountYAmount} THB`;
      default:
        return 'Unknown';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Coupon':
        return 'bg-emerald-200 text-emerald-900 border border-emerald-300';
      case 'OnTop':
        return 'bg-sky-200 text-sky-900 border border-sky-300';
      case 'Seasonal':
        return 'bg-amber-200 text-amber-900 border border-amber-300';
      default:
        return 'bg-slate-200 text-slate-800 border border-slate-300';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-100">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">Apply Discounts</h2>
      
      <form onSubmit={handleAddDiscount} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Campaign Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CampaignType)}
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
          >
            {campaignOptions.map((opt) => (
              <option key={opt.type} value={opt.type}>
                [{opt.category}] {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fixed Amount */}
        {selectedType === 'FIXED_AMOUNT' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Discount Amount (THB)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 50"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
            />
          </div>
        )}

        {/* Percentage */}
        {selectedType === 'PERCENTAGE' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Discount Percentage (%)
            </label>
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="e.g., 10"
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
            />
          </div>
        )}

        {/* Category Discount */}
        {selectedType === 'PERCENTAGE_BY_CATEGORY' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Product Category
              </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="e.g., 15"
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
              />
            </div>
          </>
        )}

        {/* Points */}
        {selectedType === 'POINTS' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Points to Use (1 point = 1 THB, max 20% of total)
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="e.g., 68"
              min="0"
              className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
            />
          </div>
        )}

        {/* Seasonal */}
        {selectedType === 'SEASONAL' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Every X (THB)
              </label>
              <input
                type="number"
                value={everyX}
                onChange={(e) => setEveryX(e.target.value)}
                placeholder="e.g., 300"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Discount Y (THB)
              </label>
              <input
                type="number"
                value={discountY}
                onChange={(e) => setDiscountY(e.target.value)}
                placeholder="e.g., 40"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all font-semibold shadow-lg shadow-emerald-500/30"
        >
          Apply Discount
        </button>
      </form>

      {/* Applied Campaigns */}
      {campaigns.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-slate-800">Applied Campaigns</h3>
            <button
              onClick={clearCampaigns}
              className="text-rose-600 hover:text-rose-800 text-sm font-semibold"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {campaigns.map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${getCategoryBadgeColor(
                      campaign.category
                    )}`}
                  >
                    {campaign.category}
                  </span>
                  <span className="text-sm text-slate-700 font-medium">
                    {getCampaignDescription(campaign)}
                  </span>
                </div>
                <button
                  onClick={() => removeCampaign(campaign.type)}
                  className="text-rose-500 hover:text-rose-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-indigo-50 rounded-xl text-sm text-indigo-800 border border-indigo-200">
        <p className="font-semibold mb-2">💡 Rules:</p>
        <ul className="list-disc list-inside space-y-1 text-xs font-medium">
          <li>Only one campaign per category (Coupon, OnTop, Seasonal)</li>
          <li>Discounts applied in order: Coupon → OnTop → Seasonal</li>
          <li>Points discount is capped at 20% of total price</li>
        </ul>
      </div>
    </div>
  );
}
