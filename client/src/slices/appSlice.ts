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
  isMobile: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentEvent: (state, action: PayloadAction<string | null>) => {
      state.currentEventId = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<string | null>) => {
      state.currentQuestionId = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const { setCurrentEvent, setCurrentQuestion, setIsMobile } = appSlice.actions;
export default appSlice.reducer; 