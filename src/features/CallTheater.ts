// ========================================
// Call Theater System
// مسرح المكالمات - تحويل كل مكالمة إلى تجربة مسرحية
// ========================================

export interface TheaterScene {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  setting: TheaterSetting;
  characters: TheaterCharacter[];
  dialogue: TheaterDialogue[];
  music: TheaterMusic;
  effects: TheaterEffect[];
  mood: 'dramatic' | 'comedy' | 'romantic' | 'mystery' | 'action' | 'calm';
  duration: number;
  isActive: boolean;
}

export interface TheaterSetting {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  type: 'office' | 'home' | 'street' | 'restaurant' | 'hospital' | 'school' | 'outdoor' | 'virtual';
  backgroundSounds: string[];
  visualElements: string[];
  atmosphere: 'formal' | 'casual' | 'intimate' | 'public' | 'professional' | 'relaxed';
  lighting: 'bright' | 'dim' | 'warm' | 'cool' | 'natural' | 'artificial';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'clear' | 'foggy';
}

export interface TheaterCharacter {
  id: string;
  name: string;
  nameAr: string;
  role: 'caller' | 'receiver' | 'narrator' | 'background' | 'ai_assistant';
  personality: string;
  voice: string;
  emotions: string[];
  actions: string[];
  dialogueStyle: 'formal' | 'casual' | 'friendly' | 'professional' | 'dramatic';
}

export interface TheaterDialogue {
  id: string;
  characterId: string;
  text: string;
  textAr: string;
  emotion: string;
  tone: 'happy' | 'sad' | 'angry' | 'excited' | 'calm' | 'nervous';
  timing: number; // بالثواني
  emphasis: 'normal' | 'strong' | 'whisper' | 'shout';
  backgroundMusic: string;
  soundEffects: string[];
}

export interface TheaterMusic {
  id: string;
  name: string;
  type: 'background' | 'theme' | 'transition' | 'emotional' | 'action';
  mood: 'happy' | 'sad' | 'tense' | 'relaxed' | 'energetic' | 'mysterious';
  volume: number; // 0-1
  fadeIn: number; // بالثواني
  fadeOut: number; // بالثواني
  loop: boolean;
  transitions: MusicTransition[];
}

export interface MusicTransition {
  from: string;
  to: string;
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface TheaterEffect {
  id: string;
  name: string;
  type: 'sound' | 'visual' | 'atmospheric' | 'interactive';
  description: string;
  trigger: 'automatic' | 'user_action' | 'time_based' | 'emotion_based';
  parameters: Record<string, any>;
  duration: number;
  intensity: number; // 0-1
}

export class CallTheater {
  private scenes: Map<string, TheaterScene> = new Map();
  private activeScene: TheaterScene | null = null;
  private currentAct: number = 0;
  private isPlaying: boolean = false;
  private audioContext: AudioContext | null = null;
  private musicTracks: Map<string, HTMLAudioElement> = new Map();
  private soundEffects: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    this.initializeTheater();
  }

  private initializeTheater(): void {
    console.log('🎪 Initializing Call Theater System...');
    this.createDefaultScenes();
    this.initializeAudioContext();
  }

