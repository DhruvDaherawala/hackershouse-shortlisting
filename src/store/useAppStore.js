import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Active Navigation View Tab: 'landing' | 'create' | 'preview' | 'success'
  activeTab: 'create',
  setActiveTab: (activeTab) => set({ activeTab }),

  // Image state
  uploadedImage: null,
  imageName: '',
  isProcessingImage: false,
  cropMode: 'original', // 'original' (No Auto Crop) | 'square' (Fit Square) | 'circle' (Circle Avatar)
  imageTransform: {
    zoom: 1,
    x: 0,
    y: 0,
    rotate: 0,
  },
  filterStyle: 'none',

  setUploadedImage: (imageUrl, imageName = '') =>
    set({
      uploadedImage: imageUrl,
      imageName: imageName,
      cropMode: 'original',
      imageTransform: { zoom: 1, x: 0, y: 0, rotate: 0 },
      filterStyle: 'none',
    }),

  setCropMode: (cropMode) => set({ cropMode }),

  setIsProcessingImage: (isProcessingImage) => set({ isProcessingImage }),

  setImageTransform: (transform) =>
    set((state) => ({
      imageTransform: { ...state.imageTransform, ...transform },
    })),

  resetImageTransform: () =>
    set({ imageTransform: { zoom: 1, x: 0, y: 0, rotate: 0 } }),

  rotateClockwise: () =>
    set((state) => ({
      imageTransform: {
        ...state.imageTransform,
        rotate: (state.imageTransform.rotate + 90) % 360,
      },
    })),

  centerImage: () =>
    set((state) => ({
      imageTransform: {
        ...state.imageTransform,
        x: 0,
        y: 0,
      },
    })),

  setFilterStyle: (filterStyle) => set({ filterStyle }),

  // Sample demo photo preset for instant preview
  loadDemoPhoto: () => {
    // High contrast black-and-white minimalist avatar
    const demoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#000000"/>
      <circle cx="200" cy="160" r="70" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
      <path d="M100,340 C100,240 300,240 300,340" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
      <circle cx="200" cy="150" r="45" fill="#000000"/>
      <polygon points="200,80 230,130 170,130" fill="#FFFFFF"/>
      <text x="200" y="380" font-family="monospace" font-size="16" fill="#FFFFFF" text-anchor="middle" font-weight="bold">&gt; HH_GOA_2026</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(demoSvg)}`;
    set({ uploadedImage: dataUrl, imageName: 'sample_avatar.svg', cropMode: 'original', filterStyle: 'none' });
  },

  // Export & Generated Image State
  exportFileType: 'png', // 'png' | 'jpeg'
  setExportFileType: (exportFileType) => set({ exportFileType }),

  generatedBase64: null,
  generatedDetails: null, // { width, height, sizeKB }
  setGeneratedData: (dataUrl, details) =>
    set({ generatedBase64: dataUrl, generatedDetails: details }),
  clearGenerated: () => set({ generatedBase64: null, generatedDetails: null }),

  // Reset entire form
  resetAll: () =>
    set({
      uploadedImage: null,
      imageName: '',
      cropMode: 'original',
      imageTransform: { zoom: 1, x: 0, y: 0, rotate: 0 },
      filterStyle: 'none',
      generatedBase64: null,
      generatedDetails: null,
    }),
}));
