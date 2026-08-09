import html2canvas from 'html2canvas';
import { useAppStore } from '../store/useAppStore';

// Helper canvas context to resolve modern CSS colors (like oklch) to RGB/Hex
const helperCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
const helperCtx = helperCanvas ? helperCanvas.getContext('2d') : null;

function sanitizeOklchColors(str) {
  if (!str || typeof str !== 'string' || !str.includes('oklch')) return str;
  const oklchRegex = /oklch\([^)]+\)/gi;
  return str.replace(oklchRegex, (match) => {
    if (!helperCtx) return match;
    try {
      helperCtx.fillStyle = '#000000';
      helperCtx.fillStyle = match;
      return helperCtx.fillStyle || match;
    } catch (e) {
      return match;
    }
  });
}

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

const loadImage = (src) => {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

/**
 * Native Canvas 2D precision renderer.
 * Ensures 100% pixel-perfect match with the live preview controls:
 * - Exact circle mask alignment & dimensions
 * - Exact zoom & drag offsets
 * - Full native support for CSS color filters (grayscale, contrast, sepia, etc.)
 * - Ultra-high DPI output (1200x1200px)
 */
export const renderCanvas2D = async (element, options = {}) => {
  const fileFormat = options.format || 'png';
  const quality = options.quality !== undefined ? options.quality : 0.95;
  const mimeType = fileFormat === 'jpeg' ? 'image/jpeg' : 'image/png';

  // Read latest application state from store
  const state = useAppStore.getState ? useAppStore.getState() : {};
  const uploadedImage = state.uploadedImage;
  const imageTransform = state.imageTransform || { zoom: 1, x: 0, y: 0 };
  const filterStyle = state.filterStyle || 'none';

  // High DPI output canvas resolution (1200x1200px)
  const S_out = 1200;

  // Measure actual DOM preview element width for exact pixel drag scaling
  let S_dom = 350;
  if (element && element.getBoundingClientRect) {
    const rect = element.getBoundingClientRect();
    if (rect.width > 0) S_dom = rect.width;
  }

  const canvas = document.createElement('canvas');
  canvas.width = S_out;
  canvas.height = S_out;
  const ctx = canvas.getContext('2d');

  // Fill background with white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, S_out, S_out);

  // Load user photo and overlay frame simultaneously
  const [userImg, frameImg] = await Promise.all([
    loadImage(uploadedImage),
    loadImage('/hh-goa-frame.png'),
  ]);

  // Circle mask geometry: top 47.5%, left 50%, width 74%, height 74%
  const cx = S_out * 0.50;
  const cy = S_out * 0.475;
  const D_out = S_out * 0.74;
  const r = D_out / 2;

  if (userImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Apply color filter to Canvas 2D context
    const filterCSS = getFilterCSS(filterStyle);
    if (filterCSS !== 'none') {
      ctx.filter = filterCSS;
    }

    // Scale pixel offsets from preview DOM size to 1200px output canvas
    const scaleRatio = S_out / S_dom;
    const shiftX = (imageTransform.x || 0) * scaleRatio;
    const shiftY = (imageTransform.y || 0) * scaleRatio;

    const imgAspect = userImg.naturalWidth / userImg.naturalHeight;
    let containW = D_out;
    let containH = D_out;

    if (imgAspect >= 1) {
      containW = D_out;
      containH = D_out / imgAspect;
    } else {
      containW = D_out * imgAspect;
      containH = D_out;
    }

    const zoom = imageTransform.zoom || 1;
    const drawW = containW * zoom;
    const drawH = containH * zoom;

    const drawX = (cx + shiftX) - drawW / 2;
    const drawY = (cy + shiftY) - drawH / 2;

    ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  // Draw overlay frame
  if (frameImg) {
    ctx.drawImage(frameImg, 0, 0, S_out, S_out);
  }

  const dataUrl = canvas.toDataURL(mimeType, quality);
  const stringLength = dataUrl.length - `data:${mimeType};base64,`.length;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896;
  const sizeKB = Math.round(sizeInBytes / 1024);

  return {
    dataUrl,
    width: S_out,
    height: S_out,
    sizeKB,
    mimeType,
  };
};

/**
 * Fallback DOM snapshot using html2canvas
 */
const renderHtml2Canvas = async (element, options = {}) => {
  const fileFormat = options.format || 'png';
  const scale = options.scale || 3;
  const quality = options.quality !== undefined ? options.quality : 0.95;
  const mimeType = fileFormat === 'jpeg' ? 'image/jpeg' : 'image/png';

  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FFFFFF',
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      // Sanitize style blocks in cloned document
      const styleTags = clonedDoc.querySelectorAll('style');
      styleTags.forEach((styleTag) => {
        if (styleTag.textContent && styleTag.textContent.includes('oklch')) {
          styleTag.textContent = sanitizeOklchColors(styleTag.textContent);
        }
      });
    },
  });

  const dataUrl = canvas.toDataURL(mimeType, quality);
  const stringLength = dataUrl.length - `data:${mimeType};base64,`.length;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896;
  const sizeKB = Math.round(sizeInBytes / 1024);

  return {
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    sizeKB,
    mimeType,
  };
};

