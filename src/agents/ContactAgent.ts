import { BaseAgent, AgentTask } from './MasterAgent';
import { databaseService } from '../services/databaseService';
import { Contact, Group, CallLog, Message } from '../types';

// Contact Agent Implementation
class ContactAgent extends BaseAgent {
  private contactQueue: Map<string, ContactTask> = new Map();
  private contactCache: Map<string, Contact> = new Map();
  private groupCache: Map<string, Group> = new Map();
  private contactHistory: Contact[] = [];
  private recentContacts: Contact[] = [];
  private favoriteContacts: Set<string> = new Set();
  
  constructor() {
    super('contact', 'Contact Management Agent');
  }
  
  async start(): Promise<void> {
    try {
      console.log('👥 Starting Contact Agent...');
      
      this.status = 'initializing';
      
      // Load contact cache
      await this.loadContactCache();
      
      // Load group cache
      await this.loadGroupCache();
      
      // Load favorite contacts
      await this.loadFavoriteContacts();
      
      // Start contact monitoring
      this.startContactMonitoring();
      
      // Start contact intelligence
      this.startContactIntelligence();
      
      this.status = 'running';
      console.log('✅ Contact Agent started successfully');
      
    } catch (error) {
      console.error('❌ Contact Agent start error:', error);
      this.status = 'error';
      throw error;
    }
  }
  
  async stop(): Promise<void> {
    try {
      console.log('👥 Stopping Contact Agent...');
      
      this.status = 'stopped';
      
      // Clear contact queue
      this.contactQueue.clear();
      
      // Clear caches
      this.contactCache.clear();
      this.groupCache.clear();
      
      console.log('✅ Contact Agent stopped successfully');
      
    } catch (error) {
      console.error('❌ Contact Agent stop error:', error);
      throw error;
    }
  }
  
  async executeTask(task: AgentTask): Promise<any> {
    try {
      console.log(`👥 Contact Agent executing task: ${task.description}`);
      
      this.activeTasks.add(task.id);
      
      let result: any;
      
      switch (task.data.action) {
        case 'createContact':
          result = await this.createContact(task.data.contactData);
          break;
          
        case 'getContact':
          result = await this.getContact(task.data.contactId);
          break;
          
        case 'getAllContacts':
          result = await this.getAllContacts();
          break;
          
        case 'updateContact':
          result = await this.updateContact(task.data.contact);
          break;
          
        case 'deleteContact':
          result = await this.deleteContact(task.data.contactId);
          break;
          
        case 'searchContacts':
          result = await this.searchContacts(task.data.query);
          break;
          
        case 'createGroup':
          result = await this.createGroup(task.data.groupData);
          break;
          
        case 'getGroups':
          result = await this.getGroups();
          break;
          
        case 'updateGroup':
          result = await this.updateGroup(task.data.group);
          break;
          
        case 'deleteGroup':
          result = await this.deleteGroup(task.data.groupId);
          break;
          
        case 'addContactToGroup':
          result = await this.addContactToGroup(task.data.contactId, task.data.groupId);
          break;
          
        case 'removeContactFromGroup':
          result = await this.removeContactFromGroup(task.data.contactId, task.data.groupId);
          break;
          
        case 'getRecentContacts':
          result = await this.getRecentContacts(task.data.limit);
          break;
          
        case 'getFavoriteContacts':
          result = await this.getFavoriteContacts();
          break;
          
        case 'toggleFavorite':
          result = await this.toggleFavorite(task.data.contactId);
          break;
          
        case 'getContactStats':
          result = await this.getContactStats(task.data.contactId);
          break;
          
        case 'suggestGroups':
          result = await this.suggestGroups(task.data.contactId);
          break;
          
        case 'mergeContacts':
          result = await this.mergeContacts(task.data.contactIds);
          break;
          
        case 'exportContacts':
          result = await this.exportContacts(task.data.format);
          break;
          
        case 'importContacts':
          result = await this.importContacts(task.data.data, task.data.format);
          break;
          
        default:
          throw new Error(`Unknown contact action: ${task.data.action}`);
      }
      
      this.taskCompleted();
      this.activeTasks.delete(task.id);
      
      console.log(`✅ Contact Agent task completed: ${task.description}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Contact Agent task error: ${task.description}`, error);
      this.taskError();
      this.activeTasks.delete(task.id);
      throw error;
    }
  }
  
