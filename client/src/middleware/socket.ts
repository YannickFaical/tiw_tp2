import type { Middleware } from 'redux'
import { default as io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { setEvents, addEvent, updateEvent, deleteEvent, addQuestion, updateQuestion, deleteQuestion, upvoteQuestion } from '../slices/eventsSlice'
import type { RootState } from '../store'
import type { AnyAction } from '@reduxjs/toolkit'
import type { Event, Question } from '../types'

let socket: Socket | null = null

export const createSocketMiddleware = (): Middleware => {
  return store => {
    if (!socket) {
      const host = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname
      console.log('Connecting to WebSocket server at:', `http://${host}:3001`)
      socket = io(`http://${host}:3001`)

      socket.on('connect', () => {
        console.log('Connected to WebSocket server')
      })

      socket.on('state', (state: { events: Event[] }) => {
        console.log('Received initial state:', state)
        store.dispatch(setEvents(state.events))
      })

      socket.on('action', (message: { type: string; payload: unknown; meta?: { fromServer: boolean } }) => {
        if (message.meta?.fromServer) {
          console.log('Ignoring server action:', message)
          return
        }

        console.log('Received action:', message)
        switch (message.type) {
          case 'events/setEvents':
            store.dispatch(setEvents(message.payload as Event[]))
            break
          case 'events/addEvent':
            console.log('Dispatching addEvent with payload:', message.payload)
            store.dispatch(addEvent(message.payload as Event))
            break
          case 'events/updateEvent':
            store.dispatch(updateEvent(message.payload as Event))
            break
          case 'events/deleteEvent':
            store.dispatch(deleteEvent(message.payload as string))
            break
          case 'events/addQuestion':
            store.dispatch(addQuestion(message.payload as { eventId: string; question: Question }))
            break
          case 'events/updateQuestion':
            store.dispatch(updateQuestion(message.payload as { eventId: string; question: Question }))
            break
          case 'events/deleteQuestion':
            store.dispatch(deleteQuestion(message.payload as { eventId: string; questionId: string }))
            break
          case 'events/upvoteQuestion':
            store.dispatch(upvoteQuestion(message.payload as { eventId: string; questionId: string }))
            break
        }
      })
    }

    return next => (action: unknown) => {
      const result = next(action)
      const state = store.getState() as RootState

      if (socket && 
          typeof action === 'object' && 
          action !== null && 
          'type' in action && 
          (action as AnyAction).type.startsWith('events/') &&
          !(action as AnyAction).meta?.fromServer) {
        console.log('Sending action to server:', action)
        socket.emit('action', {
          ...action,
          meta: { fromServer: true }
        })
      }

      return result
    }
  }
} 