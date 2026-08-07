import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function ImageAdjuster() {
  const { uploadedImage, imageTransform, setImageTransform, resetImageTransform } = useAppStore();

  if (!uploadedImage) return null;

  return (
    <div className="p-4 border border-black bg-white space-y-3 font-mono">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold">// Adjust Transform Payload:</span>
        <button
          type="button"
          onClick={resetImageTransform}
          className="text-xs text-black hover:underline cursor-pointer"
        >
          [reset]
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Zoom */}
        <div>
          <div className="flex justify-between text-xs text-dark-gray mb-1">
            <span>Zoom</span>
            <span>{Math.round(imageTransform.zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={imageTransform.zoom}
            onChange={(e) => setImageTransform({ zoom: parseFloat(e.target.value) })}
            className="w-full accent-black cursor-pointer"
          />
        </div>

        {/* Pan X */}
        <div>
          <div className="flex justify-between text-xs text-dark-gray mb-1">
            <span>Offset X</span>
            <span>{imageTransform.x}px</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={imageTransform.x}
            onChange={(e) => setImageTransform({ x: parseInt(e.target.value) })}
            className="w-full accent-black cursor-pointer"
          />
        </div>

        {/* Pan Y */}
        <div>
          <div className="flex justify-between text-xs text-dark-gray mb-1">
            <span>Offset Y</span>
            <span>{imageTransform.y}px</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={imageTransform.y}
            onChange={(e) => setImageTransform({ y: parseInt(e.target.value) })}
            className="w-full accent-black cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
