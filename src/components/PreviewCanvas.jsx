import React from 'react';
import { useAppStore } from '../store/useAppStore';
import FormatAFrame from './FormatAFrame';
import FormatBBadge from './FormatBBadge';
import { Sparkles } from 'lucide-react';

export default function PreviewCanvas({ canvasRef }) {
  const { format, themeColor } = useAppStore();

  // Dynamic Theme Color Border & Glow Mapping
  const themeStyles = {
    cyan: {
      border: 'border-cyan-400',
      glow: 'shadow-[0_0_35px_rgba(0,240,255,0.25)]',
    },
    pink: {
      border: 'border-pink-500',
      glow: 'shadow-[0_0_35px_rgba(255,0,127,0.25)]',
    },
    emerald: {
      border: 'border-emerald-400',
      glow: 'shadow-[0_0_35px_rgba(0,255,157,0.25)]',
    },
    gold: {
      border: 'border-amber-400',
      glow: 'shadow-[0_0_35px_rgba(255,190,11,0.25)]',
    },
  };

  const currentTheme = themeStyles[themeColor] || themeStyles.cyan;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Live Preview Header Tag */}
      <div className="mb-3 flex items-center justify-between w-full max-w-sm px-1">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Live Canvas Preview
        </span>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
          {format === 'PFP' ? 'Format A: PFP Frame (1:1)' : 'Format B: Builder ID Badge'}
        </span>
      </div>

      {/* Main Canvas Container for Export */}
      <div
        ref={canvasRef}
        className={`relative overflow-hidden rounded-2xl bg-slate-950 border ${currentTheme.border} ${currentTheme.glow} transition-all duration-300 select-none shadow-2xl`}
        style={{
          width: '100%',
          maxWidth: '380px',
          aspectRatio: format === 'PFP' ? '1 / 1' : '3 / 4.2',
        }}
      >
        {/* Background Cyber Grid & Glow Orbs */}
        <div className="absolute inset-0 cyber-grid-bg opacity-25 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Live Preview Format Switcher */}
        {format === 'PFP' ? <FormatAFrame /> : <FormatBBadge />}
      </div>
    </div>
  );
}

