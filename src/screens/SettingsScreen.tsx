import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const { colors, isDark, toggleTheme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = React.useState({
    calls: true,
    messages: true,
    spam: true,
    aiCalls: true,
  });
  
  const [privacy, setPrivacy] = React.useState({
    callRecording: false,
    locationSharing: false,
    contactSync: true,
  });
  
  const [ai, setAi] = React.useState({
    autoAnswer: false,
    callReasonRequired: true,
  });
  
  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent,
    showBorder = true 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showBorder?: boolean;
  }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem,
        { borderBottomColor: showBorder ? colors.border : 'transparent' }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Icon name={icon} size={20} color="white" />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );
  
  const SwitchSetting = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <SettingItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      rightComponent={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={value ? colors.primary : colors.textSecondary}
        />
      }
    />
  );
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setTheme(theme);
  };
  
  const handleLanguageChange = () => {
    Alert.alert(
      'Language',
      'Select your preferred language',
      [
        { text: 'English', onPress: () => {} },
        { text: 'العربية', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  
  const handleExportContacts = () => {
    Alert.alert('Export Contacts', 'Your contacts will be exported to your device.');
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your contacts, call logs, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Cleared', 'All data has been cleared successfully.');
          }
        },
      ]
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>
      
      {/* Appearance */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <SettingItem
          icon="palette"
          title="Theme"
          subtitle={isDark ? 'Dark' : 'Light'}
          onPress={() => toggleTheme()}
          rightComponent={
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          }
        />
        
        <SettingItem
          icon="language"
          title="Language"
          subtitle="English"
          onPress={handleLanguageChange}
          rightComponent={
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          }
        />
      </View>
      
      {/* Notifications */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        
        <SwitchSetting
          icon="call"
          title="Call Notifications"
          subtitle="Get notified about incoming and outgoing calls"
          value={notifications.calls}
          onValueChange={(value) => setNotifications(prev => ({ ...prev, calls: value }))}
        />
        
        <SwitchSetting
          icon="message"
          title="Message Notifications"
          subtitle="Get notified about new messages"
          value={notifications.messages}
          onValueChange={(value) => setNotifications(prev => ({ ...prev, messages: value }))}
        />
        
        <SwitchSetting
          icon="block"
          title="Spam Alerts"
          subtitle="Get notified about potential spam calls"
          value={notifications.spam}
          onValueChange={(value) => setNotifications(prev => ({ ...prev, spam: value }))}
        />
        
        <SwitchSetting
          icon="smart-toy"
          title="AI Call Notifications"
          subtitle="Get notified about AI call activities"
          value={notifications.aiCalls}
          onValueChange={(value) => setNotifications(prev => ({ ...prev, aiCalls: value }))}
        />
      </View>
      
      {/* Privacy & Security */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy & Security</Text>
        
        <SwitchSetting
          icon="fiber-manual-record"
          title="Call Recording"
          subtitle="Allow the app to record calls (requires permission)"
          value={privacy.callRecording}
          onValueChange={(value) => setPrivacy(prev => ({ ...prev, callRecording: value }))}
        />
        
        <SwitchSetting
          icon="location-on"
          title="Location Sharing"
          subtitle="Share location with contacts (optional)"
          value={privacy.locationSharing}
          onValueChange={(value) => setPrivacy(prev => ({ ...prev, locationSharing: value }))}
        />
        
        <SwitchSetting
          icon="sync"
          title="Contact Sync"
          subtitle="Sync contacts across devices"
          value={privacy.contactSync}
          onValueChange={(value) => setPrivacy(prev => ({ ...prev, contactSync: value }))}
        />
      </View>
      
      {/* AI Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Assistant</Text>
        
        <SwitchSetting
          icon="smart-toy"
          title="Auto Answer Calls"
          subtitle="AI automatically answers incoming calls"
          value={ai.autoAnswer}
          onValueChange={(value) => setAi(prev => ({ ...prev, autoAnswer: value }))}
        />
        
        <SwitchSetting
          icon="assignment"
          title="Require Call Reason"
          subtitle="Always ask for a reason before AI calls"
          value={ai.callReasonRequired}
          onValueChange={(value) => setAi(prev => ({ ...prev, callReasonRequired: value }))}
        />
      </View>
      
      {/* Data Management */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
        
        <SettingItem
          icon="file-download"
          title="Export Contacts"
          subtitle="Save your contacts to your device"
          onPress={handleExportContacts}
          rightComponent={
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          }
        />
        
        <SettingItem
          icon="delete-forever"
          title="Clear All Data"
          subtitle="Permanently delete all app data"
          onPress={handleClearData}
          rightComponent={
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          }
          showBorder={false}
        />
      </View>
      
      {/* About */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        
        <SettingItem
          icon="info"
          title="App Version"
          subtitle="1.0.0"
        />
        
        <SettingItem
          icon="description"
          title="Terms of Service"
          onPress={() => {}}
          rightComponent={
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          }
        />
        
        <SettingItem
          icon="privacy-tip"
          title="Privacy Policy"
          onPress={() => {}}
          rightComponent={
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          }
          showBorder={false}
        />
      </View>
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
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
});

export default SettingsScreen;