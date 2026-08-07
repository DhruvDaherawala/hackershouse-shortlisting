import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import FormatSelector from './components/FormatSelector';
import ImageUploader from './components/ImageUploader';
import ImageAdjuster from './components/ImageAdjuster';
import UserForm from './components/UserForm';
import PreviewCanvas from './components/PreviewCanvas';
import ActionControls from './components/ActionControls';
import { useAppStore } from './store/useAppStore';
import { Sparkles, Sliders, Layers, Info } from 'lucide-react';

export default function App() {
  const canvasRef = useRef(null);
  const { format } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Single Page Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Page Hero Banner */}
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>HH Goa 2026 Shortlisting Task</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
            Frame & Builder ID <span className="text-gradient-cyan-pink">Generator</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-sans">
            Upload your photo, personalize your builder badge, and instantly generate high-resolution branded graphics ready for X & Discord.
          </p>
        </div>

        {/* Workbench Grid Layout: Mobile-first stacked, Desktop side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Controls & Input Panel (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Format & Theme Selection */}
            <section className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-white border-b border-slate-800 pb-2.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Step 1: Choose Graphic Format</span>
              </div>
              <FormatSelector />
            </section>

            {/* Step 2: Photo Upload & Fine-Tuning */}
            <section className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-sm font-heading font-bold text-white">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Step 2: Upload & Position Photo</span>
                </div>
              </div>
              
              <ImageUploader />
              <ImageAdjuster />
            </section>

            {/* Step 3: Builder Profile Form (Shown for Format B & PFP customization) */}
            <section className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-sm font-heading font-bold text-white">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Step 3: Builder Details</span>
                </div>
                {format === 'PFP' && (
                  <span className="text-[10px] font-mono text-slate-400">Optional for PFP</span>
                )}
              </div>
              <UserForm />
            </section>

          </div>

          {/* RIGHT COLUMN: Sticky Live Preview & Action Buttons (5 cols on lg) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4 flex flex-col items-center">
            
            {/* Live Render Canvas */}
            <div className="w-full p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md flex flex-col items-center justify-center">
              <PreviewCanvas canvasRef={canvasRef} />
              
              {/* Action Buttons */}
              <ActionControls canvasRef={canvasRef} />
            </div>

            {/* Quick Tip Box */}
            <div className="w-full max-w-sm p-3 rounded-xl bg-slate-900/30 border border-slate-800/60 flex items-start gap-2.5 text-xs text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                Tip: Uses client-side HTML5 canvas processing. No image is uploaded to external servers. Your photo stays 100% private in your browser.
              </span>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 HackerHouse Goa. Built for HH Goa 2026 Shortlisting Task.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Environment: {import.meta.env.VITE_EVENT_NAME || 'HH Goa 2026'}</span>
          </p>
        </div>
      </footer>

    </div>
  );
}
