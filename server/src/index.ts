import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import type { Event, Question } from './types'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // URL du client Vite
    methods: ["GET", "POST"],
    credentials: true
  }
})

app.use(cors())

let state = {
  events: [] as Event[]
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Envoyer l'état initial au nouveau client
  socket.emit('state', state)

  socket.on('action', (msg) => {
    console.log('Action received from client:', socket.id, msg)
    
    // Mettre à jour l'état si nécessaire
    switch (msg.type) {
      case 'events/addEvent':
        state.events.push(msg.payload as Event)
        break
      case 'events/updateEvent':
        const eventIndex = state.events.findIndex(e => e.id === (msg.payload as Event).id)
        if (eventIndex !== -1) {
          state.events[eventIndex] = msg.payload as Event
        }
        break
      case 'events/deleteEvent':
        state.events = state.events.filter(e => e.id !== msg.payload)
        break
      case 'events/addQuestion':
        const { eventId, question } = msg.payload as { eventId: string; question: Question }
        const event = state.events.find(e => e.id === eventId)
        if (event) {
          event.questions = event.questions || []
          event.questions.push(question)
        }
        break
      case 'events/updateQuestion':
        const { eventId: updateEventId, question: updateQuestion } = msg.payload as { eventId: string; question: Question }
        const updateEvent = state.events.find(e => e.id === updateEventId)
        if (updateEvent) {
          const questionIndex = updateEvent.questions.findIndex(q => q.id === updateQuestion.id)
          if (questionIndex !== -1) {
            updateEvent.questions[questionIndex] = updateQuestion
          }
        }
        break
      case 'events/deleteQuestion':
        const { eventId: deleteEventId, questionId } = msg.payload as { eventId: string; questionId: string }
        const deleteEvent = state.events.find(e => e.id === deleteEventId)
        if (deleteEvent) {
          deleteEvent.questions = deleteEvent.questions.filter(q => q.id !== questionId)
        }
        break
      case 'events/upvoteQuestion':
        const { eventId: voteEventId, questionId: voteQuestionId } = msg.payload as { eventId: string; questionId: string }
        const voteEvent = state.events.find(e => e.id === voteEventId)
        if (voteEvent) {
          const voteQuestion = voteEvent.questions.find(q => q.id === voteQuestionId)
          if (voteQuestion) {
            voteQuestion.votes += 1
          }
        }
        break
    }

    // Envoyer l'action à tous les clients sauf l'émetteur
    socket.broadcast.emit('action', {
      ...msg,
      source: socket.id
    })
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
