export const Config = {
  // App settings
  appName: 'Contact Manager Pro',
  version: '1.0.0',

  // API endpoints (free services)
  api: {
    callerId: 'https://api.numlookupapi.com/v1/validate',
    spamDetection: 'https://api.spamcheck.net/check',
    reverseLookup: 'https://api.telnyx.com/v2/number_lookup',
    
    // AI Services
    coquiTTS: 'http://localhost:5002',
    openTTS: 'http://localhost:5003',
    localLLM: 'http://localhost:11434',
    speechRecognition: 'http://localhost:5004',
    aiConversation: 'http://localhost:5005',
    spamDetection: 'http://localhost:5006',
    callerID: 'http://localhost:5007',
  },

  // AI voice models (free/open source)
  aiVoices: {
    'young-male': {
      model: 'coqui-tts',
      language: 'ar',
      speed: 1.0,
    },
    'young-female': {
      model: 'coqui-tts',
      language: 'ar',
      speed: 1.0,
    },
    'elderly-male': {
      model: 'open-tts',
      language: 'ar',
      speed: 0.8,
    },
    'elderly-female': {
      model: 'open-tts',
      language: 'ar',
      speed: 0.8,
    },
    'child-male': {
      model: 'local-tts',
      language: 'ar',
      speed: 1.2,
    },
    'child-female': {
      model: 'local-tts',
      language: 'ar',
      speed: 1.2,
    },
    'deep-scary': {
      model: 'local-tts',
      language: 'ar',
      speed: 0.7,
    },
  },

  // Database settings
  database: {
    name: 'ContactManager.db',
    version: 1,
    tables: ['contacts', 'calls', 'messages', 'groups', 'settings'],
  },

  // Permissions
  permissions: {
    contacts: 'android.permission.READ_CONTACTS',
    phone: 'android.permission.CALL_PHONE',
    microphone: 'android.permission.RECORD_AUDIO',
    storage: 'android.permission.WRITE_EXTERNAL_STORAGE',
    camera: 'android.permission.CAMERA',
    location: 'android.permission.ACCESS_FINE_LOCATION',
  },

  // Call recording settings
  recording: {
    maxDuration: 300, // 5 minutes
    quality: 'high',
    format: 'mp4',
    storagePath: '/storage/emulated/0/ContactManager/Recordings/',
  },

  // Spam detection
  spam: {
    threshold: 0.7,
    autoBlock: true,
    reportThreshold: 5,
  },

  // UI settings
  ui: {
    animationDuration: 300,
    debounceDelay: 500,
    refreshInterval: 30000,
  },

  // AI Settings
  ai: {
    // Text-to-Speech
    tts: {
      defaultVoice: 'young-male',
      fallbackVoice: 'young-female',
      maxTextLength: 1000,
      cacheEnabled: true,
      cacheSize: 100, // MB
    },
    
    // Speech Recognition
    speechRecognition: {
      language: 'ar',
      continuous: false,
      interimResults: true,
      maxAlternatives: 3,
    },
    
    // Local LLM
    localLLM: {
      model: 'llama2:7b',
      contextLength: 4096,
      temperature: 0.7,
      maxTokens: 512,
    },
    
    // Conversation AI
    conversation: {
      maxHistory: 10,
      contextWindow: 5,
      responseTimeout: 30000, // 30 seconds
    },
  },

  // Firebase Configuration
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || 'your_api_key_here',
    projectId: process.env.FIREBASE_PROJECT_ID || 'your_project_id_here',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your_sender_id_here',
    appId: process.env.FIREBASE_APP_ID || 'your_app_id_here',
  },

  // Security & Privacy
  security: {
    encryptionEnabled: true,
    biometricAuth: false,
    autoLockTimeout: 300000, // 5 minutes
    maxLoginAttempts: 5,
    sessionTimeout: 3600000, // 1 hour
  },

  // Backup & Sync
  backup: {
    autoBackup: true,
    backupInterval: 86400000, // 24 hours
    maxBackups: 10,
    cloudSync: true,
    syncInterval: 3600000, // 1 hour
  },

  // Notifications
  notifications: {
    calls: true,
    messages: true,
    spam: true,
    aiCalls: true,
    reminders: true,
    updates: false,
  },

  // Localization
  localization: {
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
    rtlSupport: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
  },

  // Performance
  performance: {
    imageCacheSize: 100, // MB
    databaseCacheSize: 50, // MB
    maxConcurrentRequests: 5,
    requestTimeout: 30000, // 30 seconds
  },

  // Development
  development: {
    debugMode: __DEV__,
    logLevel: __DEV__ ? 'debug' : 'error',
    enableAnalytics: !__DEV__,
    enableCrashReporting: !__DEV__,
  },
};