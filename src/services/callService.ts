import { Platform, PermissionsAndroid } from 'react-native';
import { CallLog, AICall } from '../types';
import { aiService } from './aiService';
import { databaseService } from './databaseService';
import { Config } from '../constants/config';

// Call Service Interface
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

// Call Service Implementation
class CallService implements CallServiceInterface {
  private currentCall: CallLog | null = null;
  private isRecordingCall: boolean = false;
  private recordingStartTime: Date | null = null;
  private recordingPath: string | null = null;
  
  // Call Management
  async makeCall(phoneNumber: string, reason?: string): Promise<boolean> {
    try {
      // Check permissions
      if (!(await this.checkCallPermissions())) {
        throw new Error('Call permissions not granted');
      }
      
      // Check if number is blocked
      if (await this.isNumberBlocked(phoneNumber)) {
        throw new Error('This number is blocked');
      }
      
      // Process outgoing call with AI
      if (reason) {
        const result = await aiService.processOutgoingCall(phoneNumber, reason);
        if (!result.success) {
          throw new Error(result.message);
        }
      }
      
      // Create call log
      const callLog: Omit<CallLog, 'id'> = {
        contactId: undefined,
        phoneNumber,
        callType: 'outgoing',
        duration: 0,
        timestamp: new Date(),
        isRecorded: false,
        callReason: reason,
        spamScore: 0,
      };
      
      const newCallLog = await databaseService.createCallLog(callLog);
      this.currentCall = newCallLog;
      
      // Make actual phone call
      if (Platform.OS === 'ios') {
        // iOS call implementation
        console.log('🍎 Making iOS call to:', phoneNumber);
      } else {
        // Android call implementation
        console.log('🤖 Making Android call to:', phoneNumber);
      }
      
      console.log(`📞 Call initiated to: ${phoneNumber}`);
      return true;
      
    } catch (error) {
      console.error('❌ Make call error:', error);
      throw error;
    }
  }
  
