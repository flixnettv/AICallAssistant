import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserSettings } from '../types';

interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    id: 'default',
    language: 'en',
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
  },
  loading: false,
  error: null,
};

export const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async () => {
    // TODO: Load settings from AsyncStorage or API
    return initialState.settings;
  }
);

export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async (settings: Partial<UserSettings>) => {
    // TODO: Save settings to AsyncStorage or API
    return settings;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.settings.language = action.payload;
    },
    updateTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.settings.theme = action.payload;
    },
    updateNotificationSetting: (state, action: PayloadAction<{
      key: keyof UserSettings['notifications'];
      value: boolean;
    }>) => {
      const { key, value } = action.payload;
      state.settings.notifications[key] = value;
    },
    updatePrivacySetting: (state, action: PayloadAction<{
      key: keyof UserSettings['privacy'];
      value: boolean;
    }>) => {
      const { key, value } = action.payload;
      state.settings.privacy[key] = value;
    },
    updateAISetting: (state, action: PayloadAction<{
      key: keyof UserSettings['ai'];
      value: boolean | string;
    }>) => {
      const { key, value } = action.payload;
      (state.settings.ai as any)[key] = value;
    },
    resetSettings: (state) => {
      state.settings = initialState.settings;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load settings';
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
      });
  },
});

export const {
  updateLanguage,
  updateTheme,
  updateNotificationSetting,
  updatePrivacySetting,
  updateAISetting,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;