import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchContacts, setSearchQuery, setSelectedGroup } from '../store/contactSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactsScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { contacts, groups, loading, searchQuery, selectedGroup, sortBy, sortOrder } = useAppSelector(state => state.contacts);
  
  const [searchText, setSearchText] = useState('');
  
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(setSearchQuery(searchText));
  }, [searchText, dispatch]);
  
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         contact.phoneNumbers.some(phone => phone.includes(searchText)) ||
                         contact.company.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesGroup = !selectedGroup || contact.groups.includes(selectedGroup);
    
    return matchesSearch && matchesGroup;
  });
  
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'lastContacted':
        aValue = a.lastContacted.getTime();
        bValue = b.lastContacted.getTime();
        break;
      case 'company':
        aValue = a.company.toLowerCase();
        bValue = b.company.toLowerCase();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const renderContact = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.contactItem, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('ContactDetail', { contact: item })}
    >
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>
          {item.phoneNumbers[0]}
        </Text>
        {item.company && (
          <Text style={[styles.contactCompany, { color: colors.textTertiary }]}>
            {item.company}
          </Text>
        )}
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Call', { phoneNumber: item.phoneNumbers[0] })}
        >
          <Icon name="call" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Message', { phoneNumber: item.phoneNumbers[0] })}
        >
          <Icon name="message" size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  const renderGroupFilter = () => (
    <View style={styles.groupFilter}>
      <TouchableOpacity
        style={[
          styles.groupChip,
          { backgroundColor: !selectedGroup ? colors.primary : colors.surface }
        ]}
        onPress={() => dispatch(setSelectedGroup(null))}
      >
        <Text style={[styles.groupChipText, { color: !selectedGroup ? 'white' : colors.text }]}>
          All
        </Text>
      </TouchableOpacity>
      {groups.map(group => (
        <TouchableOpacity
          key={group.id}
          style={[
            styles.groupChip,
            { backgroundColor: selectedGroup === group.id ? colors.primary : colors.surface }
          ]}
          onPress={() => dispatch(setSelectedGroup(group.id))}
        >
          <Text style={[styles.groupChipText, { color: selectedGroup === group.id ? 'white' : colors.text }]}>
            {group.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search contacts..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Icon name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Group Filter */}
      {renderGroupFilter()}
      
      {/* Contacts List */}
      <FlatList
        data={sortedContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        style={styles.contactsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchText ? 'No contacts found' : 'No contacts yet'}
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddContact')}
            >
              <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  groupFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  groupChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  groupChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    marginRight: 16,
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
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 12,
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
});

export default ContactsScreen;