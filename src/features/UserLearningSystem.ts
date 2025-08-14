// ========================================
// User Learning System
// النظام يتعلم من تفضيلات المستخدم
// ========================================

export interface UserBehavior {
  userId: string;
  timestamp: Date;
  action: 'call' | 'voice_selection' | 'character_selection' | 'time_preference' | 'response_style';
  data: any;
  success: boolean;
  feedback?: number; // 1-5 rating
  context: {
    time: Date;
    dayOfWeek: number;
    isHoliday: boolean;
    weather?: string;
    location?: string;
    contactType: string;
    callReason: string;
  };
}

export interface LearningPattern {
  patternId: string;
  userId: string;
  category: string;
  confidence: number;
  data: any;
  lastUpdated: Date;
  usageCount: number;
  successRate: number;
}

export interface OptimalSettings {
  preferredVoice: string;
  preferredCharacter: string;
  bestCallTimes: string[];
  preferredResponseStyle: string;
  backgroundMusic: string;
  callDuration: number;
  successRate: number;
}

export class UserLearningSystem {
  private userBehaviors: Map<string, UserBehavior[]> = new Map();
  private learningPatterns: Map<string, LearningPattern> = new Map();
  private userPreferences: Map<string, any> = new Map();
  private isLearningEnabled: boolean = true;

  constructor() {
    this.initializeSystem();
  }

  private initializeSystem(): void {
    console.log('🧠 Initializing User Learning System...');
    this.loadUserData();
  }

  // تسجيل سلوك المستخدم
  async recordUserBehavior(behavior: UserBehavior): Promise<void> {
    try {
      if (!this.isLearningEnabled) return;

      // إضافة السلوك لقائمة المستخدم
      if (!this.userBehaviors.has(behavior.userId)) {
        this.userBehaviors.set(behavior.userId, []);
      }
      
      const userBehaviors = this.userBehaviors.get(behavior.userId)!;
      userBehaviors.push(behavior);

      // الاحتفاظ بآخر 1000 سلوك فقط
      if (userBehaviors.length > 1000) {
        userBehaviors.splice(0, userBehaviors.length - 1000);
      }

      // تحديث أنماط التعلم
      await this.updateLearningPatterns(behavior);

      // حفظ البيانات
      await this.saveUserData();

      console.log(`✅ Recorded behavior for user ${behavior.userId}: ${behavior.action}`);
    } catch (error) {
      console.error('❌ Record user behavior error:', error);
    }
  }

  // تحديث أنماط التعلم
  private async updateLearningPatterns(behavior: UserBehavior): Promise<void> {
    try {
      const patternKey = `${behavior.userId}_${behavior.action}_${behavior.context.contactType}`;
      
      if (this.learningPatterns.has(patternKey)) {
        // تحديث النمط الموجود
        const pattern = this.learningPatterns.get(patternKey)!;
        pattern.usageCount++;
        pattern.lastUpdated = new Date();
        
        // تحديث معدل النجاح
        if (behavior.success) {
          pattern.successRate = ((pattern.successRate * (pattern.usageCount - 1)) + 1) / pattern.usageCount;
        } else {
          pattern.successRate = (pattern.successRate * (pattern.usageCount - 1)) / pattern.usageCount;
        }

        // تحديث البيانات
        pattern.data = this.mergePatternData(pattern.data, behavior.data);
        
        // تحديث مستوى الثقة
        pattern.confidence = this.calculateConfidence(pattern);
      } else {
        // إنشاء نمط جديد
        const newPattern: LearningPattern = {
          patternId: patternKey,
          userId: behavior.userId,
          category: behavior.action,
          confidence: 0.5,
          data: behavior.data,
          lastUpdated: new Date(),
          usageCount: 1,
          successRate: behavior.success ? 1 : 0
        };

        newPattern.confidence = this.calculateConfidence(newPattern);
        this.learningPatterns.set(patternKey, newPattern);
      }
    } catch (error) {
      console.error('❌ Update learning patterns error:', error);
    }
  }

