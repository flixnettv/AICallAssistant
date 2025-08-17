// ========================================
// Creative AI Features Demo
// عرض عملي للميزات الإبداعية
// ========================================

import { creativeAIFeatures } from './index';
import { aiCharacterSystem } from './AICharacters';
import { callScenariosSystem } from './CallScenarios';

/**
 * عرض عملي لنظام الشخصيات
 */
export async function demoCharacterSystem(): Promise<void> {
  console.log('🎭 === عرض نظام الشخصيات ===\n');
  
  try {
    // عرض جميع الشخصيات المتاحة
    const characters = aiCharacterSystem.getAllCharacters();
    console.log(`📋 الشخصيات المتاحة (${characters.length}):`);
    
    characters.forEach((char, index) => {
      console.log(`${index + 1}. ${char.name}`);
      console.log(`   الشخصية: ${char.personality}`);
      console.log(`   الوصف: ${char.description}`);
      console.log(`   المزاج: ${char.mood}`);
      console.log(`   أسلوب الترحيب: ${char.greetingStyle}`);
      console.log('');
    });

    // اختيار شخصية للعمل
    console.log('💼 اختيار شخصية للعمل:');
    const businessChar = aiCharacterSystem.selectCharacterByContext(['business', 'professional']);
    if (businessChar) {
      console.log(`✅ تم اختيار: ${businessChar.name}`);
      console.log(`📝 جملة ترحيب: ${businessChar.phrases[0]}`);
    }

    // توليد جملة عشوائية
    console.log('\n🎲 توليد جملة عشوائية:');
    const randomPhrase = aiCharacterSystem.generatePhrase();
    console.log(`💬 "${randomPhrase}"`);

    console.log('\n✅ عرض نظام الشخصيات اكتمل!\n');
  } catch (error) {
    console.error('❌ خطأ في عرض نظام الشخصيات:', error);
  }
}

/**
 * عرض عملي لنظام السيناريوهات
 */
export async function demoScenariosSystem(): Promise<void> {
  console.log('📝 === عرض نظام السيناريوهات ===\n');
  
  try {
    // عرض جميع السيناريوهات
    const scenarios = callScenariosSystem.getAllScenarios();
    console.log(`📚 السيناريوهات المتاحة (${scenarios.length}):`);
    
    scenarios.forEach((scenario, index) => {
      console.log(`${index + 1}. ${scenario.nameAr} (${scenario.name})`);
      console.log(`   الفئة: ${scenario.category}`);
      console.log(`   المزاج: ${scenario.mood}`);
      console.log(`   المدة: ${scenario.duration} ثانية`);
      console.log(`   الاستخدام: ${scenario.usageCount} مرة`);
      console.log(`   معدل النجاح: ${scenario.successRate}%`);
      console.log('');
    });

    // البحث عن سيناريوهات العمل
    console.log('🔍 البحث عن سيناريوهات العمل:');
    const businessScenarios = callScenariosSystem.searchScenarios('عمل');
    console.log(`📊 تم العثور على ${businessScenarios.length} سيناريو للعمل:`);
    
    businessScenarios.forEach((scenario, index) => {
      console.log(`   ${index + 1}. ${scenario.nameAr}`);
    });

    // عرض السيناريوهات الأكثر استخداماً
    console.log('\n🏆 السيناريوهات الأكثر استخداماً:');
    const popularScenarios = callScenariosSystem.getMostUsedScenarios(3);
    popularScenarios.forEach((scenario, index) => {
      console.log(`   ${index + 1}. ${scenario.nameAr} (${scenario.usageCount} مرة)`);
    });

    console.log('\n✅ عرض نظام السيناريوهات اكتمل!\n');
  } catch (error) {
    console.error('❌ خطأ في عرض نظام السيناريوهات:', error);
  }
}

/**
 * عرض عملي للتكامل الشامل
 */
export async function demoFullIntegration(): Promise<void> {
  console.log('🔗 === عرض التكامل الشامل ===\n');
  
  try {
    // إنشاء تجربة مكالمة إبداعية
    console.log('🚀 إنشاء تجربة مكالمة إبداعية...');
    
    const callData = {
      userId: 'demo_user',
      contactId: 'demo_contact',
      phoneNumber: '+201234567890',
      reason: 'تهنئة عيد الميلاد',
      time: new Date(),
      contact: {
        name: 'أحمد محمد',
        relationship: 'friend'
      }
    };

    const experience = await creativeAIFeatures.createCreativeCallExperience(callData);
    console.log(`✅ تم إنشاء التجربة: ${experience.id}`);
    console.log(`📊 الحالة: ${experience.status}`);
    console.log(`⏰ وقت البدء: ${experience.startTime.toLocaleString('ar-EG')}`);

    // عرض تفاصيل التجربة
    console.log('\n📋 تفاصيل التجربة:');
    if (experience.personality) {
      console.log(`👤 الشخصية: ${experience.personality.name || 'غير محدد'}`);
    }
    if (experience.mood) {
      console.log(`😊 المزاج: ${experience.mood.emotion || 'غير محدد'}`);
    }
    if (experience.scenario) {
      console.log(`📝 السيناريو: ${experience.scenario.nameAr || 'غير محدد'}`);
    }

    // بدء التجربة
    console.log('\n🎬 بدء التجربة...');
    const started = await creativeAIFeatures.startCreativeExperience(experience.id);
    
    if (started) {
      console.log('✅ تم بدء التجربة بنجاح!');
      
      // محاكاة رد المستخدم
      console.log('\n💬 محاكاة رد المستخدم...');
      const userResponse = 'أهلاً وسهلاً، كيف حالك؟';
      console.log(`👤 المستخدم: "${userResponse}"`);
      
      const aiResponse = await creativeAIFeatures.processUserResponseInExperience(
        experience.id,
        userResponse
      );
      
      if (aiResponse.success) {
        console.log(`🤖 الذكاء الاصطناعي: "${aiResponse.aiResponse}"`);
        if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
          console.log('💡 الاقتراحات:');
          aiResponse.suggestions.forEach((suggestion, index) => {
            console.log(`   ${index + 1}. ${suggestion}`);
          });
        }
      }

      // إنهاء التجربة
      console.log('\n🏁 إنهاء التجربة...');
      await creativeAIFeatures.endCreativeExperience(experience.id);
      console.log('✅ تم إنهاء التجربة بنجاح!');
    } else {
      console.log('❌ فشل في بدء التجربة');
    }

    console.log('\n✅ عرض التكامل الشامل اكتمل!\n');
  } catch (error) {
    console.error('❌ خطأ في عرض التكامل الشامل:', error);
  }
}

