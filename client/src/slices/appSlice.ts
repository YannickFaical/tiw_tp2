import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  currentEventId: string | null;
  currentQuestionId: string | null;
  isMobile: boolean;
}

const initialState: AppState = {
  currentEventId: null,
  currentQuestionId: null,
  isMobile: false
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentEvent: (state, action: PayloadAction<string | 'next' | 'previous'>) => {
      if (action.payload === 'next' || action.payload === 'previous') {
        // La logique de navigation sera gérée dans le composant qui utilise ce state
        return;
      }
      state.currentEventId = action.payload;
      state.currentQuestionId = null;
    },
    setCurrentQuestion: (state, action: PayloadAction<string | null>) => {
      state.currentQuestionId = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    }
  }
});

export const { setCurrentEvent, setCurrentQuestion, setIsMobile } = appSlice.actions;

export default appSlice.reducer; 