  // دمج بيانات النمط
  private mergePatternData(existingData: any, newData: any): any {
    if (!existingData) return newData;
    if (!newData) return existingData;

    const merged = { ...existingData };

    // دمج البيانات حسب النوع
    for (const [key, value] of Object.entries(newData)) {
      if (typeof value === 'number') {
        merged[key] = (merged[key] || 0) + value;
      } else if (Array.isArray(value)) {
        merged[key] = [...(merged[key] || []), ...value];
      } else if (typeof value === 'object') {
        merged[key] = this.mergePatternData(merged[key], value);
      } else {
        merged[key] = value;
      }
    }

    return merged;
  }

  // حساب مستوى الثقة
  private calculateConfidence(pattern: LearningPattern): number {
    let confidence = 0.5; // مستوى ثقة افتراضي

    // زيادة الثقة مع زيادة الاستخدام
    if (pattern.usageCount > 10) confidence += 0.2;
    if (pattern.usageCount > 50) confidence += 0.2;
    if (pattern.usageCount > 100) confidence += 0.1;

    // زيادة الثقة مع ارتفاع معدل النجاح
    if (pattern.successRate > 0.7) confidence += 0.2;
    if (pattern.successRate > 0.9) confidence += 0.1;

    // تقليل الثقة مع مرور الوقت
    const daysSinceUpdate = (Date.now() - pattern.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 30) confidence -= 0.1;
    if (daysSinceUpdate > 90) confidence -= 0.2;

    return Math.min(Math.max(confidence, 0.1), 1.0);
  }

  // التعلم من سلوك المستخدم
  async learnFromUserBehavior(): Promise<void> {
    try {
      console.log('🧠 Learning from user behavior...');

      for (const [userId, behaviors] of this.userBehaviors) {
        // تحليل أنماط المكالمات
        await this.analyzeCallPatterns(userId, behaviors);
        
        // تحليل تفضيلات الصوت
        await this.analyzeVoicePreferences(userId, behaviors);
        
        // تحليل تفضيلات الشخصيات
        await this.analyzeCharacterPreferences(userId, behaviors);
        
        // تحليل أفضل الأوقات
        await this.analyzeTimePreferences(userId, behaviors);
        
        // تحليل أنماط الاستجابة
        await this.analyzeResponsePatterns(userId, behaviors);
      }

      console.log('✅ Learning completed successfully');
    } catch (error) {
      console.error('❌ Learn from user behavior error:', error);
    }
  }

  // تحليل أنماط المكالمات
  private async analyzeCallPatterns(userId: string, behaviors: UserBehavior[]): Promise<void> {
    const callBehaviors = behaviors.filter(b => b.action === 'call');
    
    if (callBehaviors.length === 0) return;

    // تحليل معدل النجاح
    const successRate = callBehaviors.filter(b => b.success).length / callBehaviors.length;
    
    // تحليل مدة المكالمات
    const callDurations = callBehaviors.map(b => b.data.duration || 0).filter(d => d > 0);
    const avgDuration = callDurations.length > 0 ? callDurations.reduce((a, b) => a + b, 0) / callDurations.length : 0;

    // تحديث تفضيلات المستخدم
    this.updateUserPreference(userId, 'call_success_rate', successRate);
    this.updateUserPreference(userId, 'avg_call_duration', avgDuration);
  }

