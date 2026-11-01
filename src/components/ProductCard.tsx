import React from 'react';
import { Product } from '../types/index.ts';
import { MapPin, ShoppingBag, Eye, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd
}) => {
  const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80';

  // Calculate total remaining stock across variants
  const totalStock = product.variants.reduce((acc, v) => acc + (v.inventory?.availableQuantity || 0), 0);
  const isLowStock = totalStock > 0 && totalStock <= 3;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/5 w-full bg-gray-100 overflow-hidden">
          <img
            src={primaryImage}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {product.discountPct > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs">
              {product.discountPct}% OFF
            </span>
          )}

          {/* Featured / Kolhapur Special Tag */}
          {product.isFeatured && (
            <span className="absolute top-2.5 right-2.5 bg-gray-900/90 text-lime-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-lime-400" />
              Special
            </span>
          )}

          {/* Stock Tag on Bottom of Image */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            {isLowStock ? (
              <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                Only {totalStock} left
              </span>
            ) : totalStock > 0 ? (
              <span className="bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs">
                Available In-Store
              </span>
            ) : (
              <span className="bg-gray-800/90 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5 space-y-1.5">
          {/* Shop Name & Distance */}
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span className="font-semibold text-gray-700 truncate max-w-[130px]">
              {product.shop.name}
            </span>
            <span className="flex items-center gap-0.5 text-lime-700 bg-lime-50 px-1.5 py-0.2 rounded font-medium">
              <MapPin className="w-3 h-3 text-lime-600" />
              {product.shop.area}
            </span>
          </div>

          {/* Product Title */}
          <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-lime-700 transition-colors">
            {product.title}
          </h4>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base font-extrabold text-gray-950">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp}
              </span>
            )}
            <span className="text-[10px] font-semibold text-emerald-600">
              Free Pickup
            </span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="px-3.5 pb-3.5 pt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(product);
          }}
          className="w-full py-2 px-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-lime-400" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};
