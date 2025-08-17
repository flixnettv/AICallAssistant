// ========================================
// Creative AI Features Test Suite
// اختبار شامل لجميع الميزات الإبداعية
// ========================================

import { creativeAIFeatures } from './index';
import { aiCharacterSystem } from './AICharacters';
import { callMoodSystem } from './CallMoodSystem';
import { userLearningSystem } from './UserLearningSystem';
import { callScenariosSystem } from './CallScenarios';
import { callTheater } from './CallTheater';
import { interactiveCallSystem } from './InteractiveCalls';
import { personalityBasedCallSystem } from './PersonalityBasedCalls';

/**
 * اختبار شامل لجميع الميزات الإبداعية
 */
export async function testAllCreativeFeatures(): Promise<void> {
  console.log('🚀 بدء اختبار جميع الميزات الإبداعية...\n');

  try {
    // اختبار النظام الأساسي
    await testBasicSystem();
    
    // اختبار نظام الشخصيات
    await testCharacterSystem();
    
    // اختبار نظام مزاج المكالمة
    await testMoodSystem();
    
    // اختبار نظام التعلم
    await testLearningSystem();
    
    // اختبار نظام السيناريوهات
    await testScenariosSystem();
    
    // اختبار نظام المسرح
    await testTheaterSystem();
    
    // اختبار النظام التفاعلي
    await testInteractiveSystem();
    
    // اختبار نظام الشخصية
    await testPersonalitySystem();
    
    // اختبار التكامل الشامل
    await testFullIntegration();
    
    console.log('✅ جميع الاختبارات اكتملت بنجاح!');
    
  } catch (error) {
    console.error('❌ فشل في الاختبار:', error);
  }
}

/**
 * اختبار النظام الأساسي
 */
async function testBasicSystem(): Promise<void> {
  console.log('🔧 اختبار النظام الأساسي...');
  
  const testResult = await creativeAIFeatures.testSystem();
  console.log('نتيجة اختبار النظام:', testResult);
  
  if (testResult.success) {
    console.log('✅ النظام الأساسي يعمل بشكل صحيح');
  } else {
    console.log('❌ النظام الأساسي يحتاج إلى إصلاح');
  }
  console.log('');
}

/**
 * اختبار نظام الشخصيات
 */
async function testCharacterSystem(): Promise<void> {
  console.log('🎭 اختبار نظام الشخصيات...');
  
  try {
    // الحصول على جميع الشخصيات
    const characters = aiCharacterSystem.getAllCharacters();
    console.log(`تم العثور على ${characters.length} شخصية`);
    
    // اختبار البحث
    const searchResults = aiCharacterSystem.searchCharacters('مصري');
    console.log(`نتائج البحث عن "مصري": ${searchResults.length} شخصية`);
    
    // اختبار اختيار شخصية حسب السياق
    const businessCharacter = aiCharacterSystem.selectCharacterByContext(['business', 'professional']);
    if (businessCharacter) {
      console.log(`الشخصية المختارة للعمل: ${businessCharacter.name}`);
    }
    
    // اختبار توليد جملة
    const phrase = aiCharacterSystem.generatePhrase();
    console.log(`الجملة المولدة: ${phrase}`);
    
    console.log('✅ نظام الشخصيات يعمل بشكل صحيح\n');
  } catch (error) {
    console.error('❌ فشل في اختبار نظام الشخصيات:', error);
  }
}

/**
 * اختبار نظام مزاج المكالمة
 */
async function testMoodSystem(): Promise<void> {
  console.log('😊 اختبار نظام مزاج المكالمة...');
  
  try {
    // إنشاء سياق مكالمة تجريبي
    const callContext = {
      reason: 'تأكيد موعد عمل مهم',
      time: new Date(),
      contact: {
        name: 'أحمد محمد',
        relationship: 'colleague',
        lastCall: new Date(Date.now() - 86400000), // يوم واحد مضى
        callHistory: []
      },
      userPreferences: {
        preferredMood: 'professional',
        preferredVoice: 'egyptian_business_male',
        preferredCharacter: 'business_ahmed'
      }
    };
    
    // تحليل مزاج المكالمة
    const mood = callMoodSystem.analyzeCallMood(callContext);
    console.log('مزاج المكالمة المحلل:', mood);
    
    console.log('✅ نظام مزاج المكالمة يعمل بشكل صحيح\n');
  } catch (error) {
    console.error('❌ فشل في اختبار نظام مزاج المكالمة:', error);
  }
}

/**
 * اختبار نظام التعلم
 */
