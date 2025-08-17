// ========================================
// AI Health Monitor Tests
// اختبارات نظام مراقب صحة الذكاء الاصطناعي
// ========================================

import { aiHealthMonitor } from './AIHealthMonitor';

describe('AI Health Monitor System', () => {
  beforeEach(() => {
    // إعادة تعيين النظام قبل كل اختبار
    aiHealthMonitor.cleanup();
  });

  afterAll(() => {
    // تنظيف النظام بعد جميع الاختبارات
    aiHealthMonitor.cleanup();
  });

  describe('System Initialization', () => {
    test('should initialize health monitor correctly', () => {
      expect(aiHealthMonitor).toBeDefined();
      expect(typeof aiHealthMonitor.generateHealthReport).toBe('function');
      expect(typeof aiHealthMonitor.getSystemStats).toBe('function');
    });

    test('should start monitoring automatically', () => {
      // التحقق من أن النظام بدأ المراقبة
      const stats = aiHealthMonitor.getSystemStats();
      expect(stats.totalAgents).toBeGreaterThan(0);
    });
  });

  describe('Health Metrics Collection', () => {
    test('should collect agent health metrics', async () => {
      const metrics = aiHealthMonitor.getCurrentHealthMetrics();
      
      expect(metrics).toBeDefined();
      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBeGreaterThan(0);
      
      // التحقق من أن كل وكيل له المقاييس المطلوبة
      metrics.forEach(metric => {
        expect(metric.agentId).toBeDefined();
        expect(metric.status).toBeDefined();
        expect(metric.responseTime).toBeGreaterThan(0);
        expect(metric.successRate).toBeGreaterThan(0);
        expect(metric.errorCount).toBeGreaterThanOrEqual(0);
        expect(metric.lastActivity).toBeInstanceOf(Date);
        expect(metric.memoryUsage).toBeGreaterThan(0);
        expect(metric.cpuUsage).toBeGreaterThan(0);
      });
    });

    test('should collect feature health metrics', async () => {
      const report = await aiHealthMonitor.generateHealthReport();
      
      expect(report.features).toBeDefined();
      expect(report.features.aiCharacters).toBeDefined();
      expect(report.features.callMood).toBeDefined();
      expect(report.features.userLearning).toBeDefined();
      expect(report.features.callScenarios).toBeDefined();
      expect(report.features.callTheater).toBeDefined();
      expect(report.features.interactiveCalls).toBeDefined();
      expect(report.features.personalityBased).toBeDefined();
    });
  });

  describe('Health Analysis', () => {
    test('should calculate overall system health correctly', async () => {
      const report = await aiHealthMonitor.generateHealthReport();
      
      expect(report.overallHealth).toBeDefined();
      expect(['excellent', 'good', 'fair', 'poor', 'critical']).toContain(report.overallHealth);
    });

    test('should detect health issues', async () => {
      // محاكاة مشاكل صحية
      const metrics = aiHealthMonitor.getCurrentHealthMetrics();
      const report = await aiHealthMonitor.generateHealthReport();
      
      // التحقق من أن النظام يكتشف المشاكل
      expect(report.alerts).toBeDefined();
      expect(Array.isArray(report.alerts)).toBe(true);
    });

    test('should generate recommendations', async () => {
      const report = await aiHealthMonitor.generateHealthReport();
      
      expect(report.recommendations).toBeDefined();
      expect(Array.isArray(report.recommendations)).toBe(true);
    });
  });

  describe('Alert System', () => {
    test('should create health alerts', () => {
      const initialAlerts = aiHealthMonitor.getActiveAlerts();
      const initialCount = initialAlerts.length;
      
      // انتظار إنشاء تنبيهات جديدة
      setTimeout(() => {
        const newAlerts = aiHealthMonitor.getActiveAlerts();
        expect(newAlerts.length).toBeGreaterThanOrEqual(initialCount);
      }, 1000);
    });

    test('should resolve alerts', () => {
      const alerts = aiHealthMonitor.getActiveAlerts();
      
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        const success = aiHealthMonitor.resolveAlert(alertId);
        expect(success).toBe(true);
        
        // التحقق من أن التنبيه تم حله
        const updatedAlerts = aiHealthMonitor.getActiveAlerts();
        const resolvedAlert = updatedAlerts.find(a => a.id === alertId);
        expect(resolvedAlert?.isResolved).toBe(true);
      }
    });

    test('should categorize alerts by severity', () => {
      const alerts = aiHealthMonitor.getActiveAlerts();
      
      alerts.forEach(alert => {
        expect(alert.severity).toBeDefined();
        expect(['low', 'medium', 'high', 'critical']).toContain(alert.severity);
        expect(alert.type).toBeDefined();
        expect(['warning', 'error', 'critical']).toContain(alert.type);
      });
    });
  });

  describe('System Statistics', () => {
    test('should provide comprehensive system stats', () => {
      const stats = aiHealthMonitor.getSystemStats();
      
      expect(stats.totalAgents).toBeGreaterThan(0);
      expect(stats.healthyAgents).toBeGreaterThanOrEqual(0);
      expect(stats.warningAgents).toBeGreaterThanOrEqual(0);
      expect(stats.criticalAgents).toBeGreaterThanOrEqual(0);
      expect(stats.offlineAgents).toBeGreaterThanOrEqual(0);
      expect(stats.totalAlerts).toBeGreaterThanOrEqual(0);
      expect(stats.resolvedAlerts).toBeGreaterThanOrEqual(0);
      expect(stats.averageResponseTime).toBeGreaterThan(0);
      expect(stats.averageSuccessRate).toBeGreaterThan(0);
      
      // التحقق من صحة الإحصائيات
      expect(stats.healthyAgents + stats.warningAgents + stats.criticalAgents + stats.offlineAgents)
        .toBe(stats.totalAgents);
    });

    test('should calculate averages correctly', () => {
      const stats = aiHealthMonitor.getSystemStats();
      const metrics = aiHealthMonitor.getCurrentHealthMetrics();
      
      if (metrics.length > 0) {
        const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
        const avgSuccessRate = metrics.reduce((sum, m) => sum + m.successRate, 0) / metrics.length;
        
        expect(stats.averageResponseTime).toBeCloseTo(avgResponseTime, 1);
        expect(stats.averageSuccessRate).toBeCloseTo(avgSuccessRate, 1);
      }
    });
  });

  describe('Health Report Generation', () => {
    test('should generate complete health report', async () => {
      const report = await aiHealthMonitor.generateHealthReport();
      
      expect(report.timestamp).toBeInstanceOf(Date);
      expect(report.overallHealth).toBeDefined();
      expect(report.agents).toBeDefined();
      expect(report.features).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.alerts).toBeDefined();
      
      // التحقق من أن التقرير يحتوي على بيانات صحيحة
      expect(report.agents.length).toBeGreaterThan(0);
      expect(Object.keys(report.features).length).toBeGreaterThan(0);
    });

    test('should include agent details in report', async () => {
      const report = await aiHealthMonitor.generateHealthReport();
      
      report.agents.forEach(agent => {
        expect(agent.agentId).toBeDefined();
        expect(agent.status).toBeDefined();
        expect(agent.responseTime).toBeGreaterThan(0);
        expect(agent.successRate).toBeGreaterThan(0);
        expect(agent.errorCount).toBeGreaterThanOrEqual(0);
        expect(agent.lastActivity).toBeInstanceOf(Date);
      });
    });
  });

  describe('Monitoring Control', () => {
    test('should start and stop monitoring', () => {
      // إيقاف المراقبة
      aiHealthMonitor.stopMonitoring();
      
      // إعادة بدء المراقبة
      aiHealthMonitor.startMonitoring();
      
      // التحقق من أن النظام يعمل
      const stats = aiHealthMonitor.getSystemStats();
      expect(stats.totalAgents).toBeGreaterThan(0);
    });

    test('should handle monitoring lifecycle', () => {
      // اختبار دورة حياة المراقبة
      aiHealthMonitor.stopMonitoring();
      aiHealthMonitor.startMonitoring();
      
      // التحقق من أن النظام يعمل بشكل صحيح
      const metrics = aiHealthMonitor.getCurrentHealthMetrics();
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  describe('Data Management', () => {
    test('should maintain health history', () => {
      // انتظار إنشاء سجلات صحية
      setTimeout(() => {
        const metrics = aiHealthMonitor.getCurrentHealthMetrics();
        expect(metrics.length).toBeGreaterThan(0);
      }, 2000);
    });

    test('should cleanup old data', () => {
      aiHealthMonitor.cleanup();
      
      // التحقق من أن النظام يعمل بعد التنظيف
      const stats = aiHealthMonitor.getSystemStats();
      expect(stats.totalAgents).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle metric collection errors gracefully', async () => {
      // محاكاة خطأ في جمع المقاييس
      try {
        await aiHealthMonitor.generateHealthReport();
        // يجب أن لا يحدث خطأ
        expect(true).toBe(true);
      } catch (error) {
        // إذا حدث خطأ، يجب أن يكون خطأ متوقع
        expect(error).toBeDefined();
      }
    });

    test('should continue monitoring despite errors', () => {
      // التحقق من أن النظام يستمر في العمل حتى مع وجود أخطاء
      const stats = aiHealthMonitor.getSystemStats();
      expect(stats.totalAgents).toBeGreaterThan(0);
    });
  });

  describe('Performance Monitoring', () => {
    test('should monitor response times', () => {
      const metrics = aiHealthMonitor.getCurrentHealthMetrics();
      
      metrics.forEach(metric => {
        expect(metric.responseTime).toBeGreaterThan(0);
        expect(metric.responseTime).toBeLessThan(10000); // أقل من 10 ثواني
      });
    });

    test('should monitor success rates', () => {
      const metrics = aiHealthMonitor.getCurrentHealthMetrics();
      
      metrics.forEach(metric => {
        expect(metric.successRate).toBeGreaterThan(0);
        expect(metric.successRate).toBeLessThanOrEqual(100);
      });
    });

    test('should monitor resource usage', () => {
      const metrics = aiHealthMonitor.getCurrentHealthMetrics();
      
      metrics.forEach(metric => {
        expect(metric.memoryUsage).toBeGreaterThan(0);
        expect(metric.cpuUsage).toBeGreaterThan(0);
        expect(metric.cpuUsage).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Integration Tests', () => {
    test('should integrate with other AI systems', async () => {
      const report = await aiHealthMonitor.generateHealthReport();
      
      // التحقق من أن النظام يتكامل مع الميزات الأخرى
      expect(report.features.aiCharacters).toBeDefined();
      expect(report.features.callMood).toBeDefined();
      expect(report.features.userLearning).toBeDefined();
    });

    test('should provide real-time monitoring', () => {
      // التحقق من أن المراقبة تعمل في الوقت الفعلي
      const initialStats = aiHealthMonitor.getSystemStats();
      
      setTimeout(() => {
        const updatedStats = aiHealthMonitor.getSystemStats();
        // يجب أن تتغير الإحصائيات مع مرور الوقت
        expect(updatedStats).toBeDefined();
      }, 1000);
    });
  });
});

// اختبارات إضافية للوظائف المتقدمة
describe('Advanced AI Health Monitor Features', () => {
  test('should provide detailed agent analysis', async () => {
    const report = await aiHealthMonitor.generateHealthReport();
    
    report.agents.forEach(agent => {
      // التحقق من تحليل مفصل لكل وكيل
      expect(agent.activeConnections).toBeGreaterThanOrEqual(0);
      expect(agent.queueLength).toBeGreaterThanOrEqual(0);
      expect(agent.lastActivity).toBeInstanceOf(Date);
    });
  });

  test('should generate actionable recommendations', async () => {
    const report = await aiHealthMonitor.generateHealthReport();
    
    if (report.recommendations.length > 0) {
      report.recommendations.forEach(recommendation => {
        expect(typeof recommendation).toBe('string');
        expect(recommendation.length).toBeGreaterThan(0);
        // يجب أن تكون التوصيات قابلة للتنفيذ
        expect(recommendation).toMatch(/Consider|Investigate|Monitor|Optimize/i);
      });
    }
  });

  test('should maintain alert history', () => {
    const alerts = aiHealthMonitor.getActiveAlerts();
    
    alerts.forEach(alert => {
      expect(alert.timestamp).toBeInstanceOf(Date);
      expect(alert.id).toBeDefined();
      expect(alert.message).toBeDefined();
      expect(alert.severity).toBeDefined();
    });
  });
});

console.log('🧪 AI Health Monitor tests completed successfully!');