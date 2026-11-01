import React, { useState, useEffect } from 'react';
import { Order } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Package,
  Store,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Phone,
  ChevronRight
} from 'lucide-react';

interface CustomerOrdersViewProps {
  onBackToShopping: () => void;
}

const STATUS_STEPS = [
  { key: 'PENDING_SELLER_CONFIRMATION', label: 'Order Placed' },
  { key: 'ACCEPTED', label: 'Accepted by Boutique' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery / Ready' },
  { key: 'DELIVERED', label: 'Delivered' }
];

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({ onBackToShopping }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomerOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStepIndex = (status: string) => {
    if (status === 'DELIVERED') return 4;
    if (status === 'OUT_FOR_DELIVERY' || status === 'READY_FOR_PICKUP') return 3;
    if (status === 'PACKED' || status === 'PROCESSING') return 2;
    if (status === 'ACCEPTED') return 1;
    return 0;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950">My Fashion Orders</h1>
          <p className="text-xs text-gray-500">
            Real-time status updates directly from Kolhapur boutiques
          </p>
        </div>

        <button
          onClick={onBackToShopping}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-2xs shrink-0"
        >
          Browse More Clothes
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
          <Package className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-extrabold text-gray-900 text-base">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Discover local fashion from Rajarampuri, Shahupuri, and Mahadwar Road boutiques.
          </p>
          <button
            onClick={onBackToShopping}
            className="px-4 py-2 bg-gray-950 text-white text-xs font-bold rounded-xl hover:bg-gray-800"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Order Meta Bar */}
              <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-extrabold text-gray-950 text-sm">
                    Order #{order.orderNumber}
                  </span>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.deliveryType === 'HOME_DELIVERY' ? 'Doorstep Delivery' : 'In-Store Pickup'}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-gray-950 block">
                    ₹{order.totalAmount}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Payment: {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </div>
              </div>

              {/* Sub-Orders by Shop */}
              <div className="p-6 space-y-6">
                {order.sellerOrders.map((so) => {
                  const currentStep = getStepIndex(so.status);
                  const isCancelled = so.status === 'REJECTED' || so.status === 'CANCELLED';

                  return (
                    <div
                      key={so.id}
                      className="border border-gray-100 rounded-2xl p-4 bg-gray-50/30 space-y-4"
                    >
                      {/* Shop Info Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gray-950 text-white flex items-center justify-center">
                            <Store className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-950 text-xs">
                              {so.shop.name}
                            </h4>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-lime-600" />
                              {so.shop.area}, Kolhapur • Suborder {so.subOrderNumber}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-lime-100 text-lime-800">
                          Status: {so.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Visual Stepper */}
                      {!isCancelled && (
                        <div className="py-2">
                          <div className="grid grid-cols-5 gap-1 relative">
                            {STATUS_STEPS.map((st, idx) => {
                              const isCompleted = idx <= currentStep;
                              const isCurrent = idx === currentStep;

                              return (
                                <div key={st.key} className="text-center relative">
                                  <div
                                    className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold transition-all ${
                                      isCompleted
                                        ? 'bg-lime-500 text-black shadow-xs'
                                        : 'bg-gray-200 text-gray-500'
                                    } ${isCurrent ? 'ring-4 ring-lime-200 scale-110' : ''}`}
                                  >
                                    {isCompleted ? '✓' : idx + 1}
                                  </div>
                                  <span
                                    className={`text-[10px] block mt-1.5 leading-tight font-medium ${
                                      isCurrent ? 'font-bold text-gray-900' : 'text-gray-500'
                                    }`}
                                  >
                                    {st.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Items List */}
                      <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 overflow-hidden">
                        {so.items.map((item) => (
                          <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              {item.product?.images?.[0] && (
                                <img
                                  src={item.product.images[0].url}
                                  alt={item.title}
                                  className="w-12 h-14 rounded-lg object-cover bg-gray-100"
                                />
                              )}
                              <div>
                                <h5 className="font-bold text-gray-900 line-clamp-1">{item.title}</h5>
                                <p className="text-[11px] text-gray-500">
                                  Size: <span className="font-semibold text-gray-800">{item.size}</span> • Color: <span className="font-semibold text-gray-800">{item.color}</span> • Qty: <span className="font-semibold text-gray-800">{item.quantity}</span>
                                </p>
                              </div>
                            </div>
                            <span className="font-extrabold text-gray-950 shrink-0">
                              ₹{item.totalPrice}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Shop Subtotal & Delivery Fee */}
                      <div className="flex justify-between items-center text-xs text-gray-600 pt-1">
                        <span>Items Subtotal: ₹{so.shopSubtotal} + Delivery: ₹{so.deliveryFee}</span>
                        <span className="font-bold text-gray-950">Suborder Total: ₹{so.shopSubtotal + so.deliveryFee}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Address & Contact */}
              <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-lime-600 shrink-0" />
                  <span>
                    Delivery Address: <strong className="text-gray-900">{order.deliveryAddress}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>{order.customerPhone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
