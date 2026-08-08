import React from 'react';
import FormatAFrame from './FormatAFrame';

export default function PreviewCanvas({ canvasRef }) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Live Preview Header */}
      <div className="mb-3 flex items-center justify-between w-full max-w-sm px-1 text-xs">
        <span className="font-bold text-dark-green text-sm">Live Preview</span>
        <span className="text-dark-gray text-[11px] font-medium flex items-center gap-1">🖐️ Drag photo to reposition</span>
      </div>

      {/* Preview Card */}
      <div className="w-full max-w-sm preview-card bg-white">
        {/* Live Canvas Element for export */}
        <div className="p-4 flex items-center justify-center bg-white">
          <div
            ref={canvasRef}
            className="relative overflow-hidden bg-white w-full select-none rounded-lg"
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
