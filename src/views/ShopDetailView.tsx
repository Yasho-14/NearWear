import React, { useState, useEffect } from 'react';
import { Shop, Product } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ProductDetailModal } from '../components/ProductDetailModal.tsx';
import { useCart } from '../context/CartContext.tsx';
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  Truck,
  Store,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ShopDetailViewProps {
  shopId: string;
  onBack: () => void;
}

export const ShopDetailView: React.FC<ShopDetailViewProps> = ({ shopId, onBack }) => {
  const { addToCart } = useCart();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getShop(shopId);
        setShop(data);
      } catch (err) {
        console.error('Failed to load shop:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shopId]);

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse space-y-4">
        <div className="w-full h-48 bg-gray-200 rounded-3xl max-w-4xl mx-auto" />
        <div className="h-6 w-48 bg-gray-200 rounded-md mx-auto" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="py-20 text-center space-y-3">
        <Store className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="font-bold text-gray-900 text-lg">Shop Not Found</h3>
        <button onClick={onBack} className="text-xs font-bold text-lime-700 underline">
          Return to Explore
        </button>
      </div>
    );
  }

  const products = shop.products || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs hover:shadow-xs transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Kolhapur Boutiques</span>
      </button>

      {/* Boutique Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-gray-900">
          <img
            src={shop.bannerUrl}
            alt={shop.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

          {/* Rating */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-extrabold text-gray-950 shadow-md">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{shop.rating}</span>
            <span className="text-[11px] text-gray-400">({shop.reviews?.length || shop.reviewCount || 0} reviews)</span>
          </div>
        </div>

        {/* Store Profile Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4">
            <div className="flex items-end gap-3.5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 border-2 border-white shadow-xl overflow-hidden shrink-0">
                <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-950 leading-tight">
                    {shop.name}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-lime-600 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-lime-700 font-bold mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-lime-600" />
                  <span>{shop.streetAddress}, {shop.area}, Kolhapur - {shop.pincode}</span>
                </div>
              </div>
            </div>

            {/* Store Features */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
              <div className="bg-lime-50 text-lime-900 border border-lime-200/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-lime-600" />
                <span>Free delivery above ₹{shop.freeDeliveryAbove}</span>
              </div>
              <div className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-600" />
                <span>{shop.openingHours.split('|')[0]}</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
            {shop.description}
          </p>
        </div>
      </div>

      {/* Catalog Grid for this Store */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-950">
              In-Store Catalog ({products.length} items)
            </h2>
            <p className="text-xs text-gray-500">
              Pick up at this store or order direct home delivery in {shop.area}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 space-y-2">
            <Store className="w-8 h-8 text-gray-400 mx-auto" />
            <h4 className="font-bold text-gray-900 text-sm">No items currently listed</h4>
            <p className="text-xs text-gray-500">Check back soon for new arrivals from this store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, shop }}
                onSelect={(p) => setActiveProduct(p)}
                onQuickAdd={(p) => {
                  const defaultVar = p.variants[0];
                  if (defaultVar) {
                    addToCart(p, defaultVar, 1);
                  }
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />
    </div>
  );
};