  // تحليل تفضيلات الصوت
  private async analyzeVoicePreferences(userId: string, behaviors: UserBehavior[]): Promise<void> {
    const voiceBehaviors = behaviors.filter(b => b.action === 'voice_selection');
    
    if (voiceBehaviors.length === 0) return;

    // حساب تكرار كل صوت
    const voiceCounts: Record<string, number> = {};
    const voiceSuccess: Record<string, { total: number; success: number }> = {};

    for (const behavior of voiceBehaviors) {
      const voice = behavior.data.voice;
      voiceCounts[voice] = (voiceCounts[voice] || 0) + 1;
      
      if (!voiceSuccess[voice]) {
        voiceSuccess[voice] = { total: 0, success: 0 };
      }
      
      voiceSuccess[voice].total++;
      if (behavior.success) {
        voiceSuccess[voice].success++;
      }
    }

    // تحديد الصوت المفضل
    let preferredVoice = '';
    let maxCount = 0;
    let maxSuccessRate = 0;

    for (const [voice, count] of Object.entries(voiceCounts)) {
      if (count > maxCount) {
        maxCount = count;
        preferredVoice = voice;
      }

      const successRate = voiceSuccess[voice].success / voiceSuccess[voice].total;
      if (successRate > maxSuccessRate) {
        maxSuccessRate = successRate;
      }
    }

    this.updateUserPreference(userId, 'preferred_voice', preferredVoice);
    this.updateUserPreference(userId, 'voice_success_rate', maxSuccessRate);
  }

  // تحليل تفضيلات الشخصيات
  private async analyzeCharacterPreferences(userId: string, behaviors: UserBehavior[]): Promise<void> {
    const characterBehaviors = behaviors.filter(b => b.action === 'character_selection');
    
    if (characterBehaviors.length === 0) return;

    // حساب تكرار كل شخصية
    const characterCounts: Record<string, number> = {};
    const characterSuccess: Record<string, { total: number; success: number }> = {};

    for (const behavior of characterBehaviors) {
      const character = behavior.data.character;
      characterCounts[character] = (characterCounts[character] || 0) + 1;
      
      if (!characterSuccess[character]) {
        characterSuccess[character] = { total: 0, success: 0 };
      }
      
      characterSuccess[character].total++;
      if (behavior.success) {
        characterSuccess[character].success++;
      }
    }

    // تحديد الشخصية المفضلة
    let preferredCharacter = '';
    let maxCount = 0;

    for (const [character, count] of Object.entries(characterCounts)) {
      if (count > maxCount) {
        maxCount = count;
        preferredCharacter = character;
      }
    }

    this.updateUserPreference(userId, 'preferred_character', preferredCharacter);
  }

  // تحليل تفضيلات الوقت
  private async analyzeTimePreferences(userId: string, behaviors: UserBehavior[]): Promise<void> {
    const callBehaviors = behaviors.filter(b => b.action === 'call');
    
    if (callBehaviors.length === 0) return;

    // تحليل الأوقات حسب النجاح
    const timeSuccess: Record<string, { total: number; success: number }> = {};
    const daySuccess: Record<number, { total: number; success: number }> = {};

    for (const behavior of callBehaviors) {
      const hour = behavior.context.time.getHours();
      const day = behavior.context.dayOfWeek;
      
      // تحليل الساعة
      const timeKey = `${hour}:00`;
      if (!timeSuccess[timeKey]) {
        timeSuccess[timeKey] = { total: 0, success: 0 };
      }
      timeSuccess[timeKey].total++;
      if (behavior.success) {
        timeSuccess[timeKey].success++;
      }

      // تحليل اليوم
      if (!daySuccess[day]) {
        daySuccess[day] = { total: 0, success: 0 };
      }
      daySuccess[day].total++;
      if (behavior.success) {
        daySuccess[day].success++;
      }
    }

    // تحديد أفضل الأوقات
    const bestTimes: string[] = [];
    for (const [time, stats] of Object.entries(timeSuccess)) {
      if (stats.total >= 3) { // على الأقل 3 مكالمات
        const successRate = stats.success / stats.total;
        if (successRate > 0.7) { // معدل نجاح أعلى من 70%
          bestTimes.push(time);
        }
      }
    }

    // تحديد أفضل الأيام
    const bestDays: number[] = [];
    for (const [day, stats] of Object.entries(daySuccess)) {
      if (stats.total >= 5) { // على الأقل 5 مكالمات
        const successRate = stats.success / stats.total;
        if (successRate > 0.6) { // معدل نجاح أعلى من 60%
          bestDays.push(parseInt(day));
        }
      }
    }

    this.updateUserPreference(userId, 'best_call_times', bestTimes);
    this.updateUserPreference(userId, 'best_call_days', bestDays);
  }

