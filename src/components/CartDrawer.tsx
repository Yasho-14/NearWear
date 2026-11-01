import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  X,
  Trash2,
  Store,
  MapPin,
  Tag,
  CheckCircle,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types/index.ts';

interface CartDrawerProps {
  onOrderSuccess: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOrderSuccess }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    shopGroups,
    itemsSubtotal,
    totalDeliveryFee,
    taxAmount,
    totalPayable,
    couponCode,
    appliedDiscount,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { user } = useAuth();

  const [deliveryType, setDeliveryType] = useState<'HOME_DELIVERY' | 'STORE_PICKUP'>('HOME_DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Delivery form state
  const [customerName, setCustomerName] = useState(user?.name || 'Aarav Deshmukh');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98220 12345');
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.addresses?.[0]?.street
      ? `${user.addresses[0].street}, ${user.addresses[0].area}, Kolhapur - ${user.addresses[0].pincode}`
      : 'Flat 302, Sai Heritage, 4th Lane, Rajarampuri, Kolhapur - 416008'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    const res = applyCoupon(code);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (deliveryType === 'HOME_DELIVERY' && !deliveryAddress.trim()) {
      setErrorMessage('Please enter your Kolhapur delivery address');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Please enter your contact mobile number');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          variantId: i.variant.id,
          quantity: i.quantity
        })),
        deliveryType,
        deliveryAddress: deliveryType === 'HOME_DELIVERY' ? deliveryAddress : 'Store Pickup',
        customerPhone,
        customerName,
        couponCode: couponCode || undefined,
        paymentMethod
      };

      const order = await api.checkout(payload);
      clearCart();
      setIsCartOpen(false);
      onOrderSuccess(order);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div>
            <h2 className="text-base font-extrabold text-gray-950">Your Shopping Bag</h2>
            <p className="text-xs text-gray-500">
              {items.length} {items.length === 1 ? 'item' : 'items'} from {shopGroups.length} Kolhapur {shopGroups.length === 1 ? 'boutique' : 'boutiques'}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Bag"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center mx-auto">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Your Bag is Empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Discover authentic Paithani sarees, Kolhapuri leather chappals, and modern apparel from nearby stores.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-gray-950 text-white text-xs font-bold hover:bg-gray-800 shadow-xs"
              >
                Browse Kolhapur Racks
              </button>
            </div>
          ) : (
            <>
              {/* Grouped by Shop */}
              <div className="space-y-4">
                {shopGroups.map((group) => (
                  <div
                    key={group.shopId}
                    className="border border-gray-200/90 rounded-2xl p-4 bg-gray-50/40 space-y-3"
                  >
                    {/* Store Title & Free Delivery Progress */}
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-950 text-white">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-950 text-xs">{group.shopName}</h4>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-lime-600" />
                            {group.shopArea}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-gray-900">
                        ₹{group.subtotal}
                      </span>
                    </div>

                    {/* Free Delivery Meter */}
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-[11px]">
                      {deliveryType === 'STORE_PICKUP' ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Free in-store pickup ready
                        </span>
                      ) : group.qualifiesForFreeDelivery ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          🎉 Free Local Delivery unlocked from this store!
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between text-gray-600">
                            <span>Add <strong>₹{group.amountNeededForFreeDelivery}</strong> more for Free Delivery</span>
                            <span className="text-gray-400">Standard fee: ₹{group.baseDeliveryFee}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-lime-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (group.subtotal / group.freeDeliveryAbove) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Store Items */}
                    <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 overflow-hidden">
                      {group.items.map((item) => (
                        <div key={item.id} className="p-3 flex items-center gap-3">
                          <img
                            src={item.product.images[0]?.url || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&auto=format&fit=crop&q=80'}
                            alt={item.product.title}
                            className="w-14 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-gray-900 text-xs truncate">
                              {item.product.title}
                            </h5>
                            <p className="text-[11px] text-gray-500">
                              Size: <strong className="text-gray-800">{item.variant.size}</strong> • Color: <strong className="text-gray-800">{item.variant.color}</strong>
                            </p>
                            <span className="text-xs font-black text-gray-950 block mt-0.5">
                              ₹{(item.variant.price || item.product.price) * item.quantity}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-600 hover:text-black"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-600 hover:text-black"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Type Option */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 text-xs block">Delivery Method</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryType('HOME_DELIVERY')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      deliveryType === 'HOME_DELIVERY'
                        ? 'border-lime-500 bg-lime-50/50 ring-2 ring-lime-400/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Truck className={`w-4 h-4 mt-0.5 ${deliveryType === 'HOME_DELIVERY' ? 'text-lime-700' : 'text-gray-500'}`} />
                    <div>
                      <div className="font-bold text-xs text-gray-900">Home Delivery</div>
                      <div className="text-[10px] text-gray-500">60-90 min doorstep delivery</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setDeliveryType('STORE_PICKUP')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      deliveryType === 'STORE_PICKUP'
                        ? 'border-lime-500 bg-lime-50/50 ring-2 ring-lime-400/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Store className={`w-4 h-4 mt-0.5 ${deliveryType === 'STORE_PICKUP' ? 'text-lime-700' : 'text-gray-500'}`} />
                    <div>
                      <div className="font-bold text-xs text-gray-900">Store Pickup</div>
                      <div className="text-[10px] text-gray-500">Free • Ready in 30 mins</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Address Form if Home Delivery */}
              {deliveryType === 'HOME_DELIVERY' && (
                <div className="p-3.5 bg-gray-50 rounded-xl space-y-2.5 border border-gray-200">
                  <span className="font-bold text-gray-900 text-xs block">Kolhapur Delivery Details</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Mobile Phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Street Address, Flat / Apartment, Area in Kolhapur"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-white resize-none"
                  />
                </div>
              )}

              {/* Coupon Bar with 1-Click Quick Chips */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 text-xs block">Apply Local Coupon</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. KOLHAPUR100"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 p-2 text-xs uppercase font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>

                {/* Quick Coupon Chips for Easy Testing */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => handleApplyCoupon('KOLHAPUR100')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-lime-50 text-lime-800 border border-lime-300 hover:bg-lime-100 flex items-center gap-1 transition-colors"
                  >
                    <Tag className="w-3 h-3 text-lime-600" />
                    <span>KOLHAPUR100 (-₹100)</span>
                  </button>
                  <button
                    onClick={() => handleApplyCoupon('NEARWEAR20')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-lime-50 text-lime-800 border border-lime-300 hover:bg-lime-100 flex items-center gap-1 transition-colors"
                  >
                    <Tag className="w-3 h-3 text-lime-600" />
                    <span>NEARWEAR20 (20% OFF)</span>
                  </button>
                </div>

                {couponMessage && (
                  <p className={`text-xs font-medium ${couponMessage.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {couponMessage.text}
                  </p>
                )}

                {appliedDiscount > 0 && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <span>Applied Coupon: {couponCode}</span>
                    <button onClick={removeCoupon} className="text-emerald-900 underline text-[11px]">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 text-xs block">Payment Mode</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-lime-500 bg-lime-50/50 ring-2 ring-lime-400/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Banknote className={`w-4 h-4 mt-0.5 ${paymentMethod === 'COD' ? 'text-lime-700' : 'text-gray-500'}`} />
                    <div>
                      <div className="font-bold text-xs text-gray-900">Cash on Delivery</div>
                      <div className="text-[10px] text-gray-500">Pay when order arrives</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-lime-500 bg-lime-50/50 ring-2 ring-lime-400/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className={`w-4 h-4 mt-0.5 ${paymentMethod === 'RAZORPAY' ? 'text-lime-700' : 'text-gray-500'}`} />
                    <div>
                      <div className="font-bold text-xs text-gray-900">UPI / Razorpay</div>
                      <div className="text-[10px] text-gray-500">Instant test payment</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{itemsSubtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Local Delivery Fees</span>
                  <span className="font-semibold text-gray-900">
                    {totalDeliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${totalDeliveryFee}`
                    )}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Applicable GST (5%)</span>
                  <span className="font-semibold text-gray-900">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-950 pt-2 border-t border-gray-200">
                  <span>Total Payable</span>
                  <span className="text-base text-gray-950">₹{totalPayable}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white space-y-2">
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gray-950 hover:bg-gray-800 disabled:bg-gray-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order • ₹{totalPayable}</span>
                  <ArrowRight className="w-4 h-4 text-lime-400" />
                </>
              )}
            </button>
            <p className="text-[11px] text-gray-600 text-center font-medium">
              🔒 Real-time stock reservation & multi-seller order routing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
