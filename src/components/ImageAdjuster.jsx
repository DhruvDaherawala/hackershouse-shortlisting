import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function ImageAdjuster() {
  const {
    uploadedImage,
    imageTransform,
    setImageTransform,
    filterStyle,
    setFilterStyle,
  } = useAppStore();

  if (!uploadedImage) return null;

  const filterOptions = [
    { id: 'none', label: 'Normal' },
    { id: 'grayscale', label: 'B&W' },
    { id: 'contrast', label: 'High Contrast' },
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cyber Cool' },
    { id: 'vintage', label: 'Vintage' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Zoom Slider Only */}
      <div className="space-y-3 pt-3 border-t border-dark-green/10">
        <div className="flex items-center justify-between pb-2">
          <span className="form-label !mb-0">Zoom Level</span>
          <span className="font-bold text-dark-green text-sm">
            {Math.round(imageTransform.zoom * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0.5"
          max="3"
          step="0.05"
          value={imageTransform.zoom}
          onChange={(e) => setImageTransform({ zoom: parseFloat(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>

      {/* 2. Color Filter Presets */}
      <div className="space-y-3 pt-3 border-t border-dark-green/10">
        <label className="form-label !mb-0">
          Color Filter
        </label>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStyle(f.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                filterStyle === f.id
                  ? 'bg-dark-green text-yellow shadow-md'
                  : 'bg-cream text-dark-green border border-dark-green/10 hover:bg-dark-green/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
