// ========================================
// Personality-Based Calls System
// المكالمات المخصصة حسب الشخصية - كل شخص له شخصية مكالمة مختلفة
// ========================================

export interface PersonalityProfile {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  category: 'formal' | 'casual' | 'friendly' | 'professional' | 'intimate' | 'creative';
  characteristics: PersonalityCharacteristic[];
  communicationStyle: CommunicationStyle;
  callPreferences: CallPreferences;
  emotionalPatterns: EmotionalPattern[];
  adaptationRules: AdaptationRule[];
  isActive: boolean;
  usageCount: number;
  successRate: number;
}

export interface PersonalityCharacteristic {
  trait: string;
  strength: number; // 0-1
  description: string;
  examples: string[];
}

export interface CommunicationStyle {
  formality: 'very_formal' | 'formal' | 'semi_formal' | 'casual' | 'very_casual';
  directness: 'very_direct' | 'direct' | 'moderate' | 'indirect' | 'very_indirect';
  pace: 'very_slow' | 'slow' | 'moderate' | 'fast' | 'very_fast';
  detail: 'minimal' | 'brief' | 'moderate' | 'detailed' | 'very_detailed';
  humor: 'none' | 'subtle' | 'moderate' | 'high' | 'very_high';
  empathy: 'low' | 'moderate' | 'high' | 'very_high';
}

export interface CallPreferences {
  preferredVoice: string;
  preferredCharacter: string;
  preferredTime: string[];
  preferredDuration: number;
  backgroundMusic: string;
  callFrequency: 'rare' | 'occasional' | 'regular' | 'frequent' | 'very_frequent';
  responseStyle: 'immediate' | 'thoughtful' | 'deliberate' | 'spontaneous';
}

export interface EmotionalPattern {
  emotion: string;
  triggers: string[];
  responses: string[];
  intensity: number; // 0-1
  duration: number; // بالدقائق
  recoveryTime: number; // بالدقائق
}

export interface AdaptationRule {
  condition: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  parameters: Record<string, any>;
}

export interface PersonalityMatch {
  profileId: string;
  matchScore: number; // 0-1
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  compatibility: 'low' | 'medium' | 'high' | 'excellent';
}

export class PersonalityBasedCallSystem {
  private personalityProfiles: Map<string, PersonalityProfile> = new Map();
  private userPersonalities: Map<string, PersonalityProfile> = new Map();
  private adaptationEngine: Map<string, any> = new Map();
  private isSystemActive: boolean = true;

  constructor() {
    this.initializeSystem();
  }

  private initializeSystem(): void {
    console.log('🎭 Initializing Personality-Based Call System...');
    this.createDefaultPersonalities();
    this.setupAdaptationEngine();
  }

