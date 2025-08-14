import { BaseAgent, AgentTask } from './MasterAgent';
import { aiService } from '../services/aiService';
import { databaseService } from '../services/databaseService';
import { AIVoice, AICall, Contact, CallLog, Message } from '../types';

// AI Agent Implementation
class AIAgent extends BaseAgent {
  private aiQueue: Map<string, AITask> = new Map();
  private activeConversations: Map<string, any> = new Map();
  private aiModels: Map<string, any> = new Map();
  private trainingData: any[] = [];
  private aiInsights: any[] = [];
  private voiceCache: Map<string, AIVoice> = new Map();
  
  constructor() {
    super('ai', 'Artificial Intelligence Agent');
  }
  
  async start(): Promise<void> {
    try {
      console.log('🧠 Starting AI Agent...');
      
      this.status = 'initializing';
      
      // Load AI models
      await this.loadAIModels();
      
      // Load training data
      await this.loadTrainingData();
      
      // Initialize voice models
      await this.initializeVoiceModels();
      
      // Start AI monitoring
      this.startAIMonitoring();
      
      // Start model training
      this.startModelTraining();
      
      this.status = 'running';
      console.log('✅ AI Agent started successfully');
      
    } catch (error) {
      console.error('❌ AI Agent start error:', error);
      this.status = 'error';
      throw error;
    }
  }
  
  async stop(): Promise<void> {
    try {
      console.log('🧠 Stopping AI Agent...');
      
      this.status = 'stopped';
      
      // Clear AI queue
      this.aiQueue.clear();
      
      // Stop active conversations
      for (const [id, conversation] of this.activeConversations) {
        await this.stopConversation(id);
      }
      
      console.log('✅ AI Agent stopped successfully');
      
    } catch (error) {
      console.error('❌ AI Agent stop error:', error);
      throw error;
    }
  }
  
  async executeTask(task: AgentTask): Promise<any> {
    try {
      console.log(`🧠 AI Agent executing task: ${task.description}`);
      
      this.activeTasks.add(task.id);
      
      let result: any;
      
      switch (task.data.action) {
        case 'startConversation':
          result = await this.startConversation(task.data.context, task.data.voice);
          break;
          
        case 'stopConversation':
          result = await this.stopConversation(task.data.conversationId);
          break;
          
        case 'processText':
          result = await this.processText(task.data.text, task.data.task);
          break;
          
        case 'generateVoice':
          result = await this.generateVoice(task.data.text, task.data.voice);
          break;
          
        case 'recognizeSpeech':
          result = await this.recognizeSpeech(task.data.audioData);
          break;
          
        case 'analyzeSentiment':
          result = await this.analyzeSentiment(task.data.text);
          break;
          
        case 'extractEntities':
          result = await this.extractEntities(task.data.text);
          break;
          
        case 'classifyText':
          result = await this.classifyText(task.data.text, task.data.categories);
          break;
          
        case 'summarizeText':
          result = await this.summarizeText(task.data.text, task.data.maxLength);
          break;
          
        case 'translateText':
          result = await this.translateText(task.data.text, task.data.targetLanguage);
          break;
          
        case 'generateResponse':
          result = await this.generateResponse(task.data.context, task.data.style);
          break;
          
        case 'trainModel':
          result = await this.trainModel(task.data.modelType, task.data.trainingData);
          break;
          
        case 'evaluateModel':
          result = await this.evaluateModel(task.data.modelId);
          break;
          
        case 'optimizeModel':
          result = await this.optimizeModel(task.data.modelId, task.data.parameters);
          break;
          
        case 'getAIInsights':
          result = await this.getAIInsights(task.data.dataType);
          break;
          
        case 'predictBehavior':
          result = await this.predictBehavior(task.data.userId, task.data.context);
          break;
          
        case 'recommendActions':
          result = await this.recommendActions(task.data.context, task.data.goals);
          break;
          
        default:
          throw new Error(`Unknown AI action: ${task.data.action}`);
      }
      
      this.taskCompleted();
      this.activeTasks.delete(task.id);
      
      console.log(`✅ AI Agent task completed: ${task.description}`);
      return result;
      
    } catch (error) {
      console.error(`❌ AI Agent task error: ${task.description}`, error);
      this.taskError();
      this.activeTasks.delete(task.id);
      throw error;
    }
  }
  
