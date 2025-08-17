import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { aiHealthMonitor } from '../features/AIHealthMonitor';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface AIDashboardScreenProps {}

const AIDashboardScreen: React.FC<AIDashboardScreenProps> = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  const [healthReport, setHealthReport] = useState<any>(null);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [report, stats, alerts] = await Promise.all([
        aiHealthMonitor.generateHealthReport(),
        aiHealthMonitor.getSystemStats(),
        aiHealthMonitor.getActiveAlerts(),
      ]);
      
      setHealthReport(report);
      setSystemStats(stats);
      setActiveAlerts(alerts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return colors.success;
      case 'good':
        return colors.info;
      case 'fair':
        return colors.warning;
      case 'poor':
        return colors.error;
      case 'critical':
        return '#FF0000';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'critical':
        return colors.error;
      case 'offline':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      case 'offline':
        return 'offline-bolt';
      default:
        return 'help';
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const success = aiHealthMonitor.resolveAlert(alertId);
      if (success) {
        await loadDashboardData();
        Alert.alert('نجح', 'تم حل التنبيه بنجاح');
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل في حل التنبيه');
    }
  };

  const HealthCard = ({ title, value, subtitle, color, icon }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    icon: string;
  }) => (
    <View style={[styles.healthCard, { backgroundColor: colors.card }]}>
      <View style={[styles.healthCardIcon, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color="white" />
      </View>
      <View style={styles.healthCardContent}>
        <Text style={[styles.healthCardValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.healthCardTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.healthCardSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  const AgentStatusCard = ({ agent }: { agent: any }) => (
    <View style={[styles.agentCard, { backgroundColor: colors.card }]}>
      <View style={styles.agentHeader}>
        <View style={styles.agentInfo}>
          <Icon 
            name={getStatusIcon(agent.status)} 
            size={20} 
            color={getStatusColor(agent.status)} 
          />
          <Text style={[styles.agentName, { color: colors.text }]}>
            {agent.agentId.replace('Agent', ' Agent')}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agent.status) }]}>
          <Text style={styles.statusBadgeText}>
            {agent.status === 'healthy' ? 'سليم' : 
             agent.status === 'warning' ? 'تحذير' : 
             agent.status === 'critical' ? 'حرج' : 'غير متصل'}
          </Text>
        </View>
      </View>
      
      <View style={styles.agentMetrics}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>وقت الاستجابة</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {agent.responseTime.toFixed(0)}ms
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>معدل النجاح</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {agent.successRate.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>الأخطاء</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {agent.errorCount}
          </Text>
        </View>
      </View>
    </View>
  );

  const AlertCard = ({ alert }: { alert: any }) => (
    <View style={[styles.alertCard, { backgroundColor: colors.card }]}>
      <View style={styles.alertHeader}>
        <Icon 
          name={alert.type === 'critical' ? 'error' : alert.type === 'error' ? 'warning' : 'info'} 
          size={20} 
          color={alert.type === 'critical' ? colors.error : alert.type === 'error' ? colors.warning : colors.info} 
        />
        <View style={styles.alertInfo}>
          <Text style={[styles.alertMessage, { color: colors.text }]}>{alert.message}</Text>
          <Text style={[styles.alertTime, { color: colors.textSecondary }]}>
            {new Date(alert.timestamp).toLocaleTimeString('ar-EG')}
          </Text>
        </View>
      </View>
      
      {!alert.isResolved && (
        <TouchableOpacity 
          style={[styles.resolveButton, { backgroundColor: colors.primary }]}
          onPress={() => resolveAlert(alert.id)}
        >
          <Text style={styles.resolveButtonText}>حل التنبيه</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    
    // Time Range Selector
    timeRangeSelector: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: colors.card,
      margin: 15,
      borderRadius: 10,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      alignItems: 'center',
      borderRadius: 8,
      marginHorizontal: 5,
    },
    timeRangeButtonActive: {
      backgroundColor: colors.primary,
    },
    timeRangeButtonText: {
      fontSize: 14,
      fontWeight: '500',
    },
    timeRangeButtonTextActive: {
      color: 'white',
    },
    timeRangeButtonTextInactive: {
      color: colors.textSecondary,
    },
    
    // Overall Health
    overallHealthSection: {
      margin: 15,
    },
    overallHealthCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 15,
      alignItems: 'center',
    },
    overallHealthTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 15,
      color: colors.text,
    },
    overallHealthStatus: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    overallHealthDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    
    // Health Cards Grid
    healthCardsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 15,
    },
    healthCard: {
      width: (width - 60) / 2,
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    healthCardIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    healthCardContent: {
      flex: 1,
    },
    healthCardValue: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    healthCardTitle: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 3,
    },
    healthCardSubtitle: {
      fontSize: 12,
    },
    
    // Agents Section
    agentsSection: {
      margin: 15,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 15,
      color: colors.text,
    },
    agentCard: {
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
    },
    agentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    agentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    agentName: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 10,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
    },
    agentMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    metricItem: {
      alignItems: 'center',
      flex: 1,
    },
    metricLabel: {
      fontSize: 12,
      marginBottom: 5,
    },
    metricValue: {
      fontSize: 16,
      fontWeight: '600',
    },
    
    // Alerts Section
    alertsSection: {
      margin: 15,
    },
    alertCard: {
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
    },
    alertHeader: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    alertInfo: {
      flex: 1,
      marginLeft: 15,
    },
    alertMessage: {
      fontSize: 14,
      marginBottom: 5,
      lineHeight: 20,
    },
    alertTime: {
      fontSize: 12,
    },
    resolveButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    resolveButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    
    // Recommendations Section
    recommendationsSection: {
      margin: 15,
    },
    recommendationItem: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    recommendationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.info,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    recommendationText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    
    // Empty State
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyStateIcon: {
      fontSize: 64,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (!healthReport || !systemStats) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>لوحة تحكم الذكاء الاصطناعي</Text>
          <Text style={styles.headerSubtitle}>مراقبة صحة النظام</Text>
        </View>
        <View style={styles.emptyState}>
          <Icon name="dashboard" style={styles.emptyStateIcon} />
          <Text style={styles.emptyStateText}>جاري تحميل البيانات...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>لوحة تحكم الذكاء الاصطناعي</Text>
        <Text style={styles.headerSubtitle}>مراقبة صحة النظام</Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeSelector}>
        {(['1h', '24h', '7d', '30d'] as const).map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              selectedTimeRange === range && styles.timeRangeButtonActive
            ]}
            onPress={() => setSelectedTimeRange(range)}
          >
            <Text style={[
              styles.timeRangeButtonText,
              selectedTimeRange === range 
                ? styles.timeRangeButtonTextActive 
                : styles.timeRangeButtonTextInactive
            ]}>
              {range === '1h' ? 'ساعة' : 
               range === '24h' ? 'يوم' : 
               range === '7d' ? 'أسبوع' : 'شهر'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Overall Health Status */}
      <View style={styles.overallHealthSection}>
        <View style={[styles.overallHealthCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.overallHealthTitle, { color: colors.text }]}>
            الحالة العامة للنظام
          </Text>
          <Text style={[
            styles.overallHealthStatus, 
            { color: getHealthColor(healthReport.overallHealth) }
          ]}>
            {healthReport.overallHealth === 'excellent' ? 'ممتاز' :
             healthReport.overallHealth === 'good' ? 'جيد' :
             healthReport.overallHealth === 'fair' ? 'مقبول' :
             healthReport.overallHealth === 'poor' ? 'ضعيف' : 'حرج'}
          </Text>
          <Text style={[styles.overallHealthDescription, { color: colors.textSecondary }]}>
            {healthReport.overallHealth === 'excellent' ? 'النظام يعمل بشكل مثالي' :
             healthReport.overallHealth === 'good' ? 'النظام يعمل بشكل جيد' :
             healthReport.overallHealth === 'fair' ? 'النظام يعمل بشكل مقبول' :
             healthReport.overallHealth === 'poor' ? 'النظام يحتاج إلى تحسين' : 'النظام في حالة حرجة'}
          </Text>
        </View>
      </View>

      {/* System Statistics */}
      <View style={styles.healthCardsGrid}>
        <HealthCard
          title="إجمالي الوكلاء"
          value={systemStats.totalAgents}
          subtitle="جميع الأنظمة"
          color={colors.primary}
          icon="smart-toy"
        />
        <HealthCard
          title="الوكلاء السليمة"
          value={systemStats.healthyAgents}
          subtitle="تعمل بشكل طبيعي"
          color={colors.success}
          icon="check-circle"
        />
        <HealthCard
          title="متوسط وقت الاستجابة"
          value={`${systemStats.averageResponseTime.toFixed(0)}ms`}
          subtitle="جميع الوكلاء"
          color={colors.info}
          icon="speed"
        />
        <HealthCard
          title="معدل النجاح العام"
          value={`${systemStats.averageSuccessRate.toFixed(1)}%`}
          subtitle="جميع العمليات"
          color={colors.success}
          icon="trending-up"
        />
      </View>

      {/* Agents Status */}
      <View style={styles.agentsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          حالة الوكلاء
        </Text>
        {healthReport.agents.map((agent: any) => (
          <AgentStatusCard key={agent.agentId} agent={agent} />
        ))}
      </View>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            التنبيهات النشطة ({activeAlerts.length})
          </Text>
          {activeAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </View>
      )}

      {/* Recommendations */}
      {healthReport.recommendations.length > 0 && (
        <View style={styles.recommendationsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            التوصيات ({healthReport.recommendations.length})
          </Text>
          {healthReport.recommendations.map((recommendation: string, index: number) => (
            <View key={index} style={[styles.recommendationItem, { backgroundColor: colors.card }]}>
              <View style={styles.recommendationIcon}>
                <Icon name="lightbulb" size={20} color="white" />
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default AIDashboardScreen;