import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from '../slices/eventsSlice'
import { createWebSocketMiddleware } from '../middleware/websocket'

export const store = configureStore({
  reducer: {
    events: eventsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createWebSocketMiddleware())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 