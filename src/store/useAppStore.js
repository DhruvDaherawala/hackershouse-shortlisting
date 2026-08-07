import { create } from 'zustand';
import { getRandomTitle } from '../utils/titleGenerator';

export const useAppStore = create((set) => ({
  // Formats: 'PFP' (Format A: Profile Picture) | 'ID_CARD' (Format B: Builder ID Badge)
  format: 'ID_CARD',
  setFormat: (format) => set({ format }),

  // Image state
  uploadedImage: null,
  imageName: '',
  isProcessingImage: false,
  imageTransform: {
    zoom: 1,
    x: 0,
    y: 0,
    rotate: 0,
  },

  setUploadedImage: (imageUrl, imageName = '') =>
    set({
      uploadedImage: imageUrl,
      imageName: imageName,
      imageTransform: { zoom: 1, x: 0, y: 0, rotate: 0 },
    }),

  setIsProcessingImage: (isProcessingImage) => set({ isProcessingImage }),

  setImageTransform: (transform) =>
    set((state) => ({
      imageTransform: { ...state.imageTransform, ...transform },
    })),

  resetImageTransform: () =>
    set({ imageTransform: { zoom: 1, x: 0, y: 0, rotate: 0 } }),

  // User fields (Format B & PFP details)
  userName: 'Alex Rivera',
  setUserName: (userName) => set({ userName }),

  stackRole: 'Full-Stack',
  setStackRole: (stackRole) => set({ stackRole }),

  builderTitle: 'Chief Prompt Officer',
  setBuilderTitle: (builderTitle) => set({ builderTitle }),
  generateRandomTitle: () => set({ builderTitle: getRandomTitle() }),

  // Theme variant
  themeColor: 'cyan', // 'cyan' | 'pink' | 'emerald' | 'gold'
  setThemeColor: (themeColor) => set({ themeColor }),

  // Badge details
  badgeNumber: `HHG-2026-${Math.floor(1000 + Math.random() * 9000)}`,

  // Sample demo photo preset for instant preview
  loadDemoPhoto: () => {
    // High quality sample avatar SVG string converted to data URL
    const demoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="50%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#311042"/>
        </linearGradient>
        <linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#ff007f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <circle cx="200" cy="160" r="70" fill="#1e293b" stroke="url(#neon)" stroke-width="4"/>
      <path d="M100,340 C100,240 300,240 300,340" fill="#1e293b" stroke="url(#neon)" stroke-width="4"/>
      <circle cx="200" cy="150" r="45" fill="#334155"/>
      <polygon points="200,80 230,130 170,130" fill="#00f0ff" opacity="0.6"/>
      <text x="200" y="380" font-family="sans-serif" font-size="16" fill="#00f0ff" text-anchor="middle" font-weight="bold">SAMPLE BUILDER</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(demoSvg)}`;
    set({ uploadedImage: dataUrl, imageName: 'demo_builder.svg' });
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
      imageTransform: { zoom: 1, x: 0, y: 0, rotate: 0 },
      userName: '',
      stackRole: 'Fullstack Dev',
      builderTitle: getRandomTitle(),
      generatedBase64: null,
      generatedDetails: null,
    }),
}));

