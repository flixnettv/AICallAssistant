export const Config = {
  // App settings
  appName: 'Contact Manager Pro',
  version: '1.0.0',
  
  // API endpoints (free services)
  api: {
    callerId: 'https://api.numlookupapi.com/v1/validate',
    spamDetection: 'https://api.spamcheck.net/check',
    reverseLookup: 'https://api.telnyx.com/v2/number_lookup',
  },
  
  // AI voice models (free/open source)
  aiVoices: {
    'young-male': {
      model: 'coqui-tts',
      language: 'en',
      speed: 1.0,
    },
    'young-female': {
      model: 'coqui-tts',
      language: 'en',
      speed: 1.0,
    },
    'elderly-male': {
      model: 'open-tts',
      language: 'en',
      speed: 0.8,
    },
    'deep-scary': {
      model: 'local-tts',
      language: 'en',
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
};