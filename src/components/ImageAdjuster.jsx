import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Move, ZoomIn, RotateCcw } from 'lucide-react';

export default function ImageAdjuster() {
  const { uploadedImage, imageTransform, setImageTransform, resetImageTransform } = useAppStore();

  if (!uploadedImage) return null;

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-300">
          <Move className="w-3.5 h-3.5 text-cyan-400" /> Photo Positioning & Zoom
        </span>
        <button
          type="button"
          onClick={resetImageTransform}
          className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Zoom */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3 text-cyan-400" /> Zoom</span>
            <span>{Math.round(imageTransform.zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={imageTransform.zoom}
            onChange={(e) => setImageTransform({ zoom: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Pan X */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Pan Y */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}