/**
 * عرض عملي للإعدادات والتكوين
 */
export function demoConfiguration(): void {
  console.log('⚙️ === عرض الإعدادات والتكوين ===\n');
  
  try {
    // عرض الإعدادات الحالية
    const config = creativeAIFeatures.getConfiguration();
    console.log('📋 الإعدادات الحالية:');
    console.log(`   الشخصيات: ${config.enableCharacters ? '✅' : '❌'}`);
    console.log(`   اكتشاف المزاج: ${config.enableMoodDetection ? '✅' : '❌'}`);
    console.log(`   التعلم: ${config.enableLearning ? '✅' : '❌'}`);
    console.log(`   السيناريوهات: ${config.enableScenarios ? '✅' : '❌'}`);
    console.log(`   المسرح: ${config.enableTheater ? '✅' : '❌'}`);
    console.log(`   التفاعل: ${config.enableInteractive ? '✅' : '❌'}`);
    console.log(`   الشخصية: ${config.enablePersonality ? '✅' : '❌'}`);

    // عرض إحصائيات النظام
    const stats = creativeAIFeatures.getSystemStatistics();
    console.log('\n📊 إحصائيات النظام:');
    console.log(`   إجمالي التجارب: ${stats.totalExperiences}`);
    console.log(`   التجارب النشطة: ${stats.activeExperiences}`);
    console.log(`   التجارب المكتملة: ${stats.completedExperiences}`);
    console.log(`   التجارب الفاشلة: ${stats.failedExperiences}`);

    // عرض إحصائيات الأنظمة الفرعية
    console.log('\n🔧 إحصائيات الأنظمة الفرعية:');
    if (stats.subsystems.characters) {
      console.log(`   الشخصيات: ${stats.subsystems.characters.totalCharacters}`);
    }
    if (stats.subsystems.scenarios) {
      console.log(`   السيناريوهات: ${stats.subsystems.scenarios.totalScenarios}`);
    }

    console.log('\n✅ عرض الإعدادات والتكوين اكتمل!\n');
  } catch (error) {
    console.error('❌ خطأ في عرض الإعدادات والتكوين:', error);
  }
}

/**
 * عرض عملي شامل
 */
export async function runFullDemo(): Promise<void> {
  console.log('🎉 === بدء العرض العملي الشامل ===\n');
  
  try {
    // اختبار النظام أولاً
    console.log('🔧 اختبار النظام...');
    const systemTest = await creativeAIFeatures.testSystem();
    
    if (systemTest.success) {
      console.log('✅ النظام يعمل بشكل صحيح!\n');
      
      // تشغيل جميع العروض
      await demoCharacterSystem();
      await demoScenariosSystem();
      await demoFullIntegration();
      demoConfiguration();
      
      console.log('🎉 === العرض العملي الشامل اكتمل بنجاح! ===\n');
    } else {
      console.log('❌ النظام يحتاج إلى إصلاح قبل العرض');
      console.log('نتائج الاختبار:', systemTest.results);
    }
  } catch (error) {
    console.error('❌ خطأ في العرض العملي الشامل:', error);
  }
}

/**
 * عرض سريع
 */
export async function runQuickDemo(): Promise<void> {
  console.log('⚡ === عرض سريع ===\n');
  
  try {
    // عرض معلومات سريعة
    const characters = aiCharacterSystem.getAllCharacters();
    const scenarios = callScenariosSystem.getAllScenarios();
    
    console.log(`🎭 الشخصيات: ${characters.length}`);
    console.log(`📝 السيناريوهات: ${scenarios.length}`);
    
    // عرض شخصية عشوائية
    if (characters.length > 0) {
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      console.log(`\n👤 شخصية عشوائية: ${randomChar.name}`);
      console.log(`💬 جملة: "${randomChar.phrases[0]}"`);
    }
    
    // عرض سيناريو عشوائي
    if (scenarios.length > 0) {
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      console.log(`\n📝 سيناريو عشوائي: ${randomScenario.nameAr}`);
      console.log(`🎭 المزاج: ${randomScenario.mood}`);
    }
    
    console.log('\n✅ العرض السريع اكتمل!\n');
  } catch (error) {
    console.error('❌ خطأ في العرض السريع:', error);
  }
}

// تصدير دوال العرض
export {
  demoCharacterSystem,
  demoScenariosSystem,
  demoFullIntegration,
  demoConfiguration,
  runFullDemo,
  runQuickDemo
};