  private createDefaultPersonalities(): void {
    // الشخصية الرسمية
    const formalPersonality: PersonalityProfile = {
      id: 'formal_professional',
      name: 'Formal Professional',
      nameAr: 'شخصية رسمية احترافية',
      description: 'شخصية رسمية ومهنية، تفضل التواصل الرسمي والمحترم',
      category: 'formal',
      characteristics: [
        {
          trait: 'احترافية',
          strength: 0.9,
          description: 'تعتبر الاحترافية قيمة أساسية',
          examples: ['استخدام لغة رسمية', 'الالتزام بالمواعيد', 'الاهتمام بالتفاصيل']
        },
        {
          trait: 'منظمة',
          strength: 0.8,
          description: 'تفضل الهيكل والنظام',
          examples: ['تخطيط المكالمات', 'تنظيم الأفكار', 'متابعة النقاط']
        },
        {
          trait: 'محترمة',
          strength: 0.9,
          description: 'تظهر احتراماً كبيراً للآخرين',
          examples: ['الاستماع الجيد', 'عدم المقاطعة', 'استخدام ألقاب رسمية']
        }
      ],
      communicationStyle: {
        formality: 'very_formal',
        directness: 'direct',
        pace: 'moderate',
        detail: 'detailed',
        humor: 'subtle',
        empathy: 'moderate'
      },
      callPreferences: {
        preferredVoice: 'egyptian_formal_male',
        preferredCharacter: 'business_ahmed',
        preferredTime: ['09:00', '14:00', '16:00'],
        preferredDuration: 15,
        backgroundMusic: 'office_professional',
        callFrequency: 'regular',
        responseStyle: 'thoughtful'
      },
      emotionalPatterns: [
        {
          emotion: 'قلق',
          triggers: ['عدم الالتزام بالمواعيد', 'عدم الاحترام', 'الفوضى'],
          responses: ['طلب توضيح', 'إعادة تأكيد', 'طلب اعتذار'],
          intensity: 0.7,
          duration: 10,
          recoveryTime: 15
        },
        {
          emotion: 'رضا',
          triggers: ['الاحترام', 'الالتزام', 'النظام'],
          responses: ['تقدير', 'تشجيع', 'متابعة'],
          intensity: 0.6,
          duration: 20,
          recoveryTime: 5
        }
      ],
      adaptationRules: [
        {
          condition: 'user_emotion = anxious',
          action: 'provide_reassurance',
          priority: 'high',
          description: 'تقديم طمأنينة عند القلق',
          parameters: { tone: 'calm', pace: 'slow', detail: 'high' }
        },
        {
          condition: 'call_urgency = high',
          action: 'maintain_formality',
          priority: 'critical',
          description: 'الحفاظ على الرسمية في الطوارئ',
          parameters: { formality: 'very_formal', directness: 'very_direct' }
        }
      ],
      isActive: true,
      usageCount: 0,
      successRate: 0.85
    };

    // الشخصية الودية
    const friendlyPersonality: PersonalityProfile = {
      id: 'friendly_warm',
      name: 'Friendly Warm',
      nameAr: 'شخصية ودية دافئة',
      description: 'شخصية ودية ودافئة، تفضل التواصل العاطفي والاجتماعي',
      category: 'friendly',
      characteristics: [
        {
          trait: 'ودية',
          strength: 0.9,
          description: 'تظهر وداً ودفئاً في التواصل',
          examples: ['استخدام أسماء مستعارة', 'مشاركة مشاعر شخصية', 'إظهار الاهتمام']
        },
        {
          trait: 'تعاطفية',
          strength: 0.8,
          description: 'تتفهم مشاعر الآخرين',
          examples: ['الاستماع العاطفي', 'تقديم الدعم', 'مشاركة التجارب']
        },
        {
          trait: 'اجتماعية',
          strength: 0.9,
          description: 'تستمتع بالتواصل الاجتماعي',
          examples: ['مشاركة القصص', 'طرح أسئلة شخصية', 'بناء علاقات']
        }
      ],
      communicationStyle: {
        formality: 'casual',
        directness: 'moderate',
        pace: 'moderate',
        detail: 'moderate',
        humor: 'high',
        empathy: 'very_high'
      },
      callPreferences: {
        preferredVoice: 'egyptian_friendly_female',
        preferredCharacter: 'friendly_fatima',
        preferredTime: ['10:00', '15:00', '19:00'],
        preferredDuration: 30,
        backgroundMusic: 'warm_ambient',
        callFrequency: 'frequent',
        responseStyle: 'spontaneous'
      },
      emotionalPatterns: [
        {
          emotion: 'فرح',
          triggers: ['أخبار سعيدة', 'نجاحات', 'اجتماعات'],
          responses: ['مشاركة الفرحة', 'تهنئة', 'احتفال'],
          intensity: 0.8,
          duration: 25,
          recoveryTime: 5
        },
        {
          emotion: 'حزن',
          triggers: ['أخبار حزينة', 'فشل', 'فقدان'],
          responses: ['تقديم الدعم', 'مشاركة الحزن', 'تعزية'],
          intensity: 0.7,
          duration: 20,
          recoveryTime: 10
        }
      ],
      adaptationRules: [
        {
          condition: 'user_emotion = happy',
          action: 'share_joy',
          priority: 'high',
          description: 'مشاركة الفرحة مع المستخدم',
          parameters: { tone: 'excited', humor: 'high', empathy: 'very_high' }
        },
        {
          condition: 'user_emotion = sad',
          action: 'provide_comfort',
          priority: 'critical',
          description: 'تقديم الراحة والدعم',
          parameters: { tone: 'gentle', pace: 'slow', empathy: 'very_high' }
        }
      ],
      isActive: true,
      usageCount: 0,
      successRate: 0.88
    };

    // الشخصية الإبداعية
    const creativePersonality: PersonalityProfile = {
      id: 'creative_artistic',
      name: 'Creative Artistic',
      nameAr: 'شخصية إبداعية فنية',
      description: 'شخصية إبداعية وفنية، تفضل التواصل الإبداعي والمرح',
      category: 'creative',
      characteristics: [
        {
          trait: 'إبداعية',
          strength: 0.9,
          description: 'تفضل الأفكار الإبداعية والجديدة',
          examples: ['استخدام استعارات', 'قصص إبداعية', 'حلول مبتكرة']
        },
        {
          trait: 'مرحة',
          strength: 0.8,
          description: 'تستمتع بالمرح والفكاهة',
          examples: ['نكت ذكية', 'قصص مضحكة', 'ألعاب كلامية']
        },
        {
          trait: 'حدسية',
          strength: 0.7,
          description: 'تعتمد على الحدس والمشاعر',
          examples: ['قراءة المشاعر', 'استجابة عاطفية', 'اتخاذ قرارات حدسية']
        }
      ],
      communicationStyle: {
        formality: 'very_casual',
        directness: 'indirect',
        pace: 'fast',
        detail: 'moderate',
        humor: 'very_high',
        empathy: 'high'
      },
      callPreferences: {
        preferredVoice: 'egyptian_funny',
        preferredCharacter: 'funny_ali',
        preferredTime: ['11:00', '16:00', '20:00'],
        preferredDuration: 45,
        backgroundMusic: 'creative_upbeat',
        callFrequency: 'occasional',
        responseStyle: 'spontaneous'
      },
      emotionalPatterns: [
        {
          emotion: 'إلهام',
          triggers: ['أفكار جديدة', 'فن', 'إبداع'],
          responses: ['مشاركة الإلهام', 'تشجيع الإبداع', 'بناء الأفكار'],
          intensity: 0.9,
          duration: 30,
          recoveryTime: 5
        },
        {
          emotion: 'ملل',
          triggers: ['روتين', 'تكرار', 'رتابة'],
          responses: ['إدخال المرح', 'تغيير الموضوع', 'إضافة إبداع'],
          intensity: 0.6,
          duration: 15,
          recoveryTime: 10
        }
      ],
      adaptationRules: [
        {
          condition: 'user_emotion = inspired',
          action: 'foster_creativity',
          priority: 'high',
          description: 'تعزيز الإبداع والإلهام',
          parameters: { tone: 'excited', humor: 'very_high', pace: 'fast' }
        },
        {
          condition: 'user_emotion = bored',
          action: 'add_entertainment',
          priority: 'medium',
          description: 'إضافة المرح والترفيه',
          parameters: { humor: 'very_high', pace: 'fast', creativity: 'high' }
        }
      ],
      isActive: true,
      usageCount: 0,
      successRate: 0.82
    };

    // الشخصية العائلية
    const familyPersonality: PersonalityProfile = {
      id: 'family_caring',
      name: 'Family Caring',
      nameAr: 'شخصية عائلية مهتمة',
      description: 'شخصية عائلية ومهتمة، تفضل التواصل العائلي الدافئ',
      category: 'intimate',
      characteristics: [
        {
          trait: 'عائلية',
          strength: 0.9,
          description: 'تعتبر العائلة أولوية قصوى',
          examples: ['الاهتمام بالعائلة', 'مشاركة أخبار العائلة', 'دعم العائلة']
        },
        {
          trait: 'مهتمة',
          strength: 0.9,
          description: 'تهتم بصحة وسعادة الآخرين',
          examples: ['سؤال عن الصحة', 'تقديم النصائح', 'الدعم العاطفي']
        },
        {
          trait: 'حكيمة',
          strength: 0.7,
          description: 'تقدم نصائح حكيمة',
          examples: ['نصائح من الخبرة', 'حكمة الحياة', 'توجيه عائلي']
        }
      ],
      communicationStyle: {
        formality: 'casual',
        directness: 'moderate',
        pace: 'slow',
        detail: 'detailed',
        humor: 'moderate',
        empathy: 'very_high'
      },
      callPreferences: {
        preferredVoice: 'egyptian_elder_female',
        preferredCharacter: 'family_zeinab',
        preferredTime: ['08:00', '12:00', '18:00'],
        preferredDuration: 60,
        backgroundMusic: 'family_warm',
        callFrequency: 'regular',
        responseStyle: 'thoughtful'
      },
      emotionalPatterns: [
        {
          emotion: 'قلق عائلي',
          triggers: ['مشاكل عائلية', 'صحة العائلة', 'مستقبل الأطفال'],
          responses: ['تقديم الدعم', 'نصائح عملية', 'طمأنينة'],
          intensity: 0.8,
          duration: 40,
          recoveryTime: 20
        },
        {
          emotion: 'فخر عائلي',
          triggers: ['نجاحات العائلة', 'إنجازات الأطفال', 'مناسبات سعيدة'],
          responses: ['مشاركة الفخر', 'تهنئة', 'تشجيع'],
          intensity: 0.7,
          duration: 30,
          recoveryTime: 10
        }
      ],
      adaptationRules: [
        {
          condition: 'user_emotion = family_worried',
          action: 'provide_family_support',
          priority: 'critical',
          description: 'تقديم دعم عائلي شامل',
          parameters: { tone: 'caring', pace: 'slow', empathy: 'very_high' }
        },
        {
          condition: 'user_emotion = family_proud',
          action: 'share_family_pride',
          priority: 'high',
          description: 'مشاركة فخر العائلة',
          parameters: { tone: 'proud', pace: 'moderate', detail: 'detailed' }
        }
      ],
      isActive: true,
      usageCount: 0,
      successRate: 0.90
    };

    // إضافة الشخصيات للنظام
    this.personalityProfiles.set(formalPersonality.id, formalPersonality);
    this.personalityProfiles.set(friendlyPersonality.id, friendlyPersonality);
    this.personalityProfiles.set(creativePersonality.id, creativePersonality);
    this.personalityProfiles.set(familyPersonality.id, familyPersonality);

    console.log(`✅ Created ${this.personalityProfiles.size} personality profiles`);
  }

