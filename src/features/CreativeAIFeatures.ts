// ========================================
// Creative AI Features - Main Integration
// الميزات الإبداعية للذكاء الاصطناعي - التكامل الرئيسي
// ========================================

import { aiCharacterSystem } from './AICharacters';
import { callMoodSystem } from './CallMoodSystem';
import { userLearningSystem } from './UserLearningSystem';
import { callScenariosSystem } from './CallScenarios';
import { callTheater } from './CallTheater';
import { interactiveCallSystem } from './InteractiveCalls';
import { personalityBasedCallSystem } from './PersonalityBasedCalls';

export interface CreativeCallExperience {
  id: string;
  userId: string;
  contactId: string;
  personality: any;
  mood: any;
  scenario: any;
  theater: any;
  interactive: any;
  learning: any;
  startTime: Date;
  status: 'preparing' | 'active' | 'completed' | 'failed';
}

export interface CreativeCallConfig {
  enableCharacters: boolean;
  enableMoodDetection: boolean;
  enableLearning: boolean;
  enableScenarios: boolean;
  enableTheater: boolean;
  enableInteractive: boolean;
  enablePersonality: boolean;
  customSettings: Record<string, any>;
}

export class CreativeAIFeatures {
  private activeExperiences: Map<string, CreativeCallExperience> = new Map();
  private configuration: CreativeCallConfig;
  private isSystemActive: boolean = true;

  constructor() {
    this.initializeConfiguration();
    this.initializeSystem();
  }

  private initializeConfiguration(): void {
    this.configuration = {
      enableCharacters: true,
      enableMoodDetection: true,
      enableLearning: true,
      enableScenarios: true,
      enableTheater: true,
      enableInteractive: true,
      enablePersonality: true,
      customSettings: {}
    };
  }

  private async initializeSystem(): Promise<void> {
    try {
      console.log('🚀 Initializing Creative AI Features System...');
      
      // التأكد من أن جميع الأنظمة الفرعية تعمل
      await this.validateSubSystems();
      
      // بدء عملية التعلم
      if (this.configuration.enableLearning) {
        await userLearningSystem.learnFromUserBehavior();
      }
      
      console.log('✅ Creative AI Features System initialized successfully');
    } catch (error) {
      console.error('❌ Initialize Creative AI Features error:', error);
      throw error;
    }
  }

  private async validateSubSystems(): Promise<void> {
    const systems = [
      { name: 'AI Characters', system: aiCharacterSystem },
      { name: 'Call Mood', system: callMoodSystem },
      { name: 'User Learning', system: userLearningSystem },
      { name: 'Call Scenarios', system: callScenariosSystem },
      { name: 'Call Theater', system: callTheater },
      { name: 'Interactive Calls', system: interactiveCallSystem },
      { name: 'Personality Based', system: personalityBasedCallSystem }
    ];

    for (const { name, system } of systems) {
      if (!system) {
        throw new Error(`Sub-system ${name} is not available`);
      }
      console.log(`✅ ${name} system validated`);
    }
  }

