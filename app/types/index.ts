// Product Categories
export type ProductCategory = 'Clothing' | 'Accessories' | 'Electronics';

// Product Item
export interface CartItem {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  quantity: number;
}

// Discount Campaign Types
export type CampaignCategory = 'Coupon' | 'OnTop' | 'Seasonal';

// Coupon Campaigns
export interface FixedAmountCoupon {
  type: 'FIXED_AMOUNT';
  category: 'Coupon';
  amount: number; // Amount to subtract from total
}

export interface PercentageCoupon {
  type: 'PERCENTAGE';
  category: 'Coupon';
  percentage: number; // Percentage to subtract (0-100)
}

// On Top Campaigns
export interface CategoryDiscount {
  type: 'PERCENTAGE_BY_CATEGORY';
  category: 'OnTop';
  productCategory: ProductCategory;
  percentage: number; // Percentage discount for specific category
}

export interface PointsDiscount {
  type: 'POINTS';
  category: 'OnTop';
  points: number; // Customer points (1 point = 1 THB, max 20% of total)
}

// Seasonal Campaigns
export interface SeasonalDiscount {
  type: 'SEASONAL';
  category: 'Seasonal';
  everyXAmount: number; // Every X THB
  discountYAmount: number; // Discount Y THB
}

// Union type for all discount campaigns
export type DiscountCampaign =
  | FixedAmountCoupon
  | PercentageCoupon
  | CategoryDiscount
  | PointsDiscount
  | SeasonalDiscount;

// Cart State
export interface Cart {
  items: CartItem[];
  appliedDiscounts: DiscountCampaign[];
}

// Calculation Result
export interface DiscountBreakdown {
  campaign: DiscountCampaign;
  discountAmount: number;
  description: string;
}

export interface CartCalculation {
  subtotal: number;
  discountBreakdowns: DiscountBreakdown[];
  totalDiscount: number;
  finalPrice: number;
}
