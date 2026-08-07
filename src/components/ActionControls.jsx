import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { renderComponentToBase64, downloadBase64Image } from '../utils/exportHelper';

export default function ActionControls({ canvasRef }) {
  const {
    format,
    userName,
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
      const safeName = (userName || 'Builder').replace(/[^a-zA-Z0-9]/g, '_');
      const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
      const fileName = `HH_Goa_2026_${format}_${safeName}.${ext}`;

      downloadBase64Image(targetBase64, fileName);

      // Transition to success screen tab
      setActiveTab('success');
    }

    setIsDownloading(false);
  };

  // Share to X Web Intent
  const handleShareToX = () => {
    const caption = 'Just generated my candidate card for Hackers House 2026! 🌴💻';
    const hashtags = 'FrameInGoa,HHGoa2026';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      caption
    )}&hashtags=${encodeURIComponent(hashtags)}`;

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
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
    <div className="w-full max-w-sm space-y-4 font-mono">
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
        {/* Generate ID Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-black text-white text-base font-bold py-4 border border-black transition-none hover:bg-white hover:text-black hover:border-black cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            ' &gt; PROCESSING...'
          ) : generateSuccess ? (
            ' &gt; [SUCCESS] Output generated in 42ms.'
          ) : (
            ' &gt; execute.generateID()'
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
            ` &gt; fs.writeFileSync('${format === 'PFP' ? 'pfp' : 'id'}.${exportFileType === 'jpeg' ? 'jpg' : 'png'}')`
          )}
        </button>

        {/* Export / Share to X Button */}
        <button
          type="button"
          onClick={handleShareToX}
          className="w-full bg-white text-black text-base font-bold py-4 border border-black transition-none hover:bg-black hover:text-white cursor-pointer"
        >
          &gt; export default toX()
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
