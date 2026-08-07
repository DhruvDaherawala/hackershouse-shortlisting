import React from 'react';
import FormatAFrame from './FormatAFrame';

export default function PreviewCanvas({ canvasRef }) {
  return (
    <div className="flex flex-col items-center justify-center w-full font-mono">
      {/* Live Preview Header Bar */}
      <div className="mb-2 flex items-center justify-between w-full max-w-sm px-1 text-xs">
        <span className="font-bold text-black">&gt; LIVE_RENDER_CANVAS</span>
        <span className="text-dark-gray text-[10px]">1:1 Square PFP Frame</span>
      </div>

      {/* Main Outer IDE / Terminal Container Box */}
      <div className="w-full max-w-sm border border-black bg-white p-0">
        <div className="border-b border-black px-4 py-2 flex justify-between items-center bg-white text-xs">
          <span>preview.exe</span>
          <span>[ - ] [ + ] [ x ]</span>
        </div>

        {/* Live Canvas Element for export */}
        <div className="p-4 flex items-center justify-center bg-white">
          <div
            ref={canvasRef}
            className="relative overflow-hidden bg-white w-full select-none"
            style={{
              aspectRatio: '1 / 1',
            }}
          >
            <FormatAFrame />
          </div>
        </div>
      </div>
    </div>
  );
}