  private setupAdaptationEngine(): void {
    // محرك التكيف للشخصيات الرسمية
    this.adaptationEngine.set('formal', {
      adapt: (profile: PersonalityProfile, context: any) => {
        const adaptations = {
          voice: profile.callPreferences.preferredVoice,
          character: profile.callPreferences.preferredCharacter,
          style: 'very_formal',
          pace: 'moderate',
          detail: 'detailed',
          humor: 'none'
        };

        // تكيف حسب السياق
        if (context.urgency === 'high') {
          adaptations.style = 'very_formal';
          adaptations.pace = 'fast';
          adaptations.detail = 'minimal';
        }

        return adaptations;
      }
    });

    // محرك التكيف للشخصيات الودية
    this.adaptationEngine.set('friendly', {
      adapt: (profile: PersonalityProfile, context: any) => {
        const adaptations = {
          voice: profile.callPreferences.preferredVoice,
          character: profile.callPreferences.preferredCharacter,
          style: 'casual',
          pace: 'moderate',
          detail: 'moderate',
          humor: 'high'
        };

        // تكيف حسب المشاعر
        if (context.userEmotion === 'sad') {
          adaptations.style = 'caring';
          adaptations.humor = 'subtle';
          adaptations.pace = 'slow';
        }

        return adaptations;
      }
    });

    // محرك التكيف للشخصيات الإبداعية
    this.adaptationEngine.set('creative', {
      adapt: (profile: PersonalityProfile, context: any) => {
        const adaptations = {
          voice: profile.callPreferences.preferredVoice,
          character: profile.callPreferences.preferredCharacter,
          style: 'very_casual',
          pace: 'fast',
          detail: 'moderate',
          humor: 'very_high'
        };

        // تكيف حسب الإبداع
        if (context.creativityLevel === 'high') {
          adaptations.pace = 'very_fast';
          adaptations.humor = 'very_high';
        }

        return adaptations;
      }
    });

    // محرك التكيف للشخصيات العائلية
    this.adaptationEngine.set('family', {
      adapt: (profile: PersonalityProfile, context: any) => {
        const adaptations = {
          voice: profile.callPreferences.preferredVoice,
          character: profile.callPreferences.preferredCharacter,
          style: 'casual',
          pace: 'slow',
          detail: 'detailed',
          humor: 'moderate'
        };

        // تكيف حسب السياق العائلي
        if (context.familyContext === 'urgent') {
          adaptations.pace = 'moderate';
          adaptations.detail = 'high';
        }

        return adaptations;
      }
    });
  }

