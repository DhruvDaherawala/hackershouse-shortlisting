import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapPin, QrCode, Sparkles, User, Code, ShieldCheck } from 'lucide-react';

export default function FormatBBadge() {
  const {
    uploadedImage,
    imageTransform,
    userName,
    stackRole,
    builderTitle,
    themeColor,
    badgeNumber,
  } = useAppStore();

  const themeColors = {
    cyan: {
      accentText: 'text-cyan-400',
      badgeGradient: 'from-cyan-400 to-pink-500',
      border: 'border-cyan-400/50',
      tagBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    },
    pink: {
      accentText: 'text-pink-400',
      badgeGradient: 'from-pink-500 to-purple-600',
      border: 'border-pink-500/50',
      tagBg: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
    },
    emerald: {
      accentText: 'text-emerald-400',
      badgeGradient: 'from-emerald-400 to-cyan-500',
      border: 'border-emerald-400/50',
      tagBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    },
    gold: {
      accentText: 'text-amber-400',
      badgeGradient: 'from-amber-400 to-pink-500',
      border: 'border-amber-400/50',
      tagBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    },
  };

  const theme = themeColors[themeColor] || themeColors.cyan;

  return (
    <div className="relative w-full h-full p-5 flex flex-col justify-between select-none font-sans text-left bg-slate-950">
      
      {/* Top Lanyard Slot / Badge Clip Slot */}
      <div className="w-full flex justify-center -mt-2 mb-1">
        <div className="w-12 h-2.5 rounded-full bg-slate-900 border border-slate-700 shadow-inner flex items-center justify-center">
          <div className="w-8 h-1 rounded-full bg-slate-950" />
        </div>
      </div>

      {/* Header: HackerHouse Goa 2026 Branding */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${theme.badgeGradient} flex items-center justify-center font-black text-xs text-slate-950 shadow-md`}>
              HH
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm text-white tracking-wider block leading-none">
                HACKERHOUSE
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest block mt-0.5">
                GOA 2026 • OFFICIAL BADGE
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block tracking-tighter">
              {badgeNumber}
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold">
              VIP BUILDER
            </span>
          </div>
        </div>
      </div>

      {/* Central User Photo Frame (Uncropped) */}
      <div className="my-2 flex items-center justify-center">
        <div className={`w-36 h-36 rounded-2xl overflow-hidden bg-slate-950/90 border-2 ${theme.border} shadow-2xl relative flex items-center justify-center p-1 group`}>
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Builder Badge Photo"
              crossOrigin="anonymous"
              style={{
                transform: `scale(${imageTransform.zoom}) translate(${imageTransform.x}px, ${imageTransform.y}px) rotate(${imageTransform.rotate}deg)`,
                transition: 'transform 0.05s ease-out',
              }}
              className="max-w-full max-h-full object-contain select-none pointer-events-none drop-shadow-md"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-500 space-y-1">
              <User className="w-12 h-12 opacity-30 text-cyan-400" />
              <span className="text-[10px] font-mono text-slate-400">Upload Photo</span>
            </div>
          )}
          {/* Inner Frame Neon Glow */}
          <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
        </div>
      </div>

      {/* Builder Details Section */}
      <div className="space-y-2.5">
        
        {/* Name & Builder Title */}
        <div className="text-center">
          <h2 className="text-xl font-heading font-extrabold text-white tracking-tight truncate">
            {userName || 'Satoshi Nakamoto'}
          </h2>
          <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-slate-900 border border-pink-500/40 text-xs font-mono font-bold text-gradient-cyan-pink shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>{builderTitle || 'Chief Prompt Officer'}</span>
          </div>
        </div>

        {/* Stack / Role & Event Location */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] font-mono text-slate-400 block uppercase flex items-center gap-1">
              <Code className="w-3 h-3 text-emerald-400" /> Stack / Role
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300 truncate block mt-0.5">
              {stackRole || 'Full-Stack'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] font-mono text-slate-400 block uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-pink-400" /> Event Venue
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 block mt-0.5">
              Goa, India 🌴
            </span>
          </div>
        </div>

      </div>

      {/* Card Footer: Scannable QR Code & Hashtag */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-slate-900 border border-cyan-500/30">
            <QrCode className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-400 block leading-none">OFFICIAL HASHTAG</span>
            <span className="text-[10px] font-mono font-bold text-cyan-400">#FrameInGoa</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] font-mono text-slate-500 block leading-none">POWERED BY</span>
          <span className="text-[10px] font-heading font-extrabold text-pink-400 flex items-center justify-end gap-1">
            <ShieldCheck className="w-3 h-3" /> HH GOA '26
          </span>
        </div>
      </div>

    </div>
  );
}
