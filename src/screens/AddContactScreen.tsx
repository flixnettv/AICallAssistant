import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch } from '../store/hooks';
import { addContact } from '../store/contactSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddContactScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumbers: [''],
    emailAddresses: [''],
    company: '',
    jobTitle: '',
    notes: '',
    groups: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phoneNumbers[0]?.trim()) {
      newErrors.phoneNumbers = 'At least one phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      await dispatch(addContact({
        ...formData,
        addresses: [],
        lastContacted: new Date(),
        isBlocked: false,
        spamRisk: 0,
      })).unwrap();
      
      Alert.alert('Success', 'Contact added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add contact. Please try again.');
    }
  };
  
  const addPhoneNumber = () => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ''],
    }));
  };
  
  const removePhoneNumber = (index: number) => {
    if (formData.phoneNumbers.length > 1) {
      setFormData(prev => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index),
      }));
    }
  };
  
  const updatePhoneNumber = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => 
        i === index ? value : phone
      ),
    }));
  };
  
  const addEmail = () => {
    setFormData(prev => ({
      ...prev,
      emailAddresses: [...prev.emailAddresses, ''],
    }));
  };
  
  const removeEmail = (index: number) => {
    if (formData.emailAddresses.length > 1) {
      setFormData(prev => ({
        ...prev,
        emailAddresses: prev.emailAddresses.filter((_, i) => i !== index),
      }));
    }
  };
  
  const updateEmail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      emailAddresses: prev.emailAddresses.map((email, i) => 
        i === index ? value : email
      ),
    }));
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Contact</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      {/* Form */}
      <View style={styles.form}>
        {/* Basic Information */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: errors.name ? colors.error : colors.border
              }]}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter full name"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.name && <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Company</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border
              }]}
              value={formData.company}
              onChangeText={(text) => setFormData(prev => ({ ...prev, company: text }))}
              placeholder="Enter company name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Job Title</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border
              }]}
              value={formData.jobTitle}
              onChangeText={(text) => setFormData(prev => ({ ...prev, jobTitle: text }))}
              placeholder="Enter job title"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        
        {/* Phone Numbers */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Phone Numbers *</Text>
            <TouchableOpacity onPress={addPhoneNumber} style={styles.addButton}>
              <Icon name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {formData.phoneNumbers.map((phone, index) => (
            <View key={index} style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { 
                    flex: 1,
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: errors.phoneNumbers ? colors.error : colors.border
                  }]}
                  value={phone}
                  onChangeText={(text) => updatePhoneNumber(index, text)}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
                {formData.phoneNumbers.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removePhoneNumber(index)}
                    style={styles.removeButton}
                  >
                    <Icon name="remove" size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          {errors.phoneNumbers && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.phoneNumbers}</Text>
          )}
        </View>
        
        {/* Email Addresses */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Email Addresses</Text>
            <TouchableOpacity onPress={addEmail} style={styles.addButton}>
              <Icon name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {formData.emailAddresses.map((email, index) => (
            <View key={index} style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { 
                    flex: 1,
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={email}
                  onChangeText={(text) => updateEmail(index, text)}
                  placeholder="Enter email address"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {formData.emailAddresses.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeEmail(index)}
                    style={styles.removeButton}
                  >
                    <Icon name="remove" size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
        
        {/* Notes */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
          <TextInput
            style={[styles.textArea, { 
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border
            }]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Add any additional notes..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  addButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default AddContactScreen;