/**
 * Renders target live DOM element / preview state into high-resolution base64 PNG/JPEG
 * @param {HTMLElement} element - Target preview element ref
 * @param {Object} options - { format: 'png' | 'jpeg', scale: 3, quality: 0.95 }
 * @returns {Promise<{ dataUrl: string, width: number, height: number, sizeKB: number, mimeType: string }>}
 */
export const renderComponentToBase64 = async (element, options = {}) => {
  try {
    const result = await renderCanvas2D(element, options);
    if (result && result.dataUrl) {
      return result;
    }
    throw new Error('Canvas2D returned empty result');
  } catch (err) {
    console.warn('Canvas2D render failed, falling back to html2canvas:', err);
    return await renderHtml2Canvas(element, options);
  }
};

/**
 * Triggers browser download for base64 image URL via Blob Object URL.
 * Guarantees proper filename and .png / .jpg extension on all browsers and platforms.
 */
export const downloadBase64Image = (dataUrl, filename) => {
  if (!dataUrl) return;

  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : (filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'image/jpeg' : 'image/png');
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mime });
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.error('Error downloading via Blob URL, falling back to data URL:', err);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Downloads base64 image in specified target format ('png' | 'jpeg')
 */
export const downloadImageInFormat = async (dataUrl, targetFormat = 'png', filenameOverride = null) => {
  if (!dataUrl) return;
  const isJpegTarget = targetFormat === 'jpeg' || targetFormat === 'jpg';
  const ext = isJpegTarget ? 'jpg' : 'png';
  const filename = filenameOverride || `HH_Goa_2026_PFP.${ext}`;
  const targetMime = isJpegTarget ? 'image/jpeg' : 'image/png';
  const currentMime = dataUrl.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';

  if (currentMime === targetMime) {
    downloadBase64Image(dataUrl, filename);
    return;
  }

  try {
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

    const convertedDataUrl = canvas.toDataURL(targetMime, 0.95);
    downloadBase64Image(convertedDataUrl, filename);
  } catch (err) {
    console.error('Error converting format before download:', err);
    downloadBase64Image(dataUrl, filename);
  }
};

/**
 * Best Pre-set Caption for X (Twitter)
 */
export const DEFAULT_SHARE_CAPTION = `🚀 Ready to build in paradise! Just generated my candidate profile picture for Hackers House Goa 2026 🌴💻✨\n\nSee you in Goa! 🌊🦀 #FrameInGoa #HHGoa2026 #HackersHouseGoa #BuildInGoa`;

/**
 * Convert a base64 data URL to a Blob
 */
export function dataUrlToBlob(dataUrl) {
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
export function dataUrlToFile(dataUrl, fileName) {
  const blob = dataUrlToBlob(dataUrl);
  if (!blob) return null;
  return new File([blob], fileName, { type: blob.type });
}

/**
 * Convert a base64 data URL to a PNG blob and copy to system clipboard
 */
export async function copyImageToClipboard(dataUrl) {
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

/**
 * Executes Share to X:
 * - Mobile: Uses Web Share API (opens native X app directly with pre-set caption and image attached)
 * - Desktop: Opens new tab to X with pre-set caption + auto copies image to clipboard (or downloads)
 */
export async function executeShareToX({ dataUrl, exportFileType = 'png', caption = DEFAULT_SHARE_CAPTION, onToast }) {
  if (!dataUrl) return false;

  const ext = exportFileType === 'jpeg' ? 'jpg' : 'png';
  const fileName = `HH_Goa_2026_PFP.${ext}`;

  // Strategy 1: Web Share API with file support (Mobile application direct share)
  if (navigator.share && navigator.canShare) {
    const file = dataUrlToFile(dataUrl, fileName);
    if (file) {
      const shareData = {
        text: caption,
        files: [file],
      };

      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          if (onToast) onToast('shared');
          return true;
        } catch (shareErr) {
          if (shareErr.name === 'AbortError') {
            return false;
          }
          console.warn('Web Share failed, using desktop fallback:', shareErr);
        }
      }
    }
  }

  // Strategy 2: Desktop / Web — Open X intent in a new tab + copy image to clipboard
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;

  // Open X compose window in a new tab immediately
  const xWindow = window.open(tweetUrl, '_blank', 'noopener,noreferrer');

  // Copy image to clipboard so user can press Ctrl+V / ⌘+V directly into X
  const copied = await copyImageToClipboard(dataUrl);

  if (copied) {
    if (onToast) onToast('copied');
  } else {
    // If clipboard copy fails or is unsupported, download image automatically
    downloadBase64Image(dataUrl, fileName);
    if (onToast) onToast('downloading');
  }

  if (xWindow) {
    xWindow.focus();
  }

  return true;
}