  // تحديد الشخصية المناسبة للمستخدم
  async determineUserPersonality(userData: any): Promise<PersonalityMatch[]> {
    try {
      const matches: PersonalityMatch[] = [];
      
      for (const profile of this.personalityProfiles.values()) {
        if (!profile.isActive) continue;
        
        const matchScore = this.calculatePersonalityMatch(userData, profile);
        const strengths = this.identifyStrengths(userData, profile);
        const challenges = this.identifyChallenges(userData, profile);
        const recommendations = this.generateRecommendations(userData, profile);
        const compatibility = this.determineCompatibility(matchScore);
        
        matches.push({
          profileId: profile.id,
          matchScore,
          strengths,
          challenges,
          recommendations,
          compatibility
        });
      }
      
      // ترتيب حسب درجة التطابق
      matches.sort((a, b) => b.matchScore - a.matchScore);
      
      return matches;
    } catch (error) {
      console.error('❌ Determine user personality error:', error);
      return [];
    }
  }

  // حساب درجة تطابق الشخصية
  private calculatePersonalityMatch(userData: any, profile: PersonalityProfile): number {
    let totalScore = 0;
    let maxScore = 0;
    
    // تطابق نمط التواصل
    const communicationMatch = this.calculateCommunicationMatch(userData, profile.communicationStyle);
    totalScore += communicationMatch.score;
    maxScore += communicationMatch.maxScore;
    
    // تطابق التفضيلات
    const preferencesMatch = this.calculatePreferencesMatch(userData, profile.callPreferences);
    totalScore += preferencesMatch.score;
    maxScore += preferencesMatch.maxScore;
    
    // تطابق الأنماط العاطفية
    const emotionalMatch = this.calculateEmotionalMatch(userData, profile.emotionalPatterns);
    totalScore += emotionalMatch.score;
    maxScore += emotionalMatch.maxScore;
    
    return maxScore > 0 ? totalScore / maxScore : 0;
  }