  async answerCall(phoneNumber: string): Promise<boolean> {
    try {
      console.log(`📞 Answering call from: ${phoneNumber}`);
      
      // Create call log
      const callLog: Omit<CallLog, 'id'> = {
        contactId: undefined,
        phoneNumber,
        callType: 'incoming',
        duration: 0,
        timestamp: new Date(),
        isRecorded: false,
        spamScore: 0,
      };
      
      const newCallLog = await databaseService.createCallLog(callLog);
      this.currentCall = newCallLog;
      
      // Answer actual phone call
      if (Platform.OS === 'ios') {
        // iOS answer implementation
        console.log('🍎 Answering iOS call');
      } else {
        // Android answer implementation
        console.log('🤖 Answering Android call');
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Answer call error:', error);
      throw error;
    }
  }
  
  async endCall(): Promise<boolean> {
    try {
      if (!this.currentCall) {
        throw new Error('No active call to end');
      }
      
      console.log('📞 Ending call...');
      
      // Stop recording if active
      if (this.isRecordingCall) {
        await this.stopRecording();
      }
      
      // Update call log with duration
      if (this.currentCall) {
        const duration = this.recordingStartTime 
          ? Math.floor((Date.now() - this.recordingStartTime.getTime()) / 1000)
          : 0;
        
        const updatedCall = {
          ...this.currentCall,
          duration,
          isRecorded: this.isRecordingCall,
          recordingPath: this.recordingPath || undefined,
        };
        
        await databaseService.updateCallLog(updatedCall);
      }
      
      // End actual phone call
      if (Platform.OS === 'ios') {
        // iOS end call implementation
        console.log('🍎 Ending iOS call');
      } else {
        // Android end call implementation
        console.log('🤖 Ending Android call');
      }
      
      // Reset state
      this.currentCall = null;
      this.isRecordingCall = false;
      this.recordingStartTime = null;
      this.recordingPath = null;
      
      console.log('✅ Call ended successfully');
      return true;
      
    } catch (error) {
      console.error('❌ End call error:', error);
      throw error;
    }
  }
  
  // AI Call Features
  async initiateAICall(phoneNumber: string, reason: string, voice: string): Promise<boolean> {
    try {
      console.log(`🤖 Initiating AI call to: ${phoneNumber}`);
      console.log(`💭 Reason: ${reason}`);
      console.log(`🎭 Voice: ${voice}`);
      
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
      this.currentCall = newCallLog;
      
      // Simulate AI call initiation
      console.log('🤖 AI call initiated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Initiate AI call error:', error);
      throw error;
    }
  }
  
  async scheduleAICall(phoneNumber: string, reason: string, voice: string, scheduledTime: Date): Promise<boolean> {
    try {
      console.log(`📅 Scheduling AI call to: ${phoneNumber}`);
      console.log(`⏰ Scheduled for: ${scheduledTime.toLocaleString()}`);
      
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
      
      // Store in database (you might want to create a separate table for this)
      console.log('✅ AI call scheduled successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Schedule AI call error:', error);
      throw error;
    }
  }
  
  async aiAnswerCall(phoneNumber: string, voice: string): Promise<boolean> {
    try {
      console.log(`🤖 AI answering call from: ${phoneNumber}`);
      console.log(`🎭 Using voice: ${voice}`);
      
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
      this.currentCall = newCallLog;
      
      console.log('✅ AI call answered successfully');
      return true;
      
    } catch (error) {
      console.error('❌ AI answer call error:', error);
      throw error;
    }
  }
  
  // Call Recording
  async startRecording(): Promise<boolean> {
    try {
      if (!this.currentCall) {
        throw new Error('No active call to record');
      }
      
      if (this.isRecordingCall) {
        throw new Error('Call is already being recorded');
      }
      
      // Check recording permissions
      if (!(await this.checkRecordingPermissions())) {
        throw new Error('Recording permissions not granted');
      }
      
      // Start recording
      this.isRecordingCall = true;
      this.recordingStartTime = new Date();
      this.recordingPath = `${Config.recording.storagePath}call_${Date.now()}.${Config.recording.format}`;
      
      console.log('🎙️ Call recording started');
      return true;
      
    } catch (error) {
      console.error('❌ Start recording error:', error);
      throw error;
    }
  }
  
  async stopRecording(): Promise<string | null> {
    try {
      if (!this.isRecordingCall) {
        throw new Error('No active recording to stop');
      }
      
      // Stop recording
      this.isRecordingCall = false;
      
      console.log('🛑 Call recording stopped');
      return this.recordingPath;
      
    } catch (error) {
      console.error('❌ Stop recording error:', error);
      throw error;
    }
  }
  
  isRecording(): boolean {
    return this.isRecordingCall;
  }
  
  // Call Information
  getCurrentCall(): CallLog | null {
    return this.currentCall;
  }
  
  async getCallHistory(limit: number = 100): Promise<CallLog[]> {
    try {
      return await databaseService.getCallLogs(limit);
    } catch (error) {
      console.error('❌ Get call history error:', error);
      throw error;
    }
  }
  
  async getCallHistoryByContact(contactId: string): Promise<CallLog[]> {
    try {
      return await databaseService.getCallLogsByContact(contactId);
    } catch (error) {
      console.error('❌ Get call history by contact error:', error);
      throw error;
    }
  }
  
  // Spam & Security
  async blockNumber(phoneNumber: string): Promise<boolean> {
    try {
      console.log(`🚫 Blocking number: ${phoneNumber}`);
      
      // Add to blocked numbers list
      const blockedNumbers = await this.getBlockedNumbers();
      if (!blockedNumbers.includes(phoneNumber)) {
        blockedNumbers.push(phoneNumber);
        await AsyncStorage.setItem('blocked_numbers', JSON.stringify(blockedNumbers));
      }
      
      console.log('✅ Number blocked successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Block number error:', error);
      throw error;
    }
  }
  
  async unblockNumber(phoneNumber: string): Promise<boolean> {
    try {
      console.log(`✅ Unblocking number: ${phoneNumber}`);
      
      // Remove from blocked numbers list
      const blockedNumbers = await this.getBlockedNumbers();
      const updatedBlockedNumbers = blockedNumbers.filter(num => num !== phoneNumber);
      await AsyncStorage.setItem('blocked_numbers', JSON.stringify(updatedBlockedNumbers));
      
      console.log('✅ Number unblocked successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Unblock number error:', error);
      throw error;
    }
  }
  
  async reportSpam(phoneNumber: string, reason: string): Promise<boolean> {
    try {
      console.log(`🚨 Reporting spam: ${phoneNumber}`);
      console.log(`📝 Reason: ${reason}`);
      
      // Create spam report
      const spamReport = {
        phoneNumber,
        reason,
        timestamp: new Date().toISOString(),
        userId: 'current_user', // TODO: Get actual user ID
      };
      
      // Store spam report
      const spamReports = await this.getSpamReports();
      spamReports.push(spamReport);
      await AsyncStorage.setItem('spam_reports', JSON.stringify(spamReports));
      
      // Update contact spam risk if exists
      const contacts = await databaseService.getAllContacts();
      const contact = contacts.find(c => 
        c.phoneNumbers.some(p => p.number === phoneNumber)
      );
      
      if (contact) {
        const updatedContact = {
          ...contact,
          spamRisk: Math.min(contact.spamRisk + 0.1, 1.0),
        };
        await databaseService.updateContact(updatedContact);
      }
      
      console.log('✅ Spam reported successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Report spam error:', error);
      throw error;
    }
  }
  
  async isNumberBlocked(phoneNumber: string): Promise<boolean> {
    try {
      const blockedNumbers = await this.getBlockedNumbers();
      return blockedNumbers.includes(phoneNumber);
    } catch (error) {
      console.error('❌ Check blocked number error:', error);
      return false;
    }
  }
  
  // Caller ID
  async lookupCaller(phoneNumber: string): Promise<{
    name: string;
    company?: string;
    location?: string;
    spamRisk: number;
    type: 'personal' | 'business' | 'unknown';
  }> {
    try {
      console.log(`🔍 Looking up caller: ${phoneNumber}`);
      
      // Check local database first
      const contacts = await databaseService.getAllContacts();
      const contact = contacts.find(c => 
        c.phoneNumbers.some(p => p.number === phoneNumber)
      );
      
      if (contact) {
        return {
          name: contact.name,
          company: contact.company,
          location: undefined, // TODO: Implement location
          spamRisk: contact.spamRisk,
          type: contact.company ? 'business' : 'personal',
        };
      }
      
      // Check online services
      const onlineInfo = await this.getOnlineCallerInfo(phoneNumber);
      
      return {
        name: onlineInfo.name || 'مجهول',
        company: onlineInfo.company,
        location: onlineInfo.location,
        spamRisk: onlineInfo.spamRisk || 0,
        type: onlineInfo.type || 'unknown',
      };
      
    } catch (error) {
      console.error('❌ Lookup caller error:', error);
      return {
        name: 'مجهول',
        spamRisk: 0,
        type: 'unknown',
      };
    }
  }
  
  // Private helper methods
  private async checkCallPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Call Permission',
            message: 'This app needs access to make phone calls',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permissions differently
    } catch (error) {
      console.error('❌ Check call permissions error:', error);
      return false;
    }
  }
  
  private async checkRecordingPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Recording Permission',
            message: 'This app needs access to record audio',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permissions differently
    } catch (error) {
      console.error('❌ Check recording permissions error:', error);
      return false;
    }
  }
  
  private async getBlockedNumbers(): Promise<string[]> {
    try {
      const blockedNumbersJson = await AsyncStorage.getItem('blocked_numbers');
      return blockedNumbersJson ? JSON.parse(blockedNumbersJson) : [];
    } catch (error) {
      console.error('❌ Get blocked numbers error:', error);
      return [];
    }
  }
  
  private async getSpamReports(): Promise<any[]> {
    try {
      const spamReportsJson = await AsyncStorage.getItem('spam_reports');
      return spamReportsJson ? JSON.parse(spamReportsJson) : [];
    } catch (error) {
      console.error('❌ Get spam reports error:', error);
      return [];
    }
  }
  
  private async getOnlineCallerInfo(phoneNumber: string): Promise<any> {
    try {
      const response = await fetch(`${Config.api.callerId}/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
        }),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        return {};
      }
    } catch (error) {
      console.error('❌ Get online caller info error:', error);
      return {};
    }
  }
}

// Export singleton instance
export const callService = new CallService();

// Export types
export type { CallServiceInterface };