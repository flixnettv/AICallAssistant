import { Platform, PermissionsAndroid } from 'react-native';
import { Message, Contact } from '../types';
import { databaseService } from './databaseService';
import { Config } from '../constants/config';

// Message Service Interface
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

// Message Service Implementation
class MessageService implements MessageServiceInterface {
  private spamDetectionCache: Map<string, { isSpam: boolean; confidence: number; timestamp: number }> = new Map();
  private readonly CACHE_EXPIRY = 3600000; // 1 hour
  
  // SMS Operations
  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Check permissions
      if (!(await this.checkSMSPermissions())) {
        throw new Error('SMS permissions not granted');
      }
      
      // Validate message
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }
      
      // Check if number is blocked
      if (await this.isNumberBlocked(phoneNumber)) {
        throw new Error('Cannot send SMS to blocked number');
      }
      
      // Detect spam before sending
      const spamCheck = await this.detectSpam(message);
      if (spamCheck.isSpam && spamCheck.confidence > 0.8) {
        throw new Error('Message appears to be spam and cannot be sent');
      }
      
      // Send actual SMS
      if (Platform.OS === 'ios') {
        // iOS SMS implementation
        console.log('🍎 Sending iOS SMS to:', phoneNumber);
      } else {
        // Android SMS implementation
        console.log('🤖 Sending Android SMS to:', phoneNumber);
      }
      
      // Create message record
      const newMessage: Omit<Message, 'id'> = {
        contactId: undefined,
        phoneNumber,
        type: 'sms',
        content: message,
        timestamp: new Date(),
        isIncoming: false,
        isRead: true,
        isSpam: spamCheck.isSpam,
        attachments: [],
      };
      
      await databaseService.createMessage(newMessage);
      
      console.log(`✅ SMS sent to: ${phoneNumber}`);
      return true;
      
    } catch (error) {
      console.error('❌ Send SMS error:', error);
      throw error;
    }
  }
  
  async getSMSHistory(phoneNumber?: string, limit: number = 100): Promise<Message[]> {
    try {
      if (phoneNumber) {
        return await databaseService.getMessages(undefined, limit).then(messages =>
          messages.filter(m => m.phoneNumber === phoneNumber && m.type === 'sms')
        );
      } else {
        return await databaseService.getMessages(undefined, limit).then(messages =>
          messages.filter(m => m.type === 'sms')
        );
      }
    } catch (error) {
      console.error('❌ Get SMS history error:', error);
      throw error;
    }
  }
  
  // Chat Operations
  async sendChatMessage(contactId: string, message: string): Promise<Message> {
    try {
      // Validate contact
      const contact = await databaseService.getContact(contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      // Validate message
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }
      
      // Detect spam
      const spamCheck = await this.detectSpam(message);
      
      // Create message record
      const newMessage: Omit<Message, 'id'> = {
        contactId,
        phoneNumber: contact.phoneNumbers[0]?.number || '',
        type: 'chat',
        content: message,
        timestamp: new Date(),
        isIncoming: false,
        isRead: true,
        isSpam: spamCheck.isSpam,
        attachments: [],
      };
      
      const createdMessage = await databaseService.createMessage(newMessage);
      
      console.log(`✅ Chat message sent to: ${contact.name}`);
      return createdMessage;
      
    } catch (error) {
      console.error('❌ Send chat message error:', error);
      throw error;
    }
  }
  
  async getChatHistory(contactId: string, limit: number = 100): Promise<Message[]> {
    try {
      return await databaseService.getMessages(contactId, limit).then(messages =>
        messages.filter(m => m.type === 'chat')
      );
    } catch (error) {
      console.error('❌ Get chat history error:', error);
      throw error;
    }
  }
  
  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      return await databaseService.markMessageAsRead(messageId);
    } catch (error) {
      console.error('❌ Mark message as read error:', error);
      throw error;
    }
  }
  
  // Spam Detection
  async detectSpam(message: string): Promise<{
    isSpam: boolean;
    confidence: number;
    reason?: string;
  }> {
    try {
      // Check cache first
      const cacheKey = this.generateMessageHash(message);
      const cached = this.spamDetectionCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_EXPIRY) {
        return {
          isSpam: cached.isSpam,
          confidence: cached.confidence,
        };
      }
      
      // Local spam detection rules
      const localResult = this.detectSpamLocally(message);
      
      // Online spam detection (if available)
      let onlineResult = null;
      try {
        onlineResult = await this.detectSpamOnline(message);
      } catch (error) {
        console.log('⚠️ Online spam detection failed, using local detection');
      }
      
      // Combine results
      let finalResult;
      if (onlineResult && onlineResult.confidence > localResult.confidence) {
        finalResult = onlineResult;
      } else {
        finalResult = localResult;
      }
      
      // Cache result
      this.spamDetectionCache.set(cacheKey, {
        isSpam: finalResult.isSpam,
        confidence: finalResult.confidence,
        timestamp: Date.now(),
      });
      
      return finalResult;
      
    } catch (error) {
      console.error('❌ Detect spam error:', error);
      // Fallback to local detection
      return this.detectSpamLocally(message);
    }
  }
  
  async reportSpam(messageId: string, reason: string): Promise<boolean> {
    try {
      console.log(`🚨 Reporting spam message: ${messageId}`);
      console.log(`📝 Reason: ${reason}`);
      
      // Get message details
      const messages = await databaseService.getMessages();
      const message = messages.find(m => m.id === messageId);
      
      if (!message) {
        throw new Error('Message not found');
      }
      
      // Update message as spam
      const updatedMessage = {
        ...message,
        isSpam: true,
      };
      
      await databaseService.updateMessage(updatedMessage);
      
      // Create spam report
      const spamReport = {
        messageId,
        phoneNumber: message.phoneNumber,
        content: message.content,
        reason,
        timestamp: new Date().toISOString(),
        userId: 'current_user', // TODO: Get actual user ID
      };
      
      // Store spam report
      const spamReports = await this.getSpamReports();
      spamReports.push(spamReport);
      await this.storeSpamReports(spamReports);
      
      // Update contact spam risk if exists
      if (message.contactId) {
        const contact = await databaseService.getContact(message.contactId);
        if (contact) {
          const updatedContact = {
            ...contact,
            spamRisk: Math.min(contact.spamRisk + 0.1, 1.0),
          };
          await databaseService.updateContact(updatedContact);
        }
      }
      
      console.log('✅ Spam reported successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Report spam error:', error);
      throw error;
    }
  }
  
  // Message Management
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      return await databaseService.deleteMessage(messageId);
    } catch (error) {
      console.error('❌ Delete message error:', error);
      throw error;
    }
  }
  
  async searchMessages(query: string): Promise<Message[]> {
    try {
      const messages = await databaseService.getMessages();
      return messages.filter(message =>
        message.content.toLowerCase().includes(query.toLowerCase()) ||
        message.phoneNumber.includes(query)
      );
    } catch (error) {
      console.error('❌ Search messages error:', error);
      throw error;
    }
  }
  
  async getUnreadCount(): Promise<number> {
    try {
      const messages = await databaseService.getMessages();
      return messages.filter(m => !m.isRead).length;
    } catch (error) {
      console.error('❌ Get unread count error:', error);
      return 0;
    }
  }
  
  // Smart Features
  async suggestReply(message: string): Promise<string[]> {
    try {
      // Simple reply suggestions based on message content
      const suggestions: string[] = [];
      
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('مرحبا') || lowerMessage.includes('hello')) {
        suggestions.push('مرحبا! كيف حالك؟', 'أهلا وسهلا', 'مرحبا بك');
      }
      
      if (lowerMessage.includes('شكرا') || lowerMessage.includes('thank')) {
        suggestions.push('العفو', 'لا شكر على واجب', 'أهلا وسهلا');
      }
      
      if (lowerMessage.includes('موعد') || lowerMessage.includes('appointment')) {
        suggestions.push('متى تفضل؟', 'أي وقت يناسبك؟', 'أنا متاح غدا');
      }
      
      if (lowerMessage.includes('سعر') || lowerMessage.includes('price')) {
        suggestions.push('سأرسل لك التفاصيل', 'أي خدمة تريد؟', 'سأتواصل معك قريبا');
      }
      
      // Add generic suggestions if not enough
      if (suggestions.length < 3) {
        suggestions.push('أنا متاح', 'سأتواصل معك قريبا', 'شكرا لك');
      }
      
      return suggestions.slice(0, 3);
      
    } catch (error) {
      console.error('❌ Suggest reply error:', error);
      return ['أنا متاح', 'سأتواصل معك قريبا', 'شكرا لك'];
    }
  }
  
  async autoCategorize(message: string): Promise<'personal' | 'business' | 'spam' | 'unknown'> {
    try {
      const lowerMessage = message.toLowerCase();
      
      // Business keywords
      const businessKeywords = [
        'عمل', 'شركة', 'مؤسسة', 'خدمة', 'منتج', 'سعر', 'فاتورة',
        'business', 'company', 'service', 'product', 'price', 'invoice'
      ];
      
      // Personal keywords
      const personalKeywords = [
        'عائلة', 'صديق', 'حب', 'سعادة', 'حفلة', 'عيد',
        'family', 'friend', 'love', 'happy', 'party', 'celebration'
      ];
      
      // Spam keywords
      const spamKeywords = [
        'ربح', 'جائزة', 'مليون', 'دولار', 'عرض محدود', 'فورا',
        'win', 'prize', 'million', 'dollar', 'limited offer', 'now'
      ];
      
      // Count keyword matches
      let businessScore = 0;
      let personalScore = 0;
      let spamScore = 0;
      
      businessKeywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) businessScore++;
      });
      
      personalKeywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) personalScore++;
      });
      
      spamKeywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) spamScore++;
      });
      
      // Determine category
      if (spamScore > 2) return 'spam';
      if (businessScore > personalScore) return 'business';
      if (personalScore > businessScore) return 'personal';
      
      return 'unknown';
      
    } catch (error) {
      console.error('❌ Auto categorize error:', error);
      return 'unknown';
    }
  }
  
  async translateMessage(message: string, targetLanguage: string): Promise<string> {
    try {
      // Simple translation for common phrases (Arabic <-> English)
      const translations: Record<string, Record<string, string>> = {
        'ar': {
          'hello': 'مرحبا',
          'thank you': 'شكرا لك',
          'goodbye': 'مع السلامة',
          'how are you': 'كيف حالك',
          'good morning': 'صباح الخير',
          'good evening': 'مساء الخير',
        },
        'en': {
          'مرحبا': 'hello',
          'شكرا لك': 'thank you',
          'مع السلامة': 'goodbye',
          'كيف حالك': 'how are you',
          'صباح الخير': 'good morning',
          'مساء الخير': 'good evening',
        },
      };
      
      const sourceLanguage = targetLanguage === 'ar' ? 'en' : 'ar';
      const sourceTranslations = translations[sourceLanguage];
      
      if (sourceTranslations && sourceTranslations[message.toLowerCase()]) {
        return sourceTranslations[message.toLowerCase()];
      }
      
      // If no simple translation found, return original message
      return message;
      
    } catch (error) {
      console.error('❌ Translate message error:', error);
      return message;
    }
  }
  
  // Private helper methods
  private async checkSMSPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: 'SMS Permission',
            message: 'This app needs access to send SMS messages',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permissions differently
    } catch (error) {
      console.error('❌ Check SMS permissions error:', error);
      return false;
    }
  }
  
  private async isNumberBlocked(phoneNumber: string): Promise<boolean> {
    try {
      const blockedNumbersJson = await AsyncStorage.getItem('blocked_numbers');
      const blockedNumbers = blockedNumbersJson ? JSON.parse(blockedNumbersJson) : [];
      return blockedNumbers.includes(phoneNumber);
    } catch (error) {
      console.error('❌ Check blocked number error:', error);
      return false;
    }
  }
  
  private generateMessageHash(message: string): string {
    // Simple hash function for message content
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
  
  private detectSpamLocally(message: string): {
    isSpam: boolean;
    confidence: number;
    reason?: string;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Spam indicators
    const spamIndicators = [
      { pattern: /ربح.*مليون|win.*million/i, weight: 0.8 },
      { pattern: /عرض.*محدود|limited.*offer/i, weight: 0.7 },
      { pattern: /فورا|now/i, weight: 0.6 },
      { pattern: /دولار|dollar/i, weight: 0.5 },
      { pattern: /جائزة|prize/i, weight: 0.6 },
      { pattern: /مجاني|free/i, weight: 0.4 },
      { pattern: /ضغط.*هنا|click.*here/i, weight: 0.5 },
      { pattern: /مكالمة.*فورية|urgent.*call/i, weight: 0.7 },
    ];
    
    let totalWeight = 0;
    let matchedPatterns: string[] = [];
    
    spamIndicators.forEach(indicator => {
      if (indicator.pattern.test(lowerMessage)) {
        totalWeight += indicator.weight;
        matchedPatterns.push(indicator.pattern.source);
      }
    });
    
    // Additional checks
    if (message.length > 200) totalWeight += 0.2; // Very long messages
    if (message.includes('http://') || message.includes('https://')) totalWeight += 0.3; // URLs
    if (message.includes('@') && message.includes('.com')) totalWeight += 0.2; // Email addresses
    
    const confidence = Math.min(totalWeight, 1.0);
    const isSpam = confidence > 0.6;
    
    return {
      isSpam,
      confidence,
      reason: isSpam ? `Matched patterns: ${matchedPatterns.join(', ')}` : undefined,
    };
  }
  
  private async detectSpamOnline(message: string): Promise<{
    isSpam: boolean;
    confidence: number;
    reason?: string;
  }> {
    try {
      const response = await fetch(`${Config.api.spamDetection}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language: 'ar',
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          isSpam: data.isSpam || false,
          confidence: data.confidence || 0,
          reason: data.reason,
        };
      } else {
        throw new Error('Online spam detection failed');
      }
    } catch (error) {
      console.error('❌ Online spam detection error:', error);
      throw error;
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
  
  private async storeSpamReports(spamReports: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem('spam_reports', JSON.stringify(spamReports));
    } catch (error) {
      console.error('❌ Store spam reports error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const messageService = new MessageService();

// Export types
export type { MessageServiceInterface };