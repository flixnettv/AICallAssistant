import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Switch,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { aiAgent, callAgent } from '../agents';
import { AIVoice } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AICallScreenProps {
  route: {
    params: {
      phoneNumber?: string;
      contactName?: string;
    };
  };
}

const AICallScreen: React.FC<AICallScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState(route.params?.phoneNumber || '');
  const [contactName, setContactName] = useState(route.params?.contactName || '');
  const [callReason, setCallReason] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [selectedVoice, setSelectedVoice] = useState<AIVoice | null>(null);
  const [isAIAutoReplyEnabled, setIsAIAutoReplyEnabled] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  // الأصوات المتاحة باللهجة المصرية
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
    // تعيين صوت افتراضي
    if (!selectedVoice) {
      setSelectedVoice(availableVoices[0]);
    }
  }, []);

  const handleMakeCall = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف');
      return;
    }

    if (!selectedVoice) {
      Alert.alert('خطأ', 'يرجى اختيار صوت الذكاء الاصطناعي');
      return;
    }

    try {
      setIsCalling(true);

      if (isScheduled) {
        // جدولة المكالمة
        await scheduleAICall();
        Alert.alert('نجح', 'تم جدولة المكالمة بنجاح');
      } else {
        // إجراء المكالمة فوراً
        await makeAICall();
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل في إجراء المكالمة: ' + error.message);
    } finally {
      setIsCalling(false);
    }
  };

  const makeAICall = async () => {
    const callTask = {
      id: Date.now().toString(),
      type: 'ai_call',
      priority: 'high',
      description: 'مكالمة بالذكاء الاصطناعي',
      data: {
        action: 'makeAICall',
        phoneNumber,
        contactName,
        voice: selectedVoice,
        reason: callReason,
        isImmediate: true,
      },
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await callAgent.executeTask(callTask);
    console.log('AI Call Result:', result);
  };

  const scheduleAICall = async () => {
    const scheduleTask = {
      id: Date.now().toString(),
      type: 'ai_call_schedule',
      priority: 'medium',
      description: 'جدولة مكالمة بالذكاء الاصطناعي',
      data: {
        action: 'scheduleAICall',
        phoneNumber,
        contactName,
        voice: selectedVoice,
        reason: callReason,
        scheduledTime,
        isImmediate: false,
      },
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await callAgent.executeTask(scheduleTask);
    console.log('Schedule Result:', result);
  };

  const previewVoice = async (voice: AIVoice) => {
    try {
      const previewTask = {
        id: Date.now().toString(),
        type: 'ai_voice_preview',
        priority: 'low',
        description: 'معاينة الصوت',
        data: {
          action: 'generateVoice',
          text: 'أهلاً وسهلاً، إزيك؟ أنا الذكاء الاصطناعي بتاع التطبيق',
          voice: voice.id,
        },
        status: 'pending',
        createdAt: new Date(),
      };

      const result = await aiAgent.executeTask(previewTask);
      console.log('Voice Preview Result:', result);
      
      // هنا يمكن تشغيل الصوت المُنشأ
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
      height: 100,
      textAlignVertical: 'top',
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    switchLabel: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'right',
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
    callButton: {
      backgroundColor: colors.primary,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    callButtonText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    callButtonDisabled: {
      backgroundColor: colors.disabled,
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
        <Text style={styles.headerTitle}>مكالمة بالذكاء الاصطناعي</Text>
      </View>

      {/* معلومات الاتصال */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات الاتصال</Text>
        
        <TextInput
          style={styles.input}
          placeholder="رقم الهاتف"
          placeholderTextColor={colors.textSecondary}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="اسم الشخص (اختياري)"
          placeholderTextColor={colors.textSecondary}
          value={contactName}
          onChangeText={setContactName}
        />
      </View>

      {/* سبب الاتصال */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>سبب الاتصال</Text>
        
        <TextInput
          style={styles.textArea}
          placeholder="اكتب سبب الاتصال ليعرفه الذكاء الاصطناعي..."
          placeholderTextColor={colors.textSecondary}
          value={callReason}
          onChangeText={setCallReason}
          multiline
        />
      </View>

      {/* جدولة المكالمة */}
      <View style={styles.section}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>جدولة المكالمة</Text>
          <Switch
            value={isScheduled}
            onValueChange={setIsScheduled}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {isScheduled && (
          <Text style={styles.sectionTitle}>
            سيتم إضافة خيارات الجدولة قريباً
          </Text>
        )}
      </View>

      {/* اختيار الصوت */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>صوت الذكاء الاصطناعي</Text>
        
        <View style={styles.voiceSelector}>
          <View style={styles.selectedVoice}>
            <Text style={styles.selectedVoiceText}>
              {selectedVoice ? selectedVoice.name : 'اختر صوتاً'}
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

      {/* إعدادات الرد التلقائي */}
      <View style={styles.section}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>تفعيل الرد التلقائي بالذكاء الاصطناعي</Text>
          <Switch
            value={isAIAutoReplyEnabled}
            onValueChange={setIsAIAutoReplyEnabled}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        <Text style={[styles.voiceDescription, { textAlign: 'right' }]}>
          عند تفعيل هذا الخيار، سيرد الذكاء الاصطناعي تلقائياً على المكالمات الواردة
        </Text>
      </View>

      {/* زر الاتصال */}
      <TouchableOpacity
        style={[
          styles.callButton,
          isCalling && styles.callButtonDisabled,
        ]}
        onPress={handleMakeCall}
        disabled={isCalling}
      >
        <Text style={styles.callButtonText}>
          {isCalling ? 'جاري الاتصال...' : 'اتصال بالذكاء الاصطناعي'}
        </Text>
      </TouchableOpacity>

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
              <Text style={styles.modalTitle}>اختر صوت الذكاء الاصطناعي</Text>
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
                        setSelectedVoice(voice);
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

export default AICallScreen;