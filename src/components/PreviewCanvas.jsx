import React from 'react';
import { useAppStore } from '../store/useAppStore';
import FormatAFrame from './FormatAFrame';
import FormatBBadge from './FormatBBadge';

export default function PreviewCanvas({ canvasRef }) {
  const { format } = useAppStore();

  return (
    <div className="flex flex-col items-center justify-center w-full font-mono">
      {/* Live Preview Header Bar */}
      <div className="mb-2 flex items-center justify-between w-full max-w-sm px-1 text-xs">
        <span className="font-bold text-black">&gt; LIVE_RENDER_CANVAS</span>
        <span className="text-dark-gray text-[10px]">
          {format === 'PFP' ? 'Format A: 1:1 Square' : 'Format B: 3:4 Portrait'}
        </span>
      </div>

      {/* Main Outer IDE / Terminal Container Box */}
      <div className="w-full max-w-sm border border-black bg-white p-0">
        <div className="border-b border-black px-4 py-2 flex justify-between items-center bg-white text-xs">
          <span>terminal.exe</span>
          <span>[ - ] [ + ] [ x ]</span>
        </div>

        {/* Live Canvas Element for export */}
        <div className="p-4 flex items-center justify-center bg-white">
          <div
            ref={canvasRef}
            className="relative overflow-hidden bg-white border border-black w-full select-none"
            style={{
              aspectRatio: format === 'PFP' ? '1 / 1' : '3 / 4.2',
            }}
          >
            {format === 'PFP' ? <FormatAFrame /> : <FormatBBadge />}
          </div>
        </div>
      </div>
    </div>
  );
}
