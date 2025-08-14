// ========================================
// Services Index
// Export all services for easy importing
// ========================================

// Core Services
export { aiService, type AIServiceInterface } from './aiService';
export { databaseService, type DatabaseServiceInterface } from './databaseService';
export { callService, type CallServiceInterface } from './callService';
export { messageService, type MessageServiceInterface } from './messageService';

// Service Types
export type {
  AIServiceInterface,
  DatabaseServiceInterface,
  CallServiceInterface,
  MessageServiceInterface,
} from './types';

// Service Utilities
export * from './utils';

// Service Constants
export * from './constants';