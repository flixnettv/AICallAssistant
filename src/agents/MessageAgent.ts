import { BaseAgent, AgentTask } from './MasterAgent';
import { messageService } from '../services/messageService';
import { databaseService } from '../services/databaseService';
import { Message, Contact } from '../types';

// Message Agent Implementation
class MessageAgent extends BaseAgent {
  private messageQueue: Map<string, MessageTask> = new Map();
  private activeConversations: Map<string, Message[]> = new Map();
  private spamPatterns: Map<string, number> = new Map();
  private messageHistory: Message[] = [];
  private blockedNumbers: Set<string> = new Set();
  
  constructor() {
    super('message', 'Message Management Agent');
  }
  
  async start(): Promise<void> {
    try {
      console.log('💬 Starting Message Agent...');
      
      this.status = 'initializing';
      
      // Load blocked numbers
      await this.loadBlockedNumbers();
      
      // Load message history
      await this.loadMessageHistory();
      
      // Load spam patterns
      await this.loadSpamPatterns();
      
      // Start message monitoring
      this.startMessageMonitoring();
      
      // Start spam detection training
      this.startSpamDetectionTraining();
      
      this.status = 'running';
      console.log('✅ Message Agent started successfully');
      
    } catch (error) {
      console.error('❌ Message Agent start error:', error);
      this.status = 'error';
      throw error;
    }
  }
  
  async stop(): Promise<void> {
    try {
      console.log('💬 Stopping Message Agent...');
      
      this.status = 'stopped';
      
      // Clear message queue
      this.messageQueue.clear();
      
      // Clear active conversations
      this.activeConversations.clear();
      
      console.log('✅ Message Agent stopped successfully');
      
    } catch (error) {
      console.error('❌ Message Agent stop error:', error);
      throw error;
    }
  }
  
  async executeTask(task: AgentTask): Promise<any> {
    try {
      console.log(`💬 Message Agent executing task: ${task.description}`);
      
      this.activeTasks.add(task.id);
      
      let result: any;
      
      switch (task.data.action) {
        case 'sendSMS':
          result = await this.sendSMS(task.data.phoneNumber, task.data.message);
          break;
          
        case 'sendChatMessage':
          result = await this.sendChatMessage(task.data.contactId, task.data.message);
          break;
          
        case 'detectSpam':
          result = await this.detectSpam(task.data.message);
          break;
          
        case 'reportSpam':
          result = await this.reportSpam(task.data.messageId, task.data.reason);
          break;
          
        case 'blockNumber':
          result = await this.blockNumber(task.data.phoneNumber);
          break;
          
        case 'unblockNumber':
          result = await this.unblockNumber(task.data.phoneNumber);
          break;
          
        case 'suggestReply':
          result = await this.suggestReply(task.data.message);
          break;
          
        case 'autoCategorize':
          result = await this.autoCategorize(task.data.message);
          break;
          
        case 'translateMessage':
          result = await this.translateMessage(task.data.message, task.data.targetLanguage);
          break;
          
        case 'searchMessages':
          result = await this.searchMessages(task.data.query);
          break;
          
        case 'markAsRead':
          result = await this.markAsRead(task.data.messageId);
          break;
          
        case 'deleteMessage':
          result = await this.deleteMessage(task.data.messageId);
          break;
          
        case 'getUnreadCount':
          result = await this.getUnreadCount();
          break;
          
        default:
          throw new Error(`Unknown message action: ${task.data.action}`);
      }
      
      this.taskCompleted();
      this.activeTasks.delete(task.id);
      
      console.log(`✅ Message Agent task completed: ${task.description}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Message Agent task error: ${task.description}`, error);
      this.taskError();
      this.activeTasks.delete(task.id);
      throw error;
    }
  }
  
  async cancelTask(taskId: string): Promise<boolean> {
    try {
      const messageTask = this.messageQueue.get(taskId);
      if (messageTask) {
        // Cancel the message task
        await this.cancelMessageTask(messageTask);
        this.messageQueue.delete(taskId);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Cancel message task error:', error);
      return false;
    }
  }
  
  // Message Management Methods
  private async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Check if number is blocked
      if (this.blockedNumbers.has(phoneNumber)) {
        throw new Error('Cannot send SMS to blocked number');
      }
      
      // Detect spam before sending
      const spamCheck = await this.detectSpam(message);
      if (spamCheck.isSpam && spamCheck.confidence > 0.8) {
        throw new Error('Message appears to be spam and cannot be sent');
      }
      
      // Send SMS
      const success = await messageService.sendSMS(phoneNumber, message);
      
      if (success) {
        // Update message history
        await this.updateMessageHistory();
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Send SMS error:', error);
      throw error;
    }
  }
  
