import { AIVoice } from '../types';

// ========================================
// AI Characters System
// شخصيات مختلفة لكل موقف
// ========================================

export interface AICharacter {
  id: string;
  name: string;
  personality: string;
  description: string;
  phrases: string[];
  voice: string;
  mood: 'professional' | 'friendly' | 'casual' | 'formal' | 'emergency' | 'celebratory';
  context: string[];
  greetingStyle: 'formal' | 'casual' | 'friendly' | 'professional';
  responseSpeed: 'slow' | 'normal' | 'fast';
  humorLevel: 'none' | 'low' | 'medium' | 'high';
  empathyLevel: 'low' | 'medium' | 'high';
}

export class AICharacterSystem {
  private characters: Map<string, AICharacter> = new Map();
  private activeCharacter: AICharacter | null = null;

  constructor() {
    this.initializeCharacters();
  }

  private initializeCharacters(): void {
    // شخصية رجل الأعمال
    const businessCharacter: AICharacter = {
      id: 'business_ahmed',
      name: 'أحمد رجل الأعمال',
      personality: 'مهني، محترم، يهتم بالوقت',
      description: 'شخصية احترافية مناسبة للمكالمات التجارية والمواعيد المهمة',
      phrases: [
        'أهلاً وسهلاً، كيف حالك؟',
        'ممكن أعرف إيه السبب؟',
        'أنا سعيد بمساعدتك',
        'وقتك ثمين، سأكون مختصراً',
        'هل يمكننا تحديد موعد؟',
        'شكراً لوقتك الثمين',
        'أتمنى أن نلتقي قريباً'
      ],
      voice: 'egyptian_business_male',
      mood: 'professional',
      context: ['business', 'appointments', 'meetings', 'professional'],
      greetingStyle: 'professional',
      responseSpeed: 'fast',
      humorLevel: 'low',
      empathyLevel: 'medium'
    };

    // شخصية الصديقة
    const friendlyCharacter: AICharacter = {
      id: 'friendly_fatima',
      name: 'فاطمة الصديقة',
      personality: 'ودودة، مرح، تحب النكت',
      description: 'شخصية ودودة مناسبة للمكالمات الشخصية والاجتماعية',
      phrases: [
        'أهلاً يا حبيبي!',
        'إزيك؟',
        'تعال نتكلم شوية',
        'أخبارك إيه؟',
        'أنا مشتاقة ليك',
        'تعال نضحك شوية',
        'أتمنى نلتقي قريب'
      ],
      voice: 'egyptian_friendly_female',
      mood: 'friendly',
      context: ['personal', 'social', 'friends', 'family'],
      greetingStyle: 'casual',
      responseSpeed: 'normal',
      humorLevel: 'high',
      empathyLevel: 'high'
    };

    // شخصية الطوارئ
    const emergencyCharacter: AICharacter = {
      id: 'emergency_mohamed',
      name: 'محمد المسعف',
      personality: 'جدي، سريع، واضح',
      description: 'شخصية جادة مناسبة للطوارئ والحالات المهمة',
      phrases: [
        'أهلاً، إيه المشكلة؟',
        'أنا هنا لمساعدتك',
        'أخبرني بالتفاصيل',
        'هل أنت بخير؟',
        'أحتاج معلومات دقيقة',
        'سأكون معك فوراً',
        'أتمنى أن تكون بخير'
      ],
      voice: 'egyptian_emergency_male',
      mood: 'emergency',
      context: ['emergency', 'urgent', 'medical', 'help'],
      greetingStyle: 'formal',
      responseSpeed: 'fast',
      humorLevel: 'none',
      empathyLevel: 'high'
    };

    // شخصية العائلة
    const familyCharacter: AICharacter = {
      id: 'family_zeinab',
      name: 'زينب العائلة',
      personality: 'حنونة، عاطفية، مهتمة',
      description: 'شخصية عائلية مناسبة للمكالمات العائلية والرعاية',
      phrases: [
        'أهلاً يا حبيبي',
        'إزيك يا عزيزي؟',
        'أنا قلقة عليك',
        'أتمنى أن تكون بخير',
        'هل أكلت كويس؟',
        'نام كويس يا حبيبي',
        'أنا هنا دائماً'
      ],
      voice: 'egyptian_elder_female',
      mood: 'friendly',
      context: ['family', 'care', 'emotional', 'support'],
      greetingStyle: 'casual',
      responseSpeed: 'slow',
      humorLevel: 'low',
      empathyLevel: 'high'
    };

    // شخصية المرح
    const funnyCharacter: AICharacter = {
      id: 'funny_ali',
      name: 'علي المرح',
      personality: 'مضحك، مرح، يحب النكت',
      description: 'شخصية مرح مناسبة للمكالمات الترفيهية والاجتماعية',
      phrases: [
        'أهلاً يا مضحك!',
        'إيه الأخبار؟',
        'تعال نضحك شوية',
        'أنا عارف نكتة حلوة',
        'إيه رأيك في النكتة دي؟',
        'أتمنى نضحك مع بعض',
        'الضحك بيخلي الحياة أحلى'
      ],
      voice: 'egyptian_funny',
      mood: 'casual',
      context: ['entertainment', 'social', 'fun', 'jokes'],
      greetingStyle: 'casual',
      responseSpeed: 'normal',
      humorLevel: 'high',
      empathyLevel: 'medium'
    };

    // شخصية الاحتفال
    const celebratoryCharacter: AICharacter = {
      id: 'celebratory_mariam',
      name: 'مريم الاحتفالية',
      personality: 'مبهجة، متفائلة، تحب الاحتفال',
      description: 'شخصية احتفالية مناسبة للمناسبات السعيدة',
      phrases: [
        'أهلاً وسهلاً!',
        'مبروك!',
        'أنا سعيدة جداً',
        'هذا يوم رائع!',
        'أتمنى لك كل السعادة',
        'احتفل كويس!',
        'أنا معاك في الاحتفال'
      ],
      voice: 'egyptian_child_female',
      mood: 'celebratory',
      context: ['celebration', 'birthday', 'success', 'happy'],
      greetingStyle: 'friendly',
      responseSpeed: 'fast',
      humorLevel: 'medium',
      empathyLevel: 'high'
    };

    // إضافة الشخصيات للنظام
    this.characters.set(businessCharacter.id, businessCharacter);
    this.characters.set(friendlyCharacter.id, friendlyCharacter);
    this.characters.set(emergencyCharacter.id, emergencyCharacter);
    this.characters.set(familyCharacter.id, familyCharacter);
    this.characters.set(funnyCharacter.id, funnyCharacter);
    this.characters.set(celebratoryCharacter.id, celebratoryCharacter);
  }

