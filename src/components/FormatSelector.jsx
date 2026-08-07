import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserSquare2, BadgeCheck, Palette, Sparkles } from 'lucide-react';

export default function FormatSelector() {
  const { format, setFormat, themeColor, setThemeColor } = useAppStore();

  const themes = [
    { id: 'cyan', label: 'Neon Cyan', colorClass: 'bg-cyan-400' },
    { id: 'pink', label: 'Cyber Pink', colorClass: 'bg-pink-500' },
    { id: 'emerald', label: 'Tropical Mint', colorClass: 'bg-emerald-400' },
    { id: 'gold', label: 'Solar Gold', colorClass: 'bg-amber-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Interactive Pill Toggle Switch */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
        <button
          type="button"
          onClick={() => setFormat('PFP')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-heading font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            format === 'PFP'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <UserSquare2 className="w-4 h-4" />
          <span>Format A: PFP Frame</span>
        </button>

        <button
          type="button"
          onClick={() => setFormat('ID_CARD')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-heading font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            format === 'ID_CARD'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <BadgeCheck className="w-4 h-4" />
          <span>Format B: Builder ID Card</span>
        </button>
      </div>

      {/* Visual Format Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Format A Option Card */}
        <div
          onClick={() => setFormat('PFP')}
          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
            format === 'PFP'
              ? 'bg-slate-900/90 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 font-heading font-bold text-sm text-white">
              <UserSquare2 className={`w-4 h-4 ${format === 'PFP' ? 'text-cyan-400' : 'text-slate-400'}`} />
              Format A: PFP Frame
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${format === 'PFP' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
              1:1 Square
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-snug">
            Square profile photo wrapped in branded 'HH Goa 2026' overlay frame for X & Discord.
          </p>
        </div>

        {/* Format B Option Card */}
        <div
          onClick={() => setFormat('ID_CARD')}
          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
            format === 'ID_CARD'
              ? 'bg-slate-900/90 border-pink-500 shadow-lg shadow-pink-500/10 ring-1 ring-pink-500/50'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 font-heading font-bold text-sm text-white">
              <BadgeCheck className={`w-4 h-4 ${format === 'ID_CARD' ? 'text-pink-400' : 'text-slate-400'}`} />
              Format B: Builder ID Card
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${format === 'ID_CARD' ? 'bg-pink-500/20 text-pink-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
              Portrait Badge
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-snug">
            Sleek physical event pass with Photo, Name, Stack/Role, Builder Title & QR Code.
          </p>
        </div>

      </div>

      {/* Theme Color Picker */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>Vibe Theme Palette:</span>
        </div>
        <div className="flex items-center gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeColor(t.id)}
              title={t.label}
              className={`w-6 h-6 rounded-full ${t.colorClass} transition-transform ${
                themeColor === t.id ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-60 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

