import { configureStore } from '@reduxjs/toolkit';
import contactReducer from './contactSlice';
import callReducer from './callSlice';
import aiReducer from './aiSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    contacts: contactReducer,
    calls: callReducer,
    ai: aiReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;