  // الحصول على جميع الشخصيات
  getAllCharacters(): AICharacter[] {
    return Array.from(this.characters.values());
  }

  // الحصول على شخصية محددة
  getCharacter(characterId: string): AICharacter | null {
    return this.characters.get(characterId) || null;
  }

  // اختيار شخصية حسب السياق
  selectCharacterByContext(context: string[]): AICharacter | null {
    let bestMatch: AICharacter | null = null;
    let bestScore = 0;

    for (const character of this.characters.values()) {
      let score = 0;
      
      // حساب نقاط التطابق
      for (const requiredContext of context) {
        if (character.context.includes(requiredContext)) {
          score += 2;
        }
      }

      // إضافة نقاط إضافية للشخصيات المناسبة
      if (score > bestScore) {
        bestScore = score;
        bestMatch = character;
      }
    }

    return bestMatch;
  }

  // اختيار شخصية حسب المزاج
  selectCharacterByMood(mood: string): AICharacter | null {
    for (const character of this.characters.values()) {
      if (character.mood === mood) {
        return character;
      }
    }
    return null;
  }

  // تعيين الشخصية النشطة
  setActiveCharacter(characterId: string): boolean {
    const character = this.characters.get(characterId);
    if (character) {
      this.activeCharacter = character;
      return true;
    }
    return false;
  }

