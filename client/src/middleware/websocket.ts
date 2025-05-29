import type { Middleware } from 'redux'
import { setEvents } from '../slices/eventsSlice'
import type { AnyAction } from '@reduxjs/toolkit'

let socket: WebSocket | null = null
let reconnectAttempt = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 3000

export const createWebSocketMiddleware = (): Middleware => {
  return store => {
    const connectWebSocket = () => {
      if (socket?.readyState === WebSocket.OPEN) return

      const wsUrl = `ws://${window.location.hostname}:3001`
      console.log('Connecting to WebSocket server:', wsUrl)
      
      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        console.log('WebSocket connected')
        reconnectAttempt = 0
      }

      socket.onclose = () => {
        console.log('WebSocket disconnected')
        socket = null
        
        if (reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempt++
          console.log(`Attempting to reconnect (${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS})...`)
          setTimeout(connectWebSocket, RECONNECT_DELAY)
        }
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('Received WebSocket message:', data)
          
          if (data.type === 'STATE_UPDATE') {
            store.dispatch(setEvents(data.payload.events))
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
    }

    // Connect to WebSocket when the middleware is initialized
    connectWebSocket()

    return next => (action: unknown) => {
      // Handle outgoing WebSocket messages
      if (typeof action === 'object' && action !== null && 'type' in action && action.type === 'events/upvoteQuestion' && socket?.readyState === WebSocket.OPEN) {
        const { eventId, questionId } = (action as AnyAction).payload
        socket.send(JSON.stringify({
          type: 'UPVOTE_QUESTION',
          eventId,
          questionId
        }))
      }

      return next(action)
    }
  }
} 