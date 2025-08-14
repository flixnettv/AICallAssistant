import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AICall, AIVoice } from '../types';

interface AIState {
  aiCalls: AICall[];
  availableVoices: AIVoice[];
  currentAICall: AICall | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  aiCalls: [],
  availableVoices: [
    {
      id: 'young-male',
      name: 'Young Male',
      type: 'young-male',
      language: 'en',
      modelPath: 'coqui-tts',
    },
    {
      id: 'young-female',
      name: 'Young Female',
      type: 'young-female',
      language: 'en',
      modelPath: 'coqui-tts',
    },
    {
      id: 'elderly-male',
      name: 'Elderly Male',
      type: 'elderly-male',
      language: 'en',
      modelPath: 'open-tts',
    },
    {
      id: 'elderly-female',
      name: 'Elderly Female',
      type: 'elderly-female',
      language: 'en',
      modelPath: 'open-tts',
    },
    {
      id: 'child-male',
      name: 'Child Male',
      type: 'child-male',
      language: 'en',
      modelPath: 'local-tts',
    },
    {
      id: 'child-female',
      name: 'Child Female',
      type: 'child-female',
      language: 'en',
      modelPath: 'local-tts',
    },
    {
      id: 'deep-scary',
      name: 'Deep & Scary',
      type: 'deep-scary',
      language: 'en',
      modelPath: 'local-tts',
    },
  ],
  currentAICall: null,
  loading: false,
  error: null,
};

export const initiateAICall = createAsyncThunk(
  'ai/initiateAICall',
  async (callData: Omit<AICall, 'id' | 'status'>) => {
    const newAICall: AICall = {
      ...callData,
      id: Date.now().toString(),
      status: 'pending',
    };
    
    // TODO: Implement actual AI call initiation
    return newAICall;
  }
);

export const scheduleAICall = createAsyncThunk(
  'ai/scheduleAICall',
  async (callData: Omit<AICall, 'id' | 'status'> & { scheduledTime: Date }) => {
    const newAICall: AICall = {
      ...callData,
      id: Date.now().toString(),
      status: 'pending',
      scheduledTime: callData.scheduledTime,
    };
    
    return newAICall;
  }
);

export const updateAICallStatus = createAsyncThunk(
  'ai/updateAICallStatus',
  async ({ callId, status, transcript, recordingPath }: {
    callId: string;
    status: AICall['status'];
    transcript?: string;
    recordingPath?: string;
  }) => {
    return { callId, status, transcript, recordingPath };
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setCurrentAICall: (state, action: PayloadAction<AICall | null>) => {
      state.currentAICall = action.payload;
    },
    addVoice: (state, action: PayloadAction<AIVoice>) => {
      state.availableVoices.push(action.payload);
    },
    removeVoice: (state, action: PayloadAction<string>) => {
      state.availableVoices = state.availableVoices.filter(v => v.id !== action.payload);
    },
    updateVoice: (state, action: PayloadAction<AIVoice>) => {
      const index = state.availableVoices.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.availableVoices[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateAICall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateAICall.fulfilled, (state, action) => {
        state.loading = false;
        state.aiCalls.unshift(action.payload);
        state.currentAICall = action.payload;
      })
      .addCase(initiateAICall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initiate AI call';
      })
      .addCase(scheduleAICall.fulfilled, (state, action) => {
        state.aiCalls.unshift(action.payload);
      })
      .addCase(updateAICallStatus.fulfilled, (state, action) => {
        const call = state.aiCalls.find(c => c.id === action.payload.callId);
        if (call) {
          call.status = action.payload.status;
          if (action.payload.transcript) {
            call.transcript = action.payload.transcript;
          }
          if (action.payload.recordingPath) {
            call.recordingPath = action.payload.recordingPath;
          }
        }
        
        if (state.currentAICall?.id === action.payload.callId) {
          state.currentAICall.status = action.payload.status;
          if (action.payload.transcript) {
            state.currentAICall.transcript = action.payload.transcript;
          }
          if (action.payload.recordingPath) {
            state.currentAICall.recordingPath = action.payload.recordingPath;
          }
        }
      });
  },
});

export const {
  setCurrentAICall,
  addVoice,
  removeVoice,
  updateVoice,
} = aiSlice.actions;

export default aiSlice.reducer;