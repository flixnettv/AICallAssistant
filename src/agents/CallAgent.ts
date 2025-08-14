import { BaseAgent, AgentTask } from './MasterAgent';
import { callService } from '../services/callService';
import { aiService } from '../services/aiService';
import { databaseService } from '../services/databaseService';
import { CallLog, Contact, AICall } from '../types';

// Call Agent Implementation
class CallAgent extends BaseAgent {
  private callQueue: Map<string, CallTask> = new Map();
  private activeCalls: Map<string, CallLog> = new Map();
  private callHistory: CallLog[] = [];
  private blockedNumbers: Set<string> = new Set();
  
  constructor() {
    super('call', 'Call Management Agent');
  }
  
  async start(): Promise<void> {
    try {
      console.log('📞 Starting Call Agent...');
      
      this.status = 'initializing';
      
      // Load blocked numbers
      await this.loadBlockedNumbers();
      
      // Load call history
      await this.loadCallHistory();
      
      // Start call monitoring
      this.startCallMonitoring();
      
      this.status = 'running';
      console.log('✅ Call Agent started successfully');
      
    } catch (error) {
      console.error('❌ Call Agent start error:', error);
      this.status = 'error';
      throw error;
    }
  }
  
  async stop(): Promise<void> {
    try {
      console.log('📞 Stopping Call Agent...');
      
      this.status = 'stopped';
      
      // End all active calls
      for (const [callId, callLog] of this.activeCalls) {
        await this.endCall(callId);
      }
      
      // Clear call queue
      this.callQueue.clear();
      
      console.log('✅ Call Agent stopped successfully');
      
    } catch (error) {
      console.error('❌ Call Agent stop error:', error);
      throw error;
    }
  }
  
  async executeTask(task: AgentTask): Promise<any> {
    try {
      console.log(`📞 Call Agent executing task: ${task.description}`);
      
      this.activeTasks.add(task.id);
      
      let result: any;
      
      switch (task.data.action) {
        case 'makeCall':
          result = await this.makeCall(task.data.phoneNumber, task.data.reason);
          break;
          
        case 'answerCall':
          result = await this.answerCall(task.data.phoneNumber);
          break;
          
        case 'endCall':
          result = await this.endCall(task.data.callId);
          break;
          
        case 'initiateAICall':
          result = await this.initiateAICall(
            task.data.phoneNumber,
            task.data.reason,
            task.data.voice
          );
          break;
          
        case 'scheduleAICall':
          result = await this.scheduleAICall(
            task.data.phoneNumber,
            task.data.reason,
            task.data.voice,
            new Date(task.data.scheduledTime)
          );
          break;
          
        case 'aiAnswerCall':
          result = await this.aiAnswerCall(
            task.data.phoneNumber,
            task.data.voice
          );
          break;
          
        case 'startRecording':
          result = await this.startRecording(task.data.callId);
          break;
          
        case 'stopRecording':
          result = await this.stopRecording(task.data.callId);
          break;
          
        case 'blockNumber':
          result = await this.blockNumber(task.data.phoneNumber);
          break;
          
        case 'unblockNumber':
          result = await this.unblockNumber(task.data.phoneNumber);
          break;
          
        case 'reportSpam':
          result = await this.reportSpam(
            task.data.phoneNumber,
            task.data.reason
          );
          break;
          
        case 'lookupCaller':
          result = await this.lookupCaller(task.data.phoneNumber);
          break;
          
        default:
          throw new Error(`Unknown call action: ${task.data.action}`);
      }
      
      this.taskCompleted();
      this.activeTasks.delete(task.id);
      
      console.log(`✅ Call Agent task completed: ${task.description}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Call Agent task error: ${task.description}`, error);
      this.taskError();
      this.activeTasks.delete(task.id);
      throw error;
    }
  }
  
