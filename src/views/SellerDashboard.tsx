import React, { useState, useEffect } from 'react';
import { SellerOrder, Product, Category, Shop } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Store,
  Package,
  PlusCircle,
  TrendingUp,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  Sparkles,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'upload' | 'inventory'>('orders');
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [gender, setGender] = useState<'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX'>('MEN');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [fabric, setFabric] = useState('');
  const [brand, setBrand] = useState('Local Artisan');
  const [imageUrl, setImageUrl] = useState('');

  // Variants in upload
  const [variants, setVariants] = useState<
    { size: string; color: string; colorHex: string; stock: number }[]
  >([
    { size: 'M', color: 'Navy Blue', colorHex: '#1E3A8A', stock: 10 },
    { size: 'L', color: 'Navy Blue', colorHex: '#1E3A8A', stock: 10 }
  ]);

  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shop = user?.sellerProfile?.shops?.[0];

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordList, catList] = await Promise.all([
        api.getSellerOrders(),
        api.getCategories()
      ]);
      setOrders(ordList);
      setCategories(catList);
      if (catList.length > 0 && !categoryId) {
        setCategoryId(catList[0].id);
      }
    } catch (err) {
      console.error('Failed to load seller portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateSellerOrderStatus(orderId, newStatus);
      await loadData();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: 'XL', color: 'Black', colorHex: '#000000', stock: 8 }]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) {
      setFormError('No registered boutique found for your seller account.');
      return;
    }
    if (!title || !price || variants.length === 0) {
      setFormError('Title, price, and at least one size variant are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const payload = {
        shopId: shop.id,
        title,
        description: description || `${title} from ${shop.name}.`,
        categoryId: categoryId || undefined,
        gender,
        price: Number(price),
        mrp: mrp ? Number(mrp) : Number(price),
        fabric,
        brand: brand || shop.name,
        images: [
          {
            url: imageUrl.trim() || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
            altText: title
          }
        ],
        variants: variants.map((v) => ({
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock: Number(v.stock)
        }))
      };

      await api.createProduct(payload);
      setFormSuccess(`🎉 Product "${title}" published live with ${variants.length} inventory variants!`);
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setMrp('');
      setImageUrl('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics calculations
  const totalSales = orders.reduce((sum, o) => (o.status !== 'REJECTED' && o.status !== 'CANCELLED' ? sum + o.shopSubtotal : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING_SELLER_CONFIRMATION').length;
  const completedOrders = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Merchant Header */}
      <div className="bg-gray-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 p-1 border border-white/20 shrink-0 overflow-hidden">
            <img
              src={shop?.logoUrl || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop&q=80'}
              alt={shop?.name || 'Shop'}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-400 bg-lime-950/80 px-2.5 py-0.5 rounded-full border border-lime-500/30">
              <Sparkles className="w-3 h-3 text-lime-400" />
              <span>Seller Control Center • Kolhapur</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {shop?.name || 'Sagar Ethnic & Paithani Silk'}
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-lime-400" />
              <span>{shop?.streetAddress}, {shop?.area}, Kolhapur - {shop?.pincode}</span>
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Orders</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Boutique Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-gray-950 mt-1">
            ₹{totalSales}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            +₹{Math.round(totalSales * 0.92)} Net Seller Payable (92%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Pending Confirmations</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-gray-950 mt-1">
            {pendingOrders}
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
            Needs acceptance
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Delivered Orders</span>
            <CheckCircle2 className="w-4 h-4 text-lime-600" />
          </div>
          <div className="text-xl font-black text-gray-950 mt-1">
            {completedOrders}
          </div>
          <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
            Fulfilled successfully
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-gray-950 mt-1">
            {orders.length}
          </div>
          <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
            All customer requests
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-gray-950 text-gray-950'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Fulfillment Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'upload'
              ? 'border-gray-950 text-gray-950'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New Garment</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 space-y-2">
              <Package className="w-8 h-8 text-gray-400 mx-auto" />
              <h4 className="font-bold text-gray-900 text-sm">No orders yet</h4>
              <p className="text-xs text-gray-500">Orders placed by customers for your store will appear here immediately.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <span className="font-extrabold text-gray-950 text-sm">
                        Suborder #{ord.subOrderNumber}
                      </span>
                      <p className="text-xs text-gray-500">
                        Parent: {ord.order?.orderNumber} • Customer: <strong className="text-gray-800">{ord.order?.customerName}</strong> ({ord.order?.customerPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-lime-100 text-lime-900">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Purchased Items */}
                  <div className="divide-y divide-gray-100 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    {ord.items.map((item) => (
                      <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-gray-900">{item.title}</div>
                          <div className="text-[11px] text-gray-500">
                            Size: <span className="font-semibold text-gray-800">{item.size}</span> • Color: <span className="font-semibold text-gray-800">{item.color}</span> • Qty: <span className="font-semibold text-gray-800">{item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-extrabold text-gray-950">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Financials & Payout summary */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span>Subtotal: ₹{ord.shopSubtotal} | Delivery: ₹{ord.deliveryFee} | Commission (8%): -₹{ord.platformCommission}</span>
                    </div>
                    <div className="font-black text-gray-950 text-sm">
                      Your Earnings: ₹{ord.sellerPayable}
                    </div>
                  </div>

                  {/* Action Buttons to Advance Order Lifecycle */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                    {ord.status === 'PENDING_SELLER_CONFIRMATION' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(ord.id, 'ACCEPTED')}
                          className="px-4 py-2 bg-gray-950 hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(ord.id, 'REJECTED')}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {ord.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleStatusChange(ord.id, 'PACKED')}
                        className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5 text-lime-400" />
                        <span>Mark as Packed</span>
                      </button>
                    )}

                    {ord.status === 'PACKED' && (
                      <button
                        onClick={() => handleStatusChange(ord.id, 'OUT_FOR_DELIVERY')}
                        className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-gray-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Handover for Delivery / Ready for Pickup</span>
                      </button>
                    )}

                    {ord.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleStatusChange(ord.id, 'DELIVERED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Delivery to Customer</span>
                      </button>
                    )}

                    {ord.status === 'DELIVERED' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Delivered successfully • Inventory reconciled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Upload New Product Form */}
      {activeTab === 'upload' && (
        <form onSubmit={handleCreateProduct} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-gray-950">Add Clothing to In-Store Catalog</h2>
            <p className="text-xs text-gray-500">
              Instantly publishes to NearWear Kolhapur shoppers with real-time inventory
            </p>
          </div>

          {formSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Product Title</label>
              <input
                type="text"
                placeholder="e.g. Traditional Handloom Cotton Silk Kurti"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white"
              >
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="KIDS">Kids</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 799"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">MRP (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1199"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Fabric & Material</label>
              <input
                type="text"
                placeholder="e.g. 100% Pure Mulberry Silk"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Product Description</label>
            <textarea
              rows={3}
              placeholder="Describe weave, fitting suggestions, care instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white resize-none"
            />
          </div>

          {/* Variants Matrix */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-gray-900">Sizes & Inventory Quantities</h3>
                <p className="text-[11px] text-gray-500">Each size and color has independent stock tracking</p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs font-bold text-lime-700 bg-lime-50 px-3 py-1 rounded-lg border border-lime-300 hover:bg-lime-100"
              >
                + Add Size Variant
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    placeholder="Size (e.g. S, M, 32, UK 8)"
                    value={v.size}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].size = e.target.value;
                      setVariants(updated);
                    }}
                    className="w-24 p-1.5 text-xs rounded-lg border border-gray-200 bg-white font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Color (e.g. Navy Blue)"
                    value={v.color}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].color = e.target.value;
                      setVariants(updated);
                    }}
                    className="flex-1 p-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-gray-500">Stock:</span>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[idx].stock = Number(e.target.value);
                        setVariants(updated);
                      }}
                      className="w-16 p-1.5 text-xs rounded-lg border border-gray-200 bg-white font-bold text-center"
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="text-gray-400 hover:text-rose-600 p-1 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gray-950 hover:bg-gray-800 disabled:bg-gray-400 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <PlusCircle className="w-4 h-4 text-lime-400" />
            <span>{isSubmitting ? 'Publishing to Kolhapur...' : 'Publish Product to Store'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
