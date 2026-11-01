import React from 'react';
import { MapPin, Check, X } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArea: string;
  onSelectArea: (area: string) => void;
}

const KOLHAPUR_AREAS = [
  { name: 'All Kolhapur', distance: 'Entire City', landmark: 'All 416001-416012' },
  { name: 'Rajarampuri', distance: '0.8 km', landmark: '2nd & 3rd Lane, Takala Chowk' },
  { name: 'Shahupuri', distance: '1.4 km', landmark: 'Station Road, 3rd Lane' },
  { name: 'Mahalaxmi / Rankala', distance: '2.5 km', landmark: 'Mahadwar Road & Temple Market' },
  { name: 'Tarabai Park', distance: '3.1 km', landmark: 'Circuit House, Kawala Naka' },
  { name: 'Laxmipuri', distance: '1.8 km', landmark: 'Cloth Market & Shivaji Market' }
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedArea,
  onSelectArea
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Select Your Location</h3>
              <p className="text-xs text-gray-500">Find clothing shops closest to you in Kolhapur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close location selector"
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {KOLHAPUR_AREAS.map((loc) => {
            const isSelected = selectedArea === loc.name;
            return (
              <button
                key={loc.name}
                onClick={() => {
                  onSelectArea(loc.name);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-lime-500 bg-lime-50/60 ring-2 ring-lime-400/20 shadow-xs'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isSelected ? 'bg-lime-500 text-black' : 'bg-gray-100 text-gray-500'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{loc.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {loc.distance}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{loc.landmark}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center text-black shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/40 text-center">
          <p className="text-xs text-gray-500">
            🚚 Orders delivered in <span className="font-semibold text-gray-800">60–120 minutes</span> from nearby Kolhapur boutiques
          </p>
        </div>
      </div>
    </div>
  );
};