async function testLearningSystem(): Promise<void> {
  console.log('🧠 اختبار نظام التعلم...');
  
  try {
    // تسجيل سلوك المستخدم
    await userLearningSystem.recordUserBehavior({
      userId: 'test_user',
      timestamp: new Date(),
      action: 'call',
      data: { voice: 'egyptian_male_1', character: 'business_ahmed', success: true },
      success: true,
      feedback: 5,
      context: {
        time: new Date(),
        dayOfWeek: new Date().getDay(),
        isHoliday: false,
        contactType: 'business',
        callReason: 'appointment_confirmation'
      }
    });
    
    // الحصول على الإعدادات المثلى
    const optimalSettings = await userLearningSystem.suggestOptimalSettings('test_user');
    console.log('الإعدادات المثلى المقترحة:', optimalSettings);
    
    // الحصول على إحصائيات التعلم
    const learningStats = userLearningSystem.getLearningStats('test_user');
    console.log('إحصائيات التعلم:', learningStats);
    
    console.log('✅ نظام التعلم يعمل بشكل صحيح\n');
  } catch (error) {
    console.error('❌ فشل في اختبار نظام التعلم:', error);
  }
}

/**
 * اختبار نظام السيناريوهات
 */
async function testScenariosSystem(): Promise<void> {
  console.log('📝 اختبار نظام السيناريوهات...');
  
  try {
    // الحصول على جميع السيناريوهات
    const scenarios = callScenariosSystem.getAllScenarios();
    console.log(`تم العثور على ${scenarios.length} سيناريو`);
    
    // البحث عن سيناريوهات
    const businessScenarios = callScenariosSystem.searchScenarios('عمل');
    console.log(`سيناريوهات العمل: ${businessScenarios.length}`);
    
    // الحصول على السيناريوهات الأكثر استخداماً
    const popularScenarios = callScenariosSystem.getMostUsedScenarios(3);
    console.log('السيناريوهات الأكثر استخداماً:', popularScenarios.map(s => s.name));
    
    console.log('✅ نظام السيناريوهات يعمل بشكل صحيح\n');
  } catch (error) {
    console.error('❌ فشل في اختبار نظام السيناريوهات:', error);
  }
}

/**
 * اختبار نظام المسرح
 */
async function testTheaterSystem(): Promise<void> {
  console.log('🎬 اختبار نظام المسرح...');
  
  try {
    // الحصول على جميع المشاهد
    const scenes = callTheater.getAllScenes();
    console.log(`تم العثور على ${scenes.length} مشهد`);
    
    // البحث عن مشاهد
    const officeScenes = callTheater.searchScenes('مكتب');
    console.log(`مشاهد المكتب: ${officeScenes.length}`);
    
    // الحصول على إحصائيات المسرح
    const theaterStats = callTheater.getTheaterStats();
    console.log('إحصائيات المسرح:', theaterStats);
    
    console.log('✅ نظام المسرح يعمل بشكل صحيح\n');
  } catch (error) {
    console.error('❌ فشل في اختبار نظام المسرح:', error);
  }
}

/**
 * اختبار النظام التفاعلي
 */
async function testInteractiveSystem(): Promise<void> {
  console.log('💬 اختبار النظام التفاعلي...');
  
  try {
    // إنشاء مكالمة تفاعلية تجريبية
    const callData = {
      userId: 'test_user',
      contactId: 'test_contact',
      phoneNumber: '+201234567890',
      reason: 'تأكيد موعد'
    };
    
    const interactiveCall = await interactiveCallSystem.createInteractiveCall(callData);
    console.log('تم إنشاء مكالمة تفاعلية:', interactiveCall.id);
    
    // معالجة رد المستخدم
    const response = await interactiveCallSystem.processUserResponse(
      interactiveCall.id,
      'أهلاً، أنا أحمد من شركة التقنية'
    );
    console.log('رد الذكاء الاصطناعي:', response);
    
    // إنهاء المكالمة
    await interactiveCallSystem.endInteractiveCall(interactiveCall.id);
    console.log('تم إنهاء المكالمة التفاعلية');
    
    console.log('✅ النظام التفاعلي يعمل بشكل صحيح\n');
  } catch (error) {
    console.error('❌ فشل في اختبار النظام التفاعلي:', error);
  }
}

/**
 * اختبار نظام الشخصية
 */
