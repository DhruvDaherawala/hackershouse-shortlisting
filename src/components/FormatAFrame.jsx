import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function FormatAFrame() {
  const { uploadedImage, imageTransform, filterStyle, cropMode } = useAppStore();

  const getFilterCSS = (style) => {
    switch (style) {
      case 'grayscale':
        return 'grayscale(100%)';
      case 'contrast':
        return 'contrast(135%) brightness(105%)';
      case 'warm':
        return 'sepia(45%) contrast(110%)';
      case 'cool':
        return 'hue-rotate(180deg) contrast(110%)';
      case 'vintage':
        return 'sepia(65%) contrast(120%) brightness(90%)';
      default:
        return 'none';
    }
  };

  // Determine styling based on cropMode preference
  const getImageStyling = () => {
    switch (cropMode) {
      case 'square':
        return {
          width: '85%',
          height: '85%',
          objectFit: 'cover',
          borderRadius: '0%',
        };
      case 'circle':
        return {
          width: '75%',
          height: '75%',
          objectFit: 'cover',
          borderRadius: '50%',
        };
      case 'original':
      default:
        return {
          width: '90%',
          height: '90%',
          objectFit: 'contain',
          borderRadius: '0%',
        };
    }
  };

  const modeStyle = getImageStyling();

  return (
    <div
      className="relative w-full h-full bg-white flex items-center justify-center select-none overflow-hidden"
      style={{ aspectRatio: '1 / 1' }}
    >
      {/* Layer 1: User's uploaded photo (behind frame) */}
      {uploadedImage ? (
        <img
          src={uploadedImage}
          alt="User Profile Photo"
          crossOrigin="anonymous"
          draggable={false}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: modeStyle.width,
            height: modeStyle.height,
            objectFit: modeStyle.objectFit,
            borderRadius: modeStyle.borderRadius,
            transform: `translate(-50%, -50%) scale(${imageTransform.zoom}) translate(${imageTransform.x}px, ${imageTransform.y}px) rotate(${imageTransform.rotate}deg)`,
            transformOrigin: 'center center',
            filter: getFilterCSS(filterStyle),
            zIndex: 1,
          }}
        />
      ) : (
        <div
          className="flex flex-col items-center justify-center text-center text-dark-gray font-mono"
          style={{
            position: 'absolute',
            zIndex: 1,
          }}
        >
          <span className="text-lg font-bold mb-1">// NO_PHOTO</span>
          <span className="text-[10px]">&gt; Upload your profile pic</span>
        </div>
      )}

      {/* Layer 2: Transparent frame overlay (on top) */}
      <img
        src="/hh-goa-frame.png"
        alt="Hacker House Goa 2026 Frame"
        crossOrigin="anonymous"
        draggable={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
