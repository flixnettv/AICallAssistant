// ========================================
// Call Scenarios System
// سيناريوهات جاهزة للمكالمات الشائعة
// ========================================

export interface CallScenario {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'personal' | 'business' | 'emergency' | 'celebration' | 'social' | 'professional';
  script: string[];
  scriptAr: string[];
  voice: string;
  character: string;
  backgroundMusic: string;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'calm' | 'urgent';
  duration: number; // بالثواني
  variables: ScenarioVariable[];
  conditions: ScenarioCondition[];
  tags: string[];
  isActive: boolean;
  usageCount: number;
  successRate: number;
  lastUsed?: Date;
}

export interface ScenarioVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  defaultValue: string;
  description: string;
  isRequired: boolean;
  validation?: RegExp;
}

export interface ScenarioCondition {
  type: 'time' | 'day' | 'weather' | 'relationship' | 'urgency' | 'custom';
  value: any;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range';
  description: string;
}

export class CallScenariosSystem {
  private scenarios: Map<string, CallScenario> = new Map();
  private activeScenarios: Map<string, CallScenario> = new Map();
  private scenarioTemplates: Map<string, CallScenario> = new Map();

  constructor() {
    this.initializeScenarios();
  }

  private initializeScenarios(): void {
    console.log('🎭 Initializing Call Scenarios System...');

    // سيناريو عيد الميلاد
    const birthdayScenario: CallScenario = {
      id: 'birthday_celebration',
      name: 'Happy Birthday',
      nameAr: 'عيد ميلاد سعيد',
      description: 'Perfect scenario for birthday calls with warm wishes',
      descriptionAr: 'سيناريو مثالي لمكالمات عيد الميلاد مع أمنيات دافئة',
      category: 'celebration',
      script: [
        'Hello! I\'m calling to wish you a happy birthday!',
        'I know it\'s your special day today',
        'Happy birthday to you!',
        'I wish you a wonderful year ahead',
        'May all your dreams come true',
        'Enjoy your special day!',
        'I\'m here to celebrate with you'
      ],
      scriptAr: [
        'أهلاً وسهلاً!',
        'أنا عارف إنه عيد ميلادك',
        'كل سنة وأنت طيب',
        'أتمنى لك سنة سعيدة',
        'أتمنى أن تتحقق كل أحلامك',
        'احتفل كويس!',
        'أنا معاك في الاحتفال'
      ],
      voice: 'egyptian_celebratory',
      character: 'celebratory_mariam',
      backgroundMusic: 'birthday_music',
      mood: 'happy',
      duration: 45,
      variables: [
        {
          name: 'recipient_name',
          type: 'string',
          defaultValue: 'صديقي',
          description: 'اسم الشخص الذي نحتفل بعيد ميلاده',
          isRequired: true
        },
        {
          name: 'age',
          type: 'number',
          defaultValue: '25',
          description: 'العمر الجديد',
          isRequired: false
        }
      ],
      conditions: [
        {
          type: 'time',
          value: { start: '08:00', end: '22:00' },
          operator: 'in_range',
          description: 'مناسبة للأوقات النهارية'
        }
      ],
      tags: ['birthday', 'celebration', 'happy', 'wishes'],
      isActive: true,
      usageCount: 0,
      successRate: 0.9
    };

    // سيناريو تأكيد موعد
    const appointmentScenario: CallScenario = {
      id: 'appointment_confirmation',
      name: 'Appointment Confirmation',
      nameAr: 'تأكيد موعد',
      description: 'Professional scenario for confirming business appointments',
      descriptionAr: 'سيناريو احترافي لتأكيد المواعيد التجارية',
      category: 'business',
      script: [
        'Hello, I\'m calling to confirm your appointment',
        'Do you still remember the appointment?',
        'Can you tell me what time it is?',
        'Is the location still convenient for you?',
        'Do you need any special arrangements?',
        'Thank you for your time',
        'We look forward to seeing you'
      ],
      scriptAr: [
        'أهلاً، أنا أتصل لتأكيد موعدك',
        'هل ما زلت متذكر الموعد؟',
        'ممكن أعرف إيه الوقت؟',
        'هل المكان مريح ليك؟',
        'هل تحتاج ترتيبات خاصة؟',
        'شكراً لك',
        'نحن نتطلع لرؤيتك'
      ],
      voice: 'egyptian_professional',
      character: 'business_ahmed',
      backgroundMusic: 'calm_office',
      mood: 'neutral',
      duration: 60,
      variables: [
        {
          name: 'appointment_date',
          type: 'date',
          defaultValue: 'today',
          description: 'تاريخ الموعد',
          isRequired: true
        },
        {
          name: 'appointment_time',
          type: 'string',
          defaultValue: '10:00 AM',
          description: 'وقت الموعد',
          isRequired: true
        },
        {
          name: 'location',
          type: 'string',
          defaultValue: 'المكتب الرئيسي',
          description: 'مكان الموعد',
          isRequired: true
        }
      ],
      conditions: [
        {
          type: 'time',
          value: { start: '09:00', end: '17:00' },
          operator: 'in_range',
          description: 'مناسبة لساعات العمل'
        },
        {
          type: 'day',
          value: [1, 2, 3, 4, 5], // الأحد إلى الخميس
          operator: 'in_range',
          description: 'مناسبة لأيام العمل'
        }
      ],
      tags: ['appointment', 'business', 'confirmation', 'professional'],
      isActive: true,
      usageCount: 0,
      successRate: 0.85
    };

    // سيناريو الاعتذار
    const apologyScenario: CallScenario = {
      id: 'sincere_apology',
      name: 'Sincere Apology',
      nameAr: 'اعتذار صادق',
      description: 'Heartfelt apology scenario for making amends',
      descriptionAr: 'سيناريو اعتذار صادق لإصلاح العلاقات',
      category: 'personal',
      script: [
        'Hello, I\'m calling to apologize',
        'I\'m sorry for what happened',
        'I hope you can forgive me',
        'I take full responsibility',
        'I want to make things right',
        'Thank you for understanding',
        'I appreciate your patience'
      ],
      scriptAr: [
        'أهلاً، أنا أتصل لأعتذر',
        'أنا آسف على ما حدث',
        'أتمنى أن تسامحني',
        'أنا أتحمل المسؤولية كاملة',
        'أريد إصلاح الأمور',
        'شكراً لتفهمك',
        'أقدر صبرك'
      ],
      voice: 'egyptian_sincere',
      character: 'family_zeinab',
      backgroundMusic: 'gentle_apology',
      mood: 'sad',
      duration: 50,
      variables: [
        {
          name: 'incident_description',
          type: 'string',
          defaultValue: 'الخطأ الذي حدث',
          description: 'وصف ما حدث',
          isRequired: true
        },
        {
          name: 'relationship',
          type: 'string',
          defaultValue: 'صديق',
          description: 'نوع العلاقة',
          isRequired: true
        }
      ],
      conditions: [
        {
          type: 'time',
          value: { start: '10:00', end: '21:00' },
          operator: 'in_range',
          description: 'مناسبة للأوقات المناسبة'
        }
      ],
      tags: ['apology', 'personal', 'sincere', 'relationship'],
      isActive: true,
      usageCount: 0,
      successRate: 0.75
    };

    // سيناريو التهنئة بالنجاح
    const successScenario: CallScenario = {
      id: 'success_congratulation',
      name: 'Success Congratulations',
      nameAr: 'تهنئة بالنجاح',
      description: 'Celebrating achievements and success',
      descriptionAr: 'الاحتفال بالإنجازات والنجاح',
      category: 'celebration',
      script: [
        'Hello! I heard about your great success!',
        'Congratulations on your achievement!',
        'I\'m so proud of you',
        'You deserve this success',
        'Your hard work paid off',
        'This is just the beginning',
        'Keep up the excellent work!'
      ],
      scriptAr: [
        'أهلاً! سمعت عن نجاحك العظيم!',
        'مبروك على إنجازك!',
        'أنا فخور جداً بيك',
        'أنت تستحق هذا النجاح',
        'مجهودك أثمر',
        'هذا مجرد البداية',
        'استمر في العمل الممتاز!'
      ],
      voice: 'egyptian_excited',
      character: 'celebratory_mariam',
      backgroundMusic: 'success_celebration',
      mood: 'excited',
      duration: 40,
      variables: [
        {
          name: 'achievement',
          type: 'string',
          defaultValue: 'النجاح الذي تحقق',
          description: 'ما تم إنجازه',
          isRequired: true
        },
        {
          name: 'effort_level',
          type: 'string',
          defaultValue: 'كبير',
          description: 'مستوى المجهود المبذول',
          isRequired: false
        }
      ],
      conditions: [
        {
          type: 'time',
          value: { start: '08:00', end: '22:00' },
          operator: 'in_range',
          description: 'مناسبة لجميع الأوقات'
        }
      ],
      tags: ['success', 'congratulations', 'achievement', 'proud'],
      isActive: true,
      usageCount: 0,
      successRate: 0.95
    };

    // سيناريو الطوارئ
    const emergencyScenario: CallScenario = {
      id: 'emergency_assistance',
      name: 'Emergency Assistance',
      nameAr: 'مساعدة طارئة',
      description: 'Urgent assistance scenario for emergencies',
      descriptionAr: 'سيناريو مساعدة عاجلة للطوارئ',
      category: 'emergency',
      script: [
        'Hello, I\'m calling about an emergency',
        'What\'s the situation?',
        'I need to understand the problem',
        'Are you safe right now?',
        'I\'ll help you immediately',
        'Stay calm, I\'m here to help',
        'Help is on the way'
      ],
      scriptAr: [
        'أهلاً، أنا أتصل بخصوص طارئة',
        'إيه الموقف؟',
        'أحتاج أفهم المشكلة',
        'هل أنت آمن دلوقتي؟',
        'سأساعدك فوراً',
        'ابق هادئ، أنا هنا لمساعدتك',
        'المساعدة في الطريق'
      ],
      voice: 'egyptian_emergency',
      character: 'emergency_mohamed',
      backgroundMusic: 'urgent_ambient',
      mood: 'urgent',
      duration: 30,
      variables: [
        {
          name: 'emergency_type',
          type: 'string',
          defaultValue: 'مشكلة طارئة',
          description: 'نوع الطارئة',
          isRequired: true
        },
        {
          name: 'location',
          type: 'string',
          defaultValue: 'الموقع الحالي',
          description: 'موقع الطارئة',
          isRequired: true
        }
      ],
      conditions: [
        {
          type: 'urgency',
          value: 'high',
          operator: 'equals',
          description: 'للحالات العاجلة فقط'
        }
      ],
      tags: ['emergency', 'urgent', 'assistance', 'help'],
      isActive: true,
      usageCount: 0,
      successRate: 0.98
    };

    // سيناريو الاجتماع العائلي
    const familyGatheringScenario: CallScenario = {
      id: 'family_gathering',
      name: 'Family Gathering',
      nameAr: 'اجتماع عائلي',
      description: 'Warm family gathering invitation',
      descriptionAr: 'دعوة دافئة لاجتماع عائلي',
      category: 'personal',
      script: [
        'Hello my dear family member!',
        'I miss you so much',
        'I want to invite you to a family gathering',
        'It will be so much fun',
        'Everyone will be there',
        'Please come, we need you',
        'I can\'t wait to see you!'
      ],
      scriptAr: [
        'أهلاً يا عزيزي من العائلة!',
        'أنا مشتاقة ليك جداً',
        'أريد أدعوك لاجتماع عائلي',
        'هيكون ممتع جداً',
        'كل الناس هيكونوا هناك',
        'تعال من فضلك، نحتاجك',
        'مش قادرة أستنى أشوفك!'
      ],
      voice: 'egyptian_family',
      character: 'family_zeinab',
      backgroundMusic: 'family_warm',
      mood: 'happy',
      duration: 55,
      variables: [
        {
          name: 'gathering_date',
          type: 'date',
          defaultValue: 'next_weekend',
          description: 'تاريخ الاجتماع',
          isRequired: true
        },
        {
          name: 'gathering_location',
          type: 'string',
          defaultValue: 'البيت',
          description: 'مكان الاجتماع',
          isRequired: true
        },
        {
          name: 'special_occasion',
          type: 'string',
          defaultValue: 'اجتماع عائلي عادي',
          description: 'المناسبة الخاصة',
          isRequired: false
        }
      ],
      conditions: [
        {
          type: 'relationship',
          value: 'family',
          operator: 'equals',
          description: 'للأقارب والعائلة فقط'
        }
      ],
      tags: ['family', 'gathering', 'invitation', 'warm'],
      isActive: true,
      usageCount: 0,
      successRate: 0.88
    };

    // إضافة السيناريوهات للنظام
    this.scenarios.set(birthdayScenario.id, birthdayScenario);
    this.scenarios.set(appointmentScenario.id, appointmentScenario);
    this.scenarios.set(apologyScenario.id, apologyScenario);
    this.scenarios.set(successScenario.id, successScenario);
    this.scenarios.set(emergencyScenario.id, emergencyScenario);
    this.scenarios.set(familyGatheringScenario.id, familyGatheringScenario);

    // تفعيل جميع السيناريوهات
    this.scenarios.forEach(scenario => {
      if (scenario.isActive) {
        this.activeScenarios.set(scenario.id, scenario);
      }
    });

    console.log(`✅ Initialized ${this.scenarios.size} call scenarios`);
  }

