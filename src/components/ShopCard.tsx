import React from 'react';
import { Shop } from '../types/index.ts';
import { MapPin, Star, Clock, Store, ShieldCheck, ArrowRight } from 'lucide-react';

interface ShopCardProps {
  shop: Shop;
  onSelect: (shop: Shop) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(shop)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Banner with Logo Overlay */}
        <div className="relative h-32 w-full bg-gray-100 overflow-hidden">
          <img
            src={shop.bannerUrl}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Rating Badge */}
          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold text-gray-900 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{shop.rating}</span>
            <span className="text-[10px] text-gray-400 font-normal">({shop.reviewCount})</span>
          </div>

          {/* Logo */}
          <div className="absolute -bottom-4 left-4 w-12 h-12 rounded-xl bg-white p-0.5 border border-gray-100 shadow-md overflow-hidden">
            <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pt-6 space-y-2">
          <div>
            <div className="flex items-center gap-1 text-xs text-lime-700 font-bold mb-0.5">
              <MapPin className="w-3 h-3 text-lime-600" />
              <span>{shop.area}, Kolhapur</span>
            </div>
            <h3 className="font-extrabold text-gray-950 text-base leading-snug group-hover:text-lime-700 transition-colors">
              {shop.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {shop.description}
            </p>
          </div>

          {/* Badges strip */}
          <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5 text-[11px] font-medium text-gray-600">
            <span className="bg-gray-100 px-2 py-0.5 rounded-md">
              🛵 Free delivery above ₹{shop.freeDeliveryAbove}
            </span>
            <span className="bg-lime-50 text-lime-800 px-2 py-0.5 rounded-md font-semibold">
              🏬 In-store try-on
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 pt-1 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-900 group-hover:text-lime-700">
        <span>Browse Boutique Catalog</span>
        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
