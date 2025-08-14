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
          result = await this.makeCall(task.data.phoneNumber, task.data.contactName);
          break;
          
        case 'answerCall':
          result = await this.answerCall(task.data.phoneNumber, task.data.contactName);
          break;
          
        case 'endCall':
          result = await this.endCall(task.data.phoneNumber, task.data.duration);
          break;
          
        case 'makeAICall':
          result = await this.makeAICall(
            task.data.phoneNumber,
            task.data.contactName,
            task.data.voice,
            task.data.reason,
            task.data.isImmediate
          );
          break;
          
        case 'scheduleAICall':
          result = await this.scheduleAICall(
            task.data.phoneNumber,
            task.data.contactName,
            task.data.voice,
            task.data.reason,
            task.data.scheduledTime
          );
          break;
          
        case 'startAIReply':
          result = await this.startAIReply(
            task.data.phoneNumber,
            task.data.contactName,
            task.data.voice,
            task.data.isIncomingCall
          );
          break;
          
        case 'stopAIReply':
          result = await this.stopAIReply(task.data.phoneNumber, task.data.contactName);
          break;
          
        case 'rejectCall':
          result = await this.rejectCall(task.data.phoneNumber, task.data.contactName);
          break;
          
        case 'recordCall':
          result = await this.recordCall(task.data.phoneNumber);
          break;
          
        case 'blockNumber':
          result = await this.blockNumber(task.data.phoneNumber, task.data.reason);
          break;
          
        case 'reportSpam':
          result = await this.reportSpam(task.data.phoneNumber, task.data.reason);
          break;
          
        case 'lookupCallerID':
          result = await this.lookupCallerID(task.data.phoneNumber);
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

  // المكالمات بالذكاء الاصطناعي
  private async makeAICall(
    phoneNumber: string,
    contactName?: string,
    voice?: AIVoice,
    reason?: string,
    isImmediate: boolean = true
  ): Promise<{
    success: boolean;
    callId: string;
    message: string;
    aiContext: any;
  }> {
    try {
      console.log(`🤖 Making AI call to ${phoneNumber} with voice: ${voice?.name}`);

      // إنشاء معرف فريد للمكالمة
      const callId = `ai_call_${Date.now()}`;

      // إعداد سياق الذكاء الاصطناعي
      const aiContext = {
        callId,
        phoneNumber,
        contactName,
        reason: reason || 'مكالمة عامة',
        voice: voice || this.getDefaultVoice(),
        dialect: 'egyptian',
        language: 'ar-EG',
        timestamp: new Date(),
        isImmediate,
      };

      if (isImmediate) {
        // إجراء المكالمة فوراً
        await this.initiateAICall(aiContext);
      }

      // تسجيل المكالمة في قاعدة البيانات
      await this.logAICall(aiContext);

      return {
        success: true,
        callId,
        message: 'تم بدء المكالمة بالذكاء الاصطناعي بنجاح',
        aiContext,
      };

    } catch (error) {
      console.error('❌ Make AI call error:', error);
      throw error;
    }
  }

  private async scheduleAICall(
    phoneNumber: string,
    contactName?: string,
    voice?: AIVoice,
    reason?: string,
    scheduledTime: Date
  ): Promise<{
    success: boolean;
    scheduleId: string;
    message: string;
    scheduledFor: Date;
  }> {
    try {
      console.log(`📅 Scheduling AI call to ${phoneNumber} for ${scheduledTime}`);

      const scheduleId = `ai_schedule_${Date.now()}`;

      // إنشاء مهمة مجدولة
      const scheduledTask = {
        id: scheduleId,
        type: 'ai_call_scheduled',
        priority: 'medium',
        description: `مكالمة مجدولة بالذكاء الاصطناعي إلى ${contactName || phoneNumber}`,
        data: {
          action: 'executeScheduledAICall',
          phoneNumber,
          contactName,
          voice: voice || this.getDefaultVoice(),
          reason: reason || 'مكالمة مجدولة',
          scheduledTime,
        },
        status: 'pending',
        createdAt: new Date(),
        scheduledFor: scheduledTime,
      };

      // إضافة المهمة إلى قائمة المهام المجدولة
      this.scheduledCalls.set(scheduleId, scheduledTask);

      // جدولة التنفيذ
      const timeUntilExecution = scheduledTime.getTime() - Date.now();
      if (timeUntilExecution > 0) {
        setTimeout(async () => {
          await this.executeScheduledAICall(scheduledTask);
        }, timeUntilExecution);
      }

      return {
        success: true,
        scheduleId,
        message: 'تم جدولة المكالمة بالذكاء الاصطناعي بنجاح',
        scheduledFor: scheduledTime,
      };

    } catch (error) {
      console.error('❌ Schedule AI call error:', error);
      throw error;
    }
  }

  private async executeScheduledAICall(scheduledTask: any): Promise<void> {
    try {
      console.log(`⏰ Executing scheduled AI call: ${scheduledTask.id}`);

      // تحديث حالة المهمة
      scheduledTask.status = 'running';

      // تنفيذ المكالمة
      await this.makeAICall(
        scheduledTask.data.phoneNumber,
        scheduledTask.data.contactName,
        scheduledTask.data.voice,
        scheduledTask.data.reason,
        true
      );

      // تحديث حالة المهمة
      scheduledTask.status = 'completed';
      scheduledTask.completedAt = new Date();

      // إزالة من القائمة المجدولة
      this.scheduledCalls.delete(scheduledTask.id);

    } catch (error) {
      console.error('❌ Execute scheduled AI call error:', error);
      scheduledTask.status = 'failed';
      scheduledTask.error = error.message;
    }
  }

  private async initiateAICall(aiContext: any): Promise<void> {
    try {
      // إعداد الذكاء الاصطناعي للمكالمة
      await this.setupAIConversation(aiContext);

      // بدء المكالمة
      const callResult = await this.startCall(aiContext.phoneNumber);

      if (callResult.success) {
        // بدء المحادثة بالذكاء الاصطناعي
        await this.startAIConversation(aiContext);
      }

    } catch (error) {
      console.error('❌ Initiate AI call error:', error);
      throw error;
    }
  }

  private async setupAIConversation(aiContext: any): Promise<void> {
    try {
      // إعداد سياق المحادثة باللهجة المصرية
      const conversationContext = {
        language: 'ar-EG',
        dialect: 'egyptian',
        voice: aiContext.voice,
        callReason: aiContext.reason,
        contactName: aiContext.contactName,
        greeting: this.generateEgyptianGreeting(aiContext.voice, aiContext.contactName),
        conversationFlow: this.generateConversationFlow(aiContext.reason),
      };

      // حفظ سياق المحادثة
      this.activeAIConversations.set(aiContext.callId, {
        ...aiContext,
        conversationContext,
        status: 'active',
        startTime: new Date(),
      });

    } catch (error) {
      console.error('❌ Setup AI conversation error:', error);
      throw error;
    }
  }

  private async startAIConversation(aiContext: any): Promise<void> {
    try {
      const conversation = this.activeAIConversations.get(aiContext.callId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // بدء المحادثة مع الذكاء الاصطناعي
      const aiTask = {
        id: Date.now().toString(),
        type: 'ai_conversation',
        priority: 'high',
        description: 'بدء محادثة بالذكاء الاصطناعي',
        data: {
          action: 'startConversation',
          context: conversation.conversationContext,
          voice: aiContext.voice,
        },
        status: 'pending',
        createdAt: new Date(),
      };

      await aiAgent.executeTask(aiTask);

      console.log(`✅ AI conversation started for call: ${aiContext.callId}`);

    } catch (error) {
      console.error('❌ Start AI conversation error:', error);
      throw error;
    }
  }

  // الرد على المكالمات الواردة بالذكاء الاصطناعي
  private async startAIReply(
    phoneNumber: string,
    contactName?: string,
    voice?: AIVoice,
    isIncomingCall: boolean = true
  ): Promise<{
    success: boolean;
    replyId: string;
    message: string;
    aiContext: any;
  }> {
    try {
      console.log(`🤖 Starting AI reply for incoming call from ${phoneNumber}`);

      const replyId = `ai_reply_${Date.now()}`;

      // إعداد سياق الرد
      const aiContext = {
        replyId,
        phoneNumber,
        contactName,
        voice: voice || this.getDefaultVoice(),
        dialect: 'egyptian',
        language: 'ar-EG',
        isIncomingCall,
        timestamp: new Date(),
        greeting: this.generateEgyptianGreeting(voice, contactName, true),
        replyStrategy: this.generateReplyStrategy(contactName),
      };

      // بدء الرد بالذكاء الاصطناعي
      await this.initiateAIReply(aiContext);

      // تسجيل الرد
      await this.logAIReply(aiContext);

      return {
        success: true,
        replyId,
        message: 'تم بدء الرد بالذكاء الاصطناعي بنجاح',
        aiContext,
      };

    } catch (error) {
      console.error('❌ Start AI reply error:', error);
      throw error;
    }
  }

  private async stopAIReply(
    phoneNumber: string,
    contactName?: string
  ): Promise<{
    success: boolean;
    message: string;
    duration: number;
  }> {
    try {
      console.log(`🛑 Stopping AI reply for ${phoneNumber}`);

      // البحث عن المحادثة النشطة
      let activeConversation: any = null;
      for (const [id, conversation] of this.activeAIConversations) {
        if (conversation.phoneNumber === phoneNumber && conversation.status === 'active') {
          activeConversation = conversation;
          break;
        }
      }

      if (!activeConversation) {
        throw new Error('No active AI conversation found');
      }

      // إيقاف المحادثة
      const stopTask = {
        id: Date.now().toString(),
        type: 'ai_conversation_stop',
        priority: 'high',
        description: 'إيقاف محادثة الذكاء الاصطناعي',
        data: {
          action: 'stopConversation',
          conversationId: activeConversation.callId || activeConversation.replyId,
        },
        status: 'pending',
        createdAt: new Date(),
      };

      await aiAgent.executeTask(stopTask);

      // تحديث حالة المحادثة
      activeConversation.status = 'stopped';
      activeConversation.endTime = new Date();
      activeConversation.duration = activeConversation.endTime.getTime() - activeConversation.startTime.getTime();

      return {
        success: true,
        message: 'تم إيقاف الرد بالذكاء الاصطناعي بنجاح',
        duration: activeConversation.duration,
      };

    } catch (error) {
      console.error('❌ Stop AI reply error:', error);
      throw error;
    }
  }

  private async initiateAIReply(aiContext: any): Promise<void> {
    try {
      // إعداد سياق الرد
      const replyContext = {
        language: 'ar-EG',
        dialect: 'egyptian',
        voice: aiContext.voice,
        greeting: aiContext.greeting,
        replyStrategy: aiContext.replyStrategy,
        isIncomingCall: aiContext.isIncomingCall,
      };

      // حفظ سياق الرد
      this.activeAIConversations.set(aiContext.replyId, {
        ...aiContext,
        replyContext,
        status: 'active',
        startTime: new Date(),
      });

      // بدء المحادثة
      await this.startAIConversation(aiContext);

    } catch (error) {
      console.error('❌ Initiate AI reply error:', error);
      throw error;
    }
  }

  // توليد التحيات باللهجة المصرية
  private generateEgyptianGreeting(voice?: AIVoice, contactName?: string, isReply: boolean = false): string {
    const greetings = {
      male: {
        young: isReply ? 'أهلاً وسهلاً، إزيك؟' : 'أهلاً وسهلاً، إزيك؟',
        elder: isReply ? 'أهلاً وسهلاً، إزيك يا فندم؟' : 'أهلاً وسهلاً، إزيك يا فندم؟',
        child: isReply ? 'أهلاً وسهلاً، إزيك يا حبيبي؟' : 'أهلاً وسهلاً، إزيك يا حبيبي؟',
      },
      female: {
        young: isReply ? 'أهلاً وسهلاً، إزيك؟' : 'أهلاً وسهلاً، إزيك؟',
        elder: isReply ? 'أهلاً وسهلاً، إزيك يا فندمة؟' : 'أهلاً وسهلاً، إزيك يا فندمة؟',
        child: isReply ? 'أهلاً وسهلاً، إزيك يا حبيبتي؟' : 'أهلاً وسهلاً، إزيك يا حبيبتي؟',
      },
    };

    if (contactName) {
      const gender = voice?.gender || 'male';
      const age = voice?.age || 'young';
      const greeting = greetings[gender]?.[age] || greetings.male.young;
      return `${greeting} أنا ${contactName}`;
    }

    return greetings.male.young;
  }

  // توليد استراتيجية المحادثة
  private generateConversationFlow(reason?: string): any {
    const flows = {
      default: [
        'greeting',
        'introduction',
        'purpose',
        'conversation',
        'closing',
      ],
      business: [
        'greeting',
        'introduction',
        'business_purpose',
        'discussion',
        'next_steps',
        'closing',
      ],
      personal: [
        'greeting',
        'introduction',
        'personal_purpose',
        'casual_conversation',
        'closing',
      ],
    };

    if (reason?.includes('عمل') || reason?.includes('business')) {
      return flows.business;
    } else if (reason?.includes('شخصي') || reason?.includes('personal')) {
      return flows.personal;
    }

    return flows.default;
  }

  // توليد استراتيجية الرد
  private generateReplyStrategy(contactName?: string): any {
    return {
      approach: 'friendly',
      tone: 'helpful',
      responseType: 'conversational',
      fallback: 'transfer_to_human',
      customGreeting: contactName ? `أهلاً وسهلاً ${contactName}` : 'أهلاً وسهلاً',
    };
  }

  // الحصول على الصوت الافتراضي
  private getDefaultVoice(): AIVoice {
    return {
      id: 'egyptian_male_default',
      name: 'أحمد - شاب مصري',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'young',
      description: 'صوت شاب مصري افتراضي',
      previewUrl: '',
      isLocal: true,
    };
  }

  // تسجيل المكالمات بالذكاء الاصطناعي
  private async logAICall(aiContext: any): Promise<void> {
    try {
      const callLog = {
        id: aiContext.callId,
        phoneNumber: aiContext.phoneNumber,
        contactName: aiContext.contactName,
        type: 'ai_outgoing',
        startTime: aiContext.timestamp,
        duration: 0,
        isAICall: true,
        aiVoice: aiContext.voice.name,
        aiReason: aiContext.reason,
        status: 'initiated',
      };

      await databaseService.addCallLog(callLog);

    } catch (error) {
      console.error('❌ Log AI call error:', error);
    }
  }

  // تسجيل الرد بالذكاء الاصطناعي
  private async logAIReply(aiContext: any): Promise<void> {
    try {
      const replyLog = {
        id: aiContext.replyId,
        phoneNumber: aiContext.phoneNumber,
        contactName: aiContext.contactName,
        type: 'ai_incoming',
        startTime: aiContext.timestamp,
        duration: 0,
        isAIReply: true,
        aiVoice: aiContext.voice.name,
        status: 'active',
      };

      await databaseService.addCallLog(replyLog);

    } catch (error) {
      console.error('❌ Log AI reply error:', error);
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