import React, { useRef, useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function FormatAFrame() {
  const { uploadedImage, imageTransform, setImageTransform, filterStyle } = useAppStore();
  const photoContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialTransform, setInitialTransform] = useState({ x: 0, y: 0 });
  const [imgAspectRatio, setImgAspectRatio] = useState(1);

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

  // Detect image natural aspect ratio when image loads
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      setImgAspectRatio(naturalWidth / naturalHeight);
    }
  };

  // Compute maximum drag distance (px) allowed without crossing frame boundary
  const calculateDragBounds = () => {
    if (!photoContainerRef.current) return { maxDragX: 0, maxDragY: 0 };
    const rect = photoContainerRef.current.getBoundingClientRect();
    const Wc = rect.width;
    const Hc = rect.height;
    const zoom = imageTransform.zoom || 1;

    let baseW = Wc;
    let baseH = Hc;

    if (imgAspectRatio >= 1) {
      baseW = Wc;
      baseH = Wc / imgAspectRatio;
    } else {
      baseW = Hc * imgAspectRatio;
      baseH = Hc;
    }

    const currentW = baseW * zoom;
    const currentH = baseH * zoom;

    const maxDragX = Math.max(0, (currentW - Wc) / 2);
    const maxDragY = Math.max(0, (currentH - Hc) / 2);

    return { maxDragX, maxDragY };
  };

  // Dynamically clamp image position when zoom level or image aspect ratio changes
  useEffect(() => {
    if (!uploadedImage) return;
    const { maxDragX, maxDragY } = calculateDragBounds();
    const currentX = imageTransform.x || 0;
    const currentY = imageTransform.y || 0;

    const clampedX = Math.max(-maxDragX, Math.min(maxDragX, currentX));
    const clampedY = Math.max(-maxDragY, Math.min(maxDragY, currentY));

    if (clampedX !== currentX || clampedY !== currentY) {
      setImageTransform({ x: clampedX, y: clampedY });
    }
  }, [imageTransform.zoom, imgAspectRatio, uploadedImage]);

  // Initiate drag interaction
  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setInitialTransform({ x: imageTransform.x || 0, y: imageTransform.y || 0 });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isDragging) return;
      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;

      const proposedX = initialTransform.x + deltaX;
      const proposedY = initialTransform.y + deltaY;

      const { maxDragX, maxDragY } = calculateDragBounds();

      const clampedX = Math.max(-maxDragX, Math.min(maxDragX, proposedX));
      const clampedY = Math.max(-maxDragY, Math.min(maxDragY, proposedY));

      setImageTransform({ x: clampedX, y: clampedY });
    };

    const onMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const stopDrag = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', stopDrag);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDrag);
    };
  }, [isDragging, dragStart, initialTransform]);

  return (
    <div
      className="relative w-full h-full bg-white flex items-center justify-center select-none overflow-hidden"
      style={{ aspectRatio: '1 / 1' }}
    >
      {/* Layer 1: User's uploaded photo (strictly clipped inside the inner frame window) */}
      {uploadedImage ? (
        <div
          ref={photoContainerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          title="Drag image to reposition"
          style={{
            position: 'absolute',
            top: '47.5%',
            left: '50%',
            width: '74%',
            height: '74%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
          }}
        >
          <img
            src={uploadedImage}
            alt="User Profile Photo"
            crossOrigin="anonymous"
            draggable={false}
            onLoad={handleImageLoad}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: `translate(${imageTransform.x || 0}px, ${imageTransform.y || 0}px) scale(${imageTransform.zoom || 1})`,
              transformOrigin: 'center center',
              filter: getFilterCSS(filterStyle),
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
            }}
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center text-center text-dark-gray"
          style={{
            position: 'absolute',
            top: '47.5%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <span className="text-3xl mb-2">📷</span>
          <span className="text-sm font-semibold">Upload your photo</span>
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
