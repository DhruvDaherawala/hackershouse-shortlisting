import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Navbar() {
  const { activeTab, setActiveTab } = useAppStore();

  if (activeTab === 'landing') {
    return null;
  }

  return (
    <>
      {/* TopAppBar (Desktop & Mobile Top Header) */}
      <header className="bg-dark-green text-cream sticky top-0 flex justify-between items-center px-4 md:px-8 w-full h-16 z-50">
        {/* Yellow accent bar at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-yellow" />

        <div className="flex items-center gap-3">
          {/* Logo Branding using asset 7.svg and asset 2.png */}
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
            title="Home"
          >
            <img
              src="/asset-7.svg"
              alt="Hacker House Goa Logo"
              className="h-10 w-auto select-none"
            />
            <img
              src="/asset-2.png"
              alt="HACKER HOUSE"
              className="h-6 md:h-7 w-auto select-none"
            />
          </button>
        </div>

        <div className="flex items-center">
          {/* Home Button placed where 2:47 PM STUDIO was */}
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow text-dark-green text-xs font-extrabold tracking-wider rounded-lg hover:bg-yellow/90 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Return to Home"
          >
            <span>← HOME</span>
          </button>
        </div>
      </header>

      {/* BottomNavBar Container (Mobile Navigation Dock) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-between items-center bg-dark-green z-50">
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className={`flex-1 flex flex-col items-center justify-center py-3 nav-hover ${
            activeTab === 'landing' ? 'bg-yellow text-dark-green' : 'text-cream/80'
          }`}
          title="Landing Page"
        >
          <span className="text-base">🏠</span>
          <span className="text-[10px] mt-0.5 font-semibold">Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex-1 flex flex-col items-center justify-center py-3 nav-hover ${
            activeTab === 'create' ? 'bg-yellow text-dark-green' : 'text-cream/80'
          }`}
          title="Create PFP"
        >
          <span className="text-base">✨</span>
          <span className="text-[10px] mt-0.5 font-semibold">Create</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 flex flex-col items-center justify-center py-3 nav-hover ${
            activeTab === 'preview' ? 'bg-yellow text-dark-green' : 'text-cream/80'
          }`}
          title="Preview PFP"
        >
          <span className="text-base">👁️</span>
          <span className="text-[10px] mt-0.5 font-semibold">Preview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('success')}
          className={`flex-1 flex flex-col items-center justify-center py-3 nav-hover ${
            activeTab === 'success' ? 'bg-yellow text-dark-green' : 'text-cream/80'
          }`}
          title="Export PFP"
        >
          <span className="text-base">🚀</span>
          <span className="text-[10px] mt-0.5 font-semibold">Export</span>
        </button>
      </nav>
    </>
  );
}
