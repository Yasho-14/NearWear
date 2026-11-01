import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { CustomerStorefront } from './views/CustomerStorefront.tsx';
import { ShopDetailView } from './views/ShopDetailView.tsx';
import { CustomerOrdersView } from './views/CustomerOrdersView.tsx';
import { SellerDashboard } from './views/SellerDashboard.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { OrderSuccessModal } from './components/OrderSuccessModal.tsx';
import { Shop, Order } from './types/index.ts';
import { Store, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<'storefront' | 'shops' | 'orders' | 'seller' | 'admin'>('storefront');
  const [selectedArea, setSelectedArea] = useState<string>('All Kolhapur');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleSelectShop = (shop: Shop) => {
    setSelectedShopId(shop.id);
  };

  const handleBackFromShop = () => {
    setSelectedShopId(null);
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-900 flex flex-col font-sans selection:bg-lime-300 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setSelectedShopId(null);
          setCurrentView(view);
        }}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        {selectedShopId ? (
          <ShopDetailView shopId={selectedShopId} onBack={handleBackFromShop} />
        ) : currentView === 'storefront' || currentView === 'shops' ? (
          <CustomerStorefront
            selectedArea={selectedArea}
            searchQuery={searchQuery}
            onSelectShop={handleSelectShop}
          />
        ) : currentView === 'orders' ? (
          <CustomerOrdersView onBackToShopping={() => setCurrentView('storefront')} />
        ) : currentView === 'seller' ? (
          <SellerDashboard />
        ) : currentView === 'admin' ? (
          <AdminDashboard />
        ) : null}
      </main>

      {/* Persistent Multi-Seller Shopping Bag Drawer */}
      <CartDrawer onOrderSuccess={handleOrderSuccess} />

      {/* Order Confirmed Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewOrders={() => {
          setConfirmedOrder(null);
          setCurrentView('orders');
        }}
      />

      {/* Footer */}
      <footer className="bg-gray-950 text-white mt-auto border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-lime-400 text-gray-950 flex items-center justify-center font-black text-sm">
                  NW
                </div>
                <span className="font-black text-xl tracking-tight">
                  Near<span className="text-lime-400">Wear</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                NearWear is Kolhapur's premier hyperlocal fashion marketplace connecting independent retail clothing boutiques, artisan weavers, and shoe craftsmen directly with nearby shoppers.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-lime-400 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Kolhapur, Maharashtra, India</span>
              </div>
            </div>

            {/* Column 2: Localities */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-300">
                Kolhapur Localities Served
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>• Rajarampuri 1st–14th Lane</li>
                <li>• Shahupuri & Station Road</li>
                <li>• Mahadwar Road & Shivaji Chowk</li>
                <li>• Tarabai Park & Kawala Naka</li>
                <li>• Laxmipuri & Shivaji Market</li>
              </ul>
            </div>

            {/* Column 3: Specialties */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-300">
                Fashion Categories
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>• Handloom Paithani & Nauvari Sarees</li>
                <li>• Authentic Kolhapuri Leather Chappals</li>
                <li>• Men's Festive Cotton & Silk Kurtas</li>
                <li>• Daily Wear Kurtis & Anarkalis</li>
                <li>• Modern Casual Streetwear & Denim</li>
              </ul>
            </div>

            {/* Column 4: Commitments */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-300">
                NearWear Guarantee
              </h4>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span>100% Verified Local Storefronts with genuine on-rack inventory.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span>Free In-Store Try-On or Doorstep Delivery within 60–120 minutes.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} NearWear Technologies India Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
              <span className="hover:text-gray-300 cursor-pointer">Merchant Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
