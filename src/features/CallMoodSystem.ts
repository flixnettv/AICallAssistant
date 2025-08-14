// ========================================
// Call Mood System
// نظام مزاج المكالمة - يحدد المزاج تلقائياً
// ========================================

export interface CallMood {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'worried';
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night' | 'weekend' | 'holiday';
  relationship: 'family' | 'friend' | 'colleague' | 'stranger' | 'business';
  suggestedVoice: string;
  suggestedCharacter: string;
  backgroundMusic: string;
  responseStyle: 'formal' | 'casual' | 'friendly' | 'professional' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface MoodContext {
  reason: string;
  time: Date;
  contact: {
    name?: string;
    relationship?: string;
    lastCall?: Date;
    callHistory?: any[];
  };
  userPreferences: {
    preferredMood?: string;
    preferredVoice?: string;
    preferredCharacter?: string;
  };
}

export class CallMoodSystem {
  private moodPatterns: Map<string, any> = new Map();
  private timePatterns: Map<string, any> = new Map();
  private relationshipPatterns: Map<string, any> = new Map();

  constructor() {
    this.initializeMoodPatterns();
  }

  private initializeMoodPatterns(): void {
    // أنماط المزاج
    this.moodPatterns.set('happy', {
      keywords: ['مبروك', 'عيد', 'نجح', 'سعيد', 'فرح', 'احتفال', 'ميلاد'],
      emotion: 'happy',
      urgency: 'low',
      responseStyle: 'friendly'
    });

    this.moodPatterns.set('sad', {
      keywords: ['حزين', 'مريض', 'مات', 'فقد', 'مشكلة', 'صعب', 'ألم'],
      emotion: 'sad',
      urgency: 'medium',
      responseStyle: 'empathetic'
    });

    this.moodPatterns.set('angry', {
      keywords: ['غاضب', 'زعلان', 'مش عاجبني', 'مضايق', 'مشكلة', 'خطأ'],
      emotion: 'angry',
      urgency: 'high',
      responseStyle: 'calming'
    });

    this.moodPatterns.set('urgent', {
      keywords: ['مهم', 'عاجل', 'ضروري', 'فوري', 'مشكلة', 'مساعدة', 'طوارئ'],
      emotion: 'worried',
      urgency: 'critical',
      responseStyle: 'urgent'
    });

    this.moodPatterns.set('business', {
      keywords: ['عمل', 'موعد', 'اجتماع', 'مشروع', 'مكتب', 'شركة', 'تجارة'],
      emotion: 'neutral',
      urgency: 'medium',
      responseStyle: 'professional'
    });

    // أنماط الوقت
    this.timePatterns.set('morning', {
      startHour: 6,
      endHour: 12,
      greeting: 'صباح الخير',
      mood: 'energetic',
      backgroundMusic: 'morning_ambient'
    });

    this.timePatterns.set('afternoon', {
      startHour: 12,
      endHour: 17,
      greeting: 'مساء الخير',
      mood: 'productive',
      backgroundMusic: 'afternoon_ambient'
    });

    this.timePatterns.set('evening', {
      startHour: 17,
      endHour: 21,
      greeting: 'مساء الخير',
      mood: 'relaxed',
      backgroundMusic: 'evening_ambient'
    });

    this.timePatterns.set('night', {
      startHour: 21,
      endHour: 6,
      greeting: 'مساء الخير',
      mood: 'calm',
      backgroundMusic: 'night_ambient'
    });

    // أنماط العلاقات
    this.relationshipPatterns.set('family', {
      responseStyle: 'casual',
      voice: 'egyptian_family',
      character: 'family_zeinab',
      backgroundMusic: 'family_warm'
    });

    this.relationshipPatterns.set('friend', {
      responseStyle: 'friendly',
      voice: 'egyptian_friendly',
      character: 'friendly_fatima',
      backgroundMusic: 'friendship_cheerful'
    });

    this.relationshipPatterns.set('colleague', {
      responseStyle: 'professional',
      voice: 'egyptian_business',
      character: 'business_ahmed',
      backgroundMusic: 'office_professional'
    });

    this.relationshipPatterns.set('stranger', {
      responseStyle: 'formal',
      voice: 'egyptian_formal',
      character: 'business_ahmed',
      backgroundMusic: 'neutral_calm'
    });

    this.relationshipPatterns.set('business', {
      responseStyle: 'professional',
      voice: 'egyptian_business',
      character: 'business_ahmed',
      backgroundMusic: 'business_ambient'
    });
  }

