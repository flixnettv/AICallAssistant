// ========================================
// Agent Constants
// Configuration constants for all agents
// ========================================

// Agent Types
export const AGENT_TYPES = {
  MASTER: 'master',
  CALL: 'call',
  MESSAGE: 'message',
  CONTACT: 'contact',
  SECURITY: 'security',
  BACKUP: 'backup',
  AI: 'ai',
  INTEGRATION: 'integration',
  ANALYTICS: 'analytics',
} as const;

// Agent Status
export const AGENT_STATUS = {
  STOPPED: 'stopped',
  INITIALIZING: 'initializing',
  RUNNING: 'running',
  PAUSED: 'paused',
  ERROR: 'error',
  RESTARTING: 'restarting',
} as const;

// Task Priorities
export const TASK_PRIORITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// Task Types
export const TASK_TYPES = {
  EMERGENCY: 'emergency',
  SECURITY: 'security',
  SYSTEM: 'system',
  USER: 'user',
  MAINTENANCE: 'maintenance',
  WORKFLOW: 'workflow',
  BACKUP: 'backup',
  AI: 'ai',
  ANALYTICS: 'analytics',
} as const;

// Task Status
export const TASK_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  TIMEOUT: 'timeout',
} as const;

// System Health Levels
export const SYSTEM_HEALTH = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  CRITICAL: 'critical',
} as const;

// Alert Severities
export const ALERT_SEVERITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
} as const;

// Time Ranges
export const TIME_RANGES = {
  LAST_HOUR: '1h',
  LAST_DAY: '24h',
  LAST_WEEK: '7d',
  LAST_MONTH: '30d',
  LAST_YEAR: '1y',
  ALL_TIME: 'all',
} as const;

// Data Formats
export const DATA_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  XML: 'xml',
  YAML: 'yaml',
} as const;

// Report Types
export const REPORT_TYPES = {
  SYSTEM_OVERVIEW: 'system_overview',
  PERFORMANCE_SUMMARY: 'performance_summary',
  USER_ACTIVITY: 'user_activity',
  SECURITY_ANALYSIS: 'security_analysis',
  AI_PERFORMANCE: 'ai_performance',
  CONTACT_ANALYTICS: 'contact_analytics',
  COMMUNICATION_SUMMARY: 'communication_summary',
} as const;

// Dashboard Layouts
export const DASHBOARD_LAYOUTS = {
  GRID: 'grid',
  CHARTS: 'charts',
  TABS: 'tabs',
  LIST: 'list',
  CUSTOM: 'custom',
} as const;

// Optimization Types
export const OPTIMIZATION_TYPES = {
  PERFORMANCE: 'performance',
  MEMORY: 'memory',
  WORKFLOWS: 'workflows',
  AGENTS: 'agents',
  SYSTEM: 'system',
} as const;

// Scaling Types
export const SCALING_TYPES = {
  UP: 'up',
  DOWN: 'down',
  AUTO: 'auto',
} as const;

// Workflow Status
export const WORKFLOW_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PAUSED: 'paused',
} as const;

// Backup Types
export const BACKUP_TYPES = {
  FULL: 'full',
  INCREMENTAL: 'incremental',
  SELECTIVE: 'selective',
  DIFFERENTIAL: 'differential',
} as const;

// AI Model Types
export const AI_MODEL_TYPES = {
  SPEECH_RECOGNITION: 'speech_recognition',
  TEXT_TO_SPEECH: 'text_to_speech',
  NATURAL_LANGUAGE_PROCESSING: 'nlp',
  MACHINE_LEARNING: 'ml',
  COMPUTER_VISION: 'computer_vision',
} as const;

// Security Threat Types
export const SECURITY_THREAT_TYPES = {
  SPAM: 'spam',
  PHISHING: 'phishing',
  MALWARE: 'malware',
  DATA_BREACH: 'data_breach',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  DENIAL_OF_SERVICE: 'dos',
} as const;

// Contact Categories
export const CONTACT_CATEGORIES = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
  FAMILY: 'family',
  FRIENDS: 'friends',
  WORK: 'work',
  EMERGENCY: 'emergency',
} as const;

// Message Categories
export const MESSAGE_CATEGORIES = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
  SPAM: 'spam',
  IMPORTANT: 'important',
  URGENT: 'urgent',
  INFORMATIONAL: 'informational',
} as const;

