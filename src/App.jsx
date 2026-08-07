import React, { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import ImageAdjuster from './components/ImageAdjuster';
import PreviewCanvas from './components/PreviewCanvas';
import ActionControls from './components/ActionControls';
import { useAppStore } from './store/useAppStore';

const SHARE_CAPTION = 'Just generated my candidate framed profile picture for Hackers House Goa 2026! 🌴💻 #FrameInGoa #HHGoa2026';

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mime });
}

function dataUrlToFile(dataUrl, fileName) {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], fileName, { type: blob.type });
}

export default function App() {
  const canvasRef = useRef(null);
  const { activeTab, setActiveTab, generatedBase64, exportFileType } = useAppStore();
  const [successShareToast, setSuccessShareToast] = useState(null);

  const handleShareToX = async () => {
    // If we have the generated image, try Web Share API first (mobile)
    if (generatedBase64) {
      const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
      const fileName = `HH_Goa_2026_PFP.${ext}`;

      if (navigator.share && navigator.canShare) {
        const file = dataUrlToFile(generatedBase64, fileName);
        const shareData = { text: SHARE_CAPTION, files: [file] };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            return;
          } catch (err) {
            if (err.name === 'AbortError') return;
          }
        }
      }

      // Desktop fallback: copy image to clipboard + open X
      try {
        const blob = dataUrlToBlob(generatedBase64);
        let pngBlob = blob;
        if (blob.type === 'image/jpeg') {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = generatedBase64;
          });
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        }
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': pngBlob }),
        ]);
        setSuccessShareToast('copied');
        setTimeout(() => setSuccessShareToast(null), 5000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        setSuccessShareToast('fallback');
        setTimeout(() => setSuccessShareToast(null), 5000);
      }
    }

    // Open X compose with pre-filled caption
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_CAPTION)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-mono antialiased relative selection:bg-black selection:text-white">
      {/* TopAppBar & Mobile Bottom Dock */}
      <Navbar />

      {/* Success Share Toast */}
      {successShareToast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 border border-black bg-black text-white text-xs font-bold shadow-lg max-w-xs text-center"
        >
          {successShareToast === 'copied' && (
            <>
              <span className="block text-terminal-green mb-1">&gt; [IMAGE_COPIED]</span>
              <span className="block font-normal">Image copied! Paste (Ctrl+V / ⌘+V) it into your X post.</span>
            </>
          )}
          {successShareToast === 'fallback' && (
            <>
              <span className="block text-terminal-green mb-1">&gt; [DOWNLOAD_FIRST]</span>
              <span className="block font-normal">Download your PFP first, then attach it to your X post.</span>
            </>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-10 pb-24 md:pb-16 pt-8 md:pt-12 px-4 md:px-16 w-full max-w-7xl mx-auto">
        
        {/* VIEW 1: LANDING SCREEN */}
        {activeTab === 'landing' && (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 my-auto items-center">
            {/* Left Side: Hero Content */}
            <div className="md:col-span-6 flex flex-col items-start space-y-8">
              {/* Status Chip */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 border border-black text-xs">
                <span className="w-2 h-2 bg-black animate-pulse"></span>
                <span>&gt; SYSTEM_LIVE</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <div className="inline-block max-w-fit">
                  <h1 className="text-4xl md:text-6xl font-extrabold leading-none tracking-tight typing-effect">
                    PFP_GEN
                  </h1>
                </div>
                <p className="text-lg md:text-xl font-normal text-dark-gray max-w-xl">
                  Generate your official framed profile photo for Hackers House Goa 2026.
                </p>
              </div>

              {/* Main CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-black text-white border border-black transition-none text-base font-bold hover:bg-white hover:text-black cursor-pointer"
                >
                  &gt; execute.buildPFP()
                </button>
              </div>

              {/* Decorative Data Points */}
              <div className="grid grid-cols-2 gap-0 w-full max-w-lg border-t border-l border-black mt-8">
                <div className="flex flex-col items-start p-4 border-b border-r border-black hover:bg-black hover:text-white transition-none group">
                  <span className="text-2xl font-bold">0.9s</span>
                  <span className="text-xs mt-2 opacity-70 group-hover:opacity-100">&gt; GEN_TIME</span>
                </div>
                <div className="flex flex-col items-start p-4 border-b border-r border-black hover:bg-black hover:text-white transition-none group">
                  <span className="text-2xl font-bold">10k+</span>
                  <span className="text-xs mt-2 opacity-70 group-hover:opacity-100">&gt; PFPS_CREATED</span>
                </div>
                <div className="flex flex-col items-start p-4 border-b border-r border-black hover:bg-black hover:text-white transition-none group">
                  <span className="text-2xl font-bold">100%</span>
                  <span className="text-xs mt-2 opacity-70 group-hover:opacity-100">&gt; ACCURACY</span>
                </div>
                <div className="flex flex-col items-start p-4 border-b border-r border-black hover:bg-black hover:text-white transition-none group">
                  <span className="text-2xl font-bold text-terminal-red group-hover:text-white">SYS_OK</span>
                  <span className="text-xs mt-2 opacity-70 group-hover:opacity-100">&gt; STATUS</span>
                </div>
              </div>
            </div>

            {/* Right Side: IDE Terminal Box */}
            <div className="hidden md:flex md:col-span-6 flex-col border border-black bg-white">
              <div className="border-b border-black px-4 py-2 flex justify-between items-center bg-white text-xs">
                <span>terminal.exe</span>
                <span>[ - ] [ + ] [ x ]</span>
              </div>
              <div
                onClick={() => setActiveTab('create')}
                className="p-12 flex-grow flex flex-col items-center justify-center text-dark-gray text-sm min-h-[360px] border-dashed cursor-pointer hover:bg-black hover:text-white transition-none group text-center space-y-4"
              >
                <div className="text-3xl font-bold">// Drop payload here or click to init()</div>
                <div className="text-xs opacity-70">&gt; Click to launch profile photo generator &gt;&gt;</div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CREATE WORKBENCH */}
        {activeTab === 'create' && (
          <div className="w-full space-y-8">
            {/* Header Text */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-2 tracking-tight typing-effect inline-block">
                &lt;Initialize /&gt;
              </h1>
              <p className="text-base text-dark-gray">
                Upload and align your photo to generate your framed profile picture.
              </p>
            </div>

            {/* Grid Layout: Left Inputs, Right Live Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Controls & Input Panel (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Controls Container */}
                <div className="border border-black p-6 md:p-8 relative bg-white">
                  <div className="absolute top-0 left-0 w-full border-b border-black bg-white flex items-center justify-between px-4 py-2 text-xs font-light">
                    <span>pfp_config.json</span>
                    <div className="flex gap-3">
                      <span>[ - ]</span>
                      <span>[ + ]</span>
                      <span>[ x ]</span>
                    </div>
                  </div>

                  <div className="pt-6 space-y-8">
                    {/* Image Uploader & Adjuster */}
                    <div className="space-y-6">
                      <ImageUploader />
                      <ImageAdjuster />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sticky Live Preview Canvas & Action Buttons (5 cols on lg) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 flex flex-col items-center">
                <PreviewCanvas canvasRef={canvasRef} />
                <ActionControls canvasRef={canvasRef} />
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: ID PREVIEW SCREEN */}
        {activeTab === 'preview' && (
          <div className="w-full flex flex-col items-center justify-center space-y-8 py-4">
            <div className="w-full text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-2 tracking-tight">
                PFP_PREVIEW
              </h1>
              <p className="text-sm text-dark-gray">
                Review your profile photo frame before downloading.
              </p>
            </div>

            <div className="w-full max-w-sm">
              <PreviewCanvas canvasRef={canvasRef} />
            </div>

            <div className="w-full max-w-sm">
              <ActionControls canvasRef={canvasRef} />
            </div>
          </div>
        )}

        {/* VIEW 4: SUCCESS / EXPORT SCREEN */}
        {activeTab === 'success' && (
          <div className="w-full flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-md bg-white border border-black p-8 md:p-10 flex flex-col items-center text-left relative overflow-hidden">
              {/* Top Bar Window Controls */}
              <div className="absolute top-0 left-0 w-full border-b border-black bg-white flex items-center justify-between px-4 py-2 text-xs font-light">
                <span>export_status.log</span>
                <div className="flex gap-3">
                  <span>[ - ]</span>
                  <span>[ + ]</span>
                  <span>[ x ]</span>
                </div>
              </div>

              <div className="mt-8 w-full flex flex-col items-start">
                {/* Status Message */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 border border-black text-xs mb-6">
                  <span className="w-2 h-2 bg-black animate-pulse"></span>
                  <span>&gt; [SUCCESS] OUTPUT_GENERATED</span>
                </div>

                {/* Headlines */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-black mb-3 tracking-tight">
                  &gt; READY_FOR_THE_HOUSE
                </h1>
                <p className="text-xs text-dark-gray mb-6">
                  Your framed profile photo is ready for X, Discord, & GitHub. See you at Hackers House!
                </p>

                {/* Card Preview Box */}
                <div className="w-full border border-black bg-white p-4 mb-6 flex items-center justify-between gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-black block mb-1">
                      PFP_FRAME: HH GOA 2026
                    </span>
                    <span className="text-[10px] text-dark-gray block">
                      FORMAT: 1:1 Square (High DPI)
                    </span>
                    <span className="text-[10px] font-bold text-black mt-1">
                      &gt; STATUS: VERIFIED
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col w-full gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('landing')}
                    className="w-full py-4 bg-black text-white font-bold text-sm border border-black flex justify-center items-center gap-2 hover:bg-white hover:text-black transition-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">home</span>
                    &gt; execute.goHome()
                  </button>
                  <button
                    type="button"
                    onClick={handleShareToX}
                    className="w-full py-4 bg-white text-black font-bold text-sm border border-black flex justify-center items-center gap-2 hover:bg-black hover:text-white transition-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">share</span>
                    &gt; execute.shareInvite()
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}