  async cancelTask(taskId: string): Promise<boolean> {
    try {
      const contactTask = this.contactQueue.get(taskId);
      if (contactTask) {
        // Cancel the contact task
        await this.cancelContactTask(contactTask);
        this.contactQueue.delete(taskId);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Cancel contact task error:', error);
      return false;
    }
  }
  
  // Contact Management Methods
  private async createContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      // Validate contact data
      if (!contactData.name.trim()) {
        throw new Error('Contact name is required');
      }
      
      if (!contactData.phoneNumbers || contactData.phoneNumbers.length === 0) {
        throw new Error('At least one phone number is required');
      }
      
      // Create contact
      const newContact = await databaseService.createContact(contactData);
      
      // Add to cache
      this.contactCache.set(newContact.id, newContact);
      
      // Update contact history
      this.contactHistory.push(newContact);
      
      // Suggest groups for new contact
      const suggestedGroups = await this.suggestGroups(newContact.id);
      if (suggestedGroups.length > 0) {
        console.log(`💡 Suggested groups for ${newContact.name}: ${suggestedGroups.map(g => g.name).join(', ')}`);
      }
      
      return newContact;
      
    } catch (error) {
      console.error('❌ Create contact error:', error);
      throw error;
    }
  }
  
  private async getContact(contactId: string): Promise<Contact | null> {
    try {
      // Check cache first
      if (this.contactCache.has(contactId)) {
        return this.contactCache.get(contactId)!;
      }
      
      // Get from database
      const contact = await databaseService.getContact(contactId);
      
      if (contact) {
        // Add to cache
        this.contactCache.set(contactId, contact);
      }
      
      return contact;
      
    } catch (error) {
      console.error('❌ Get contact error:', error);
      throw error;
    }
  }
  
  private async getAllContacts(): Promise<Contact[]> {
    try {
      // Get from database
      const contacts = await databaseService.getAllContacts();
      
      // Update cache
      this.contactCache.clear();
      contacts.forEach(contact => {
        this.contactCache.set(contact.id, contact);
      });
      
      // Update contact history
      this.contactHistory = [...contacts];
      
      return contacts;
      
    } catch (error) {
      console.error('❌ Get all contacts error:', error);
      throw error;
    }
  }
  
  private async updateContact(contact: Contact): Promise<Contact> {
    try {
      // Update contact
      const updatedContact = await databaseService.updateContact(contact);
      
      // Update cache
      this.contactCache.set(updatedContact.id, updatedContact);
      
      // Update contact history
      const index = this.contactHistory.findIndex(c => c.id === updatedContact.id);
      if (index !== -1) {
        this.contactHistory[index] = updatedContact;
      }
      
      return updatedContact;
      
    } catch (error) {
      console.error('❌ Update contact error:', error);
      throw error;
    }
  }
  
  private async deleteContact(contactId: string): Promise<boolean> {
    try {
      // Delete contact
      const success = await databaseService.deleteContact(contactId);
      
      if (success) {
        // Remove from cache
        this.contactCache.delete(contactId);
        
        // Remove from contact history
        this.contactHistory = this.contactHistory.filter(c => c.id !== contactId);
        
        // Remove from favorites
        this.favoriteContacts.delete(contactId);
        
        // Remove from recent contacts
        this.recentContacts = this.recentContacts.filter(c => c.id !== contactId);
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Delete contact error:', error);
      throw error;
    }
  }
  
  private async searchContacts(query: string): Promise<Contact[]> {
    try {
      // Search in database
      const contacts = await databaseService.searchContacts(query);
      
      // Also search in cache for better performance
      const cacheResults = Array.from(this.contactCache.values()).filter(contact =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.company?.toLowerCase().includes(query.toLowerCase()) ||
        contact.phoneNumbers.some(p => p.number.includes(query)) ||
        contact.emailAddresses.some(e => e.email.includes(query))
      );
      
      // Combine and deduplicate results
      const allResults = [...contacts, ...cacheResults];
      const uniqueResults = allResults.filter((contact, index, self) =>
        index === self.findIndex(c => c.id === contact.id)
      );
      
      return uniqueResults;
      
    } catch (error) {
      console.error('❌ Search contacts error:', error);
      throw error;
    }
  }
  
  // Group Management Methods
  private async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group> {
    try {
      // Validate group data
      if (!groupData.name.trim()) {
        throw new Error('Group name is required');
      }
      
      // Create group
      const newGroup = await databaseService.createGroup(groupData);
      
      // Add to cache
      this.groupCache.set(newGroup.id, newGroup);
      
      return newGroup;
      
    } catch (error) {
      console.error('❌ Create group error:', error);
      throw error;
    }
  }
  
  private async getGroups(): Promise<Group[]> {
    try {
      // Get from database
      const groups = await databaseService.getGroups();
      
      // Update cache
      this.groupCache.clear();
      groups.forEach(group => {
        this.groupCache.set(group.id, group);
      });
      
      return groups;
      
    } catch (error) {
      console.error('❌ Get groups error:', error);
      throw error;
    }
  }
  
  private async updateGroup(group: Group): Promise<Group> {
    try {
      // Update group
      const updatedGroup = await databaseService.updateGroup(group);
      
      // Update cache
      this.groupCache.set(updatedGroup.id, updatedGroup);
      
      return updatedGroup;
      
    } catch (error) {
      console.error('❌ Update group error:', error);
      throw error;
    }
  }
  
  private async deleteGroup(groupId: string): Promise<boolean> {
    try {
      // Delete group
      const success = await databaseService.deleteGroup(groupId);
      
      if (success) {
        // Remove from cache
        this.groupCache.delete(groupId);
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Delete group error:', error);
      throw error;
    }
  }
  
  private async addContactToGroup(contactId: string, groupId: string): Promise<boolean> {
    try {
      const success = await databaseService.addContactToGroup(contactId, groupId);
      
      if (success) {
        // Update cache
        const group = this.groupCache.get(groupId);
        if (group) {
          group.contactIds.push(contactId);
          this.groupCache.set(groupId, group);
        }
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Add contact to group error:', error);
      throw error;
    }
  }
  
  private async removeContactFromGroup(contactId: string, groupId: string): Promise<boolean> {
    try {
      const success = await databaseService.removeContactFromGroup(contactId, groupId);
      
      if (success) {
        // Update cache
        const group = this.groupCache.get(groupId);
        if (group) {
          group.contactIds = group.contactIds.filter(id => id !== contactId);
          this.groupCache.set(groupId, group);
        }
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Remove contact from group error:', error);
      throw error;
    }
  }
  
  // Contact Intelligence Methods
  private async getRecentContacts(limit: number = 10): Promise<Contact[]> {
    try {
      // Get contacts sorted by last contacted
      const sortedContacts = [...this.contactHistory].sort((a, b) =>
        b.lastContacted.getTime() - a.lastContacted.getTime()
      );
      
      this.recentContacts = sortedContacts.slice(0, limit);
      return this.recentContacts;
      
    } catch (error) {
      console.error('❌ Get recent contacts error:', error);
      return [];
    }
  }
  
  private async getFavoriteContacts(): Promise<Contact[]> {
    try {
      return Array.from(this.favoriteContacts).map(id => 
        this.contactCache.get(id)
      ).filter(Boolean) as Contact[];
      
    } catch (error) {
      console.error('❌ Get favorite contacts error:', error);
      return [];
    }
  }
  
  private async toggleFavorite(contactId: string): Promise<boolean> {
    try {
      if (this.favoriteContacts.has(contactId)) {
        this.favoriteContacts.delete(contactId);
      } else {
        this.favoriteContacts.add(contactId);
      }
      
      // Save favorites
      await this.saveFavoriteContacts();
      
      return true;
      
    } catch (error) {
      console.error('❌ Toggle favorite error:', error);
      return false;
    }
  }
  
  private async getContactStats(contactId: string): Promise<any> {
    try {
      const contact = await this.getContact(contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      // Get call history
      const callLogs = await databaseService.getCallLogsByContact(contactId);
      
      // Get message history
      const messages = await databaseService.getMessages(contactId);
      
      // Calculate stats
      const stats = {
        totalCalls: callLogs.length,
        totalMessages: messages.length,
        lastContact: contact.lastContacted,
        spamRisk: contact.spamRisk,
        callTypes: callLogs.reduce((acc, call) => {
          acc[call.callType] = (acc[call.callType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        messageTypes: messages.reduce((acc, message) => {
          acc[message.type] = (acc[message.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
      
      return stats;
      
    } catch (error) {
      console.error('❌ Get contact stats error:', error);
      throw error;
    }
  }
  
  private async suggestGroups(contactId: string): Promise<Group[]> {
    try {
      const contact = await this.getContact(contactId);
      if (!contact) {
        return [];
      }
      
      const groups = Array.from(this.groupCache.values());
      const suggestions: Group[] = [];
      
      // Suggest based on company
      if (contact.company) {
        const companyGroups = groups.filter(g => 
          g.name.toLowerCase().includes('work') || 
          g.name.toLowerCase().includes('business') ||
          g.name.toLowerCase().includes('company')
        );
        suggestions.push(...companyGroups);
      }
      
      // Suggest based on phone number patterns
      const phoneGroups = groups.filter(g => 
        g.name.toLowerCase().includes('family') || 
        g.name.toLowerCase().includes('friends') ||
        g.name.toLowerCase().includes('personal')
      );
      suggestions.push(...phoneGroups);
      
      // Remove duplicates
      const uniqueSuggestions = suggestions.filter((group, index, self) =>
        index === self.findIndex(g => g.id === group.id)
      );
      
      return uniqueSuggestions.slice(0, 3); // Return top 3 suggestions
      
    } catch (error) {
      console.error('❌ Suggest groups error:', error);
      return [];
    }
  }
  
  private async mergeContacts(contactIds: string[]): Promise<Contact> {
    try {
      if (contactIds.length < 2) {
        throw new Error('At least 2 contacts required for merging');
      }
      
      // Get all contacts to merge
      const contacts = await Promise.all(
        contactIds.map(id => this.getContact(id))
      );
      
      const validContacts = contacts.filter(Boolean) as Contact[];
      if (validContacts.length < 2) {
        throw new Error('Some contacts not found');
      }
      
      // Merge contact data (keep the first contact as primary)
      const primaryContact = validContacts[0];
      const mergedContact: Contact = {
        ...primaryContact,
        phoneNumbers: [
          ...primaryContact.phoneNumbers,
          ...validContacts.slice(1).flatMap(c => c.phoneNumbers)
        ],
        emailAddresses: [
          ...primaryContact.emailAddresses,
          ...validContacts.slice(1).flatMap(c => c.emailAddresses)
        ],
        groups: [
          ...primaryContact.groups,
          ...validContacts.slice(1).flatMap(c => c.groups)
        ],
        notes: [
          primaryContact.notes,
          ...validContacts.slice(1).map(c => c.notes).filter(Boolean)
        ].join('\n\n'),
      };
      
      // Update primary contact
      const updatedContact = await this.updateContact(mergedContact);
      
      // Delete other contacts
      for (let i = 1; i < validContacts.length; i++) {
        await this.deleteContact(validContacts[i].id);
      }
      
      return updatedContact;
      
    } catch (error) {
      console.error('❌ Merge contacts error:', error);
      throw error;
    }
  }
  
  // Import/Export Methods
  private async exportContacts(format: string = 'json'): Promise<string> {
    try {
      const contacts = await this.getAllContacts();
      
      switch (format.toLowerCase()) {
        case 'json':
          return JSON.stringify(contacts, null, 2);
        case 'csv':
          return this.contactsToCSV(contacts);
        case 'vcf':
          return this.contactsToVCF(contacts);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
    } catch (error) {
      console.error('❌ Export contacts error:', error);
      throw error;
    }
  }
  
  private async importContacts(data: string, format: string = 'json'): Promise<boolean> {
    try {
      let contacts: any[];
      
      switch (format.toLowerCase()) {
        case 'json':
          contacts = JSON.parse(data);
          break;
        case 'csv':
          contacts = this.csvToContacts(data);
          break;
        case 'vcf':
          contacts = this.vcfToContacts(data);
          break;
        default:
          throw new Error(`Unsupported import format: ${format}`);
      }
      
      // Import contacts
      for (const contactData of contacts) {
        await this.createContact(contactData);
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Import contacts error:', error);
      throw error;
    }
  }
  
  // Private helper methods
  private async loadContactCache(): Promise<void> {
    try {
      const contacts = await databaseService.getAllContacts();
      contacts.forEach(contact => {
        this.contactCache.set(contact.id, contact);
      });
      this.contactHistory = [...contacts];
    } catch (error) {
      console.error('❌ Load contact cache error:', error);
    }
  }
  
  private async loadGroupCache(): Promise<void> {
    try {
      const groups = await databaseService.getGroups();
      groups.forEach(group => {
        this.groupCache.set(group.id, group);
      });
    } catch (error) {
      console.error('❌ Load group cache error:', error);
    }
  }
  
  private async loadFavoriteContacts(): Promise<void> {
    try {
      // Load from storage or database
      // For now, using empty set
      this.favoriteContacts = new Set();
    } catch (error) {
      console.error('❌ Load favorite contacts error:', error);
    }
  }
  
  private async saveFavoriteContacts(): Promise<void> {
    try {
      // Save to storage or database
      // For now, just logging
      console.log('💾 Favorite contacts saved');
    } catch (error) {
      console.error('❌ Save favorite contacts error:', error);
    }
  }
  
  private startContactMonitoring(): void {
    // Monitor contact changes and update caches
    setInterval(() => {
      try {
        // Check for contact updates
        // This could involve watching for file changes or database updates
        console.log('👥 Contact monitoring active');
        
      } catch (error) {
        console.error('❌ Contact monitoring error:', error);
      }
    }, 300000); // Check every 5 minutes
  }
  
  private startContactIntelligence(): void {
    // Analyze contact patterns and provide insights
    setInterval(async () => {
      try {
        console.log('🧠 Running contact intelligence...');
        
        // Analyze contact interaction patterns
        // Suggest groups, detect duplicates, etc.
        
        console.log('✅ Contact intelligence completed');
        
      } catch (error) {
        console.error('❌ Contact intelligence error:', error);
      }
    }, 1800000); // Run every 30 minutes
  }
  
  private contactsToCSV(contacts: Contact[]): string {
    const headers = ['Name', 'Phone Numbers', 'Email Addresses', 'Company', 'Job Title', 'Notes'];
    const rows = contacts.map(contact => [
      contact.name,
      contact.phoneNumbers.map(p => p.number).join(';'),
      contact.emailAddresses.map(e => e.email).join(';'),
      contact.company || '',
      contact.jobTitle || '',
      contact.notes || '',
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  private csvToContacts(csvData: string): any[] {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const contacts = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const contact: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header.trim()) {
          case 'Name':
            contact.name = value;
            break;
          case 'Phone Numbers':
            contact.phoneNumbers = value.split(';').map((num: string) => ({ number: num.trim() }));
            break;
          case 'Email Addresses':
            contact.emailAddresses = value.split(';').map((email: string) => ({ email: email.trim() }));
            break;
          case 'Company':
            contact.company = value;
            break;
          case 'Job Title':
            contact.jobTitle = value;
            break;
          case 'Notes':
            contact.notes = value;
            break;
        }
      });
      
      contacts.push(contact);
    }
    
    return contacts;
  }
  
  private contactsToVCF(contacts: Contact[]): string {
    return contacts.map(contact => {
      const vcf = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contact.name}`,
        ...contact.phoneNumbers.map(p => `TEL:${p.number}`),
        ...contact.emailAddresses.map(e => `EMAIL:${e.email}`),
        contact.company ? `ORG:${contact.company}` : '',
        contact.jobTitle ? `TITLE:${contact.jobTitle}` : '',
        contact.notes ? `NOTE:${contact.notes}` : '',
        'END:VCARD',
      ].filter(Boolean).join('\n');
      
      return vcf;
    }).join('\n');
  }
  
  private vcfToContacts(vcfData: string): any[] {
    const vcards = vcfData.split('BEGIN:VCARD');
    const contacts = [];
    
    for (const vcard of vcards) {
      if (!vcard.trim()) continue;
      
      const lines = vcard.split('\n');
      const contact: any = {
        phoneNumbers: [],
        emailAddresses: [],
      };
      
      for (const line of lines) {
        if (line.startsWith('FN:')) {
          contact.name = line.substring(3);
        } else if (line.startsWith('TEL:')) {
          contact.phoneNumbers.push({ number: line.substring(4) });
        } else if (line.startsWith('EMAIL:')) {
          contact.emailAddresses.push({ email: line.substring(6) });
        } else if (line.startsWith('ORG:')) {
          contact.company = line.substring(4);
        } else if (line.startsWith('TITLE:')) {
          contact.jobTitle = line.substring(6);
        } else if (line.startsWith('NOTE:')) {
          contact.notes = line.substring(5);
        }
      }
      
      if (contact.name) {
        contacts.push(contact);
      }
    }
    
    return contacts;
  }
  
  private async cancelContactTask(contactTask: ContactTask): Promise<void> {
    try {
      // Cancel the specific contact task
      console.log(`🚫 Cancelled contact task: ${contactTask.id}`);
      
    } catch (error) {
      console.error('❌ Cancel contact task error:', error);
    }
  }
}

// Contact Task Interface
interface ContactTask {
  id: string;
  contactId?: string;
  groupId?: string;
  action: string;
  data: any;
  status: 'pending' | 'running' | 'completed' | 'cancelled';
}

// Export singleton instance
export const contactAgent = new ContactAgent();

// Export types
export type { ContactTask };