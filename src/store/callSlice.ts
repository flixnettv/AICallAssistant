import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CallLog, CallerInfo } from '../types';

interface CallState {
  callLogs: CallLog[];
  currentCall: CallLog | null;
  callerInfo: Record<string, CallerInfo>;
  loading: boolean;
  error: string | null;
}

const initialState: CallState = {
  callLogs: [],
  currentCall: null,
  callerInfo: {},
  loading: false,
  error: null,
};

export const fetchCallLogs = createAsyncThunk(
  'calls/fetchCallLogs',
  async () => {
    // TODO: Implement actual API call
    return [];
  }
);

export const addCallLog = createAsyncThunk(
  'calls/addCallLog',
  async (callLog: Omit<CallLog, 'id'>) => {
    const newCallLog: CallLog = {
      ...callLog,
      id: Date.now().toString(),
    };
    return newCallLog;
  }
);

export const updateCallLog = createAsyncThunk(
  'calls/updateCallLog',
  async (callLog: CallLog) => {
    return callLog;
  }
);

export const fetchCallerInfo = createAsyncThunk(
  'calls/fetchCallerInfo',
  async (phoneNumber: string) => {
    // TODO: Implement actual API call for caller ID
    return {
      phoneNumber,
      name: 'Unknown',
      company: '',
      location: '',
      spamScore: 0,
      isVerified: false,
      lastSeen: new Date(),
      reportCount: 0,
    } as CallerInfo;
  }
);

const callSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    setCurrentCall: (state, action: PayloadAction<CallLog | null>) => {
      state.currentCall = action.payload;
    },
    updateCallDuration: (state, action: PayloadAction<number>) => {
      if (state.currentCall) {
        state.currentCall.duration = action.payload;
      }
    },
    setCallRecording: (state, action: PayloadAction<{ callId: string; isRecording: boolean; path?: string }>) => {
      const call = state.callLogs.find(c => c.id === action.payload.callId);
      if (call) {
        call.isRecorded = action.payload.isRecording;
        if (action.payload.path) {
          call.recordingPath = action.payload.path;
        }
      }
    },
    addSpamReport: (state, action: PayloadAction<{ phoneNumber: string; reportType: 'call' | 'sms' | 'both' }>) => {
      const { phoneNumber, reportType } = action.payload;
      if (state.callerInfo[phoneNumber]) {
        state.callerInfo[phoneNumber].reportCount += 1;
        state.callerInfo[phoneNumber].spamScore = Math.min(1, state.callerInfo[phoneNumber].spamScore + 0.1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.callLogs = action.payload;
      })
      .addCase(fetchCallLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch call logs';
      })
      .addCase(addCallLog.fulfilled, (state, action) => {
        state.callLogs.unshift(action.payload);
      })
      .addCase(updateCallLog.fulfilled, (state, action) => {
        const index = state.callLogs.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.callLogs[index] = action.payload;
        }
      })
      .addCase(fetchCallerInfo.fulfilled, (state, action) => {
        state.callerInfo[action.payload.phoneNumber] = action.payload;
      });
  },
});

export const {
  setCurrentCall,
  updateCallDuration,
  setCallRecording,
  addSpamReport,
} = callSlice.actions;

export default callSlice.reducer;