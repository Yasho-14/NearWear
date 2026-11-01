import React, { useState } from 'react';
import { Product, ProductVariant } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import {
  X,
  MapPin,
  ShoppingBag,
  Store,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  ShieldCheck,
  Star
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onExploreShop?: (shopId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onExploreShop
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || null
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const images = product.images.length > 0
    ? product.images.map(img => img.url)
    : ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'];

  const availableStock = selectedVariant?.inventory?.availableQuantity ?? 0;

  const handleAdd = () => {
    if (!selectedVariant || availableStock <= 0) return;
    addToCart(product, selectedVariant, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-transform hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="p-6 bg-gray-50 flex flex-col justify-between">
            <div className="aspect-4/5 w-full rounded-2xl overflow-hidden bg-gray-200 relative shadow-inner">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {product.discountPct > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                  {product.discountPct}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-lime-500 ring-2 ring-lime-400/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* In-Store Pickup Callout */}
            <div className="mt-4 p-3 bg-lime-50 border border-lime-200/80 rounded-xl flex items-center gap-2.5 text-xs text-lime-900 font-medium">
              <Store className="w-4 h-4 text-lime-700 shrink-0" />
              <span>
                Try on in-store at <span className="font-bold">{product.shop.name}</span> in {product.shop.area} or order home delivery!
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Boutique Tag */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    onClose();
                    if (onExploreShop) onExploreShop(product.shop.id);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-lime-700 bg-gray-100 px-2.5 py-1 rounded-full transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-lime-600" />
                  <span>{product.shop.name}</span>
                  <span className="text-gray-400">•</span>
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span>{product.shop.area}</span>
                </button>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.shop.rating}</span>
                </div>
              </div>

              {/* Title & Fabric */}
              <div>
                <h2 className="text-xl font-extrabold text-gray-950 leading-snug">
                  {product.title}
                </h2>
                {product.fabric && (
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Fabric: <span className="text-gray-800">{product.fabric}</span> • Brand: <span className="text-gray-800">{product.brand || 'Local Artisan'}</span>
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl font-black text-gray-950">
                  ₹{selectedVariant?.price || product.price}
                </span>
                {product.mrp > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.mrp}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Inclusive of all local taxes
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-gray-900">Select Size</span>
                  <span className="text-gray-500">
                    Stock: <span className="font-semibold text-gray-800">{availableStock} available</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const vStock = v.inventory?.availableQuantity ?? 0;
                    return (
                      <button
                        key={v.id}
                        disabled={vStock <= 0}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'border-gray-950 bg-gray-950 text-white shadow-xs'
                            : vStock > 0
                            ? 'border-gray-200 text-gray-800 hover:border-gray-300 bg-white'
                            : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Details */}
              {selectedVariant && (
                <div className="text-xs flex items-center gap-2 text-gray-700">
                  <span className="font-bold">Color:</span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-gray-300"
                    style={{ backgroundColor: selectedVariant.colorHex || '#111827' }}
                  />
                  <span>{selectedVariant.color}</span>
                </div>
              )}

              {/* Delivery info */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                  <span>
                    Express Delivery in <strong className="text-gray-900">60-90 mins</strong> in Kolhapur
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                  <span>
                    Free local delivery on orders above ₹{product.shop.freeDeliveryAbove} from this store
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-gray-100 mt-6 space-y-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:text-black"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock}
                    className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:text-black disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAdd}
                  disabled={availableStock <= 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-950 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-lime-400" />
                  <span>{availableStock > 0 ? `Add to Bag • ₹${(selectedVariant?.price || product.price) * quantity}` : 'Sold Out'}</span>
                </button>
              </div>

              {addedToast && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Added to your bag! View bag to checkout.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
