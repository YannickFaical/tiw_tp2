import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { Event, Question, Answer } from '../types'

interface EventsState {
  events: Event[]
  currentEventId: string | null
  currentQuestionId: string | null
}

const initialState: EventsState = {
  events: [],
  currentEventId: null,
  currentQuestionId: null
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      console.log('setEvents - Setting events:', action.payload)
      state.events = action.payload
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      console.log('addEvent - Adding event:', action.payload)
      const existingEvent = state.events.find(e => e.id === action.payload.id)
      if (!existingEvent) {
        state.events.push(action.payload)
        state.currentEventId = action.payload.id
      } else {
        console.log('addEvent - Event already exists:', action.payload.id)
      }
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = action.payload
      } else {
        console.warn(`updateEvent - Event not found: ${action.payload.id}`)
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(e => e.id !== action.payload)
      if (state.currentEventId === action.payload) {
        state.currentEventId = null
        state.currentQuestionId = null
      }
    },
    setCurrentEvent: (state, action: PayloadAction<string | null>) => {
      state.currentEventId = action.payload
      state.currentQuestionId = null
    },
    setCurrentQuestion: (state, action: PayloadAction<string | null>) => {
      state.currentQuestionId = action.payload
    },
    addQuestion: (state, action: PayloadAction<{ eventId: string; question: Question }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId)
      if (event) {
        event.questions = event.questions || []
        const existingQuestion = event.questions.find(q => q.id === action.payload.question.id)
        if (!existingQuestion) {
          event.questions.push(action.payload.question)
          state.currentQuestionId = action.payload.question.id
        } else {
          console.log('addQuestion - Question already exists:', action.payload.question.id)
        }
      } else {
        console.warn(`addQuestion - Event not found: ${action.payload.eventId}`)
      }
    },
    updateQuestion: (state, action: PayloadAction<{ eventId: string; question: Question }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId)
      if (event) {
        const index = event.questions.findIndex(q => q.id === action.payload.question.id)
        if (index !== -1) {
          event.questions[index] = action.payload.question
        } else {
          console.warn(`updateQuestion - Question not found: ${action.payload.question.id}`)
        }
      } else {
        console.warn(`updateQuestion - Event not found: ${action.payload.eventId}`)
      }
    },
    deleteQuestion: (state, action: PayloadAction<{ eventId: string; questionId: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId)
      if (event) {
        event.questions = event.questions.filter(q => q.id !== action.payload.questionId)
        if (state.currentQuestionId === action.payload.questionId) {
          state.currentQuestionId = null
        }
      } else {
        console.warn(`deleteQuestion - Event not found: ${action.payload.eventId}`)
      }
    },
    upvoteQuestion: (state, action: PayloadAction<{ eventId: string; questionId: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId)
      const question = event?.questions.find(q => q.id === action.payload.questionId)
      if (question) {
        question.votes += 1
      } else {
        console.warn(`upvoteQuestion - Question not found: ${action.payload.questionId}`)
      }
    },
    addAnswer: (state, action: PayloadAction<{ eventId: string; questionId: string; answer: Answer }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId)
      const question = event?.questions.find(q => q.id === action.payload.questionId)
      if (question) {
        question.answers = question.answers || []
        const existingAnswer = question.answers.find(a => a.id === action.payload.answer.id)
        if (!existingAnswer) {
          question.answers.push(action.payload.answer)
        } else {
          console.log('addAnswer - Answer already exists:', action.payload.answer.id)
        }
      } else {
        console.warn(`addAnswer - Question not found: ${action.payload.questionId}`)
      }
    }
  }
})

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
  upvoteQuestion,
  addAnswer
} = eventsSlice.actions

export const selectEvents = (state: RootState) => state.events.events
export const selectCurrentEvent = (state: RootState) =>
  state.events.events.find(e => e.id === state.events.currentEventId) || null
export const selectCurrentQuestion = (state: RootState) => {
  const event = selectCurrentEvent(state)
  return event?.questions.find(q => q.id === state.events.currentQuestionId) || null
}

export default eventsSlice.reducer
