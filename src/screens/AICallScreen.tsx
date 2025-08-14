import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AICallScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  
  const [selectedVoice, setSelectedVoice] = useState('young-male');
  const [callReason, setCallReason] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  
  const aiVoices = [
    { id: 'young-male', name: 'Young Male', icon: 'person', description: 'Clear and friendly' },
    { id: 'young-female', name: 'Young Female', icon: 'person', description: 'Warm and approachable' },
    { id: 'elderly-male', name: 'Elderly Male', icon: 'elderly', description: 'Wise and authoritative' },
    { id: 'elderly-female', name: 'Elderly Female', icon: 'elderly', description: 'Gentle and caring' },
    { id: 'child-male', name: 'Child Male', icon: 'child-care', description: 'Playful and energetic' },
    { id: 'child-female', name: 'Child Female', icon: 'child-care', description: 'Sweet and innocent' },
    { id: 'deep-scary', name: 'Deep & Scary', icon: 'warning', description: 'Intimidating and powerful' },
  ];
  
  const callReasons = [
    'Business Inquiry',
    'Appointment Reminder',
    'Follow-up Call',
    'Customer Service',
    'Sales Call',
    'Personal Matter',
    'Emergency',
    'Custom...',
  ];
  
  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setShowVoiceSelector(false);
  };
  
  const handleCallReasonSelect = (reason: string) => {
    if (reason === 'Custom...') {
      setCallReason('');
    } else {
      setCallReason(reason);
    }
  };
  
  const validateCall = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return false;
    }
    
    if (!callReason.trim()) {
      Alert.alert('Error', 'Please select or enter a call reason');
      return false;
    }
    
    return true;
  };
  
  const initiateAICall = async () => {
    if (!validateCall()) return;
    
    setIsCalling(true);
    
    try {
      // TODO: Implement actual AI call logic
      Alert.alert(
        'AI Call Initiated',
        `Starting AI call to ${phoneNumber} with reason: "${callReason}"\n\nVoice: ${aiVoices.find(v => v.id === selectedVoice)?.name}`,
        [
          {
            text: 'Cancel Call',
            style: 'cancel',
            onPress: () => setIsCalling(false),
          },
          {
            text: 'Continue',
            onPress: () => {
              // TODO: Start the actual AI call
              setTimeout(() => {
                setIsCalling(false);
                Alert.alert('Call Complete', 'AI call has been completed successfully!');
              }, 3000);
            },
          },
        ]
      );
    } catch (error) {
      setIsCalling(false);
      Alert.alert('Error', 'Failed to initiate AI call. Please try again.');
    }
  };
  
  const scheduleCall = () => {
    if (!validateCall()) return;
    
    Alert.alert(
      'Schedule AI Call',
      'This feature will allow you to schedule AI calls for later. Coming soon!',
      [{ text: 'OK' }]
    );
  };
  
  const VoiceSelectorModal = () => (
    <Modal
      visible={showVoiceSelector}
      transparent
      animationType="slide"
      onRequestClose={() => setShowVoiceSelector(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select AI Voice</Text>
            <TouchableOpacity onPress={() => setShowVoiceSelector(false)}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.voiceList}>
            {aiVoices.map((voice) => (
              <TouchableOpacity
                key={voice.id}
                style={[
                  styles.voiceItem,
                  { 
                    backgroundColor: selectedVoice === voice.id ? colors.primaryLight : colors.surface,
                    borderColor: selectedVoice === voice.id ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => handleVoiceSelect(voice.id)}
              >
                <View style={styles.voiceInfo}>
                  <Icon name={voice.icon} size={24} color={colors.primary} />
                  <View style={styles.voiceText}>
                    <Text style={[styles.voiceName, { color: colors.text }]}>{voice.name}</Text>
                    <Text style={[styles.voiceDescription, { color: colors.textSecondary }]}>
                      {voice.description}
                    </Text>
                  </View>
                </View>
                {selectedVoice === voice.id && (
                  <Icon name="check" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.secondary }]}>
        <Text style={styles.headerTitle}>AI Call Assistant</Text>
        <Text style={styles.headerSubtitle}>Let AI handle your calls intelligently</Text>
      </View>
      
      {/* Phone Number Input */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Phone Number</Text>
        <TextInput
          style={[styles.phoneInput, { 
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border
          }]}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
        />
      </View>
      
      {/* Call Reason */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Call Reason</Text>
        
        <View style={styles.reasonGrid}>
          {callReasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.reasonChip,
                { 
                  backgroundColor: callReason === reason ? colors.primary : colors.surface,
                  borderColor: callReason === reason ? colors.primary : colors.border,
                }
              ]}
              onPress={() => handleCallReasonSelect(reason)}
            >
              <Text style={[
                styles.reasonChipText,
                { color: callReason === reason ? 'white' : colors.text }
              ]}>
                {reason}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {callReason === '' && (
          <TextInput
            style={[styles.customReasonInput, { 
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border
            }]}
            value={callReason}
            onChangeText={setCallReason}
            placeholder="Enter custom reason..."
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        )}
      </View>
      
      {/* Voice Selection */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Voice</Text>
          <TouchableOpacity 
            style={styles.changeVoiceButton}
            onPress={() => setShowVoiceSelector(true)}
          >
            <Text style={[styles.changeVoiceText, { color: colors.primary }]}>Change</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.selectedVoice, { backgroundColor: colors.surface }]}
          onPress={() => setShowVoiceSelector(true)}
        >
          <Icon 
            name={aiVoices.find(v => v.id === selectedVoice)?.icon || 'person'} 
            size={32} 
            color={colors.primary} 
          />
          <View style={styles.selectedVoiceInfo}>
            <Text style={[styles.selectedVoiceName, { color: colors.text }]}>
              {aiVoices.find(v => v.id === selectedVoice)?.name}
            </Text>
            <Text style={[styles.selectedVoiceDescription, { color: colors.textSecondary }]}>
              {aiVoices.find(v => v.id === selectedVoice)?.description}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.callButton, { backgroundColor: colors.primary }]}
          onPress={initiateAICall}
          disabled={isCalling}
        >
          <Icon name="call" size={24} color="white" />
          <Text style={styles.callButtonText}>
            {isCalling ? 'Initiating Call...' : 'Start AI Call'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.scheduleButton, { backgroundColor: colors.secondary }]}
          onPress={scheduleCall}
        >
          <Icon name="schedule" size={24} color="white" />
          <Text style={styles.scheduleButtonText}>Schedule Call</Text>
        </TouchableOpacity>
      </View>
      
      {/* Features Info */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Call Features</Text>
        
        <View style={styles.featureItem}>
          <Icon name="smart-toy" size={20} color={colors.success} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            AI conducts conversations based on your specified reason
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="record-voice-over" size={20} color={colors.info} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            Multiple voice options for different scenarios
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="schedule" size={20} color={colors.warning} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            Schedule calls for optimal timing
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Icon name="security" size={20} color={colors.success} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            Secure and private AI conversations
          </Text>
        </View>
      </View>
      
      <VoiceSelectorModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
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
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  phoneInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  reasonChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  reasonChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  customReasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  changeVoiceButton: {
    padding: 8,
  },
  changeVoiceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedVoice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  selectedVoiceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  selectedVoiceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedVoiceDescription: {
    fontSize: 14,
  },
  actionButtons: {
    padding: 16,
    gap: 16,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  voiceList: {
    padding: 20,
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voiceText: {
    marginLeft: 16,
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  voiceDescription: {
    fontSize: 14,
  },
});

export default AICallScreen;