  // تحليل مزاج المكالمة
  async analyzeCallMood(context: MoodContext): Promise<CallMood> {
    try {
      const urgency = this.analyzeUrgency(context.reason);
      const emotion = this.analyzeEmotion(context.reason);
      const timeContext = this.analyzeTimeContext(context.time);
      const relationship = this.analyzeRelationship(context.contact);
      
      const suggestedVoice = this.suggestVoice(urgency, emotion, relationship);
      const suggestedCharacter = this.suggestCharacter(urgency, emotion, relationship);
      const backgroundMusic = this.suggestBackgroundMusic(timeContext, emotion);
      const responseStyle = this.suggestResponseStyle(urgency, emotion, relationship);
      const priority = this.calculatePriority(urgency, emotion, relationship);

      return {
        urgency,
        emotion,
        timeContext,
        relationship,
        suggestedVoice,
        suggestedCharacter,
        backgroundMusic,
        responseStyle,
        priority
      };
    } catch (error) {
      console.error('❌ Analyze call mood error:', error);
      return this.getDefaultMood();
    }
  }

  // تحليل مستوى الإلحاح
  private analyzeUrgency(reason: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerReason = reason.toLowerCase();
    
    if (lowerReason.includes('طوارئ') || lowerReason.includes('مهم جداً') || lowerReason.includes('فوري')) {
      return 'critical';
    }
    
    if (lowerReason.includes('مهم') || lowerReason.includes('عاجل') || lowerReason.includes('ضروري')) {
      return 'high';
    }
    
    if (lowerReason.includes('موعد') || lowerReason.includes('اجتماع') || lowerReason.includes('مشروع')) {
      return 'medium';
    }
    
    return 'low';
  }

  // تحليل المشاعر
  private analyzeEmotion(reason: string): 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'worried' {
    const lowerReason = reason.toLowerCase();
    
    // البحث عن أنماط المشاعر
    for (const [mood, pattern] of this.moodPatterns) {
      if (pattern.keywords.some((keyword: string) => lowerReason.includes(keyword))) {
        return pattern.emotion;
      }
    }
    
    return 'neutral';
  }

  // تحليل سياق الوقت
  private analyzeTimeContext(time: Date): 'morning' | 'afternoon' | 'evening' | 'night' | 'weekend' | 'holiday' {
    const hour = time.getHours();
    const day = time.getDay();
    
    // تحديد الوقت
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    if (hour >= 21 || hour < 6) return 'night';
    
    // تحديد نوع اليوم
    if (day === 0 || day === 6) return 'weekend';
    
    // يمكن إضافة منطق للعطلات الرسمية هنا
    
    return 'morning'; // افتراضي
  }

  // تحليل العلاقة
  private analyzeRelationship(contact: any): 'family' | 'friend' | 'colleague' | 'stranger' | 'business' {
    if (contact.relationship) {
      return contact.relationship as any;
    }
    
    if (contact.name) {
      // محاولة تخمين العلاقة من الاسم أو التاريخ
      if (contact.lastCall) {
        const daysSinceLastCall = (Date.now() - contact.lastCall.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastCall < 1) return 'family';
        if (daysSinceLastCall < 7) return 'friend';
        if (daysSinceLastCall < 30) return 'colleague';
      }
    }
    
    return 'stranger';
  }

  // اقتراح الصوت
  private suggestVoice(urgency: string, emotion: string, relationship: string): string {
    if (urgency === 'critical') return 'egyptian_emergency_male';
    if (emotion === 'happy') return 'egyptian_celebratory_female';
    if (emotion === 'sad') return 'egyptian_elder_female';
    if (relationship === 'business') return 'egyptian_business_male';
    if (relationship === 'family') return 'egyptian_elder_female';
    
    return 'egyptian_friendly_female';
  }

  // اقتراح الشخصية
  private suggestCharacter(urgency: string, emotion: string, relationship: string): string {
    if (urgency === 'critical') return 'emergency_mohamed';
    if (emotion === 'happy') return 'celebratory_mariam';
    if (emotion === 'sad') return 'family_zeinab';
    if (relationship === 'business') return 'business_ahmed';
    if (relationship === 'family') return 'family_zeinab';
    
    return 'friendly_fatima';
  }

  // اقتراح الموسيقى الخلفية
  private suggestBackgroundMusic(timeContext: string, emotion: string): string {
    if (emotion === 'happy') return 'celebration_upbeat';
    if (emotion === 'sad') return 'calm_soothing';
    if (emotion === 'angry') return 'peaceful_ambient';
    
    // حسب الوقت
    const timeMusic = this.timePatterns.get(timeContext);
    return timeMusic ? timeMusic.backgroundMusic : 'neutral_calm';
  }

  // اقتراح أسلوب الرد
  private suggestResponseStyle(urgency: string, emotion: string, relationship: string): 'formal' | 'casual' | 'friendly' | 'professional' | 'urgent' {
    if (urgency === 'critical') return 'urgent';
    if (relationship === 'business') return 'professional';
    if (relationship === 'family') return 'casual';
    if (relationship === 'friend') return 'friendly';
    
    return 'formal';
  }