  // الحصول على جميع السيناريوهات
  getAllScenarios(): CallScenario[] {
    return Array.from(this.scenarios.values());
  }

  // الحصول على السيناريوهات النشطة
  getActiveScenarios(): CallScenario[] {
    return Array.from(this.activeScenarios.values());
  }

  // الحصول على سيناريو محدد
  getScenario(scenarioId: string): CallScenario | null {
    return this.scenarios.get(scenarioId) || null;
  }

  // البحث عن سيناريوهات
  searchScenarios(query: string, category?: string): CallScenario[] {
    const results: CallScenario[] = [];
    const lowerQuery = query.toLowerCase();

    for (const scenario of this.scenarios.values()) {
      if (!scenario.isActive) continue;
      if (category && scenario.category !== category) continue;

      if (
        scenario.name.toLowerCase().includes(lowerQuery) ||
        scenario.nameAr.toLowerCase().includes(lowerQuery) ||
        scenario.description.toLowerCase().includes(lowerQuery) ||
        scenario.descriptionAr.toLowerCase().includes(lowerQuery) ||
        scenario.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      ) {
        results.push(scenario);
      }
    }

    return results;
  }

  // الحصول على سيناريوهات حسب الفئة
  getScenariosByCategory(category: string): CallScenario[] {
    return Array.from(this.scenarios.values())
      .filter(scenario => scenario.category === category && scenario.isActive);
  }

