import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchContacts } from '../store/contactSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { contacts, loading } = useAppSelector(state => state.contacts);
  
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);
  
  const onRefresh = () => {
    dispatch(fetchContacts());
  };
  
  const QuickAction = ({ icon, title, onPress, color }: {
    icon: string;
    title: string;
    onPress: () => void;
    color: string;
  }) => (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor: color }]} onPress={onPress}>
      <Icon name={icon} size={32} color="white" />
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );
  
  const RecentContact = ({ contact }: { contact: any }) => (
    <TouchableOpacity style={[styles.contactItem, { backgroundColor: colors.card }]}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={styles.avatarText}>
          {contact.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
        <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>
          {contact.phoneNumbers[0]}
        </Text>
      </View>
      <TouchableOpacity style={styles.callButton}>
        <Icon name="call" size={24} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Contact Manager Pro</Text>
        <Text style={styles.headerSubtitle}>AI-Powered Communication</Text>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickAction
          icon="person-add"
          title="Add Contact"
          onPress={() => {}}
          color={colors.success}
        />
        <QuickAction
          icon="smart-toy"
          title="AI Call"
          onPress={() => {}}
          color={colors.secondary}
        />
        <QuickAction
          icon="block"
          title="Block Number"
          onPress={() => {}}
          color={colors.error}
        />
        <QuickAction
          icon="search"
          title="Lookup"
          onPress={() => {}}
          color={colors.info}
        />
      </View>
      
      {/* Recent Contacts */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Contacts</Text>
        {contacts.slice(0, 5).map((contact, index) => (
          <RecentContact key={contact.id || index} contact={contact} />
        ))}
        {contacts.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No contacts yet. Add your first contact to get started!
          </Text>
        )}
      </View>
      
      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{contacts.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Contacts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.success }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>AI Calls</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Blocked</Text>
        </View>
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    flexWrap: 'wrap',
  },
  quickAction: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
  },
  callButton: {
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
});

export default HomeScreen;