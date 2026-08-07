import html2canvas from 'html2canvas';

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

/**
 * Prepares cloned DOM elements prior to html2canvas snapshot.
 * - Replaces oklch color functions in style tags & inline styles (fixes html2canvas parsing crash)
 * - Preserves image aspect ratio & cross-origin safety
 * - Fixes glassmorphism/backdrop-blur opacity rendering fallbacks
 */
const prepareClonedElement = (clonedDoc, originalElement) => {
  if (!originalElement || !clonedDoc) return;

  // 1. Sanitize all <style> blocks in cloned document
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    if (styleTag.textContent && styleTag.textContent.includes('oklch')) {
      styleTag.textContent = sanitizeOklchColors(styleTag.textContent);
    }
  });

  // 2. Sanitize inline styles & CSS variables on all cloned elements
  const allClonedEls = clonedDoc.querySelectorAll('*');
  allClonedEls.forEach((el) => {
    const styleAttr = el.getAttribute('style');
    if (styleAttr && styleAttr.includes('oklch')) {
      el.setAttribute('style', sanitizeOklchColors(styleAttr));
    }
  });

  // 3. Handle images: enable crossOrigin for safe rendering
  const originalImgs = originalElement.querySelectorAll('img');
  const clonedImgs = clonedDoc.querySelectorAll('img');

  originalImgs.forEach((origImg, index) => {
    const clonedImg = clonedImgs[index];
    if (!clonedImg) return;
    clonedImg.crossOrigin = 'anonymous';
  });

  // 4. Ensure backdrop-blur overlay elements maintain strong opacity contrast on canvas
  const backdropEls = clonedDoc.querySelectorAll('.backdrop-blur-md, .backdrop-blur-sm, .backdrop-blur-lg');
  backdropEls.forEach((el) => {
    const compStyle = clonedDoc.defaultView?.getComputedStyle(el);
    if (!compStyle?.backgroundColor || compStyle.backgroundColor === 'rgba(0, 0, 0, 0)') {
      el.style.backgroundColor = 'rgba(2, 6, 23, 0.94)';
    }
  });
};

/**
 * Renders target live DOM element into high-resolution base64 PNG/JPEG
 * @param {HTMLElement} element - Target preview element ref
 * @param {Object} options - { format: 'png' | 'jpeg', scale: 3, quality: 0.95 }
 * @returns {Promise<{ dataUrl: string, width: number, height: number, sizeKB: number, mimeType: string }>}
 */
export const renderComponentToBase64 = async (element, options = {}) => {
  if (!element) throw new Error('Target preview component element not found');

  const fileFormat = options.format || 'png';
  const scale = options.scale || 3;
  const quality = options.quality !== undefined ? options.quality : 0.95;
  const mimeType = fileFormat === 'jpeg' ? 'image/jpeg' : 'image/png';

  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#020617',
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      prepareClonedElement(clonedDoc, element);
    },
  });

  const dataUrl = canvas.toDataURL(mimeType, quality);
  
  // Calculate size in KB
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
 * Triggers browser download for base64 image URL
 */
export const downloadBase64Image = (dataUrl, filename) => {
  if (!dataUrl) return;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

