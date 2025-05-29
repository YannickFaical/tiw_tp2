import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

import type { AppState, Question } from '../model'



interface QnaContextType {
  state: AppState
  setCurrentEvent: (eventId: string) => void
  upvoteQuestion: (eventId: string, questionId: string) => void
  addQuestion: (eventId: string, question: Question) => void
  socket: WebSocket | null
  isConnected: boolean
}

const QnaContext = createContext<QnaContextType | undefined>(undefined)

export const QnaProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentEventId: '1',
    events: [
      {
        id: '1',
        title: 'Premier événement',
        questions: [
          { id: 'q1', content: 'Première question ?', votes: 3 },
          { id: 'q2', content: 'Deuxième question ?', votes: 1 }
        ]
      }
    ]
  })
  
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const setCurrentEvent = useCallback((eventId: string) => {
    setState(prev => {
      if (prev.currentEventId === eventId) return prev
      const newState = { ...prev, currentEventId: eventId }
      return newState
    })
  }, [])

  const upvoteQuestion = useCallback((eventId: string, questionId: string) => {
    console.log('Upvoting question:', { eventId, questionId })
    
    setState(prevState => {
      const event = prevState.events.find(e => e.id === eventId)
      if (!event) return prevState

      const question = event.questions.find(q => q.id === questionId)
      if (!question) return prevState

      const oldVotes = question.votes
      const newVotes = oldVotes + 1
      console.log('Updating votes for question:', { id: questionId, oldVotes, newVotes })

      const updatedQuestions = event.questions.map(q =>
        q.id === questionId ? { ...q, votes: newVotes } : q
      )

      const updatedEvent = { ...event, questions: updatedQuestions }
      const updatedEvents = prevState.events.map(e =>
        e.id === eventId ? updatedEvent : e
      )

      const newState = {
        ...prevState,
        events: updatedEvents
      }

      // Broadcast the update
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'UPVOTE_QUESTION',
          payload: { eventId, questionId, votes: newVotes }
        }))
      }

      console.log('New state after upvote:', newState)
      return newState
    })
  }, [socket])

  const addQuestion = useCallback((eventId: string, question: Question) => {
    setState(prev => {
      const updatedEvents = prev.events.map(event => {
        if (event.id === eventId) {
          return { ...event, questions: [...event.questions, question] }
        }
        return event
      })
      return { ...prev, events: updatedEvents }
    })
  }, [])

  useEffect(() => {
    if (isConnected) {
      console.log('WebSocket connected, ready to receive updates')
    }
  }, [isConnected])

  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket('ws://172.20.10.2:3001')
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setReconnectAttempt(0)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        setTimeout(() => {
          setReconnectAttempt(prev => prev + 1)
        }, 5000)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }

      ws.onmessage = (event) => {
        try {
          const action = JSON.parse(event.data)
          console.log('Received WebSocket message:', action)
          if (action.type === 'STATE_UPDATE') {
            // Compare the new state with current state before updating
            const currentState = stateRef.current
            if (JSON.stringify(currentState) !== JSON.stringify(action.payload)) {
              console.log('State update needed, applying changes')
              setState(action.payload)
            } else {
              console.log('State unchanged, skipping update')
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      setSocket(ws)
    } catch (error) {
      console.error('Error creating WebSocket:', error)
      setIsConnected(false)
    }
  }, [])

  useEffect(() => {
    connectWebSocket()
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [reconnectAttempt, connectWebSocket])

  return (
    <QnaContext.Provider value={{
      state,
      setCurrentEvent,
      upvoteQuestion,
      addQuestion,
      socket,
      isConnected
    }}>
      {children}
    </QnaContext.Provider>
  )
}

export const useQna = () => {
  const context = useContext(QnaContext)
  if (context === undefined) {
    throw new Error('useQna must be used within a QnaProvider')
  }
  return context
}