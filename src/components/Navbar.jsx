import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Navbar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <>
      {/* TopAppBar (Desktop & Mobile Top Header) */}
      <header className="bg-white text-black docked full-width top-0 sticky border-b border-black flex justify-between items-center px-4 md:px-8 w-full h-16 z-50 font-mono">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className="text-black hover:bg-black hover:text-white transition-none p-1.5 border border-transparent hover:border-black flex items-center justify-center cursor-pointer"
            title="Terminal Home"
          >
            <span className="material-symbols-outlined text-lg">terminal</span>
          </button>
          <div className="text-xs md:text-sm font-light tracking-tight">
            &lt;App id="hh-goa-26" mode="production" /&gt;
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-light">
          <div className="hidden sm:inline-flex items-center space-x-2 px-2.5 py-0.5 border border-black text-xs">
            <span className="w-2 h-2 bg-black animate-pulse"></span>
            <span>&gt; SYSTEM_LIVE</span>
          </div>
          <span className="hidden md:inline">[ - ] [ + ] [ x ]</span>
        </div>
      </header>

      {/* BottomNavBar Container (Mobile Navigation Dock) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-between items-center bg-white border-t border-black z-50 font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className={`flex-1 flex flex-col items-center justify-center py-3 border-r border-black transition-none ${
            activeTab === 'landing' ? 'bg-black text-white' : 'text-black hover:bg-black hover:text-white'
          }`}
          title="Landing Page"
        >
          <span className="font-bold text-sm">[H]</span>
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex-1 flex flex-col items-center justify-center py-3 border-r border-black transition-none ${
            activeTab === 'create' ? 'bg-black text-white' : 'text-black hover:bg-black hover:text-white'
          }`}
          title="Create Card"
        >
          <span className="font-bold text-sm">[+]</span>
          <span className="text-[10px] mt-0.5">Create</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 flex flex-col items-center justify-center py-3 border-r border-black transition-none ${
            activeTab === 'preview' ? 'bg-black text-white' : 'text-black hover:bg-black hover:text-white'
          }`}
          title="Preview ID"
        >
          <span className="font-bold text-sm">[*]</span>
          <span className="text-[10px] mt-0.5">Preview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('success')}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-none ${
            activeTab === 'success' ? 'bg-black text-white' : 'text-black hover:bg-black hover:text-white'
          }`}
          title="Success / Export"
        >
          <span className="font-bold text-sm">[&gt;]</span>
          <span className="text-[10px] mt-0.5">Export</span>
        </button>
      </nav>
    </>
  );
}
