export interface Contact {
  id: string;
  name: string;
  phoneNumbers: string[];
  emailAddresses: string[];
  addresses: Address[];
  company: string;
  jobTitle: string;
  notes: string;
  groups: string[];
  lastContacted: Date;
  isBlocked: boolean;
  spamRisk: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CallLog {
  id: string;
  contactId?: string;
  phoneNumber: string;
  callType: 'incoming' | 'outgoing' | 'missed';
  duration: number;
  timestamp: Date;
  isRecorded: boolean;
  recordingPath?: string;
  aiTranscription?: string;
  callReason?: string;
  spamScore?: number;
}

export interface AIVoice {
  id: string;
  name: string;
  language: string;
  dialect: string;
  gender: 'male' | 'female';
  age: 'child' | 'young' | 'adult' | 'elder';
  description: string;
  previewUrl: string;
  isLocal: boolean;
  modelPath?: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  emotionSupport: boolean;
  speedControl: boolean;
  pitchControl: boolean;
}

export interface AICall {
  id: string;
  contactId: string;
  phoneNumber: string;
  callReason: string;
  aiVoice: AIVoice;
  scheduledTime?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  transcript?: string;
  recordingPath?: string;
  aiCharacter?: string;
  mood?: string;
  scenario?: string;
}

export interface Message {
  id: string;
  contactId?: string;
  phoneNumber: string;
  type: 'sms' | 'mms';
  content: string;
  timestamp: Date;
  isIncoming: boolean;
  isRead: boolean;
  isSpam: boolean;
  attachments?: string[];
}

export interface Group {
  id: string;
  name: string;
  color: string;
  icon?: string;
  contactIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  language: 'en' | 'ar';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    calls: boolean;
    messages: boolean;
    spam: boolean;
    aiCalls: boolean;
  };
  privacy: {
    callRecording: boolean;
    locationSharing: boolean;
    contactSync: boolean;
  };
  ai: {
    autoAnswer: boolean;
    defaultVoice: string;
    callReasonRequired: boolean;
    autoReplyEnabled: boolean;
    autoReplyDelay: number;
    autoReplyGreeting: string;
    autoReplyFallback: string;
    recordingEnabled: boolean;
    dataSharing: boolean;
    privacyLevel: 'low' | 'medium' | 'high';
  };
}

export interface SpamReport {
  id: string;
  phoneNumber: string;
  reportType: 'call' | 'sms' | 'both';
  reason: string;
  timestamp: Date;
  userCount: number;
}

export interface CallerInfo {
  phoneNumber: string;
  name?: string;
  company?: string;
  location?: string;
  spamScore: number;
  isVerified: boolean;
  lastSeen: Date;
  reportCount: number;
}

// AI Character Types
export interface AICharacter {
  id: string;
  name: string;
  personality: string;
  description: string;
  phrases: string[];
  voice: string;
  mood: 'professional' | 'friendly' | 'casual' | 'formal' | 'emergency' | 'celebratory';
  context: string[];
  greetingStyle: 'formal' | 'casual' | 'friendly' | 'professional';
  responseSpeed: 'slow' | 'normal' | 'fast';
  humorLevel: 'none' | 'low' | 'medium' | 'high';
  empathyLevel: 'low' | 'medium' | 'high';
}

// Call Mood Types
export interface CallMood {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'worried';
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night' | 'weekend' | 'holiday';
  relationship: 'family' | 'friend' | 'colleague' | 'stranger' | 'business';
  suggestedVoice: string;
  suggestedCharacter: string;
  backgroundMusic: string;
  responseStyle: 'formal' | 'casual' | 'friendly' | 'professional' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Call Scenario Types
export interface CallScenario {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'personal' | 'business' | 'emergency' | 'celebration' | 'social' | 'professional';
  script: string[];
  scriptAr: string[];
  voice: string;
  character: string;
  backgroundMusic: string;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'calm' | 'urgent';
  duration: number;
  variables: ScenarioVariable[];
  conditions: ScenarioCondition[];
  tags: string[];
  isActive: boolean;
  usageCount: number;
  successRate: number;
  lastUsed?: Date;
}

export interface ScenarioVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  defaultValue: string;
  description: string;
  isRequired: boolean;
  validation?: RegExp;
}

export interface ScenarioCondition {
  type: 'time' | 'day' | 'weather' | 'relationship' | 'urgency' | 'custom';
  value: any;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range';
  description: string;
}

// Interactive Call Types
export interface InteractiveCall {
  id: string;
  callId: string;
  userId: string;
  contactId: string;
  status: 'active' | 'paused' | 'ended' | 'waiting_response';
  currentDialogue: DialogueState;
  dialogueHistory: DialogueExchange[];
  aiCharacter: AICharacterState;
  userPreferences: UserCallPreferences;
  context: CallContext;
  startTime: Date;
  lastActivity: Date;
  totalDuration: number;
}

export interface DialogueState {
  currentSpeaker: 'ai' | 'user';
  currentEmotion: string;
  currentTopic: string;
  responseExpected: boolean;
  suggestedActions: string[];
}

export interface DialogueExchange {
  id: string;
  timestamp: Date;
  speaker: 'ai' | 'user';
  text: string;
  emotion: string;
  tone: string;
  context: any;
}

export interface AICharacterState {
  characterId: string;
  currentMood: string;
  emotionalState: EmotionalState;
  adaptationLevel: number;
  personalityTraits: Record<string, any>;
}

export interface EmotionalState {
  happiness: number;
  excitement: number;
  concern: number;
  confidence: number;
  empathy: number;
}

export interface UserCallPreferences {
  preferredVoice: string;
  preferredCharacter: string;
  preferredResponseStyle: string;
  preferredCallTimes: string[];
  backgroundMusic: boolean;
  callDuration: number;
}

export interface CallContext {
  timeOfDay: string;
  dayOfWeek: string;
  weather: string;
  location: string;
  relationship: string;
  urgency: string;
  previousCalls: number;
  lastCallDate?: Date;
}