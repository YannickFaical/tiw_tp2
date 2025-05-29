import { useQna } from '../context/QnaContext'
import { QuestionComponent } from './Question'
//import Question from '../components/Question'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export const EventPanel = () => {
  const { state, isConnected } = useQna()
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  
  const currentEvent = useMemo(() => 
    state.events.find(e => e.id === state.currentEventId),
    [state.events, state.currentEventId]
  )

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !currentEvent) return
    
    // TODO: Implement addQuestion functionality
    setNewQuestion('')
    setIsAddingQuestion(false)
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connexion au serveur en cours...</p>
        </div>
      </div>
    )
  }

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Sélectionnez un événement pour commencer</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentEvent.title}</h2>
        <p className="text-gray-500">Posez vos questions et votez pour les plus pertinentes</p>
      </motion.div>

      <div className="mb-6">
        {!isAddingQuestion ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddingQuestion(true)}
            className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Poser une question</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Écrivez votre question ici..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsAddingQuestion(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Envoyer
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        <div className="space-y-4">
          {currentEvent.questions.map(q => (
            <QuestionComponent key={q.id} question={q} eventId={currentEvent.id} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}