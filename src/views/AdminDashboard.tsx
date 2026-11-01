import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Shop, Order } from '../types/index.ts';
import {
  ShieldCheck,
  TrendingUp,
  Store,
  Users,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Tag,
  DollarSign,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    metrics: {
      totalUsers: number;
      totalSellers: number;
      totalShops: number;
      approvedShops: number;
      pendingShops: number;
      totalProducts: number;
      totalOrders: number;
      gmv: number;
      platformCommissionEarned: number;
    };
    recentShops: Shop[];
    recentOrders: Order[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleShopStatus = async (shopId: string, status: string) => {
    try {
      await api.updateShopStatus(shopId, status);
      setActionMessage(`Shop status updated to ${status}`);
      await loadData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  if (loading || !data) {
    return (
      <div className="py-20 text-center animate-pulse space-y-4">
        <div className="h-28 bg-gray-200 rounded-3xl max-w-4xl mx-auto" />
        <div className="h-44 bg-gray-100 rounded-3xl max-w-4xl mx-auto" />
      </div>
    );
  }

  const { metrics, recentShops, recentOrders } = data;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-gray-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-400 bg-lime-950/80 px-2.5 py-0.5 rounded-full border border-lime-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
            <span>Marketplace Director Portal</span>
          </div>
          <h1 className="text-2xl font-black mt-1">NearWear Platform Governance</h1>
          <p className="text-xs text-gray-400">
            Real-time transaction flow, merchant onboarding verification, and revenue split
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Analytics</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Gross Merchandise Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-gray-950 mt-1">
            ₹{metrics.gmv}
          </div>
          <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
            Total platform order volume
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Platform Commission (8%)</span>
            <DollarSign className="w-4 h-4 text-lime-600" />
          </div>
          <div className="text-xl font-black text-lime-700 mt-1">
            ₹{metrics.platformCommissionEarned}
          </div>
          <div className="text-[10px] text-lime-800 font-semibold mt-0.5">
            Net marketplace revenue
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Boutique Partners</span>
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-gray-950 mt-1">
            {metrics.approvedShops} <span className="text-xs text-gray-400 font-normal">/ {metrics.totalShops}</span>
          </div>
          <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
            {metrics.pendingShops} pending approval
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Live Catalog Products</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-gray-950 mt-1">
            {metrics.totalProducts}
          </div>
          <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
            Real in-store inventory items
          </div>
        </div>
      </div>

      {/* Boutique Verification Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-gray-950">
            Kolhapur Boutique Verification & Onboarding
          </h2>
          <p className="text-xs text-gray-500">
            Review storefront details, GSTIN compliance, and operational radius
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {recentShops.map((s) => (
            <div key={s.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={s.logoUrl} alt={s.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                <div>
                  <h4 className="font-bold text-gray-950 text-sm">{s.name}</h4>
                  <p className="text-gray-500 text-[11px]">
                    {s.category} • {s.area}, Kolhapur • {s.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    s.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {s.status}
                </span>

                {s.status !== 'APPROVED' ? (
                  <button
                    onClick={() => handleShopStatus(s.id, 'APPROVED')}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => handleShopStatus(s.id, 'SUSPENDED')}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-rose-50 hover:text-rose-700"
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Transactions Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-gray-950">
            Live Platform Orders & Revenue Split
          </h2>
          <p className="text-xs text-gray-500">
            Authoritative order logs with automatic 8% marketplace commission deductions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-[11px]">
                <th className="pb-2 font-bold">Order Number</th>
                <th className="pb-2 font-bold">Customer</th>
                <th className="pb-2 font-bold">Boutiques Split</th>
                <th className="pb-2 font-bold">Total (INR)</th>
                <th className="pb-2 font-bold">Payment</th>
                <th className="pb-2 font-bold">Placed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50">
                  <td className="py-3 font-extrabold text-gray-950">{ord.orderNumber}</td>
                  <td className="py-3 text-gray-700 font-medium">{ord.customerName}</td>
                  <td className="py-3 text-gray-600">
                    {ord.sellerOrders.map((so) => so.shop?.name).join(', ') || 'Boutique'}
                  </td>
                  <td className="py-3 font-black text-gray-950">₹{ord.totalAmount}</td>
                  <td className="py-3">
                    <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-semibold text-[10px]">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-[11px]">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
