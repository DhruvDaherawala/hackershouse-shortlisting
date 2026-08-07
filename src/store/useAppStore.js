import { create } from 'zustand';
import { getRandomTitle } from '../utils/titleGenerator';

export const useAppStore = create((set) => ({
  // Active Navigation View Tab: 'landing' | 'create' | 'preview' | 'success'
  activeTab: 'create',
  setActiveTab: (activeTab) => set({ activeTab }),

  // Graphic Format: 'PFP' (Format A: Profile Picture) | 'ID_CARD' (Format B: Builder ID Badge)
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

  // User fields (Brutalist Form)
  userName: 'NEO_CODER',
  setUserName: (userName) => set({ userName }),

  githubHandle: 'johndoe_dev',
  setGithubHandle: (githubHandle) => set({ githubHandle }),

  stackRole: 'Fullstack',
  setStackRole: (stackRole) => set({ stackRole }),

  preferredStack: "'React', 'Node', 'Python'",
  setPreferredStack: (preferredStack) => set({ preferredStack }),

  builderTitle: 'SYS.ARCHITECT',
  setBuilderTitle: (builderTitle) => set({ builderTitle }),
  generateRandomTitle: () => set({ builderTitle: getRandomTitle() }),

  // Badge ID Number
  badgeNumber: '#0X9F3A',

  // Sample demo photo preset for instant preview
  loadDemoPhoto: () => {
    // High contrast black-and-white minimalist avatar
    const demoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#000000"/>
      <circle cx="200" cy="160" r="70" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
      <path d="M100,340 C100,240 300,240 300,340" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
      <circle cx="200" cy="150" r="45" fill="#000000"/>
      <polygon points="200,80 230,130 170,130" fill="#FFFFFF"/>
      <text x="200" y="380" font-family="monospace" font-size="16" fill="#FFFFFF" text-anchor="middle" font-weight="bold">> NEO_CODER</text>
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
      userName: 'NEO_CODER',
      githubHandle: 'johndoe_dev',
      stackRole: 'Fullstack',
      preferredStack: "'React', 'Node', 'Python'",
      builderTitle: 'SYS.ARCHITECT',
      generatedBase64: null,
      generatedDetails: null,
    }),
}));
