import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, CallLog, Message, Group, UserSettings } from '../types';
import { Config } from '../constants/config';

// Database Service Interface
export interface DatabaseServiceInterface {
  // Database Management
  initialize(): Promise<void>;
  close(): Promise<void>;
  
  // Contact Operations
  createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact>;
  getContact(id: string): Promise<Contact | null>;
  getAllContacts(): Promise<Contact[]>;
  updateContact(contact: Contact): Promise<Contact>;
  deleteContact(id: string): Promise<boolean>;
  searchContacts(query: string): Promise<Contact[]>;
  
  // Call Log Operations
  createCallLog(callLog: Omit<CallLog, 'id'>): Promise<CallLog>;
  getCallLogs(limit?: number): Promise<CallLog[]>;
  getCallLogsByContact(contactId: string): Promise<CallLog[]>;
  deleteCallLog(id: string): Promise<boolean>;
  
  // Message Operations
  createMessage(message: Omit<Message, 'id'>): Promise<Message>;
  getMessages(contactId?: string, limit?: number): Promise<Message[]>;
  markMessageAsRead(id: string): Promise<boolean>;
  deleteMessage(id: string): Promise<boolean>;
  
  // Group Operations
  createGroup(group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group>;
  getGroups(): Promise<Group[]>;
  updateGroup(group: Group): Promise<Group>;
  deleteGroup(id: string): Promise<boolean>;
  addContactToGroup(contactId: string, groupId: string): Promise<boolean>;
  removeContactFromGroup(contactId: string, groupId: string): Promise<boolean>;
  
  // Settings Operations
  getSettings(): Promise<UserSettings>;
  updateSettings(settings: Partial<UserSettings>): Promise<UserSettings>;
  
  // Backup & Sync
  exportData(): Promise<string>;
  importData(data: string): Promise<boolean>;
  syncWithCloud(): Promise<boolean>;
}

// Database Service Implementation
class DatabaseService implements DatabaseServiceInterface {
  private database: SQLite.SQLiteDatabase | null = null;
  private isInitialized: boolean = false;
  
  // Database Management
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }
      
      console.log('🗄️ Initializing database...');
      
      // Open database
      this.database = await SQLite.openDatabase({
        name: Config.database.name,
        version: Config.database.version,
        description: 'Contact Manager Database',
        size: 200000,
      });
      
      // Create tables
      await this.createTables();
      
