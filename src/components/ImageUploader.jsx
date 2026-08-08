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
        <label className="form-label !mb-0">
          Builder Photo
        </label>
      </div>

      {uploadedImage ? (
        <div className="p-4 bg-cream rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={uploadedImage}
              alt="Uploaded Preview"
              className="w-12 h-12 object-contain rounded-lg border border-dark-green/10 bg-cream-dark/20"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-dark-green truncate max-w-[180px]">
                Photo uploaded ✓
              </p>
              <p className="text-[11px] text-dark-gray truncate">
                {imageName || 'profile_photo.png'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              {...getRootProps()}
              className="cursor-pointer text-xs px-3 py-2 bg-dark-green text-cream font-semibold rounded-lg hover:bg-dark-green/80 transition-colors"
            >
              <input {...getInputProps()} />
              Replace
            </div>
            <button
              type="button"
              onClick={removePhoto}
              title="Remove photo"
              className="text-xs px-3 py-2 bg-white text-dark-green font-semibold border border-dark-green/20 rounded-lg hover:bg-pink hover:text-white hover:border-pink transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`photo-dropzone flex flex-col items-center gap-3 ${
            isDragActive ? 'active' : ''
          }`}
        >
          <input {...getInputProps()} />

          {isProcessingImage ? (
            <div className="py-4 text-sm font-bold text-dark-green animate-pulse">
              ⏳ Processing your photo...
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-dark-green/10 flex items-center justify-center text-xl">
                ⬆️
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-bold text-dark-green">
                  Drop your photo here or click to browse
                </p>
                <p className="text-xs text-dark-gray">
                  JPG, PNG, WEBP or HEIC • Max 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
