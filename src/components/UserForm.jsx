import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { PRESET_STACKS } from '../utils/titleGenerator';
import { Dices, User, Code2, Sparkles } from 'lucide-react';

export default function UserForm() {
  const {
    format,
    userName,
    setUserName,
    stackRole,
    setStackRole,
    builderTitle,
    setBuilderTitle,
    generateRandomTitle,
  } = useAppStore();

  return (
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-cyan-400" /> Builder Name
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="e.g. Satoshi Nakamoto"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-semibold text-white placeholder-slate-600 transition-colors outline-none"
        />
      </div>

      {/* Stack/Role Selection & Custom Input */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Stack / Primary Role
        </label>
        
        <input
          type="text"
          value={stackRole}
          onChange={(e) => setStackRole(e.target.value)}
          placeholder="e.g. Solana / Rust / AI"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm font-semibold text-white placeholder-slate-600 transition-colors outline-none mb-2"
        />

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5">
          {PRESET_STACKS.map((stack) => (
            <button
              key={stack}
              type="button"
              onClick={() => setStackRole(stack)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                stackRole === stack
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {stack}
            </button>
          ))}
        </div>
      </div>

      {/* Builder Title (Format B & PFP Badge) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Builder Title
          </label>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={builderTitle}
            onChange={(e) => setBuilderTitle(e.target.value)}
            placeholder="e.g. Chief Prompt Officer"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm font-semibold text-white placeholder-slate-600 transition-colors outline-none"
          />
          <button
            type="button"
            onClick={generateRandomTitle}
            title="Generate random title"
            className="px-3.5 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:border-pink-500/50 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 flex-shrink-0"
          >
            <Dices className="w-4 h-4 text-pink-400 animate-spin-slow" />
            <span className="hidden sm:inline">Randomize</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 font-mono">
          Click randomize for fun titles like 'Chief Prompt Officer' or 'Node Ninja'.
        </p>
      </div>
    </div>
  );
}
