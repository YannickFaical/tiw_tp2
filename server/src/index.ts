import { WebSocketServer } from 'ws'

interface Question {
  id: string
  content: string
  votes: number
}

interface Event {
  id: string
  title: string
  questions: Question[]
}

// État initial de l'application
const initialState = {
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
}

// Création du serveur WebSocket
const wss = new WebSocketServer({ port: 3001 })

// Fonction pour diffuser l'état à tous les clients
const broadcastState = () => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'STATE_UPDATE',
        payload: initialState
      }))
    }
  })
}

// Gestion des connexions
wss.on('connection', (ws) => {
  console.log('New client connected')
  
  // Envoi de l'état initial au client
  ws.send(JSON.stringify({
    type: 'STATE_UPDATE',
    payload: initialState
  }))

  // Gestion des messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString())
      console.log('Received message:', data)

      if (data.type === 'UPVOTE_QUESTION') {
        const { eventId, questionId } = data
        const event = initialState.events.find(e => e.id === eventId)
        
        if (event) {
          const question = event.questions.find(q => q.id === questionId)
          if (question) {
            question.votes += 1
            console.log(`Updated votes for question ${questionId}: ${question.votes}`)
            broadcastState()
          }
        }
      }
    } catch (error) {
      console.error('Error processing message:', error)
    }
  })

  // Gestion de la déconnexion
  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

console.log('WebSocket server is running on port 3001')