  // تحليل أنماط الاستجابة
  private async analyzeResponsePatterns(userId: string, behaviors: UserBehavior[]): Promise<void> {
    const callBehaviors = behaviors.filter(b => b.action === 'call');
    
    if (callBehaviors.length === 0) return;

    // تحليل أنماط الاستجابة حسب نوع الاتصال
    const responsePatterns: Record<string, { total: number; success: number; avgDuration: number }> = {};

    for (const behavior of callBehaviors) {
      const contactType = behavior.context.contactType;
      
      if (!responsePatterns[contactType]) {
        responsePatterns[contactType] = { total: 0, success: 0, avgDuration: 0 };
      }

      responsePatterns[contactType].total++;
      if (behavior.success) {
        responsePatterns[contactType].success++;
      }

      const duration = behavior.data.duration || 0;
      if (duration > 0) {
        const currentAvg = responsePatterns[contactType].avgDuration;
        const total = responsePatterns[contactType].total;
        responsePatterns[contactType].avgDuration = (currentAvg * (total - 1) + duration) / total;
      }
    }

    // تحديد أفضل أسلوب استجابة لكل نوع
    for (const [contactType, stats] of Object.entries(responsePatterns)) {
      if (stats.total >= 3) {
        const successRate = stats.success / stats.total;
        let responseStyle = 'formal';

        if (successRate > 0.8) {
          responseStyle = 'casual';
        } else if (successRate > 0.6) {
          responseStyle = 'friendly';
        } else if (successRate > 0.4) {
          responseStyle = 'professional';
        }

        this.updateUserPreference(userId, `response_style_${contactType}`, responseStyle);
      }
    }
  }

  // تحديث تفضيلات المستخدم
  private updateUserPreference(userId: string, key: string, value: any): void {
    if (!this.userPreferences.has(userId)) {
      this.userPreferences.set(userId, {});
    }

    const userPrefs = this.userPreferences.get(userId)!;
    userPrefs[key] = value;
  }

  // اقتراح أفضل الإعدادات
  async suggestOptimalSettings(userId: string): Promise<OptimalSettings> {
    try {
      const userPrefs = this.userPreferences.get(userId) || {};
      const patterns = Array.from(this.learningPatterns.values())
        .filter(p => p.userId === userId);

      const settings: OptimalSettings = {
        preferredVoice: userPrefs.preferred_voice || 'egyptian_friendly_female',
        preferredCharacter: userPrefs.preferred_character || 'friendly_fatima',
        bestCallTimes: userPrefs.best_call_times || ['10:00', '15:00', '19:00'],
        preferredResponseStyle: userPrefs.response_style_family || 'casual',
        backgroundMusic: this.suggestBackgroundMusic(userPrefs),
        callDuration: userPrefs.avg_call_duration || 180, // 3 دقائق افتراضياً
        successRate: userPrefs.call_success_rate || 0.7
      };

      return settings;
    } catch (error) {
      console.error('❌ Suggest optimal settings error:', error);
      return this.getDefaultSettings();
    }
  }

  // اقتراح الموسيقى الخلفية
  private suggestBackgroundMusic(userPrefs: any): string {
    const successRate = userPrefs.call_success_rate || 0.7;
    
    if (successRate > 0.8) return 'upbeat_positive';
    if (successRate > 0.6) return 'calm_productive';
    if (successRate > 0.4) return 'neutral_ambient';
    
    return 'calm_soothing';
  }

  // الحصول على إعدادات افتراضية
  private getDefaultSettings(): OptimalSettings {
    return {
      preferredVoice: 'egyptian_friendly_female',
      preferredCharacter: 'friendly_fatima',
      bestCallTimes: ['10:00', '15:00', '19:00'],
      preferredResponseStyle: 'casual',
      backgroundMusic: 'neutral_calm',
      callDuration: 180,
      successRate: 0.7
    };
  }

