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
    console.log('🚀 Initializing Creative AI Features System...');
    
    try {
      await this.validateSubSystems();
      console.log('✅ Creative AI Features System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Creative AI Features System:', error);
      this.isSystemActive = false;
    }
  }

  private async validateSubSystems(): Promise<void> {
    const subsystems = [
      { name: 'AI Characters', system: aiCharacterSystem },
      { name: 'Call Mood', system: callMoodSystem },
      { name: 'User Learning', system: userLearningSystem },
      { name: 'Call Scenarios', system: callScenariosSystem },
      { name: 'Call Theater', system: callTheater },
      { name: 'Interactive Calls', system: interactiveCallSystem },
      { name: 'Personality-Based Calls', system: personalityBasedCallSystem }
    ];

    for (const { name, system } of subsystems) {
      if (system && typeof system === 'object') {
        console.log(`✅ ${name} system validated`);
      } else {
        throw new Error(`${name} system not properly initialized`);
      }
    }
  }

  // إنشاء تجربة مكالمة إبداعية كاملة
  async createCreativeCallExperience(callData: any): Promise<CreativeCallExperience> {
    if (!this.isSystemActive) {
      throw new Error('Creative AI Features System is not active');
    }

    const experienceId = `creative_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const experience: CreativeCallExperience = {
      id: experienceId,
      userId: callData.userId || 'default',
      contactId: callData.contactId || 'unknown',
      personality: await this.getPersonalityForCall(callData),
      mood: await this.getMoodForCall(callData),
      scenario: await this.getScenarioForCall(callData),
      theater: await this.getTheaterForCall(callData),
      interactive: await this.getInteractiveForCall(callData),
      learning: await this.getLearningForCall(callData),
      startTime: new Date(),
      status: 'preparing'
    };

    this.activeExperiences.set(experienceId, experience);
    return experience;
  }

  // الحصول على الشخصية المناسبة للمكالمة
  private async getPersonalityForCall(callData: any): Promise<any> {
    if (!this.configuration.enablePersonality) return null;
    
    try {
      const personality = await personalityBasedCallSystem.determineUserPersonality(callData);
      return personality[0] || null;
    } catch (error) {
      console.warn('Failed to determine personality for call:', error);
      return null;
    }
  }

  // الحصول على مزاج المكالمة
  private async getMoodForCall(callData: any): Promise<any> {
    if (!this.configuration.enableMoodDetection) return null;
    
    try {
      const mood = callMoodSystem.analyzeCallMood(callData);
      return mood;
    } catch (error) {
      console.warn('Failed to analyze call mood:', error);
      return null;
    }
  }

  // الحصول على السيناريو المناسب
  private async getScenarioForCall(callData: any): Promise<any> {
    if (!this.configuration.enableScenarios) return null;
    
    try {
      const scenarios = callScenariosSystem.searchScenarios(callData.reason || '');
      return scenarios[0] || null;
    } catch (error) {
      console.warn('Failed to get scenario for call:', error);
      return null;
    }
  }

  // الحصول على المسرح المناسب
  private async getTheaterForCall(callData: any): Promise<any> {
    if (!this.configuration.enableTheater) return null;
    
    try {
      const scene = await callTheater.createCallExperience(callData);
      return scene;
    } catch (error) {
      console.warn('Failed to create theater experience:', error);
      return null;
    }
  }

  // الحصول على التفاعل المناسب
  private async getInteractiveForCall(callData: any): Promise<any> {
    if (!this.configuration.enableInteractive) return null;
    
    try {
      const interactive = await interactiveCallSystem.createInteractiveCall(callData);
      return interactive;
    } catch (error) {
      console.warn('Failed to create interactive call:', error);
      return null;
    }
  }

  // الحصول على التعلم المناسب
  private async getLearningForCall(callData: any): Promise<any> {
    if (!this.configuration.enableLearning) return null;
    
    try {
      const settings = await userLearningSystem.suggestOptimalSettings(callData.userId || 'default');
      return settings;
    } catch (error) {
      console.warn('Failed to get learning settings:', error);
      return null;
    }
  }

  // بدء التجربة الإبداعية
  async startCreativeExperience(experienceId: string): Promise<boolean> {
    const experience = this.activeExperiences.get(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    try {
      experience.status = 'active';
      
      // بدء المسرح إذا كان متاحاً
      if (experience.theater) {
        await callTheater.startScene(experience.theater.id);
      }

      // بدء المكالمة التفاعلية إذا كانت متاحة
      if (experience.interactive) {
        // يمكن إضافة منطق إضافي هنا
      }

      console.log(`🎭 Creative experience ${experienceId} started successfully`);
      return true;
    } catch (error) {
      console.error('Failed to start creative experience:', error);
      experience.status = 'failed';
      return false;
    }
  }

  // معالجة رد المستخدم في التجربة الإبداعية
  async processUserResponseInExperience(
    experienceId: string, 
    userResponse: string
  ): Promise<{ success: boolean; aiResponse?: string; suggestions?: string[] }> {
    const experience = this.activeExperiences.get(experienceId);
    if (!experience || experience.status !== 'active') {
      throw new Error('Experience not active or not found');
    }

    try {
      let aiResponse = '';
      let suggestions: string[] = [];

      // معالجة الرد من النظام التفاعلي
      if (experience.interactive) {
        const result = await interactiveCallSystem.processUserResponse(
          experience.interactive.id,
          userResponse
        );
        aiResponse = result.aiResponse || '';
        suggestions = result.suggestedActions || [];
      }

      // تحديث التعلم
      if (this.configuration.enableLearning) {
        await userLearningSystem.recordUserBehavior({
          userId: experience.userId,
          timestamp: new Date(),
          action: 'call',
          data: { response: userResponse, aiResponse },
          success: true,
          context: {
            time: new Date(),
            dayOfWeek: new Date().getDay(),
            isHoliday: false,
            contactType: 'call',
            callReason: 'creative_experience'
          }
        });
      }

      return { success: true, aiResponse, suggestions };
    } catch (error) {
      console.error('Failed to process user response:', error);
      return { success: false };
    }
  }

  // إنهاء التجربة الإبداعية
  async endCreativeExperience(experienceId: string): Promise<void> {
    const experience = this.activeExperiences.get(experienceId);
    if (!experience) return;

    try {
      // إيقاف المسرح
      if (experience.theater) {
        await callTheater.stopScene();
      }

      // إنهاء المكالمة التفاعلية
      if (experience.interactive) {
        await interactiveCallSystem.endInteractiveCall(experience.interactive.id);
      }

      experience.status = 'completed';
      this.activeExperiences.delete(experienceId);
      
      console.log(`🎭 Creative experience ${experienceId} ended successfully`);
    } catch (error) {
      console.error('Failed to end creative experience:', error);
      experience.status = 'failed';
    }
  }

  // الحصول على اقتراحات إبداعية
  async getCreativeSuggestions(
    context: string, 
    userId: string
  ): Promise<{ characters: any[]; scenarios: any[]; voices: any[] }> {
    try {
      const characters = aiCharacterSystem.getAllCharacters();
      const scenarios = callScenariosSystem.searchScenarios(context);
      const learningSettings = await userLearningSystem.suggestOptimalSettings(userId);

      return {
        characters: characters.slice(0, 5),
        scenarios: scenarios.slice(0, 5),
        voices: [] // يمكن إضافة منطق لاختيار الأصوات
      };
    } catch (error) {
      console.error('Failed to get creative suggestions:', error);
      return { characters: [], scenarios: [], voices: [] };
    }
  }

  // تحديث إعدادات النظام
  updateConfiguration(newConfig: Partial<CreativeCallConfig>): void {
    this.configuration = { ...this.configuration, ...newConfig };
    console.log('⚙️ Creative AI Features configuration updated');
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
    failedExperiences: number;
    subsystems: Record<string, any>;
  } {
    const experiences = Array.from(this.activeExperiences.values());
    
    return {
      totalExperiences: this.activeExperiences.size,
      activeExperiences: experiences.filter(e => e.status === 'active').length,
      completedExperiences: experiences.filter(e => e.status === 'completed').length,
      failedExperiences: experiences.filter(e => e.status === 'failed').length,
      subsystems: {
        characters: aiCharacterSystem.getCharacterStats(),
        scenarios: callScenariosSystem.getScenarioStats(),
        theater: callTheater.getTheaterStats(),
        interactive: interactiveCallSystem.getSystemStatistics(),
        learning: userLearningSystem.getLearningStats('default'),
        personality: personalityBasedCallSystem.getPersonalityStats()
      }
    };
  }

  // اختبار النظام
  async testSystem(): Promise<{ success: boolean; results: Record<string, any> }> {
    const results: Record<string, any> = {};
    
    try {
      // اختبار النظام الفرعي للشخصيات
      results.characters = aiCharacterSystem.getAllCharacters().length > 0;
      
      // اختبار النظام الفرعي للمزاج
      results.mood = callMoodSystem !== null;
      
      // اختبار النظام الفرعي للتعلم
      results.learning = userLearningSystem !== null;
      
      // اختبار النظام الفرعي للسيناريوهات
      results.scenarios = callScenariosSystem.getAllScenarios().length > 0;
      
      // اختبار النظام الفرعي للمسرح
      results.theater = callTheater !== null;
      
      // اختبار النظام الفرعي التفاعلي
      results.interactive = interactiveCallSystem !== null;
      
      // اختبار النظام الفرعي للشخصية
      results.personality = personalityBasedCallSystem !== null;

      const allTestsPassed = Object.values(results).every(result => result === true);
      
      return {
        success: allTestsPassed,
        results
      };
    } catch (error) {
      console.error('System test failed:', error);
      return {
        success: false,
        results: { error: error.message }
      };
    }
  }

  // تنظيف النظام
  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up Creative AI Features System...');
    
    // إنهاء جميع التجارب النشطة
    const activeExperiences = Array.from(this.activeExperiences.keys());
    for (const experienceId of activeExperiences) {
      await this.endCreativeExperience(experienceId);
    }

    // تنظيف الأنظمة الفرعية
    callTheater.cleanup();
    interactiveCallSystem.cleanup();
    personalityBasedCallSystem.cleanup();
    
    console.log('✅ Creative AI Features System cleaned up');
  }

  // إعادة تشغيل النظام
  async restart(): Promise<void> {
    console.log('🔄 Restarting Creative AI Features System...');
    
    await this.cleanup();
    this.isSystemActive = true;
    await this.initializeSystem();
    
    console.log('✅ Creative AI Features System restarted');
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