/**
 * NearWear Marketplace Financial & Inventory Calculation Utilities
 * Handles decimal-safe arithmetic for Indian Rupee (INR) marketplace orders.
 */

export interface CartItemInput {
  shopId: string;
  shopName: string;
  price: number;
  quantity: number;
  variantId: string;
  baseDeliveryFee: number;
  freeDeliveryAbove: number;
}

export interface CouponDiscount {
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  value: number;
  minOrderVal: number;
  maxDiscount?: number | null;
}

export interface MultiSellerCheckoutSummary {
  subtotal: number;
  totalDeliveryFee: number;
  discountAmount: number;
  taxAmount: number;
  totalPayable: number;
  shopSplits: {
    shopId: string;
    shopName: string;
    itemsTotal: number;
    deliveryFee: number;
    qualifiesForFreeDelivery: boolean;
    freeDeliveryThreshold: number;
    amountNeededForFreeDelivery: number;
    commissionAmount: number;
    sellerPayable: number;
  }[];
}

/**
 * Rounds a number to 2 decimal places safely
 */
export function roundCurrency(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate multi-seller checkout split, delivery fees, and platform commission.
 */
export function calculateCheckoutSummary(
  items: CartItemInput[],
  deliveryType: 'HOME_DELIVERY' | 'STORE_PICKUP',
  coupon?: CouponDiscount | null,
  commissionRatePct: number = 8.0
): MultiSellerCheckoutSummary {
  const shopMap = new Map<string, {
    shopId: string;
    shopName: string;
    itemsTotal: number;
    baseDeliveryFee: number;
    freeDeliveryAbove: number;
  }>();

  for (const item of items) {
    const existing = shopMap.get(item.shopId);
    const itemTotal = roundCurrency(item.price * item.quantity);
    if (existing) {
      existing.itemsTotal = roundCurrency(existing.itemsTotal + itemTotal);
    } else {
      shopMap.set(item.shopId, {
        shopId: item.shopId,
        shopName: item.shopName,
        itemsTotal: itemTotal,
        baseDeliveryFee: item.baseDeliveryFee,
        freeDeliveryAbove: item.freeDeliveryAbove
      });
    }
  }

  let totalItemsSubtotal = 0;
  let totalDeliveryFee = 0;
  const shopSplits: MultiSellerCheckoutSummary['shopSplits'] = [];

  for (const shop of shopMap.values()) {
    totalItemsSubtotal = roundCurrency(totalItemsSubtotal + shop.itemsTotal);

    let deliveryFee = 0;
    const qualifiesForFreeDelivery = deliveryType === 'STORE_PICKUP' || shop.itemsTotal >= shop.freeDeliveryAbove;
    const amountNeededForFreeDelivery = qualifiesForFreeDelivery
      ? 0
      : roundCurrency(Math.max(0, shop.freeDeliveryAbove - shop.itemsTotal));

    if (deliveryType === 'HOME_DELIVERY') {
      deliveryFee = qualifiesForFreeDelivery ? 0 : shop.baseDeliveryFee;
    }

    totalDeliveryFee = roundCurrency(totalDeliveryFee + deliveryFee);

    // Platform commission is calculated strictly on items subtotal (excluding delivery fee)
    const commissionAmount = roundCurrency((shop.itemsTotal * commissionRatePct) / 100);
    const sellerPayable = roundCurrency(shop.itemsTotal + deliveryFee - commissionAmount);

    shopSplits.push({
      shopId: shop.shopId,
      shopName: shop.shopName,
      itemsTotal: shop.itemsTotal,
      deliveryFee,
      qualifiesForFreeDelivery,
      freeDeliveryThreshold: shop.freeDeliveryAbove,
      amountNeededForFreeDelivery,
      commissionAmount,
      sellerPayable
    });
  }

  // Calculate discount if coupon provided and eligible
  let discountAmount = 0;
  if (coupon && totalItemsSubtotal >= coupon.minOrderVal) {
    if (coupon.discountType === 'FIXED') {
      discountAmount = Math.min(coupon.value, totalItemsSubtotal);
    } else if (coupon.discountType === 'PERCENT') {
      const calculated = (totalItemsSubtotal * coupon.value) / 100;
      discountAmount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
    }
    discountAmount = roundCurrency(discountAmount);
  }

  // Standard 5% GST on apparel subtotal
  const taxAmount = roundCurrency((totalItemsSubtotal - discountAmount) * 0.05);
  const totalPayable = roundCurrency(totalItemsSubtotal + totalDeliveryFee + taxAmount - discountAmount);

  return {
    subtotal: totalItemsSubtotal,
    totalDeliveryFee,
    discountAmount,
    taxAmount,
    totalPayable: Math.max(0, totalPayable),
    shopSplits
  };
}

/**
 * Validate inventory stock reservation
 */
export function checkInventoryAvailability(available: number, requested: number): {
  success: boolean;
  message?: string;
} {
  if (requested <= 0) {
    return { success: false, message: 'Invalid requested quantity.' };
  }
  if (available < requested) {
    return {
      success: false,
      message: `Only ${available} unit(s) remaining in stock.`
    };
  }
  return { success: true };
}
