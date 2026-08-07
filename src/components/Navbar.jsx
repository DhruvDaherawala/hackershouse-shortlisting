import React from 'react';
import { Sparkles, MapPin, Calendar, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-400 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white">
                HH GOA <span className="text-gradient-cyan-pink">2026</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SHORTLISTING TASK
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-pink-400 inline" /> Goa, India
              <span className="text-slate-600">•</span>
              <Calendar className="w-3 h-3 text-cyan-400 inline" /> Aug 2026
            </p>
          </div>
        </div>

        {/* Action / Vibe Pills */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>No Auth Required</span>
          </div>

          <a
            href="https://twitter.com/intent/tweet?text=Building%20for%20HH%20Goa%202026!%20%23FrameInGoa"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-pink-500 text-slate-950 hover:opacity-90 transition-opacity shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <span>#FrameInGoa</span>
          </a>
        </div>

      </div>
    </header>
  );
}