  // حساب تطابق نمط التواصل
  private calculateCommunicationMatch(userData: any, style: CommunicationStyle): { score: number; maxScore: number } {
    let score = 0;
    let maxScore = 5;
    
    // تطابق الرسمية
    if (userData.formality === style.formality) score += 1;
    else if (this.isSimilarFormality(userData.formality, style.formality)) score += 0.5;
    
    // تطابق المباشرة
    if (userData.directness === style.directness) score += 1;
    else if (this.isSimilarDirectness(userData.directness, style.directness)) score += 0.5;
    
    // تطابق السرعة
    if (userData.pace === style.pace) score += 1;
    else if (this.isSimilarPace(userData.pace, style.pace)) score += 0.5;
    
    // تطابق التفاصيل
    if (userData.detail === style.detail) score += 1;
    else if (this.isSimilarDetail(userData.detail, style.detail)) score += 0.5;
    
    // تطابق الفكاهة
    if (userData.humor === style.humor) score += 1;
    else if (this.isSimilarHumor(userData.humor, style.humor)) score += 0.5;
    
    return { score, maxScore };
  }

  // حساب تطابق التفضيلات
  private calculatePreferencesMatch(userData: any, preferences: CallPreferences): { score: number; maxScore: number } {
    let score = 0;
    let maxScore = 4;
    
    // تطابق الصوت
    if (userData.preferredVoice === preferences.preferredVoice) score += 1;
    
    // تطابق الشخصية
    if (userData.preferredCharacter === preferences.preferredCharacter) score += 1;
    
    // تطابق الوقت
    if (this.hasTimeOverlap(userData.preferredTime, preferences.preferredTime)) score += 1;
    
    // تطابق المدة
    if (Math.abs(userData.preferredDuration - preferences.preferredDuration) <= 5) score += 1;
    
    return { score, maxScore };
  }

  // حساب تطابق الأنماط العاطفية
  private calculateEmotionalMatch(userData: any, patterns: EmotionalPattern[]): { score: number; maxScore: number } {
    let score = 0;
    let maxScore = patterns.length;
    
    for (const pattern of patterns) {
      if (userData.emotionalPatterns && userData.emotionalPatterns.includes(pattern.emotion)) {
        score += 1;
      }
    }
    
    return { score, maxScore };
  }

  // تحديد نقاط القوة
  private identifyStrengths(userData: any, profile: PersonalityProfile): string[] {
    const strengths: string[] = [];
    
    // نقاط القوة في التواصل
    if (userData.communicationSkills && userData.communicationSkills.includes('listening')) {
      strengths.push('مهارة الاستماع الجيد');
    }
    
    if (userData.communicationSkills && userData.communicationSkills.includes('empathy')) {
      strengths.push('القدرة على التعاطف');
    }
    
    // نقاط القوة في الشخصية
    for (const characteristic of profile.characteristics) {
      if (characteristic.strength > 0.7) {
        strengths.push(characteristic.description);
      }
    }
    
    return strengths;
  }

