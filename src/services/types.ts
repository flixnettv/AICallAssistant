// ========================================
// Service Types
// Common types used across all services
// ========================================

// AI Service Types
export interface AIServiceInterface {
  // Text-to-Speech
  speak(text: string, voice: AIVoice): Promise<void>;
  stopSpeaking(): Promise<void>;
  
  // Speech Recognition
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  onSpeechResult(callback: (text: string) => void): void;
  
  // AI Conversation
  startConversation(context: string, voice: AIVoice): Promise<void>;
  sendMessage(message: string): Promise<string>;
  endConversation(): Promise<void>;
  
  // Voice Management
  getAvailableVoices(): Promise<AIVoice[]>;
  downloadVoice(voice: AIVoice): Promise<void>;
  
  // Call Processing
  processIncomingCall(phoneNumber: string): Promise<{
    callerInfo: string;
    spamRisk: number;
    shouldBlock: boolean;
  }>;
  
  processOutgoingCall(phoneNumber: string, reason: string): Promise<{
    success: boolean;
    message: string;
  }>;
}

// Database Service Types
export interface DatabaseServiceInterface {
  // Database Management
  initialize(): Promise<void>;
  close(): Promise<void>;
  
  // Contact Operations
  createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact>;
  getContact(id: string): Promise<Contact | null>;
  getAllContacts(): Promise<Contact[]>;
  updateContact(contact: Contact): Promise<Contact>;
  deleteContact(id: string): Promise<boolean>;
  searchContacts(query: string): Promise<Contact[]>;
  
  // Call Log Operations
  createCallLog(callLog: Omit<CallLog, 'id'>): Promise<CallLog>;
  getCallLogs(limit?: number): Promise<CallLog[]>;
  getCallLogsByContact(contactId: string): Promise<CallLog[]>;
  deleteCallLog(id: string): Promise<boolean>;
  
  // Message Operations
  createMessage(message: Omit<Message, 'id'>): Promise<Message>;
  getMessages(contactId?: string, limit?: number): Promise<Message[]>;
  markMessageAsRead(id: string): Promise<boolean>;
  deleteMessage(id: string): Promise<boolean>;
  
  // Group Operations
  createGroup(group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group>;
  getGroups(): Promise<Group[]>;
  updateGroup(group: Group): Promise<Group>;
  deleteGroup(id: string): Promise<boolean>;
  addContactToGroup(contactId: string, groupId: string): Promise<boolean>;
  removeContactFromGroup(contactId: string, groupId: string): Promise<boolean>;
  
  // Settings Operations
  getSettings(): Promise<UserSettings>;
  updateSettings(settings: Partial<UserSettings>): Promise<UserSettings>;
  
  // Backup & Sync
  exportData(): Promise<string>;
  importData(data: string): Promise<boolean>;
  syncWithCloud(): Promise<boolean>;
}

// Call Service Types
export interface CallServiceInterface {
  // Call Management
  makeCall(phoneNumber: string, reason?: string): Promise<boolean>;
  answerCall(phoneNumber: string): Promise<boolean>;
  endCall(): Promise<boolean>;
  
  // AI Call Features
  initiateAICall(phoneNumber: string, reason: string, voice: string): Promise<boolean>;
  scheduleAICall(phoneNumber: string, reason: string, voice: string, scheduledTime: Date): Promise<boolean>;
  aiAnswerCall(phoneNumber: string, voice: string): Promise<boolean>;
  
  // Call Recording
  startRecording(): Promise<boolean>;
  stopRecording(): Promise<string | null>;
  isRecording(): boolean;
  
  // Call Information
  getCurrentCall(): CallLog | null;
  getCallHistory(limit?: number): Promise<CallLog[]>;
  getCallHistoryByContact(contactId: string): Promise<CallLog[]>;
  
  // Spam & Security
  blockNumber(phoneNumber: string): Promise<boolean>;
  unblockNumber(phoneNumber: string): Promise<boolean>;
  reportSpam(phoneNumber: string, reason: string): Promise<boolean>;
  isNumberBlocked(phoneNumber: string): Promise<boolean>;
  
  // Caller ID
  lookupCaller(phoneNumber: string): Promise<{
    name: string;
    company?: string;
    location?: string;
    spamRisk: number;
    type: 'personal' | 'business' | 'unknown';
  }>;
}

// Message Service Types
export interface MessageServiceInterface {
  // SMS Operations
  sendSMS(phoneNumber: string, message: string): Promise<boolean>;
  getSMSHistory(phoneNumber?: string, limit?: number): Promise<Message[]>;
  
  // Chat Operations
  sendChatMessage(contactId: string, message: string): Promise<Message>;
  getChatHistory(contactId: string, limit?: number): Promise<Message[]>;
  markMessageAsRead(messageId: string): Promise<boolean>;
  
  // Spam Detection
  detectSpam(message: string): Promise<{
    isSpam: boolean;
    confidence: number;
    reason?: string;
  }>;
  reportSpam(messageId: string, reason: string): Promise<boolean>;
  
  // Message Management
  deleteMessage(messageId: string): Promise<boolean>;
  searchMessages(query: string): Promise<Message[]>;
  getUnreadCount(): Promise<number>;
  
  // Smart Features
  suggestReply(message: string): Promise<string[]>;
  autoCategorize(message: string): Promise<'personal' | 'business' | 'spam' | 'unknown'>;
  translateMessage(message: string, targetLanguage: string): Promise<string>;
}

// Service Configuration Types
export interface ServiceConfig {
  // AI Configuration
  ai: {
    tts: {
      defaultVoice: string;
      fallbackVoice: string;
      maxTextLength: number;
      cacheEnabled: boolean;
      cacheSize: number;
    };
    speechRecognition: {
      language: string;
      continuous: boolean;
      interimResults: boolean;
      maxAlternatives: number;
    };
    localLLM: {
      model: string;
      contextLength: number;
      temperature: number;
      maxTokens: number;
    };
    conversation: {
      maxHistory: number;
      contextWindow: number;
      responseTimeout: number;
    };
  };
  
  // Database Configuration
  database: {
    name: string;
    version: number;
    tables: string[];
    encryptionEnabled: boolean;
    backupEnabled: boolean;
  };
  
  // Call Configuration
  call: {
    recordingEnabled: boolean;
    maxDuration: number;
    quality: string;
    format: string;
    storagePath: string;
  };
  
  // Message Configuration
  message: {
    spamDetectionEnabled: boolean;
    autoCategorization: boolean;
    translationEnabled: boolean;
    maxMessageLength: number;
  };
}

// Service Error Types
export interface ServiceError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Service Response Types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  timestamp: Date;
}

// Service Status Types
export interface ServiceStatus {
  service: string;
  status: 'running' | 'stopped' | 'error' | 'initializing';
  lastCheck: Date;
  uptime: number;
  version: string;
}

// Service Metrics Types
export interface ServiceMetrics {
  service: string;
  requests: number;
  errors: number;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  timestamp: Date;
}

// Import types from main types file
import {
  Contact,
  CallLog,
  Message,
  Group,
  UserSettings,
  AIVoice,
  AICall,
} from '../types';

// Re-export main types
export type {
  Contact,
  CallLog,
  Message,
  Group,
  UserSettings,
  AIVoice,
  AICall,
};