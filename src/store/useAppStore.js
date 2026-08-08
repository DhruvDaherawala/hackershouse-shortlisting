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
      generatedBase64: null,
      generatedDetails: null,
    }),

  setCropMode: (cropMode) => set({ cropMode, generatedBase64: null, generatedDetails: null }),

  setIsProcessingImage: (isProcessingImage) => set({ isProcessingImage }),

  setImageTransform: (transform) =>
    set((state) => ({
      imageTransform: { ...state.imageTransform, ...transform },
      generatedBase64: null,
      generatedDetails: null,
    })),

  resetImageTransform: () =>
    set({
      imageTransform: { zoom: 1, x: 0, y: 0, rotate: 0 },
      generatedBase64: null,
      generatedDetails: null,
    }),

  rotateClockwise: () =>
    set((state) => ({
      imageTransform: {
        ...state.imageTransform,
        rotate: (state.imageTransform.rotate + 90) % 360,
      },
      generatedBase64: null,
      generatedDetails: null,
    })),

  centerImage: () =>
    set((state) => ({
      imageTransform: {
        ...state.imageTransform,
        x: 0,
        y: 0,
      },
      generatedBase64: null,
      generatedDetails: null,
    })),

  setFilterStyle: (filterStyle) =>
    set({
      filterStyle,
      generatedBase64: null,
      generatedDetails: null,
    }),

  // Export & Generated Image State
  exportFileType: 'png', // 'png' | 'jpeg'
  setExportFileType: (exportFileType) => set({ exportFileType, generatedBase64: null, generatedDetails: null }),

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

