import React, { useState, useEffect } from 'react';
import { Product, Shop, Category } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ShopCard } from '../components/ShopCard.tsx';
import { ProductDetailModal } from '../components/ProductDetailModal.tsx';
import { useCart } from '../context/CartContext.tsx';
import {
  Sparkles,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  Tag,
  ChevronRight,
  Filter,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

interface CustomerStorefrontProps {
  selectedArea: string;
  searchQuery: string;
  onSelectShop: (shop: Shop) => void;
}

export const CustomerStorefront: React.FC<CustomerStorefrontProps> = ({
  selectedArea,
  searchQuery,
  onSelectShop
}) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [selectedQuickTag, setSelectedQuickTag] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string>('ALL');

  // Modal State
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const QUICK_TAGS = [
    { label: '🔥 All Kolhapur Racks', tag: null },
    { label: '🩴 Kolhapuri Chappals', tag: 'chappal' },
    { label: '🥻 Paithani & Silk', tag: 'paithani' },
    { label: '👔 Men’s Festive Kurtas', tag: 'kurta' },
    { label: '🌿 Pure Linen & Casuals', tag: 'linen' },
    { label: '🏷️ Under ₹999', tag: 'under_999' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      let minPrice: number | undefined;
      let maxPrice: number | undefined;

      if (priceRange === 'UNDER_999') {
        maxPrice = 999;
      } else if (priceRange === '1000_1999') {
        minPrice = 1000;
        maxPrice = 1999;
      } else if (priceRange === '2000_PLUS') {
        minPrice = 2000;
      }

      const [prods, shps, cats] = await Promise.all([
        api.getProducts({
          area: selectedQuickTag ? undefined : (selectedArea !== 'All Kolhapur' ? selectedArea : undefined),
          category: selectedCategory,
          gender: selectedGender,
          search: selectedQuickTag ? (selectedQuickTag === 'under_999' ? undefined : selectedQuickTag) : searchQuery,
          minPrice: selectedQuickTag === 'under_999' ? undefined : minPrice,
          maxPrice: selectedQuickTag === 'under_999' ? 999 : maxPrice
        }),
        api.getShops({ area: selectedArea !== 'All Kolhapur' ? selectedArea : undefined }),
        api.getCategories()
      ]);

      setProducts(prods);
      setShops(shps);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedArea, selectedCategory, selectedGender, selectedQuickTag, priceRange, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Promotional Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gray-950 text-white shadow-xl">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=80"
            alt="Kolhapur Paithani Silk and Textiles"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative px-6 py-10 sm:px-12 sm:py-14 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-lime-400 text-gray-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kolhapur’s Independent Clothing Boutiques</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Your City. Your Stores.{' '}
            <span className="text-lime-400">Your Style.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl font-normal leading-relaxed">
            Discover real in-store inventory from Rajarampuri, Shahupuri, and Mahadwar Road.
            Try on in boutique fitting rooms or get local delivery in 60–120 minutes.
          </p>

          {/* Quick Stats Strip */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 text-xs font-semibold text-gray-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-lime-400" />
              <span>60–120 Min Kolhapur Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-lime-400" />
              <span>Free Store Try-On Pickup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-lime-400" />
              <span>Use Code: KOLHAPUR100 for ₹100 Off</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1-Tap Quick Action Filter Bar */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-gray-950 tracking-tight flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-lime-600" />
            <span>Quick Discover</span>
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Showing stores in <strong className="text-gray-900">{selectedArea}</strong>
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_TAGS.map((q) => {
            const isSelected = selectedQuickTag === q.tag;
            return (
              <button
                key={q.label}
                onClick={() => setSelectedQuickTag(q.tag)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                  isSelected
                    ? 'bg-gray-950 text-white shadow-sm ring-2 ring-lime-400/40'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Visual Category Navigation */}
      {categories.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-950 tracking-tight">
              Browse Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
                  className={`group relative rounded-2xl overflow-hidden aspect-4/3 text-left transition-all ${
                    isSelected ? 'ring-3 ring-lime-500 shadow-md scale-102' : 'hover:shadow-md'
                  }`}
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <span className="font-extrabold text-white text-xs block leading-tight">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-lime-300 font-medium">
                      {cat._count?.products || 0} local items
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Nearby Kolhapur Stores Row */}
      {shops.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-950 tracking-tight">
                Nearby Kolhapur Boutiques
              </h2>
              <p className="text-xs text-gray-500">
                Independent retail stores with live inventory in {selectedArea}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} onSelect={onSelectShop} />
            ))}
          </div>
        </section>
      )}

      {/* Product Catalog Grid with Gender & Price Filters */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-950 tracking-tight">
              In-Stock Apparel Racks
            </h2>
            <p className="text-xs text-gray-500">
              Found {products.length} garments available for store pickup or local home delivery
            </p>
          </div>

          {/* Gender and Price Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-700">
              {(['ALL', 'WOMEN', 'MEN'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedGender === g
                      ? 'bg-white text-gray-950 shadow-xs'
                      : 'hover:text-black'
                  }`}
                >
                  {g === 'ALL' ? 'All' : g === 'WOMEN' ? 'Women' : 'Men'}
                </button>
              ))}
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-hidden focus:border-lime-500"
            >
              <option value="ALL">All Prices</option>
              <option value="UNDER_999">Under ₹999</option>
              <option value="1000_1999">₹1,000 - ₹1,999</option>
              <option value="2000_PLUS">₹2,000+</option>
            </select>
          </div>
        </div>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-4/5 rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
            <Store className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-extrabold text-gray-900 text-base">No Products Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't find items matching your criteria in {selectedArea}. Try resetting filters or switching locations.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedGender('ALL');
                setSelectedQuickTag(null);
                setPriceRange('ALL');
              }}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
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
        onExploreShop={(shopId) => {
          const s = shops.find((sh) => sh.id === shopId);
          if (s) onSelectShop(s);
        }}
      />
    </div>
  );
};
