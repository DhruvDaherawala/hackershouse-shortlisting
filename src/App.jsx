import React, { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import ImageAdjuster from './components/ImageAdjuster';
import PreviewCanvas from './components/PreviewCanvas';
import ActionControls from './components/ActionControls';
import DotMatrixBackground from './components/DotMatrixBackground';
import { useAppStore } from './store/useAppStore';
import { downloadBase64Image, downloadImageInFormat } from './utils/exportHelper';

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
    <div className="min-h-screen flex flex-col bg-cream text-dark-green font-sans antialiased relative">
      {/* TopAppBar & Mobile Bottom Dock */}
      <Navbar />

      {/* Success Share Toast */}
      {successShareToast && (
        <div className="toast fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-xs text-center animate-fade-in-up">
          {successShareToast === 'copied' && (
            <>
              <span className="block text-yellow mb-1">✅ Image Copied!</span>
              <span className="block font-normal text-xs">Paste (Ctrl+V / ⌘+V) it into your X post.</span>
            </>
          )}
          {successShareToast === 'fallback' && (
            <>
              <span className="block text-yellow mb-1">📥 Download First</span>
              <span className="block font-normal text-xs">Download your PFP first, then attach it to your X post.</span>
            </>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'landing' ? (
        /* VIEW 1: FULL-WIDTH LANDING HERO WITH LIVE ANIMATED CODE WAVE BACKGROUND */
        <div className="flex-grow flex flex-col animate-fade-in-up relative min-h-screen">
          {/* Animated Live Code Wave Canvas Background */}
          <DotMatrixBackground />

          {/* Hero Section */}
          <section className="flex-grow flex flex-col items-center justify-between px-4 py-8 md:py-12 relative z-10 min-h-[90vh]">

            {/* Top Bar on Hero: asset 1.svg for 2:47 PM STUDIO logo on top-left */}
            <div className="w-full max-w-6xl flex justify-between items-center px-4 mb-4 z-20">
              <div className="flex items-center gap-3">
                <img
                  src="/asset-1.svg"
                  alt="2:47 PM STUDIO"
                  className="h-10 md:h-12 w-auto select-none drop-shadow"
                  draggable={false}
                />
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="px-6 py-2.5 rounded-lg text-sm font-extrabold cursor-pointer transition-transform hover:scale-105"
                style={{
                  background: '#FEE101',
                  color: '#063725',
                  border: '2px solid #FEE101',
                  boxShadow: '0 4px 16px rgba(254, 225, 1, 0.4)',
                }}
              >
                CREATE ↗
              </button>
            </div>

            {/* Floating Sticker Badges */}
            <div
              className="sticker sticker-pink sticker-float hidden md:flex"
              style={{ top: '22%', left: '4%', '--sticker-rotate': '-4deg', animationDelay: '0.5s' }}
            >
              📅 28 - 31 OCT 2026
            </div>
            <div
              className="sticker sticker-pink sticker-float hidden md:flex"
              style={{ top: '22%', right: '4%', '--sticker-rotate': '6deg', animationDelay: '1s' }}
            >
              #FRAMEINGOA
            </div>

            {/* Main Center Logo: asset 2.png ("HACKER HOUSE") + asset 3.svg ("गोवा") */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto my-auto px-4 py-6">
              {/* HACKER HOUSE text image (asset 2.png) */}
              <img
                src="/hacker-house-text.png"
                alt="HACKER HOUSE"
                className="w-full max-w-[700px] md:max-w-[850px] h-auto select-none"
                draggable={false}
              />
              {/* गोवा logo (asset 3.svg) overlaid in the center */}
              <img
                src="/hh-logo.svg"
                alt="गोवा"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] md:w-[140px] h-auto select-none drop-shadow-lg"
                draggable={false}
              />
            </div>

            {/* Marquee Ticker */}
            <div className="ticker-container relative z-10 my-4">
              <div className="ticker-track py-3">
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-6 px-6" style={{ fontFamily: "'Space Mono', monospace" }}>
                    <span className="text-yellow text-xs font-bold tracking-wider whitespace-nowrap">GOA, INDIA</span>
                    <span className="text-yellow/40 text-xs">·</span>
                    <span className="text-yellow/80 text-xs font-bold tracking-wider whitespace-nowrap">28 - 31 OCT 2026</span>
                    <span className="text-yellow/40 text-xs">·</span>
                    <span className="text-yellow/80 text-xs font-bold tracking-wider whitespace-nowrap">BUILD IN GOA</span>
                    <span className="text-yellow/40 text-xs">–</span>
                    <span className="text-yellow text-xs font-bold tracking-wider whitespace-nowrap">SHIP FROM PARADISE</span>
                    <span className="text-yellow/40 text-xs">·</span>
                    <span className="text-pink text-xs font-bold tracking-wider whitespace-nowrap">#FRAMEINGOA</span>
                    <span className="text-yellow/40 text-xs">·</span>
                    <span className="text-yellow/80 text-xs font-bold tracking-wider whitespace-nowrap">2:47 PM STUDIO</span>
                    <span className="text-yellow/40 text-xs">·</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtitle + CREATE CTA */}
            <div className="relative z-10 text-center my-4 space-y-5 max-w-xl mx-auto">
              <p className="text-cream/80 text-sm md:text-base leading-relaxed font-medium">
                Upload a photo. Wrap it in Goa. Post it to X.
              </p>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="px-10 py-4 rounded-xl text-lg font-extrabold cursor-pointer transition-all hover:scale-105"
                  style={{
                    background: '#FEE101',
                    color: '#063725',
                    border: '2px solid #FEE101',
                    boxShadow: '0 6px 24px rgba(254, 225, 1, 0.4)',
                  }}
                >
                  CREATE YOUR FRAME ↗
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (

        <main className="flex-grow flex flex-col relative z-10 pb-24 md:pb-16 pt-8 md:pt-12 px-4 md:px-16 w-full max-w-7xl mx-auto">{/* END of landing conditional */}

          {/* VIEW 2: CREATE WORKBENCH */}
          {activeTab === 'create' && (
            <div className="w-full space-y-8 animate-fade-in-up">
              {/* Header Text */}
              <div className="text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold text-dark-green mb-2 tracking-tight">
                  Create Your Frame
                </h1>
                <p className="text-base text-dark-gray">
                  Upload and align your photo to generate your framed profile picture.
                </p>
              </div>

              {/* Grid Layout: Left Inputs, Right Live Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT COLUMN: Controls & Input Panel (7 cols on lg) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Controls Container */}
                  <div className="card-container">
                    <div className="space-y-6">
                      {/* Image Uploader & Adjuster */}
                      <ImageUploader />
                      <ImageAdjuster />
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
            <div className="w-full flex flex-col items-center justify-center space-y-8 py-4 animate-fade-in-up">
              <div className="w-full text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-dark-green mb-2 tracking-tight">
                  Preview Your Frame
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
            <div className="w-full flex flex-col items-center justify-center py-8 animate-fade-in-up">
              <div className="card-container w-full max-w-md flex flex-col items-center text-left">
                <div className="w-full flex flex-col items-start">
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-green/10 text-dark-green text-xs font-bold rounded-full mb-6">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Success — Frame Generated!</span>
                  </div>

                  {/* Headlines */}
                  <h1 className="text-2xl md:text-3xl font-extrabold text-dark-green mb-3 tracking-tight">
                    🎉 Ready for the House!
                  </h1>
                  <p className="text-sm text-dark-gray mb-6">
                    Your framed profile photo is ready for X, Discord, & GitHub. See you at Hackers House!
                  </p>

                  {/* Generated Output Image Display */}
                  {generatedBase64 ? (
                    <div className="w-full mb-6 rounded-2xl overflow-hidden shadow-lg border-2 border-yellow bg-white p-2 flex justify-center">
                      <img
                        src={generatedBase64}
                        alt="Generated HH Goa 2026 PFP"
                        className="w-full max-w-[320px] aspect-square object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="w-full mb-6 rounded-2xl overflow-hidden shadow-lg border border-dark-green/10 bg-white p-2 flex justify-center">
                      <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
                        <PreviewCanvas canvasRef={canvasRef} />
                      </div>
                    </div>
                  )}

                  {/* Info Card */}
                  <div className="w-full bg-cream rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-dark-green block mb-1">
                        PFP Frame: HH GOA 2026
                      </span>
                      <span className="text-[10px] text-dark-gray block">
                        FORMAT: 1:1 Square (High DPI 1200x1200px)
                      </span>
                      <span className="text-[10px] font-bold text-dark-green mt-1">
                        ✅ STATUS: VERIFIED
                      </span>
                    </div>
                    <div className="text-2xl">🏅</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col w-full gap-3">
                    {/* Download Options */}
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          if (generatedBase64) {
                            downloadImageInFormat(generatedBase64, 'png', 'HH_Goa_2026_PFP.png');
                          }
                        }}
                        className="btn-primary py-3.5 flex justify-center items-center gap-1.5 cursor-pointer text-sm font-bold"
                      >
                        📥 Download PNG
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (generatedBase64) {
                            downloadImageInFormat(generatedBase64, 'jpeg', 'HH_Goa_2026_PFP.jpg');
                          }
                        }}
                        className="btn-primary py-3.5 flex justify-center items-center gap-1.5 cursor-pointer text-sm font-bold"
                      >
                        📥 Download JPG
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleShareToX}
                      className="btn-secondary w-full py-4 flex justify-center items-center gap-2 cursor-pointer text-base"
                    >
                      𝕏 Share to X
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('create')}
                      className="w-full py-3 bg-cream text-dark-green hover:bg-dark-green/5 rounded-xl font-bold flex justify-center items-center gap-2 cursor-pointer text-sm border border-dark-green/20"
                    >
                      ✏️ Edit Frame
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* Footer */}
      <footer className="bg-dark-green text-cream/60 text-center py-4 text-xs font-medium">
        Hacker Goa House 2026 • Build in Goa, Ship from Paradise 🌴
      </footer>
    </div>
  );
}
