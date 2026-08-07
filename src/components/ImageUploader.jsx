import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '../store/useAppStore';
import { processImageFile } from '../utils/heicHelper';
import { UploadCloud, Image as ImageIcon, Loader2, Sparkles, X } from 'lucide-react';

export default function ImageUploader() {
  const {
    uploadedImage,
    imageName,
    setUploadedImage,
    isProcessingImage,
    setIsProcessingImage,
    loadDemoPhoto,
    resetImageTransform,
  } = useAppStore();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      setIsProcessingImage(true);
      try {
        const dataUrl = await processImageFile(file);
        setUploadedImage(dataUrl, file.name);
      } catch (err) {
        alert(err.message || 'Error processing image file.');
      } finally {
        setIsProcessingImage(false);
      }
    },
    [setUploadedImage, setIsProcessingImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    multiple: false,
  });

  const removePhoto = (e) => {
    e.stopPropagation();
    setUploadedImage(null, '');
    resetImageTransform();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Upload Photo (JPG, PNG, HEIC)
        </label>
        {!uploadedImage && (
          <button
            type="button"
            onClick={loadDemoPhoto}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" /> Try Sample Avatar
          </button>
        )}
      </div>

      {uploadedImage ? (
        <div className="relative p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between group">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={uploadedImage}
              alt="Uploaded Preview"
              className="w-12 h-12 object-cover rounded-lg border border-cyan-500/30 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate max-w-[180px]">
                {imageName || 'Uploaded_Photo.jpg'}
              </p>
              <p className="text-xs text-emerald-400 font-mono">Ready to process</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div {...getRootProps()} className="cursor-pointer text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
              <input {...getInputProps()} />
              Change
            </div>
            <button
              onClick={removePhoto}
              title="Remove photo"
              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60'
          }`}
        >
          <input {...getInputProps()} />
          
          {isProcessingImage ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-xs font-mono text-cyan-300">Processing photo (Converting HEIC/JPEG)...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Drop your photo here, or <span className="text-cyan-400 hover:underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Supports portrait, landscape & iPhone HEIC formats
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