  // الحصول على إحصائيات التعلم
  getLearningStats(userId: string): {
    totalBehaviors: number;
    patternsCount: number;
    successRate: number;
    learningProgress: number;
  } {
    const behaviors = this.userBehaviors.get(userId) || [];
    const patterns = Array.from(this.learningPatterns.values())
      .filter(p => p.userId === userId);

    const totalBehaviors = behaviors.length;
    const patternsCount = patterns.length;
    const successRate = behaviors.length > 0 
      ? behaviors.filter(b => b.success).length / behaviors.length 
      : 0;

    // حساب تقدم التعلم (0-100%)
    const learningProgress = Math.min(
      Math.floor((totalBehaviors / 100) * 100), // 100 سلوك = 100%
      100
    );

    return {
      totalBehaviors,
      patternsCount,
      successRate,
      learningProgress
    };
  }

  // تفعيل/إلغاء التعلم
  setLearningEnabled(enabled: boolean): void {
    this.isLearningEnabled = enabled;
    console.log(`🧠 Learning ${enabled ? 'enabled' : 'disabled'}`);
  }

  // حفظ بيانات المستخدم
  private async saveUserData(): Promise<void> {
    try {
      // هنا يمكن حفظ البيانات في AsyncStorage أو قاعدة البيانات
      // للآن سنطبع رسالة تأكيد فقط
      console.log('💾 User data saved successfully');
    } catch (error) {
      console.error('❌ Save user data error:', error);
    }
  }

  // تحميل بيانات المستخدم
  private async loadUserData(): Promise<void> {
    try {
      // هنا يمكن تحميل البيانات من AsyncStorage أو قاعدة البيانات
      console.log('📂 User data loaded successfully');
    } catch (error) {
      console.error('❌ Load user data error:', error);
    }
  }

  // تنظيف البيانات القديمة
  cleanupOldData(daysToKeep: number = 90): void {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      let cleanedCount = 0;

      // تنظيف السلوكيات القديمة
      for (const [userId, behaviors] of this.userBehaviors) {
        const filteredBehaviors = behaviors.filter(b => b.timestamp > cutoffDate);
        if (filteredBehaviors.length !== behaviors.length) {
          this.userBehaviors.set(userId, filteredBehaviors);
          cleanedCount += behaviors.length - filteredBehaviors.length;
        }
      }

      // تنظيف الأنماط القديمة
      for (const [key, pattern] of this.learningPatterns) {
        if (pattern.lastUpdated < cutoffDate) {
          this.learningPatterns.delete(key);
          cleanedCount++;
        }
      }

      console.log(`🧹 Cleaned up ${cleanedCount} old data entries`);
    } catch (error) {
      console.error('❌ Cleanup old data error:', error);
    }
  }

  // تصدير بيانات التعلم
  exportLearningData(userId: string): {
    behaviors: UserBehavior[];
    patterns: LearningPattern[];
    preferences: any;
  } {
    const behaviors = this.userBehaviors.get(userId) || [];
    const patterns = Array.from(this.learningPatterns.values())
      .filter(p => p.userId === userId);
    const preferences = this.userPreferences.get(userId) || {};

    return {
      behaviors,
      patterns,
      preferences
    };
  }

  // استيراد بيانات التعلم
  importLearningData(userId: string, data: {
    behaviors: UserBehavior[];
    patterns: LearningPattern[];
    preferences: any;
  }): void {
    try {
      this.userBehaviors.set(userId, data.behaviors);
      
      for (const pattern of data.patterns) {
        this.learningPatterns.set(pattern.patternId, pattern);
      }
      
      this.userPreferences.set(userId, data.preferences);
      
      console.log(`📥 Learning data imported for user ${userId}`);
    } catch (error) {
      console.error('❌ Import learning data error:', error);
    }
  }
}

// تصدير نسخة واحدة من النظام
export const userLearningSystem = new UserLearningSystem();