  private createDefaultScenes(): void {
    // مشهد المكتب
    const officeScene: TheaterScene = {
      id: 'office_business',
      name: 'Business Office',
      nameAr: 'مكتب تجاري',
      description: 'Professional office environment for business calls',
      setting: {
        id: 'office_setting',
        name: 'Modern Office',
        nameAr: 'مكتب حديث',
        description: 'مكتب احترافي مع إضاءة طبيعية وأجواء عمل',
        type: 'office',
        backgroundSounds: ['keyboard_typing', 'air_conditioning', 'distant_conversations'],
        visualElements: ['desk', 'computer', 'window', 'plants'],
        atmosphere: 'professional',
        lighting: 'bright',
        timeOfDay: 'morning',
        weather: 'sunny'
      },
      characters: [
        {
          id: 'business_caller',
          name: 'Business Caller',
          nameAr: 'متصل تجاري',
          role: 'caller',
          personality: 'مهني ومحترم',
          voice: 'egyptian_business_male',
          emotions: ['focused', 'professional', 'confident'],
          actions: ['sitting_at_desk', 'checking_schedule', 'preparing_notes'],
          dialogueStyle: 'professional'
        },
        {
          id: 'ai_assistant',
          name: 'AI Assistant',
          nameAr: 'المساعد الذكي',
          role: 'ai_assistant',
          personality: 'متعاون ومهني',
          voice: 'egyptian_professional',
          emotions: ['helpful', 'efficient', 'friendly'],
          actions: ['listening', 'responding', 'assisting'],
          dialogueStyle: 'professional'
        }
      ],
      dialogue: [
        {
          id: 'opening_greeting',
          characterId: 'ai_assistant',
          text: 'Good morning, how may I assist you today?',
          textAr: 'صباح الخير، كيف يمكنني مساعدتك اليوم؟',
          emotion: 'professional',
          tone: 'calm',
          timing: 3,
          emphasis: 'normal',
          backgroundMusic: 'office_ambient',
          soundEffects: ['phone_ring']
        },
        {
          id: 'business_inquiry',
          characterId: 'business_caller',
          text: 'I need to schedule a meeting',
          textAr: 'أحتاج تحديد موعد اجتماع',
          emotion: 'focused',
          tone: 'calm',
          timing: 4,
          emphasis: 'normal',
          backgroundMusic: 'office_ambient',
          soundEffects: []
        }
      ],
      music: {
        id: 'office_music',
        name: 'Office Ambience',
        type: 'background',
        mood: 'relaxed',
        volume: 0.3,
        fadeIn: 2,
        fadeOut: 2,
        loop: true,
        transitions: []
      },
      effects: [
        {
          id: 'office_atmosphere',
          name: 'Office Atmosphere',
          type: 'atmospheric',
          description: 'أجواء مكتبية احترافية',
          trigger: 'automatic',
          parameters: { intensity: 0.7, duration: 300 },
          duration: 300,
          intensity: 0.7
        }
      ],
      mood: 'calm',
      duration: 120,
      isActive: true
    };

    // مشهد المنزل
    const homeScene: TheaterScene = {
      id: 'home_personal',
      name: 'Cozy Home',
      nameAr: 'بيت دافئ',
      description: 'Warm and intimate home environment for personal calls',
      setting: {
        id: 'home_setting',
        name: 'Cozy Living Room',
        nameAr: 'غرفة معيشة دافئة',
        description: 'غرفة معيشة مريحة مع أثاث دافئ وإضاءة ناعمة',
        type: 'home',
        backgroundSounds: ['clock_ticking', 'refrigerator_hum', 'distant_tv'],
        visualElements: ['sofa', 'coffee_table', 'lamp', 'family_photos'],
        atmosphere: 'intimate',
        lighting: 'warm',
        timeOfDay: 'evening',
        weather: 'clear'
      },
      characters: [
        {
          id: 'family_caller',
          name: 'Family Member',
          nameAr: 'عضو العائلة',
          role: 'caller',
          personality: 'ودود وعائلي',
          voice: 'egyptian_family',
          emotions: ['loving', 'caring', 'warm'],
          actions: ['sitting_on_sofa', 'drinking_tea', 'relaxing'],
          dialogueStyle: 'casual'
        },
        {
          id: 'ai_companion',
          name: 'AI Companion',
          nameAr: 'الرفيق الذكي',
          role: 'ai_assistant',
          personality: 'ودود ومتعاطف',
          voice: 'egyptian_friendly',
          emotions: ['caring', 'understanding', 'supportive'],
          actions: ['listening', 'comforting', 'sharing'],
          dialogueStyle: 'friendly'
        }
      ],
      dialogue: [
        {
          id: 'warm_greeting',
          characterId: 'ai_companion',
          text: 'Hello dear, how are you feeling today?',
          textAr: 'أهلاً يا عزيزي، إزيك النهاردة؟',
          emotion: 'caring',
          tone: 'warm',
          timing: 4,
          emphasis: 'normal',
          backgroundMusic: 'home_ambient',
          soundEffects: ['soft_bell']
        },
        {
          id: 'family_update',
          characterId: 'family_caller',
          text: 'I miss everyone so much',
          textAr: 'أنا مشتاق للجميع جداً',
          emotion: 'nostalgic',
          tone: 'sad',
          timing: 5,
          emphasis: 'normal',
          backgroundMusic: 'home_ambient',
          soundEffects: []
        }
      ],
      music: {
        id: 'home_music',
        name: 'Home Comfort',
        type: 'background',
        mood: 'relaxed',
        volume: 0.4,
        fadeIn: 3,
        fadeOut: 3,
        loop: true,
        transitions: []
      },
      effects: [
        {
          id: 'home_warmth',
          name: 'Home Warmth',
          type: 'atmospheric',
          description: 'دفء المنزل العائلي',
          trigger: 'automatic',
          parameters: { temperature: 'warm', comfort: 0.8 },
          duration: 300,
          intensity: 0.8
        }
      ],
      mood: 'calm',
      duration: 180,
      isActive: true
    };

    // مشهد الطوارئ
    const emergencyScene: TheaterScene = {
      id: 'emergency_urgent',
      name: 'Emergency Response',
      nameAr: 'استجابة طارئة',
      description: 'High-stakes emergency environment for urgent calls',
      setting: {
        id: 'emergency_setting',
        name: 'Emergency Center',
        nameAr: 'مركز الطوارئ',
        description: 'مركز طوارئ نشط مع معدات طبية وأجواء عاجلة',
        type: 'hospital',
        backgroundSounds: ['medical_equipment', 'urgent_conversations', 'sirens'],
        visualElements: ['medical_devices', 'emergency_lights', 'medical_staff'],
        atmosphere: 'urgent',
        lighting: 'bright',
        timeOfDay: 'night',
        weather: 'clear'
      },
      characters: [
        {
          id: 'emergency_caller',
          name: 'Emergency Caller',
          nameAr: 'متصل طارئ',
          role: 'caller',
          personality: 'مضطرب ومحتاج مساعدة',
          voice: 'egyptian_emergency',
          emotions: ['panicked', 'worried', 'urgent'],
          actions: ['calling_for_help', 'describing_situation', 'seeking_assistance'],
          dialogueStyle: 'urgent'
        },
        {
          id: 'ai_emergency',
          name: 'AI Emergency',
          nameAr: 'الذكاء الاصطناعي للطوارئ',
          role: 'ai_assistant',
          personality: 'هادئ ومتخصص',
          voice: 'egyptian_emergency_male',
          emotions: ['calm', 'focused', 'reassuring'],
          actions: ['assessing_situation', 'providing_guidance', 'coordinating_help'],
          dialogueStyle: 'urgent'
        }
      ],
      dialogue: [
        {
          id: 'emergency_greeting',
          characterId: 'ai_emergency',
          text: 'Emergency response, what is your situation?',
          textAr: 'استجابة طارئة، إيه الموقف؟',
          emotion: 'focused',
          tone: 'urgent',
          timing: 2,
          emphasis: 'strong',
          backgroundMusic: 'emergency_ambient',
          soundEffects: ['emergency_alert']
        },
        {
          id: 'situation_description',
          characterId: 'emergency_caller',
          text: 'I need immediate help!',
          textAr: 'أحتاج مساعدة فورية!',
          emotion: 'panicked',
          tone: 'nervous',
          timing: 3,
          emphasis: 'shout',
          backgroundMusic: 'emergency_ambient',
          soundEffects: ['urgent_voice']
        }
      ],
      music: {
        id: 'emergency_music',
        name: 'Emergency Tension',
        type: 'background',
        mood: 'tense',
        volume: 0.6,
        fadeIn: 1,
        fadeOut: 1,
        loop: true,
        transitions: []
      },
      effects: [
        {
          id: 'emergency_urgency',
          name: 'Emergency Urgency',
          type: 'atmospheric',
          description: 'إحساس بالطوارئ والإلحاح',
          trigger: 'automatic',
          parameters: { urgency: 0.9, tension: 0.8 },
          duration: 120,
          intensity: 0.9
        }
      ],
      mood: 'dramatic',
      duration: 60,
      isActive: true
    };

    // إضافة المشاهد للنظام
    this.scenes.set(officeScene.id, officeScene);
    this.scenes.set(homeScene.id, homeScene);
    this.scenes.set(emergencyScene.id, emergencyScene);

    console.log(`✅ Created ${this.scenes.size} theater scenes`);
  }

