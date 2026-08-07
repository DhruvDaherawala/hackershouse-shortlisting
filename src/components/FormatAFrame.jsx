import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function FormatAFrame() {
  const {
    uploadedImage,
    imageTransform,
    userName,
    githubHandle,
    builderTitle,
  } = useAppStore();

  return (
    <div className="relative w-full h-full bg-white text-black border border-black flex flex-col justify-between font-mono select-none overflow-hidden p-0">
      {/* Top Bar Window Controls */}
      <div className="border-b border-black bg-white flex justify-between items-center px-4 py-2 text-xs font-light z-20">
        <span className="font-bold">&lt;HH_GOA_2026 /&gt;</span>
        <span>[ - ] [ + ] [ x ]</span>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-grow bg-white flex items-center justify-center overflow-hidden p-4">
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="PFP User Photo"
            crossOrigin="anonymous"
            style={{
              transform: `scale(${imageTransform.zoom}) translate(${imageTransform.x}px, ${imageTransform.y}px) rotate(${imageTransform.rotate}deg)`,
              transition: 'transform 0.05s ease-out',
            }}
            className="max-w-full max-h-full object-contain grayscale pointer-events-none select-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-dark-gray p-6">
            <span className="text-2xl font-bold mb-2">// NO_PAYLOAD</span>
            <span className="text-xs">&gt; import &#123; photo &#125; from './user'</span>
          </div>
        )}

        {/* ASCII Corner Brackets Overlay */}
        <div className="absolute top-2 left-2 text-xs font-bold pointer-events-none">[+]</div>
        <div className="absolute top-2 right-2 text-xs font-bold pointer-events-none">[+]</div>
        <div className="absolute bottom-2 left-2 text-xs font-bold pointer-events-none">[+]</div>
        <div className="absolute bottom-2 right-2 text-xs font-bold pointer-events-none">[+]</div>
      </div>

      {/* Bottom Overlay Frame Details */}
      <div className="border-t border-black bg-white p-4 flex justify-between items-end z-20">
        <div className="flex flex-col">
          <span className="text-[10px] text-dark-gray uppercase tracking-widest">&gt; CANDIDATE_PFP</span>
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-black">
            {userName || 'NEO_CODER'}
          </h2>
          <span className="text-xs text-dark-gray mt-0.5">
            @{githubHandle || 'johndoe_dev'} • {builderTitle || 'SYS.ARCHITECT'}
          </span>
        </div>

        <div className="border border-black px-2 py-1 text-[10px] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-black animate-pulse"></span>
          SYS_OK
        </div>
      </div>
    </div>
  );
}
