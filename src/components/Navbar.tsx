import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Search,
  Store,
  ShieldCheck,
  User as UserIcon,
  Package,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { LocationModal } from './LocationModal.tsx';
import { UserRole } from '../types/index.ts';

interface NavbarProps {
  currentView: 'storefront' | 'shops' | 'orders' | 'seller' | 'admin';
  setCurrentView: (view: 'storefront' | 'shops' | 'orders' | 'seller' | 'admin') => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  selectedArea,
  setSelectedArea,
  searchQuery,
  setSearchQuery
}) => {
  const { user, activeRole, switchRole, loading } = useAuth();
  const { totalItemsCount, totalPayable, setIsCartOpen } = useCart();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleRoleChange = async (role: UserRole) => {
    await switchRole(role);
    if (role === 'CUSTOMER') setCurrentView('storefront');
    if (role === 'SELLER') setCurrentView('seller');
    if (role === 'ADMIN') setCurrentView('admin');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        {/* Top Announcement Bar with Fast Role Switcher */}
        <div className="bg-gray-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-lime-400 bg-lime-950/80 px-2 py-0.5 rounded-full border border-lime-500/30">
              <Sparkles className="w-3 h-3 text-lime-400" />
              Kolhapur Hyperlocal Fashion
            </span>
            <span className="hidden sm:inline text-gray-400">
              Your City. Your Stores. Your Style. • 60–120 Min Delivery
            </span>
          </div>

          {/* Instant Multi-Role Sandbox Switcher */}
          <div className="flex items-center gap-1.5 bg-gray-800/80 p-0.5 rounded-lg border border-gray-700">
            <span className="text-[11px] text-gray-400 px-1 font-medium hidden md:inline">Role:</span>
            <button
              onClick={() => handleRoleChange('CUSTOMER')}
              disabled={loading}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                activeRole === 'CUSTOMER' && currentView !== 'seller' && currentView !== 'admin'
                  ? 'bg-lime-400 text-gray-950 font-bold shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/60'
              }`}
            >
              🛍️ Shopper
            </button>
            <button
              onClick={() => handleRoleChange('SELLER')}
              disabled={loading}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                activeRole === 'SELLER' || currentView === 'seller'
                  ? 'bg-lime-400 text-gray-950 font-bold shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/60'
              }`}
            >
              🏪 Shop Owner (Sagar)
            </button>
            <button
              onClick={() => handleRoleChange('ADMIN')}
              disabled={loading}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                activeRole === 'ADMIN' || currentView === 'admin'
                  ? 'bg-lime-400 text-gray-950 font-bold shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/60'
              }`}
            >
              ⚡ Admin
            </button>
          </div>
        </div>

        {/* Main Navigation Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Location Pill */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-1.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-950 flex items-center justify-center text-white font-black text-lg tracking-wider shadow-sm group-hover:scale-105 transition-transform">
                N<span className="text-lime-400">W</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-gray-950 text-lg tracking-tight block leading-tight">
                  Near<span className="text-lime-600">Wear</span>
                </span>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold block">
                  Kolhapur
                </span>
              </div>
            </button>

            {/* Location Selector Pill */}
            <button
              onClick={() => setIsLocationOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200/90 text-gray-800 text-xs font-semibold hover:border-lime-500 hover:bg-lime-50/50 transition-colors shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-lime-600 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[180px]">{selectedArea}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Paithani sarees, Kolhapuri chappals, kurtas, denim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50/70 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-lime-500 focus:bg-white focus:ring-2 focus:ring-lime-400/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentView('storefront')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'storefront'
                  ? 'bg-gray-100 text-gray-950'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Catalog
            </button>

            <button
              onClick={() => setCurrentView('shops')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                currentView === 'shops'
                  ? 'bg-gray-100 text-gray-950'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Shops</span>
            </button>

            <button
              onClick={() => setCurrentView('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                currentView === 'orders'
                  ? 'bg-gray-100 text-gray-950'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Orders</span>
            </button>

            {/* Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping Bag with ${totalItemsCount} items`}
              className="relative flex items-center gap-2 bg-gray-950 hover:bg-gray-900 text-white px-3.5 py-2 rounded-full font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-lime-400" />
              <span className="hidden sm:inline font-bold">Bag</span>
              {totalItemsCount > 0 ? (
                <span className="bg-lime-400 text-gray-950 text-[11px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  {totalItemsCount}
                </span>
              ) : (
                <span className="text-gray-400 text-[11px]">0</span>
              )}
              {totalPayable > 0 && (
                <span className="hidden lg:inline text-lime-400 font-semibold border-l border-gray-700 pl-2">
                  ₹{totalPayable}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="px-4 pb-2.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Kolhapur fashion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-lime-500"
            />
          </div>
        </div>
      </header>

      {/* Location Selection Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
      />
    </>
  );
};
