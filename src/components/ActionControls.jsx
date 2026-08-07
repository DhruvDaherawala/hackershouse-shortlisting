import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { renderComponentToBase64, downloadBase64Image } from '../utils/exportHelper';
import {
  Download,
  Loader2,
  CheckCircle2,
  Wand2,
  Copy,
  Check,
  FileType,
  Edit3,
  ImageDown,
} from 'lucide-react';

export default function ActionControls({ canvasRef }) {
  const {
    format,
    userName,
    exportFileType,
    setExportFileType,
    generatedBase64,
    generatedDetails,
    setGeneratedData,
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedBase64, setCopiedBase64] = useState(false);

  // Custom Tweet Hype Caption State
  const [tweetCaption, setTweetCaption] = useState(
    'Just minted my builder card for HH Goa 2026! 🌴💻'
  );
  const [showCaptionEdit, setShowCaptionEdit] = useState(false);

  // High-Resolution Base64 Image Generation Function (Client-Side Canvas)
  const handleGenerate = async () => {
    if (!canvasRef || !canvasRef.current) return null;
    setIsGenerating(true);

    try {
      const element = canvasRef.current;
      const result = await renderComponentToBase64(element, {
        format: exportFileType,
        scale: 3, // High DPI resolution (3x scale)
        quality: 0.95,
      });

      setGeneratedData(result.dataUrl, {
        width: result.width,
        height: result.height,
        sizeKB: result.sizeKB,
        mimeType: result.mimeType,
      });

      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);

      // Trigger celebration confetti
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#00f0ff', '#ff007f', '#00ff9d', '#ffbe0b'],
      });

      return result.dataUrl;
    } catch (err) {
      console.error('Error generating high-res base64 image:', err);
      alert('Failed to render preview. Please check image permissions.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Image Handler (Instant Local File Save)
  const handleDownload = async () => {
    setIsDownloading(true);
    let targetBase64 = generatedBase64;

    // If image hasn't been generated yet, render it first
    if (!targetBase64) {
      targetBase64 = await handleGenerate();
    }

    if (targetBase64) {
      const safeName = (userName || 'Builder').replace(/[^a-zA-Z0-9]/g, '_');
      const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
      const fileName = `HH_Goa_2026_${format}_${safeName}.${ext}`;

      downloadBase64Image(targetBase64, fileName);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }

    setIsDownloading(false);
  };

  // Copy Base64 String to Clipboard
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

  // Pre-filled X (Twitter) Web Intent Handler
  const handleShareToX = () => {
    const caption = tweetCaption || 'Just minted my builder card for HH Goa 2026! 🌴💻';
    const hashtags = 'FrameInGoa,HackerHouseGoa';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      caption
    )}&hashtags=${encodeURIComponent(hashtags)}`;

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-sm space-y-3.5 pt-3">
      
      {/* File Format Selector: PNG vs JPEG */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 pl-1">
          <FileType className="w-3.5 h-3.5 text-cyan-400" />
          <span>Output Format:</span>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setExportFileType('png')}
            className={`min-h-[36px] px-3.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
              exportFileType === 'png'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PNG (HD)
          </button>
          <button
            type="button"
            onClick={() => setExportFileType('jpeg')}
            className={`min-h-[36px] px-3.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
              exportFileType === 'jpeg'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            JPEG (Fast)
          </button>
        </div>
      </div>

      {/* Action Buttons Grid: 'Generate' and 'Download Image' */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="min-h-[44px] py-3 px-3 rounded-xl font-heading font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Rendering...</span>
            </>
          ) : generateSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Rendered!</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span>Generate</span>
            </>
          )}
        </button>

        {/* Download Image Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading || isGenerating}
          className="min-h-[44px] py-3 px-3 rounded-xl font-heading font-extrabold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-emerald-400 to-pink-500 hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Saving...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slate-950" />
              <span>Download Image</span>
            </>
          )}
        </button>
      </div>

      {/* SHARE TO X BUTTON & CAPTION PANEL */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
            {/* Custom SVG X Logo */}
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Share to X (#FrameInGoa)</span>
          </div>
          
          <button
            type="button"
            onClick={() => setShowCaptionEdit(!showCaptionEdit)}
            className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{showCaptionEdit ? 'Hide Caption' : 'Edit Tweet Text'}</span>
          </button>
        </div>

        {/* Optional Tweet Caption Editor */}
        {showCaptionEdit && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Tweet Caption Text:</span>
              <span className="text-pink-400">#FrameInGoa auto-attached</span>
            </label>
            <textarea
              rows={2}
              value={tweetCaption}
              onChange={(e) => setTweetCaption(e.target.value)}
              className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-sans text-white focus:outline-none focus:border-cyan-500 resize-none"
              placeholder="Enter hype caption..."
            />
          </div>
        )}

        {/* Share to X Action Button */}
        <button
          type="button"
          onClick={handleShareToX}
          disabled={isGenerating}
          className="w-full min-h-[46px] py-3 px-4 rounded-xl font-heading font-extrabold text-xs text-white bg-black hover:bg-slate-900 border border-slate-700 hover:border-cyan-400 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <svg className="w-4 h-4 text-white fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-white tracking-wide">Post Tweet to X</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
            #FrameInGoa
          </span>
        </button>

        {/* UI Note: Reminder to manually attach the downloaded image */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2">
          <ImageDown className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug">
            <strong className="text-amber-300 font-mono">Reminder:</strong> Download your badge image above first, then attach it to your post on X!
          </p>
        </div>
      </div>

      {/* Generated Base64 Image Details Badge */}
      {generatedBase64 && generatedDetails && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Graphic Rendered Locally
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {generatedDetails.width}×{generatedDetails.height}px • ~{generatedDetails.sizeKB} KB
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCopyBase64}
              className="text-[11px] font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
            >
              {copiedBase64 ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Base64 Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Base64 Data URL</span>
                </>
              )}
            </button>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              {exportFileType.toUpperCase()}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
