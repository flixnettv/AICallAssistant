import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contact, Group } from '../types';

interface ContactState {
  contacts: Contact[];
  groups: Group[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedGroup: string | null;
  sortBy: 'name' | 'lastContacted' | 'company';
  sortOrder: 'asc' | 'desc';
}

const initialState: ContactState = {
  contacts: [],
  groups: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedGroup: null,
  sortBy: 'name',
  sortOrder: 'asc',
};

// Async thunks
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async () => {
    // TODO: Implement actual API call
    return [];
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newContact;
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (contact: Contact) => {
    return { ...contact, updatedAt: new Date() };
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: string) => {
    return contactId;
  }
);

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedGroup: (state, action: PayloadAction<string | null>) => {
      state.selectedGroup = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'lastContacted' | 'company'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    toggleContactBlock: (state, action: PayloadAction<string>) => {
      const contact = state.contacts.find(c => c.id === action.payload);
      if (contact) {
        contact.isBlocked = !contact.isBlocked;
        contact.updatedAt = new Date();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contacts';
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c.id !== action.payload);
      });
  },
});

export const {
  setSearchQuery,
  setSelectedGroup,
  setSortBy,
  setSortOrder,
  toggleContactBlock,
} = contactSlice.actions;

export default contactSlice.reducer;