  // إنشاء تجربة مكالمة إبداعية كاملة
  async createCreativeCallExperience(callData: any): Promise<CreativeCallExperience> {
    try {
      console.log('🎨 Creating creative call experience...');
      
      const experienceId = `creative_${Date.now()}`;
      
      // تحديد الشخصية المناسبة
      let personality = null;
      if (this.configuration.enablePersonality) {
        const personalityMatches = await personalityBasedCallSystem.determineUserPersonality(callData);
        if (personalityMatches.length > 0) {
          personality = personalityMatches[0];
        }
      }

      // تحديد مزاج المكالمة
      let mood = null;
      if (this.configuration.enableMoodDetection) {
        mood = await callMoodSystem.analyzeCallMood({
          reason: callData.callReason || '',
          time: new Date(),
          contact: callData.contact || {},
          userPreferences: callData.userPreferences || {}
        });
      }

      // اختيار السيناريو المناسب
      let scenario = null;
      if (this.configuration.enableScenarios) {
        const scenarios = callScenariosSystem.searchScenarios(callData.callReason || '');
        if (scenarios.length > 0) {
          scenario = scenarios[0];
        }
      }

      // إنشاء تجربة مسرحية
      let theater = null;
      if (this.configuration.enableTheater) {
        theater = await callTheater.createCallExperience({
          urgency: mood?.urgency || 'low',
          emotion: mood?.emotion || 'neutral',
          relationship: mood?.relationship || 'stranger',
          timeContext: mood?.timeContext || 'morning',
          callerPersonality: personality?.profileId || '',
          callerEmotions: mood?.emotion || 'neutral'
        });
      }

      // إنشاء مكالمة تفاعلية
      let interactive = null;
      if (this.configuration.enableInteractive) {
        interactive = await interactiveCallSystem.createInteractiveCall({
          userId: callData.userId,
          contactId: callData.contactId,
          characterId: personality?.profileId || 'friendly_fatima',
          personality: personality?.description || 'ودود ومتعاون',
          preferredStyle: personality?.communicationStyle || 'friendly',
          preferredVoice: personality?.callPreferences?.preferredVoice || 'egyptian_friendly',
          callReason: callData.callReason || 'مكالمة عادية',
          relationship: mood?.relationship || 'friend',
          urgency: mood?.urgency || 'low'
        });
      }

      // تسجيل سلوك المستخدم للتعلم
      if (this.configuration.enableLearning) {
        await userLearningSystem.recordUserBehavior({
          userId: callData.userId,
          timestamp: new Date(),
          action: 'call',
          data: {
            personality: personality?.profileId,
            mood: mood?.emotion,
            scenario: scenario?.id,
            theater: theater?.id,
            interactive: interactive?.id
          },
          success: true,
          context: {
            time: new Date(),
            dayOfWeek: new Date().getDay(),
            isHoliday: false,
            contactType: mood?.relationship || 'friend',
            callReason: callData.callReason || ''
          }
        });
      }

      const experience: CreativeCallExperience = {
        id: experienceId,
        userId: callData.userId,
        contactId: callData.contactId,
        personality,
        mood,
        scenario,
        theater,
        interactive,
        learning: null, // سيتم تحديثه لاحقاً
        startTime: new Date(),
        status: 'preparing'
      };

      this.activeExperiences.set(experienceId, experience);
      
      console.log(`✅ Creative call experience created: ${experienceId}`);
      return experience;
    } catch (error) {
      console.error('❌ Create creative call experience error:', error);
      throw error;
    }
  }

  // بدء التجربة الإبداعية
  async startCreativeExperience(experienceId: string): Promise<boolean> {
    try {
      const experience = this.activeExperiences.get(experienceId);
      if (!experience) {
        throw new Error(`Experience ${experienceId} not found`);
      }

      experience.status = 'active';
      
      // بدء المسرح إذا كان متاحاً
      if (experience.theater && this.configuration.enableTheater) {
        await callTheater.startScene(experience.theater.id);
      }
      
      // بدء المكالمة التفاعلية إذا كانت متاحة
      if (experience.interactive && this.configuration.enableInteractive) {
        // المكالمة التفاعلية تبدأ تلقائياً
        console.log('🎭 Interactive call started');
      }
      
      console.log(`✅ Creative experience started: ${experienceId}`);
      return true;
    } catch (error) {
      console.error('❌ Start creative experience error:', error);
      return false;
    }
  }

  // معالجة رد المستخدم في التجربة الإبداعية
  async processUserResponseInExperience(
    experienceId: string,
    userResponse: string
  ): Promise<{
    aiResponse: string;
    mood: string;
    voice: string;
    suggestedActions: string[];
    theaterUpdate: any;
    personalityAdaptation: any;
  }> {
    try {
      const experience = this.activeExperiences.get(experienceId);
      if (!experience) {
        throw new Error(`Experience ${experienceId} not found`);
      }

      let aiResponse = '';
      let mood = '';
      let voice = '';
      let suggestedActions: string[] = [];
      let theaterUpdate = null;
      let personalityAdaptation = null;

      // معالجة الرد عبر النظام التفاعلي
      if (experience.interactive && this.configuration.enableInteractive) {
        const interactiveResult = await interactiveCallSystem.processUserResponse(
          experience.interactive.id,
          userResponse
        );
        
        aiResponse = interactiveResult.aiResponse;
        mood = interactiveResult.mood;
        voice = interactiveResult.voice;
        suggestedActions = interactiveResult.suggestedActions;
      }

      // تحديث المسرح حسب رد المستخدم
      if (experience.theater && this.configuration.enableTheater) {
        // يمكن إضافة منطق تحديث المسرح هنا
        theaterUpdate = { status: 'updated' };
      }

      // تكيف الشخصية حسب رد المستخدم
      if (experience.personality && this.configuration.enablePersonality) {
        personalityAdaptation = await personalityBasedCallSystem.adaptCallToPersonality(
          experience.personality.profileId,
          { userResponse },
          { userEmotion: mood, callUrgency: experience.mood?.urgency }
        );
      }

      // تسجيل السلوك للتعلم
      if (this.configuration.enableLearning) {
        await userLearningSystem.recordUserBehavior({
          userId: experience.userId,
          timestamp: new Date(),
          action: 'user_response',
          data: {
            response: userResponse,
            aiResponse,
            mood,
            voice
          },
          success: true,
          context: {
            time: new Date(),
            dayOfWeek: new Date().getDay(),
            isHoliday: false,
            contactType: experience.mood?.relationship || 'friend',
            callReason: 'user_response'
          }
        });
      }

      return {
        aiResponse,
        mood,
        voice,
        suggestedActions,
        theaterUpdate,
        personalityAdaptation
      };
    } catch (error) {
      console.error('❌ Process user response in experience error:', error);
      throw error;
    }
  }

