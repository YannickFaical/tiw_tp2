import { useState, useMemo } from 'react'
import { Question } from './Question'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { motion } from 'framer-motion'

export const EventPanel = () => {
  const [newQuestion, setNewQuestion] = useState('')
  const [showForm, setShowForm] = useState(false)
  
  const currentEvent = useSelector((state: RootState) => {
    return state.events.events.find(e => e.id === state.events.currentEventId)
  })

  const sortedQuestions = useMemo(() => {
    if (!currentEvent) return []
    return [...currentEvent.questions].sort((a, b) => b.votes - a.votes)
  }, [currentEvent])

  if (!currentEvent) {
    return <div>Chargement...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{currentEvent.title}</h1>
        
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showForm ? 'Annuler' : 'Poser une question'}
          </button>
          
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Votre question..."
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
              <button
                onClick={() => {
                  // TODO: Implement question creation
                  setNewQuestion('')
                  setShowForm(false)
                }}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Envoyer
              </button>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          {sortedQuestions.map(question => (
            <Question
              key={question.id}
              question={question}
              eventId={currentEvent.id}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}