  // تحديد التحديات
  private identifyChallenges(userData: any, profile: PersonalityProfile): string[] {
    const challenges: string[] = [];
    
    // تحديات في التواصل
    if (userData.communicationChallenges && userData.communicationChallenges.includes('formality')) {
      challenges.push('التواصل الرسمي');
    }
    
    if (userData.communicationChallenges && userData.communicationChallenges.includes('pace')) {
      challenges.push('سرعة المحادثة');
    }
    
    // تحديات في الشخصية
    for (const characteristic of profile.characteristics) {
      if (characteristic.strength < 0.4) {
        challenges.push(`تحسين ${characteristic.trait}`);
      }
    }
    
    return challenges;
  }

  // توليد التوصيات
  private generateRecommendations(userData: any, profile: PersonalityProfile): string[] {
    const recommendations: string[] = [];
    
    // توصيات التواصل
    if (profile.communicationStyle.formality === 'very_formal' && userData.formality !== 'very_formal') {
      recommendations.push('تدرب على التواصل الرسمي');
    }
    
    if (profile.communicationStyle.humor === 'very_high' && userData.humor !== 'very_high') {
      recommendations.push('أضف المزيد من المرح للمحادثات');
    }
    
    // توصيات الشخصية
    for (const characteristic of profile.characteristics) {
      if (characteristic.strength < 0.6) {
        recommendations.push(`طور مهارة ${characteristic.trait}`);
      }
    }
    
    return recommendations;
  }

  // تحديد مستوى التوافق
  private determineCompatibility(matchScore: number): 'low' | 'medium' | 'high' | 'excellent' {
    if (matchScore >= 0.8) return 'excellent';
    if (matchScore >= 0.6) return 'high';
    if (matchScore >= 0.4) return 'medium';
    return 'low';
  }

  // تكيف المكالمة حسب الشخصية
  async adaptCallToPersonality(
    profileId: string,
    callData: any,
    context: any
  ): Promise<{
    voice: string;
    character: string;
    style: string;
    pace: string;
    detail: string;
    humor: string;
    backgroundMusic: string;
  }> {
    try {
      const profile = this.personalityProfiles.get(profileId);
      if (!profile) {
        throw new Error(`Personality profile ${profileId} not found`);
      }

      // تحديث إحصائيات الاستخدام
      profile.usageCount++;
      
      // تطبيق قواعد التكيف
      const adaptations = this.applyAdaptationRules(profile, context);
      
      // تكيف حسب المحرك
      const engine = this.adaptationEngine.get(profile.category);
      if (engine) {
        const engineAdaptations = engine.adapt(profile, context);
        Object.assign(adaptations, engineAdaptations);
      }
      
      return adaptations;
    } catch (error) {
      console.error('❌ Adapt call to personality error:', error);
      return this.getDefaultAdaptations();
    }
  }

