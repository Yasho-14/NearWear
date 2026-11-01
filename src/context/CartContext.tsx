import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types/index.ts';

interface ShopGroup {
  shopId: string;
  shopName: string;
  shopArea: string;
  baseDeliveryFee: number;
  freeDeliveryAbove: number;
  items: CartItem[];
  subtotal: number;
  qualifiesForFreeDelivery: boolean;
  amountNeededForFreeDelivery: number;
  deliveryFee: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  shopGroups: ShopGroup[];
  itemsSubtotal: number;
  totalDeliveryFee: number;
  taxAmount: number;
  totalPayable: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nearwear_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('nearwear_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variant.id === variant.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          id: `${variant.id}-${Date.now()}`,
          product,
          variant,
          quantity
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setAppliedDiscount(0);
  };

  // Group items by shop
  const shopGroupMap = new Map<string, ShopGroup>();

  for (const item of items) {
    const shop = item.product.shop;
    const itemPrice = item.variant.price || item.product.price;
    const lineTotal = itemPrice * item.quantity;

    if (!shopGroupMap.has(shop.id)) {
      shopGroupMap.set(shop.id, {
        shopId: shop.id,
        shopName: shop.name,
        shopArea: shop.area,
        baseDeliveryFee: shop.baseDeliveryFee || 30,
        freeDeliveryAbove: shop.freeDeliveryAbove || 799,
        items: [],
        subtotal: 0,
        qualifiesForFreeDelivery: false,
        amountNeededForFreeDelivery: 0,
        deliveryFee: 0
      });
    }

    const group = shopGroupMap.get(shop.id)!;
    group.items.push(item);
    group.subtotal += lineTotal;
  }

  let calculatedItemsSubtotal = 0;
  let calculatedDeliveryFee = 0;

  const shopGroups: ShopGroup[] = [];

  for (const group of shopGroupMap.values()) {
    calculatedItemsSubtotal += group.subtotal;
    group.qualifiesForFreeDelivery = group.subtotal >= group.freeDeliveryAbove;
    group.amountNeededForFreeDelivery = group.qualifiesForFreeDelivery
      ? 0
      : Math.max(0, group.freeDeliveryAbove - group.subtotal);
    group.deliveryFee = group.qualifiesForFreeDelivery ? 0 : group.baseDeliveryFee;
    calculatedDeliveryFee += group.deliveryFee;
    shopGroups.push(group);
  }

  // Coupon handling
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'KOLHAPUR100') {
      if (calculatedItemsSubtotal < 499) {
        return { success: false, message: 'KOLHAPUR100 requires a minimum order of ₹499' };
      }
      setCouponCode('KOLHAPUR100');
      setAppliedDiscount(100);
      return { success: true, message: '🎉 Flat ₹100 local discount applied!' };
    }
    if (cleanCode === 'NEARWEAR20') {
      if (calculatedItemsSubtotal < 799) {
        return { success: false, message: 'NEARWEAR20 requires a minimum order of ₹799' };
      }
      const discount = Math.min(250, Math.round(calculatedItemsSubtotal * 0.2));
      setCouponCode('NEARWEAR20');
      setAppliedDiscount(discount);
      return { success: true, message: `🎉 20% discount applied: Saved ₹${discount}!` };
    }
    return { success: false, message: 'Invalid coupon code. Try KOLHAPUR100 or NEARWEAR20.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
  };

  const taxAmount = Math.round((calculatedItemsSubtotal - appliedDiscount) * 0.05 * 100) / 100;
  const totalPayable = Math.max(0, Math.round((calculatedItemsSubtotal + calculatedDeliveryFee + taxAmount - appliedDiscount) * 100) / 100);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        couponCode,
        setCouponCode,
        appliedDiscount,
        applyCoupon,
        removeCoupon,
        shopGroups,
        itemsSubtotal: calculatedItemsSubtotal,
        totalDeliveryFee: calculatedDeliveryFee,
        taxAmount,
        totalPayable,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