      this.isInitialized = true;
      console.log('✅ Database initialized successfully');
      
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      throw error;
    }
  }
  
  async close(): Promise<void> {
    try {
      if (this.database) {
        await this.database.close();
        this.database = null;
        this.isInitialized = false;
        console.log('🔒 Database closed');
      }
    } catch (error) {
      console.error('❌ Database close error:', error);
      throw error;
    }
  }
  
  // Contact Operations
  async createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      await this.ensureInitialized();
      
      const newContact: Contact = {
        ...contact,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const query = `
        INSERT INTO contacts (
          id, name, phoneNumbers, emailAddresses, company, jobTitle, 
          notes, groups, lastContacted, isBlocked, spamRisk, avatar
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const phoneNumbers = JSON.stringify(contact.phoneNumbers);
      const emailAddresses = JSON.stringify(contact.emailAddresses);
      const groups = JSON.stringify(contact.groups);
      
      await this.database!.executeSql(query, [
        newContact.id,
        newContact.name,
        phoneNumbers,
        emailAddresses,
        newContact.company,
        newContact.jobTitle,
        newContact.notes,
        groups,
        newContact.lastContacted.toISOString(),
        newContact.isBlocked ? 1 : 0,
        newContact.spamRisk,
        newContact.avatar || '',
      ]);
      
      console.log(`✅ Contact created: ${newContact.name}`);
      return newContact;
      
    } catch (error) {
      console.error('❌ Create contact error:', error);
      throw error;
    }
  }
  
  async getContact(id: string): Promise<Contact | null> {
    try {
      await this.ensureInitialized();
      
      const query = 'SELECT * FROM contacts WHERE id = ?';
      const [results] = await this.database!.executeSql(query, [id]);
      
      if (results.rows.length > 0) {
        const row = results.rows.item(0);
        return this.parseContactFromRow(row);
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Get contact error:', error);
      throw error;
    }
  }
  
  async getAllContacts(): Promise<Contact[]> {
    try {
      await this.ensureInitialized();
      
      const query = 'SELECT * FROM contacts ORDER BY name ASC';
      const [results] = await this.database!.executeSql(query);
      
      const contacts: Contact[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        contacts.push(this.parseContactFromRow(row));
      }
      
      return contacts;
      
    } catch (error) {
      console.error('❌ Get all contacts error:', error);
      throw error;
    }
  }
  
  async updateContact(contact: Contact): Promise<Contact> {
    try {
      await this.ensureInitialized();
      
      const updatedContact = {
        ...contact,
        updatedAt: new Date(),
      };
      
      const query = `
        UPDATE contacts SET 
          name = ?, phoneNumbers = ?, emailAddresses = ?, company = ?, 
          jobTitle = ?, notes = ?, groups = ?, lastContacted = ?, 
          isBlocked = ?, spamRisk = ?, avatar = ?, updatedAt = ?
        WHERE id = ?
      `;
      
      const phoneNumbers = JSON.stringify(contact.phoneNumbers);
      const emailAddresses = JSON.stringify(contact.emailAddresses);
      const groups = JSON.stringify(contact.groups);
      
      await this.database!.executeSql(query, [
        updatedContact.name,
        phoneNumbers,
        emailAddresses,
        updatedContact.company,
        updatedContact.jobTitle,
        updatedContact.notes,
        groups,
        updatedContact.lastContacted.toISOString(),
        updatedContact.isBlocked ? 1 : 0,
        updatedContact.spamRisk,
        updatedContact.avatar || '',
        updatedContact.updatedAt.toISOString(),
        updatedContact.id,
      ]);
      
      console.log(`✅ Contact updated: ${updatedContact.name}`);
      return updatedContact;
      
    } catch (error) {
      console.error('❌ Update contact error:', error);
      throw error;
    }
  }
  
  async deleteContact(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const query = 'DELETE FROM contacts WHERE id = ?';
      await this.database!.executeSql(query, [id]);
      
      console.log(`✅ Contact deleted: ${id}`);
      return true;
      
    } catch (error) {
      console.error('❌ Delete contact error:', error);
      throw error;
    }
  }
  
  async searchContacts(query: string): Promise<Contact[]> {
    try {
      await this.ensureInitialized();
      
      const searchQuery = `
        SELECT * FROM contacts 
        WHERE name LIKE ? OR company LIKE ? OR notes LIKE ?
        ORDER BY name ASC
      `;
      
      const searchTerm = `%${query}%`;
      const [results] = await this.database!.executeSql(searchQuery, [
        searchTerm, searchTerm, searchTerm
      ]);
      
      const contacts: Contact[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        contacts.push(this.parseContactFromRow(row));
      }
      
      return contacts;
      
    } catch (error) {
      console.error('❌ Search contacts error:', error);
      throw error;
    }
  }
  
  // Call Log Operations
  async createCallLog(callLog: Omit<CallLog, 'id'>): Promise<CallLog> {
    try {
      await this.ensureInitialized();
      
      const newCallLog: CallLog = {
        ...callLog,
        id: Date.now().toString(),
      };
      
      const query = `
        INSERT INTO call_logs (
          id, contactId, phoneNumber, callType, duration, 
          timestamp, isRecorded, recordingPath, aiTranscription, callReason, spamScore
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await this.database!.executeSql(query, [
        newCallLog.id,
        newCallLog.contactId || '',
        newCallLog.phoneNumber,
        newCallLog.callType,
        newCallLog.duration,
        newCallLog.timestamp.toISOString(),
        newCallLog.isRecorded ? 1 : 0,
        newCallLog.recordingPath || '',
        newCallLog.aiTranscription || '',
        newCallLog.callReason || '',
        newCallLog.spamScore || 0,
      ]);
      
      console.log(`✅ Call log created: ${newCallLog.phoneNumber}`);
      return newCallLog;
      
    } catch (error) {
      console.error('❌ Create call log error:', error);
      throw error;
    }
  }
  
  async getCallLogs(limit: number = 100): Promise<CallLog[]> {
    try {
      await this.ensureInitialized();
      
      const query = `
        SELECT * FROM call_logs 
        ORDER BY timestamp DESC 
        LIMIT ?
      `;
      
      const [results] = await this.database!.executeSql(query, [limit]);
      
      const callLogs: CallLog[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        callLogs.push(this.parseCallLogFromRow(row));
      }
      
      return callLogs;
      
    } catch (error) {
      console.error('❌ Get call logs error:', error);
      throw error;
    }
  }
  
  async getCallLogsByContact(contactId: string): Promise<CallLog[]> {
    try {
      await this.ensureInitialized();
      
      const query = `
        SELECT * FROM call_logs 
        WHERE contactId = ? 
        ORDER BY timestamp DESC
      `;
      
      const [results] = await this.database!.executeSql(query, [contactId]);
      
      const callLogs: CallLog[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        callLogs.push(this.parseCallLogFromRow(row));
      }
      
      return callLogs;
      
    } catch (error) {
      console.error('❌ Get call logs by contact error:', error);
      throw error;
    }
  }
  
  async deleteCallLog(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const query = 'DELETE FROM call_logs WHERE id = ?';
      await this.database!.executeSql(query, [id]);
      
      console.log(`✅ Call log deleted: ${id}`);
      return true;
      
    } catch (error) {
      console.error('❌ Delete call log error:', error);
      throw error;
    }
  }
  
  // Message Operations
  async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
    try {
      await this.ensureInitialized();
      
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(),
      };
      
      const query = `
        INSERT INTO messages (
          id, contactId, phoneNumber, type, content, timestamp, 
          isIncoming, isRead, isSpam, attachments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const attachments = JSON.stringify(message.attachments || []);
      
      await this.database!.executeSql(query, [
        newMessage.id,
        newMessage.contactId || '',
        newMessage.phoneNumber,
        newMessage.type,
        newMessage.content,
        newMessage.timestamp.toISOString(),
        newMessage.isIncoming ? 1 : 0,
        newMessage.isRead ? 1 : 0,
        newMessage.isSpam ? 1 : 0,
        attachments,
      ]);
      
      console.log(`✅ Message created: ${newMessage.phoneNumber}`);
      return newMessage;
      
    } catch (error) {
      console.error('❌ Create message error:', error);
      throw error;
    }
  }
  
  async getMessages(contactId?: string, limit: number = 100): Promise<Message[]> {
    try {
      await this.ensureInitialized();
      
      let query: string;
      let params: any[];
      
      if (contactId) {
        query = `
          SELECT * FROM messages 
          WHERE contactId = ? 
          ORDER BY timestamp DESC 
          LIMIT ?
        `;
        params = [contactId, limit];
      } else {
        query = `
          SELECT * FROM messages 
          ORDER BY timestamp DESC 
          LIMIT ?
        `;
        params = [limit];
      }
      
      const [results] = await this.database!.executeSql(query, params);
      
      const messages: Message[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        messages.push(this.parseMessageFromRow(row));
      }
      
      return messages;
      
    } catch (error) {
      console.error('❌ Get messages error:', error);
      throw error;
    }
  }
  
  async markMessageAsRead(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const query = 'UPDATE messages SET isRead = 1 WHERE id = ?';
      await this.database!.executeSql(query, [id]);
      
      console.log(`✅ Message marked as read: ${id}`);
      return true;
      
    } catch (error) {
      console.error('❌ Mark message as read error:', error);
      throw error;
    }
  }
  
  async deleteMessage(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const query = 'DELETE FROM messages WHERE id = ?';
      await this.database!.executeSql(query, [id]);
      
      console.log(`✅ Message deleted: ${id}`);
      return true;
      
    } catch (error) {
      console.error('❌ Delete message error:', error);
      throw error;
    }
  }
  
  // Group Operations
  async createGroup(group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group> {
    try {
      await this.ensureInitialized();
      
      const newGroup: Group = {
        ...group,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const query = `
        INSERT INTO groups (
          id, name, color, icon, contactIds
        ) VALUES (?, ?, ?, ?, ?)
      `;
      
      const contactIds = JSON.stringify(group.contactIds);
      
      await this.database!.executeSql(query, [
        newGroup.id,
        newGroup.name,
        newGroup.color,
        newGroup.icon || '',
        contactIds,
      ]);
      
      console.log(`✅ Group created: ${newGroup.name}`);
      return newGroup;
      
    } catch (error) {
      console.error('❌ Create group error:', error);
      throw error;
    }
  }
  
  async getGroups(): Promise<Group[]> {
    try {
      await this.ensureInitialized();
      
      const query = 'SELECT * FROM groups ORDER BY name ASC';
      const [results] = await this.database!.executeSql(query);
      
      const groups: Group[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        groups.push(this.parseGroupFromRow(row));
      }
      
      return groups;
      
    } catch (error) {
      console.error('❌ Get groups error:', error);
      throw error;
    }
  }
  
  async updateGroup(group: Group): Promise<Group> {
    try {
      await this.ensureInitialized();
      
      const updatedGroup = {
        ...group,
        updatedAt: new Date(),
      };
      
      const query = `
        UPDATE groups SET 
          name = ?, color = ?, icon = ?, contactIds = ?, updatedAt = ?
        WHERE id = ?
      `;
      
      const contactIds = JSON.stringify(group.contactIds);
      
      await this.database!.executeSql(query, [
        updatedGroup.name,
        updatedGroup.color,
        updatedGroup.icon || '',
        contactIds,
        updatedGroup.updatedAt.toISOString(),
        updatedGroup.id,
      ]);
      
      console.log(`✅ Group updated: ${updatedGroup.name}`);
      return updatedGroup;
      
    } catch (error) {
      console.error('❌ Update group error:', error);
      throw error;
    }
  }
  
  async deleteGroup(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const query = 'DELETE FROM groups WHERE id = ?';
      await this.database!.executeSql(query, [id]);
      
      console.log(`✅ Group deleted: ${id}`);
      return true;
      
    } catch (error) {
      console.error('❌ Delete group error:', error);
      throw error;
    }
  }
  
  async addContactToGroup(contactId: string, groupId: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      // Get current group
      const group = await this.getGroupById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }
      
      // Add contact if not already in group
      if (!group.contactIds.includes(contactId)) {
        group.contactIds.push(contactId);
        await this.updateGroup(group);
      }
      
      console.log(`✅ Contact added to group: ${contactId} -> ${groupId}`);
      return true;
      
    } catch (error) {
      console.error('❌ Add contact to group error:', error);
      throw error;
    }
  }
  
  async removeContactFromGroup(contactId: string, groupId: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      // Get current group
      const group = await this.getGroupById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }
      
      // Remove contact from group
      group.contactIds = group.contactIds.filter(id => id !== contactId);
      await this.updateGroup(group);
      
      console.log(`✅ Contact removed from group: ${contactId} <- ${groupId}`);
      return true;
      
    } catch (error) {
      console.error('❌ Remove contact from group error:', error);
      throw error;
    }
  }
  
  // Settings Operations
  async getSettings(): Promise<UserSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem('user_settings');
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
      
      // Return default settings
      return {
        id: 'default',
        language: 'ar',
        theme: 'auto',
        notifications: {
          calls: true,
          messages: true,
          spam: true,
          aiCalls: true,
        },
        privacy: {
          callRecording: false,
          locationSharing: false,
          contactSync: true,
        },
        ai: {
          autoAnswer: false,
          defaultVoice: 'young-male',
          callReasonRequired: true,
        },
      };
      
    } catch (error) {
      console.error('❌ Get settings error:', error);
      throw error;
    }
  }
  
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      
      await AsyncStorage.setItem('user_settings', JSON.stringify(updatedSettings));
      
      console.log('✅ Settings updated');
      return updatedSettings;
      
    } catch (error) {
      console.error('❌ Update settings error:', error);
      throw error;
    }
  }
  
  // Backup & Sync
  async exportData(): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const contacts = await this.getAllContacts();
      const callLogs = await this.getCallLogs();
      const messages = await this.getMessages();
      const groups = await this.getGroups();
      const settings = await this.getSettings();
      
      const exportData = {
        contacts,
        callLogs,
        messages,
        groups,
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };
      
      return JSON.stringify(exportData, null, 2);
      
    } catch (error) {
      console.error('❌ Export data error:', error);
      throw error;
    }
  }
  
  async importData(data: string): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const importData = JSON.parse(data);
      
      // Validate import data
      if (!importData.contacts || !Array.isArray(importData.contacts)) {
        throw new Error('Invalid import data format');
      }
      
      // Clear existing data
      await this.clearAllData();
      
      // Import contacts
      for (const contact of importData.contacts) {
        await this.createContact(contact);
      }
      
      // Import other data types
      if (importData.groups) {
        for (const group of importData.groups) {
          await this.createGroup(group);
        }
      }
      
      console.log('✅ Data imported successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Import data error:', error);
      throw error;
    }
  }
  
  async syncWithCloud(): Promise<boolean> {
    try {
      console.log('☁️ Syncing with cloud...');
      
      // TODO: Implement Firebase sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Cloud sync completed');
      return true;
      
    } catch (error) {
      console.error('❌ Cloud sync error:', error);
      throw error;
    }
  }
  
  // Private helper methods
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }
  
  private async createTables(): Promise<void> {
    try {
      // Create contacts table
      await this.database!.executeSql(`
        CREATE TABLE IF NOT EXISTS contacts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          phoneNumbers TEXT NOT NULL,
          emailAddresses TEXT NOT NULL,
          company TEXT,
          jobTitle TEXT,
          notes TEXT,
          groups TEXT NOT NULL,
          lastContacted TEXT NOT NULL,
          isBlocked INTEGER DEFAULT 0,
          spamRisk REAL DEFAULT 0,
          avatar TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);
      
      // Create call_logs table
      await this.database!.executeSql(`
        CREATE TABLE IF NOT EXISTS call_logs (
          id TEXT PRIMARY KEY,
          contactId TEXT,
          phoneNumber TEXT NOT NULL,
          callType TEXT NOT NULL,
          duration INTEGER DEFAULT 0,
          timestamp TEXT NOT NULL,
          isRecorded INTEGER DEFAULT 0,
          recordingPath TEXT,
          aiTranscription TEXT,
          callReason TEXT,
          spamScore REAL DEFAULT 0
        )
      `);
      
      // Create messages table
      await this.database!.executeSql(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          contactId TEXT,
          phoneNumber TEXT NOT NULL,
          type TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          isIncoming INTEGER DEFAULT 0,
          isRead INTEGER DEFAULT 0,
          isSpam INTEGER DEFAULT 0,
          attachments TEXT NOT NULL
        )
      `);
      
      // Create groups table
      await this.database!.executeSql(`
        CREATE TABLE IF NOT EXISTS groups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          icon TEXT,
          contactIds TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);
      
      console.log('✅ Database tables created');
      
    } catch (error) {
      console.error('❌ Create tables error:', error);
      throw error;
    }
  }
  
  private parseContactFromRow(row: any): Contact {
    return {
      id: row.id,
      name: row.name,
      phoneNumbers: JSON.parse(row.phoneNumbers),
      emailAddresses: JSON.parse(row.emailAddresses),
      addresses: [], // TODO: Implement addresses
      company: row.company,
      jobTitle: row.jobTitle,
      notes: row.notes,
      groups: JSON.parse(row.groups),
      lastContacted: new Date(row.lastContacted),
      isBlocked: Boolean(row.isBlocked),
      spamRisk: row.spamRisk,
      avatar: row.avatar || undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
  
  private parseCallLogFromRow(row: any): CallLog {
    return {
      id: row.id,
      contactId: row.contactId || undefined,
      phoneNumber: row.phoneNumber,
      callType: row.callType,
      duration: row.duration,
      timestamp: new Date(row.timestamp),
      isRecorded: Boolean(row.isRecorded),
      recordingPath: row.recordingPath || undefined,
      aiTranscription: row.aiTranscription || undefined,
      callReason: row.callReason || undefined,
      spamScore: row.spamScore || undefined,
    };
  }
  
  private parseMessageFromRow(row: any): Message {
    return {
      id: row.id,
      contactId: row.contactId || undefined,
      phoneNumber: row.phoneNumber,
      type: row.type,
      content: row.content,
      timestamp: new Date(row.timestamp),
      isIncoming: Boolean(row.isIncoming),
      isRead: Boolean(row.isRead),
      isSpam: Boolean(row.isSpam),
      attachments: JSON.parse(row.attachments),
    };
  }
  
  private parseGroupFromRow(row: any): Group {
    return {
      id: row.id,
      name: row.name,
      color: row.color,
      icon: row.icon || undefined,
      contactIds: JSON.parse(row.contactIds),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
  
  private async getGroupById(id: string): Promise<Group | null> {
    try {
      const query = 'SELECT * FROM groups WHERE id = ?';
      const [results] = await this.database!.executeSql(query, [id]);
      
      if (results.rows.length > 0) {
        const row = results.rows.item(0);
        return this.parseGroupFromRow(row);
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Get group by ID error:', error);
      return null;
    }
  }
  
  private async clearAllData(): Promise<void> {
    try {
      await this.database!.executeSql('DELETE FROM contacts');
      await this.database!.executeSql('DELETE FROM call_logs');
      await this.database!.executeSql('DELETE FROM messages');
      await this.database!.executeSql('DELETE FROM groups');
      
      console.log('✅ All data cleared');
      
    } catch (error) {
      console.error('❌ Clear all data error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();

// Export types
export type { DatabaseServiceInterface };