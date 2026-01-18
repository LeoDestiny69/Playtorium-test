'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CartItem, DiscountCampaign, CartCalculation } from '../types';
import { calculateCart } from '../lib/discountCalculator';

interface CartContextType {
  items: CartItem[];
  campaigns: DiscountCampaign[];
  calculation: CartCalculation;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addCampaign: (campaign: DiscountCampaign) => void;
  removeCampaign: (type: DiscountCampaign['type']) => void;
  clearCampaigns: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [campaigns, setCampaigns] = useState<DiscountCampaign[]>([]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: generateId(),
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItemQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const addCampaign = useCallback((campaign: DiscountCampaign) => {
    setCampaigns((prev) => {
      // Remove existing campaign of the same category
      const filtered = prev.filter((c) => c.category !== campaign.category);
      return [...filtered, campaign];
    });
  }, []);

  const removeCampaign = useCallback((type: DiscountCampaign['type']) => {
    setCampaigns((prev) => prev.filter((c) => c.type !== type));
  }, []);

  const clearCampaigns = useCallback(() => {
    setCampaigns([]);
  }, []);

  const calculation = useMemo(
    () => calculateCart(items, campaigns),
    [items, campaigns]
  );

  const value: CartContextType = {
    items,
    campaigns,
    calculation,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    addCampaign,
    removeCampaign,
    clearCampaigns,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
