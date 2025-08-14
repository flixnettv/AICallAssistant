import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const CallScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();
  const { phoneNumber, contactName, isIncoming = false } = route.params || {};
  
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [showAIAnswer, setShowAIAnswer] = useState(false);
  
  useEffect(() => {
    if (callState === 'connecting') {
      // Simulate call connection
      setTimeout(() => {
        setCallState('connected');
      }, 2000);
    }
    
    if (callState === 'connected') {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [callState]);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAnswer = () => {
    setCallState('connected');
  };
  
  const handleReject = () => {
    setCallState('ended');
    navigation.goBack();
  };
  
  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          style: 'destructive',
          onPress: () => {
            setCallState('ended');
            navigation.goBack();
          }
        },
      ]
    );
  };
  
  const handleToggleRecording = () => {
    if (!isRecording) {
      Alert.alert(
        'Start Recording',
        'This call will be recorded. Do you consent to recording?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Recording', 
            onPress: () => setIsRecording(true)
          },
        ]
      );
    } else {
      setIsRecording(false);
    }
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };
  
  const handleAIAnswer = () => {
    setShowAIAnswer(true);
    // TODO: Implement AI answer logic
  };
  
  const handleTransferToAI = () => {
    Alert.alert(
      'Transfer to AI',
      'Transfer this call to AI assistant?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Transfer', 
          onPress: () => {
            // TODO: Implement AI transfer logic
            Alert.alert('AI Transfer', 'Call transferred to AI assistant');
          }
        },
      ]
    );
  };
  
  if (callState === 'ended') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.callEndedContainer}>
          <Icon name="call-end" size={80} color={colors.error} />
          <Text style={[styles.callEndedText, { color: colors.text }]}>Call Ended</Text>
          <Text style={[styles.callDuration, { color: colors.textSecondary }]}>
            Duration: {formatDuration(callDuration)}
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Contacts</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Caller Info */}
      <View style={styles.callerInfo}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {contactName ? contactName.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        
        <Text style={[styles.callerName, { color: colors.text }]}>
          {contactName || 'Unknown Caller'}
        </Text>
        
        <Text style={[styles.callerNumber, { color: colors.textSecondary }]}>
          {phoneNumber}
        </Text>
        
        {callState === 'connected' && (
          <Text style={[styles.callDuration, { color: colors.textSecondary }]}>
            {formatDuration(callDuration)}
          </Text>
        )}
        
        {callState === 'connecting' && (
          <Text style={[styles.callStatus, { color: colors.warning }]}>
            {isIncoming ? 'Incoming call...' : 'Connecting...'}
          </Text>
        )}
      </View>
      
      {/* AI Answer Option for Incoming Calls */}
      {isIncoming && callState === 'connecting' && (
        <View style={[styles.aiAnswerSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.aiAnswerTitle, { color: colors.text }]}>
            AI Assistant Available
          </Text>
          <Text style={[styles.aiAnswerSubtitle, { color: colors.textSecondary }]}>
            Let AI answer this call for you
          </Text>
          
          <TouchableOpacity
            style={[styles.aiAnswerButton, { backgroundColor: colors.secondary }]}
            onPress={handleAIAnswer}
          >
            <Icon name="smart-toy" size={24} color="white" />
            <Text style={styles.aiAnswerButtonText}>AI Answer</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Call Controls */}
      <View style={styles.callControls}>
        {callState === 'connecting' && isIncoming ? (
          // Incoming call controls
          <View style={styles.incomingControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.error }]}
              onPress={handleReject}
            >
              <Icon name="call-end" size={32} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.success }]}
              onPress={handleAnswer}
            >
              <Icon name="call" size={32} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          // Connected call controls
          <View style={styles.connectedControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.surface }]}
              onPress={handleToggleMute}
            >
              <Icon 
                name={isMuted ? 'mic-off' : 'mic'} 
                size={24} 
                color={isMuted ? colors.error : colors.text} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.surface }]}
              onPress={handleToggleSpeaker}
            >
              <Icon 
                name={isSpeakerOn ? 'volume-up' : 'volume-down'} 
                size={24} 
                color={isSpeakerOn ? colors.primary : colors.text} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.surface }]}
              onPress={handleToggleRecording}
            >
              <Icon 
                name={isRecording ? 'fiber-manual-record' : 'fiber-manual-record'} 
                size={24} 
                color={isRecording ? colors.error : colors.text} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.surface }]}
              onPress={handleTransferToAI}
            >
              <Icon name="smart-toy" size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        )}
        
        {/* End Call Button */}
        {callState === 'connected' && (
          <TouchableOpacity
            style={[styles.endCallButton, { backgroundColor: colors.error }]}
            onPress={handleEndCall}
          >
            <Icon name="call-end" size={32} color="white" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Call Features */}
      {callState === 'connected' && (
        <View style={[styles.callFeatures, { backgroundColor: colors.card }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>Call Features</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Icon 
                name={isRecording ? 'fiber-manual-record' : 'fiber-manual-record'} 
                size={20} 
                color={isRecording ? colors.error : colors.textSecondary} 
              />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {isRecording ? 'Recording' : 'Record'}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Icon 
                name={isMuted ? 'mic-off' : 'mic'} 
                size={20} 
                color={isMuted ? colors.error : colors.textSecondary} 
              />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {isMuted ? 'Muted' : 'Mute'}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Icon 
                name={isSpeakerOn ? 'volume-up' : 'volume-down'} 
                size={20} 
                color={isSpeakerOn ? colors.primary : colors.textSecondary} 
              />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {isSpeakerOn ? 'Speaker' : 'Speaker'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  callerNumber: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  callStatus: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  callDuration: {
    fontSize: 16,
    fontWeight: '500',
  },
  aiAnswerSection: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  aiAnswerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  aiAnswerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  aiAnswerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  aiAnswerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  callControls: {
    alignItems: 'center',
    marginBottom: 40,
  },
  incomingControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
  },
  connectedControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  callFeatures: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  callEndedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callEndedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CallScreen;