  private async sendChatMessage(contactId: string, message: string): Promise<Message> {
    try {
      // Validate contact
      const contact = await databaseService.getContact(contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      // Detect spam
      const spamCheck = await this.detectSpam(message);
      
      // Send chat message
      const sentMessage = await messageService.sendChatMessage(contactId, message);
      
      // Update active conversation
      if (!this.activeConversations.has(contactId)) {
        this.activeConversations.set(contactId, []);
      }
      this.activeConversations.get(contactId)!.push(sentMessage);
      
      return sentMessage;
      
    } catch (error) {
      console.error('❌ Send chat message error:', error);
      throw error;
    }
  }
  
  // Spam Detection Methods
  private async detectSpam(message: string): Promise<{
    isSpam: boolean;
    confidence: number;
    reason?: string;
  }> {
    try {
      // Use message service for spam detection
      const result = await messageService.detectSpam(message);
      
      // Update spam patterns if spam detected
      if (result.isSpam) {
        await this.updateSpamPatterns(message, result.confidence);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Detect spam error:', error);
      throw error;
    }
  }
  
  private async reportSpam(messageId: string, reason: string): Promise<boolean> {
    try {
      const success = await messageService.reportSpam(messageId, reason);
      
      if (success) {
        // Update spam patterns
        await this.updateSpamPatterns(reason, 0.8);
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Report spam error:', error);
      throw error;
    }
  }
  
  // Security Methods
  private async blockNumber(phoneNumber: string): Promise<boolean> {
    try {
      // Add to blocked numbers
      this.blockedNumbers.add(phoneNumber);
      await this.saveBlockedNumbers();
      
      console.log(`✅ Number blocked: ${phoneNumber}`);
      return true;
      
    } catch (error) {
      console.error('❌ Block number error:', error);
      throw error;
    }
  }
  
  private async unblockNumber(phoneNumber: string): Promise<boolean> {
    try {
      // Remove from blocked numbers
      this.blockedNumbers.delete(phoneNumber);
      await this.saveBlockedNumbers();
      
      console.log(`✅ Number unblocked: ${phoneNumber}`);
      return true;
      
    } catch (error) {
      console.error('❌ Unblock number error:', error);
      throw error;
    }
  }
  
  // Smart Features Methods
  private async suggestReply(message: string): Promise<string[]> {
    try {
      const suggestions = await messageService.suggestReply(message);
      return suggestions;
      
    } catch (error) {
      console.error('❌ Suggest reply error:', error);
      throw error;
    }
  }
  
  private async autoCategorize(message: string): Promise<'personal' | 'business' | 'spam' | 'unknown'> {
    try {
      const category = await messageService.autoCategorize(message);
      return category;
      
    } catch (error) {
      console.error('❌ Auto categorize error:', error);
      throw error;
    }
  }
  
  private async translateMessage(message: string, targetLanguage: string): Promise<string> {
    try {
      const translated = await messageService.translateMessage(message, targetLanguage);
      return translated;
      
    } catch (error) {
      console.error('❌ Translate message error:', error);
      throw error;
    }
  }
  
  // Message Management Methods
  private async searchMessages(query: string): Promise<Message[]> {
    try {
      const messages = await messageService.searchMessages(query);
      return messages;
      
    } catch (error) {
      console.error('❌ Search messages error:', error);
      throw error;
    }
  }
  
  private async markAsRead(messageId: string): Promise<boolean> {
    try {
      const success = await messageService.markMessageAsRead(messageId);
      return success;
      
    } catch (error) {
      console.error('❌ Mark as read error:', error);
      throw error;
    }
  }
  
  private async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const success = await messageService.deleteMessage(messageId);
      
      if (success) {
        // Update message history
        await this.updateMessageHistory();
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Delete message error:', error);
      throw error;
    }
  }
  
  private async getUnreadCount(): Promise<number> {
    try {
      const count = await messageService.getUnreadCount();
      return count;
      
    } catch (error) {
      console.error('❌ Get unread count error:', error);
      return 0;
    }
  }
  
  // Private helper methods
  private async loadBlockedNumbers(): Promise<void> {
    try {
      // Load from storage or database
      // For now, using empty set
      this.blockedNumbers = new Set();
    } catch (error) {
      console.error('❌ Load blocked numbers error:', error);
    }
  }
  
  private async saveBlockedNumbers(): Promise<void> {
    try {
      // Save to storage or database
      // For now, just logging
      console.log('💾 Blocked numbers saved');
    } catch (error) {
      console.error('❌ Save blocked numbers error:', error);
    }
  }
  
  private async loadMessageHistory(): Promise<void> {
    try {
      this.messageHistory = await messageService.getMessages(undefined, 100);
    } catch (error) {
      console.error('❌ Load message history error:', error);
      this.messageHistory = [];
    }
  }
  
  private async updateMessageHistory(): Promise<void> {
    try {
      this.messageHistory = await messageService.getMessages(undefined, 100);
    } catch (error) {
      console.error('❌ Update message history error:', error);
    }
  }
  
  private async loadSpamPatterns(): Promise<void> {
    try {
      // Load spam patterns from storage or database
      // For now, using default patterns
      this.spamPatterns = new Map([
        ['ربح مليون', 0.8],
        ['win million', 0.8],
        ['عرض محدود', 0.7],
        ['limited offer', 0.7],
        ['فورا', 0.6],
        ['now', 0.6],
        ['دولار', 0.5],
        ['dollar', 0.5],
        ['جائزة', 0.6],
        ['prize', 0.6],
        ['مجاني', 0.4],
        ['free', 0.4],
      ]);
    } catch (error) {
      console.error('❌ Load spam patterns error:', error);
    }
  }
  
  private async updateSpamPatterns(message: string, confidence: number): Promise<void> {
    try {
      // Extract keywords from message
      const words = message.toLowerCase().split(/\s+/);
      
      for (const word of words) {
        if (word.length > 3) { // Only consider words longer than 3 characters
          const currentConfidence = this.spamPatterns.get(word) || 0;
          const newConfidence = Math.max(currentConfidence, confidence);
          this.spamPatterns.set(word, newConfidence);
        }
      }
      
      // Save updated patterns
      await this.saveSpamPatterns();
      
    } catch (error) {
      console.error('❌ Update spam patterns error:', error);
    }
  }
  
  private async saveSpamPatterns(): Promise<void> {
    try {
      // Save to storage or database
      // For now, just logging
      console.log('💾 Spam patterns saved');
    } catch (error) {
      console.error('❌ Save spam patterns error:', error);
    }
  }
  
  private startMessageMonitoring(): void {
    // Monitor message patterns and detect anomalies
    setInterval(() => {
      try {
        // Check for unusual message patterns
        const recentMessages = this.messageHistory.slice(0, 10);
        
        // Detect rapid messaging (potential spam)
        if (recentMessages.length >= 5) {
          const timeSpan = recentMessages[recentMessages.length - 1].timestamp.getTime() - 
                          recentMessages[0].timestamp.getTime();
          
          if (timeSpan < 60000) { // Less than 1 minute
            console.log('⚠️ Rapid messaging detected - potential spam');
          }
        }
        
        // Check for blocked number attempts
        for (const message of recentMessages) {
          if (this.blockedNumbers.has(message.phoneNumber)) {
            console.log(`🚫 Blocked number attempted to send message: ${message.phoneNumber}`);
          }
        }
        
      } catch (error) {
        console.error('❌ Message monitoring error:', error);
      }
    }, 60000); // Check every minute
  }
  
  private startSpamDetectionTraining(): void {
    // Periodically retrain spam detection with new patterns
    setInterval(async () => {
      try {
        console.log('🤖 Retraining spam detection...');
        
        // Update spam patterns based on recent reports
        await this.updateSpamPatternsFromReports();
        
        console.log('✅ Spam detection retraining completed');
        
      } catch (error) {
        console.error('❌ Spam detection training error:', error);
      }
    }, 3600000); // Retrain every hour
  }
  
  private async updateSpamPatternsFromReports(): Promise<void> {
    try {
      // Get recent spam reports and update patterns
      // This would typically involve machine learning model updates
      console.log('📊 Updating spam patterns from reports...');
      
    } catch (error) {
      console.error('❌ Update spam patterns from reports error:', error);
    }
  }
  
  private async cancelMessageTask(messageTask: MessageTask): Promise<void> {
    try {
      // Cancel the specific message task
      // For messages, cancellation might involve removing from queue
      // or stopping delivery if not yet sent
      console.log(`🚫 Cancelled message task: ${messageTask.id}`);
      
    } catch (error) {
      console.error('❌ Cancel message task error:', error);
    }
  }
}

// Message Task Interface
interface MessageTask {
  id: string;
  messageId?: string;
  phoneNumber?: string;
  contactId?: string;
  action: string;
  data: any;
  status: 'pending' | 'running' | 'completed' | 'cancelled';
}

// Export singleton instance
export const messageAgent = new MessageAgent();

// Export types
export type { MessageTask };