  // الحصول على سيناريوهات حسب المزاج
  getScenariosByMood(mood: string): CallScenario[] {
    return Array.from(this.scenarios.values())
      .filter(scenario => scenario.mood === mood && scenario.isActive);
  }

  // إنشاء سيناريو مخصص
  createCustomScenario(
    name: string,
    nameAr: string,
    script: string[],
    scriptAr: string[],
    category: string,
    voice: string,
    character: string
  ): CallScenario {
    const customScenario: CallScenario = {
      id: `custom_${Date.now()}`,
      name,
      nameAr,
      description: 'Custom scenario created by user',
      descriptionAr: 'سيناريو مخصص أنشأه المستخدم',
      category: category as any,
      script,
      scriptAr,
      voice,
      character,
      backgroundMusic: 'neutral_calm',
      mood: 'neutral',
      duration: script.length * 8, // تقدير المدة
      variables: [],
      conditions: [],
      tags: ['custom', 'user_created'],
      isActive: true,
      usageCount: 0,
      successRate: 0.8
    };

    this.scenarios.set(customScenario.id, customScenario);
    this.activeScenarios.set(customScenario.id, customScenario);

    return customScenario;
  }

  // تنفيذ سيناريو
  async executeScenario(
    scenarioId: string,
    variables: Record<string, any> = {},
    context: any = {}
  ): Promise<{
    success: boolean;
    script: string[];
    duration: number;
    voice: string;
    character: string;
    backgroundMusic: string;
  }> {
    try {
      const scenario = this.scenarios.get(scenarioId);
      if (!scenario || !scenario.isActive) {
        throw new Error(`Scenario ${scenarioId} not found or inactive`);
      }

      // تحديث إحصائيات الاستخدام
      scenario.usageCount++;
      scenario.lastUsed = new Date();

      // تطبيق المتغيرات على النص
      const processedScript = this.processScriptVariables(scenario.scriptAr, variables);
      
      // التحقق من الشروط
      const conditionsMet = this.checkScenarioConditions(scenario, context);
      if (!conditionsMet) {
        console.warn(`⚠️ Scenario conditions not met for ${scenarioId}`);
      }

      return {
        success: true,
        script: processedScript,
        duration: scenario.duration,
        voice: scenario.voice,
        character: scenario.character,
        backgroundMusic: scenario.backgroundMusic
      };
    } catch (error) {
      console.error('❌ Execute scenario error:', error);
      return {
        success: false,
        script: [],
        duration: 0,
        voice: '',
        character: '',
        backgroundMusic: ''
      };
    }
  }