  private initializeAudioContext(): void {
    try {
      // إنشاء سياق صوتي للموسيقى والتأثيرات
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('🎵 Audio context initialized');
    } catch (error) {
      console.warn('⚠️ Audio context not available:', error);
    }
  }

  // إنشاء تجربة مكالمة مسرحية
  async createCallExperience(callData: any): Promise<TheaterScene> {
    try {
      console.log('🎭 Creating theatrical call experience...');

      // تحديد المشهد المناسب
      const scene = this.selectAppropriateScene(callData);
      
      // تخصيص المشهد للمكالمة
      const customizedScene = this.customizeSceneForCall(scene, callData);
      
      // إعداد الموسيقى والتأثيرات
      await this.setupSceneAudio(customizedScene);
      
      return customizedScene;
    } catch (error) {
      console.error('❌ Create call experience error:', error);
      return this.getDefaultScene();
    }
  }

  // اختيار المشهد المناسب
  private selectAppropriateScene(callData: any): TheaterScene {
    const { urgency, emotion, relationship, timeContext } = callData;
    
    // اختيار المشهد حسب الأولوية
    if (urgency === 'critical') {
      return this.scenes.get('emergency_urgent') || this.getDefaultScene();
    }
    
    if (relationship === 'family' || relationship === 'friend') {
      return this.scenes.get('home_personal') || this.getDefaultScene();
    }
    
    if (relationship === 'business' || relationship === 'colleague') {
      return this.scenes.get('office_business') || this.getDefaultScene();
    }
    
    // اختيار حسب الوقت
    if (timeContext === 'night') {
      return this.scenes.get('home_personal') || this.getDefaultScene();
    }
    
    return this.scenes.get('office_business') || this.getDefaultScene();
  }

