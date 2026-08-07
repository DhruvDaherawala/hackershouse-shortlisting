import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '../store/useAppStore';
import { processImageFile } from '../utils/heicHelper';

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
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <label className="text-xs text-dark-gray uppercase font-light">
          // Profile Photo Payload Upload:
        </label>
        {!uploadedImage && (
          <button
            type="button"
            onClick={loadDemoPhoto}
            className="text-xs text-black font-bold hover:underline cursor-pointer"
          >
            &gt; try.sampleAvatar()
          </button>
        )}
      </div>

      {uploadedImage ? (
        <div className="p-4 border border-black bg-white flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={uploadedImage}
              alt="Uploaded Preview"
              className="w-12 h-12 object-cover border border-black"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-black truncate max-w-[180px]">
                import &#123; profile_photo &#125; from './local';
              </p>
              <p className="text-[10px] text-dark-gray truncate">
                {imageName || 'profile_payload.png'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              {...getRootProps()}
              className="cursor-pointer text-xs px-3 py-1.5 border border-black text-black hover:bg-black hover:text-white transition-none"
            >
              <input {...getInputProps()} />
              Replace
            </div>
            <button
              type="button"
              onClick={removePhoto}
              title="Remove photo"
              className="text-xs px-3 py-1.5 border border-black text-black hover:bg-black hover:text-white transition-none cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`p-8 border border-black text-center cursor-pointer transition-none bg-white hover:bg-black hover:text-white group ${
            isDragActive ? 'bg-black text-white' : ''
          }`}
        >
          <input {...getInputProps()} />

          {isProcessingImage ? (
            <div className="py-4 text-sm font-bold animate-pulse">
              &gt; PROCESSING_PAYLOAD...
            </div>
          ) : (
            <div className="py-2 space-y-2">
              <p className="text-sm font-bold">
                // Drop profile photo here or click to upload
              </p>
              <p className="text-xs opacity-70">
                Supports JPG, PNG, WEBP, HEIC (Auto-converted in browser)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