// Call Types
export const CALL_TYPES = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
  MISSED: 'missed',
  REJECTED: 'rejected',
  VOICEMAIL: 'voicemail',
} as const;

// Default Configuration Values
export const DEFAULT_CONFIG = {
  // Agent Configuration
  AGENT_HEARTBEAT_INTERVAL: 30000, // 30 seconds
  AGENT_TIMEOUT: 60000, // 1 minute
  AGENT_MAX_RETRIES: 3,
  
  // Task Configuration
  TASK_TIMEOUT: 300000, // 5 minutes
  TASK_MAX_QUEUE_SIZE: 1000,
  TASK_PRIORITY_WEIGHTS: {
    CRITICAL: 100,
    HIGH: 75,
    MEDIUM: 50,
    LOW: 25,
  },
  
  // Performance Configuration
  PERFORMANCE_MONITORING_INTERVAL: 60000, // 1 minute
  PERFORMANCE_HISTORY_SIZE: 1000,
  PERFORMANCE_THRESHOLDS: {
    CPU_HIGH: 80,
    CPU_CRITICAL: 90,
    MEMORY_HIGH: 80,
    MEMORY_CRITICAL: 90,
    RESPONSE_TIME_HIGH: 1000,
    ERROR_RATE_HIGH: 0.1,
  },
  
  // Security Configuration
  SECURITY_SCAN_INTERVAL: 300000, // 5 minutes
  SECURITY_THREAT_THRESHOLD: 5,
  SECURITY_BLOCK_DURATION: 86400000, // 24 hours
  
  // Backup Configuration
  BACKUP_INTERVAL: 86400000, // 24 hours
  BACKUP_RETENTION_DAYS: 30,
  BACKUP_MAX_SIZE: 1024 * 1024 * 1024, // 1GB
  
  // AI Configuration
  AI_MODEL_UPDATE_INTERVAL: 604800000, // 7 days
  AI_CONVERSATION_TIMEOUT: 300000, // 5 minutes
  AI_MAX_CONVERSATIONS: 100,
  
  // Analytics Configuration
  ANALYTICS_COLLECTION_INTERVAL: 60000, // 1 minute
  ANALYTICS_RETENTION_DAYS: 90,
  ANALYTICS_MAX_INSIGHTS: 10000,
  
  // Integration Configuration
  INTEGRATION_SYNC_INTERVAL: 300000, // 5 minutes
  INTEGRATION_MAX_WORKFLOWS: 50,
  INTEGRATION_TIMEOUT: 120000, // 2 minutes
  
  // System Configuration
  SYSTEM_HEALTH_CHECK_INTERVAL: 60000, // 1 minute
  SYSTEM_ALERT_COOLDOWN: 300000, // 5 minutes
  SYSTEM_MAX_ALERTS: 1000,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AGENT_NOT_FOUND: 'Agent not found',
  AGENT_ALREADY_RUNNING: 'Agent is already running',
  AGENT_NOT_RUNNING: 'Agent is not running',
  TASK_NOT_FOUND: 'Task not found',
  TASK_ALREADY_RUNNING: 'Task is already running',
  TASK_TIMEOUT: 'Task execution timed out',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  INVALID_CONFIGURATION: 'Invalid configuration',
  RESOURCE_UNAVAILABLE: 'Resource unavailable',
  NETWORK_ERROR: 'Network error occurred',
  DATABASE_ERROR: 'Database error occurred',
  VALIDATION_ERROR: 'Validation error',
  UNKNOWN_ERROR: 'Unknown error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AGENT_STARTED: 'Agent started successfully',
  AGENT_STOPPED: 'Agent stopped successfully',
  AGENT_RESTARTED: 'Agent restarted successfully',
  TASK_COMPLETED: 'Task completed successfully',
  TASK_CANCELLED: 'Task cancelled successfully',
  CONFIGURATION_UPDATED: 'Configuration updated successfully',
  BACKUP_CREATED: 'Backup created successfully',
  BACKUP_RESTORED: 'Backup restored successfully',
  SECURITY_UPDATED: 'Security settings updated successfully',
  AI_MODEL_TRAINED: 'AI model trained successfully',
  ANALYTICS_GENERATED: 'Analytics generated successfully',
  INTEGRATION_COMPLETED: 'Integration completed successfully',
} as const;