  // تخصيص المشهد للمكالمة
  private customizeSceneForCall(scene: TheaterScene, callData: any): TheaterScene {
    const customizedScene = JSON.parse(JSON.stringify(scene)); // نسخة عميقة
    
    // تخصيص الإعدادات
    customizedScene.setting.timeOfDay = callData.timeContext || 'morning';
    customizedScene.setting.weather = this.determineWeather(callData);
    
    // تخصيص الشخصيات
    customizedScene.characters = customizedScene.characters.map(character => {
      if (character.role === 'caller') {
        character.personality = callData.callerPersonality || character.personality;
        character.emotions = callData.callerEmotions || character.emotions;
      }
      return character;
    });
    
    // تخصيص الحوار
    customizedScene.dialogue = this.customizeDialogue(customizedScene.dialogue, callData);
    
    // تخصيص الموسيقى
    customizedScene.music.mood = callData.emotion || 'neutral';
    customizedScene.music.volume = this.calculateMusicVolume(callData);
    
    return customizedScene;
  }

  // تحديد الطقس
  private determineWeather(callData: any): string {
    // يمكن ربط هذا بنظام الطقس الفعلي
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 18) {
      return 'sunny';
    } else {
      return 'clear';
    }
  }

  // تخصيص الحوار
  private customizeDialogue(dialogue: TheaterDialogue[], callData: any): TheaterDialogue[] {
    return dialogue.map(dialogueItem => {
      const customized = { ...dialogueItem };
      
      // تخصيص النص حسب السياق
      if (callData.callReason) {
        customized.textAr = customized.textAr.replace('{reason}', callData.callReason);
      }
      
      if (callData.contactName) {
        customized.textAr = customized.textAr.replace('{name}', callData.contactName);
      }
      
      // تخصيص المشاعر
      if (callData.emotion) {
        customized.emotion = callData.emotion;
        customized.tone = this.mapEmotionToTone(callData.emotion);
      }
      
      return customized;
    });
  }

  // ربط المشاعر بالنبرة
  private mapEmotionToTone(emotion: string): 'happy' | 'sad' | 'angry' | 'excited' | 'calm' | 'nervous' {
    const emotionMap: Record<string, any> = {
      'happy': 'excited',
      'sad': 'sad',
      'angry': 'angry',
      'excited': 'excited',
      'worried': 'nervous',
      'neutral': 'calm'
    };
    
    return emotionMap[emotion] || 'calm';
  }

  // حساب مستوى الموسيقى
  private calculateMusicVolume(callData: any): number {
    let volume = 0.4; // مستوى افتراضي
    
    if (callData.urgency === 'critical') {
      volume = 0.6; // أعلى للطوارئ
    } else if (callData.urgency === 'low') {
      volume = 0.2; // أقل للمكالمات العادية
    }
    
    if (callData.emotion === 'sad') {
      volume = 0.3; // أقل للمشاعر الحزينة
    } else if (callData.emotion === 'excited') {
      volume = 0.5; // أعلى للمشاعر المثيرة
    }
    
    return Math.min(Math.max(volume, 0.1), 0.8);
  }

  // إعداد الصوت للمشهد
  private async setupSceneAudio(scene: TheaterScene): Promise<void> {
    try {
      // إعداد الموسيقى الخلفية
      if (scene.music) {
        await this.loadMusicTrack(scene.music);
      }
      
      // إعداد التأثيرات الصوتية
      for (const effect of scene.effects) {
        if (effect.type === 'sound') {
          await this.loadSoundEffect(effect);
        }
      }
      
      console.log('🎵 Scene audio setup completed');
    } catch (error) {
      console.error('❌ Setup scene audio error:', error);
    }
  }

  // تحميل مسار موسيقي
  private async loadMusicTrack(music: TheaterMusic): Promise<void> {
    try {
      // في التطبيق الفعلي، سيتم تحميل الملفات من الخادم
      const audio = new Audio();
      audio.src = `/assets/music/${music.id}.mp3`; // مسار افتراضي
      audio.loop = music.loop;
      audio.volume = music.volume;
      
      this.musicTracks.set(music.id, audio);
      
      // تحميل مسبق
      await audio.load();
      
      console.log(`🎵 Music track loaded: ${music.name}`);
    } catch (error) {
      console.warn(`⚠️ Could not load music track: ${music.name}`, error);
    }
  }

  // تحميل تأثير صوتي
  private async loadSoundEffect(effect: TheaterEffect): Promise<void> {
    try {
      const audio = new Audio();
      audio.src = `/assets/sounds/${effect.id}.mp3`; // مسار افتراضي
      audio.volume = effect.intensity;
      
      this.soundEffects.set(effect.id, audio);
      
      // تحميل مسبق
      await audio.load();
      
      console.log(`🔊 Sound effect loaded: ${effect.name}`);
    } catch (error) {
      console.warn(`⚠️ Could not load sound effect: ${effect.name}`, error);
    }
  }

  // بدء المشهد
  async startScene(sceneId: string): Promise<boolean> {
    try {
      const scene = this.scenes.get(sceneId);
      if (!scene || !scene.isActive) {
        throw new Error(`Scene ${sceneId} not found or inactive`);
      }

      this.activeScene = scene;
      this.currentAct = 0;
      this.isPlaying = true;

      // بدء الموسيقى
      await this.startSceneMusic(scene.music);
      
      // بدء التأثيرات
      await this.startSceneEffects(scene.effects);

      console.log(`🎭 Scene started: ${scene.name}`);
      return true;
    } catch (error) {
      console.error('❌ Start scene error:', error);
      return false;
    }
  }

  // بدء موسيقى المشهد
  private async startSceneMusic(music: TheaterMusic): Promise<void> {
    try {
      const audio = this.musicTracks.get(music.id);
      if (audio) {
        audio.currentTime = 0;
        audio.volume = 0;
        await audio.play();
        
        // تأثير التلاشي التدريجي
        this.fadeInAudio(audio, music.volume, music.fadeIn);
      }
    } catch (error) {
      console.warn('⚠️ Could not start scene music:', error);
    }
  }

  // بدء تأثيرات المشهد
  private async startSceneEffects(effects: TheaterEffect[]): Promise<void> {
    for (const effect of effects) {
      if (effect.trigger === 'automatic') {
        await this.triggerEffect(effect);
      }
    }
  }

  // تفعيل تأثير
  private async triggerEffect(effect: TheaterEffect): Promise<void> {
    try {
      if (effect.type === 'sound') {
        const audio = this.soundEffects.get(effect.id);
        if (audio) {
          audio.currentTime = 0;
          audio.volume = effect.intensity;
          await audio.play();
        }
      }
      
      // يمكن إضافة تأثيرات بصرية هنا
      console.log(`✨ Effect triggered: ${effect.name}`);
    } catch (error) {
      console.warn(`⚠️ Could not trigger effect: ${effect.name}`, error);
    }
  }

  // تأثير التلاشي التدريجي
  private fadeInAudio(audio: HTMLAudioElement, targetVolume: number, duration: number): void {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(currentStep * volumeStep, targetVolume);

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepDuration * 1000);
  }

  // إيقاف المشهد
  async stopScene(): Promise<void> {
    try {
      if (!this.activeScene) return;

      // إيقاف الموسيقى
      if (this.activeScene.music) {
        await this.stopSceneMusic(this.activeScene.music);
      }

      // إيقاف التأثيرات
      await this.stopSceneEffects(this.activeScene.effects);

      this.isPlaying = false;
      this.activeScene = null;
      this.currentAct = 0;

      console.log('🎭 Scene stopped');
    } catch (error) {
      console.error('❌ Stop scene error:', error);
    }
  }

  // إيقاف موسيقى المشهد
  private async stopSceneMusic(music: TheaterMusic): Promise<void> {
    try {
      const audio = this.musicTracks.get(music.id);
      if (audio) {
        // تأثير التلاشي التدريجي للإيقاف
        this.fadeOutAudio(audio, music.fadeOut);
      }
    } catch (error) {
      console.warn('⚠️ Could not stop scene music:', error);
    }
  }

  // تأثير التلاشي التدريجي للإيقاف
  private fadeOutAudio(audio: HTMLAudioElement, duration: number): void {
    const steps = 20;
    const stepDuration = duration / steps;
    const initialVolume = audio.volume;
    const volumeStep = initialVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(initialVolume - (currentStep * volumeStep), 0);

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
      }
    }, stepDuration * 1000);
  }

  // إيقاف تأثيرات المشهد
  private async stopSceneEffects(effects: TheaterEffect[]): Promise<void> {
    for (const effect of effects) {
      if (effect.type === 'sound') {
        const audio = this.soundEffects.get(effect.id);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    }
  }

  // الحصول على المشهد النشط
  getActiveScene(): TheaterScene | null {
    return this.activeScene;
  }

  // الحصول على حالة التشغيل
  isScenePlaying(): boolean {
    return this.isPlaying;
  }

  // الحصول على المشهد الافتراضي
  private getDefaultScene(): TheaterScene {
    return this.scenes.get('office_business') || this.scenes.values().next().value;
  }

  // الحصول على جميع المشاهد
  getAllScenes(): TheaterScene[] {
    return Array.from(this.scenes.values());
  }

  // البحث عن مشاهد
  searchScenes(query: string): TheaterScene[] {
    const results: TheaterScene[] = [];
    const lowerQuery = query.toLowerCase();

    for (const scene of this.scenes.values()) {
      if (
        scene.name.toLowerCase().includes(lowerQuery) ||
        scene.nameAr.toLowerCase().includes(lowerQuery) ||
        scene.description.toLowerCase().includes(lowerQuery) ||
        scene.setting.name.toLowerCase().includes(lowerQuery)
      ) {
        results.push(scene);
      }
    }

    return results;
  }

  // إضافة مشهد جديد
  addScene(scene: TheaterScene): boolean {
    if (this.scenes.has(scene.id)) {
      return false;
    }

    this.scenes.set(scene.id, scene);
    return true;
  }

  // تحديث مشهد موجود
  updateScene(sceneId: string, updates: Partial<TheaterScene>): boolean {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      return false;
    }

    Object.assign(scene, updates);
    return true;
  }

  // حذف مشهد
  removeScene(sceneId: string): boolean {
    if (this.activeScene?.id === sceneId) {
      this.stopScene();
    }
    
    return this.scenes.delete(sceneId);
  }

  // الحصول على إحصائيات المسرح
  getTheaterStats(): {
    totalScenes: number;
    activeScenes: number;
    scenesByMood: Record<string, number>;
    scenesByType: Record<string, number>;
    totalDuration: number;
  } {
    const stats = {
      totalScenes: this.scenes.size,
      activeScenes: Array.from(this.scenes.values()).filter(s => s.isActive).length,
      scenesByMood: {} as Record<string, number>,
      scenesByType: {} as Record<string, number>,
      totalDuration: 0
    };

    for (const scene of this.scenes.values()) {
      // إحصائيات المزاج
      stats.scenesByMood[scene.mood] = (stats.scenesByMood[scene.mood] || 0) + 1;
      
      // إحصائيات النوع
      stats.scenesByType[scene.setting.type] = (stats.scenesByType[scene.setting.type] || 0) + 1;
      
      // إجمالي المدة
      stats.totalDuration += scene.duration;
    }

    return stats;
  }

  // تنظيف المسرح
  cleanup(): void {
    // إيقاف جميع المشاهد
    if (this.isPlaying) {
      this.stopScene();
    }

    // إيقاف جميع الملفات الصوتية
    this.musicTracks.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    this.soundEffects.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    // إغلاق سياق الصوت
    if (this.audioContext) {
      this.audioContext.close();
    }

    console.log('🧹 Theater cleanup completed');
  }
}

// تصدير نسخة واحدة من النظام
export const callTheater = new CallTheater();