  // حساب الأولوية
  private calculatePriority(urgency: string, emotion: string, relationship: string): 'low' | 'medium' | 'high' | 'critical' {
    if (urgency === 'critical') return 'critical';
    if (urgency === 'high') return 'high';
    if (emotion === 'sad' || emotion === 'angry') return 'high';
    if (relationship === 'family') return 'high';
    if (urgency === 'medium') return 'medium';
    
    return 'low';
  }

  // الحصول على مزاج افتراضي
  private getDefaultMood(): CallMood {
    return {
      urgency: 'low',
      emotion: 'neutral',
      timeContext: 'morning',
      relationship: 'stranger',
      suggestedVoice: 'egyptian_friendly_female',
      suggestedCharacter: 'friendly_fatima',
      backgroundMusic: 'neutral_calm',
      responseStyle: 'formal',
      priority: 'low'
    };
  }

  // تحليل متقدم للمزاج
  async analyzeAdvancedMood(context: MoodContext): Promise<{
    mood: CallMood;
    confidence: number;
    alternatives: CallMood[];
    suggestions: string[];
  }> {
    const primaryMood = await this.analyzeCallMood(context);
    const alternatives = this.generateAlternativeMoods(context);
    const confidence = this.calculateConfidence(context, primaryMood);
    const suggestions = this.generateSuggestions(primaryMood, context);

    return {
      mood: primaryMood,
      confidence,
      alternatives,
      suggestions
    };
  }

  // توليد بدائل للمزاج
  private generateAlternativeMoods(context: MoodContext): CallMood[] {
    const alternatives: CallMood[] = [];
    
    // توليد بدائل بناءً على السياق
    if (context.contact.relationship === 'family') {
      alternatives.push({
        ...this.getDefaultMood(),
        relationship: 'family',
        suggestedVoice: 'egyptian_elder_female',
        suggestedCharacter: 'family_zeinab',
        responseStyle: 'casual'
      });
    }
    
    if (context.reason.includes('عمل')) {
      alternatives.push({
        ...this.getDefaultMood(),
        relationship: 'business',
        suggestedVoice: 'egyptian_business_male',
        suggestedCharacter: 'business_ahmed',
        responseStyle: 'professional'
      });
    }
    
    return alternatives;
  }

  // حساب مستوى الثقة
  private calculateConfidence(context: MoodContext, mood: CallMood): number {
    let confidence = 0.5; // مستوى ثقة افتراضي
    
    // زيادة الثقة بناءً على وضوح السياق
    if (context.reason.length > 10) confidence += 0.2;
    if (context.contact.relationship) confidence += 0.2;
    if (context.contact.name) confidence += 0.1;
    
    // تقليل الثقة بناءً على الغموض
    if (context.reason.length < 5) confidence -= 0.2;
    if (!context.contact.name) confidence -= 0.1;
    
    return Math.min(Math.max(confidence, 0.1), 1.0);
  }

  // توليد اقتراحات
  private generateSuggestions(mood: CallMood, context: MoodContext): string[] {
    const suggestions: string[] = [];
    
    if (mood.urgency === 'critical') {
      suggestions.push('هذه مكالمة عاجلة، استخدم صوت واضح وسريع');
      suggestions.push('ركز على المعلومات المهمة فقط');
    }
    
    if (mood.emotion === 'sad') {
      suggestions.push('استخدم نبرة صوت دافئة ومتعاطفة');
      suggestions.push('أظهر التعاطف والتفهم');
    }
    
    if (mood.relationship === 'family') {
      suggestions.push('استخدم لغة عائلية ودية');
      suggestions.push('أظهر الاهتمام والرعاية');
    }
    
    if (mood.timeContext === 'night') {
      suggestions.push('استخدم نبرة صوت هادئة');
      suggestions.push('تجنب الأصوات العالية');
    }
    
    return suggestions;
  }

  // تحديث أنماط المزاج
  updateMoodPatterns(mood: string, pattern: any): void {
    this.moodPatterns.set(mood, pattern);
  }

  // الحصول على إحصائيات المزاج
  getMoodStats(): {
    totalPatterns: number;
    patternsByCategory: Record<string, number>;
    timePatterns: number;
    relationshipPatterns: number;
  } {
    return {
      totalPatterns: this.moodPatterns.size,
      patternsByCategory: {
        emotion: this.moodPatterns.size,
        time: this.timePatterns.size,
        relationship: this.relationshipPatterns.size
      },
      timePatterns: this.timePatterns.size,
      relationshipPatterns: this.relationshipPatterns.size
    };
  }

  // تنظيف النظام
  clear(): void {
    this.moodPatterns.clear();
    this.timePatterns.clear();
    this.relationshipPatterns.clear();
    this.initializeMoodPatterns();
  }
}

// تصدير نسخة واحدة من النظام
export const callMoodSystem = new CallMoodSystem();