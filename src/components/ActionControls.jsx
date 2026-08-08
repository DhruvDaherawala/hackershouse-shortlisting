import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { renderComponentToBase64, downloadBase64Image, downloadImageInFormat } from '../utils/exportHelper';

/**
 * Convert a base64 data URL to a Blob
 */
function dataUrlToBlob(dataUrl) {
  if (!dataUrl) return null;
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mime });
}

/**
 * Convert a base64 data URL to a File object
 */
function dataUrlToFile(dataUrl, fileName) {
  const blob = dataUrlToBlob(dataUrl);
  if (!blob) return null;
  return new File([blob], fileName, { type: blob.type });
}

/**
 * Convert a base64 data URL to a PNG blob and copy to clipboard
 */
async function copyImageToClipboard(dataUrl) {
  if (!dataUrl) return false;
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mime });

    let pngBlob = blob;
    if (mime !== 'image/png') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 1200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    }

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': pngBlob }),
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    return false;
  }
}

const SHARE_CAPTION = 'Just generated my candidate framed profile picture for Hackers House Goa 2026! 🌴💻 #FrameInGoa #HHGoa2026';

export default function ActionControls({ canvasRef }) {
  const {
    exportFileType,
    setExportFileType,
    generatedBase64,
    generatedDetails,
    setGeneratedData,
    setActiveTab,
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareToast, setShareToast] = useState(null); // null | 'copied' | 'downloading' | 'error' | 'shared'
  const [showShareModal, setShowShareModal] = useState(false);

  // Generate Base64 Canvas Image in specific format (default exportFileType)
  const handleGenerate = async (targetFormat = null) => {
    if (!canvasRef || !canvasRef.current) return null;
    setIsGenerating(true);
    const formatToUse = targetFormat || exportFileType;

    try {
      const element = canvasRef.current;
      const result = await renderComponentToBase64(element, {
        format: formatToUse,
        scale: 3, // 3x scale high DPI
        quality: 0.95,
      });

      setGeneratedData(result.dataUrl, {
        width: result.width,
        height: result.height,
        sizeKB: result.sizeKB,
        mimeType: result.mimeType,
      });

      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 4000);

      // Trigger celebration confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#063725', '#FEE101', '#E52B50'],
      });

      return result.dataUrl;
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Failed to render preview. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Image Handler in requested format ('png' or 'jpeg')
  const handleDownload = async (targetFormat = null) => {
    setIsDownloading(true);
    const formatToUse = targetFormat || exportFileType;

    if (targetFormat && targetFormat !== exportFileType) {
      setExportFileType(targetFormat);
    }

    // Always generate afresh to guarantee output matches exact preview settings & target format
    const targetBase64 = await handleGenerate(formatToUse);

    if (targetBase64) {
      const ext = formatToUse === 'jpeg' ? 'jpg' : 'png';
      const fileName = `HH_Goa_2026_PFP.${ext}`;

      downloadBase64Image(targetBase64, fileName);

      // Transition to success screen tab
      setActiveTab('success');
    }

    setIsDownloading(false);
  };

  /**
   * Primary share handler — uses the best available method:
   * 1. Web Share API with file (mobile) — shares actual image to X/any app
   * 2. Desktop fallback — opens share modal with PNG and JPG download/share options
   */
  const handleShareToX = async () => {
    setIsSharing(true);
    setShareToast(null);

    try {
      const imageData = await handleGenerate();
      if (!imageData) {
        setShareToast('error');
        setTimeout(() => setShareToast(null), 3000);
        setIsSharing(false);
        return;
      }

      const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
      const fileName = `HH_Goa_2026_PFP.${ext}`;

      // Strategy 1: Web Share API with file support (works great on mobile)
      if (navigator.share && navigator.canShare) {
        const file = dataUrlToFile(imageData, fileName);
        if (file) {
          const shareData = {
            text: SHARE_CAPTION,
            files: [file],
          };

          if (navigator.canShare(shareData)) {
            try {
              await navigator.share(shareData);
              setShareToast('shared');
              setTimeout(() => setShareToast(null), 3000);
              setIsSharing(false);
              return;
            } catch (shareErr) {
              if (shareErr.name === 'AbortError') {
                setIsSharing(false);
                return;
              }
            }
          }
        }
      }

      // Strategy 2: Desktop fallback — show share modal with options
      setShowShareModal(true);
      setIsSharing(false);

    } catch (err) {
      console.error('Share failed:', err);
      setShareToast('error');
      setTimeout(() => setShareToast(null), 3000);
      setIsSharing(false);
    }
  };

  /**
   * Desktop share: Copy image + open X compose
   */
  const handleDesktopShareToX = async () => {
    const imageData = generatedBase64 || await handleGenerate();
    if (!imageData) return;

    // Copy image to clipboard
    const copied = await copyImageToClipboard(imageData);

    // Open X compose with pre-filled text
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_CAPTION)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');

    if (copied) {
      setShareToast('copied');
    } else {
      const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
      downloadBase64Image(imageData, `HH_Goa_2026_PFP.${ext}`);
      setShareToast('downloading');
    }
    setShowShareModal(false);
    setTimeout(() => setShareToast(null), 6000);
  };

  /**
   * Copy image to clipboard only
   */
  const handleCopyImage = async () => {
    const imageData = generatedBase64 || await handleGenerate();
    if (!imageData) return;
    const copied = await copyImageToClipboard(imageData);
    if (copied) {
      setShareToast('copied');
      setShowShareModal(false);
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4 relative">
      {/* Share Toast Notification */}
      {shareToast && (
        <div className="toast fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-xs text-center animate-fade-in-up">
          {shareToast === 'copied' && (
            <>
              <span className="block text-yellow mb-1">✅ Image Copied!</span>
              <span className="block font-normal text-xs">Paste it (Ctrl+V) into your X post.</span>
            </>
          )}
          {shareToast === 'downloading' && (
            <>
              <span className="block text-yellow mb-1">📥 Image Downloaded</span>
              <span className="block font-normal text-xs">Attach it to your X post manually.</span>
            </>
          )}
          {shareToast === 'shared' && (
            <span className="block text-yellow">✅ Shared Successfully!</span>
          )}
          {shareToast === 'error' && (
            <span className="block text-pink">❌ Failed to generate image</span>
          )}
        </div>
      )}

      {/* Desktop Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="card-container w-full max-w-sm !p-0 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title Bar */}
            <div className="px-5 py-3 flex justify-between items-center bg-dark-green text-cream">
              <span className="font-bold text-sm">Share Options</span>
              <button
                onClick={() => setShowShareModal(false)}
                className="hover:bg-white/10 px-2 py-0.5 rounded-lg cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-dark-gray leading-relaxed">
                X (Twitter) requires the image to be attached manually. Choose a format and action below:
              </p>

              {/* Preview thumbnail */}
              {generatedBase64 && (
                <div className="w-full rounded-xl overflow-hidden border border-dark-green/10">
                  <img
                    src={generatedBase64}
                    alt="Generated PFP Preview"
                    className="w-full aspect-square object-contain"
                  />
                </div>
              )}

              {/* Option 1: Copy + Open X */}
              <button
                type="button"
                onClick={handleDesktopShareToX}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 cursor-pointer"
              >
                📋 Copy Image + Open X
              </button>
              <p className="text-[10px] text-dark-gray -mt-2 pl-1">
                Copies image to clipboard, then opens X. Just paste (Ctrl+V / ⌘+V) into the post!
              </p>

              {/* Option 2: Download PNG + Open X */}
              <button
                type="button"
                onClick={() => {
                  if (generatedBase64) {
                    downloadImageInFormat(generatedBase64, 'png', 'HH_Goa_2026_PFP.png');
                  }
                  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_CAPTION)}`;
                  window.open(tweetUrl, '_blank', 'noopener,noreferrer');
                  setShareToast('downloading');
                  setShowShareModal(false);
                  setTimeout(() => setShareToast(null), 5000);
                }}
                className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                📥 Download PNG + Open X
              </button>

              {/* Option 3: Download JPG + Open X */}
              <button
                type="button"
                onClick={() => {
                  if (generatedBase64) {
                    downloadImageInFormat(generatedBase64, 'jpeg', 'HH_Goa_2026_PFP.jpg');
                  }
                  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_CAPTION)}`;
                  window.open(tweetUrl, '_blank', 'noopener,noreferrer');
                  setShareToast('downloading');
                  setShowShareModal(false);
                  setTimeout(() => setShareToast(null), 5000);
                }}
                className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                📥 Download JPG + Open X
              </button>

              {/* Option 4: Copy image only */}
              <button
                type="button"
                onClick={handleCopyImage}
                className="w-full py-2 bg-cream text-dark-green hover:bg-dark-green/5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                🖼️ Copy Image Only
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Selector Toggle */}
      <div className="p-3 bg-white rounded-xl border border-dark-green/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-dark-gray">Select Format:</span>
          <span className="text-[10px] font-bold text-dark-green">
            {exportFileType === 'png' ? 'PNG (Lossless High Quality)' : 'JPG (Optimized File Size)'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              if (exportFileType !== 'png') {
                setExportFileType('png');
                setGeneratedData(null, null);
              }
            }}
            className={`py-2 px-3 rounded-lg font-bold cursor-pointer transition-all duration-150 flex items-center justify-center gap-1.5 ${
              exportFileType === 'png'
                ? 'bg-dark-green text-yellow shadow-md ring-2 ring-yellow/50'
                : 'bg-cream text-dark-green hover:bg-dark-green/10'
            }`}
          >
            <span>PNG Format</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (exportFileType !== 'jpeg') {
                setExportFileType('jpeg');
                setGeneratedData(null, null);
              }
            }}
            className={`py-2 px-3 rounded-lg font-bold cursor-pointer transition-all duration-150 flex items-center justify-center gap-1.5 ${
              exportFileType === 'jpeg'
                ? 'bg-dark-green text-yellow shadow-md ring-2 ring-yellow/50'
                : 'bg-cream text-dark-green hover:bg-dark-green/10'
            }`}
          >
            <span>JPG Format</span>
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Generate PFP Button */}
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="btn-primary w-full py-4 text-base cursor-pointer"
        >
          {isGenerating ? (
            '⏳ Processing...'
          ) : generateSuccess ? (
            '✅ Frame Generated!'
          ) : (
            '⚡ Generate Frame'
          )}
        </button>

        {/* Dual Format Quick Download Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDownload('png')}
            disabled={isDownloading || isGenerating}
            className={`py-3.5 px-3 rounded-xl font-bold cursor-pointer text-sm transition-all duration-150 flex items-center justify-center gap-1.5 ${
              exportFileType === 'png'
                ? 'bg-dark-green text-yellow border-2 border-yellow shadow-md'
                : 'bg-cream text-dark-green border border-dark-green/20 hover:bg-dark-green/5'
            }`}
          >
            📥 Download PNG
          </button>

          <button
            type="button"
            onClick={() => handleDownload('jpeg')}
            disabled={isDownloading || isGenerating}
            className={`py-3.5 px-3 rounded-xl font-bold cursor-pointer text-sm transition-all duration-150 flex items-center justify-center gap-1.5 ${
              exportFileType === 'jpeg'
                ? 'bg-dark-green text-yellow border-2 border-yellow shadow-md'
                : 'bg-cream text-dark-green border border-dark-green/20 hover:bg-dark-green/5'
            }`}
          >
            📥 Download JPG
          </button>
        </div>

        {/* Export / Share to X Button */}
        <button
          type="button"
          onClick={handleShareToX}
          disabled={isSharing}
          className="btn-secondary w-full py-4 text-base cursor-pointer"
        >
          {isSharing ? '⏳ Preparing...' : '𝕏 Share to X'}
        </button>
      </div>
    </div>
  );
}
