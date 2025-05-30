import { configureStore } from '@reduxjs/toolkit'
import loggerMiddleware from '../middleware/loggerMiddleware'
import { socketMiddleware } from '../middleware/socketMiddleware'
import appReducer from '../slices/appSlice'
import eventsReducer from '../slices/eventsSlice'

// Configuration du store
export const store = configureStore({
  reducer: {
    app: appReducer,
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware, socketMiddleware)
 // devTools: process.env.NODE_ENV !== 'production'
})

// Types pour l'utilisation dans l'application
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