  // معالجة متغيرات النص
  private processScriptVariables(script: string[], variables: Record<string, any>): string[] {
    return script.map(line => {
      let processedLine = line;
      
      for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{${key}}`;
        if (processedLine.includes(placeholder)) {
          processedLine = processedLine.replace(placeholder, String(value));
        }
      }
      
      return processedLine;
    });
  }

  // التحقق من شروط السيناريو
  private checkScenarioConditions(scenario: CallScenario, context: any): boolean {
    for (const condition of scenario.conditions) {
      if (!this.evaluateCondition(condition, context)) {
        return false;
      }
    }
    return true;
  }

  // تقييم شرط واحد
  private evaluateCondition(condition: ScenarioCondition, context: any): boolean {
    const value = context[condition.type];
    if (value === undefined) return true; // تجاهل الشروط غير المتوفرة

    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'greater_than':
        return value > condition.value;
      case 'less_than':
        return value < condition.value;
      case 'contains':
        return String(value).includes(condition.value);
      case 'in_range':
        if (Array.isArray(condition.value)) {
          return condition.value.includes(value);
        }
        if (typeof condition.value === 'object' && condition.value.start && condition.value.end) {
          return value >= condition.value.start && value <= condition.value.end;
        }
        return false;
      default:
        return true;
    }
  }

  // تحديث معدل النجاح
  updateScenarioSuccessRate(scenarioId: string, success: boolean): void {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return;

    const currentRate = scenario.successRate;
    const totalCalls = scenario.usageCount;
    
    if (totalCalls > 0) {
      scenario.successRate = ((currentRate * (totalCalls - 1)) + (success ? 1 : 0)) / totalCalls;
    }
  }

  // الحصول على السيناريوهات الأكثر استخداماً
  getMostUsedScenarios(limit: number = 5): CallScenario[] {
    return Array.from(this.scenarios.values())
      .filter(scenario => scenario.isActive)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  // الحصول على السيناريوهات الأكثر نجاحاً
  getMostSuccessfulScenarios(limit: number = 5): CallScenario[] {
    return Array.from(this.scenarios.values())
      .filter(scenario => scenario.isActive)
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, limit);
  }

  // إضافة سيناريو جديد
  addScenario(scenario: CallScenario): boolean {
    if (this.scenarios.has(scenario.id)) {
      return false; // السيناريو موجود بالفعل
    }

    this.scenarios.set(scenario.id, scenario);
    if (scenario.isActive) {
      this.activeScenarios.set(scenario.id, scenario);
    }

    return true;
  }

  // تحديث سيناريو موجود
  updateScenario(scenarioId: string, updates: Partial<CallScenario>): boolean {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      return false;
    }

    Object.assign(scenario, updates);
    
    // تحديث القائمة النشطة
    if (scenario.isActive) {
      this.activeScenarios.set(scenarioId, scenario);
    } else {
      this.activeScenarios.delete(scenarioId);
    }

    return true;
  }

  // حذف سيناريو
  removeScenario(scenarioId: string): boolean {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      return false;
    }

    this.scenarios.delete(scenarioId);
    this.activeScenarios.delete(scenarioId);
    
    return true;
  }

  // الحصول على إحصائيات السيناريوهات
  getScenarioStats(): {
    totalScenarios: number;
    activeScenarios: number;
    scenariosByCategory: Record<string, number>;
    scenariosByMood: Record<string, number>;
    totalUsage: number;
    averageSuccessRate: number;
  } {
    const stats = {
      totalScenarios: this.scenarios.size,
      activeScenarios: this.activeScenarios.size,
      scenariosByCategory: {} as Record<string, number>,
      scenariosByMood: {} as Record<string, number>,
      totalUsage: 0,
      averageSuccessRate: 0
    };

    let totalSuccessRate = 0;
    let scenariosWithUsage = 0;

    for (const scenario of this.scenarios.values()) {
      // إحصائيات الفئات
      stats.scenariosByCategory[scenario.category] = (stats.scenariosByCategory[scenario.category] || 0) + 1;
      
      // إحصائيات المزاج
      stats.scenariosByMood[scenario.mood] = (stats.scenariosByMood[scenario.mood] || 0) + 1;
      
      // إحصائيات الاستخدام
      stats.totalUsage += scenario.usageCount;
      
      // معدل النجاح
      if (scenario.usageCount > 0) {
        totalSuccessRate += scenario.successRate;
        scenariosWithUsage++;
      }
    }

    stats.averageSuccessRate = scenariosWithUsage > 0 ? totalSuccessRate / scenariosWithUsage : 0;

    return stats;
  }

  // تصدير السيناريوهات
  exportScenarios(): CallScenario[] {
    return Array.from(this.scenarios.values());
  }

  // استيراد السيناريوهات
  importScenarios(scenarios: CallScenario[]): void {
    for (const scenario of scenarios) {
      this.scenarios.set(scenario.id, scenario);
      if (scenario.isActive) {
        this.activeScenarios.set(scenario.id, scenario);
      }
    }
  }

  // تنظيف السيناريوهات
  cleanupScenarios(): void {
    // إزالة السيناريوهات المخصصة غير المستخدمة
    const customScenarios = Array.from(this.scenarios.values())
      .filter(s => s.id.startsWith('custom_') && s.usageCount === 0);
    
    for (const scenario of customScenarios) {
      this.scenarios.delete(scenario.id);
      this.activeScenarios.delete(scenario.id);
    }

    console.log(`🧹 Cleaned up ${customScenarios.length} unused custom scenarios`);
  }
}

// تصدير نسخة واحدة من النظام
export const callScenariosSystem = new CallScenariosSystem();