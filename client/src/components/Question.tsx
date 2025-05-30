import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { upvoteQuestion } from '../slices/eventsSlice'
import type { Question as QuestionType } from '../model'
import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'

interface Props {
  question: QuestionType
  eventId: string
}

export const Question = ({ question, eventId }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const handleVote = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      await dispatch(upvoteQuestion({ eventId, questionId: question.id })).unwrap()
    } catch (e) {
      console.error('Erreur lors du vote', e)
    }
    setLoading(false)
  }, [dispatch, eventId, question.id, loading])

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 mb-4"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-800 text-lg">{question.content}</p>
          {question.author && (
            <p className="text-gray-500 text-sm mt-2">Par {question.author}</p>
          )}
        </div>
        <motion.button
          aria-label={`Voter pour la question: ${question.content}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          onClick={handleVote}
          disabled={loading}
        >
          <span>👍</span>
          <motion.span
            key={question.votes}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {question.votes}
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  )
}