  async cancelTask(taskId: string): Promise<boolean> {
    try {
      const aiTask = this.aiQueue.get(taskId);
      if (aiTask) {
        // Cancel the AI task
        await this.cancelAITask(aiTask);
        this.aiQueue.delete(taskId);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Cancel AI task error:', error);
      return false;
    }
  }
  
  // Conversation Management Methods
  private async startConversation(context: string, voice: string): Promise<{
    conversationId: string;
    status: 'active' | 'error';
    message: string;
  }> {
    try {
      const conversationId = `conv_${Date.now()}`;
      
      // Get AI voice
      const selectedVoice = await this.getVoice(voice);
      if (!selectedVoice) {
        throw new Error('Selected voice not found');
      }
      
      // Start conversation with AI service
      const conversation = await aiService.startConversation(context, selectedVoice);
      
      // Store active conversation
      this.activeConversations.set(conversationId, {
        id: conversationId,
        context,
        voice: selectedVoice,
        startTime: new Date(),
        status: 'active',
        conversation,
      });
      
      console.log(`✅ Conversation started: ${conversationId}`);
      
      return {
        conversationId,
        status: 'active',
        message: 'Conversation started successfully',
      };
      
    } catch (error) {
      console.error('❌ Start conversation error:', error);
      throw error;
    }
  }
  
  private async stopConversation(conversationId: string): Promise<boolean> {
    try {
      const conversation = this.activeConversations.get(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Stop conversation with AI service
      await aiService.stopConversation();
      
      // Remove from active conversations
      this.activeConversations.delete(conversationId);
      
      console.log(`✅ Conversation stopped: ${conversationId}`);
      return true;
      
    } catch (error) {
      console.error('❌ Stop conversation error:', error);
      throw error;
    }
  }
  
  // Text Processing Methods
  private async processText(text: string, task: string): Promise<any> {
    try {
      let result: any;
      
      switch (task) {
        case 'sentiment':
          result = await this.analyzeSentiment(text);
          break;
          
        case 'entities':
          result = await this.extractEntities(text);
          break;
          
        case 'classification':
          result = await this.classifyText(text, ['personal', 'business', 'spam']);
          break;
          
        case 'summary':
          result = await this.summarizeText(text, 100);
          break;
          
        case 'translation':
          result = await this.translateText(text, 'en');
          break;
          
        default:
          throw new Error(`Unknown text processing task: ${task}`);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Process text error:', error);
      throw error;
    }
  }
  
  private async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
  }> {
    try {
      // Use AI service for sentiment analysis
      const result = await aiService.analyzeSentiment(text);
      
      // Store insight
      this.aiInsights.push({
        type: 'sentiment_analysis',
        text: text.substring(0, 100),
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Analyze sentiment error:', error);
      throw error;
    }
  }
  
  private async extractEntities(text: string): Promise<{
    entities: Array<{
      text: string;
      type: string;
      confidence: number;
    }>;
    totalCount: number;
  }> {
    try {
      // Use AI service for entity extraction
      const result = await aiService.extractEntities(text);
      
      // Store insight
      this.aiInsights.push({
        type: 'entity_extraction',
        text: text.substring(0, 100),
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Extract entities error:', error);
      throw error;
    }
  }
  
  private async classifyText(text: string, categories: string[]): Promise<{
    category: string;
    confidence: number;
    alternatives: Array<{
      category: string;
      confidence: number;
    }>;
  }> {
    try {
      // Use AI service for text classification
      const result = await aiService.classifyText(text, categories);
      
      // Store insight
      this.aiInsights.push({
        type: 'text_classification',
        text: text.substring(0, 100),
        categories,
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Classify text error:', error);
      throw error;
    }
  }
  
  private async summarizeText(text: string, maxLength: number): Promise<{
    summary: string;
    originalLength: number;
    summaryLength: number;
    compressionRatio: number;
  }> {
    try {
      // Use AI service for text summarization
      const result = await aiService.summarizeText(text, maxLength);
      
      // Store insight
      this.aiInsights.push({
        type: 'text_summarization',
        originalLength: text.length,
        maxLength,
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Summarize text error:', error);
      throw error;
    }
  }
  
  private async translateText(text: string, targetLanguage: string): Promise<{
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    confidence: number;
  }> {
    try {
      // Use AI service for text translation
      const result = await aiService.translateText(text, targetLanguage);
      
      // Store insight
      this.aiInsights.push({
        type: 'text_translation',
        sourceText: text.substring(0, 100),
        targetLanguage,
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Translate text error:', error);
      throw error;
    }
  }
  
  // Voice Generation Methods
  private async generateVoice(text: string, voice: string): Promise<{
    audioUrl: string;
    duration: number;
    format: string;
    quality: string;
  }> {
    try {
      // Get AI voice
      const selectedVoice = await this.getVoice(voice);
      if (!selectedVoice) {
        throw new Error('Selected voice not found');
      }
      
      // Generate voice using AI service
      const result = await aiService.generateVoice(text, selectedVoice);
      
      // Store insight
      this.aiInsights.push({
        type: 'voice_generation',
        text: text.substring(0, 100),
        voice: selectedVoice.id,
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Generate voice error:', error);
      throw error;
    }
  }
  
  // Speech Recognition Methods
  private async recognizeSpeech(audioData: any): Promise<{
    text: string;
    confidence: number;
    language: string;
    alternatives: string[];
  }> {
    try {
      // Use AI service for speech recognition
      const result = await aiService.recognizeSpeech(audioData);
      
      // Store insight
      this.aiInsights.push({
        type: 'speech_recognition',
        audioLength: audioData.length,
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Recognize speech error:', error);
      throw error;
    }
  }
  
  // Response Generation Methods
  private async generateResponse(context: string, style: string): Promise<{
    response: string;
    confidence: number;
    alternatives: string[];
    metadata: any;
  }> {
    try {
      // Use AI service for response generation
      const result = await aiService.generateResponse(context, style);
      
      // Store insight
      this.aiInsights.push({
        type: 'response_generation',
        context: context.substring(0, 100),
        style,
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Generate response error:', error);
      throw error;
    }
  }
  
  // Model Training Methods
  private async trainModel(modelType: string, trainingData: any[]): Promise<{
    modelId: string;
    status: 'training' | 'completed' | 'failed';
    accuracy: number;
    trainingTime: number;
  }> {
    try {
      console.log(`🤖 Training ${modelType} model...`);
      
      const startTime = Date.now();
      const modelId = `model_${modelType}_${Date.now()}`;
      
      // Validate training data
      if (!trainingData || trainingData.length === 0) {
        throw new Error('Training data is required');
      }
      
      // Start model training
      const trainingResult = await aiService.trainModel(modelType, trainingData);
      
      // Store model
      this.aiModels.set(modelId, {
        id: modelId,
        type: modelType,
        status: 'completed',
        accuracy: trainingResult.accuracy || 0.85,
        trainingTime: Date.now() - startTime,
        createdAt: new Date(),
        trainingData: trainingData.length,
      });
      
      console.log(`✅ Model training completed: ${modelId}`);
      
      return {
        modelId,
        status: 'completed',
        accuracy: trainingResult.accuracy || 0.85,
        trainingTime: Date.now() - startTime,
      };
      
    } catch (error) {
      console.error('❌ Train model error:', error);
      throw error;
    }
  }
  
  private async evaluateModel(modelId: string): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: any;
  }> {
    try {
      const model = this.aiModels.get(modelId);
      if (!model) {
        throw new Error('Model not found');
      }
      
      // Use AI service for model evaluation
      const result = await aiService.evaluateModel(modelId);
      
      // Update model metrics
      model.accuracy = result.accuracy;
      model.lastEvaluated = new Date();
      
      return result;
      
    } catch (error) {
      console.error('❌ Evaluate model error:', error);
      throw error;
    }
  }
  
  private async optimizeModel(modelId: string, parameters: any): Promise<{
    success: boolean;
    newAccuracy: number;
    improvement: number;
    parameters: any;
  }> {
    try {
      const model = this.aiModels.get(modelId);
      if (!model) {
        throw new Error('Model not found');
      }
      
      // Use AI service for model optimization
      const result = await aiService.optimizeModel(modelId, parameters);
      
      // Update model
      model.accuracy = result.newAccuracy;
      model.parameters = parameters;
      model.lastOptimized = new Date();
      
      return result;
      
    } catch (error) {
      console.error('❌ Optimize model error:', error);
      throw error;
    }
  }
  
  // AI Insights Methods
  private async getAIInsights(dataType: string): Promise<{
    insights: any[];
    patterns: any[];
    recommendations: string[];
    trends: any[];
  }> {
    try {
      // Filter insights by data type
      const relevantInsights = this.aiInsights.filter(insight => 
        insight.type.includes(dataType) || dataType === 'all'
      );
      
      // Analyze patterns
      const patterns = this.analyzePatterns(relevantInsights);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(relevantInsights);
      
      // Identify trends
      const trends = this.identifyTrends(relevantInsights);
      
      return {
        insights: relevantInsights.slice(-50), // Last 50 insights
        patterns,
        recommendations,
        trends,
      };
      
    } catch (error) {
      console.error('❌ Get AI insights error:', error);
      throw error;
    }
  }
  
  // Prediction Methods
  private async predictBehavior(userId: string, context: any): Promise<{
    predictions: Array<{
      behavior: string;
      probability: number;
      confidence: number;
    }>;
    factors: string[];
    recommendations: string[];
  }> {
    try {
      // Get user data
      const userData = await this.getUserData(userId);
      
      // Use AI service for behavior prediction
      const result = await aiService.predictBehavior(userData, context);
      
      // Store insight
      this.aiInsights.push({
        type: 'behavior_prediction',
        userId,
        context,
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Predict behavior error:', error);
      throw error;
    }
  }
  
  // Recommendation Methods
  private async recommendActions(context: any, goals: string[]): Promise<{
    actions: Array<{
      action: string;
      priority: 'low' | 'medium' | 'high';
      expectedOutcome: string;
      confidence: number;
    }>;
    reasoning: string;
    alternatives: string[];
  }> {
    try {
      // Use AI service for action recommendations
      const result = await aiService.recommendActions(context, goals);
      
      // Store insight
      this.aiInsights.push({
        type: 'action_recommendation',
        context,
        goals,
        result,
        timestamp: new Date(),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Recommend actions error:', error);
      throw error;
    }
  }
  
  // Private helper methods
  private async loadAIModels(): Promise<void> {
    try {
      // Load AI models from storage or database
      // For now, using empty map
      this.aiModels = new Map();
      console.log('🤖 AI models loaded');
    } catch (error) {
      console.error('❌ Load AI models error:', error);
    }
  }
  
  private async loadTrainingData(): Promise<void> {
    try {
      // Load training data from storage or database
      // For now, using empty array
      this.trainingData = [];
      console.log('📚 Training data loaded');
    } catch (error) {
      console.error('❌ Load training data error:', error);
    }
  }
  
  private async initializeVoiceModels(): Promise<void> {
    try {
      // Get available voices from AI service
      const voices = await aiService.getAvailableVoices();
      
      // Cache voices
      voices.forEach(voice => {
        this.voiceCache.set(voice.id, voice);
      });
      
      console.log(`🎤 ${voices.length} voice models initialized`);
    } catch (error) {
      console.error('❌ Initialize voice models error:', error);
    }
  }
  
  private async getVoice(voiceId: string): Promise<AIVoice | null> {
    try {
      // Check cache first
      if (this.voiceCache.has(voiceId)) {
        return this.voiceCache.get(voiceId)!;
      }
      
      // Get from AI service
      const voices = await aiService.getAvailableVoices();
      const voice = voices.find(v => v.id === voiceId);
      
      if (voice) {
        this.voiceCache.set(voiceId, voice);
      }
      
      return voice || null;
      
    } catch (error) {
      console.error('❌ Get voice error:', error);
      return null;
    }
  }
  
  private startAIMonitoring(): void {
    // Monitor AI system performance and health
    setInterval(async () => {
      try {
        // Check AI models health
        await this.checkAIModelsHealth();
        
        // Monitor conversation quality
        await this.monitorConversationQuality();
        
        // Analyze performance metrics
        await this.analyzePerformanceMetrics();
        
      } catch (error) {
        console.error('❌ AI monitoring error:', error);
      }
    }, 300000); // Check every 5 minutes
  }
  
  private startModelTraining(): void {
    // Periodically retrain models with new data
    setInterval(async () => {
      try {
        console.log('🤖 Starting periodic model training...');
        
        // Check if retraining is needed
        const needsRetraining = await this.checkRetrainingNeeds();
        
        if (needsRetraining) {
          // Retrain models
          await this.retrainModels();
        }
        
        console.log('✅ Periodic model training completed');
        
      } catch (error) {
        console.error('❌ Periodic model training error:', error);
      }
    }, 86400000); // Run daily
  }
  
  private async checkAIModelsHealth(): Promise<void> {
    try {
      for (const [modelId, model] of this.aiModels) {
        // Check model performance
        if (model.accuracy < 0.7) {
          console.log(`⚠️ Model ${modelId} has low accuracy: ${model.accuracy}`);
        }
        
        // Check model age
        const modelAge = Date.now() - model.createdAt.getTime();
        if (modelAge > 30 * 24 * 60 * 60 * 1000) { // 30 days
          console.log(`⚠️ Model ${modelId} is old: ${Math.floor(modelAge / (24 * 60 * 60 * 1000))} days`);
        }
      }
    } catch (error) {
      console.error('❌ Check AI models health error:', error);
    }
  }
  
  private async monitorConversationQuality(): Promise<void> {
    try {
      for (const [id, conversation] of this.activeConversations) {
        // Check conversation duration
        const duration = Date.now() - conversation.startTime.getTime();
        if (duration > 300000) { // 5 minutes
          console.log(`⚠️ Long conversation detected: ${id} (${Math.floor(duration / 60000)} minutes)`);
        }
      }
    } catch (error) {
      console.error('❌ Monitor conversation quality error:', error);
    }
  }
  
  private async analyzePerformanceMetrics(): Promise<void> {
    try {
      // Analyze recent insights for performance patterns
      const recentInsights = this.aiInsights.slice(-100);
      
      // Calculate success rates
      const successRates = this.calculateSuccessRates(recentInsights);
      
      // Log performance metrics
      console.log('📊 AI Performance Metrics:', successRates);
      
    } catch (error) {
      console.error('❌ Analyze performance metrics error:', error);
    }
  }
  
  private async checkRetrainingNeeds(): Promise<boolean> {
    try {
      // Check if models need retraining based on performance
      for (const [modelId, model] of this.aiModels) {
        if (model.accuracy < 0.75) {
          return true; // Retraining needed
        }
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Check retraining needs error:', error);
      return false;
    }
  }
  
  private async retrainModels(): Promise<void> {
    try {
      console.log('🔄 Retraining AI models...');
      
      // Get new training data
      const newTrainingData = await this.collectNewTrainingData();
      
      // Retrain each model
      for (const [modelId, model] of this.aiModels) {
        try {
          await this.trainModel(model.type, newTrainingData);
          console.log(`✅ Model ${modelId} retrained successfully`);
        } catch (error) {
          console.error(`❌ Failed to retrain model ${modelId}:`, error);
        }
      }
      
      console.log('✅ Model retraining completed');
      
    } catch (error) {
      console.error('❌ Retrain models error:', error);
    }
  }
  
  private async collectNewTrainingData(): Promise<any[]> {
    try {
      // Collect new training data from various sources
      const newData: any[] = [];
      
      // Add recent insights
      newData.push(...this.aiInsights.slice(-100));
      
      // Add conversation data
      for (const [id, conversation] of this.activeConversations) {
        newData.push({
          type: 'conversation',
          context: conversation.context,
          timestamp: conversation.startTime,
        });
      }
      
      return newData;
      
    } catch (error) {
      console.error('❌ Collect new training data error:', error);
      return [];
    }
  }
  
  private analyzePatterns(insights: any[]): any[] {
    try {
      const patterns: any[] = [];
      
      // Group insights by type
      const groupedInsights = insights.reduce((acc, insight) => {
        if (!acc[insight.type]) {
          acc[insight.type] = [];
        }
        acc[insight.type].push(insight);
        return acc;
      }, {} as Record<string, any[]>);
      
      // Analyze patterns for each type
      for (const [type, typeInsights] of Object.entries(groupedInsights)) {
        if (typeInsights.length > 5) {
          patterns.push({
            type,
            frequency: typeInsights.length,
            timeRange: {
              start: typeInsights[0].timestamp,
              end: typeInsights[typeInsights.length - 1].timestamp,
            },
            commonElements: this.findCommonElements(typeInsights),
          });
        }
      }
      
      return patterns;
      
    } catch (error) {
      console.error('❌ Analyze patterns error:', error);
      return [];
    }
  }
  
  private generateRecommendations(insights: any[]): string[] {
    try {
      const recommendations: string[] = [];
      
      // Analyze insights for improvement opportunities
      const errorInsights = insights.filter(insight => 
        insight.result && insight.result.error
      );
      
      if (errorInsights.length > 0) {
        recommendations.push('Review and fix AI model errors');
        recommendations.push('Improve error handling in AI services');
      }
      
      const lowConfidenceInsights = insights.filter(insight => 
        insight.result && insight.result.confidence && insight.result.confidence < 0.7
      );
      
      if (lowConfidenceInsights.length > 0) {
        recommendations.push('Retrain AI models with more data');
        recommendations.push('Improve model accuracy');
      }
      
      if (recommendations.length === 0) {
        recommendations.push('AI system performing well');
        recommendations.push('Continue monitoring and optimization');
      }
      
      return recommendations;
      
    } catch (error) {
      console.error('❌ Generate recommendations error:', error);
      return ['Review AI system configuration'];
    }
  }
  
  private identifyTrends(insights: any[]): any[] {
    try {
      const trends: any[] = [];
      
      // Group insights by time periods
      const timeGroups = this.groupInsightsByTime(insights);
      
      // Analyze trends for each time period
      for (const [period, periodInsights] of Object.entries(timeGroups)) {
        if (periodInsights.length > 10) {
          trends.push({
            period,
            insightCount: periodInsights.length,
            averageConfidence: this.calculateAverageConfidence(periodInsights),
            topTypes: this.getTopInsightTypes(periodInsights),
          });
        }
      }
      
      return trends;
      
    } catch (error) {
      console.error('❌ Identify trends error:', error);
      return [];
    }
  }
  
  private groupInsightsByTime(insights: any[]): Record<string, any[]> {
    try {
      const groups: Record<string, any[]> = {
        'last_hour': [],
        'last_day': [],
        'last_week': [],
        'last_month': [],
      };
      
      const now = Date.now();
      
      for (const insight of insights) {
        const age = now - insight.timestamp.getTime();
        
        if (age < 60 * 60 * 1000) {
          groups['last_hour'].push(insight);
        } else if (age < 24 * 60 * 60 * 1000) {
          groups['last_day'].push(insight);
        } else if (age < 7 * 24 * 60 * 60 * 1000) {
          groups['last_week'].push(insight);
        } else if (age < 30 * 24 * 60 * 60 * 1000) {
          groups['last_month'].push(insight);
        }
      }
      
      return groups;
      
    } catch (error) {
      console.error('❌ Group insights by time error:', error);
      return {};
    }
  }
  
  private findCommonElements(insights: any[]): any[] {
    try {
      const elements: any[] = [];
      
      // Find common patterns in insights
      const textInsights = insights.filter(insight => insight.text);
      
      if (textInsights.length > 0) {
        // Simple common word analysis
        const words = textInsights.flatMap(insight => 
          insight.text.toLowerCase().split(/\s+/)
        );
        
        const wordCounts = words.reduce((acc, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        // Get top words
        const topWords = Object.entries(wordCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([word, count]) => ({ word, count }));
        
        elements.push(...topWords);
      }
      
      return elements;
      
    } catch (error) {
      console.error('❌ Find common elements error:', error);
      return [];
    }
  }
  
  private calculateAverageConfidence(insights: any[]): number {
    try {
      const confidenceValues = insights
        .filter(insight => insight.result && insight.result.confidence)
        .map(insight => insight.result.confidence);
      
      if (confidenceValues.length === 0) return 0;
      
      return confidenceValues.reduce((sum, val) => sum + val, 0) / confidenceValues.length;
      
    } catch (error) {
      console.error('❌ Calculate average confidence error:', error);
      return 0;
    }
  }
  
  private getTopInsightTypes(insights: any[]): string[] {
    try {
      const typeCounts = insights.reduce((acc, insight) => {
        acc[insight.type] = (acc[insight.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(typeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type);
      
    } catch (error) {
      console.error('❌ Get top insight types error:', error);
      return [];
    }
  }
  
  private calculateSuccessRates(insights: any[]): any {
    try {
      const successRates: any = {};
      
      // Group insights by type
      const groupedInsights = insights.reduce((acc, insight) => {
        if (!acc[insight.type]) {
          acc[insight.type] = [];
        }
        acc[insight.type].push(insight);
        return acc;
      }, {} as Record<string, any[]>);
      
      // Calculate success rate for each type
      for (const [type, typeInsights] of Object.entries(groupedInsights)) {
        const successful = typeInsights.filter(insight => 
          insight.result && !insight.result.error
        ).length;
        
        successRates[type] = {
          total: typeInsights.length,
          successful,
          rate: typeInsights.length > 0 ? successful / typeInsights.length : 0,
        };
      }
      
      return successRates;
      
    } catch (error) {
      console.error('❌ Calculate success rates error:', error);
      return {};
    }
  }
  
  private async getUserData(userId: string): Promise<any> {
    try {
      // Get user data from database
      const user = await databaseService.getUser(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Get user's contacts, calls, messages
      const contacts = await databaseService.getContactsByUser(userId);
      const calls = await databaseService.getCallLogsByUser(userId);
      const messages = await databaseService.getMessagesByUser(userId);
      
      return {
        user,
        contacts,
        calls,
        messages,
      };
      
    } catch (error) {
      console.error('❌ Get user data error:', error);
      throw error;
    }
  }
  
  private async cancelAITask(aiTask: AITask): Promise<void> {
    try {
      // Cancel the specific AI task
      console.log(`🚫 Cancelled AI task: ${aiTask.id}`);
      
    } catch (error) {
      console.error('❌ Cancel AI task error:', error);
    }
  }
}

// AI Task Interface
interface AITask {
  id: string;
  action: string;
  data: any;
  status: 'pending' | 'running' | 'completed' | 'cancelled';
}

// Export singleton instance
export const aiAgent = new AIAgent();

// Export types
export type { AITask };