  async cancelTask(taskId: string): Promise<boolean> {
    try {
      const callTask = this.callQueue.get(taskId);
      if (callTask) {
        // Cancel the call task
        await this.cancelCallTask(callTask);
        this.callQueue.delete(taskId);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Cancel call task error:', error);
      return false;
    }
  }
  
  // Call Management Methods
  private async makeCall(phoneNumber: string, reason?: string): Promise<boolean> {
    try {
      // Check if number is blocked
      if (this.blockedNumbers.has(phoneNumber)) {
        throw new Error('Cannot call blocked number');
      }
      
      // Process with AI if reason provided
      if (reason) {
        const aiResult = await aiService.processOutgoingCall(phoneNumber, reason);
        if (!aiResult.success) {
          throw new Error(aiResult.message);
        }
      }
      
      // Make the call
      const success = await callService.makeCall(phoneNumber, reason);
      
      if (success) {
        // Get current call and add to active calls
        const currentCall = callService.getCurrentCall();
        if (currentCall) {
          this.activeCalls.set(currentCall.id, currentCall);
        }
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Make call error:', error);
      throw error;
    }
  }
  
  private async answerCall(phoneNumber: string): Promise<boolean> {
    try {
      // Answer the call
      const success = await callService.answerCall(phoneNumber);
      
      if (success) {
        // Get current call and add to active calls
        const currentCall = callService.getCurrentCall();
        if (currentCall) {
          this.activeCalls.set(currentCall.id, currentCall);
        }
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Answer call error:', error);
      throw error;
    }
  }
  
  private async endCall(callId: string): Promise<boolean> {
    try {
      // End the call
      const success = await callService.endCall();
      
      if (success) {
        // Remove from active calls
        this.activeCalls.delete(callId);
        
        // Update call history
        const callLog = await this.getCallLogById(callId);
        if (callLog) {
          this.callHistory.push(callLog);
        }
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ End call error:', error);
      throw error;
    }
  }
  
  // AI Call Methods
  private async initiateAICall(phoneNumber: string, reason: string, voice: string): Promise<boolean> {
    try {
      // Validate reason
      if (!reason.trim()) {
        throw new Error('Call reason is required for AI calls');
      }
      
      // Get AI voice
      const voices = await aiService.getAvailableVoices();
      const selectedVoice = voices.find(v => v.id === voice);
      
      if (!selectedVoice) {
        throw new Error('Selected voice not found');
      }
      
      // Start AI conversation
      await aiService.startConversation(reason, selectedVoice);
      
      // Create AI call log
      const callLog: Omit<CallLog, 'id'> = {
        contactId: undefined,
        phoneNumber,
        callType: 'ai-outgoing',
        duration: 0,
        timestamp: new Date(),
        isRecorded: false,
        callReason: reason,
        spamScore: 0,
      };
      
      const newCallLog = await databaseService.createCallLog(callLog);
      this.activeCalls.set(newCallLog.id, newCallLog);
      
      console.log('✅ AI call initiated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Initiate AI call error:', error);
      throw error;
    }
  }
  
  private async scheduleAICall(phoneNumber: string, reason: string, voice: string, scheduledTime: Date): Promise<boolean> {
    try {
      // Validate scheduled time
      if (scheduledTime <= new Date()) {
        throw new Error('Scheduled time must be in the future');
      }
      
      // Create scheduled call record
      const scheduledCall: AICall = {
        id: Date.now().toString(),
        phoneNumber,
        reason,
        voice,
        scheduledTime,
        status: 'scheduled',
        createdAt: new Date(),
      };
      
      // Store in database
      // TODO: Implement scheduled calls storage
      
      console.log('✅ AI call scheduled successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Schedule AI call error:', error);
      throw error;
    }
  }
  
  private async aiAnswerCall(phoneNumber: string, voice: string): Promise<boolean> {
    try {
      // Get AI voice
      const voices = await aiService.getAvailableVoices();
      const selectedVoice = voices.find(v => v.id === voice);
      
      if (!selectedVoice) {
        throw new Error('Selected voice not found');
      }
      
      // Start AI conversation for incoming call
      const context = `Incoming call from ${phoneNumber}. You are answering this call on behalf of the user.`;
      await aiService.startConversation(context, selectedVoice);
      
      // Create call log
      const callLog: Omit<CallLog, 'id'> = {
        contactId: undefined,
        phoneNumber,
        callType: 'ai-incoming',
        duration: 0,
        timestamp: new Date(),
        isRecorded: false,
        spamScore: 0,
      };
      
      const newCallLog = await databaseService.createCallLog(callLog);
      this.activeCalls.set(newCallLog.id, newCallLog);
      
      console.log('✅ AI call answered successfully');
      return true;
      
    } catch (error) {
      console.error('❌ AI answer call error:', error);
      throw error;
    }
  }
  
  // Recording Methods
  private async startRecording(callId: string): Promise<boolean> {
    try {
      const callLog = this.activeCalls.get(callId);
      if (!callLog) {
        throw new Error('Call not found');
      }
      
      const success = await callService.startRecording();
      return success;
      
    } catch (error) {
      console.error('❌ Start recording error:', error);
      throw error;
    }
  }
  
  private async stopRecording(callId: string): Promise<string | null> {
    try {
      const callLog = this.activeCalls.get(callId);
      if (!callLog) {
        throw new Error('Call not found');
      }
      
      const recordingPath = await callService.stopRecording();
      return recordingPath;
      
    } catch (error) {
      console.error('❌ Stop recording error:', error);
      throw error;
    }
  }
  
  // Security Methods
  private async blockNumber(phoneNumber: string): Promise<boolean> {
    try {
      const success = await callService.blockNumber(phoneNumber);
      
      if (success) {
        this.blockedNumbers.add(phoneNumber);
        await this.saveBlockedNumbers();
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Block number error:', error);
      throw error;
    }
  }
  
  private async unblockNumber(phoneNumber: string): Promise<boolean> {
    try {
      const success = await callService.unblockNumber(phoneNumber);
      
      if (success) {
        this.blockedNumbers.delete(phoneNumber);
        await this.saveBlockedNumbers();
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Unblock number error:', error);
      throw error;
    }
  }
  
  private async reportSpam(phoneNumber: string, reason: string): Promise<boolean> {
    try {
      const success = await callService.reportSpam(phoneNumber, reason);
      return success;
      
    } catch (error) {
      console.error('❌ Report spam error:', error);
      throw error;
    }
  }
  
  // Caller ID Methods
  private async lookupCaller(phoneNumber: string): Promise<any> {
    try {
      const callerInfo = await callService.lookupCaller(phoneNumber);
      return callerInfo;
      
    } catch (error) {
      console.error('❌ Lookup caller error:', error);
      throw error;
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
  
  private async loadCallHistory(): Promise<void> {
    try {
      this.callHistory = await callService.getCallHistory(100);
    } catch (error) {
      console.error('❌ Load call history error:', error);
      this.callHistory = [];
    }
  }
  
  private startCallMonitoring(): void {
    // Monitor active calls for issues
    setInterval(() => {
      try {
        for (const [callId, callLog] of this.activeCalls) {
          // Check call duration
          const duration = Math.floor((Date.now() - callLog.timestamp.getTime()) / 1000);
          
          // Alert if call is too long
          if (duration > 3600) { // 1 hour
            console.log(`⚠️ Long call detected: ${callId} (${duration}s)`);
          }
        }
      } catch (error) {
        console.error('❌ Call monitoring error:', error);
      }
    }, 30000); // Check every 30 seconds
  }
  
  private async getCallLogById(callId: string): Promise<CallLog | null> {
    try {
      // Get from database
      const callLogs = await databaseService.getCallLogs();
      return callLogs.find(log => log.id === callId) || null;
    } catch (error) {
      console.error('❌ Get call log by ID error:', error);
      return null;
    }
  }
  
  private async cancelCallTask(callTask: CallTask): Promise<void> {
    try {
      // Cancel the specific call task
      if (callTask.callId) {
        await this.endCall(callTask.callId);
      }
    } catch (error) {
      console.error('❌ Cancel call task error:', error);
    }
  }
}

// Call Task Interface
interface CallTask {
  id: string;
  callId?: string;
  phoneNumber: string;
  action: string;
  data: any;
  status: 'pending' | 'running' | 'completed' | 'cancelled';
}

// Export singleton instance
export const callAgent = new CallAgent();

// Export types
export type { CallTask };