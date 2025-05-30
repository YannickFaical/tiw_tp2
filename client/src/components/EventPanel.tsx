import { useState, useMemo, useEffect, useRef } from 'react'
import { Question } from './Question'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { motion } from 'framer-motion'
import { addQuestion } from '../slices/eventsSlice'

export const EventPanel = () => {
  const dispatch = useDispatch()
  const [newQuestion, setNewQuestion] = useState('')
  const [showForm, setShowForm] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const currentEvent = useSelector((state: RootState) => {
    return state.events.events.find(e => e.id === state.events.currentEventId)
  })

  const sortedQuestions = useMemo(() => {
    if (!currentEvent) return []
    return [...currentEvent.questions].sort((a, b) => b.votes - a.votes)
  }, [currentEvent])

  useEffect(() => {
    if (showForm && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [showForm])

  if (!currentEvent) {
    return <div>Chargement...</div>
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return

    const questionPayload = {
      eventId: currentEvent.id,
      question: {
        id: `q${Date.now()}`,
        content: newQuestion.trim(),
        votes: 0,
        createdAt: new Date().toISOString()
      }
    }

    dispatch(addQuestion(questionPayload))
    setNewQuestion('')
    setShowForm(false)
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
            aria-label={showForm ? 'Annuler la question' : 'Poser une question'}
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
                ref={textareaRef}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Votre question..."
                className="w-full p-2 border rounded-lg"
                rows={3}
                aria-label="Nouvelle question"
              />
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim()}
                className="mt-2 bg-green-500 disabled:bg-green-300 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
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
