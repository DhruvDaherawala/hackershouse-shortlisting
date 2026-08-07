import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { User, Sparkles, ShieldCheck } from 'lucide-react';

export default function FormatAFrame() {
  const {
    uploadedImage,
    imageTransform,
    userName,
    builderTitle,
    themeColor,
  } = useAppStore();

  const themeGlows = {
    cyan: 'border-cyan-400/80 shadow-[0_0_25px_rgba(0,240,255,0.3)]',
    pink: 'border-pink-500/80 shadow-[0_0_25px_rgba(255,0,127,0.3)]',
    emerald: 'border-emerald-400/80 shadow-[0_0_25px_rgba(0,255,157,0.3)]',
    gold: 'border-amber-400/80 shadow-[0_0_25px_rgba(255,190,11,0.3)]',
  };

  const currentGlow = themeGlows[themeColor] || themeGlows.cyan;

  return (
    <div className="relative w-full h-full p-4 flex flex-col justify-between select-none font-sans">
      {/* Background User Photo Container with CSS object-fit contain (Uncropped) */}
      <div className="absolute inset-4 rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-800 flex items-center justify-center p-1">
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="PFP User Photo"
            crossOrigin="anonymous"
            style={{
              transform: `scale(${imageTransform.zoom}) translate(${imageTransform.x}px, ${imageTransform.y}px) rotate(${imageTransform.rotate}deg)`,
              transition: 'transform 0.05s ease-out',
            }}
            className="max-w-full max-h-full object-contain select-none pointer-events-none drop-shadow-md"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
            <User className="w-16 h-16 opacity-30 text-cyan-400" />
            <p className="text-xs font-mono text-slate-400">
              Upload photo to see live PFP Frame
            </p>
          </div>
        )}
      </div>

      {/* Branded Overlay Frame Elements (HH Goa 2026) */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-2">
        
        {/* Top Header Frame Overlay */}
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border ${currentGlow} flex items-center gap-1.5 shadow-xl`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-heading font-black tracking-wider text-white">
              HH GOA <span className="text-cyan-400">2026</span>
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-pink-500/50 text-[10px] font-mono font-bold text-pink-400 flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>BUILDER PFP</span>
          </div>
        </div>

        {/* Bottom Banner Frame Overlay */}
        <div className="w-full">
          <div className="p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <h3 className="text-sm font-heading font-extrabold text-white truncate max-w-[180px]">
                {userName || 'Hacker Name'}
              </h3>
              <p className="text-xs font-mono text-cyan-400 font-semibold truncate max-w-[180px]">
                {builderTitle || 'Chief Prompt Officer'}
              </p>
            </div>
            
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
              <span className="text-[9px] font-mono text-slate-400 mt-1">#FrameInGoa</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cyber Frame Corner Accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-pink-500 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-pink-500 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
    </div>
  );
}
