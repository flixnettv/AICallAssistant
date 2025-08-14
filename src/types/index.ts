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
  type: 'young-male' | 'young-female' | 'elderly-male' | 'elderly-female' | 'child-male' | 'child-female' | 'deep-scary';
  language: string;
  modelPath: string;
  previewUrl?: string;
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