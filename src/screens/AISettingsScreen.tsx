import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { AIVoice } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AISettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  // إعدادات الذكاء الاصطناعي
  const [isAIAutoReplyEnabled, setIsAIAutoReplyEnabled] = useState(false);
  const [isAICallEnabled, setIsAICallEnabled] = useState(true);
  const [isAIVoiceEnabled, setIsAIVoiceEnabled] = useState(true);
  const [isAISecurityEnabled, setIsAISecurityEnabled] = useState(true);
  
  // إعدادات الصوت
  const [defaultVoice, setDefaultVoice] = useState<AIVoice | null>(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  
  // إعدادات الرد التلقائي
  const [autoReplyDelay, setAutoReplyDelay] = useState(3);
  const [autoReplyGreeting, setAutoReplyGreeting] = useState('أهلاً وسهلاً، إزيك؟');
  const [autoReplyFallback, setAutoReplyFallback] = useState('ممكن أعرف إيه السبب؟');
  
  // إعدادات الأمان
  const [aiRecordingEnabled, setIsAIRecordingEnabled] = useState(false);
  const [aiDataSharing, setIsAIDataSharing] = useState(false);
  const [aiPrivacyLevel, setAIPrivacyLevel] = useState('high');

  // الأصوات المتاحة
  const availableVoices: AIVoice[] = [
    {
      id: 'egyptian_male_1',
      name: 'أحمد - شاب مصري',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'young',
      description: 'صوت شاب مصري ودود',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_female_1',
      name: 'فاطمة - شابة مصرية',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'female',
      age: 'young',
      description: 'صوت شابة مصرية لطيفة',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_child_male',
      name: 'علي - طفل مصري',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'child',
      description: 'صوت طفل مصري مرح',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_child_female',
      name: 'مريم - طفلة مصرية',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'female',
      age: 'child',
      description: 'صوت طفلة مصرية جميلة',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_elder_male',
      name: 'محمد - عجوز مصري',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'elder',
      description: 'صوت عجوز مصري حكيم',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_elder_female',
      name: 'زينب - عجوز مصرية',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'female',
      age: 'elder',
      description: 'صوت عجوز مصرية حنونة',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_funny',
      name: 'مضحك - صوت هزلي',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'young',
      description: 'صوت مضحك وهزلي',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_scary',
      name: 'مرعب - صوت مخيف',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'young',
      description: 'صوت مخيف ومرعب',
      previewUrl: '',
      isLocal: true,
    },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('ai_settings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setIsAIAutoReplyEnabled(parsedSettings.autoReplyEnabled || false);
        setIsAICallEnabled(parsedSettings.callEnabled !== false);
        setIsAIVoiceEnabled(parsedSettings.voiceEnabled !== false);
        setIsAISecurityEnabled(parsedSettings.securityEnabled !== false);
        setAutoReplyDelay(parsedSettings.autoReplyDelay || 3);
        setAutoReplyGreeting(parsedSettings.autoReplyGreeting || 'أهلاً وسهلاً، إزيك؟');
        setAutoReplyFallback(parsedSettings.autoReplyFallback || 'ممكن أعرف إيه السبب؟');
        setIsAIRecordingEnabled(parsedSettings.recordingEnabled || false);
        setIsAIDataSharing(parsedSettings.dataSharing || false);
        setAIPrivacyLevel(parsedSettings.privacyLevel || 'high');
        
        if (parsedSettings.defaultVoice) {
          setDefaultVoice(parsedSettings.defaultVoice);
        } else {
          setDefaultVoice(availableVoices[0]);
        }
      }
    } catch (error) {
      console.error('❌ Load AI settings error:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        autoReplyEnabled: isAIAutoReplyEnabled,
        callEnabled: isAICallEnabled,
        voiceEnabled: isAIVoiceEnabled,
        securityEnabled: isAISecurityEnabled,
        defaultVoice,
        autoReplyDelay,
        autoReplyGreeting,
        autoReplyFallback,
        recordingEnabled: aiRecordingEnabled,
        dataSharing: aiDataSharing,
        privacyLevel: aiPrivacyLevel,
        lastUpdated: new Date().toISOString(),
      };

      await AsyncStorage.setItem('ai_settings', JSON.stringify(settings));
      Alert.alert('نجح', 'تم حفظ الإعدادات بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'فشل في حفظ الإعدادات');
    }
  };

  const resetSettings = () => {
    Alert.alert(
      'إعادة تعيين الإعدادات',
      'هل أنت متأكد من إعادة تعيين جميع إعدادات الذكاء الاصطناعي؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إعادة تعيين',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('ai_settings');
              loadSettings();
              Alert.alert('تم', 'تم إعادة تعيين الإعدادات');
            } catch (error) {
              Alert.alert('خطأ', 'فشل في إعادة تعيين الإعدادات');
            }
          },
        },
      ]
    );
  };

  const previewVoice = async (voice: AIVoice) => {
    try {
      // هنا يمكن تشغيل معاينة الصوت
      Alert.alert('معاينة الصوت', `تم معاينة صوت: ${voice.name}`);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في معاينة الصوت');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 15,
      textAlign: 'right',
    },
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 15,
      textAlign: 'right',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'right',
      flex: 1,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'right',
      marginTop: 5,
    },
    voiceSelector: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 15,
      backgroundColor: colors.surface,
      marginBottom: 15,
    },
    selectedVoice: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedVoiceText: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'right',
    },
    changeVoiceButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 6,
    },
    changeVoiceButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: 'bold',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
      textAlign: 'right',
      marginBottom: 15,
    },
    textArea: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
      textAlign: 'right',
      marginBottom: 15,
      height: 80,
      textAlignVertical: 'top',
    },
    privacyLevelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
    privacyLevelButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
    },
    privacyLevelButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    privacyLevelButtonInactive: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    privacyLevelButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    privacyLevelButtonTextActive: {
      color: colors.white,
    },
    privacyLevelButtonTextInactive: {
      color: colors.text,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 30,
    },
    saveButton: {
      backgroundColor: colors.success,
      padding: 15,
      borderRadius: 8,
      flex: 1,
      marginRight: 10,
      alignItems: 'center',
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    resetButton: {
      backgroundColor: colors.error,
      padding: 15,
      borderRadius: 8,
      flex: 1,
      marginLeft: 10,
      alignItems: 'center',
    },
    resetButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'right',
    },
    voiceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    voiceInfo: {
      flex: 1,
    },
    voiceName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'right',
      marginBottom: 5,
    },
    voiceDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'right',
    },
    voiceActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    previewButton: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginRight: 10,
    },
    previewButtonText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: 'bold',
    },
    selectButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 6,
    },
    selectButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: 'bold',
    },
    closeButton: {
      backgroundColor: colors.error,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 20,
      alignSelf: 'center',
    },
    closeButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إعدادات الذكاء الاصطناعي</Text>
      </View>

      {/* إعدادات عامة */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإعدادات العامة</Text>
        
        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>تفعيل المكالمات بالذكاء الاصطناعي</Text>
            <Text style={styles.settingDescription}>
              السماح بإجراء مكالمات بالذكاء الاصطناعي
            </Text>
          </View>
          <Switch
            value={isAICallEnabled}
            onValueChange={setIsAICallEnabled}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>تفعيل الأصوات الذكية</Text>
            <Text style={styles.settingDescription}>
              استخدام أصوات الذكاء الاصطناعي في المكالمات
            </Text>
          </View>
          <Switch
            value={isAIVoiceEnabled}
            onValueChange={setIsAIVoiceEnabled}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>تفعيل الأمان الذكي</Text>
            <Text style={styles.settingDescription}>
              استخدام الذكاء الاصطناعي لفحص الأمان
            </Text>
          </View>
          <Switch
            value={isAISecurityEnabled}
            onValueChange={setIsAISecurityEnabled}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* إعدادات الرد التلقائي */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الرد التلقائي</Text>
        
        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>تفعيل الرد التلقائي</Text>
            <Text style={styles.settingDescription}>
              الرد تلقائياً على المكالمات الواردة بالذكاء الاصطناعي
            </Text>
          </View>
          <Switch
            value={isAIAutoReplyEnabled}
            onValueChange={setIsAIAutoReplyEnabled}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {isAIAutoReplyEnabled && (
          <>
            <Text style={styles.settingLabel}>تأخير الرد (بالثواني)</Text>
            <TextInput
              style={styles.input}
              value={autoReplyDelay.toString()}
              onChangeText={(text) => setAutoReplyDelay(parseInt(text) || 3)}
              keyboardType="numeric"
              placeholder="3"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.settingLabel}>رسالة الترحيب</Text>
            <TextInput
              style={styles.textArea}
              value={autoReplyGreeting}
              onChangeText={setAutoReplyGreeting}
              placeholder="أهلاً وسهلاً، إزيك؟"
              placeholderTextColor={colors.textSecondary}
              multiline
            />

            <Text style={styles.settingLabel}>رسالة الاحتياطية</Text>
            <TextInput
              style={styles.textArea}
              value={autoReplyFallback}
              onChangeText={setAutoReplyFallback}
              placeholder="ممكن أعرف إيه السبب؟"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </>
        )}
      </View>

      {/* إعدادات الصوت */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إعدادات الصوت</Text>
        
        <View style={styles.voiceSelector}>
          <View style={styles.selectedVoice}>
            <Text style={styles.selectedVoiceText}>
              {defaultVoice ? defaultVoice.name : 'اختر صوتاً'}
            </Text>
            <TouchableOpacity
              style={styles.changeVoiceButton}
              onPress={() => setShowVoiceSelector(true)}
            >
              <Text style={styles.changeVoiceButtonText}>تغيير</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* إعدادات الأمان والخصوصية */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الأمان والخصوصية</Text>
        
        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>تسجيل المكالمات</Text>
            <Text style={styles.settingDescription}>
              تسجيل المكالمات بالذكاء الاصطناعي للأغراض الأمنية
            </Text>
          </View>
          <Switch
            value={aiRecordingEnabled}
            onValueChange={setIsAIRecordingEnabled}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>مشاركة البيانات</Text>
            <Text style={styles.settingDescription}>
              مشاركة بيانات المكالمات لتحسين الذكاء الاصطناعي
            </Text>
          </View>
          <Switch
            value={aiDataSharing}
            onValueChange={setIsAIDataSharing}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <Text style={styles.settingLabel}>مستوى الخصوصية</Text>
        <View style={styles.privacyLevelContainer}>
          {['low', 'medium', 'high'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.privacyLevelButton,
                aiPrivacyLevel === level
                  ? styles.privacyLevelButtonActive
                  : styles.privacyLevelButtonInactive,
              ]}
              onPress={() => setAIPrivacyLevel(level)}
            >
              <Text
                style={[
                  styles.privacyLevelButtonText,
                  aiPrivacyLevel === level
                    ? styles.privacyLevelButtonTextActive
                    : styles.privacyLevelButtonTextInactive,
                ]}
              >
                {level === 'low' ? 'منخفض' : level === 'medium' ? 'متوسط' : 'عالي'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* أزرار الإجراءات */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>حفظ الإعدادات</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
          <Text style={styles.resetButtonText}>إعادة تعيين</Text>
        </TouchableOpacity>
      </View>

      {/* Modal اختيار الصوت */}
      <Modal
        visible={showVoiceSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVoiceSelector(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر الصوت الافتراضي</Text>
              <TouchableOpacity onPress={() => setShowVoiceSelector(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {availableVoices.map((voice) => (
                <View key={voice.id} style={styles.voiceItem}>
                  <View style={styles.voiceInfo}>
                    <Text style={styles.voiceName}>{voice.name}</Text>
                    <Text style={styles.voiceDescription}>{voice.description}</Text>
                  </View>
                  
                  <View style={styles.voiceActions}>
                    <TouchableOpacity
                      style={styles.previewButton}
                      onPress={() => previewVoice(voice)}
                    >
                      <Text style={styles.previewButtonText}>معاينة</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => {
                        setDefaultVoice(voice);
                        setShowVoiceSelector(false);
                      }}
                    >
                      <Text style={styles.selectButtonText}>اختيار</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVoiceSelector(false)}
            >
              <Text style={styles.closeButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AISettingsScreen;