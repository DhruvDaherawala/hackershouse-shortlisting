import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function FormatBBadge() {
  const {
    uploadedImage,
    imageTransform,
    userName,
    githubHandle,
    stackRole,
    builderTitle,
    badgeNumber,
  } = useAppStore();

  return (
    <div className="relative w-full h-full bg-white border border-black flex flex-col overflow-hidden text-black font-mono select-none">
      {/* Top Bar Window Controls */}
      <div className="border-b border-black bg-white flex items-center justify-between px-4 py-2 text-xs font-light">
        <span className="font-bold">id_badge.exe</span>
        <div className="flex gap-3">
          <span>[ - ]</span>
          <span>[ + ]</span>
          <span>[ x ]</span>
        </div>
      </div>

      {/* Card Header */}
      <div className="p-4 flex justify-between items-start border-b border-black">
        <div className="flex flex-col">
          <span className="text-[10px] text-dark-gray tracking-tight">HACKERS HOUSE // 2026</span>
          <span className="text-xs text-black mt-0.5 font-bold">ID: {badgeNumber || '#0X9F3A'}</span>
        </div>
        {/* Status Badge */}
        <div className="border border-black text-black text-[10px] px-2 py-1 flex items-center gap-1.5 font-bold">
          <div className="w-1.5 h-1.5 bg-black animate-pulse"></div>
          SHORTLISTED
        </div>
      </div>

      {/* Profile Image Area */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden bg-white">
        <div className="relative w-36 h-36 border border-black p-1 bg-white overflow-hidden flex items-center justify-center">
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Candidate Profile Image"
              crossOrigin="anonymous"
              style={{
                transform: `scale(${imageTransform.zoom}) translate(${imageTransform.x}px, ${imageTransform.y}px) rotate(${imageTransform.rotate}deg)`,
                transition: 'transform 0.05s ease-out',
              }}
              className="max-w-full max-h-full object-contain grayscale pointer-events-none select-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center text-dark-gray text-xs">
              <span>// NO_PHOTO</span>
              <span className="text-[9px] mt-1">&gt; click to upload</span>
            </div>
          )}
        </div>
        {githubHandle && (
          <span className="text-[10px] text-dark-gray mt-2">@{githubHandle}</span>
        )}
      </div>

      {/* Card Footer / Details */}
      <div className="p-5 bg-white border-t border-black flex justify-between items-end">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-dark-gray">&gt; CANDIDATE</span>
          <h2 className="text-xl font-extrabold text-black uppercase tracking-tight leading-none">
            {userName || 'NEO_CODER'}
          </h2>
          <span className="text-xs text-black mt-1 font-bold">
            {builderTitle || 'SYS.ARCHITECT'}
          </span>
          <span className="text-[10px] text-dark-gray uppercase">
            STACK: {stackRole || 'Fullstack'}
          </span>
        </div>

        {/* High Contrast Brutalist QR Pattern Box */}
        <div className="w-14 h-14 bg-white p-1 border border-black flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v4h-2v-4zm2 2h4v2h-4v-2zm-6 0h2v2h-2v-2zm4-6h4v2h-4v-2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
