// ========================================
// AI Agents Index
// Export all agents for easy importing
// ========================================

// Master Agent
export { masterAgent, type MasterAgentInterface } from './MasterAgent';

// Specialized Agents
export { callAgent, type CallTask } from './CallAgent';
export { messageAgent, type MessageTask } from './MessageAgent';
export { contactAgent, type ContactTask } from './ContactAgent';
export { securityAgent, type SecurityTask } from './SecurityAgent';
export { backupAgent, type BackupTask } from './BackupAgent';

// Agent Types
export type {
  AgentStatus,
  AgentTask,
  AgentTaskResult,
  AISystemStatus,
  Emergency,
  BaseAgent,
} from './MasterAgent';

// Agent Utilities
export * from './utils';

// Agent Constants
export * from './constants';