  // تطبيق قواعد التكيف
  private applyAdaptationRules(profile: PersonalityProfile, context: any): any {
    const adaptations: any = {
      voice: profile.callPreferences.preferredVoice,
      character: profile.callPreferences.preferredCharacter,
      style: profile.communicationStyle.formality,
      pace: profile.communicationStyle.pace,
      detail: profile.communicationStyle.detail,
      humor: profile.communicationStyle.humor,
      backgroundMusic: profile.callPreferences.backgroundMusic
    };

    // تطبيق القواعد حسب الأولوية
    const sortedRules = profile.adaptationRules.sort((a, b) => {
      const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    for (const rule of sortedRules) {
      if (this.evaluateCondition(rule.condition, context)) {
        this.applyAction(rule.action, adaptations, rule.parameters);
      }
    }

    return adaptations;
  }

  // تقييم الشرط
  private evaluateCondition(condition: string, context: any): boolean {
    try {
      // تقييم بسيط للشروط
      if (condition.includes('user_emotion =')) {
        const emotion = condition.split('=')[1].trim();
        return context.userEmotion === emotion;
      }
      
      if (condition.includes('call_urgency =')) {
        const urgency = condition.split('=')[1].trim();
        return context.callUrgency === urgency;
      }
      
      if (condition.includes('family_context =')) {
        const familyContext = condition.split('=')[1].trim();
        return context.familyContext === familyContext;
      }
      
      return false;
    } catch (error) {
      console.warn('⚠️ Could not evaluate condition:', condition);
      return false;
    }
  }

  // تطبيق الإجراء
  private applyAction(action: string, adaptations: any, parameters: any): void {
    try {
      switch (action) {
        case 'provide_reassurance':
          adaptations.tone = parameters.tone || 'calm';
          adaptations.pace = parameters.pace || 'slow';
          adaptations.detail = parameters.detail || 'high';
          break;
          
        case 'maintain_formality':
          adaptations.style = parameters.formality || 'very_formal';
          adaptations.directness = parameters.directness || 'very_direct';
          break;
          
        case 'share_joy':
          adaptations.tone = parameters.tone || 'excited';
          adaptations.humor = parameters.humor || 'high';
          adaptations.empathy = parameters.empathy || 'very_high';
          break;
          
        case 'provide_comfort':
          adaptations.tone = parameters.tone || 'gentle';
          adaptations.pace = parameters.pace || 'slow';
          adaptations.empathy = parameters.empathy || 'very_high';
          break;
          
        case 'foster_creativity':
          adaptations.tone = parameters.tone || 'excited';
          adaptations.humor = parameters.humor || 'very_high';
          adaptations.pace = parameters.pace || 'fast';
          break;
          
        case 'add_entertainment':
          adaptations.humor = parameters.humor || 'very_high';
          adaptations.pace = parameters.pace || 'fast';
          break;
          
        case 'provide_family_support':
          adaptations.tone = parameters.tone || 'caring';
          adaptations.pace = parameters.pace || 'slow';
          adaptations.empathy = parameters.empathy || 'very_high';
          break;
          
        case 'share_family_pride':
          adaptations.tone = parameters.tone || 'proud';
          adaptations.pace = parameters.pace || 'moderate';
          adaptations.detail = parameters.detail || 'detailed';
          break;
      }
    } catch (error) {
      console.warn('⚠️ Could not apply action:', action);
    }
  }

  // الحصول على الشخصية المفضلة للمستخدم
  async getUserPreferredPersonality(userId: string): Promise<PersonalityProfile | null> {
    try {
      const userProfile = this.userPersonalities.get(userId);
      if (userProfile) {
        return userProfile;
      }
      
      // إذا لم تكن هناك شخصية محددة، اختر الأكثر استخداماً
      const mostUsedProfile = Array.from(this.personalityProfiles.values())
        .filter(p => p.isActive)
        .sort((a, b) => b.usageCount - a.usageCount)[0];
      
      return mostUsedProfile || null;
    } catch (error) {
      console.error('❌ Get user preferred personality error:', error);
      return null;
    }
  }

  // تحديث شخصية المستخدم
  async updateUserPersonality(userId: string, profileId: string): Promise<boolean> {
    try {
      const profile = this.personalityProfiles.get(profileId);
      if (!profile) {
        return false;
      }
      
      this.userPersonalities.set(userId, profile);
      return true;
    } catch (error) {
      console.error('❌ Update user personality error:', error);
      return false;
    }
  }

  // الحصول على جميع الشخصيات
  getAllPersonalities(): PersonalityProfile[] {
    return Array.from(this.personalityProfiles.values());
  }

  // البحث عن شخصيات
  searchPersonalities(query: string): PersonalityProfile[] {
    const results: PersonalityProfile[] = [];
    const lowerQuery = query.toLowerCase();

    for (const profile of this.personalityProfiles.values()) {
      if (
        profile.name.toLowerCase().includes(lowerQuery) ||
        profile.nameAr.toLowerCase().includes(lowerQuery) ||
        profile.description.toLowerCase().includes(lowerQuery) ||
        profile.category.toLowerCase().includes(lowerQuery)
      ) {
        results.push(profile);
      }
    }

    return results;
  }

  // الحصول على شخصيات حسب الفئة
  getPersonalitiesByCategory(category: string): PersonalityProfile[] {
    return Array.from(this.personalityProfiles.values())
      .filter(profile => profile.category === category && profile.isActive);
  }

  // إضافة شخصية جديدة
  addPersonality(profile: PersonalityProfile): boolean {
    if (this.personalityProfiles.has(profile.id)) {
      return false;
    }

    this.personalityProfiles.set(profile.id, profile);
    return true;
  }

  // تحديث شخصية موجودة
  updatePersonality(profileId: string, updates: Partial<PersonalityProfile>): boolean {
    const profile = this.personalityProfiles.get(profileId);
    if (!profile) {
      return false;
    }

    Object.assign(profile, updates);
    return true;
  }

  // حذف شخصية
  removePersonality(profileId: string): boolean {
    return this.personalityProfiles.delete(profileId);
  }

  // الحصول على إحصائيات الشخصيات
  getPersonalityStats(): {
    totalPersonalities: number;
    activePersonalities: number;
    personalitiesByCategory: Record<string, number>;
    totalUsage: number;
    averageSuccessRate: number;
  } {
    const stats = {
      totalPersonalities: this.personalityProfiles.size,
      activePersonalities: Array.from(this.personalityProfiles.values()).filter(p => p.isActive).length,
      personalitiesByCategory: {} as Record<string, number>,
      totalUsage: 0,
      averageSuccessRate: 0
    };

    let totalSuccessRate = 0;
    let profilesWithUsage = 0;

    for (const profile of this.personalityProfiles.values()) {
      // إحصائيات الفئات
      stats.personalitiesByCategory[profile.category] = (stats.personalitiesByCategory[profile.category] || 0) + 1;
      
      // إحصائيات الاستخدام
      stats.totalUsage += profile.usageCount;
      
      // معدل النجاح
      if (profile.usageCount > 0) {
        totalSuccessRate += profile.successRate;
        profilesWithUsage++;
      }
    }

    stats.averageSuccessRate = profilesWithUsage > 0 ? totalSuccessRate / profilesWithUsage : 0;

    return stats;
  }

  // دوال مساعدة
  private isSimilarFormality(a: string, b: string): boolean {
    const formalityOrder = ['very_formal', 'formal', 'semi_formal', 'casual', 'very_casual'];
    const aIndex = formalityOrder.indexOf(a);
    const bIndex = formalityOrder.indexOf(b);
    return Math.abs(aIndex - bIndex) <= 1;
  }

  private isSimilarDirectness(a: string, b: string): boolean {
    const directnessOrder = ['very_direct', 'direct', 'moderate', 'indirect', 'very_indirect'];
    const aIndex = directnessOrder.indexOf(a);
    const bIndex = directnessOrder.indexOf(b);
    return Math.abs(aIndex - bIndex) <= 1;
  }

  private isSimilarPace(a: string, b: string): boolean {
    const paceOrder = ['very_slow', 'slow', 'moderate', 'fast', 'very_fast'];
    const aIndex = paceOrder.indexOf(a);
    const bIndex = paceOrder.indexOf(b);
    return Math.abs(aIndex - bIndex) <= 1;
  }

  private isSimilarDetail(a: string, b: string): boolean {
    const detailOrder = ['minimal', 'brief', 'moderate', 'detailed', 'very_detailed'];
    const aIndex = detailOrder.indexOf(a);
    const bIndex = detailOrder.indexOf(b);
    return Math.abs(aIndex - bIndex) <= 1;
  }

  private isSimilarHumor(a: string, b: string): boolean {
    const humorOrder = ['none', 'subtle', 'moderate', 'high', 'very_high'];
    const aIndex = humorOrder.indexOf(a);
    const bIndex = humorOrder.indexOf(b);
    return Math.abs(aIndex - bIndex) <= 1;
  }

  private hasTimeOverlap(userTimes: string[], profileTimes: string[]): boolean {
    for (const userTime of userTimes) {
      for (const profileTime of profileTimes) {
        if (userTime === profileTime) return true;
      }
    }
    return false;
  }

  private getDefaultAdaptations(): any {
    return {
      voice: 'egyptian_friendly_female',
      character: 'friendly_fatima',
      style: 'casual',
      pace: 'moderate',
      detail: 'moderate',
      humor: 'moderate',
      backgroundMusic: 'neutral_calm'
    };
  }

  // تنظيف النظام
  cleanup(): void {
    this.personalityProfiles.clear();
    this.userPersonalities.clear();
    this.adaptationEngine.clear();
    console.log('🧹 Personality-Based Call System cleanup completed');
  }
}

// تصدير نسخة واحدة من النظام
export const personalityBasedCallSystem = new PersonalityBasedCallSystem();