async function testPersonalitySystem(): Promise<void> {
  console.log('👤 اختبار نظام الشخصية...');
  
  try {
    // تحديد شخصية المستخدم
    const userData = {
      communicationStyle: 'formal',
      callPreferences: { preferredTime: 'morning', preferredDuration: 5 },
      emotionalPatterns: ['professional', 'efficient'],
      relationship: 'business'
    };
    
    const personalityMatches = await personalityBasedCallSystem.determineUserPersonality(userData);
    console.log('تطابقات الشخصية:', personalityMatches);
    
    // الحصول على جميع الشخصيات
    const personalities = personalityBasedCallSystem.getAllPersonalities();
    console.log(`تم العثور على ${personalities.length} شخصية`);
    
    // البحث عن شخصيات
    const formalPersonalities = personalityBasedCallSystem.searchPersonalities('رسمي');
    console.log(`الشخصيات الرسمية: ${formalPersonalities.length}`);
    
    console.log('✅ نظام الشخصية يعمل بشكل صحيح\n');
  } catch (error) {
    console.error('❌ فشل في اختبار نظام الشخصية:', error);
  }
}

/**
 * اختبار التكامل الشامل
 */
async function testFullIntegration(): Promise<void> {
  console.log('🔗 اختبار التكامل الشامل...');
  
  try {
    // إنشاء تجربة مكالمة إبداعية كاملة
    const callData = {
      userId: 'test_user',
      contactId: 'test_contact',
      phoneNumber: '+201234567890',
      reason: 'تأكيد موعد عمل مهم',
      time: new Date(),
      contact: {
        name: 'أحمد محمد',
        relationship: 'colleague'
      }
    };
    
    const creativeExperience = await creativeAIFeatures.createCreativeCallExperience(callData);
    console.log('تم إنشاء تجربة إبداعية:', creativeExperience.id);
    
    // بدء التجربة
    const started = await creativeAIFeatures.startCreativeExperience(creativeExperience.id);
    if (started) {
      console.log('تم بدء التجربة الإبداعية بنجاح');
      
      // معالجة رد المستخدم
      const response = await creativeAIFeatures.processUserResponseInExperience(
        creativeExperience.id,
        'أهلاً، كيف حالك؟'
      );
      console.log('استجابة التجربة الإبداعية:', response);
      
      // إنهاء التجربة
      await creativeAIFeatures.endCreativeExperience(creativeExperience.id);
      console.log('تم إنهاء التجربة الإبداعية');
    }
    
    // الحصول على اقتراحات إبداعية
    const suggestions = await creativeAIFeatures.getCreativeSuggestions('عمل', 'test_user');
    console.log('الاقتراحات الإبداعية:', suggestions);
    
    // الحصول على إحصائيات النظام
    const stats = creativeAIFeatures.getSystemStatistics();
    console.log('إحصائيات النظام:', stats);
    
    console.log('✅ التكامل الشامل يعمل بشكل صحيح\n');
  } catch (error) {
    console.error('❌ فشل في اختبار التكامل الشامل:', error);
  }
}

/**
 * اختبار سريع للنظام
 */
export async function quickTest(): Promise<void> {
  console.log('⚡ اختبار سريع للنظام...\n');
  
  try {
    // اختبار النظام الأساسي
    const systemTest = await creativeAIFeatures.testSystem();
    console.log('نتيجة اختبار النظام:', systemTest.success ? '✅' : '❌');
    
    // اختبار الشخصيات
    const characters = aiCharacterSystem.getAllCharacters();
    console.log('عدد الشخصيات:', characters.length);
    
    // اختبار السيناريوهات
    const scenarios = callScenariosSystem.getAllScenarios();
    console.log('عدد السيناريوهات:', scenarios.length);
    
    // اختبار المسرح
    const scenes = callTheater.getAllScenes();
    console.log('عدد المشاهد:', scenes.length);
    
    console.log('\n✅ الاختبار السريع اكتمل!');
    
  } catch (error) {
    console.error('❌ فشل في الاختبار السريع:', error);
  }
}

/**
 * عرض معلومات النظام
 */
export function showSystemInfo(): void {
  console.log('📊 معلومات النظام:\n');
  
  const config = creativeAIFeatures.getConfiguration();
  console.log('الإعدادات:', config);
  
  const stats = creativeAIFeatures.getSystemStatistics();
  console.log('الإحصائيات:', stats);
  
  const activeExperiences = creativeAIFeatures.getAllActiveExperiences();
  console.log('التجارب النشطة:', activeExperiences.length);
}

// تصدير دوال الاختبار
export {
  testAllCreativeFeatures,
  testBasicSystem,
  testCharacterSystem,
  testMoodSystem,
  testLearningSystem,
  testScenariosSystem,
  testTheaterSystem,
  testInteractiveSystem,
  testPersonalitySystem,
  testFullIntegration,
  quickTest,
  showSystemInfo
};