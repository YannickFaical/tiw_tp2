import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Event, Question } from '../types';

interface EventsState {
  events: Event[];
  currentEventId: string | null;
  currentQuestionId: string | null;
}

const initialState: EventsState = {
  events: [],
  currentEventId: null,
  currentQuestionId: null
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      const existingEvent = state.events.find((e: Event) => e.id === action.payload.id);
      if (!existingEvent) {
        state.events.push(action.payload);
        state.currentEventId = action.payload.id;
      }
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex((e: Event) => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((e: Event) => e.id !== action.payload);
      if (state.currentEventId === action.payload) {
        state.currentEventId = null;
        state.currentQuestionId = null;
      }
    },
    setCurrentEvent: (state, action: PayloadAction<string | null>) => {
      state.currentEventId = action.payload;
      state.currentQuestionId = null;
    },
    setCurrentQuestion: (state, action: PayloadAction<string | null>) => {
      state.currentQuestionId = action.payload;
    },
    addQuestion: (state, action: PayloadAction<{ eventId: string; question: Question }>) => {
      const event = state.events.find((e: Event) => e.id === action.payload.eventId);
      if (event) {
        event.questions = event.questions || [];
        const existingQuestion = event.questions.find((q: Question) => q.id === action.payload.question.id);
        if (!existingQuestion) {
          event.questions.push(action.payload.question);
          state.currentQuestionId = action.payload.question.id;
        }
      }
    },
    updateQuestion: (state, action: PayloadAction<{ eventId: string; question: Question }>) => {
      const event = state.events.find((e: Event) => e.id === action.payload.eventId);
      if (event) {
        const index = event.questions.findIndex((q: Question) => q.id === action.payload.question.id);
        if (index !== -1) {
          event.questions[index] = action.payload.question;
        }
      }
    },
    deleteQuestion: (state, action: PayloadAction<{ eventId: string; questionId: string }>) => {
      const event = state.events.find((e: Event) => e.id === action.payload.eventId);
      if (event) {
        event.questions = event.questions.filter((q: Question) => q.id !== action.payload.questionId);
        if (state.currentQuestionId === action.payload.questionId) {
          state.currentQuestionId = null;
        }
      }
    },
    upvoteQuestion: (state, action: PayloadAction<{ eventId: string; questionId: string }>) => {
      const event = state.events.find((e: Event) => e.id === action.payload.eventId);
      const question = event?.questions.find((q: Question) => q.id === action.payload.questionId);
      if (question) {
        question.votes += 1;
      }
    }
  }
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setCurrentEvent,
  setCurrentQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  upvoteQuestion
} = eventsSlice.actions;

export const selectEvents = (state: RootState) => state.events.events;
export const selectCurrentEvent = (state: RootState) =>
  state.events.events.find((e: Event) => e.id === state.events.currentEventId) || null;
export const selectCurrentQuestion = (state: RootState) => {
  const event = selectCurrentEvent(state);
  return event?.questions.find((q: Question) => q.id === state.events.currentQuestionId) || null;
};

export default eventsSlice.reducer; 