  // إنهاء التجربة الإبداعية
  async endCreativeExperience(experienceId: string): Promise<void> {
    try {
      const experience = this.activeExperiences.get(experienceId);
      if (!experience) return;

      experience.status = 'completed';
      
      // إيقاف المسرح
      if (experience.theater && this.configuration.enableTheater) {
        await callTheater.stopScene();
      }
      
      // إنهاء المكالمة التفاعلية
      if (experience.interactive && this.configuration.enableInteractive) {
        await interactiveCallSystem.endInteractiveCall(experience.interactive.id);
      }
      
      // تحديث إحصائيات التعلم
      if (this.configuration.enableLearning) {
        await userLearningSystem.recordUserBehavior({
          userId: experience.userId,
          timestamp: new Date(),
          action: 'call_end',
          data: {
            duration: Date.now() - experience.startTime.getTime(),
            success: true
          },
          success: true,
          context: {
            time: new Date(),
            dayOfWeek: new Date().getDay(),
            isHoliday: false,
            contactType: experience.mood?.relationship || 'friend',
            callReason: 'call_end'
          }
        });
      }
      
      // إزالة من التجارب النشطة
      this.activeExperiences.delete(experienceId);
      
      console.log(`✅ Creative experience ended: ${experienceId}`);
    } catch (error) {
      console.error('❌ End creative experience error:', error);
    }
  }

  // الحصول على اقتراحات إبداعية
  async getCreativeSuggestions(
    userId: string,
    context: any
  ): Promise<{
    characters: any[];
    scenarios: any[];
    theater: any[];
    personality: any;
    learning: any;
  }> {
    try {
      const suggestions: any = {
        characters: [],
        scenarios: [],
        theater: [],
        personality: null,
        learning: null
      };

      // اقتراح شخصيات
      if (this.configuration.enableCharacters) {
        suggestions.characters = aiCharacterSystem.getAllCharacters();
      }

      // اقتراح سيناريوهات
      if (this.configuration.enableScenarios) {
        suggestions.scenarios = callScenariosSystem.searchScenarios(context.callReason || '');
      }

      // اقتراح مشاهد مسرحية
      if (this.configuration.enableTheater) {
        suggestions.theater = callTheater.getAllScenes();
      }

      // اقتراح شخصية مناسبة
      if (this.configuration.enablePersonality) {
        suggestions.personality = await personalityBasedCallSystem.getUserPreferredPersonality(userId);
      }

      // اقتراحات التعلم
      if (this.configuration.enableLearning) {
        suggestions.learning = await userLearningSystem.suggestOptimalSettings(userId);
      }

      return suggestions;
    } catch (error) {
      console.error('❌ Get creative suggestions error:', error);
      return {
        characters: [],
        scenarios: [],
        theater: [],
        personality: null,
        learning: null
      };
    }
  }

  // تحديث إعدادات النظام
  updateConfiguration(newConfig: Partial<CreativeCallConfig>): void {
    try {
      Object.assign(this.configuration, newConfig);
      console.log('⚙️ Configuration updated successfully');
    } catch (error) {
      console.error('❌ Update configuration error:', error);
    }
  }

  // الحصول على الإعدادات الحالية
  getConfiguration(): CreativeCallConfig {
    return { ...this.configuration };
  }

  // الحصول على التجربة النشطة
  getActiveExperience(experienceId: string): CreativeCallExperience | null {
    return this.activeExperiences.get(experienceId) || null;
  }

  // الحصول على جميع التجارب النشطة
  getAllActiveExperiences(): CreativeCallExperience[] {
    return Array.from(this.activeExperiences.values());
  }

  // الحصول على إحصائيات النظام
  getSystemStatistics(): {
    totalExperiences: number;
    activeExperiences: number;
    completedExperiences: number;
    systemHealth: string;
    subSystemsStatus: Record<string, string>;
  } {
    const totalExperiences = this.activeExperiences.size;
    const activeExperiences = Array.from(this.activeExperiences.values())
      .filter(e => e.status === 'active').length;
    const completedExperiences = Array.from(this.activeExperiences.values())
      .filter(e => e.status === 'completed').length;

    const subSystemsStatus = {
      characters: this.configuration.enableCharacters ? 'active' : 'disabled',
      mood: this.configuration.enableMoodDetection ? 'active' : 'disabled',
      learning: this.configuration.enableLearning ? 'active' : 'disabled',
      scenarios: this.configuration.enableScenarios ? 'active' : 'disabled',
      theater: this.configuration.enableTheater ? 'active' : 'disabled',
      interactive: this.configuration.enableInteractive ? 'active' : 'disabled',
      personality: this.configuration.enablePersonality ? 'active' : 'disabled'
    };

    const systemHealth = this.isSystemActive ? 'healthy' : 'unhealthy';

    return {
      totalExperiences,
      activeExperiences,
      completedExperiences,
      systemHealth,
      subSystemsStatus
    };
  }

