import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function FormatSelector() {
  const { format, setFormat } = useAppStore();

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between text-xs text-dark-gray mb-1">
        <span>// Select graphic output format:</span>
      </div>

      {/* Brutalist Toggle Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Format B: Builder ID Badge */}
        <button
          type="button"
          onClick={() => setFormat('ID_CARD')}
          className={`p-4 border border-black text-left transition-none cursor-pointer flex flex-col justify-between ${
            format === 'ID_CARD'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">render(FormatB_IDCard)</span>
            <span className={`text-[10px] px-2 py-0.5 border ${format === 'ID_CARD' ? 'border-white text-white' : 'border-black text-black'}`}>
              3:4 Portrait Badge
            </span>
          </div>
          <p className="text-xs opacity-80 leading-relaxed">
            Full credential pass with candidate photo, handle, role title, stack & scannable QR.
          </p>
        </button>

        {/* Format A: PFP Frame */}
        <button
          type="button"
          onClick={() => setFormat('PFP')}
          className={`p-4 border border-black text-left transition-none cursor-pointer flex flex-col justify-between ${
            format === 'PFP'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">render(FormatA_PFPFrame)</span>
            <span className={`text-[10px] px-2 py-0.5 border ${format === 'PFP' ? 'border-white text-white' : 'border-black text-black'}`}>
              1:1 Square Frame
            </span>
          </div>
          <p className="text-xs opacity-80 leading-relaxed">
            Square profile photo wrapped in stark ASCII 'HH GOA 2026' overlay for X & Discord.
          </p>
        </button>
      </div>

      <div className="p-3 border border-black bg-white text-xs text-black">
        <span className="font-bold">&gt; ACTIVE_FORMAT:</span>{' '}
        {format === 'ID_CARD' ? "format === 'BUILDER_ID_CARD'" : "format === 'PFP_FRAME'"}
      </div>
    </div>
  );
}
