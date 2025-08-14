import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { aiAgent, callAgent } from '../agents';
import { AIVoice } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IncomingCallScreenProps {
  route: {
    params: {
      phoneNumber: string;
      contactName?: string;
      isAIAutoReplyEnabled: boolean;
    };
  };
}

const { width, height } = Dimensions.get('window');

const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const { phoneNumber, contactName, isAIAutoReplyEnabled } = route.params;
  
  const [isRinging, setIsRinging] = useState(true);
  const [showAIReplyOptions, setShowAIReplyOptions] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<AIVoice | null>(null);
  const [isAIReplying, setIsAIReplying] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showStopAI, setShowStopAI] = useState(false);
  
  // الرسوم المتحركة
  const ringAnimation = new Animated.Value(0);
  const pulseAnimation = new Animated.Value(1);

  // الأصوات المتاحة للرد
  const replyVoices: AIVoice[] = [
    {
      id: 'egyptian_male_reply',
      name: 'أحمد - شاب مصري',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'young',
      description: 'صوت شاب مصري ودود للرد',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_female_reply',
      name: 'فاطمة - شابة مصرية',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'female',
      age: 'young',
      description: 'صوت شابة مصرية لطيفة للرد',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_child_reply',
      name: 'علي - طفل مصري',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'child',
      description: 'صوت طفل مصري مرح للرد',
      previewUrl: '',
      isLocal: true,
    },
    {
      id: 'egyptian_funny_reply',
      name: 'مضحك - صوت هزلي',
      language: 'ar-EG',
      dialect: 'egyptian',
      gender: 'male',
      age: 'young',
      description: 'صوت مضحك وهزلي للرد',
      previewUrl: '',
      isLocal: true,
    },
  ];

  useEffect(() => {
    // بدء الرسوم المتحركة
    startRingAnimation();
    startPulseAnimation();
    
    // تعيين صوت افتراضي
    if (!selectedVoice) {
      setSelectedVoice(replyVoices[0]);
    }

    // إذا كان الرد التلقائي مفعل، ابدأ الرد فوراً
    if (isAIAutoReplyEnabled) {
      setTimeout(() => {
        handleAIReply();
      }, 2000);
    }

    // عداد مدة المكالمة
    const durationInterval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(durationInterval);
    };
  }, []);

  const startRingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleAnswerCall = () => {
    setIsRinging(false);
    setShowStopAI(true);
    
    // إجابة على المكالمة
    const answerTask = {
      id: Date.now().toString(),
      type: 'call_answer',
      priority: 'high',
      description: 'إجابة على المكالمة الواردة',
      data: {
        action: 'answerCall',
        phoneNumber,
        contactName,
      },
      status: 'pending',
      createdAt: new Date(),
    };

    callAgent.executeTask(answerTask);
  };

  const handleRejectCall = () => {
    setIsRinging(false);
    
    // رفض المكالمة
    const rejectTask = {
      id: Date.now().toString(),
      type: 'call_reject',
      priority: 'high',
      description: 'رفض المكالمة الواردة',
      data: {
        action: 'rejectCall',
        phoneNumber,
        contactName,
      },
      status: 'pending',
      createdAt: new Date(),
    };

    callAgent.executeTask(rejectTask);
    navigation.goBack();
  };

  const handleAIReply = async () => {
    if (!selectedVoice) {
      Alert.alert('خطأ', 'يرجى اختيار صوت للرد');
      return;
    }

    try {
      setIsAIReplying(true);
      setShowAIReplyOptions(false);

      // بدء الرد بالذكاء الاصطناعي
      const aiReplyTask = {
        id: Date.now().toString(),
        type: 'ai_reply',
        priority: 'high',
        description: 'الرد على المكالمة بالذكاء الاصطناعي',
        data: {
          action: 'startAIReply',
          phoneNumber,
          contactName,
          voice: selectedVoice,
          isIncomingCall: true,
        },
        status: 'pending',
        createdAt: new Date(),
      };

      const result = await callAgent.executeTask(aiReplyTask);
      console.log('AI Reply Result:', result);

      // إظهار خيار إيقاف الذكاء الاصطناعي
      setShowStopAI(true);

    } catch (error) {
      Alert.alert('خطأ', 'فشل في بدء الرد بالذكاء الاصطناعي: ' + error.message);
      setIsAIReplying(false);
    }
  };

  const handleStopAI = async () => {
    try {
      // إيقاف الذكاء الاصطناعي
      const stopAITask = {
        id: Date.now().toString(),
        type: 'ai_stop',
        priority: 'high',
        description: 'إيقاف الذكاء الاصطناعي',
        data: {
          action: 'stopAIReply',
          phoneNumber,
          contactName,
        },
        status: 'pending',
        createdAt: new Date(),
      };

      const result = await callAgent.executeTask(stopAITask);
      console.log('Stop AI Result:', result);

      setIsAIReplying(false);
      setShowStopAI(false);

      Alert.alert('تم', 'تم إيقاف الذكاء الاصطناعي، يمكنك الآن إكمال المكالمة عادياً');

    } catch (error) {
      Alert.alert('خطأ', 'فشل في إيقاف الذكاء الاصطناعي: ' + error.message);
    }
  };

  const handleEndCall = () => {
    // إنهاء المكالمة
    const endCallTask = {
      id: Date.now().toString(),
      type: 'call_end',
      priority: 'high',
      description: 'إنهاء المكالمة',
      data: {
        action: 'endCall',
        phoneNumber,
        contactName,
        duration: callDuration,
      },
      status: 'pending',
      createdAt: new Date(),
    };

    callAgent.executeTask(endCallTask);
    navigation.goBack();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    callerInfo: {
      alignItems: 'center',
      marginBottom: 40,
    },
    callerName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    callerNumber: {
      fontSize: 20,
      color: colors.textSecondary,
      marginBottom: 5,
      textAlign: 'center',
    },
    callStatus: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    avatarContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    avatarIcon: {
      fontSize: 60,
      color: colors.white,
    },
    ringContainer: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    callActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 40,
      marginBottom: 50,
    },
    actionButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    answerButton: {
      backgroundColor: colors.success,
    },
    rejectButton: {
      backgroundColor: colors.error,
    },
    aiReplyButton: {
      backgroundColor: colors.primary,
    },
    stopAIButton: {
      backgroundColor: colors.warning,
    },
    endCallButton: {
      backgroundColor: colors.error,
    },
    actionIcon: {
      fontSize: 32,
      color: colors.white,
    },
    callDuration: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: colors.surface,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      elevation: 3,
    },
    durationText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    aiReplyOptions: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    optionsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    voiceSelector: {
      marginBottom: 20,
    },
    voiceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: colors.background,
      borderRadius: 8,
      marginBottom: 10,
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
    confirmButton: {
      backgroundColor: colors.success,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: colors.error,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header مع مدة المكالمة */}
      {!isRinging && (
        <View style={styles.callDuration}>
          <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
        </View>
      )}

      {/* معلومات المتصل */}
      <View style={styles.header}>
        <View style={styles.callerInfo}>
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                transform: [
                  { scale: pulseAnimation },
                  { rotate: ringAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })},
                ],
              },
            ]}
          >
            <Icon name="person" style={styles.avatarIcon} />
          </Animated.View>

          <Text style={styles.callerName}>
            {contactName || 'مكالمة واردة'}
          </Text>
          
          <Text style={styles.callerNumber}>{phoneNumber}</Text>
          
          <Text style={styles.callStatus}>
            {isRinging ? 'يرن الهاتف...' : isAIReplying ? 'الذكاء الاصطناعي يجيب...' : 'متصل'}
          </Text>
        </View>

        {/* أزرار التحكم */}
        <View style={styles.callActions}>
          {isRinging ? (
            <>
              {/* زر الرد */}
              <TouchableOpacity
                style={[styles.actionButton, styles.answerButton]}
                onPress={handleAnswerCall}
              >
                <Icon name="call" style={styles.actionIcon} />
              </TouchableOpacity>

              {/* زر رفض المكالمة */}
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleRejectCall}
              >
                <Icon name="call-end" style={styles.actionIcon} />
              </TouchableOpacity>

              {/* زر الرد بالذكاء الاصطناعي */}
              <TouchableOpacity
                style={[styles.actionButton, styles.aiReplyButton]}
                onPress={() => setShowAIReplyOptions(true)}
              >
                <Icon name="smart-toy" style={styles.actionIcon} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* زر إنهاء المكالمة */}
              <TouchableOpacity
                style={[styles.actionButton, styles.endCallButton]}
                onPress={handleEndCall}
              >
                <Icon name="call-end" style={styles.actionIcon} />
              </TouchableOpacity>

              {/* زر إيقاف الذكاء الاصطناعي */}
              {showStopAI && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.stopAIButton]}
                  onPress={handleStopAI}
                >
                  <Icon name="stop" style={styles.actionIcon} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* خيارات الرد بالذكاء الاصطناعي */}
      <Modal
        visible={showAIReplyOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAIReplyOptions(false)}
      >
        <View style={styles.aiReplyOptions}>
          <Text style={styles.optionsTitle}>اختر صوت الرد بالذكاء الاصطناعي</Text>
          
          <ScrollView style={styles.voiceSelector}>
            {replyVoices.map((voice) => (
              <View key={voice.id} style={styles.voiceItem}>
                <View style={styles.voiceInfo}>
                  <Text style={styles.voiceName}>{voice.name}</Text>
                  <Text style={styles.voiceDescription}>{voice.description}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setSelectedVoice(voice)}
                >
                  <Text style={styles.selectButtonText}>اختيار</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleAIReply}
            disabled={!selectedVoice}
          >
            <Text style={styles.confirmButtonText}>
              تأكيد الرد بالذكاء الاصطناعي
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowAIReplyOptions(false)}
          >
            <Text style={styles.cancelButtonText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default IncomingCallScreen;