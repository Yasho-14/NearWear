import React from 'react';
import { Order } from '../types/index.ts';
import { CheckCircle, Package, ArrowRight, MapPin, Store, Clock } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrders
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Order Confirmed
          </span>
          <h3 className="text-xl font-black text-gray-950 mt-2">
            Thank you, {order.customerName.split(' ')[0]}!
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Order <strong className="text-gray-900">{order.orderNumber}</strong> has been routed to{' '}
            {order.sellerOrders.length} local Kolhapur {order.sellerOrders.length === 1 ? 'store' : 'stores'}.
          </p>
        </div>

        {/* Suborder summaries */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-2.5">
          <div className="text-xs font-bold text-gray-900 flex items-center justify-between">
            <span>Fulfillment Split:</span>
            <span className="text-lime-700 bg-lime-50 px-2 py-0.5 rounded text-[11px]">
              {order.deliveryType === 'HOME_DELIVERY' ? 'Doorstep Delivery' : 'In-Store Pickup'}
            </span>
          </div>

          <div className="space-y-1.5 divide-y divide-gray-100">
            {order.sellerOrders.map((so) => (
              <div key={so.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-gray-900">{so.shop.name}</div>
                  <div className="text-[10px] text-gray-500">{so.items.length} items • Suborder {so.subOrderNumber}</div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-gray-950">₹{so.shopSubtotal + so.deliveryFee}</span>
                  <div className="text-[10px] text-emerald-600 font-semibold">Accepted</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-200 flex justify-between text-xs font-extrabold text-gray-950">
            <span>Total Paid ({order.paymentMethod})</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <Package className="w-4 h-4 text-lime-400" />
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
