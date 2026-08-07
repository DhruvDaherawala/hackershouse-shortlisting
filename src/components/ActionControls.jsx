import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { renderComponentToBase64, downloadBase64Image } from '../utils/exportHelper';

/**
 * Convert a base64 data URL to a Blob
 */
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

/**
 * Convert a base64 data URL to a File object
 */
function dataUrlToFile(dataUrl, fileName) {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], fileName, { type: blob.type });
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
  const [copiedBase64, setCopiedBase64] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareToast, setShareToast] = useState(null); // null | 'copied' | 'downloading' | 'error' | 'shared'
  const [showShareModal, setShowShareModal] = useState(false);

  // Generate Base64 Canvas Image
  const handleGenerate = async () => {
    if (!canvasRef || !canvasRef.current) return null;
    setIsGenerating(true);

    try {
      const element = canvasRef.current;
      const result = await renderComponentToBase64(element, {
        format: exportFileType,
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
        colors: ['#000000', '#333333', '#FF0000'],
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

  // Download Image Handler
  const handleDownload = async () => {
    setIsDownloading(true);
    let targetBase64 = generatedBase64;

    if (!targetBase64) {
      targetBase64 = await handleGenerate();
    }

    if (targetBase64) {
      const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
      const fileName = `HH_Goa_2026_PFP.${ext}`;

      downloadBase64Image(targetBase64, fileName);

      // Transition to success screen tab
      setActiveTab('success');
    }

    setIsDownloading(false);
  };

  /**
   * Ensure we have a generated image, auto-generating if needed.
   * Returns the base64 data URL or null.
   */
  const ensureGeneratedImage = async () => {
    let imageData = generatedBase64;
    if (!imageData) {
      imageData = await handleGenerate();
    }
    return imageData;
  };

  /**
   * Copy the generated image as a PNG blob to the system clipboard.
   * Returns true on success.
   */
  const copyImageToClipboard = async (dataUrl) => {
    try {
      // Convert to PNG blob for clipboard (clipboard API requires PNG)
      const blob = dataUrlToBlob(dataUrl);
      let pngBlob = blob;

      // If JPEG, convert to PNG for clipboard
      if (blob.type === 'image/jpeg') {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = dataUrl;
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
      return true;
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      return false;
    }
  };

  /**
   * Primary share handler — uses the best available method:
   * 1. Web Share API with file (mobile) — shares actual image to X/any app
   * 2. Desktop fallback — copies image to clipboard + opens X compose
   */
  const handleShareToX = async () => {
    setIsSharing(true);
    setShareToast(null);

    try {
      const imageData = await ensureGeneratedImage();
      if (!imageData) {
        setShareToast('error');
        setTimeout(() => setShareToast(null), 3000);
        setIsSharing(false);
        return;
      }

      const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
      const fileName = `HH_Goa_2026_PFP.${ext}`;
      const mimeType = exportFileType === 'jpeg' ? 'image/jpeg' : 'image/png';

      // Strategy 1: Web Share API with file support (works great on mobile)
      if (navigator.share && navigator.canShare) {
        const file = dataUrlToFile(imageData, fileName);
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
            // User cancelled share or error — fall through to desktop flow
            if (shareErr.name === 'AbortError') {
              setIsSharing(false);
              return;
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
    const imageData = generatedBase64;
    if (!imageData) return;

    // Copy image to clipboard
    const copied = await copyImageToClipboard(imageData);

    // Open X compose with pre-filled text
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_CAPTION)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');

    if (copied) {
      setShareToast('copied');
    } else {
      // If clipboard failed, at least download the image
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
    const imageData = generatedBase64;
    if (!imageData) return;
    const copied = await copyImageToClipboard(imageData);
    if (copied) {
      setShareToast('copied');
      setShowShareModal(false);
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  // Copy Base64 Data URL
  const handleCopyBase64 = async () => {
    if (!generatedBase64) return;
    try {
      await navigator.clipboard.writeText(generatedBase64);
      setCopiedBase64(true);
      setTimeout(() => setCopiedBase64(false), 2500);
    } catch (err) {
      console.error('Failed to copy base64 string', err);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4 font-mono relative">
      {/* Share Toast Notification */}
      {shareToast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 border border-black bg-black text-white text-xs font-bold shadow-lg max-w-xs text-center animate-pulse"
          style={{ animation: 'none' }}
        >
          {shareToast === 'copied' && (
            <>
              <span className="block text-terminal-green mb-1">&gt; [IMAGE_COPIED]</span>
              <span className="block font-normal">Image copied to clipboard! Paste it (Ctrl+V) in your X post.</span>
            </>
          )}
          {shareToast === 'downloading' && (
            <>
              <span className="block text-terminal-green mb-1">&gt; [IMAGE_DOWNLOADED]</span>
              <span className="block font-normal">Image downloaded. Attach it to your X post manually.</span>
            </>
          )}
          {shareToast === 'shared' && (
            <>
              <span className="block text-terminal-green">&gt; [SHARED_SUCCESSFULLY] ✓</span>
            </>
          )}
          {shareToast === 'error' && (
            <>
              <span className="block text-terminal-red">&gt; [ERROR] Failed to generate image</span>
            </>
          )}
        </div>
      )}

      {/* Desktop Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white border-2 border-black w-full max-w-sm p-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title Bar */}
            <div className="border-b border-black px-4 py-2 flex justify-between items-center bg-white text-xs">
              <span className="font-bold">share_options.exe</span>
              <button
                onClick={() => setShowShareModal(false)}
                className="hover:bg-black hover:text-white px-2 py-0.5 border border-black cursor-pointer text-xs"
              >
                [ x ]
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-dark-gray leading-relaxed">
                &gt; X (Twitter) requires image to be attached manually.
                Choose an option below:
              </p>

              {/* Preview thumbnail */}
              {generatedBase64 && (
                <div className="w-full border border-black p-2 bg-white">
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
                className="w-full bg-black text-white text-sm font-bold py-3 border border-black hover:bg-white hover:text-black transition-none cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">content_paste</span>
                &gt; copy_image() + open_X()
              </button>
              <p className="text-[10px] text-dark-gray -mt-2 pl-1">
                Copies image to clipboard, then opens X. Just paste (Ctrl+V / ⌘+V) in the post!
              </p>

              {/* Option 2: Copy image only */}
              <button
                type="button"
                onClick={handleCopyImage}
                className="w-full bg-white text-black text-sm font-bold py-3 border border-black hover:bg-black hover:text-white transition-none cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">photo_library</span>
                &gt; copy_image_only()
              </button>

              {/* Option 3: Download + Open X */}
              <button
                type="button"
                onClick={() => {
                  if (generatedBase64) {
                    const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
                    downloadBase64Image(generatedBase64, `HH_Goa_2026_PFP.${ext}`);
                  }
                  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_CAPTION)}`;
                  window.open(tweetUrl, '_blank', 'noopener,noreferrer');
                  setShareToast('downloading');
                  setShowShareModal(false);
                  setTimeout(() => setShareToast(null), 5000);
                }}
                className="w-full bg-white text-black text-sm font-bold py-3 border border-black hover:bg-black hover:text-white transition-none cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">download</span>
                &gt; download() + open_X()
              </button>
              <p className="text-[10px] text-dark-gray -mt-2 pl-1">
                Downloads the image, then opens X. Attach the downloaded file to your post.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Selector Toggle */}
      <div className="flex items-center justify-between p-2 border border-black bg-white">
        <span className="text-xs font-light text-dark-gray">// Output format:</span>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setExportFileType('png')}
            className={`px-3 py-1 border border-black transition-none cursor-pointer ${
              exportFileType === 'png' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            PNG
          </button>
          <button
            type="button"
            onClick={() => setExportFileType('jpeg')}
            className={`px-3 py-1 border border-black transition-none cursor-pointer ${
              exportFileType === 'jpeg' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            JPG
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Generate PFP Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-black text-white text-base font-bold py-4 border border-black transition-none hover:bg-white hover:text-black hover:border-black cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            ' &gt; PROCESSING...'
          ) : generateSuccess ? (
            ' &gt; [SUCCESS] Render complete!'
          ) : (
            ' &gt; execute.generatePFP()'
          )}
        </button>

        {/* Download File Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading || isGenerating}
          className="w-full bg-black text-white text-base font-bold py-4 border border-black transition-none hover:bg-white hover:text-black hover:border-black cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            ' &gt; WRITING_FILE...'
          ) : (
            ` &gt; download.save('${exportFileType === 'jpeg' ? 'pfp.jpg' : 'pfp.png'}')`
          )}
        </button>

        {/* Export / Share to X Button */}
        <button
          type="button"
          onClick={handleShareToX}
          disabled={isSharing}
          className="w-full bg-white text-black text-base font-bold py-4 border border-black transition-none hover:bg-black hover:text-white cursor-pointer disabled:opacity-50"
        >
          {isSharing ? '&gt; PREPARING_SHARE...' : '&gt; export default toX()'}
        </button>
      </div>

      {/* Generated Metadata Output Log */}
      {generatedBase64 && generatedDetails && (
        <div className="p-3 border border-black bg-white space-y-2 text-xs">
          <div className="flex justify-between items-center text-dark-gray">
            <span>&gt; RESOLUTION: {generatedDetails.width}x{generatedDetails.height}px</span>
            <span>~{generatedDetails.sizeKB} KB</span>
          </div>
          <button
            type="button"
            onClick={handleCopyBase64}
            className="w-full text-left text-xs font-bold text-black hover:underline cursor-pointer"
          >
            {copiedBase64 ? '&gt; [COPIED_TO_CLIPBOARD]' : '&gt; copy(base64_data_url)'}
          </button>
        </div>
      )}
    </div>
  );
}