  // اختبار النظام
  async testSystem(): Promise<{
    success: boolean;
    results: Record<string, any>;
    errors: string[];
  }> {
    const results: Record<string, any> = {};
    const errors: string[] = [];

    try {
      console.log('🧪 Testing Creative AI Features System...');

      // اختبار نظام الشخصيات
      try {
        const characters = aiCharacterSystem.getAllCharacters();
        results.characters = { success: true, count: characters.length };
      } catch (error) {
        results.characters = { success: false, error: error.message };
        errors.push(`Characters system: ${error.message}`);
      }

      // اختبار نظام مزاج المكالمات
      try {
        const mood = await callMoodSystem.analyzeCallMood({
          reason: 'اختبار النظام',
          time: new Date(),
          contact: { name: 'مستخدم اختبار' },
          userPreferences: {}
        });
        results.mood = { success: true, detected: mood.emotion };
      } catch (error) {
        results.mood = { success: false, error: error.message };
        errors.push(`Mood system: ${error.message}`);
      }

      // اختبار نظام التعلم
      try {
        const stats = userLearningSystem.getLearningStats('test_user');
        results.learning = { success: true, stats };
      } catch (error) {
        results.learning = { success: false, error: error.message };
        errors.push(`Learning system: ${error.message}`);
      }

      // اختبار نظام السيناريوهات
      try {
        const scenarios = callScenariosSystem.getAllScenarios();
        results.scenarios = { success: true, count: scenarios.length };
      } catch (error) {
        results.scenarios = { success: false, error: error.message };
        errors.push(`Scenarios system: ${error.message}`);
      }

      // اختبار نظام المسرح
      try {
        const scenes = callTheater.getAllScenes();
        results.theater = { success: true, count: scenes.length };
      } catch (error) {
        results.theater = { success: false, error: error.message };
        errors.push(`Theater system: ${error.message}`);
      }

      // اختبار النظام التفاعلي
      try {
        const stats = interactiveCallSystem.getSystemStatistics();
        results.interactive = { success: true, stats };
      } catch (error) {
        results.interactive = { success: false, error: error.message };
        errors.push(`Interactive system: ${error.message}`);
      }

      // اختبار نظام الشخصيات
      try {
        const personalities = personalityBasedCallSystem.getAllPersonalities();
        results.personality = { success: true, count: personalities.length };
      } catch (error) {
        results.personality = { success: false, error: error.message };
        errors.push(`Personality system: ${error.message}`);
      }

      const success = errors.length === 0;
      console.log(`✅ System test completed. Success: ${success}, Errors: ${errors.length}`);

      return { success, results, errors };
    } catch (error) {
      console.error('❌ System test error:', error);
      return { success: false, results: {}, errors: [error.message] };
    }
  }

  // تنظيف النظام
  async cleanup(): Promise<void> {
    try {
      console.log('🧹 Cleaning up Creative AI Features System...');

      // إنهاء جميع التجارب النشطة
      for (const [experienceId, experience] of this.activeExperiences) {
        if (experience.status === 'active') {
          await this.endCreativeExperience(experienceId);
        }
      }

      // تنظيف الأنظمة الفرعية
      callTheater.cleanup();
      interactiveCallSystem.cleanup();
      personalityBasedCallSystem.cleanup();

      // تنظيف التجارب
      this.activeExperiences.clear();

      console.log('✅ Creative AI Features System cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }

  // إعادة تشغيل النظام
  async restart(): Promise<void> {
    try {
      console.log('🔄 Restarting Creative AI Features System...');
      
      await this.cleanup();
      await this.initializeSystem();
      
      console.log('✅ Creative AI Features System restarted successfully');
    } catch (error) {
      console.error('❌ Restart error:', error);
      throw error;
    }
  }
}

// تصدير نسخة واحدة من النظام
export const creativeAIFeatures = new CreativeAIFeatures();

// تصدير جميع الأنظمة الفرعية
export {
  aiCharacterSystem,
  callMoodSystem,
  userLearningSystem,
  callScenariosSystem,
  callTheater,
  interactiveCallSystem,
  personalityBasedCallSystem
};