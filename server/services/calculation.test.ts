import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCheckoutSummary,
  checkInventoryAvailability,
  roundCurrency,
  CartItemInput
} from './calculation.ts';

test('roundCurrency correctly formats decimals', () => {
  assert.equal(roundCurrency(10.126), 10.13);
  assert.equal(roundCurrency(99.004), 99.0);
  assert.equal(roundCurrency(149.999), 150.0);
});

test('multi-seller checkout splits delivery and calculations properly', () => {
  const items: CartItemInput[] = [
    // Shop 1: Sagar Ethnic (Free delivery above 799)
    {
      shopId: 'shop-1',
      shopName: 'Sagar Ethnic',
      price: 899.0,
      quantity: 1,
      variantId: 'v-1',
      baseDeliveryFee: 30.0,
      freeDeliveryAbove: 799.0
    },
    // Shop 2: Royal Chappals (Free delivery above 999, subtotal is 749, so fee applies)
    {
      shopId: 'shop-2',
      shopName: 'Royal Chappals',
      price: 749.0,
      quantity: 1,
      variantId: 'v-2',
      baseDeliveryFee: 40.0,
      freeDeliveryAbove: 999.0
    }
  ];

  const summary = calculateCheckoutSummary(items, 'HOME_DELIVERY', null, 8.0);

  assert.equal(summary.subtotal, 1648.0);
  // Shop 1 qualifies for free delivery (899 >= 799) -> fee is 0
  // Shop 2 does not qualify (749 < 999) -> fee is 40
  assert.equal(summary.totalDeliveryFee, 40.0);
  assert.equal(summary.shopSplits.length, 2);

  const shop1Split = summary.shopSplits.find(s => s.shopId === 'shop-1');
  assert.ok(shop1Split);
  assert.equal(shop1Split.deliveryFee, 0);
  assert.equal(shop1Split.qualifiesForFreeDelivery, true);
  assert.equal(shop1Split.commissionAmount, 71.92); // 8% of 899

  const shop2Split = summary.shopSplits.find(s => s.shopId === 'shop-2');
  assert.ok(shop2Split);
  assert.equal(shop2Split.deliveryFee, 40.0);
  assert.equal(shop2Split.qualifiesForFreeDelivery, false);
  assert.equal(shop2Split.amountNeededForFreeDelivery, 250.0); // 999 - 749
});

test('store pickup sets all delivery fees to zero', () => {
  const items: CartItemInput[] = [
    {
      shopId: 'shop-2',
      shopName: 'Royal Chappals',
      price: 500.0,
      quantity: 1,
      variantId: 'v-2',
      baseDeliveryFee: 40.0,
      freeDeliveryAbove: 999.0
    }
  ];

  const summary = calculateCheckoutSummary(items, 'STORE_PICKUP', null);
  assert.equal(summary.totalDeliveryFee, 0);
});

test('fixed and percentage coupons apply within minOrderVal limits', () => {
  const items: CartItemInput[] = [
    {
      shopId: 'shop-1',
      shopName: 'Sagar Ethnic',
      price: 600.0,
      quantity: 1,
      variantId: 'v-1',
      baseDeliveryFee: 30.0,
      freeDeliveryAbove: 799.0
    }
  ];

  // Fixed coupon KOLHAPUR100: 100 off above 499
  const summaryFixed = calculateCheckoutSummary(items, 'HOME_DELIVERY', {
    code: 'KOLHAPUR100',
    discountType: 'FIXED',
    value: 100.0,
    minOrderVal: 499.0
  });
  assert.equal(summaryFixed.discountAmount, 100.0);

  // Percent coupon: 20% off with max discount 100
  const summaryPercent = calculateCheckoutSummary(items, 'HOME_DELIVERY', {
    code: 'NEARWEAR20',
    discountType: 'PERCENT',
    value: 20.0,
    minOrderVal: 499.0,
    maxDiscount: 100.0
  });
  assert.equal(summaryPercent.discountAmount, 100.0); // 20% of 600 is 120, capped at 100
});

test('checkInventoryAvailability prevents overselling', () => {
  assert.equal(checkInventoryAvailability(5, 3).success, true);
  assert.equal(checkInventoryAvailability(5, 5).success, true);
  assert.equal(checkInventoryAvailability(5, 6).success, false);
  assert.equal(checkInventoryAvailability(0, 1).success, false);
  assert.equal(checkInventoryAvailability(5, 0).success, false);
});
