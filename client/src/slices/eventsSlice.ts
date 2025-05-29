import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Question, Event, AppState } from '../model'

export interface EventsState {
  events: Event[]
  currentEventId: string | null
}

const initialState: EventsState = {
  events: [],
  currentEventId: null
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload
    },
    setCurrentEvent: (state, action: PayloadAction<string>) => {
      state.currentEventId = action.payload
    },
    upvoteQuestion: (state, action: PayloadAction<{ eventId: string; questionId: string }>) => {
      const { eventId, questionId } = action.payload
      const event = state.events.find(e => e.id === eventId)
      if (event) {
        const question = event.questions.find(q => q.id === questionId)
        if (question) {
          question.votes += 1
        }
      }
    },
    createQuestion: (state, action: PayloadAction<{ eventId: string, question: Question }>) => {
      const { eventId, question } = action.payload
      const event = state.events.find(e => e.id === eventId)
      if (event) {
        event.questions.push(question)
      }
    },
    updateState: (state, action: PayloadAction<AppState>) => {
      return action.payload
    }
  }
})

export const { setEvents, setCurrentEvent, upvoteQuestion, createQuestion, updateState } = eventsSlice.actions
export default eventsSlice.reducer 