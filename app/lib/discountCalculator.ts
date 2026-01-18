import {
  CartItem,
  DiscountCampaign,
  DiscountBreakdown,
  CartCalculation,
  FixedAmountCoupon,
  PercentageCoupon,
  CategoryDiscount,
  PointsDiscount,
  SeasonalDiscount,
  ProductCategory,
} from '../types';

/**
 * Calculate subtotal from cart items
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Calculate subtotal for a specific category
 */
export function calculateCategorySubtotal(
  items: CartItem[],
  category: ProductCategory
): number {
  return items
    .filter((item) => item.category === category)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Calculate Fixed Amount Coupon discount
 * Subtracts a fixed amount from total
 */
export function calculateFixedAmountDiscount(
  campaign: FixedAmountCoupon,
  currentTotal: number
): DiscountBreakdown {
  const discountAmount = Math.min(campaign.amount, currentTotal);
  return {
    campaign,
    discountAmount,
    description: `Fixed amount coupon: -${campaign.amount} THB`,
  };
}

/**
 * Calculate Percentage Coupon discount
 * Subtracts a percentage from total
 */
export function calculatePercentageDiscount(
  campaign: PercentageCoupon,
  currentTotal: number
): DiscountBreakdown {
  const discountAmount = (currentTotal * campaign.percentage) / 100;
  return {
    campaign,
    discountAmount,
    description: `Percentage coupon: -${campaign.percentage}%`,
  };
}

/**
 * Calculate Category Percentage discount (On Top)
 * Discounts specific category items
 */
export function calculateCategoryDiscount(
  campaign: CategoryDiscount,
  items: CartItem[]
): DiscountBreakdown {
  const categorySubtotal = calculateCategorySubtotal(
    items,
    campaign.productCategory
  );
  const discountAmount = (categorySubtotal * campaign.percentage) / 100;
  return {
    campaign,
    discountAmount,
    description: `${campaign.percentage}% off on ${campaign.productCategory}: -${discountAmount.toFixed(2)} THB`,
  };
}

/**
 * Calculate Points discount (On Top)
 * 1 point = 1 THB, capped at 20% of total price
 */
export function calculatePointsDiscount(
  campaign: PointsDiscount,
  currentTotal: number
): DiscountBreakdown {
  const maxDiscount = currentTotal * 0.2; // 20% cap
  const requestedDiscount = campaign.points; // 1 point = 1 THB
  const discountAmount = Math.min(requestedDiscount, maxDiscount);
  
  const cappedMessage = requestedDiscount > maxDiscount 
    ? ` (capped at 20% = ${maxDiscount.toFixed(2)} THB)` 
    : '';
  
  return {
    campaign,
    discountAmount,
    description: `Points discount: ${campaign.points} points = -${discountAmount.toFixed(2)} THB${cappedMessage}`,
  };
}

/**
 * Calculate Seasonal discount
 * At every X THB, subtract Y THB
 */
export function calculateSeasonalDiscount(
  campaign: SeasonalDiscount,
  currentTotal: number
): DiscountBreakdown {
  const timesToApply = Math.floor(currentTotal / campaign.everyXAmount);
  const discountAmount = timesToApply * campaign.discountYAmount;
  
  return {
    campaign,
    discountAmount,
    description: `Seasonal: ${campaign.discountYAmount} THB off every ${campaign.everyXAmount} THB (${timesToApply}x) = -${discountAmount} THB`,
  };
}

/**
 * Sort campaigns by category priority:
 * 1. Coupon (can only use one)
 * 2. OnTop (can only use one)
 * 3. Seasonal (can only use one)
 */
export function sortCampaignsByCategory(
  campaigns: DiscountCampaign[]
): DiscountCampaign[] {
  const categoryOrder: Record<string, number> = {
    Coupon: 1,
    OnTop: 2,
    Seasonal: 3,
  };

  return [...campaigns].sort(
    (a, b) => categoryOrder[a.category] - categoryOrder[b.category]
  );
}

/**
 * Filter campaigns to ensure only one per category
 */
export function filterOneCampaignPerCategory(
  campaigns: DiscountCampaign[]
): DiscountCampaign[] {
  const usedCategories = new Set<string>();
  const filtered: DiscountCampaign[] = [];

  for (const campaign of campaigns) {
    if (!usedCategories.has(campaign.category)) {
      usedCategories.add(campaign.category);
      filtered.push(campaign);
    }
  }

  return filtered;
}

/**
 * Main calculation function
 * Applies discounts in order: Coupon -> OnTop -> Seasonal
 * Only one campaign per category is allowed
 */
export function calculateCart(
  items: CartItem[],
  campaigns: DiscountCampaign[]
): CartCalculation {
  const subtotal = calculateSubtotal(items);
  
  if (items.length === 0) {
    return {
      subtotal: 0,
      discountBreakdowns: [],
      totalDiscount: 0,
      finalPrice: 0,
    };
  }

  // Filter and sort campaigns
  const sortedCampaigns = sortCampaignsByCategory(
    filterOneCampaignPerCategory(campaigns)
  );

  const discountBreakdowns: DiscountBreakdown[] = [];
  let currentTotal = subtotal;

  for (const campaign of sortedCampaigns) {
    let breakdown: DiscountBreakdown;

    switch (campaign.type) {
      case 'FIXED_AMOUNT':
        breakdown = calculateFixedAmountDiscount(campaign, currentTotal);
        break;
      case 'PERCENTAGE':
        breakdown = calculatePercentageDiscount(campaign, currentTotal);
        break;
      case 'PERCENTAGE_BY_CATEGORY':
        breakdown = calculateCategoryDiscount(campaign, items);
        break;
      case 'POINTS':
        breakdown = calculatePointsDiscount(campaign, currentTotal);
        break;
      case 'SEASONAL':
        breakdown = calculateSeasonalDiscount(campaign, currentTotal);
        break;
      default:
        continue;
    }

    if (breakdown.discountAmount > 0) {
      discountBreakdowns.push(breakdown);
      currentTotal -= breakdown.discountAmount;
      currentTotal = Math.max(0, currentTotal); // Ensure non-negative
    }
  }

  const totalDiscount = subtotal - currentTotal;

  return {
    subtotal,
    discountBreakdowns,
    totalDiscount,
    finalPrice: Math.max(0, currentTotal),
  };
}

/**
 * Format currency in THB
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
