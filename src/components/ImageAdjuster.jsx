import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function ImageAdjuster() {
  const {
    uploadedImage,
    cropMode,
    setCropMode,
    imageTransform,
    setImageTransform,
    resetImageTransform,
    rotateClockwise,
    centerImage,
    filterStyle,
    setFilterStyle,
  } = useAppStore();

  if (!uploadedImage) return null;

  const cropModeOptions = [
    {
      id: 'original',
      label: 'Original Image (No Auto-Crop)',
      desc: 'Preserves full aspect ratio of your uploaded photo',
    },
    {
      id: 'square',
      label: 'Fit Square (Fill)',
      desc: 'Fills the frame as a 1:1 square crop',
    },
    {
      id: 'circle',
      label: 'Circle Mask (Avatar)',
      desc: 'Crops photo into a circular profile cutout',
    },
  ];

  const filterOptions = [
    { id: 'none', label: 'Normal' },
    { id: 'grayscale', label: 'B&W Mono' },
    { id: 'contrast', label: 'High Contrast' },
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cyber Cool' },
    { id: 'vintage', label: 'Vintage' },
  ];

  return (
    <div className="p-5 border border-black bg-white space-y-6 font-mono">
      
      {/* 1. Image Crop & Framing Mode Selection (Explicit User Request: No Auto Crop by default) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-black pb-2">
          <span className="font-bold text-sm text-black">// Select Image Framing / Crop Mode:</span>
          <span className="text-[10px] text-dark-gray">[Default: Original]</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cropModeOptions.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setCropMode(mode.id)}
              className={`p-3 border text-left flex flex-col justify-between transition-none cursor-pointer ${
                cropMode === mode.id
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-black border-black hover:bg-black hover:text-white'
              }`}
            >
              <div className="text-xs font-bold mb-1 flex items-center justify-between">
                <span>{mode.label}</span>
                {cropMode === mode.id && <span className="text-[10px]">&gt; ACTIVE</span>}
              </div>
              <span className="text-[10px] opacity-80 leading-snug">{mode.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Transform & Alignment Controls */}
      <div className="space-y-4 pt-3 border-t border-black">
        <div className="flex items-center justify-between border-b border-black pb-2">
          <span className="font-bold text-xs text-black">// Adjust Position & Scale:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={centerImage}
              className="text-xs px-2 py-1 border border-black hover:bg-black hover:text-white transition-none cursor-pointer"
              title="Center alignment"
            >
              [center]
            </button>
            <button
              type="button"
              onClick={rotateClockwise}
              className="text-xs px-2 py-1 border border-black hover:bg-black hover:text-white transition-none cursor-pointer flex items-center gap-1"
              title="Rotate +90 degrees"
            >
              <span className="material-symbols-outlined text-xs">rotate_right</span>
              +90°
            </button>
            <button
              type="button"
              onClick={resetImageTransform}
              className="text-xs px-2 py-1 border border-black hover:bg-black hover:text-white transition-none cursor-pointer"
            >
              [reset]
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Zoom */}
          <div>
            <div className="flex justify-between text-xs text-dark-gray mb-1">
              <span>Zoom Scale</span>
              <span className="font-bold text-black">{Math.round(imageTransform.zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={imageTransform.zoom}
              onChange={(e) => setImageTransform({ zoom: parseFloat(e.target.value) })}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Offset X */}
          <div>
            <div className="flex justify-between text-xs text-dark-gray mb-1">
              <span>Offset X</span>
              <span className="font-bold text-black">{imageTransform.x}px</span>
            </div>
            <input
              type="range"
              min="-150"
              max="150"
              step="1"
              value={imageTransform.x}
              onChange={(e) => setImageTransform({ x: parseInt(e.target.value) })}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Offset Y */}
          <div>
            <div className="flex justify-between text-xs text-dark-gray mb-1">
              <span>Offset Y</span>
              <span className="font-bold text-black">{imageTransform.y}px</span>
            </div>
            <input
              type="range"
              min="-150"
              max="150"
              step="1"
              value={imageTransform.y}
              onChange={(e) => setImageTransform({ y: parseInt(e.target.value) })}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex justify-between text-xs text-dark-gray mb-1">
              <span>Rotation</span>
              <span className="font-bold text-black">{imageTransform.rotate}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={imageTransform.rotate}
              onChange={(e) => setImageTransform({ rotate: parseInt(e.target.value) })}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Color Filter Presets */}
      <div className="space-y-2 pt-3 border-t border-black">
        <label className="text-xs text-dark-gray font-light block">
          // Color Filter Preset:
        </label>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStyle(f.id)}
              className={`px-3 py-1.5 border text-xs font-mono transition-none cursor-pointer ${
                filterStyle === f.id
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-black border-black hover:bg-black hover:text-white'
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
