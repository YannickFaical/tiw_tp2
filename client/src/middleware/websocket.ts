import type { Middleware } from 'redux'
import { setEvents, addEvent, updateEvent, deleteEvent, addQuestion, updateQuestion, deleteQuestion, upvoteQuestion } from '../slices/eventsSlice'
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
      console.log('[WebSocket] Connecting to:', wsUrl)

      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        console.log('[WebSocket] Connected')
        reconnectAttempt = 0
      }

      socket.onclose = () => {
        console.log('[WebSocket] Disconnected')
        socket = null
        if (reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempt++
          console.log(`[WebSocket] Reconnecting attempt ${reconnectAttempt}...`)
          setTimeout(connectWebSocket, RECONNECT_DELAY)
        }
      }

      socket.onerror = error => {
        console.error('[WebSocket] Error:', error)
      }

      socket.onmessage = event => {
        try {
          const data = JSON.parse(event.data)
          console.log('[WebSocket] Message received:', data)

          // Ici, on traite tous les types d’actions serveur et on les dispatch
          switch (data.type) {
            case 'STATE_UPDATE':
              store.dispatch(setEvents(data.payload.events))
              break

            case 'ADD_EVENT':
              store.dispatch(addEvent(data.payload))
              break

            case 'UPDATE_EVENT':
              store.dispatch(updateEvent(data.payload))
              break

            case 'DELETE_EVENT':
              store.dispatch(deleteEvent(data.payload))
              break

            case 'ADD_QUESTION':
              store.dispatch(addQuestion(data.payload))
              break

            case 'UPDATE_QUESTION':
              store.dispatch(updateQuestion(data.payload))
              break

            case 'DELETE_QUESTION':
              store.dispatch(deleteQuestion(data.payload))
              break

            case 'UPVOTE_QUESTION':
              store.dispatch(upvoteQuestion(data.payload))
              break

            default:
              console.warn('[WebSocket] Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error)
        }
      }
    }

    connectWebSocket()

    return next => (action: AnyAction) => {
      const result = next(action)

      // Envoi au serveur uniquement les actions que tu veux synchroniser
      const syncActionTypes = [
        'events/addEvent',
        'events/updateEvent',
        'events/deleteEvent',
        'events/addQuestion',
        'events/updateQuestion',
        'events/deleteQuestion',
        'events/upvoteQuestion',
      ]

      if (
        socket?.readyState === WebSocket.OPEN &&
        syncActionTypes.includes(action.type)
      ) {
        console.log('[WebSocket] Sending action to server:', action)
        socket.send(JSON.stringify({
          type: action.type.toUpperCase(), // Par exemple: EVENTS/ADD_EVENT => EVENTS/ADD_EVENT en majuscule, tu peux adapter
          payload: action.payload
        }))
      }

      return result
    }
  }
}