  // الحصول على الشخصية النشطة
  getActiveCharacter(): AICharacter | null {
    return this.activeCharacter;
  }

  // توليد جملة من الشخصية النشطة
  generatePhrase(): string {
    if (!this.activeCharacter) {
      return 'أهلاً وسهلاً، كيف حالك؟';
    }

    const phrases = this.activeCharacter.phrases;
    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
  }

  // توليد جملة حسب السياق
  generateContextualPhrase(context: string): string {
    if (!this.activeCharacter) {
      return 'أهلاً وسهلاً، كيف حالك؟';
    }

    // البحث عن جمل مناسبة للسياق
    const contextualPhrases = this.activeCharacter.phrases.filter(phrase => 
      phrase.toLowerCase().includes(context.toLowerCase())
    );

    if (contextualPhrases.length > 0) {
      const randomIndex = Math.floor(Math.random() * contextualPhrases.length);
      return contextualPhrases[randomIndex];
    }

    // إذا لم توجد جمل مناسبة، استخدم جملة عشوائية
    return this.generatePhrase();
  }

  // الحصول على معلومات الشخصية
  getCharacterInfo(characterId: string): {
    name: string;
    personality: string;
    description: string;
    voice: string;
    mood: string;
  } | null {
    const character = this.characters.get(characterId);
    if (!character) return null;

    return {
      name: character.name,
      personality: character.personality,
      description: character.description,
      voice: character.voice,
      mood: character.mood
    };
  }

  // البحث عن شخصيات
  searchCharacters(query: string): AICharacter[] {
    const results: AICharacter[] = [];
    const lowerQuery = query.toLowerCase();

    for (const character of this.characters.values()) {
      if (
        character.name.toLowerCase().includes(lowerQuery) ||
        character.personality.toLowerCase().includes(lowerQuery) ||
        character.description.toLowerCase().includes(lowerQuery) ||
        character.context.some(ctx => ctx.toLowerCase().includes(lowerQuery))
      ) {
        results.push(character);
      }
    }

    return results;
  }

  // إضافة شخصية جديدة
  addCharacter(character: AICharacter): boolean {
    if (this.characters.has(character.id)) {
      return false; // الشخصية موجودة بالفعل
    }

    this.characters.set(character.id, character);
    return true;
  }

  // تحديث شخصية موجودة
  updateCharacter(characterId: string, updates: Partial<AICharacter>): boolean {
    const character = this.characters.get(characterId);
    if (!character) {
      return false;
    }

    Object.assign(character, updates);
    return true;
  }

  // حذف شخصية
  removeCharacter(characterId: string): boolean {
    if (this.activeCharacter?.id === characterId) {
      this.activeCharacter = null;
    }
    return this.characters.delete(characterId);
  }

  // الحصول على إحصائيات الشخصيات
  getCharacterStats(): {
    totalCharacters: number;
    charactersByMood: Record<string, number>;
    charactersByContext: Record<string, number>;
  } {
    const stats = {
      totalCharacters: this.characters.size,
      charactersByMood: {} as Record<string, number>,
      charactersByContext: {} as Record<string, number>
    };

    for (const character of this.characters.values()) {
      // إحصائيات المزاج
      stats.charactersByMood[character.mood] = (stats.charactersByMood[character.mood] || 0) + 1;

      // إحصائيات السياق
      for (const context of character.context) {
        stats.charactersByContext[context] = (stats.charactersByContext[context] || 0) + 1;
      }
    }

    return stats;
  }
}

// تصدير نسخة واحدة من النظام
export const aiCharacterSystem = new AICharacterSystem();