// Log Levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace',
} as const;

// Metrics Names
export const METRIC_NAMES = {
  // System Metrics
  CPU_USAGE: 'cpu_usage',
  MEMORY_USAGE: 'memory_usage',
  DISK_USAGE: 'disk_usage',
  NETWORK_USAGE: 'network_usage',
  
  // Agent Metrics
  AGENT_RESPONSE_TIME: 'agent_response_time',
  AGENT_SUCCESS_RATE: 'agent_success_rate',
  AGENT_ERROR_RATE: 'agent_error_rate',
  AGENT_TASK_COUNT: 'agent_task_count',
  
  // Task Metrics
  TASK_EXECUTION_TIME: 'task_execution_time',
  TASK_SUCCESS_RATE: 'task_success_rate',
  TASK_QUEUE_SIZE: 'task_queue_size',
  TASK_PRIORITY_DISTRIBUTION: 'task_priority_distribution',
  
  // Performance Metrics
  SYSTEM_RESPONSE_TIME: 'system_response_time',
  SYSTEM_THROUGHPUT: 'system_throughput',
  SYSTEM_AVAILABILITY: 'system_availability',
  SYSTEM_RELIABILITY: 'system_reliability',
  
  // Security Metrics
  SECURITY_THREATS_DETECTED: 'security_threats_detected',
  SECURITY_BLOCKS_APPLIED: 'security_blocks_applied',
  SECURITY_INCIDENTS: 'security_incidents',
  SECURITY_RESPONSE_TIME: 'security_response_time',
  
  // AI Metrics
  AI_MODEL_ACCURACY: 'ai_model_accuracy',
  AI_CONVERSATION_SUCCESS_RATE: 'ai_conversation_success_rate',
  AI_RESPONSE_TIME: 'ai_response_time',
  AI_MODEL_TRAINING_TIME: 'ai_model_training_time',
  
  // Analytics Metrics
  ANALYTICS_GENERATION_TIME: 'analytics_generation_time',
  ANALYTICS_INSIGHTS_COUNT: 'analytics_insights_count',
  ANALYTICS_REPORT_ACCURACY: 'analytics_report_accuracy',
  ANALYTICS_DATA_PROCESSING_TIME: 'analytics_data_processing_time',
} as const;

// Event Types
export const EVENT_TYPES = {
  // Agent Events
  AGENT_STARTED: 'agent_started',
  AGENT_STOPPED: 'agent_stopped',
  AGENT_ERROR: 'agent_error',
  AGENT_HEALTH_CHECK: 'agent_health_check',
  
  // Task Events
  TASK_CREATED: 'task_created',
  TASK_STARTED: 'task_started',
  TASK_COMPLETED: 'task_completed',
  TASK_FAILED: 'task_failed',
  TASK_CANCELLED: 'task_cancelled',
  
  // System Events
  SYSTEM_STARTUP: 'system_startup',
  SYSTEM_SHUTDOWN: 'system_shutdown',
  SYSTEM_HEALTH_CHANGE: 'system_health_change',
  SYSTEM_ALERT: 'system_alert',
  
  // Security Events
  SECURITY_THREAT_DETECTED: 'security_threat_detected',
  SECURITY_BLOCK_APPLIED: 'security_block_applied',
  SECURITY_INCIDENT: 'security_incident',
  
  // AI Events
  AI_MODEL_TRAINED: 'ai_model_trained',
  AI_CONVERSATION_STARTED: 'ai_conversation_started',
  AI_CONVERSATION_ENDED: 'ai_conversation_ended',
  
  // Analytics Events
  ANALYTICS_REPORT_GENERATED: 'analytics_report_generated',
  ANALYTICS_INSIGHT_DISCOVERED: 'analytics_insight_discovered',
  ANALYTICS_DASHBOARD_UPDATED: 'analytics_dashboard_updated',
  
  // Integration Events
  INTEGRATION_WORKFLOW_STARTED: 'integration_workflow_started',
  INTEGRATION_WORKFLOW_COMPLETED: 'integration_workflow_completed',
  INTEGRATION_SYNC_COMPLETED: 'integration_sync_completed',
} as const;